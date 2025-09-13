# ATTPs Plugin for Virtuals Game

The ATTPs Plugin enables G.A.M.E agents to interact with the ATTPs Platform, providing capabilities for agent creation, data verification, and price querying functionalities.

### Features
- Create and register new agents on the ATTPs Platform
- Verify data with agent signatures
- Query price data from various feeds

### Available Functions
1. `createAndRegisterAgent`: Creates and registers a new agent with specified signers and settings
2. `verifyData`: Verifies data with provided signatures and metadata
3. `priceQuery`: Fetches price data for specific feeds and agents

## Installation

To install the plugin, use npm or yarn:

```bash
npm install @virtuals-protocol/game-attps-plugin
```

or

```bash
yarn add @virtuals-protocol/game-attps-plugin
```

## Usage

### Importing the Plugin

First, import the `AttpsPlugin` class from the plugin:

```typescript
import AttpsPlugin from "@virtuals-protocol/game-attps-plugin";
```

### Setup environment variables

Set the following environment variables:
  - `RPC_URL`: The RPC URL for the blockchain network
  - `PRIVATE_KEY`: Your private key for transaction signing
  - `PROXY_ADDRESS`: The proxy address for the ATTPs Platform

### Creating a Worker

Create a worker with the necessary credentials:

```typescript
const attpsPlugin = new AttpsPlugin({
  credentials: {
    proxyAddress: process.env.PROXY_ADDRESS,
    privateKey: process.env.PRIVATE_KEY,
    rpcUrl: process.env.RPC_URL,
  }
});
```

### Creating an Agent

Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("GAME_API_KEY", {
  name: "ATTPs Bot",
  goal: "Create agents, verify data, and query price data.",
  description: "A bot that can interact with the ATTPs Platform",
  workers: [attpsPlugin.getWorker({})],
});
```

### Running the Agent

Initialize and run the agent:

```typescript
(async () => {
  await agent.init();

  while (true) {
    await agent.step({
      verbose: true,
    });
  }
})();
```
