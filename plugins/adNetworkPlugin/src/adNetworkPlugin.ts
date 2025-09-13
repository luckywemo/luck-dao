import {
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";
import axios from "axios";

interface IAdNetworkPluginOptions {
  apiKey: string;
}

class AdNetworkPlugin {
  private id: string;
  private name: string;
  private description: string;
  private apiKey: string;
  private baseUrl: string = "https://main.d1p1250zpzrhbi.amplifyapp.com";
  private apiEndpoint: string = `${this.baseUrl}/api/agent/assigned-campaigns`;
  private campaignStartedEndpoint: string = `${this.baseUrl}/api/agent/campaigns/{{campaignId}}/start`;
  private campaignCompletedEndpoint: string = `${this.baseUrl}/api/agent/campaigns/{{campaignId}}/submit`;

  constructor(options: IAdNetworkPluginOptions) {
    this.apiKey = options.apiKey;
    this.id = "ad_network_worker";
    this.name = "Ad Network Worker";
    this.description =
      "A worker that interacts with the Monitize.ai API to generate ad network promotions by retrieving assigned campaigns from the agent's portfolio, also notifies Monitize.ai when a tweet has been sent about a campaign.";
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
        this.fetchAssignedCampaignsFunction,
        this.notifyCampaignStartedFunction,
        this.notifyCampaignCompletedFunction,
      ],
      getEnvironment: data?.getEnvironment,
    });
  }

  get fetchAssignedCampaignsFunction() {
    return new GameFunction({
      name: "fetch_assigned_campaigns",
      description:
        "Get all campaigns that are assigned to the agent for promotion. Use this to check what campaigns you need to work on.",
      args: [],
      executable: async (_, logger) => {
        try {
          logger("Fetching assigned campaigns from Monitize.ai...");

          const response = await axios.get(this.apiEndpoint, {
            headers: {
              "x-api-key": this.apiKey,
            },
          });

          const campaigns = response.data.campaigns;
          if (campaigns.length === 0) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Done,
              "No campaigns assigned to the agent"
            );
          }
          const campaign = campaigns[0];
          const adNetworkMessage =
            `Use the following details to craft an engaging promotional twitter post:\n\n` +
            `   - Campaign ID: ${campaign.id}\n` +
            `   - Campaign Title: ${campaign.title}\n` +
            `   - Campaign Brief: ${campaign.brief}\n`;

          logger(adNetworkMessage);

          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            adNetworkMessage
          );
        } catch (e) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Failed to fetch assigned campaigns"
          );
        }
      },
    });
  }

  get notifyCampaignStartedFunction() {
    return new GameFunction({
      name: "notify_campaign_started",
      description:
        "Notify Monitize.ai that a campaign has been started, this should be called after a campaign has been started.",
      args: [
        {
          name: "campaignId",
          type: "number",
          description: "The ID of the campaign that was started",
        },
      ],
      executable: async (args, logger) => {
        try {
          logger("Notifying Monitize.ai about the campaign start...");

          if (!args.campaignId) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              "Campaign ID is required"
            );
          }
          const response = await axios.post(
            this.campaignStartedEndpoint.replace(
              "{{campaignId}}",
              args.campaignId
            ),
            {},
            {
              headers: {
                "x-api-key": this.apiKey,
              },
            }
          );

          logger(
            `Successfully notified Monitize.ai about campaign ${args.campaignId}`
          );

          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            "Successfully notified about campaign"
          );
        } catch (e) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Failed to notify about campaign"
          );
        }
      },
    });
  }

  get notifyCampaignCompletedFunction() {
    return new GameFunction({
      name: "notify_campaign_completed",
      description:
        "Notify Monitize.ai that a campaign has been completed, this should be called after a campaign has been completed.",
      args: [
        {
          name: "campaignId",
          type: "number",
          description: "The ID of the campaign that was completed",
        },
      ],
      executable: async (args, logger) => {
        try {
          logger("Notifying Monitize.ai about the campaign completion...");
          if (!args.campaignId) {
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Failed,
              "Campaign ID is required"
            );
          }
          const response = await axios.post(
            this.campaignCompletedEndpoint.replace(
              "{{campaignId}}",
              args.campaignId
            ),
            {},
            {
              headers: {
                "x-api-key": this.apiKey,
              },
            }
          );

          logger(
            `Successfully notified Monitize.ai about campaign ${args.campaignId}`
          );

          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            "Successfully notified about campaign"
          );
        } catch (e) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Failed to notify about campaign"
          );
        }
      },
    });
  }
}

export default AdNetworkPlugin;
