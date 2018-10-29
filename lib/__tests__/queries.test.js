"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _ = require("..");

var _mockReq = require("../__mocks__/mockReq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('Queries tests', function () {
  var middlewares = [];
  var rnl = new _.RelayNetworkLayer(middlewares);
  beforeEach(function () {
    _fetchMock.default.restore();
  });
  it('should make a successfull query',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var req;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: {
                    ok: 1
                  }
                },
                sendAsJson: true
              },
              method: 'POST'
            });

            req = (0, _mockReq.mockReq)();
            _context.next = 4;
            return rnl.sendQueries([req]);

          case 4:
            expect(req.payload).toEqual({
              response: {
                ok: 1
              }
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  it('should fail correctly on network failure',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var req1;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql',
              response: {
                throws: new Error('Network connection error')
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)();
            expect.assertions(2);
            _context2.prev = 3;
            _context2.next = 6;
            return rnl.sendQueries([req1]);

          case 6:
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](3);
            expect(_context2.t0 instanceof Error).toBeTruthy();
            expect(_context2.t0.toString()).toMatch('Network connection error');

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 8]]);
  })));
  it('should handle error response',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var req1;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  errors: [{
                    location: 1,
                    message: 'major error'
                  }]
                }
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            _context3.next = 4;
            return rnl.sendQueries([req1]).catch(function () {});

          case 4:
            expect(req1.error instanceof Error).toBeTruthy();

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  it('should handle server non-2xx errors',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var req1, error;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql',
              response: {
                status: 500,
                body: 'Something went completely wrong.'
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            _context4.next = 4;
            return rnl.sendQueries([req1]).catch(function () {});

          case 4:
            error = req1.error;
            expect(error instanceof Error).toBeTruthy();
            expect(error.message).toEqual('Something went completely wrong.');
            expect(error.fetchResponse.status).toEqual(500);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  it('should fail on missing `data` property',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var req, error;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {},
                sendAsJson: true
              },
              method: 'POST'
            });

            req = (0, _mockReq.mockReq)();
            _context5.next = 4;
            return rnl.sendQueries([req]).catch(function () {});

          case 4:
            error = req.error;
            expect(error.toString()).toMatch('Server return empty `response.data`');

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));
});