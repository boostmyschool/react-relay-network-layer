function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* eslint-disable no-param-reassign, prefer-const */
import { createRequestError } from './createRequestError';

function runFetch(req) {
  let {
    url
  } = req,
      opts = _objectWithoutProperties(req, ["url"]);

  if (!url) {
    if (req.relayReqType === 'batch-query') {
      url = '/graphql/batch';
    } else {
      url = '/graphql';
    }
  }

  return fetch(url, opts).then(res => {
    if (res.status < 200 || res.status >= 300) {
      return res.text().then(text => {
        const err = new Error(text);
        err.fetchResponse = res;
        throw err;
      });
    }

    return res;
  }).then(res => {
    return res.json().then(payload => {
      return _objectSpread({}, res, {
        payload
      });
    });
  });
}

export default function fetchWithMiddleware(req, middlewares, options) {
  const wrappedFetch = compose(...middlewares)(runFetch);
  return wrappedFetch(req).then(res => {
    const {
      payload
    } = res;
    const {
      noThrow = false
    } = options;
    const hasErrors = !payload || payload.hasOwnProperty('errors') || !payload.hasOwnProperty('data');
    /** Only throw the Error if noThrow === false */

    if (!noThrow && hasErrors) {
      throw createRequestError(req, res);
    }
    /** Return payload.data as well as the errors (if they exist) */


    return {
      data: payload && payload.data || null,
      errors: hasErrors ? createRequestError(req, res) : null
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

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  } else {
    const last = funcs[funcs.length - 1];
    const rest = funcs.slice(0, -1);
    return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args));
  }
}