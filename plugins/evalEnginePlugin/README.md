# Eval Engine Twitter Plugin for Virtuals Game

This plugin allows you to integrate Twitter functionalities into your Virtuals Game with [Eval Engine](https://evalengine.ai). With this plugin, you can post tweets, reply to tweets, like tweets, and more.

> This plugin is built on top of twitterPlugin. It logs the performance of your AI Agent and prevents spammy replies

## Installation

Setup Chromia Private Key: [Guide](https://github.com/evalengine/eval-docs/blob/main/setup-chromia-account.md)

To install the plugin, use npm or yarn:

```bash
npm install @virtuals-protocol/game-eval-engine-plugin
```

or

```bash
yarn add @virtuals-protocol/game-eval-engine-plugin
```

## Usage

### Importing the Plugin

First, import the `TwitterPlugin` class from the plugin:

```typescript
import TwitterEvalEnginePlugin from "@virtuals-protocol/game-eval-engine-plugin";
```

### Creating a Worker

Create a worker with the necessary Twitter credentials:

```typescript
  const evalClient = await initEvalClient(PRIVATE_KEY);

  const twitterPlugin = new TwitterEvalEnginePlugin({
    credentials: {
      apiKey: X_API_KEY,
      apiSecretKey: X_API_KEY_SECRET,
      accessToken: X_ACCESS_TOKEN,
      accessTokenSecret: X_ACCESS_TOKEN_SECRET,
    },
    thresholdScore: 0.5,
    evalClient,
  });

```

### Creating an Agent

Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("API_KEY", {
  name: "Twitter Bot",
  goal: "Increase engagement and grow follower count",
  description: "A bot that can post tweets, reply to tweets, and like tweets",
  workers: [twitterPlugin.getWorker()],
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

The `TwitterPlugin` provides several functions that can be used by the agent:

- `searchTweetsFunction`: Search for tweets based on a query.
- `replyTweetFunction`: Reply to a tweet.
- `postTweetFunction`: Post a new tweet.
- `likeTweetFunction`: Like a tweet.
- `quoteTweetFunction`: Quote a tweet with your own commentary.

## License

This project is licensed under the MIT License.
