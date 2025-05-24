"use strict";

/**
 * Normalize keys
 */
function normalizeKeys(obj) {
  const result = {};

  if (obj) {
    for (const name in obj) {
      if (obj.hasOwnProperty(name)) {
        result[name.replace(/_/g, "").toLowerCase()] = obj[name];
      }
    }
  }

  return result;
}

/**
 * Defaults
 */
function defaults(obj) {
  if (!obj) obj = {};

  let src;
  for (let i = 0; i < arguments.length; i++) {
    src = arguments[i];
    for (const p in src) {
      if (src.hasOwnProperty(p) && !obj.hasOwnProperty(p)) {
        obj[p] = src[p];
      }
    }
  }

  return obj;
}

/**
 * Decode value
 */
function decode(value, opts) {
  if (typeof value !== "string") return value;
  value = Buffer.from(value, "base64");
  if (!opts || !opts.buffer) value = value.toString();
  return value;
}

/**
 * Shallow clone
 */
function clone(src) {
  const dst = {};

  for (const key in src) {
    if (src.hasOwnProperty(key)) {
      dst[key] = src[key];
    }
  }

  return dst;
}

/**
 * Mask sensitive token values for logging
 */
function maskToken(token) {
  if (!token || typeof token !== "string" || token.length < 8) {
    return token;
  }
  return `${token.substring(0, 4)}****${token.slice(-4)}`;
}

/**
 * Clone object and mask token fields for safe logging
 */
function cloneForLogging(src) {
  if (!src || typeof src !== "object") return src;

  const dst = {};

  for (const key in src) {
    if (src.hasOwnProperty(key)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "token" || lowerKey === "x-consul-token") {
        dst[key] = maskToken(src[key]);
      } else if (typeof src[key] === "object" && src[key] !== null) {
        dst[key] = cloneForLogging(src[key]);
      } else {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

module.exports = {
  normalizeKeys,
  defaults,
  decode,
  clone,
  maskToken,
  cloneForLogging,
};
