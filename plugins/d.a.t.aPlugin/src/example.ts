import { config } from 'dotenv';
import { GameAgent } from "@virtuals-protocol/game";
import { createDataPlugin } from "./d.a.t.aPlugin";

// Load environment variables
config();

// Example usage
async function example() {
    try {
        // Create data plugin with environment variables
        const plugin = createDataPlugin();
        const worker = plugin.getWorker();

        // Create an agent with the worker
        const agent = new GameAgent(process.env.GAME_API_KEY ?? "", {
            name: "D.A.T.A Query Agent",
            goal: "Query and analyze Ethereum transaction data",
            description: "An agent that executes SQL queries against the CARV D.A.T.A API",
            workers: [worker],
        });

        // Set up logging
        agent.setLogger((agent, message) => {
            console.log(`-----[${agent.name}]-----`);
            console.log(message);
            console.log("\n");
        });

        // Initialize agent
        await agent.init();

        // Execute SQL query
        const sql = "SELECT * FROM eth.transactions LIMIT 2";
        console.log(`\nExecuting query: ${sql}`);
        const result = await worker.functions[0].executable({ sql }, console.log);
        console.log("Query Result:", JSON.stringify(result, null, 2));

        // Let the agent process the result
        await agent.step({
            verbose: true,
        });
    } catch (error) {
        console.error("Error in example:", error);
    }
}

// Run example
example(); 