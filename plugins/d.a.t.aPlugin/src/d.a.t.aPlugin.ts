import {
    GameWorker,
    GameFunction,
    ExecutableGameFunctionResponse,
    ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";

// API response interface for query results
export interface IQueryResult {
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

// API response interface
interface IApiResponse {
    code: number;
    msg: string;
    data: {
        column_infos: string[];
        rows: {
            items: (string | number)[];
        }[];
    };
}

interface IDataPluginOptions {
    id?: string;
    name?: string;
    description?: string;
    credentials?: {
        apiUrl?: string;
        authToken?: string;
    };
}

export class DataPlugin {
    private id: string;
    private name: string;
    private description: string;
    private readonly API_URL: string;
    private readonly AUTH_TOKEN: string;

    constructor(options: IDataPluginOptions = {}) {
        this.id = options.id || "data-plugin";
        this.name = options.name || "D.A.T.A Plugin";
        this.description = options.description || "Data Analysis and Transformation API Plugin";

        // Try to get credentials from options first, then environment variables
        this.API_URL = options.credentials?.apiUrl || process.env.CARV_DATA_API_KEY || "";
        this.AUTH_TOKEN = options.credentials?.authToken || process.env.CARV_DATA_AUTH_TOKEN || "";

        if (!this.API_URL) {
            throw new Error("API URL is required. Set it in options or CARV_DATA_API_KEY environment variable.");
        }

        if (!this.AUTH_TOKEN) {
            throw new Error("Auth token is required. Set it in options or CARV_DATA_AUTH_TOKEN environment variable.");
        }
    }

    // Validate and extract SQL query
    private validateSqlQuery(sql: string): string | null {
        try {
            // Basic validation
            if (!sql || sql.length > 5000) {
                throw new Error("Invalid SQL query length");
            }

            // Security validation
            const unsafeKeywords = [
                "drop",
                "delete",
                "update",
                "insert",
                "alter",
                "create",
            ];
            const isUnsafe = unsafeKeywords.some((keyword) =>
                sql.toLowerCase().includes(keyword)
            );
            if (isUnsafe) {
                throw new Error("Unsafe SQL query detected");
            }

            return sql;
        } catch (error) {
            console.error("SQL validation error:", error);
            return null;
        }
    }

    // Send SQL query to API
    private async sendSqlQuery(sql: string): Promise<IApiResponse> {
        try {
            const url = `${this.API_URL}/sql_query`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.AUTH_TOKEN ? `${this.AUTH_TOKEN}` : "",
                },
                body: JSON.stringify({
                    sql_content: sql,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data as IApiResponse;
        } catch (error) {
            console.error("Error sending SQL query to API:", error);
            throw error;
        }
    }

    // Transform API response data
    private transformApiResponse(apiResponse: IApiResponse): any[] {
        const { column_infos, rows } = apiResponse.data;
        return rows.map((row) => {
            const rowData: Record<string, any> = {};
            row.items.forEach((value, index) => {
                const columnName = column_infos[index];
                rowData[columnName] = value;
            });
            return rowData;
        });
    }

    // Execute query function
    get executeQueryFunction() {
        return new GameFunction({
            name: "executeQuery",
            description: "Execute SQL queries against Ethereum blockchain data. Supports querying transactions (hash, block info, addresses, values), token transfers, and aggregated metrics. Includes time-based analysis, address activity patterns, and token transfer statistics. Recommended to include time range limitations and appropriate LIMIT clauses for optimization.",
            args: [
                {
                    name: "sql",
                    type: "string",
                    description: "SQL query to execute. Available tables: eth.transactions (for transaction data) and eth.token_transfers (for token transfer data). Example: SELECT * FROM eth.transactions WHERE date >= '2024-01-01' LIMIT 10",
                },
            ],
            executable: async (args: Record<string, any>, logger: (msg: string) => void) => {
                try {
                    const sql = args.sql;
                    if (!sql) {
                        return new ExecutableGameFunctionResponse(
                            ExecutableGameFunctionStatus.Failed,
                            "SQL query is required"
                        );
                    }

                    logger(`Executing SQL query: ${sql}`);

                    // Validate query
                    const validatedSql = this.validateSqlQuery(sql);
                    if (!validatedSql) {
                        return new ExecutableGameFunctionResponse(
                            ExecutableGameFunctionStatus.Failed,
                            "SQL validation failed"
                        );
                    }

                    // Send query to API
                    const apiResponse = await this.sendSqlQuery(validatedSql);

                    // Check API response status
                    if (apiResponse.code !== 0) {
                        return new ExecutableGameFunctionResponse(
                            ExecutableGameFunctionStatus.Failed,
                            `API Error: ${apiResponse.msg}`
                        );
                    }

                    // Transform data
                    const transformedData = this.transformApiResponse(apiResponse);
                    const result = {
                        success: true,
                        data: transformedData,
                        metadata: {
                            total: transformedData.length,
                            queryTime: new Date().toISOString(),
                            queryType: validatedSql.toLowerCase().includes("token_transfers")
                                ? "token"
                                : validatedSql.toLowerCase().includes("count")
                                    ? "aggregate"
                                    : "transaction",
                            executionTime: 0,
                            cached: false,
                        },
                    };

                    return new ExecutableGameFunctionResponse(
                        ExecutableGameFunctionStatus.Done,
                        JSON.stringify(result)
                    );
                } catch (error: any) {
                    logger(`Error executing query: ${error.message}`);
                    return new ExecutableGameFunctionResponse(
                        ExecutableGameFunctionStatus.Failed,
                        error.message || "Unknown error occurred"
                    );
                }
            },
        });
    }

    public getWorker(): GameWorker {
        return new GameWorker({
            id: this.id,
            name: this.name,
            description: this.description,
            functions: [this.executeQueryFunction],
        });
    }
}

// Create plugin instance
export const createDataPlugin = (options: IDataPluginOptions = {}): DataPlugin => {
    return new DataPlugin(options);
}; 