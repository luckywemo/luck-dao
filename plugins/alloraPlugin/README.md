# Allora Plugin for Virtuals Game

The [Allora Network](https://allora.network) plugin seamlessly empowers G.A.M.E agents with real-time, advanced, self-improving AI inferences, delivering high-performance insights without introducing any additional complexity.

### Features
- Get price inferences for various assets and timeframes
- Get all available topics on Allora Network
- Fetch inferences by topic ID

### Available Functions
1. `getPriceInference`: Fetches the price inference for the specified asset and a timeframe
2. `getAllTopics`: Retrieves all available topics on Allora Network
3. `getInferenceByTopicId`: Fetches the latest inference for a specific topic


## Installation

To install the plugin, use npm or yarn:

```bash
npm install @virtuals-protocol/game-allora-plugin
```

or

```bash
yarn add @virtuals-protocol/game-allora-plugin
```

## Usage

### Importing the Plugin

First, import the `AlloraPlugin` class from the plugin:

```typescript
import AlloraPlugin from "@virtuals-protocol/game-allora-plugin";
```

### Setup environment variables

Set the following environment variables:
  - `ALLORA_API_KEY`: Create an API key by [creating an account](https://developer.upshot.xyz/signup).
  - `ALLORA_CHAIN_SLUG` (Optional): Must be one of: `mainnet`, `testnet`. Default value: `testnet`

### Creating a Worker

Create a worker with the necessary Allora API client config:

```typescript
const alloraPlugin = new AlloraPlugin({
  apiClientConfig: {
    chainSlug: process.env.ALLORA_CHAIN_SLUG as ChainSlug, // Should be one of "testnet" or "mainnet". Default: "testnet"
    apiKey: process.env.ALLORA_API_KEY, // Default key: UP-17f415babba7482cb4b446a1
  },
});
```

### Creating an Agent

Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("GAME_API_KEY", {
  name: "Allora Worker",
  goal: "Retrieve the price of ETH in 5 minutes.",
  description: "You are an AI agent able to fetch price inferences and topic inferences from Allora Network.",
  workers: [alloraPlugin.getWorker({})],
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
