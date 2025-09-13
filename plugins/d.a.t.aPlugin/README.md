# D.A.T.A Plugin

A plugin for executing SQL queries and analyzing Ethereum blockchain data through a secure API interface.

## Features

- SQL query execution with validation
- Secure API authentication
- Data transformation and analysis
- Error handling and logging
- Query type detection
- Environment variable support

## Installation

```bash
npm install @game-node/d.a.t.a-plugin
```

## Configuration

The plugin can be configured in two ways:

### 1. Environment Variables

Set the following environment variables:

```env
# CARV D.A.T.A. API Configuration
CARV_DATA_API_KEY=https://dev-interface.carv.io/ai-agent-backend
CARV_DATA_AUTH_TOKEN=your-auth-token
```

### 2. Explicit Configuration

Pass configuration options when creating the plugin:

```typescript
const plugin = createDataPlugin({
    credentials: {
        apiUrl: "https://dev-interface.carv.io/ai-agent-backend",
        authToken: "your-auth-token",
    },
});
```

## Creating an Agent

Create an agent and add the worker to it:

```typescript
import { GameAgent } from "@virtuals-protocol/game";
import { createDataPlugin } from "@game-node/d.a.t.a-plugin";

// Create plugin instance
const plugin = createDataPlugin();

// Create an agent with the worker
const agent = new GameAgent("<GAME_API_KEY>", {
    name: "D.A.T.A Query Agent",
    goal: "Query and analyze Ethereum transaction data",
    description: "An agent that executes SQL queries against the CARV D.A.T.A API",
    workers: [plugin.getWorker()],
});

// Set up logging (optional)
agent.setLogger((agent, message) => {
    console.log(`-----[${agent.name}]-----`);
    console.log(message);
    console.log("\n");
});

// Initialize and run the agent
(async () => {
    await agent.init();

    // Let the agent process the result
    await agent.step({
        verbose: true,
    });
})();
```

## Usage

Basic usage example:

```typescript
import { createDataPlugin } from "@game-node/d.a.t.a-plugin";

// Using environment variables
const plugin = createDataPlugin();

// Get the worker
const worker = plugin.getWorker();

// Execute SQL query
const sql = `
    SELECT *
    FROM eth.transactions
    WHERE date >= '2024-01-01'
    LIMIT 10
`;

const result = await worker.functions[0].executable({ sql }, console.log);
console.log(result);
```

## Response Format

The query results are returned in the following format:

```typescript
interface IQueryResult {
    success: boolean;
    data: any[];
    metadata: {
        total: number;
        queryTime: string;
        queryType: "transaction" | "token" | "aggregate" | "unknown";
        executionTime: number;
        cached: boolean;
        pagination?: {
            currentPage: number;
            totalPages: number;
            hasMore: boolean;
        };
    };
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
```

## Security

The plugin includes several security features:

- SQL query validation
- Length limits
- Unsafe keyword detection
- API authentication
- Error handling

## Error Handling

Errors are handled gracefully and returned in a structured format:

```typescript
{
    success: false,
    data: [],
    metadata: {
        total: 0,
        queryTime: "2024-03-12T10:00:00.000Z",
        queryType: "unknown",
        executionTime: 0,
        cached: false
    },
    error: {
        code: "EXECUTION_ERROR",
        message: "Error message",
        details: {}
    }
}
```

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables in `.env` file
4. Build the plugin:
```bash
npm run build
```

## License

ISC 