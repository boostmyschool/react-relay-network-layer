function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable no-param-reassign */
import fetchMock from 'fetch-mock';
import fetchWithMiddleware from '../fetchWithMiddleware';
import { mockReq } from '../__mocks__/mockReq';

function createMockReq(reqId) {
  const relayRequest = mockReq(reqId);
  const req = {
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

describe('fetchWithMiddleware', () => {
  beforeEach(() => {
    fetchMock.restore();
  });
  it('should make a successfull request without middlewares',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    fetchMock.post('/graphql', {
      id: 1,
      data: {
        user: 123
      }
    });
    const {
      data
    } = yield fetchWithMiddleware(createMockReq(1), [], {});
    expect(data).toEqual({
      user: 123
    });
  }));
  it('should make a successfull request with middlewares',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    const numPlus5 = next => req => next(req).then(res => {
      res.payload.data.num += 5;
      return res;
    });

    const numMultiply10 = next => req => next(req).then(res => {
      res.payload.data.num *= 10;
      return res;
    });

    fetchMock.post('/graphql', {
      id: 1,
      data: {
        num: 1
      }
    });
    const {
      data
    } = yield fetchWithMiddleware(createMockReq(1), [numPlus5, numMultiply10], {});
    expect(data).toEqual({
      num: 15
    });
  }));
});