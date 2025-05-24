"use strict";

/**
 * Inject response result
 */
function responseResult(request, ...args) {
  if (request.ctx && request.ctx.includeResponse) {
    return [request.res, ...args];
  } else {
    return args[0];
  }
}

/**
 * Inject response into error
 */
function applyErrorResponse(request) {
  if (request.err && request.ctx && request.ctx.includeResponse) {
    request.err.response = request.res;
  }
}

/**
 * Body
 */
function body(request, next) {
  if (request.err) {
    applyErrorResponse(request);
    return next(false, request.err);
  }

  next(false, undefined, responseResult(request, request.res.body));
}

/**
 * First item in body
 */
function bodyItem(request, next) {
  if (request.err) {
    applyErrorResponse(request);
    return next(false, request.err);
  }

  if (request.res.body && request.res.body.length) {
    return next(false, undefined, responseResult(request, request.res.body[0]));
  }

  next(false, undefined, responseResult(request));
}

/**
 * Empty
 */
function empty(request, next) {
  if (request.err) {
    applyErrorResponse(request);
    return next(false, request.err);
  }

  next(false, undefined, responseResult(request));
}

module.exports = {
  responseResult,
  applyErrorResponse,
  body,
  bodyItem,
  empty,
};
