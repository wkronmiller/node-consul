"use strict";

const { normalizeKeys } = require("./data");

function _createTaggedAddress(src) {
  const dst = {};

  if (src.hasOwnProperty("address")) dst.Address = src.address;
  if (src.hasOwnProperty("port")) dst.Port = src.port;

  return dst;
}

function _createTaggedAddresses(src) {
  const dst = {};

  if (src.lan) {
    dst.lan = _createTaggedAddress(normalizeKeys(src.lan));
  }
  if (src.wan) {
    dst.wan = _createTaggedAddress(normalizeKeys(src.wan));
  }

  return dst;
}

/**
 * Create node/server-level check object
 * Corresponds to CheckType in Consul Agent Endpoint:
 * https://developer.hashicorp.com/consul/docs/services/usage/checks
 */
function _createServiceCheck(src) {
  const dst = {};
  if (src.hasOwnProperty("checkid")) dst.CheckID = src.checkid;
  if (src.hasOwnProperty("name")) dst.Name = src.name;
  if (src.hasOwnProperty("notes")) dst.Notes = src.notes;

  if (
    (src.grpc ||
      src.h2ping ||
      src.http ||
      src.tcp ||
      src.udp ||
      src.args ||
      src.script) &&
    src.interval
  ) {
    if (src.grpc) {
      dst.GRPC = src.grpc;
      if (src.hasOwnProperty("grpcusetls")) dst.GRPCUseTLS = src.grpcusetls;
    } else if (src.h2ping) {
      dst.H2Ping = src.h2ping;
      if (src.hasOwnProperty("h2pingusetls")) {
        dst.H2PingUseTLS = src.h2pingusetls;
      }
    } else if (src.http) {
      dst.HTTP = src.http;
      if (src.hasOwnProperty("body")) dst.Body = src.body;
      if (src.hasOwnProperty("disableredirects")) {
        dst.DisableRedirects = src.disableredirects;
      }
      if (src.hasOwnProperty("header")) dst.Header = src.header;
      if (src.hasOwnProperty("method")) dst.Method = src.method;
    } else if (src.tcp) {
      dst.TCP = src.tcp;
      if (src.hasOwnProperty("tcpusetls")) dst.TCPUseTLS = src.tcpusetls;
    } else if (src.udp) {
      dst.UDP = src.udp;
    } else {
      if (src.args) {
        dst.Args = src.args;
      } else {
        dst.Script = src.script;
      }
      if (src.hasOwnProperty("dockercontainerid"))
        dst.DockerContainerID = src.dockercontainerid;
      if (src.hasOwnProperty("shell")) dst.Shell = src.shell;
    }
    dst.Interval = src.interval;
    if (src.hasOwnProperty("outputmaxsize")) {
      dst.OutputMaxSize = src.outputmaxsize;
    }
    if (src.hasOwnProperty("timeout")) dst.Timeout = src.timeout;
    if (src.hasOwnProperty("tlsservername")) {
      dst.TLSServerName = src.tlsservername;
    }
    if (src.hasOwnProperty("tlsskipverify")) {
      dst.TLSSkipVerify = src.tlsskipverify;
    }
  } else if (src.ttl) {
    dst.TTL = src.ttl;
  } else if (src.aliasnode || src.aliasservice) {
    if (src.hasOwnProperty("aliasnode")) dst.AliasNode = src.aliasnode;
    if (src.hasOwnProperty("aliasservice")) dst.AliasService = src.aliasservice;
  } else {
    throw new Error(
      "args/grpc/h2ping/http/tcp/udp and interval, ttl, or aliasnode/aliasservice",
    );
  }
  if (src.hasOwnProperty("notes")) dst.Notes = src.notes;
  if (src.hasOwnProperty("status")) dst.Status = src.status;
  if (src.hasOwnProperty("deregistercriticalserviceafter")) {
    dst.DeregisterCriticalServiceAfter = src.deregistercriticalserviceafter;
  }
  if (src.hasOwnProperty("failuresbeforewarning")) {
    dst.FailuresBeforeWarning = src.failuresbeforewarning;
  }
  if (src.hasOwnProperty("failuresbeforecritical")) {
    dst.FailuresBeforeCritical = src.failuresbeforecritical;
  }
  if (src.hasOwnProperty("successbeforepassing")) {
    dst.SuccessBeforePassing = src.successbeforepassing;
  }

  return dst;
}

function createServiceCheck(src) {
  return _createServiceCheck(normalizeKeys(src));
}

function _createServiceProxy(src) {
  const dst = {};

  if (src.destinationservicename) {
    dst.DestinationServiceName = src.destinationservicename;
  } else {
    throw Error("destinationservicename required");
  }
  if (src.destinationserviceid)
    dst.DestinationServiceID = src.destinationserviceid;
  if (src.localserviceaddress)
    dst.LocalServiceAddress = src.localserviceaddress;
  if (src.hasOwnProperty("localserviceport"))
    dst.LocalServicePort = src.localserviceport;
  if (src.config) dst.Config = src.config;
  if (src.upstreams) dst.Upstreams = src.upstreams;
  if (src.meshgateway) dst.MeshGateway = src.meshgateway;
  if (src.expose) dst.Expose = src.expose;

  return dst;
}

