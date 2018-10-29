function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import { RelayNetworkLayer } from '..';
import { mockReq } from '../__mocks__/mockReq';
describe('Mutation tests', () => {
  const middlewares = [];
  const rnl = new RelayNetworkLayer(middlewares);
  beforeEach(() => {
    fetchMock.restore();
  });
  it('should make a successfull mutation',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    fetchMock.post('/graphql', {
      data: {
        ok: 1
      }
    });
    const req = mockReq();
    yield rnl.sendMutation(req);
    expect(req.payload).toEqual({
      response: {
        ok: 1
      }
    });
  }));
  it('should fail correctly on network failure',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    fetchMock.mock({
      matcher: '/graphql',
      response: {
        throws: new Error('Network connection error')
      },
      method: 'POST'
    });
    const req1 = mockReq();
    expect.assertions(2);

    try {
      yield rnl.sendMutation(req1).catch(() => {});
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.toString()).toMatch('Network connection error');
    }
  }));
  it('should handle error response',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    fetchMock.mock({
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
    const req1 = mockReq(1);
    yield rnl.sendMutation(req1).catch(() => {});
    expect(req1.error instanceof Error).toBeTruthy();
  }));
  it('should handle server non-2xx errors',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    fetchMock.mock({
      matcher: '/graphql',
      response: {
        status: 500,
        body: 'Something went completely wrong.'
      },
      method: 'POST'
    });
    const req1 = mockReq(1);
    yield rnl.sendMutation(req1).catch(() => {});
    const error = req1.error;
    expect(error instanceof Error).toBeTruthy();
    expect(error.message).toEqual('Something went completely wrong.');
    expect(error.fetchResponse.status).toEqual(500);
  }));
});