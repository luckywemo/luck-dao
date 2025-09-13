import { GameWorker, GameFunction, ExecutableGameFunctionResponse, ExecutableGameFunctionStatus } from "@virtuals-protocol/game";

// Default configuration values
export const DEFAULT_API_KEY = "UP-17f415babba7482cb4b446a1";
export const DEFAULT_BASE_API_URL = "https://api.together.xyz/v1/images/generations";

// Interface for plugin configuration options
interface IImageGenPluginOptions {
  id?: string;
  name?: string;
  description?: string;
  apiClientConfig: {
    apiKey?: string;
    baseApiUrl?: string;
  };
}

// Response interface for Together AI API
interface TogetherAIResponse {
  data: Array<{
    url: string;
  }>;
}

class ImageGenPlugin {
  private id: string;
  private name: string;
  private description: string;
  private apiKey: string;
  private baseApiUrl: string;

  constructor(options: IImageGenPluginOptions) {
    this.id = options.id || "imagegen_worker";
    this.name = options.name || "Image Generation Worker";
    this.description = options.description || 
      "Worker that generates AI images using Together AI's free FLUX schnell model";
    
    this.apiKey = options.apiClientConfig.apiKey || DEFAULT_API_KEY;
    this.baseApiUrl = options.apiClientConfig.baseApiUrl || DEFAULT_BASE_API_URL;
  }

  public getWorker(data?: {
    functions?: GameFunction<any>[];
    getEnvironment?: () => Promise<Record<string, any>>;
  }): GameWorker {
    return new GameWorker({
      id: this.id,
      name: this.name,
      description: this.description,
      functions: data?.functions || [this.generateImage],
      getEnvironment: data?.getEnvironment,
    });
  }

  get generateImage() {
    return new GameFunction({
      name: "generate_image",
      description: "Generates AI generated image based on prompt using Together AI's FLUX schnell model.",
      args: [
        {
          name: "prompt",
          description: "The prompt for image generation model. Example: A dog in the park",
          type: "string",
        },
        {
          name: "width",
          description: "Width of generated image, up to 1440 px. Default should be 1024 unless other sizes specifically needed.",
          type: "number",
          default: 1024,
        },
        {
          name: "height",
          description: "Height of generated image, up to 1440 px. Default should be 1024 unless other sizes specifically needed.",
          type: "number",
          default: 1024,
        },
      ] as const,
      executable: async (args, logger) => {
        try {
          // Validate required arguments
          if (!args.prompt) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              "Prompt is required for image generation"
            );
          }

          // Prepare headers for the request
          const headers = {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          };

          // Prepare request payload
          const payload = {
            model: "black-forest-labs/FLUX.1-schnell-Free",
            prompt: args.prompt,
            width: args.width || 1024,
            height: args.height || 1024,
            steps: 1,
            n: 1,
            response_format: "url",
          };

          logger(`Generating image with prompt: ${args.prompt}`);

          // Make the API request
          const response = await fetch(this.baseApiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json() as TogetherAIResponse;
          const imageUrl = responseData.data[0].url;

          const message = `Successfully generated image. The generated image URL is: ${imageUrl}`;
          logger(message);

          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            message
          );
        } catch (e: any) {
          const errorMessage = `An error occurred while generating image: ${e.message || "Unknown error"}`;
          logger(errorMessage);
          
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            errorMessage
          );
        }
      },
    });
  }
}

export default ImageGenPlugin;