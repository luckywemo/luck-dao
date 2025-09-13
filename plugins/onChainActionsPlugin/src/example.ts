import { GameAgent } from "@virtuals-protocol/game";
import { getOnChainActionsWorker } from ".";
import { base } from "viem/chains";
import { createWalletClient, http } from "viem";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { uniswap } from "@goat-sdk/plugin-uniswap";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account: account,
  transport: http(process.env.RPC_PROVIDER_URL),
  chain: base,
});

(async () => {
  const onChainActionsWorker = await getOnChainActionsWorker({
    wallet: viem(walletClient),
    plugins: [
      sendETH(),
      erc20({ tokens: [USDC, PEPE] }),
      uniswap({
        baseUrl: process.env.UNISWAP_BASE_URL as string,
        apiKey: process.env.UNISWAP_API_KEY as string,
      }),
    ],
  });

  // Create an agent with the worker
  const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
    name: "On chain actions agent",
    goal: "Swap 0.01 USDC to PEPE",
    description: "An agent that executes onchain actions",
    workers: [onChainActionsWorker],
  });

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
