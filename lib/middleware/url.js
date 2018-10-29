"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = urlMiddleware;

var _utils = require("../utils");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function urlMiddleware(opts) {
  var urlOrThunk = opts && opts.url || '/graphql';
  var fetchOpts = opts && opts.opts || null;
  return function (next) {
    return function (req) {
      if (fetchOpts) {
        var headers = fetchOpts.headers,
            otherOpts = _objectWithoutProperties(fetchOpts, ["headers"]);

        Object.assign(req, otherOpts);

        if (headers) {
          Object.assign(req.headers, headers);
        }
      }

      if (req.relayReqType !== 'batch-query') {
        // $FlowFixMe
        req.url = (0, _utils.isFunction)(urlOrThunk) ? urlOrThunk(req) : urlOrThunk;
      }

      return next(req);
    };
  };
}