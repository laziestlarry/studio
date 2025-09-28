'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting actionable tasks from a business strategy.
 *
 * - extractTasksFromStrategy - A function that extracts tasks from a business strategy.
 * - ExtractTasksFromStrategyInput - The input type for the extractTasksFromStrategy function.
 * - ExtractTasksFromStrategyOutput - The return type for the extractTasksFromStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  id: z.string().describe('A unique identifier for the task.'),
  title: z.string().describe('A short, descriptive title for the task.'),
  description: z.string().describe('A more detailed description of the task and what it entails.'),
  completed: z.boolean().describe('Whether the task has been completed.'),
});

const TaskCategorySchema = z.object({
  categoryTitle: z.string().describe('The title of the task category (e.g., "Marketing", "Operations").'),
  tasks: z.array(TaskSchema).describe('A list of tasks within this category.'),
});

export const ExtractTasksFromStrategyInputSchema = z.object({
  businessStrategy: z.object({
    marketingTactics: z.string(),
    operationalWorkflows: z.string(),
    financialForecasts: z.string(),
  }),
});
export type ExtractTasksFromStrategyInput = z.infer<
  typeof ExtractTasksFromStrategyInputSchema
>;

export const ExtractTasksFromStrategyOutputSchema = z.object({
  actionPlan: z.array(TaskCategorySchema).describe('A structured action plan with categories and tasks.'),
});
export type ExtractTasksFromStrategyOutput = z.infer<
  typeof ExtractTasksFromStrategyOutputSchema
>;

export async function extractTasksFromStrategy(
  input: ExtractTasksFromStrategyInput
): Promise<ExtractTasksFromStrategyOutput> {
  return extractTasksFromStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTasksFromStrategyPrompt',
  input: {schema: ExtractTasksFromStrategyInputSchema},
  output: {schema: ExtractTasksFromStrategyOutputSchema},
  prompt: `You are an expert project manager. Your job is to take a high-level business strategy and break it down into a concrete, actionable task list.

For each major section of the strategy (Marketing, Operations, Financials), create a category and then extract specific, actionable tasks. Each task should have a clear title and a description of what needs to be done. Ensure each task has a unique ID and is initially marked as not completed.

Business Strategy:
- Marketing Tactics: {{{businessStrategy.marketingTactics}}}
- Operational Workflows: {{{businessStrategy.operationalWorkflows}}}
- Financial Forecasts: {{{businessStrategy.financialForecasts}}}

Generate a structured action plan from this strategy.
`,
});

const extractTasksFromStrategyFlow = ai.defineFlow(
  {
    name: 'extractTasksFromStrategyFlow',
    inputSchema: ExtractTasksFromStrategyInputSchema,
    outputSchema: ExtractTasksFromStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