function _createService(src, isSidecar) {
  const dst = {};

  if (src.name) dst.Name = src.name;
  if (src.id) dst.ID = src.id;
  if (src.tags) dst.Tags = src.tags;
  if (src.meta) dst.Meta = src.meta;
  if (src.hasOwnProperty("address")) dst.Address = src.address;
  if (src.hasOwnProperty("port")) dst.Port = src.port;

  if (Array.isArray(src.checks)) {
    dst.Checks = src.checks.map(createServiceCheck);
  } else if (src.check) {
    dst.Check = createServiceCheck(src.check);
  }

  if (src.connect) {
    const connect = normalizeKeys(src.connect);

    dst.Connect = {};
    if (connect.hasOwnProperty("native")) dst.Connect.Native = connect.native;

    if (connect.proxy) {
      dst.Connect.Proxy = _createServiceProxy(normalizeKeys(connect.proxy));
    }

    if (connect.sidecarservice) {
      if (!isSidecar) {
        dst.Connect.SidecarService = _createService(
          normalizeKeys(connect.sidecarservice),
          true,
        );
      } else {
        throw new Error("sidecarservice cannot be nested");
      }
    }
  }

  if (src.proxy) {
    dst.Proxy = _createServiceProxy(normalizeKeys(src.proxy));
  }

  if (src.taggedaddresses) {
    dst.TaggedAddresses = _createTaggedAddresses(
      normalizeKeys(src.taggedaddresses),
    );
  }

  return dst;
}

function _createCatalogService(src) {
  const dst = {};

  if (src.id) dst.ID = src.id;
  if (src.service) dst.Service = src.service;
  if (src.tags) dst.Tags = src.tags;
  if (src.meta) dst.Meta = src.meta;
  if (src.hasOwnProperty("address")) dst.Address = src.address;
  if (src.hasOwnProperty("port")) dst.Port = src.port;

  return dst;
}

function createCatalogService(src) {
  return _createCatalogService(normalizeKeys(src));
}

function _createHealthCheckDefinition(src) {
  const dst = {};

  if (src.http) {
    dst.HTTP = src.http;
    if (src.hasOwnProperty("tlsskipverify"))
      dst.TLSSkipVerify = src.tlsskipverify;
    if (src.hasOwnProperty("tlsservername"))
      dst.TLSServerName = src.tlsservername;
  } else if (src.tcp) {
    dst.TCP = src.tcp;
  } else {
    throw Error("at least one of http/tcp is required");
  }

  dst.IntervalDuration = src.intervalduration;
  if (src.hasOwnProperty("timeoutduration"))
    dst.TimeoutDuration = src.timeoutduration;
  if (src.hasOwnProperty("deregistercriticalserviceafterduration")) {
    dst.DeregisterCriticalServiceAfterDuration =
      src.deregistercriticalserviceafterduration;
  }

  return dst;
}

function createHealthCheckDefininition(src) {
  return _createHealthCheckDefinition(normalizeKeys(src));
}

function _createCatalogCheck(src) {
  const dst = {};

  if (src.hasOwnProperty("checkid")) dst.CheckID = src.checkid;
  if (src.hasOwnProperty("name")) dst.Name = src.name;
  if (src.hasOwnProperty("node")) dst.Node = src.node;
  if (src.hasOwnProperty("serviceid")) dst.ServiceID = src.serviceid;
  if (src.hasOwnProperty("definition"))
    dst.Definition = createHealthCheckDefininition(src.definition);
  if (src.hasOwnProperty("notes")) dst.Notes = src.notes;
  if (src.hasOwnProperty("status")) dst.Status = src.status;

  return dst;
}

function createCatalogCheck(src) {
  return _createCatalogCheck(normalizeKeys(src));
}

function _createCatalogRegistration(src) {
  const dst = {};

  if (src.id) dst.ID = src.id;
  if (src.node) dst.Node = src.node;
  if (src.nodemeta) dst.NodeMeta = src.nodemeta;
  if (src.skipnodeupdate) dst.SkipNodeUpdate = src.skipnodeupdate;
  if (src.hasOwnProperty("address")) dst.Address = src.address;

  if (src.service) dst.Service = createCatalogService(src.service);

  if (Array.isArray(src.checks)) {
    dst.Checks = src.checks.map(createCatalogCheck);
  } else if (src.check) {
    dst.Check = createCatalogCheck(src.check);
  }

  if (src.taggedaddresses) {
    dst.TaggedAddresses = _createTaggedAddresses(
      normalizeKeys(src.taggedaddresses),
    );
  }

  return dst;
}

function _createCatalogDeregistration(src) {
  const dst = {};

  if (src.node) dst.Node = src.node;
  if (src.checkid) dst.CheckID = src.checkid;
  if (src.serviceid) dst.ServiceID = src.serviceid;

  return dst;
}

function createCatalogRegistration(src) {
  return _createCatalogRegistration(normalizeKeys(src));
}

function createCatalogDeregistration(src) {
  return _createCatalogDeregistration(normalizeKeys(src));
}

function createService(src) {
  return _createService(normalizeKeys(src));
}

/**
 * Create standalone check object
 * Corresponds to CheckDefinition in Consul Agent Endpoint:
 * https://github.com/hashicorp/consul/blob/master/command/agent/structs.go#L47
 * Corresponds to AgentCheckRegistration in Consul Go API:
 * https://github.com/hashicorp/consul/blob/master/api/agent.go#L57
 */
function createCheck(src) {
  src = normalizeKeys(src);

  const dst = _createServiceCheck(src);

  if (src.name) {
    dst.Name = src.name;
  } else {
    throw new Error("name required");
  }

  if (src.hasOwnProperty("id")) dst.ID = src.id;
  if (src.hasOwnProperty("serviceid")) dst.ServiceID = src.serviceid;

  return dst;
}

module.exports = {
  createServiceCheck,
  createService,
  createCheck,
  createCatalogRegistration,
  createCatalogDeregistration,
  createCatalogService,
};
