"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gqErrorsMiddleware;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* eslint-disable no-console */
function gqErrorsMiddleware(options) {
  var opts = options || {};
  var logger = opts.logger || console.error.bind(console);
  var prefix = opts.prefix || '[RELAY-NETWORK] GRAPHQL SERVER ERROR:\n\n';
  var disableServerMiddlewareTip = opts.disableServerMiddlewareTip || false;

  function displayErrors(errors, nlData) {
    return errors.forEach(function (error) {
      var message = error.message,
          stack = error.stack,
          rest = _objectWithoutProperties(error, ["message", "stack"]);

      var msg = "".concat(prefix);
      var fmt = [];

      if (stack && Array.isArray(stack)) {
        msg = "".concat(msg, "%c").concat(stack.shift(), "\n%c").concat(stack.join('\n'));
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      } else {
        msg = "".concat(msg, "%c").concat(message, " %c");
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      }

      if (rest && Object.keys(rest).length) {
        msg = "".concat(msg, "\n  %O");
        fmt.push(rest);
      }

      msg = "".concat(msg, "\n\n%cRequest Response data:\n  %c%O");
      fmt.push('font-weight: bold;', 'font-weight: normal;', nlData);

      if (!stack && !disableServerMiddlewareTip) {
        msg = "".concat(msg, "\n\n%cNotice:%c").concat(noticeAbsentStack());
        fmt.push('font-weight: bold;', 'font-weight: normal;');
      }

      logger.apply(void 0, ["".concat(msg, "\n\n")].concat(fmt));
    });
  }

  return function (next) {
    return function (req) {
      var query = "".concat(req.relayReqType, " ").concat(req.relayReqId);
      return next(req).then(function (res) {
        if (res.payload) {
          if (Array.isArray(res.payload)) {
            res.payload.forEach(function (batchItem) {
              if (batchItem.payload.errors) {
                displayErrors(batchItem.payload.errors, {
                  query: query,
                  req: req,
                  res: res
                });
              }
            });
          } else if (res.payload.errors) {
            displayErrors(res.payload.errors, {
              query: query,
              req: req,
              res: res
            });
          }
        }

        return res;
      });
    };
  };
}

function noticeAbsentStack() {
  return "\n    If you using 'express-graphql', you may get server stack-trace for error.\n    Just tune 'formatError' to return 'stack' with stack-trace:\n\n    import graphqlHTTP from 'express-graphql';\n\n    const graphQLMiddleware = graphqlHTTP({\n      schema: myGraphQLSchema,\n      formatError: (error) => ({\n        message: error.message,\n        stack: process.env.NODE_ENV === 'development' ? error.stack.split('\\n') : null,\n      })\n    });\n\n    app.use('/graphql', graphQLMiddleware);";
}