# Onchain Actions Plugin for Virtuals Game

The onchain actions plugin allows your GAME agents to execute onchain actions such as swaps, transfers, staking, etc. all by leveraging the [GOAT SDK](https://github.com/goat-sdk/goat).

Supports:
- Any chain, from EVM, to Solana, to Sui, etc.
- Any wallet type, from key pairs to smart wallets from Crossmint, etc.
- More than +200 onchain tools from the GOAT SDK, [see all available tools here](https://ohmygoat.dev/chains-wallets-plugins#plugins)

Are you part of a startup agent team building with Virtuals?
You may be eligible for free credits through Crossmint's Startup Program! [Apply now](https://www.crossmint.com/startup-program) to unlock exclusive startup benefits — and don’t forget to mention you’re part of a startup building with Virtuals when you get in touch.

## Installation

To install the plugin, use npm or yarn:

```bash
npm install @virtuals-protocol/game-on-chain-actions-plugin
```

or

```bash
yarn add @virtuals-protocol/game-on-chain-actions-plugin
```

## Usage

1. Import the `getOnChainActionsWorker` function from the plugin:

```typescript
import { getOnChainActionsWorker } from "@virtuals-protocol/game-on-chain-actions-plugin";
```

2. Setup up a wallet

Set up a wallet for the chain you want to use

Example for EVM

```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account: account,
  transport: http(process.env.RPC_PROVIDER_URL),
  chain: base,
});
```

3. Create the worker adding the wallet and the plugins you want to use

```typescript
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
```

4. Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("GAME_API_KEY", {
  name: "Onchain Actions Agent",
  goal: "Swap 0.01 USDC to PEPE",
  description: "An agent that executes onchain actions",
  workers: [onChainActionsWorker],
});
```

5. Initialize and run the agent:

```typescript
(async () => {
  await agent.init();

  while (true) {
    await agent.step({
      verbose: true,
    });
  }
})();
```
