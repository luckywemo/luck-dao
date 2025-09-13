import {
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
  GameFunction,
  GameWorker,
} from "@virtuals-protocol/game";

import {
  PluginBase,
  ToolBase,
  WalletClientBase,
  getTools,
} from "@goat-sdk/core";

import type { JSONSchemaType } from "ajv";
import { zodToJsonSchema } from "zod-to-json-schema";

export type GetToolsParams<TWalletClient extends WalletClientBase> = {
  wallet: TWalletClient;
  plugins?: (PluginBase<TWalletClient> | PluginBase<WalletClientBase>)[];
};

export async function getOnChainActionsWorker<
  TWalletClient extends WalletClientBase
>(params: GetToolsParams<TWalletClient>) {
  const tools: ToolBase[] = await getTools({
    wallet: params.wallet,
    plugins: params.plugins,
  });

  const workerFunctions = tools.map((tool) => {
    // biome-ignore lint/suspicious/noExplicitAny: Fix types later
    const schema = zodToJsonSchema(tool.parameters as any, {
      target: "jsonSchema7",
    }) as JSONSchemaType<typeof tool.parameters>;

    const properties = Object.keys(schema.properties);

    const args = properties.map((property) => ({
      name: property,
      description: schema.properties[property].description ?? "",
    }));

    return new GameFunction({
      name: tool.name,
      description: tool.description,
      args: args,
      executable: async (args: any) => {
        try {
          const result = await tool.execute(args);
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            JSON.stringify(result)
          );
        } catch (e) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            `Failed to execute tool: ${e}`
          );
        }
      },
    });
  });

  return new GameWorker({
    id: "onchain_actions_worker",
    name: "Onchain Actions Worker",
    description:
      "Worker that executes onchain actions such as swaps, transfers, etc.",
    functions: [...workerFunctions],
  });
}
