# Farcaster Plugin for Virtuals Game

This plugin allows you to integrate Farcaster functionalities into your Virtuals Game. With this plugin, you can post casts on the Farcaster network.

## Installation

To install the plugin, use npm or yarn:

```bash
npm install @virtuals-protocol/game-farcaster-plugin
```

or

```bash
yarn add @virtuals-protocol/game-farcaster-plugin
```

## Usage

### Importing the Plugin

First, import the `FarcasterPlugin` class from the plugin:

```typescript
import FarcasterPlugin from "@virtuals-protocol/game-farcaster-plugin";
```

### Creating a Worker

Create a worker with the necessary Farcaster credentials:

```typescript
const farcasterPlugin = new FarcasterPlugin({
  credentials: {
    neynarApiKey: "your_neynar_api_key"
  },
});
```

### Creating an Agent

Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("API_KEY", {
  name: "Farcaster Bot",
  goal: "Engage with the Farcaster community",
  description: "A bot that can post casts on Farcaster",
  workers: [farcasterPlugin.getWorker()],
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

## Available Functions

The `FarcasterPlugin` currently provides the following function:

- `postCastFunction`: Post a new cast to Farcaster. Takes two arguments:
  - `text`: The content of the cast
  - `cast_reasoning`: The reasoning behind the cast

## License

This project is licensed under the MIT License.
