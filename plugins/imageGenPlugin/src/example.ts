import { config } from 'dotenv';
config({ path: './.env' });

import { GameAgent } from "@virtuals-protocol/game";
import ImageGenPlugin from ".";

const imageGenPlugin = new ImageGenPlugin({
  apiClientConfig: {
    apiKey: process.env.TOGETHER_API_KEY, // Default key: UP-17f415babba7482cb4b446a1
  },
});

// Create an agent with the worker
const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
  name: "Image Generation Worker",
  goal: "Generate an anime-style character image with Twitter logo.",
  description: "You are an AI agent specialized in generating images. You can create images based on text prompts using Together AI's FLUX schnell model.",
  workers: [
    imageGenPlugin.getWorker({}),
  ],
});

(async () => {
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