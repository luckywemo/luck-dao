import { AlloraAPIClient, ChainSlug, PriceInferenceTimeframe, PriceInferenceToken } from "@alloralabs/allora-sdk";
import {
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";

export const DEFAULT_API_KEY = "UP-17f415babba7482cb4b446a1";
export const DEFAULT_BASE_API_URL = "https://api.allora.network/v2";

interface IAlloraPluginOptions {
  id?: string;
  name?: string;
  description?: string;
  apiClientConfig: {
    chainSlug?: ChainSlug;
    apiKey?: string;
    baseApiUrl?: string;
  };
}

class AlloraPlugin {
  private id: string;
  private name: string;
  private description: string;
  private alloraApiClient: AlloraAPIClient;

  constructor(options: IAlloraPluginOptions) {
    this.id = options.id || "allora_worker";
    this.name = options.name || "Allora Worker";
    this.description =
      options.description ||
      "Worker that interacts with the Allora Network for retrieving price inferences and inferences from the active topics on the network.";

    this.alloraApiClient = new AlloraAPIClient({
      chainSlug: options.apiClientConfig.chainSlug ?? ChainSlug.TESTNET,
      apiKey: options.apiClientConfig.apiKey ?? DEFAULT_API_KEY,
      baseAPIUrl: options.apiClientConfig.baseApiUrl ?? DEFAULT_BASE_API_URL,
    });
  }

  public getWorker(data?: {
    functions?: GameFunction<any>[];
    getEnvironment?: () => Promise<Record<string, any>>;
  }): GameWorker {
    return new GameWorker({
      id: this.id,
      name: this.name,
      description: this.description,
      functions: data?.functions || [
        this.getAllTopics,
        this.getInferenceByTopicId,
        this.getPriceInference,
      ],
      getEnvironment: data?.getEnvironment,
    });
  }

  get getAllTopics() {
    return new GameFunction({
      name: "get_all_topics",
      description: "Get all the topics available on Allora Network.",
      args: [] as const,
      hint: "This function will return all the topics available on Allora Network.",
      executable: async (_, logger) => {
        try {
          const topics = await this.alloraApiClient.getAllTopics();
          const successMessage = `Successfully retrieved all topics from Allora Network. The topics available on Allora Network are:\n ${JSON.stringify(topics, null, 2)}`;
          logger(successMessage);
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            successMessage
          );
        } catch (e: any) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            `An error occurred while fetching Allora Network topics: ${e.message || "Unknown error"}`
          );
        }
      },
    });
  }

  get getInferenceByTopicId() {
    return new GameFunction({
      name: "get_inference_by_topic_id",
      description: "Fetches an inference from Allora Network given a topic id.",
      args: [
        {
          name: "topicId",
          description:
            "The topic_id corresponds to the unique id of one of the active topics on Allora Network",
          type: "number",
        },
      ] as const,
      executable: async (args, logger) => {
        if (!args.topicId) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Topic id is required"
          );
        }
        try {
          const inferenceRes = await this.alloraApiClient.getInferenceByTopicID(Number(args.topicId));
          const inferenceValue = inferenceRes.inference_data.network_inference_normalized;
          const message = `Successfully retrieved inference for topic with id ${args.topicId}. The inference is: ${inferenceValue}`;

          logger(message);
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            message
          );
        } catch (e: any) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            `An error occurred while fetching inference from Allora Network: ${e.message || "Unknown error"}`
          );
        }
      },
    });
  }

  get getPriceInference() {
    return new GameFunction({
      name: "get_price_inference",
      description: "Fetches from Allora Network the future price inference for a given crypto asset and timeframe.",
      args: [
        { name: "asset", description: "The crypto asset symbol to get the price inference for. Example: BTC, ETH, SOL, SHIB, etc." },
        {
          name: "timeframe",
          description: "The timeframe to get the price inference for. Example: 5m, 8h etc.",
        },
      ] as const,
      executable: async (args, logger) => {
        try {
          const asset = args.asset?.toUpperCase();
          const timeframe = args.timeframe?.toLowerCase();

          if (!asset) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              "Asset is required"
            );
          }
          
          const supportedTokens = Object.values(PriceInferenceToken);
          if (!supportedTokens.includes(asset as PriceInferenceToken)) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              `Asset ${args.asset} is not supported. Supported assets are: ${supportedTokens.join(", ")}`
            );
          }
          
          if (!timeframe) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              "Timeframe is required"
            );
          }

          const supportedTimeframes = Object.values(PriceInferenceTimeframe);
          if (!supportedTimeframes.includes(args.timeframe as PriceInferenceTimeframe)) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              `Timeframe ${args.timeframe} is not supported. Supported timeframes are: ${supportedTimeframes.join(", ")}`
            );
          }

          logger(`Fetching price inference for ${asset} on Allora Network for ${timeframe} timeframe`);
          
          const inference = await this.alloraApiClient.getPriceInference(asset as PriceInferenceToken, timeframe as PriceInferenceTimeframe);

          const message = `The price inference for ${asset} in ${timeframe} is: ${inference.inference_data.network_inference_normalized}`;

          logger(message);

          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            message
          );
        } catch (e: any) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            `An error occurred while fetching ${args.asset} ${args.timeframe} price inference from Allora Network: ${e.message || "Unknown error"}`
          );
        }
      },
    });
  }

}

export default AlloraPlugin;
