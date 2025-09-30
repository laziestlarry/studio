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
  category: z.string().describe('The category of the task (e.g., "Marketing", "Operations", "Quality Assurance", "Finance", "Customer Service").'),
  completed: z.boolean().describe('Whether the task has been completed.'),
  humanContribution: z.string().describe('Description of the human involvement required for this task (e.g., "Observer/Approval", "Monitoring status", "Final strategic sign-off").'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the task based on an Eisenhower Matrix of urgency and importance.'),
  startDate: z.string().describe('Estimated start date for the task in YYYY-MM-DD format.'),
  endDate: z.string().describe('Estimated end date for the task in YYYY-MM-DD format.'),
  dependencies: z.array(z.string()).describe('A list of task IDs that this task depends on.'),
});

const TaskCategorySchema = z.object({
  categoryTitle: z.string().describe('The title of the task category (e.g., "Marketing", "Operations").'),
  tasks: z.array(TaskSchema).describe('A list of tasks within this category.'),
});

const BusinessModelCanvasSchema = z.object({
    keyPartners: z.array(z.string()).describe("Who are our Key Partners? Who are our key suppliers?"),
    keyActivities: z.array(z.string()).describe("What Key Activities do our Value Propositions require?"),
    keyResources: z.array(z.string()).describe("What Key Resources do our Value Propositions require?"),
    valuePropositions: z.array(z.string()).describe("What value do we deliver to the customer? Which one of our customer’s problems are we helping to solve?"),
    customerRelationships: z.array(z.string()).describe("What type of relationship does each of our Customer Segments expect us to establish and maintain with them?"),
    channels: z.array(z.string()).describe("Through which Channels do our Customer Segments want to be reached?"),
    customerSegments: z.array(z.string()).describe("For whom are we creating value? Who are our most important customers?"),
    costStructure: z.array(z.string()).describe("What are the most important costs inherent in our business model?"),
    revenueStreams: z.array(z.string()).describe("For what value are our customers really willing to pay?"),
});

const FinancialEstimateSchema = z.object({
    item: z.string().describe('The name of the expenditure item.'),
    amount: z.string().describe('The estimated cost as a string (e.g., "$5,000 - $10,000").'),
    justification: z.string().describe('A brief justification for the cost.'),
});

const InvestmentOptionSchema = z.object({
    type: z.string().describe('The type of investment (e.g., "Seed Funding", "Bootstrapping", "Angel Investment").'),
    description: z.string().describe('A description of the investment option and its suitability.'),
    amount: z.string().describe('The potential funding amount (e.g., "$50,000 - $150,000").'),
});

const ExtractTasksFromStrategyInputSchema = z.object({
  businessStrategy: z.object({
    marketingTactics: z.string(),
    operationalWorkflows: z.string(),
    financialForecasts: z.string(),
  }),
  buildMode: z
    .enum(['in-house', 'out-sourced'])
    .describe('The build methodology that was used to generate the strategy.'),
});
export type ExtractTasksFromStrategyInput = z.infer<
  typeof ExtractTasksFromStrategyInputSchema
>;

