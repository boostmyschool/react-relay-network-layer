"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _2 = require("../..");

var _mockReq = require("../../__mocks__/mockReq");

var _auth = _interopRequireDefault(require("../auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('Middleware / auth', function () {
  describe('`token` option as string (with default `prefix` and `header`)', function () {
    var rnl = new _2.RelayNetworkLayer([(0, _auth.default)({
      token: '123',
      tokenRefreshPromise: function tokenRefreshPromise() {
        return '345';
      }
    })]);
    beforeEach(function () {
      _fetchMock.default.restore();

      _fetchMock.default.mock({
        matcher: '/graphql',
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
      var req1, reqs;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context.next = 3;
              return rnl.sendQueries([req1]);

            case 3:
              expect(req1.payload).toEqual({
                response: 'PAYLOAD'
              });
              reqs = _fetchMock.default.calls('/graphql');
              expect(reqs).toHaveLength(1);
              expect(reqs[0][1].headers.Authorization).toBe('Bearer 123');

            case 7:
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
      var req1, reqs;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context2.next = 3;
              return rnl.sendMutation(req1);

            case 3:
              expect(req1.payload).toEqual({
                response: 'PAYLOAD'
              });
              reqs = _fetchMock.default.calls('/graphql');
              expect(reqs).toHaveLength(1);
              expect(reqs[0][1].headers.Authorization).toBe('Bearer 123');

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
  });
  describe('`token` option as thunk (with custom `prefix` and `header`)', function () {
    var rnl = new _2.RelayNetworkLayer([(0, _auth.default)({
      token: function token() {
        return '333';
      },
      tokenRefreshPromise: function tokenRefreshPromise() {
        return '345';
      },
      prefix: 'MyBearer ',
      header: 'MyAuthorization'
    })]);
    beforeEach(function () {
      _fetchMock.default.restore();

      _fetchMock.default.mock({
        matcher: '/graphql',
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
    regeneratorRuntime.mark(function _callee3() {
      var req1, reqs;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context3.next = 3;
              return rnl.sendQueries([req1]);

            case 3:
              expect(req1.payload).toEqual({
                response: 'PAYLOAD'
              });
              reqs = _fetchMock.default.calls('/graphql');
              expect(reqs).toHaveLength(1);
              expect(reqs[0][1].headers.MyAuthorization).toBe('MyBearer 333');

            case 7:
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
      var req1, reqs;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              req1 = (0, _mockReq.mockReq)();
              _context4.next = 3;
              return rnl.sendMutation(req1);

            case 3:
              expect(req1.payload).toEqual({
                response: 'PAYLOAD'
              });
              reqs = _fetchMock.default.calls('/graphql');
              expect(reqs).toHaveLength(1);
              expect(reqs[0][1].headers.MyAuthorization).toBe('MyBearer 333');

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
  });
  describe('`tokenRefreshPromise` should be called on 401 response', function () {
    beforeEach(function () {
      _fetchMock.default.restore();

      _fetchMock.default.mock({
        matcher: '/graphql',
        response: function response(_, opts) {
          return {
            status: opts.headers.Authorization === 'Bearer ValidToken' ? 200 : 401,
            body: {
              data: 'PAYLOAD'
            },
            sendAsJson: true
          };
        },
        method: 'POST'
      });
    });
    it('should work with query (provided promise)',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var rnl, req1, reqs;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              rnl = new _2.RelayNetworkLayer([(0, _auth.default)({
                token: '123',
                tokenRefreshPromise: function tokenRefreshPromise() {
                  return Promise.resolve('ValidToken');
                }
              })]);
              req1 = (0, _mockReq.mockReq)();
              _context5.next = 4;
              return rnl.sendQueries([req1]);

            case 4:
              reqs = _fetchMock.default.calls('/graphql');
              expect(reqs).toHaveLength(2);
              expect(reqs[1][1].headers.Authorization).toBe('Bearer ValidToken');

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('should work with mutation (provided regular value)',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var rnl, req1, reqs;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              rnl = new _2.RelayNetworkLayer([(0, _auth.default)({
                token: '123',
                tokenRefreshPromise: function tokenRefreshPromise() {
                  return 'ValidToken';
                }
              })]);
              req1 = (0, _mockReq.mockReq)();
              _context6.next = 4;
              return rnl.sendMutation(req1);

            case 4:
              reqs = _fetchMock.default.calls('/graphql');
              expect(reqs).toHaveLength(2);
              expect(reqs[1][1].headers.Authorization).toBe('Bearer ValidToken');

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
  });
});