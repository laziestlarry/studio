'use server';

/**
 * @fileOverview An AI agent that prioritizes online business ventures based on data and trends.
 *
 * - prioritizeOnlineBusinessVentures - A function that prioritizes online business ventures.
 * - PrioritizeOnlineBusinessVenturesInput - The input type for the prioritizeOnlineBusinessVentures function.
 * - PrioritizeOnlineBusinessVenturesOutput - The return type for the prioritizeOnlineBusinessVentures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeOnlineBusinessVenturesInputSchema = z.object({
  marketData: z
    .string()
    .describe('Comprehensive market data including trends, gaps, and competitor analysis.'),
  userSkills: z
    .string()
    .describe('List of user skills that can be leveraged in a business venture.'),
  riskTolerance: z.string().describe('The risk tolerance of the user (e.g., High, Medium, Low).'),
});
export type PrioritizeOnlineBusinessVenturesInput = z.infer<
  typeof PrioritizeOnlineBusinessVenturesInputSchema
>;

const PrioritizeOnlineBusinessVenturesOutputSchema = z.object({
  prioritizedVentures: z
    .string()
    .describe(
      'A list of prioritized online business ventures with rationale for their ranking.'
    ),
});
export type PrioritizeOnlineBusinessVenturesOutput = z.infer<
  typeof PrioritizeOnlineBusinessVenturesOutputSchema
>;

export async function prioritizeOnlineBusinessVentures(
  input: PrioritizeOnlineBusinessVenturesInput
): Promise<PrioritizeOnlineBusinessVenturesOutput> {
  return prioritizeOnlineBusinessVenturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeOnlineBusinessVenturesPrompt',
  input: {schema: PrioritizeOnlineBusinessVenturesInputSchema},
  output: {schema: PrioritizeOnlineBusinessVenturesOutputSchema},
  prompt: `You are an expert in online business and entrepreneurship. Given the following market data, user skills, and risk tolerance, prioritize a list of online business ventures that the user should develop or begin.

Market Data: {{{marketData}}}
User Skills: {{{userSkills}}}
Risk Tolerance: {{{riskTolerance}}}

Consider ventures such as side-hustles, passive income generators, freelance performance portals, drop shipping e-commerce traders, and social media management.
Explain the rationale behind the prioritization.
`, safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
});

const prioritizeOnlineBusinessVenturesFlow = ai.defineFlow(
  {
    name: 'prioritizeOnlineBusinessVenturesFlow',
    inputSchema: PrioritizeOnlineBusinessVenturesInputSchema,
    outputSchema: PrioritizeOnlineBusinessVenturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
