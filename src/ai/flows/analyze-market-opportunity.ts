'use server';

/**
 * @fileOverview An AI agent that analyzes selected market opportunities.
 *
 * - analyzeMarketOpportunity - A function that analyzes market opportunities.
 * - AnalyzeMarketOpportunityInput - The input type for the analyzeMarketOpportunity function.
 * - AnalyzeMarketOpportunityOutput - The return type for the analyzeMarketOpportunity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketOpportunityInputSchema = z.object({
  opportunityDescription: z
    .string()
    .describe('A detailed description of the market opportunity to analyze.'),
});
export type AnalyzeMarketOpportunityInput = z.infer<
  typeof AnalyzeMarketOpportunityInputSchema
>;

const AnalyzeMarketOpportunityOutputSchema = z.object({
  demandForecast: z
    .string()
    .describe('A forecast of the demand for this market opportunity.'),
  competitiveLandscape: z
    .string()
    .describe('An analysis of the competitive landscape for this opportunity.'),
  potentialRevenue: z
    .string()
    .describe('A projection of the potential revenue for this opportunity.'),
});
export type AnalyzeMarketOpportunityOutput = z.infer<
  typeof AnalyzeMarketOpportunityOutputSchema
>;

export async function analyzeMarketOpportunity(
  input: AnalyzeMarketOpportunityInput
): Promise<AnalyzeMarketOpportunityOutput> {
  return analyzeMarketOpportunityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketOpportunityPrompt',
  input: {schema: AnalyzeMarketOpportunityInputSchema},
  output: {schema: AnalyzeMarketOpportunityOutputSchema},
  prompt: `You are an expert market analyst. Given the description of a market opportunity, provide a demand forecast, an analysis of the competitive landscape, and a projection of the potential revenue.

Market Opportunity Description: {{{opportunityDescription}}}`,
});

const analyzeMarketOpportunityFlow = ai.defineFlow(
  {
    name: 'analyzeMarketOpportunityFlow',
    inputSchema: AnalyzeMarketOpportunityInputSchema,
    outputSchema: AnalyzeMarketOpportunityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
