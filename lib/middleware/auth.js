"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authMiddleware;

var _utils = require("../utils");

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

var WrongTokenError =
/*#__PURE__*/
function (_Error) {
  _inherits(WrongTokenError, _Error);

  function WrongTokenError(msg, res) {
    var _this;

    _classCallCheck(this, WrongTokenError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WrongTokenError).call(this, msg));
    _this.res = res;
    _this.name = 'WrongTokenError';
    return _this;
  }

  return WrongTokenError;
}(_wrapNativeSuper(Error));

function authMiddleware(opts) {
  var _ref = opts || {},
      tokenOrThunk = _ref.token,
      tokenRefreshPromise = _ref.tokenRefreshPromise,
      _ref$allowEmptyToken = _ref.allowEmptyToken,
      allowEmptyToken = _ref$allowEmptyToken === void 0 ? false : _ref$allowEmptyToken,
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === void 0 ? 'Bearer ' : _ref$prefix,
      _ref$header = _ref.header,
      header = _ref$header === void 0 ? 'Authorization' : _ref$header;

  var tokenRefreshInProgress = null;
  return function (next) {
    return function (req) {
      return new Promise(function (resolve, reject) {
        // $FlowFixMe
        var token = (0, _utils.isFunction)(tokenOrThunk) ? tokenOrThunk(req) : tokenOrThunk;

        if (!token && tokenRefreshPromise && !allowEmptyToken) {
          reject(new WrongTokenError('Empty token'));
        }

        resolve(token);
      }).then(function (token) {
        if (token) {
          req.headers[header] = "".concat(prefix).concat(token);
        }

        return next(req);
      }).catch(function (e) {
        if (e && tokenRefreshPromise) {
          if (e.message === 'Empty token' || e.fetchResponse && e.fetchResponse.status === 401) {
            if (tokenRefreshPromise) {
              if (!tokenRefreshInProgress) {
                tokenRefreshInProgress = Promise.resolve(tokenRefreshPromise(req, e.fetchResponse)).then(function (newToken) {
                  tokenRefreshInProgress = null;
                  return newToken;
                });
              }

              return tokenRefreshInProgress.then(function (newToken) {
                req.headers[header] = "".concat(prefix).concat(newToken);
                return next(req); // re-run query with new token
              });
            }
          }
        }

        throw e;
      });
    };
  };
}