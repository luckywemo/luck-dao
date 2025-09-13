# Image Generation Plugin for Virtuals Game

The Image Generation plugin seamlessly empowers G.A.M.E agents with AI-powered image generation capabilities using Together AI's FLUX schnell model, enabling the creation of custom images from text prompts without introducing any additional complexity.

### Features
- Generate custom images based on text prompts
- Customize image dimensions up to 1440x1440
- Receive images as temporary URLs
- Built-in error handling and status tracking

### Available Functions
1. `generateImage`: Creates an AI-generated image based on the provided text prompt and optional dimensions

## Installation

To install the plugin, use npm or yarn:

```bash
npm install @virtuals-protocol/game-imagegen-plugin
```

or

```bash
yarn add @virtuals-protocol/game-imagegen-plugin
```

## Usage

### Importing the Plugin

First, import the `ImageGenPlugin` class from the plugin:

```typescript
import ImageGenPlugin from "@virtuals-protocol/game-imagegen-plugin";
```

### Setup environment variables

Set the following environment variables:
- `TOGETHER_API_KEY`: Create an API key by [creating an account](https://together.ai).

### Creating a Worker

Create a worker with the necessary Together AI client config:

```typescript
const imageGenPlugin = new ImageGenPlugin({
  apiClientConfig: {
    apiKey: process.env.TOGETHER_API_KEY, // Default key: UP-17f415babba7482cb4b446a1
  },
});
```

### Creating an Agent

Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("GAME_API_KEY", {
  name: "Image Generation Worker",
  goal: "Generate an anime-style character image.",
  description: "You are an AI agent specialized in generating images based on text prompts.",
  workers: [imageGenPlugin.getWorker({})],
});
```

### Running the Agent

Initialize and run the agent:

```typescript
(async () => {
  // Optional: Set up logging
  agent.setLogger((agent, message) => {
    console.log(`-----[${agent.name}]-----`);
    console.log(message);
    console.log("\n");
  });

  await agent.init();

  while (true) {
    await agent.step({
      verbose: true,
    });
  }
})();
```

### Example Worker Usage

Here's a simple example of using the worker directly:

```typescript
const worker = imageGenPlugin.getWorker({});

// The worker will automatically use the generate_image function
// to create an image based on the prompt
worker.run("Cute anime character with Twitter logo on outfit");
```

### Configuration Options

The plugin accepts the following configuration options when initializing:

```typescript
interface IImageGenPluginOptions {
  id?: string;                    // Custom worker ID
  name?: string;                  // Custom worker name
  description?: string;           // Custom worker description
  apiClientConfig: {
    apiKey?: string;             // Together AI API key
    baseApiUrl?: string;         // Custom API endpoint (optional)
  };
}
```

### Advanced Usage

You can customize the image generation parameters:

```typescript
const worker = imageGenPlugin.getWorker({});

// Generate a custom-sized image
worker.run({
  prompt: "A beautiful landscape at sunset",
  width: 1024,  // Default: 1024, max: 1440
  height: 768   // Default: 1024, max: 1440
});
```

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
export GAME_API_KEY="your-game-api-key"
export TOGETHER_API_KEY="your-together-api-key" # Default key: UP-17f415babba7482cb4b446a1
```

4. Build the plugin:
```bash
npm run tsup
```

5. Run the example:
```bash
ts-node examples/example.ts
```
