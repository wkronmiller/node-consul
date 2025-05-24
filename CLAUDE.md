# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js client library for [HashiCorp Consul](https://www.consul.io/), a service mesh solution that provides service discovery, configuration, and segmentation functionality. This client allows JavaScript applications to interact with the Consul HTTP API.

The repository is a fork of the deprecated [node-consul](https://github.com/silas/node-consul) package.

## Development Commands

### Installing Dependencies

```bash
npm install
```

### Testing

Run the full test suite (unit tests with code coverage):

```bash
npm test
```

Run only unit tests:

```bash
npm run mocha -- --recursive --check-leaks
```

Run TypeScript type definition tests:

```bash
npm run types
```

Run acceptance tests (requires Consul binary and additional setup):

```bash
# On macOS, first set up the required network interfaces
npm run acceptanceSetupMacOS

# Then run the acceptance tests
npm run acceptance
```

### Code Formatting

Format code with Prettier:

```bash
npm run format
```

Check code formatting without making changes:

```bash
prettier -c .
```

## Architecture

The library is organized around the Consul HTTP API structure:

1. **Main Client**: `Consul` class in `lib/consul.js` initializes all service endpoints.

2. **Service Endpoints**: Each Consul service (ACL, Agent, Catalog, etc.) is implemented as a separate module:

   - ACL: Access Control List management
   - Agent: Local agent operations
   - Catalog: Service registry operations
   - Event: User event handling
   - Health: Health check utilities
   - KV: Key-Value store operations
   - Query: Prepared query management
   - Session: Session management
   - Status: Cluster status information
   - Transaction: Transaction operations
   - Watch: Long polling mechanism for monitoring changes

3. **HTTP Client**: Uses the [papi](https://github.com/silas/node-papi) library for HTTP requests.

4. **TypeScript Support**: Full TypeScript type definitions are provided in `.d.ts` files.

## Important Patterns

### Promise-based API

All API methods return Promises, making them compatible with async/await:

```javascript
// Example
const consul = new Consul();
const services = await consul.agent.services();
```

### Watch Mechanism

The library implements a watch system for monitoring changes in Consul data:

```javascript
const watch = consul.watch({
  method: consul.kv.get,
  options: { key: "test" },
});

watch.on("change", (data, res) => {
  console.log("data changed:", data);
});

watch.on("error", (err) => {
  console.log("error:", err);
});

// Stop watching
watch.end();
```

### Common Options

Most API methods accept common options like datacenter (`dc`), consistency mode, and ACL tokens.

## Testing Strategy

1. **Unit Tests**: Use nock to mock HTTP responses and test client behavior.
2. **Type Tests**: Verify TypeScript typings work correctly.
3. **Acceptance Tests**: Require a running Consul cluster to test actual API interactions.

## Consul Setup for Testing

The acceptance tests spin up a local Consul cluster with 3 nodes:

- node1: 127.0.0.1 (bootstrap server)
- node2: 127.0.0.2
- node3: 127.0.0.3

The tests verify the client's ability to interact with the real Consul API.
