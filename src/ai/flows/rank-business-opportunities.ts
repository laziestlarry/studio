'use server';
/**
 * @fileOverview An AI agent that ranks business opportunities.
 *
 * - rankBusinessOpportunities - A function that ranks business opportunities.
 * - RankBusinessOpportunitiesInput - The input type for the rankBusinessOpportunities function.
 * - RankBusinessOpportunitiesOutput - The return type for the rankBusinessOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OpportunitySchema = z.object({
  opportunityName: z
    .string()
    .describe('Name of the business opportunity.'),
  description: z.string().describe('A short description of the business.'),
  potential: z
    .string()
    .describe('An assessment of the opportunities potential, considering financial upside and market size.'),
  risk: z
    .string()

    .describe('An assessment of the risks involved, including market, execution, and financial risks.'),
  quickReturn: z
    .string()
    .describe('An assessment of how quickly a return on investment can be expected (e.g., Short, Medium, Long term).'),
  priority: z
    .string()
    .describe(
      'A priority score, from 1-10, of which opportunity to pursue first. This should be a synthesis of potential, risk, and quick return.'
    ),
});


const RankBusinessOpportunitiesInputSchema = z.object({
  opportunities: z.array(OpportunitySchema).describe('An array of business opportunities to rank.'),
  focus: z.string().describe('The primary focus for ranking, e.g., "Maximum profit potential with minimal risk and fastest time-to-market."'),
});

export type RankBusinessOpportunitiesInput = z.infer<typeof RankBusinessOpportunitiesInputSchema>;

const RankedOpportunitySchema = OpportunitySchema.extend({
    rank: z.number().describe('The rank of the opportunity, where 1 is the best.'),
    rationale: z.string().describe('The rationale for the assigned rank based on the strategic focus.'),
});

const RankBusinessOpportunitiesOutputSchema = z.array(RankedOpportunitySchema);

export type RankBusinessOpportunitiesOutput = z.infer<typeof RankBusinessOpportunitiesOutputSchema>;


export async function rankBusinessOpportunities(
  input: RankBusinessOpportunitiesInput
): Promise<RankBusinessOpportunitiesOutput> {
  return rankBusinessOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankBusinessOpportunitiesPrompt',
  input: {schema: RankBusinessOpportunitiesInputSchema},
  output: {schema: RankBusinessOpportunitiesOutputSchema},
  model: 'gemini-1.5-flash-latest',
  prompt: `You are an expert business analyst. Given a list of business opportunities and a strategic focus, rank them in order of preference. The ranking should be based on a balanced assessment of which opportunities best align with the stated focus.

Provide a clear rationale for each rank that explains how the opportunity's potential, risk, and return speed contribute to its alignment with the strategic focus. The output should be a ranked list of the same opportunities provided in the input, with additional 'rank' and 'rationale' fields.

**Strategic Focus:** {{{focus}}}

**Business Opportunities:**
{{#each opportunities}}
- **{{opportunityName}}**: {{description}}
  - **Potential**: {{potential}}
  - **Risk**: {{risk}}
  - **Quick Return**: {{quickReturn}}
  - **Initial Priority**: {{priority}}
{{/each}}
`,
});

const rankBusinessOpportunitiesFlow = ai.defineFlow(
  {
    name: 'rankBusinessOpportunitiesFlow',
    inputSchema: RankBusinessOpportunitiesInputSchema,
    outputSchema: RankBusinessOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
