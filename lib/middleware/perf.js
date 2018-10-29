"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = performanceMiddleware;

/* eslint-disable no-console */
function performanceMiddleware(opts) {
  var logger = opts && opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  return function (next) {
    return function (req) {
      // get query name here, because `req` can be changed after `next()` call
      var query = "".concat(req.relayReqType, " ").concat(req.relayReqId);
      var start = new Date().getTime();
      return next(req).then(function (res) {
        var end = new Date().getTime();
        logger("".concat(query, ": ").concat(end - start, "ms"));
        return res;
      });
    };
  };
}