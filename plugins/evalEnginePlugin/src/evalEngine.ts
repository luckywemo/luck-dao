import { CHROMIA_CHAIN, EvalClient } from "eval-engine-sdk";

export const initEvalClient = async (privateKey: string) => {
  const evalClient = await EvalClient.init(privateKey, CHROMIA_CHAIN.MAINNET, {
    url: "https://api.evalengine.ai/api",    
    prefix: "EVA",
    pub: "026822066B64608E0A6E071D8AE76BDE509011FF823DBBF9FD6AC2E1F202904A0A",
  });

  return evalClient;
};
