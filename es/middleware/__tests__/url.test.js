function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import { RelayNetworkLayer } from '../..';
import { mockReq } from '../../__mocks__/mockReq';
import urlMiddleware from '../url';
describe('Middleware / url', () => {
  describe('`url` option as string', () => {
    const rnl = new RelayNetworkLayer([urlMiddleware({
      url: '/other/url'
    })]);
    beforeEach(() => {
      fetchMock.restore();
      fetchMock.mock({
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
    _asyncToGenerator(function* () {
      const req1 = mockReq();
      yield rnl.sendQueries([req1]);
      expect(req1.payload.response).toBe('PAYLOAD');
    }));
    it('should work with mutation',
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      const req1 = mockReq();
      yield rnl.sendMutation(req1);
      expect(req1.payload.response).toBe('PAYLOAD');
    }));
  });
  describe('`url` option as thunk', () => {
    const rnl = new RelayNetworkLayer([urlMiddleware({
      url: () => '/thunk_url'
    })]);
    beforeEach(() => {
      fetchMock.restore();
      fetchMock.mock({
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
    _asyncToGenerator(function* () {
      const req1 = mockReq();
      yield rnl.sendQueries([req1]);
      expect(req1.payload.response).toBe('PAYLOAD2');
    }));
    it('should work with mutation',
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      const req1 = mockReq();
      yield rnl.sendQueries([req1]);
      expect(req1.payload.response).toBe('PAYLOAD2');
    }));
  });
});