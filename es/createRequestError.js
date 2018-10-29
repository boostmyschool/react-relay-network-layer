class RRNLRequestError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'RRNLRequestError';
  }

}
/**
 * Formats an error response from GraphQL server request.
 */


function formatRequestErrors(request, errors) {
  const CONTEXT_BEFORE = 20;
  const CONTEXT_LENGTH = 60;

  if (!request.getQueryString) {
    return errors.join('\n');
  }

  const queryLines = request.getQueryString().split('\n');
  return errors.map(({
    locations,
    message
  }, ii) => {
    const prefix = `${ii + 1}. `;
    const indent = ' '.repeat(prefix.length); // custom errors thrown in graphql-server may not have locations

    const locationMessage = locations ? '\n' + locations.map(({
      column,
      line
    }) => {
      const queryLine = queryLines[line - 1];
      const offset = Math.min(column - 1, CONTEXT_BEFORE);
      return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), `${' '.repeat(Math.max(offset, 0))}^^^`].map(messageLine => indent + messageLine).join('\n');
    }).join('\n') : '';
    return prefix + message + locationMessage;
  }).join('\n');
}

function formatResponse(res) {
  return [`Response:`, `   Url: ${res.url}`, `   Status code: ${res.status}`, `   Status text: ${res.statusText}`, `   Response headers: ${JSON.stringify(res.headers)}`, `   Body: ${JSON.stringify(res.payload)}`].join('\n');
}

export function getDebugName(req) {
  if (req.relayReqObj) {
    return `${req.relayReqType} ${req.relayReqObj.getDebugName()}`;
  }

  return req.relayReqId;
}
export function createRequestError(req, res) {
  let errorReason = '';

  if (!res || !res.payload) {
    errorReason = 'Server return empty `response`.' + (res ? `\n\n${formatResponse(res)}` : '');
  } else if (res.payload.errors) {
    if (req.relayReqObj) {
      errorReason = formatRequestErrors(req.relayReqObj, res.payload.errors);
    } else {
      errorReason = res.payload.errors.toString();
    }
  } else if (!res.payload.data) {
    errorReason = 'Server return empty `response.data`.\n\n' + formatResponse(res);
  }

  const error = new RRNLRequestError(`Server request for \`${getDebugName(req)}\` failed by the following reasons:\n\n${errorReason}`);
  error.req = req;
  error.res = res;
  error.status = res ? res.status : 0;
  return error;
}