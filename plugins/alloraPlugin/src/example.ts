import { ChainSlug, PriceInferenceTimeframe, PriceInferenceToken } from "@alloralabs/allora-sdk";
import { GameAgent } from "@virtuals-protocol/game";
import AlloraPlugin from ".";


const alloraPlugin = new AlloraPlugin({
  apiClientConfig: {
    chainSlug: process.env.ALLORA_CHAIN_SLUG as ChainSlug,
    apiKey: process.env.ALLORA_API_KEY, // Default key: UP-17f415babba7482cb4b446a1
  },
});

// Create an agent with the worker
const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
  name: "Allora Worker",
  goal: "Get the 5m price inference for BTC and Luna from Allora Network.",
  description: `You are an AI agent specialized in Allora Network.
You are able to get price inferences from Allora Network and provide users insights into future price of different crypto assets.
You are able to get details about the topics deployed on Allora Network and provide users insights into the topics.
For all the active topics, you are able to get the latest inference using the topic id.
The available assets for price inferences worker are ${Object.values(PriceInferenceToken).join(", ")};
for the following timeframes: ${Object.values(PriceInferenceTimeframe).join(", ")}.
If a price inference is not available for a specific asset and timeframe,
you should determine the topic id for the asset and timeframe and use the topics inferences worker to get the latest inference 
for the specified asset and timeframe. This will return the equivalent of a price inference for the asset and timeframe.
  `,
  workers: [
    alloraPlugin.getWorker({}),
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
