import {
  GameAgent,
  GameFunction,
  GameWorker,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";
import AdNetworkPlugin from "./adNetworkPlugin";
// import TwitterPlugin from "@virtuals-protocol/game-twitter-plugin";

// Original Twitter plugin implementation (commented out)
/*
const twitterPlugin = new TwitterPlugin({
  credentials: {
    apiKey: "your_api_key",
    apiSecretKey: "your_api_secret_key",
    accessToken: "your_access_token",
    accessTokenSecret: "your_access_token_secret",
  },
});
*/

// Mock Twitter client implementation for testing purposes
class MockTwitterClient {
  private id: string = "mock-twitter";
  private name: string = "Mock Twitter";
  private description: string =
    "A mock Twitter client that logs tweets instead of sending them";

  public getWorker(data?: {
    functions?: GameFunction<any>[];
    getEnvironment?: () => Promise<Record<string, any>>;
  }): GameWorker {
    return new GameWorker({
      id: this.id,
      name: this.name,
      description: this.description,
      functions: data?.functions || [this.sendTweetFunction],
      getEnvironment: data?.getEnvironment,
    });
  }

  get sendTweetFunction(): GameFunction<any> {
    return new GameFunction({
      name: "sendTweet",
      description:
        "Send a tweet (mock implementation that just logs the tweet) write your full actual tweet here",
      args: [
        {
          name: "text",
          type: "string",
          description: "The text content of the tweet",
        },
      ],
      executable: async (args, logger) => {
        try {
          const text = args.text;
          console.log(`[MOCK TWITTER] Would tweet: "${text}"`);
          logger(`Mock tweet sent: "${text}"`);

          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            "Successfully sent mock tweet"
          );
        } catch (e) {
          console.error(e);
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Failed to send mock tweet"
          );
        }
      },
    });
  }
}

const mockTwitterClient = new MockTwitterClient();

// Create a worker with the functions
const adNetworkPlugin = new AdNetworkPlugin({
  apiKey: process.env.MONITIZE_API_KEY || "",
});

// Create an agent with the worker
const agent = new GameAgent(process.env.VIRTUALS_API_KEY || "", {
  name: "Ad Network Bot",
  goal: "Increase revenue by effectively utilizing the ad network to promote campaigns in its portfolio in social media platforms",
  description:
    "A bot designed to promote campaigns in its portfolio in social media platforms to get revenue by leveraging the ad network",
  workers: [adNetworkPlugin.getWorker({}), mockTwitterClient.getWorker()],
});

(async () => {
  try {
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
  } catch (error) {
    console.error(error);
  }
})();
