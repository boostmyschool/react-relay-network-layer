"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deferMiddleware;

/* eslint-disable no-unused-vars */
function deferMiddleware(opts) {
  var middleware = function middleware(next) {
    return function (req) {
      return next(req);
    };
  };

  middleware.supports = ['defer'];
  return middleware;
}