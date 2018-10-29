"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = batchMiddleware;

var _utils = require("../utils");

/* eslint-disable no-param-reassign */
// Max out at roughly 100kb (express-graphql imposed max)
var DEFAULT_BATCH_SIZE = 102400;

function batchMiddleware(options) {
  var opts = options || {};
  var batchTimeout = opts.batchTimeout || 0; // 0 is the same as nextTick in nodeJS

  var allowMutations = opts.allowMutations || false;
  var batchUrl = opts.batchUrl || '/graphql/batch';
  var maxBatchSize = opts.maxBatchSize || DEFAULT_BATCH_SIZE;
  var singleton = {};
  return function (next) {
    return function (req) {
      // do not batch mutations unless allowMutations = true
      if (req.relayReqType === 'mutation' && !allowMutations) {
        return next(req);
      }

      return passThroughBatch(req, next, {
        batchTimeout: batchTimeout,
        batchUrl: batchUrl,
        singleton: singleton,
        maxBatchSize: maxBatchSize
      });
    };
  };
}

function passThroughBatch(req, next, opts) {
  var singleton = opts.singleton; // req.body as FormData can not be batched!

  if (global.FormData && req.body instanceof FormData) {
    return next(req);
  }

  var bodyLength = req.body.length;

  if (!bodyLength) {
    return next(req);
  }

  if (!singleton.batcher || !singleton.batcher.acceptRequests) {
    singleton.batcher = prepareNewBatcher(next, opts);
  }

  if (singleton.batcher.bodySize + bodyLength + 1 > opts.maxBatchSize) {
    singleton.batcher = prepareNewBatcher(next, opts);
  } // +1 accounts for tailing comma after joining


  singleton.batcher.bodySize += bodyLength + 1; // queue request

  return new Promise(function (resolve, reject) {
    var relayReqId = req.relayReqId;
    var requestMap = singleton.batcher.requestMap;
    var requestWrapper = {
      req: req,
      completeOk: function completeOk(res) {
        requestWrapper.done = true;
        resolve(res);
        requestWrapper.duplicates.forEach(function (r) {
          return r.completeOk(res);
        });
      },
      completeErr: function completeErr(err) {
        requestWrapper.done = true;
        reject(err);
        requestWrapper.duplicates.forEach(function (r) {
          return r.completeErr(err);
        });
      },
      done: false,
      duplicates: []
    };

    if (requestMap[relayReqId]) {
      /*
        I've run into a scenario with Relay Classic where if you have 2 components
        that make the exact same query, Relay will dedup the queries and reuse
        the request ids but still make 2 requests. The batch code then loses track
        of all the duplicate requests being made and never resolves or rejects
        the duplicate requests
        https://github.com/nodkz/react-relay-network-layer/pull/52
      */
      requestMap[relayReqId].duplicates.push(requestWrapper);
    } else {
      requestMap[relayReqId] = requestWrapper;
    }
  });
}

function prepareNewBatcher(next, opts) {
  var batcher = {
    bodySize: 2,
    // account for '[]'
    requestMap: {},
    acceptRequests: true
  };
  setTimeout(function () {
    batcher.acceptRequests = false;

    try {
      sendRequests(batcher.requestMap, next, opts).then(function () {
        return finalizeUncompleted(batcher.requestMap);
      }).catch(function () {
        return finalizeUncompleted(batcher.requestMap);
      });
    } catch (e) {
      finalizeUncompleted(batcher.requestMap, e);
    }
  }, opts.batchTimeout);
  return batcher;
}

function sendRequests(requestMap, next, opts) {
  var ids = Object.keys(requestMap);

  if (ids.length === 1) {
    // SEND AS SINGLE QUERY
    var request = requestMap[ids[0]];
    return next(request.req).then(function (res) {
      request.completeOk(res);
      request.duplicates.forEach(function (r) {
        return r.completeOk(res);
      });
    });
  } else if (ids.length > 1) {
    // SEND AS BATCHED QUERY
    // $FlowFixMe
    var url = (0, _utils.isFunction)(opts.batchUrl) ? opts.batchUrl(requestMap) : opts.batchUrl;
    var req = {
      url: url,
      relayReqId: "BATCH_QUERY:".concat(ids.join(':')),
      relayReqMap: requestMap,
      relayReqType: 'batch-query',
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      body: "[".concat(ids.map(function (id) {
        return requestMap[id].req.body;
      }).join(','), "]")
    };
    return next(req).then(function (batchResponse) {
      var payload = batchResponse ? batchResponse.payload : null;

      if (!Array.isArray(payload)) {
        throw new Error('Wrong response from server');
      }

      var responseHasIds = payload.every(function (response) {
        return response.id;
      });

      if (!responseHasIds && ids.length !== payload.length) {
        throw new Error("Server returned a different number of responses than requested.\n            It's not possible to correlate requests and responses");
      }

      payload.forEach(function (res, i) {
        if (!res) return;
        var request = responseHasIds ? requestMap[res.id] : requestMap[ids[i]];

        if (request) {
          var responsePayload = copyBatchResponse(batchResponse, res);
          request.completeOk(responsePayload);
        }
      });
    }).catch(function (e) {
      ids.forEach(function (id) {
        requestMap[id].completeErr(e);
      });
    });
  }

  return Promise.resolve();
} // check that server returns responses for all requests


function finalizeUncompleted(requestMap, e) {
  Object.keys(requestMap).forEach(function (id) {
    var request = requestMap[id];

    if (!request.done) {
      request.completeErr(e || new Error("Server does not return response for request with id ".concat(id, " \n") + "Response should have following shape { \"id\": \"".concat(id, "\", \"data\": {} }")));
    }
  });
}

function copyBatchResponse(batchResponse, res) {
  // Fallback for graphql-graphene and apollo-server batch responses
  var payload = res.payload || res;
  return {
    ok: batchResponse.ok,
    status: batchResponse.status,
    statusText: batchResponse.statusText,
    url: batchResponse.url,
    headers: batchResponse.headers,
    payload: payload
  };
}