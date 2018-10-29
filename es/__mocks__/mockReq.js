/* eslint-disable import/prefer-default-export, no-param-reassign */
class MockReq {
  constructor(reqid, reqData = {}) {
    this.reqid = reqid || Math.random().toString();
    this.reqData = reqData;
  }

  getID() {
    return this.reqid;
  }

  getQueryString() {
    return this.reqData.query || '{}';
  }

  getDebugName() {
    return `debugname${this.reqid}`;
  }

  getVariables() {
    return this.reqData.varaibles || {};
  }

  getFiles() {
    return this.reqData.files;
  }

  reject(err) {
    this.error = err;
  }

  resolve(resp) {
    this.payload = resp;
  }

}

export function mockReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, data);
}
export function mockReqWithSize(reqid, size) {
  return mockReq(reqid, {
    query: `{${'x'.repeat(size)}}`
  });
}
export function mockReqWithFiles(reqid) {
  return mockReq(reqid, {
    files: {
      file1: 'data',
      file2: 'data'
    }
  });
}