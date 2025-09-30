'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating advice on build methodology.
 *
 * - generateBuildModeAdvice - A function that generates advice.
 * - GenerateBuildModeAdviceInput - The input type for the function.
 * - GenerateBuildModeAdviceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateBuildModeAdviceInput, GenerateBuildModeAdviceOutput } from '@/lib/types';

const BuildModeAnalysis = z.object({
    costBenefitAnalysis: z.string().describe('A detailed cost-benefit analysis of this build mode.'),
    resourceMetrics: z.string().describe('Key metrics for resource allocation (e.g., estimated team size, required capital, time to market).'),
    strategicRecommendation: z.string().describe('A strategic recommendation on when to choose this mode.'),
});

const GenerateBuildModeAdviceInputSchema = z.object({
  businessStrategy: z.object({
    marketingTactics: z.string(),
    operationalWorkflows: z.string(),
    financialForecasts: z.string(),
  }),
});

const GenerateBuildModeAdviceOutputSchema = z.object({
    inHouse: BuildModeAnalysis,
    outSourced: BuildModeAnalysis,
});

export async function generateBuildModeAdvice(
  input: GenerateBuildModeAdviceInput
): Promise<GenerateBuildModeAdviceOutput> {
  return generateBuildModeAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBuildModeAdvicePrompt',
  input: {schema: GenerateBuildModeAdviceInputSchema},
  output: {schema: GenerateBuildModeAdviceOutputSchema},
  prompt: `You are an expert business consultant AI. Given a foundational business strategy, your job is to provide a detailed comparison and strategic advice on two potential implementation paths: "in-house" and "out-sourced".

Analyze the provided business strategy and generate a structured comparison.

**Business Strategy Input:**
- Marketing Tactics: {{{businessStrategy.marketingTactics}}}
- Operational Workflows: {{{businessStrategy.operationalWorkflows}}}
- Financial Forecasts: {{{businessStrategy.financialForecasts}}}

For **BOTH** "in-house" and "out-sourced" modes, you must provide:
1.  **Cost-Benefit Analysis**: Analyze the trade-offs. For in-house, discuss control, IP ownership, and long-term costs. For out-sourced, discuss speed, flexibility, and reliance on third parties.
2.  **Resource Metrics**: Provide estimated metrics.
    - **In-house**: Estimate team size, initial capital for salaries/tools, and a realistic time-to-market.
    - **Out-sourced**: Estimate monthly budget for freelancers/services, minimal upfront capital, and a potentially faster time-to-market.
3.  **Strategic Recommendation**: Provide clear guidance on *when* and *why* a stakeholder would choose this path. Frame the "out-sourced" option as a "lazy" or capital-efficient approach for a stakeholder who prefers to manage and approve rather than build.

Your output must be structured with separate analyses for 'inHouse' and 'outSourced'.
`,
});

const generateBuildModeAdviceFlow = ai.defineFlow(
  {
    name: 'generateBuildModeAdviceFlow',
    inputSchema: GenerateBuildModeAdviceInputSchema,
    outputSchema: GenerateBuildModeAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
