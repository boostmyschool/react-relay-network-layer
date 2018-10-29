"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loggerMiddleware;

/* eslint-disable no-console */
function loggerMiddleware(opts) {
  var logger = opts && opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  return function (next) {
    return function (req) {
      var query = "".concat(req.relayReqType, " ").concat(req.relayReqId);
      logger("Run ".concat(query), req);
      return next(req).then(function (res) {
        if (res.status !== 200) {
          logger("Status ".concat(res.status, ": ").concat(res.statusText, " for ").concat(query), req, res);

          if (res.status === 400 && req.relayReqType === 'batch-query') {
            logger("WARNING: You got 400 error for 'batch-query', probably problem on server side.\n          You should connect wrapper:\n\n          import graphqlHTTP from 'express-graphql';\n          import { graphqlBatchHTTPWrapper } from 'react-relay-network-layer';\n\n          const graphQLMiddleware = graphqlHTTP({ schema: GraphQLSchema });\n\n          app.use('/graphql/batch', bodyParser.json(), graphqlBatchHTTPWrapper(graphQLMiddleware));\n          app.use('/graphql', graphQLMiddleware);\n          ");
          }
        }

        return res;
      });
    };
  };
}