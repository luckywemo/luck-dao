import { agent } from './agent';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    try {
        // Initialize the agent
        await agent.init();

        // Run the agent
        while (true) {
            await agent.step({ verbose: true });
        }
    } catch (error) {
        console.error("Error running kitchen manager:", error);
    }
}

main(); 