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
  buildMode: z
    .enum(['in-house', 'out-sourced'])
    .describe(
      'The chosen build methodology. "in-house" focuses on internal development, while "out-sourced" focuses on procuring external resources.'
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
  prompt: `You are an expert AI strategist. Based on the following market analysis and the chosen build mode, generate a comprehensive business strategy. The strategy must be designed for maximum automation and profit-first optimization.

**Market Analysis:** {{{marketAnalysis}}}
**Build Mode:** {{{buildMode}}}

**Framework Guidance:**
- **Financials:** The financial forecast should align with a profit-first approach, emphasizing EBITDA uplift and optimized procurement costs.
- **Branding:** All tactics should reflect a consistent corporate identity.

{{#if (eq buildMode "in-house")}}
## IN-HOUSE BUILD MODE ##
Generate a strategy focused on building capabilities and processes internally.
- **Operational Workflow:** Structure the marketing, operations, and financial plans for an internal team. Detail processes for internal content creation, quality control, and customer service.
- **Team & Tools:** Assume an internal AI-powered team (Procurement Lead, Demand Analyst, etc.) using robust, potentially licensed, automated tools (ERP, CRM, Gantt Managers).
{{/if}}

{{#if (eq buildMode "out-sourced")}}
## OUT-SOURCED (LAZY) BUILD MODE ##
Generate a strategy focused on maximizing the use of external resources to minimize internal effort and investment. This is for the "Lazy Larry" stakeholder who prefers to manage and approve rather than build.
- **Operational Workflow:** Design a "lazy procurement" process. The workflow should be about prompting and managing skilled market players. Focus on orchestrating external freelancers, agencies, and services.
- **Knowledge Base & Supplier Database:** The strategy should include a plan for creating and maintaining a knowledge base from trustworthy resources (e.g., 'awesome lists', academic reports) and a database of suppliers (freelancers, agencies) with scores and specialties.
- **Team & Tools:** Emphasize using online-discovered free solutions, public-sourced AI models (e.g., from Hugging Face, LangChain), toolkits, and public software repos (e.g., GitHub). Plan to utilize trial subscriptions for premium tools before committing. The legalities of using public assets must be considered.
- **Partnerships:** The strategy should include a path to forming partnerships with pre-qualified solution providers for the execution phase.
{{/if}}

**Output Requirements (for BOTH modes):**
The business strategy must include:
- **Marketing Tactics:** A detailed plan for each phase, from market research to customer engagement. Crucially, this must include a **multi-channel sales strategy** for platforms like Etsy, Shopify, social media, etc.
- **Operational Workflows:** An efficient, automated workflow covering the entire lifecycle:
    - **Creation:** A process for generating **"top-seller quality"** content and assets in **various required formats** (e.g., blog posts, social media images, video scripts). This might be internal creation or sourced externally.
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
