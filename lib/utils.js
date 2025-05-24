"use strict";

// Import from focused modules
const { getAgent } = require("./utils/http");
const {
  responseResult,
  applyErrorResponse,
  body,
  bodyItem,
  empty,
} = require("./utils/response");
const {
  normalizeKeys,
  defaults,
  decode,
  clone,
  maskToken,
  cloneForLogging,
} = require("./utils/data");
const {
  parseDuration,
  safeBigInt,
  setTimeoutContext,
  hasIndexChanged,
  parseQueryMeta,
} = require("./utils/time");
const { options, defaultCommonOptions } = require("./utils/options");
const {
  createServiceCheck,
  createService,
  createCheck,
  createCatalogRegistration,
  createCatalogDeregistration,
  createCatalogService,
} = require("./utils/builders");

// Export all functions for backward compatibility
exports.getAgent = getAgent;
exports.responseResult = responseResult;
exports.applyErrorResponse = applyErrorResponse;
exports.body = body;
exports.bodyItem = bodyItem;
exports.decode = decode;
exports.empty = empty;
exports.normalizeKeys = normalizeKeys;
exports.defaults = defaults;
exports.options = options;
exports.defaultCommonOptions = defaultCommonOptions;
exports.clone = clone;
exports.parseDuration = parseDuration;
exports.safeBigInt = safeBigInt;
exports.setTimeoutContext = setTimeoutContext;
exports.createServiceCheck = createServiceCheck;
exports.createService = createService;
exports.createCheck = createCheck;
exports.createCatalogRegistration = createCatalogRegistration;
exports.createCatalogDeregistration = createCatalogDeregistration;
exports.createCatalogService = createCatalogService;
exports.hasIndexChanged = hasIndexChanged;
exports.parseQueryMeta = parseQueryMeta;
exports.maskToken = maskToken;
exports.cloneForLogging = cloneForLogging;
