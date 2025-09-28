'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a comprehensive business strategy based on market analysis.
 *
 * - buildAutomatedBusinessStrategy - A function that orchestrates the business strategy generation.
 * - BuildAutomatedBusinessStrategyInput - The input type for the buildAutomatedBusinessStrategy function.
 * - BuildAutomatedBusinessStrategyOutput - The return type for the buildAutomatedBusinessStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildAutomatedBusinessStrategyInputSchema = z.object({
  marketAnalysis: z
    .string()
    .describe(
      'Detailed market analysis report including demand forecasting, competitive landscape, and revenue projections.'
    ),
});
export type BuildAutomatedBusinessStrategyInput = z.infer<
  typeof BuildAutomatedBusinessStrategyInputSchema
>;

const BuildAutomatedBusinessStrategyOutputSchema = z.object({
  businessStrategy: z.object({
    marketingTactics: z
      .string()
      .describe('A detailed marketing plan to reach the target audience.'),
    operationalWorkflows: z
      .string()
      .describe('Efficient operational workflows to ensure smooth execution.'),
    financialForecasts: z
      .string()
      .describe('Projected financial performance and key metrics.'),
  }),
});
export type BuildAutomatedBusinessStrategyOutput = z.infer<
  typeof BuildAutomatedBusinessStrategyOutputSchema
>;

export async function buildAutomatedBusinessStrategy(
  input: BuildAutomatedBusinessStrategyInput
): Promise<BuildAutomatedBusinessStrategyOutput> {
  return buildAutomatedBusinessStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildAutomatedBusinessStrategyPrompt',
  input: {schema: BuildAutomatedBusinessStrategyInputSchema},
  output: {schema: BuildAutomatedBusinessStrategyOutputSchema},
  prompt: `You are an expert AI strategist. Based on the following market analysis, generate a comprehensive business strategy that adheres to the "Conceptual Procurement Schema & Operational Workflow Framework". The strategy should be designed for maximum automation and profit-first optimization.

**Market Analysis:** {{{marketAnalysis}}}

**Framework Guidance:**
- **Operational Workflow:** Structure the marketing, operations, and financial plans according to the specified phases: Initiation, Planning, Execution, Monitoring & Control, and Closure.
- **Team & Tools:** Assume an AI-powered team (Procurement Lead, Demand Analyst, etc.) using automated tools (ERP, CRM, Gantt Managers).
- **Financials:** The financial forecast should align with a profit-first approach, emphasizing EBITDA uplift and optimized procurement costs.
- **Branding:** All tactics should reflect a consistent corporate identity.

**Output Requirements:**
The business strategy must include:
- **Marketing Tactics:** A detailed plan for each phase of the operational workflow, from initial market research to customer engagement and feedback loops.
- **Operational Workflows:** An efficient, automated workflow for the entire process, from procurement and inventory management to multi-channel fulfillment and quality control. This should be a Just-in-Time (JIT) model aligned with marketing campaigns.
- **Financial Forecasts:** Projected financial performance, key metrics (KPIs), and a clear path to profitability that reflects the profit-first strategy.
`,
});

const buildAutomatedBusinessStrategyFlow = ai.defineFlow(
  {
    name: 'buildAutomatedBusinessStrategyFlow',
    inputSchema: BuildAutomatedBusinessStrategyInputSchema,
    outputSchema: BuildAutomatedBusinessStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
