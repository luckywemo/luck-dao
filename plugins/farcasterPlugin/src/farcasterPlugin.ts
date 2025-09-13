import {
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";
import { FarcasterActionProvider } from "@coinbase/agentkit";

interface IFarcasterPluginOptions {
  id?: string;
  name?: string;
  description?: string;
  credentials: {
    neynarApiKey: string;
    neynarSignerUuid: string;
    neynarAgentFid: string;
  };
}

class FarcasterPlugin {
  private id: string;
  private name: string;
  private description: string;
  private farcastActionProvider: FarcasterActionProvider;

  constructor(options: IFarcasterPluginOptions) {
    this.id = options.id || "farcaster_worker";
    this.name = options.name || "Farcaster Worker";
    this.description =
      options.description ||
      "A worker that will execute tasks within the Farcaster Social Platform. It is capable of posting, replying, recasting and liking casts.";
      this.farcastActionProvider = new FarcasterActionProvider({neynarApiKey: options.credentials.neynarApiKey, signerUuid: options.credentials.neynarSignerUuid, agentFid: options.credentials.neynarAgentFid});
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
        this.postCastFunction,
      ],
      getEnvironment: data?.getEnvironment || this.getMetrics.bind(this),
    });
  }

  public async getMetrics() {
    // Since getFarcasterProfile is not available in AgentKit, return basic metrics
    return {
      followers: 0,
      following: 0,
      casts: 0,
    };
  }

  get postCastFunction() {
    return new GameFunction({
      name: "post_cast",
      description: "Post a cast",
      args: [
        { name: "text", description: "The cast content" },
        {
          name: "cast_reasoning",
          description: "The reasoning behind the cast",
        },
      ] as const,
      executable: async (args, logger) => {
        try {
          if (!args.text) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              "Cast content is required"
            );
          }

          logger(`Posting cast: ${args.text}`);
          await this.farcastActionProvider.postCast({ castText: args.text });
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            "Cast posted"
          );
        } catch (e) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Failed to post cast"
          );
        }
      },
    });
  }
}

export default FarcasterPlugin;
