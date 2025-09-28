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
  prompt: `Based on the following market analysis, generate a comprehensive business strategy.
Market Analysis: {{{marketAnalysis}}}

The business strategy should include:
- Detailed marketing tactics to reach the target audience.
- Efficient operational workflows to ensure smooth execution.
- Projected financial performance and key metrics.`,
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
