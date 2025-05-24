"use strict";

const constants = require("../constants");

/**
 * Parse duration
 */
function parseDuration(value) {
  if (typeof value === "number") return value / 1e6;
  if (typeof value !== "string") return;

  let n;
  let m = value.match(/^(\d*\.?\d*)$/);

  if (m) {
    n = parseFloat(m[1]);

    if (!isNaN(n)) return n / 1e6;
  }

  m = value.match(/^([\d.]*)(ns|us|ms|s|m|h)$/);

  if (!m) return;

  n = parseFloat(m[1]);

  if (isNaN(n)) return;

  return (n * constants.DURATION_UNITS[m[2]]) / 1e6;
}

/**
 * Return BigInt or undefined if parse failed.
 */
function safeBigInt(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  try {
    return BigInt(value);
  } catch (err) {
    return undefined;
  }
}

/**
 * Set timeout with cancel support
 */
function setTimeoutContext(fn, ctx, timeout) {
  let id;

  const cancel = function () {
    clearTimeout(id);
  };

  id = setTimeout(function () {
    ctx.removeListener("cancel", cancel);

    fn();
  }, timeout);

  ctx.once("cancel", cancel);
}

/**
 * Has the Consul index changed.
 */
function hasIndexChanged(index, prevIndex) {
  if (typeof index !== "bigint" || index <= 0) return false;
  if (typeof prevIndex !== "bigint") return true;
  return index > prevIndex;
}

/**
 * Parse query meta
 */
function parseQueryMeta(res) {
  const meta = {};

  if (res && res.headers) {
    if (res.headers["x-consul-index"]) {
      meta.LastIndex = res.headers["x-consul-index"];
    }
    if (res.headers["x-consul-lastcontact"]) {
      meta.LastContact = parseInt(res.headers["x-consul-lastcontact"], 10);
    }
    if (res.headers["x-consul-knownleader"]) {
      meta.KnownLeader = res.headers["x-consul-knownleader"] === "true";
    }
    if (res.headers["x-consul-translate-addresses"]) {
      meta.AddressTranslationEnabled =
        res.headers["x-consul-translate-addresses"] === "true";
    }
  }

  return meta;
}

module.exports = {
  parseDuration,
  safeBigInt,
  setTimeoutContext,
  hasIndexChanged,
  parseQueryMeta,
};