const ExtractTasksFromStrategyOutputSchema = z.object({
  actionPlan: z.array(TaskCategorySchema).describe('A structured action plan with categories and tasks.'),
  criticalPath: z.object({
    taskTitle: z.string().describe('The title of the task that is on the critical path.'),
    timeEstimate: z.string().describe('The estimated time range for the critical path task (e.g., "2-3 days", "1 week").')
  }).describe('The task estimated to be on the critical path and its time estimate.'),
  businessModelCanvas: BusinessModelCanvasSchema,
  financials: z.object({
    capex: z.array(FinancialEstimateSchema).describe('Estimated Capital Expenditures.'),
    opex: z.array(FinancialEstimateSchema).describe('Estimated Operational Expenditures.'),
    investmentOptions: z.array(InvestmentOptionSchema).describe('Potential investment options.'),
  }),
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
  prompt: `You are an expert project manager and financial analyst AI. Your job is to take a high-level business strategy and convert it into a comprehensive, actionable project plan and financial estimate, tailored to the specified build mode. The human stakeholder ("Lazy Larry") prefers to be in an observer/approver role.

**Build Mode:** {{{buildMode}}}

**Part 1: Action Plan & Gantt Chart Data**
For each major section (Marketing, Operations, Financials), create a task category. Then, extract specific, actionable tasks based on the business strategy and build mode.
For each task:
1.  **Unique ID**: A short, unique ID (e.g., "MKT-01").
2.  **Title & Description**: A clear title and description.
3.  **Category**: Assign a clear category (e.g., "Marketing", "Operations", "Quality Assurance", "Finance", "Customer Service").
4.  **Human Contribution**: Specify for "Lazy Larry." Focus on monitoring and approval (e.g., "Monitor campaign performance," "Final approval for budget").
5.  **Priority**: Assign 'High', 'Medium', or 'Low' based on an Eisenhower Matrix (urgency/importance for a fast launch).
6.  **Dates**: Provide an estimated 'startDate' and 'endDate' in YYYY-MM-DD format, assuming the project starts today. Keep timelines aggressive for a rapid launch.
7.  **Dependencies**: List the IDs of tasks that must be completed before this one can start.

{{#if (eq buildMode "in-house")}}
### In-House Task Focus ###
Tasks should reflect internal development cycles, team collaboration, and building proprietary systems.
{{/if}}

{{#if (eq buildMode "out-sourced")}}
### Out-Sourced Task Focus ###
Tasks should be heavily focused on procurement, management, and integration of external resources.
- **Supplier Discovery:** Include tasks for "Identify and vet freelance content creators on Upwork" or "Research free-tier CRM solutions."
- **Tool Integration:** Add tasks like "Set up trial for [SaaS tool] and integrate with workflow" or "Clone and deploy open-source project management tool from GitHub."
- **Prompt Engineering:** Include tasks for "Develop detailed prompts for AI image generation models" or "Create specification documents for outsourced developers."
- **Knowledge Base:** Add a task for "Compile a database of top-rated suppliers and free software solutions."
{{/if}}

**Crucially, ensure the action plan includes specific tasks for:**
- **Quality Check:** A task for quality assurance review *before* a product/asset is listed.
- **Final Assurance:** A task for final approval *before* a product/asset is delivered to a customer.
- **Multi-Format Production:** Tasks related to producing assets in various formats (e.g., generate blog post, create social graphic).
- **Multi-Channel Sales:** Tasks for setting up and managing different sales channels.
- **Financial Setup:** A task for configuring payment/financial transfer systems.
- **Customer Service Setup:** A task to establish the customer service workflow.

Finally, identify the single task that represents the **critical path** for the quickest launch. Provide a 'timeEstimate' in **days or weeks**.

**Part 2: Business Model Canvas**
Based on the overall strategy, populate a standard Business Model Canvas. Be concise and strategic.

**Part 3: Financial Estimation**
Based on the strategy and tasks, estimate the financials:
1.  **CAPEX**: List key one-time capital expenditures. For out-sourced mode, this might be minimal (e.g., "Initial deposits for freelancers").
2.  **OPEX**: List recurring operational expenditures. For out-sourced mode, this could include "Monthly freelance budget" or "Low-cost SaaS subscriptions."
3.  **Investment Options**: Suggest 2-3 suitable investment options (e.g., Bootstrapping, Seed Funding) with potential amounts and justifications.

Keep all estimates realistic for a lean, AI-driven startup.

**Business Strategy Input:**
- Marketing Tactics: {{{businessStrategy.marketingTactics}}}
- Operational Workflows: {{{businessStrategy.operationalWorkflows}}}
- Financial Forecasts: {{{businessStrategy.financialForecasts}}}

Generate the full, structured output including the action plan, canvas, and financial estimates.
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
