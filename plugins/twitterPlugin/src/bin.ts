#!/usr/bin/env node

import axios from "axios";
import { Command } from "commander";
import http from "http";
import open from "open";

const client = axios.create({
  baseURL: "https://twitter.game.virtuals.io/accounts",
});

const getLoginUrl = async (apiKey: string) => {
  const response = await client.get<{
    url: string;
  }>("/auth", {
    headers: {
      "x-api-key": apiKey,
    },
  });

  return response.data.url;
};

const verify = async (code: string, state: string) => {
  const response = await client.get<{
    token: string;
  }>("/verify", {
    params: {
      code,
      state,
    },
  });

  return response.data.token;
};

const program = new Command();

program
  .name("game-twitter-plugin")
  .description("CLI to authenticate and interact with GAME's Twitter API")
  .version("0.1.0");

program
  .command("auth")
  .description("Authenticate with Twitter API")
  .option("-k, --key <char>", "project's API key")
  .action((options) => {
    const apiKey = options.key;

    if (!apiKey) {
      console.error("API key is required!");
      return;
    }

    const server = http.createServer(async (req, res) => {
      if (req.method === "GET" && req.url?.startsWith("/callback")) {
        const query = new URLSearchParams(req.url.split("?")[1]);
        const code = query.get("code");
        const state = query.get("state");

        const token = await verify(code!, state!);

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(
          "Authentication successful! You may close this window and return to the terminal."
        );

        console.log("Authenticated! Here's your access token:");
        console.log(token);
        console.log("\n");

        server.close();
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    });

    server.listen(8714, async () => {
      const url = await getLoginUrl(apiKey);

      console.log("\nWaiting for authentication...\n");

      console.log("Visit the following URL to authenticate:");
      console.log(url, "\n");

      await open(url);
    });
  });

program.parse();
