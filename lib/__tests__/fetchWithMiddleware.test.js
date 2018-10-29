"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _fetchWithMiddleware = _interopRequireDefault(require("../fetchWithMiddleware"));

var _mockReq = require("../__mocks__/mockReq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function createMockReq(reqId) {
  var relayRequest = (0, _mockReq.mockReq)(reqId);
  var req = {
    relayReqId: relayRequest.getID(),
    relayReqObj: relayRequest,
    relayReqType: 'query',
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: relayRequest.getID(),
      query: relayRequest.getQueryString(),
      variables: relayRequest.getVariables()
    })
  };
  return req;
}

describe('fetchWithMiddleware', function () {
  beforeEach(function () {
    _fetchMock.default.restore();
  });
  it('should make a successfull request without middlewares',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var _ref2, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock.default.post('/graphql', {
              id: 1,
              data: {
                user: 123
              }
            });

            _context.next = 3;
            return (0, _fetchWithMiddleware.default)(createMockReq(1), [], {});

          case 3:
            _ref2 = _context.sent;
            data = _ref2.data;
            expect(data).toEqual({
              user: 123
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  it('should make a successfull request with middlewares',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var numPlus5, numMultiply10, _ref4, data;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            numPlus5 = function numPlus5(next) {
              return function (req) {
                return next(req).then(function (res) {
                  res.payload.data.num += 5;
                  return res;
                });
              };
            };

            numMultiply10 = function numMultiply10(next) {
              return function (req) {
                return next(req).then(function (res) {
                  res.payload.data.num *= 10;
                  return res;
                });
              };
            };

            _fetchMock.default.post('/graphql', {
              id: 1,
              data: {
                num: 1
              }
            });

            _context2.next = 5;
            return (0, _fetchWithMiddleware.default)(createMockReq(1), [numPlus5, numMultiply10], {});

          case 5:
            _ref4 = _context2.sent;
            data = _ref4.data;
            expect(data).toEqual({
              num: 15
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
});