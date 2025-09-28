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
  humanContribution: z.string().describe('Description of the human involvement required for this task (e.g., "Final approval", "Content review", "No human input required").'),
});

const TaskCategorySchema = z.object({
  categoryTitle: z.string().describe('The title of the task category (e.g., "Marketing", "Operations").'),
  tasks: z.array(TaskSchema).describe('A list of tasks within this category.'),
});

const ExtractTasksFromStrategyInputSchema = z.object({
  businessStrategy: z.object({
    marketingTactics: z.string(),
    operationalWorkflows: z.string(),
    financialForecasts: z.string(),
  }),
});
export type ExtractTasksFromStrategyInput = z.infer<
  typeof ExtractTasksFromStrategyInputSchema
>;

const ExtractTasksFromStrategyOutputSchema = z.object({
  actionPlan: z.array(TaskCategorySchema).describe('A structured action plan with categories and tasks.'),
  criticalPath: z.object({
    taskTitle: z.string().describe('The title of the task that is on the critical path.'),
    timeEstimate: z.string().describe('The estimated time range for the critical path task (e.g., "2-3 weeks").')
  }).describe('The task estimated to be on the critical path and its time estimate.')
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

For each task, also specify the 'humanContribution' needed. This could range from 'Final approval' to 'Content creation and review' to 'No human input required' for fully automated tasks.

Finally, identify the single task that represents the critical path—the one that will likely take the longest and determine the earliest project completion date. Provide a 'timeEstimate' for this critical path task.

Business Strategy:
- Marketing Tactics: {{{businessStrategy.marketingTactics}}}
- Operational Workflows: {{{businessStrategy.operationalWorkflows}}}
- Financial Forecasts: {{{businessStrategy.financialForecasts}}}

Generate a structured action plan from this strategy, including the critical path analysis.
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
