"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockReq = mockReq;
exports.mockReqWithSize = mockReqWithSize;
exports.mockReqWithFiles = mockReqWithFiles;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable import/prefer-default-export, no-param-reassign */
var MockReq =
/*#__PURE__*/
function () {
  function MockReq(reqid) {
    var reqData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MockReq);

    this.reqid = reqid || Math.random().toString();
    this.reqData = reqData;
  }

  _createClass(MockReq, [{
    key: "getID",
    value: function getID() {
      return this.reqid;
    }
  }, {
    key: "getQueryString",
    value: function getQueryString() {
      return this.reqData.query || '{}';
    }
  }, {
    key: "getDebugName",
    value: function getDebugName() {
      return "debugname".concat(this.reqid);
    }
  }, {
    key: "getVariables",
    value: function getVariables() {
      return this.reqData.varaibles || {};
    }
  }, {
    key: "getFiles",
    value: function getFiles() {
      return this.reqData.files;
    }
  }, {
    key: "reject",
    value: function reject(err) {
      this.error = err;
    }
  }, {
    key: "resolve",
    value: function resolve(resp) {
      this.payload = resp;
    }
  }]);

  return MockReq;
}();

function mockReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, data);
}

function mockReqWithSize(reqid, size) {
  return mockReq(reqid, {
    query: "{".concat('x'.repeat(size), "}")
  });
}

function mockReqWithFiles(reqid) {
  return mockReq(reqid, {
    files: {
      file1: 'data',
      file2: 'data'
    }
  });
}