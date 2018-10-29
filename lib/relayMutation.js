"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mutation;

/* eslint-disable no-param-reassign, no-use-before-define, prefer-template */
function mutation(relayRequest, fetchWithMiddleware) {
  var commonReq = {
    method: 'POST',
    relayReqId: relayRequest.getID ? relayRequest.getID() : "mutation".concat(Math.random()),
    relayReqObj: relayRequest,
    relayReqType: 'mutation'
  };
  var req;

  if (hasFiles(relayRequest)) {
    req = mutationWithFiles(commonReq, relayRequest);
  } else {
    req = mutationWithoutFiles(commonReq, relayRequest);
  }

  return fetchWithMiddleware(req).then(function (_ref) {
    var data = _ref.data;
    return relayRequest.resolve({
      response: data
    });
  }).catch(function (err) {
    return relayRequest.reject(err);
  });
}

function hasFiles(relayRequest) {
  return !!(relayRequest.getFiles && relayRequest.getFiles());
}

function mutationWithFiles(req, relayRequest) {
  req.headers = {};

  if (hasFiles(relayRequest)) {
    var files = relayRequest.getFiles();

    if (!global.FormData) {
      throw new Error('Uploading files without `FormData` not supported.');
    }

    var formData = new FormData();
    formData.append('id', req.relayReqId);
    formData.append('query', relayRequest.getQueryString());
    formData.append('variables', JSON.stringify(relayRequest.getVariables()));

    if (files) {
      Object.keys(files).forEach(function (filename) {
        if (Array.isArray(files[filename])) {
          files[filename].forEach(function (file) {
            formData.append(filename, file);
          });
        } else {
          formData.append(filename, files[filename]);
        }
      });
    }

    req.body = formData;
  }

  return req;
}

function mutationWithoutFiles(req, relayRequest) {
  req.headers = {
    Accept: '*/*',
    'Content-Type': 'application/json'
  };
  req.body = JSON.stringify({
    id: req.relayReqId,
    query: relayRequest.getQueryString(),
    variables: relayRequest.getVariables()
  });
  return req;
}