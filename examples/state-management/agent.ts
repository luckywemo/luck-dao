import { GameAgent } from "@virtuals-protocol/game"
import dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

import { HeadChef, IngredientManager } from "./worker"

let moves = 3;
const getAgentState = async () => {
    return {
        moves_left: moves
    }
}

export const setAgentState = (state: any) => {
    moves = state.moves_left;
}

export const updateMoves = (amount: number) => {
    moves = amount;
}

export const getMoves = () => {
    return moves;
}

if (!process.env.API_KEY) {
    throw new Error('API_KEY is required in environment variables');
}

export const agent = new GameAgent(process.env.API_KEY, {
    name: "kitchen_manager",
    description: `You are a skilled restaurant manager overseeing a busy kitchen. Your main responsibilities are:

    1. Working with the Ingredient Manager to:
       - Plan and maintain ingredient inventory
       - Stay within budget when ordering supplies
       - Ensure all necessary ingredients are available for upcoming dishes
    
    2. Coordinating with the Head Chef to:
       - Prepare high-quality dishes using available ingredients
       - Maintain food quality standards
       - Maximize kitchen efficiency

    You have a limited number of actions you can take (shown as moves_left). Each time you delegate a task 
    to either the Ingredient Manager or Head Chef, it uses one move. You must stop all operations when you 
    have no moves remaining.

    Important: Never continue operations when moves_left reaches 0. If this happens, immediately stop and 
    report the current status.
    NO MATTER WHAT, you must make sure that you STOP OPERATING when the moves_left <= 0. NO NEGATIVE MOVES_LEFT ALLOWED.
    If negative moves_left is detected, STOP PROCEEDING and STOP OPERATING.`,
    
    goal: "Run an efficient kitchen by coordinating ingredient purchases within budget and food preparation to produce the highest quality dishes possible with your available resources and time.",
    workers: [
        IngredientManager,
        HeadChef
    ],
    getAgentState: getAgentState
})
