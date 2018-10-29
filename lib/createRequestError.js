"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDebugName = getDebugName;
exports.createRequestError = createRequestError;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RRNLRequestError =
/*#__PURE__*/
function (_Error) {
  _inherits(RRNLRequestError, _Error);

  function RRNLRequestError(msg) {
    var _this;

    _classCallCheck(this, RRNLRequestError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RRNLRequestError).call(this, msg));
    _this.name = 'RRNLRequestError';
    return _this;
  }

  return RRNLRequestError;
}(_wrapNativeSuper(Error));
/**
 * Formats an error response from GraphQL server request.
 */


function formatRequestErrors(request, errors) {
  var CONTEXT_BEFORE = 20;
  var CONTEXT_LENGTH = 60;

  if (!request.getQueryString) {
    return errors.join('\n');
  }

  var queryLines = request.getQueryString().split('\n');
  return errors.map(function (_ref, ii) {
    var locations = _ref.locations,
        message = _ref.message;
    var prefix = "".concat(ii + 1, ". ");
    var indent = ' '.repeat(prefix.length); // custom errors thrown in graphql-server may not have locations

    var locationMessage = locations ? '\n' + locations.map(function (_ref2) {
      var column = _ref2.column,
          line = _ref2.line;
      var queryLine = queryLines[line - 1];
      var offset = Math.min(column - 1, CONTEXT_BEFORE);
      return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), "".concat(' '.repeat(Math.max(offset, 0)), "^^^")].map(function (messageLine) {
        return indent + messageLine;
      }).join('\n');
    }).join('\n') : '';
    return prefix + message + locationMessage;
  }).join('\n');
}

function formatResponse(res) {
  return ["Response:", "   Url: ".concat(res.url), "   Status code: ".concat(res.status), "   Status text: ".concat(res.statusText), "   Response headers: ".concat(JSON.stringify(res.headers)), "   Body: ".concat(JSON.stringify(res.payload))].join('\n');
}

function getDebugName(req) {
  if (req.relayReqObj) {
    return "".concat(req.relayReqType, " ").concat(req.relayReqObj.getDebugName());
  }

  return req.relayReqId;
}

function createRequestError(req, res) {
  var errorReason = '';

  if (!res || !res.payload) {
    errorReason = 'Server return empty `response`.' + (res ? "\n\n".concat(formatResponse(res)) : '');
  } else if (res.payload.errors) {
    if (req.relayReqObj) {
      errorReason = formatRequestErrors(req.relayReqObj, res.payload.errors);
    } else {
      errorReason = res.payload.errors.toString();
    }
  } else if (!res.payload.data) {
    errorReason = 'Server return empty `response.data`.\n\n' + formatResponse(res);
  }

  var error = new RRNLRequestError("Server request for `".concat(getDebugName(req), "` failed by the following reasons:\n\n").concat(errorReason));
  error.req = req;
  error.res = res;
  error.status = res ? res.status : 0;
  return error;
}