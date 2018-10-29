"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = queries;

/* eslint-disable no-param-reassign, prefer-template */
function queries(relayRequestList, fetchWithMiddleware) {
  return Promise.all(relayRequestList.map(function (relayRequest) {
    var req = {
      relayReqId: relayRequest.getID(),
      relayReqObj: relayRequest,
      relayReqType: 'query',
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: relayRequest.getID(),
        query: relayRequest.getQueryString(),
        variables: relayRequest.getVariables()
      })
    };
    return fetchWithMiddleware(req).then(function (_ref) {
      var data = _ref.data;
      return relayRequest.resolve({
        response: data
      });
    }).catch(function (err) {
      return relayRequest.reject(err);
    });
  }));
}