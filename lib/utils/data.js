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

module.exports = {
  normalizeKeys,
  defaults,
  decode,
  clone,
};
