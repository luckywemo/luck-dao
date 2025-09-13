import { ExecutableGameFunctionResponse, GameFunction, ExecutableGameFunctionStatus } from "@virtuals-protocol/game"
import { restaurantInventory, restaurantBudget, ingredientPrices, updateRestaurantBudget } from "./worker"
import { getMoves, setAgentState } from "./agent"
export const getIngredients = new GameFunction({
    name: "get_ingredients",
    description: "Returns a list of all ingredients currently available in the kitchen's inventory, showing the quantity of each ingredient",
    args: [
        {
            name: "ingredients",
            description: "The ingredients available in the kitchen"
        }
    ] as const,
    executable: async (args, logger) => {
        setAgentState({
            moves_left: getMoves() - 1
        })
        return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            JSON.stringify(restaurantInventory)
        )
    }
})

export const makeFood = new GameFunction({
    name: "make_food",
    description: "Creates a dish using the available ingredients in the kitchen inventory. This will return a suggestion for what can be prepared based on current stock",
    args: [
        {
            name: "ingredients",
            description: "The ingredients available in the kitchen"
        }
    ] as const,
    executable: async (args, logger) => {
        setAgentState({
            moves_left: getMoves() - 1
        })
        return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            "return a dish based on the ingredients available: " + JSON.stringify(restaurantInventory)
        )
    }
})

export const buyIngredient = new GameFunction({
    name: "buy_ingredient",
    description: "Purchase a specific ingredient for the kitchen if there is sufficient budget. This will deduct the cost from the budget and add the ingredient to inventory",
    args: [
        { name: "currentBudget", description: "The current budget of the kitchen" },
        { name: "ingredient", description: "The ingredient to buy" },
        { name: "price", description: "The price of the ingredient" }
    ] as const,
    executable: async (args, logger) => {
        setAgentState({
            moves_left: getMoves() - 1
        })
        if (restaurantBudget! > Number(args.price!)) {
            const newBudget = restaurantBudget! - Number(args.price!);
            updateRestaurantBudget(newBudget);
            if (!restaurantInventory[args.ingredient!]) {
                restaurantInventory[args.ingredient!] = 0;
            }
            restaurantInventory[args.ingredient!] += 1;
        }
        return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            "return a dish based on the ingredients available: " + JSON.stringify(restaurantInventory)
        )
    }
})

export const getBudget = new GameFunction({
    name: "get_budget",
    description: "Retrieves the current available budget for the kitchen, which can be used for purchasing ingredients",
    args: [] as const,
    executable: async (args, logger) => {
        return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            JSON.stringify(restaurantBudget)
        )
    }
})

export const getIngredientPrices = new GameFunction({
    name: "get_ingredient_prices",
    description: "Returns a list of all available ingredients and their corresponding prices based on the ingredientPrices object. Use this information to plan purchases within budget",
    args: [] as const,
    hint: "use this to get the prices of the ingredients",
    executable: async (args, logger) => {
        return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            JSON.stringify(ingredientPrices)
        )
    }
})

export const getMovesLeft = new GameFunction({
    name: "get_moves_left",
    description: "Shows the number of remaining moves or actions that can be taken in the current game session",
    args: [] as const,
    executable: async (args, logger) => {
        return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            JSON.stringify(getMoves())
        )
    }
})

export const doNothing = new GameFunction({
    name: "do_nothing",
    description: "Skips the current turn without performing any action. This can be useful when waiting for specific conditions or saving moves",
    args: [] as const,
    executable: async (args, logger) => {
        return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Done,
            "do nothing"
        )
    }
})
