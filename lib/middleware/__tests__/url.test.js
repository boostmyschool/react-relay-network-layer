"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _ = require("../..");

var _mockReq = require("../../__mocks__/mockReq");

var _url = _interopRequireDefault(require("../url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('Middleware / url', function () {
  describe('`url` option as string', function () {
    var rnl = new _.RelayNetworkLayer([(0, _url.default)({
      url: '/other/url'
    })]);
    beforeEach(function () {
      _fetchMock.default.restore();

      _fetchMock.default.mock({
        matcher: '/other/url',
        response: {
          status: 200,
          body: {
            data: 'PAYLOAD'
          },
          sendAsJson: true
        },
        method: 'POST'
      });
    });
    it('should work with query',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var req1;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context.next = 3;
              return rnl.sendQueries([req1]);

            case 3:
              expect(req1.payload.response).toBe('PAYLOAD');

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    it('should work with mutation',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var req1;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context2.next = 3;
              return rnl.sendMutation(req1);

            case 3:
              expect(req1.payload.response).toBe('PAYLOAD');

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
  });
  describe('`url` option as thunk', function () {
    var rnl = new _.RelayNetworkLayer([(0, _url.default)({
      url: function url() {
        return '/thunk_url';
      }
    })]);
    beforeEach(function () {
      _fetchMock.default.restore();

      _fetchMock.default.mock({
        matcher: '/thunk_url',
        response: {
          status: 200,
          body: {
            data: 'PAYLOAD2'
          },
          sendAsJson: true
        },
        method: 'POST'
      });
    });
    it('should work with query',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var req1;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context3.next = 3;
              return rnl.sendQueries([req1]);

            case 3:
              expect(req1.payload.response).toBe('PAYLOAD2');

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));
    it('should work with mutation',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var req1;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context4.next = 3;
              return rnl.sendQueries([req1]);

            case 3:
              expect(req1.payload.response).toBe('PAYLOAD2');

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
  });
});