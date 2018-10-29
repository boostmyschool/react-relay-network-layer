"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchWithMiddleware;

var _createRequestError = require("./createRequestError");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function runFetch(req) {
  var url = req.url,
      opts = _objectWithoutProperties(req, ["url"]);

  if (!url) {
    if (req.relayReqType === 'batch-query') {
      url = '/graphql/batch';
    } else {
      url = '/graphql';
    }
  }

  return fetch(url, opts).then(function (res) {
    if (res.status < 200 || res.status >= 300) {
      return res.text().then(function (text) {
        var err = new Error(text);
        err.fetchResponse = res;
        throw err;
      });
    }

    return res;
  }).then(function (res) {
    return res.json().then(function (payload) {
      return _objectSpread({}, res, {
        payload: payload
      });
    });
  });
}

function fetchWithMiddleware(req, middlewares, options) {
  var wrappedFetch = compose.apply(void 0, _toConsumableArray(middlewares))(runFetch);
  return wrappedFetch(req).then(function (res) {
    var payload = res.payload;
    var _options$noThrow = options.noThrow,
        noThrow = _options$noThrow === void 0 ? false : _options$noThrow;
    var hasErrors = !payload || payload.hasOwnProperty('errors') || !payload.hasOwnProperty('data');
    /** Only throw the Error if noThrow === false */

    if (!noThrow && hasErrors) {
      throw (0, _createRequestError.createRequestError)(req, res);
    }
    /** Return payload.data as well as the errors (if they exist) */


    return {
      data: payload && payload.data || null,
      errors: hasErrors ? (0, _createRequestError.createRequestError)(req, res) : null
    };
  });
}
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */


function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);
    return function () {
      return rest.reduceRight(function (composed, f) {
        return f(composed);
      }, last.apply(void 0, arguments));
    };
  }
}