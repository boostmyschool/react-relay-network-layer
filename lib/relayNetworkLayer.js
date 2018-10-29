"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _relayQueries = _interopRequireDefault(require("./relayQueries"));

var _relayMutation = _interopRequireDefault(require("./relayMutation"));

var _fetchWithMiddleware = _interopRequireDefault(require("./fetchWithMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RelayNetworkLayer =
/*#__PURE__*/
function () {
  function RelayNetworkLayer(middlewares, options) {
    var _this = this;

    _classCallCheck(this, RelayNetworkLayer);

    this._options = _typeof(options) === 'object' ? options : {};
    this._middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
    this._supportedOptions = [];

    this._middlewares.forEach(function (mw) {
      if (mw && mw.supports) {
        if (Array.isArray(mw.supports)) {
          var _this$_supportedOptio;

          (_this$_supportedOptio = _this._supportedOptions).push.apply(_this$_supportedOptio, _toConsumableArray(mw.supports));
        } else {
          _this._supportedOptions.push(mw.supports);
        }
      }
    });

    this.supports = this.supports.bind(this);
    this.sendQueries = this.sendQueries.bind(this);
    this.sendMutation = this.sendMutation.bind(this);
  }

  _createClass(RelayNetworkLayer, [{
    key: "supports",
    value: function supports() {
      var _this2 = this;

      for (var _len = arguments.length, options = new Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
      }

      return options.every(function (option) {
        return _this2._supportedOptions.indexOf(option) !== -1;
      });
    }
  }, {
    key: "sendQueries",
    value: function sendQueries(requests) {
      var _this3 = this;

      return (0, _relayQueries.default)(requests, function (req) {
        return (0, _fetchWithMiddleware.default)(req, _this3._middlewares, _this3._options);
      });
    }
  }, {
    key: "sendMutation",
    value: function sendMutation(request) {
      var _this4 = this;

      return (0, _relayMutation.default)(request, function (req) {
        return (0, _fetchWithMiddleware.default)(req, _this4._middlewares, _this4._options);
      });
    }
  }]);

  return RelayNetworkLayer;
}();

exports.default = RelayNetworkLayer;