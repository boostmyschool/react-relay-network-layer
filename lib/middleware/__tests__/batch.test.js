"use strict";

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _formData = _interopRequireDefault(require("form-data"));

var _ = require("../..");

var _mockReq = require("../../__mocks__/mockReq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

global.FormData = _formData.default;
describe('batchMiddleware', function () {
  var rnl = new _.RelayNetworkLayer([(0, _.batchMiddleware)()]);
  beforeEach(function () {
    _fetchMock.default.restore();
  });
  it('should make a successfull single request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var req;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock.default.post('/graphql', {
              data: {
                ok: 1
              }
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
  it('should make a successfully batch request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var req1, req2;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {
                    ok: 1
                  }
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context2.next = 5;
            return rnl.sendQueries([req1, req2]);

          case 5:
            expect(req1.payload).toEqual({
              response: {
                ok: 1
              }
            });
            expect(req2.payload).toEqual({
              response: {
                ok: 2
              }
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  it('should make a successfully batch request without server IDs',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var req1, req2;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  data: {
                    ok: 1
                  }
                }, {
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context3.next = 5;
            return rnl.sendQueries([req1, req2]);

          case 5:
            expect(req1.payload).toEqual({
              response: {
                ok: 1
              }
            });
            expect(req2.payload).toEqual({
              response: {
                ok: 2
              }
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  it('should reject if server returns a different number of responses than requests',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var req1, req2;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context4.next = 5;
            return rnl.sendQueries([req1, req2]).catch(function () {});

          case 5:
            expect(req1.error.toString()).toMatch('Server returned a different number of responses than requested.');
            expect(req2.error.toString()).toMatch('Server returned a different number of responses than requested.');

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  it('should make a successfully batch request with duplicate request ids',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var req1, req2, req3;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {
                    ok: 1
                  }
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            req3 = (0, _mockReq.mockReq)(2);
            _context5.next = 6;
            return rnl.sendQueries([req1, req2, req3]);

          case 6:
            expect(req1.payload).toEqual({
              response: {
                ok: 1
              }
            });
            expect(req2.payload).toEqual({
              response: {
                ok: 2
              }
            });
            expect(req3.payload).toEqual({
              response: {
                ok: 2
              }
            });

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));
  it('should reject if server does not return response for request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var req1, req2;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context6.next = 5;
            return rnl.sendQueries([req1, req2]).catch(function () {});

          case 5:
            expect(req1.error).toBeInstanceOf(Error);
            expect(req1.error.toString()).toMatch('Server does not return response for request');
            expect(req2.payload).toEqual({
              response: {
                ok: 2
              }
            });

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  })));
  it('should reject if server does not return response for duplicate request ids',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var req1, req2, req3;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            req3 = (0, _mockReq.mockReq)(1);
            _context7.next = 6;
            return rnl.sendQueries([req1, req2, req3]).catch(function () {});

          case 6:
            expect(req1.error).toBeInstanceOf(Error);
            expect(req1.error.toString()).toMatch('Server does not return response for request');
            expect(req2.payload).toEqual({
              response: {
                ok: 2
              }
            });
            expect(req3.error).toBeInstanceOf(Error);
            expect(req3.error.toString()).toMatch('Server does not return response for request');

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  })));
  it('should handle network failure',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8() {
    var req1, req2;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                throws: new Error('Network connection error')
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context8.next = 5;
            return rnl.sendQueries([req1, req2]).catch(function () {});

          case 5:
            expect(req1.error).toBeInstanceOf(Error);
            expect(req1.error.toString()).toMatch('Network connection error');
            expect(req2.error).toBeInstanceOf(Error);
            expect(req2.error.toString()).toMatch('Network connection error');

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  })));
  it('should handle server errors for one request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var req1, req2;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  payload: {
                    errors: [{
                      location: 1,
                      message: 'major error'
                    }]
                  }
                }, {
                  id: 2,
                  payload: {
                    data: {
                      ok: 2
                    }
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context9.next = 5;
            return rnl.sendQueries([req1, req2]).catch(function () {});

          case 5:
            expect(req1.error).toBeInstanceOf(Error);
            expect(req1.error.toString()).toMatch('major error');
            expect(req2.payload).toEqual({
              response: {
                ok: 2
              }
            });
            expect(req2.error).toBeUndefined();

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  })));
  it('should handle server errors for all requests',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10() {
    var req1, req2, req3;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
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
            req2 = (0, _mockReq.mockReq)(2);
            req3 = (0, _mockReq.mockReq)(3);
            _context10.next = 6;
            return rnl.sendQueries([req1, req2, req3]).catch(function () {});

          case 6:
            expect(req1.error.toString()).toMatch('Wrong response');
            expect(req2.error.toString()).toMatch('Wrong response');
            expect(req3.error.toString()).toMatch('Wrong response');

          case 9:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  })));
  it('should handle responses without payload wrapper',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11() {
    var req1, req2;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _fetchMock.default.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  errors: [{
                    location: 1,
                    message: 'major error'
                  }]
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });

            req1 = (0, _mockReq.mockReq)(1);
            req2 = (0, _mockReq.mockReq)(2);
            _context11.next = 5;
            return rnl.sendQueries([req1, req2]).catch(function () {});

          case 5:
            expect(req1.error).toBeInstanceOf(Error);
            expect(req1.error.toString()).toMatch('major error');
            expect(req2.payload).toEqual({
              response: {
                ok: 2
              }
            });
            expect(req2.error).toBeUndefined();

          case 9:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  })));
  describe('option `batchTimeout`', function () {
    beforeEach(function () {
      _fetchMock.default.restore();
    });
    it('should gather different requests into one batch request',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var rnl2, reqs;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _fetchMock.default.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl2 = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 50
              })]);
              rnl2.sendQueries([(0, _mockReq.mockReq)(1)]);
              setTimeout(function () {
                return rnl2.sendQueries([(0, _mockReq.mockReq)(2)]);
              }, 30);
              _context12.next = 6;
              return rnl2.sendQueries([(0, _mockReq.mockReq)(3)]);

            case 6:
              reqs = _fetchMock.default.calls('/graphql/batch');
              expect(reqs).toHaveLength(1);
              expect(reqs[0][1].body).toEqual('[{"id":"1","query":"{}","variables":{}},{"id":"2","query":"{}","variables":{}},{"id":"3","query":"{}","variables":{}}]');

            case 9:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
    it('should gather different requests into two batch request',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var rnl2;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _fetchMock.default.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }, {
                    id: 4,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              rnl2 = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 50
              })]);
              rnl2.sendQueries([(0, _mockReq.mockReq)(1)]);
              setTimeout(function () {
                return rnl2.sendQueries([(0, _mockReq.mockReq)(2)]);
              }, 60);
              setTimeout(function () {
                return rnl2.sendQueries([(0, _mockReq.mockReq)(3)]);
              }, 70);
              rnl2.sendQueries([(0, _mockReq.mockReq)(4)]);
              _context13.next = 8;
              return new Promise(function (resolve, reject) {
                setTimeout(function () {
                  try {
                    var reqs = _fetchMock.default.calls('/graphql/batch');

                    expect(reqs).toHaveLength(2);
                    expect(reqs[0][1].body).toBe('[{"id":"1","query":"{}","variables":{}},{"id":"4","query":"{}","variables":{}}]');
                    expect(reqs[1][1].body).toBe('[{"id":"2","query":"{}","variables":{}},{"id":"3","query":"{}","variables":{}}]');
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, 200);
              });

            case 8:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
  });
  describe('option `maxBatchSize`', function () {
    var rnl3 = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
      maxBatchSize: 1024 * 10
    })]);
    beforeEach(function () {
      _fetchMock.default.restore();
    });
    it('should split large batched requests into multiple requests',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var req1, req2, req3, req4, req5, batchReqs, singleReqs;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _fetchMock.default.mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 5,
                    data: {}
                  }
                },
                method: 'POST'
              });

              _fetchMock.default.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }, {
                    id: 4,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              req1 = (0, _mockReq.mockReqWithSize)(1, 1024 * 7);
              req2 = (0, _mockReq.mockReqWithSize)(2, 1024 * 2);
              req3 = (0, _mockReq.mockReqWithSize)(3, 1024 * 5);
              req4 = (0, _mockReq.mockReqWithSize)(4, 1024 * 4);
              req5 = (0, _mockReq.mockReqWithSize)(5, 1024 * 11);
              _context14.next = 9;
              return rnl3.sendQueries([req1, req2, req3, req4, req5]);

            case 9:
              batchReqs = _fetchMock.default.calls('/graphql/batch');
              singleReqs = _fetchMock.default.calls('/graphql');
              expect(batchReqs).toHaveLength(2);
              expect(singleReqs).toHaveLength(1);

            case 13:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })));
  });
  describe('option `allowMutations`', function () {
    beforeEach(function () {
      _fetchMock.default.restore();
    });
    it('should not batch mutations by default',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var rnlTimeout20, req1, req2, singleReqs;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              rnlTimeout20 = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 20
              })]);

              _fetchMock.default.mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });

              req1 = (0, _mockReq.mockReqWithFiles)(1);
              rnlTimeout20.sendMutation(req1);
              req2 = (0, _mockReq.mockReqWithFiles)(1);
              _context15.next = 7;
              return rnlTimeout20.sendMutation(req2);

            case 7:
              singleReqs = _fetchMock.default.calls('/graphql');
              expect(singleReqs).toHaveLength(2);

            case 9:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
    it('should batch mutations if `allowMutations=true`',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var rnlAllowMutations, req1, req2, batchReqs;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              rnlAllowMutations = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 20,
                allowMutations: true
              })]);

              _fetchMock.default.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });

              req1 = (0, _mockReq.mockReq)(1);
              rnlAllowMutations.sendMutation(req1);
              req2 = (0, _mockReq.mockReq)(2);
              _context16.next = 7;
              return rnlAllowMutations.sendMutation(req2);

            case 7:
              batchReqs = _fetchMock.default.calls('/graphql/batch');
              expect(batchReqs).toHaveLength(1);

            case 9:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('should not batch mutations with files if `allowMutations=true`',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var rnlAllowMutations, req1, req2, singleReqs;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              rnlAllowMutations = new _.RelayNetworkLayer([(0, _.batchMiddleware)({
                batchTimeout: 20,
                allowMutations: true
              })]);

              _fetchMock.default.mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });

              req1 = (0, _mockReq.mockReqWithFiles)(1);
              rnlAllowMutations.sendMutation(req1);
              req2 = (0, _mockReq.mockReqWithFiles)(1);
              _context17.next = 7;
              return rnlAllowMutations.sendMutation(req2);

            case 7:
              singleReqs = _fetchMock.default.calls('/graphql');
              expect(singleReqs).toHaveLength(2);

            case 9:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
  });
});