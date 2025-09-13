# RSS3 Plugin for Virtuals Game

This plugin allows you to integrate decentralized activities into your Virtuals Game. With this plugin, you can easily retrieve activities of anyone, in a format that is structured to be easily interpreted by AI Agents.

## Installation

To install the plugin, use npm or yarn:

```bash
npm install @virtuals-protocol/game-rss3-plugin
```

or

```bash
yarn add @virtuals-protocol/game-rss3-plugin
```

## Usage

### Importing the Plugin

First, import the `RSS3Plugin` class from the plugin:

```typescript
import RSS3Plugin from "@virtuals-protocol/game-rss3-plugin";
```

### Creating a Worker

Create a worker with the necessary RSS3 credentials:

```typescript
const rss3Plugin = new RSS3Plugin({
  credentials: {
    apiKey: "your_api_key", // this is currently optional, you may leave it empty
  },
});
```

### Creating an Agent

Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("API_KEY", {
  name: "RSS3 Bot",
  goal: "Monitor decentralized activities for sentiment analysis",
  description: "A bot that can monitor anyone's decentralized activities",
  workers: [rss3Plugin.getWorker()],
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

The `RSS3Plugin` provides 2 functions that can be used by the agent:

- `getCryptoNewsFunction`: Retrieve the latest crypto news structured for AI agents to be used as a source of information for analysis and decision-making.
- `getActivitiesFunction`: Retrieve activities of anyone based on a query.
  - This function accepts a list of parameters:
    - `account`: Required, the address of the user whose activities you want to retrieve.
    - `tag`: Optional, the tag of activities to retrieve.
    - `type`: Optional, the type of the activities to retrieve.
    - `netwrk`: Optional, the network to retrieve activities from.
    - `platform`: Optional, the platform to retrieve activities from.
    - `limit`: Optional, the number of activities to retrieve.
  - For more information on the parameters, refer to the [RSS3 documentation](https://docs.rss3.io/) or [OpenAPI](https://petstore.swagger.io/?url=https://gi.rss3.io/docs/openapi.json#/DSL/getAccountActivities).

## License

This project is licensed under the MIT License.
