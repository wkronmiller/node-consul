"use strict";

const http = require("http");
const https = require("https");

/**
 * Get HTTP agent
 */
function getAgent(baseUrl) {
  if (!baseUrl) return;

  let secure;
  if (typeof baseUrl === "string") {
    secure = !!baseUrl.match(/^https:/i);
  } else if (baseUrl.protocol) {
    secure = baseUrl.protocol === "https:";
  } else {
    return;
  }

  const Agent = secure ? https.Agent : http.Agent;
  return new Agent({ keepAlive: true });
}

module.exports = {
  getAgent,
};
