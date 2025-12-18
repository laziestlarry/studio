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
      .describe(
        'A detailed marketing plan to reach the target audience, including multi-channel sales strategies.'
      ),
    operationalWorkflows: z
      .string()
      .describe(
        'Efficient operational workflows, including production of top-seller quality content in various formats, quality checks, customer service lifecycle, and financial transfer systems.'
      ),
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
  model: 'gemini-1.5-flash-latest',
  prompt: `You are an expert AI strategist. Based on the following market analysis, generate a comprehensive, build-agnostic business strategy. The strategy must be designed for maximum automation and profit-first optimization. Do NOT make assumptions about whether the business will be built in-house or out-sourced. The strategy should be a high-level foundation that can be implemented using either approach.

**Market Analysis:** {{{marketAnalysis}}}

**Framework Guidance:**
- **Financials:** The financial forecast should align with a profit-first approach, emphasizing EBITDA uplift and optimized procurement costs.
- **Branding:** All tactics should reflect a consistent corporate identity.

**Output Requirements:**
The business strategy must include:
- **Marketing Tactics:** A detailed plan for each phase, from market research to customer engagement. Crucially, this must include a **multi-channel sales strategy** for platforms like Etsy, Shopify, social media, etc.
- **Operational Workflows:** An efficient, automated workflow covering the entire lifecycle:
    - **Creation:** A process for generating **"top-seller quality"** content and assets in **various required formats** (e.g., blog posts, social media images, video scripts).
    - **Quality Control:** Define a **quality check** step before any product is listed and a **final assurance approval** step before customer delivery.
    - **Financial Transfers:** Propose a system for configuring **financial transfers** (e.g., Stripe, PayPal).
    - **Customer Service:** Outline a **customer service lifecycle** management plan.
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
