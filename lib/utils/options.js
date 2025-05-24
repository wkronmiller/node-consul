"use strict";

const constants = require("../constants");
const { normalizeKeys } = require("./data");
const { parseDuration } = require("./time");

/**
 * Common options
 */
function options(req, opts, ignore) {
  if (!opts) opts = {};
  if (!ignore) ignore = {};

  if (!req.headers) req.headers = {};

  // headers
  if (opts.token && !ignore.token) req.headers["x-consul-token"] = opts.token;

  // query
  if (!req.query) req.query = {};

  if (opts.dc && !ignore.dc) req.query.dc = opts.dc;
  if (opts.partition && !ignore.partition) req.query.partition = opts.partition;
  if (opts.wan && !ignore.wan) req.query.wan = "1";

  if (opts.consistent && !ignore.consistent) {
    req.query.consistent = "1";
  } else if (opts.stale && !ignore.stale) {
    req.query.stale = "1";
  }

  if (opts.hasOwnProperty("index") && !ignore.index)
    req.query.index = opts.index;
  if (opts.hasOwnProperty("wait") && !ignore.wait) req.query.wait = opts.wait;
  if (opts.hasOwnProperty("near") && !ignore.near) req.query.near = opts.near;
  if (opts.hasOwnProperty("node-meta") && !ignore["node-meta"]) {
    req.query["node-meta"] = opts["node-meta"];
  }
  if (opts.hasOwnProperty("filter") && !ignore.filter)
    req.query.filter = opts.filter;

  // papi
  if (opts.hasOwnProperty("ctx") && !ignore.ctx) req.ctx = opts.ctx;
  if (opts.hasOwnProperty("timeout") && !ignore.timeout) {
    if (typeof opts.timeout === "string") {
      req.timeout = parseDuration(opts.timeout);
    } else {
      req.timeout = opts.timeout;
    }
  }
}

/**
 * Default common options
 */
function defaultCommonOptions(opts) {
  opts = normalizeKeys(opts);
  let defaults;

  constants.DEFAULT_OPTIONS.forEach(function (key) {
    if (!opts.hasOwnProperty(key)) return;
    if (!defaults) defaults = {};
    defaults[key] = opts[key];
  });

  return defaults;
}

module.exports = {
  options,
  defaultCommonOptions,
};
