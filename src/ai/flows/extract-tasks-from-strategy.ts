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
  humanContribution: z.string().describe('Description of the human involvement required for this task (e.g., "Observer/Approval", "Monitoring status", "Final strategic sign-off").'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the task based on an Eisenhower Matrix of urgency and importance.'),
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
    timeEstimate: z.string().describe('The estimated time range for the critical path task (e.g., "2-3 days", "1 week").')
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
  prompt: `You are an expert project manager AI. Your job is to take a high-level business strategy and break it down into a concrete, actionable task list designed for maximum automation and rapid execution. The human stakeholder ("Lazy Larry") prefers to be in an observer/approver role.

For each major section of the strategy (Marketing, Operations, Financials), create a category and then extract specific, actionable tasks. Each task should have a clear title and a description of what needs to be done. Ensure each task has a unique ID and is initially marked as not completed.

For each task:
1.  **Human Contribution**: Specify the 'humanContribution' needed. Frame it for "Lazy Larry." Focus on monitoring and approval. Examples: "Monitor campaign performance via dashboard," "Final approval for budget allocation," "Review and approve final branding."
2.  **Prioritization**: Assign a 'priority' (High, Medium, Low) based on an Eisenhower Matrix (urgency and importance). High priority tasks should be those that are critical for a fast launch.

Finally, identify the single task that represents the **critical path** for the quickest possible launch. This should be the task that, if delayed, would delay the entire launch. Provide a 'timeEstimate' for this task in **days or weeks**, not months. Keep the estimate optimistic and focused on speed.

Business Strategy:
- Marketing Tactics: {{{businessStrategy.marketingTactics}}}
- Operational Workflows: {{{businessStrategy.operationalWorkflows}}}
- Financial Forecasts: {{{businessStrategy.financialForecasts}}}

Generate a structured action plan from this strategy, including the critical path analysis for a rapid launch.
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
