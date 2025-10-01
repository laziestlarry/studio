'use server';

/**
 * @fileOverview An AI agent that generates a concise executive brief from a full business plan.
 *
 * - generateExecutiveBrief - A function that generates the brief.
 * - GenerateExecutiveBriefInput - The input type for the function.
 * - GenerateExecutiveBriefOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExecutiveBriefInputSchema = z.object({
  opportunityName: z.string(),
  opportunityDescription: z.string(),
  marketAnalysis: z.object({
    demandForecast: z.string(),
    competitiveLandscape: z.string(),
    potentialRevenue: z.string(),
  }),
  businessStrategy: z.object({
    marketingTactics: z.string(),
    operationalWorkflows: z.string(),
    financialForecasts: z.string(),
  }),
  actionPlan: z.object({
     criticalPath: z.object({
        taskTitle: z.string(),
        timeEstimate: z.string(),
    }),
    financials: z.object({
        capex: z.array(z.object({ item: z.string(), amount: z.string(), justification: z.string() })),
        opex: z.array(z.object({ item: z.string(), amount: z.string(), justification: z.string() })),
    }),
  }),
});

export type GenerateExecutiveBriefInput = z.infer<typeof GenerateExecutiveBriefInputSchema>;

const GenerateExecutiveBriefOutputSchema = z.object({
    viabilityScore: z.number().min(1).max(10).describe('A 1-10 score of the overall viability and potential success of the business opportunity.'),
    keyStrengths: z.array(z.string()).length(3).describe('The top three most compelling strengths or advantages of this business plan.'),
    potentialRisks: z.array(z.string()).length(3).describe('The top three most significant risks or challenges to be aware of.'),
    timeToBreakeven: z.string().describe('A concise, estimated timeline to reach breakeven (e.g., "6-9 months", "1-2 years").'),
    roiPotential: z.enum(['High', 'Medium', 'Low']).describe('A qualitative rating of the potential Return on Investment.'),
    strategicRecommendation: z.string().describe('A final, one-sentence verdict or strategic recommendation for a top-level executive.'),
});

export type GenerateExecutiveBriefOutput = z.infer<typeof GenerateExecutiveBriefOutputSchema>;


export async function generateExecutiveBrief(
  input: GenerateExecutiveBriefInput
): Promise<GenerateExecutiveBriefOutput> {
  return generateExecutiveBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExecutiveBriefPrompt',
  input: {schema: GenerateExecutiveBriefInputSchema},
  output: {schema: GenerateExecutiveBriefOutputSchema},
  prompt: `You are a world-class business analyst at a top-tier venture capital firm. Your job is to distill a comprehensive business plan into a single, high-impact "Executive Brief" for the managing partners. Your analysis must be ruthless, concise, and focused on the metrics that matter most for an investment decision.

**Business Opportunity:** {{{opportunityName}}}
**Description:** {{{opportunityDescription}}}

**Full Plan Details:**
- **Market Analysis:** {{{JSON.stringify marketAnalysis}}}
- **Business Strategy:** {{{JSON.stringify businessStrategy}}}
- **Action Plan & Financials:** {{{JSON.stringify actionPlan}}}

**Your Task:**
Generate a structured executive brief by providing the following:
1.  **Viability Score (1-10):** Based on all provided data, assign a single score representing the opportunity's likelihood of success and profitability.
2.  **Key Strengths:** Identify the three most powerful, compelling reasons to invest. What makes this a winner?
3.  **Potential Risks:** Identify the three most critical risks that could kill this business. What keeps you up at night?
4.  **Time to Breakeven:** Analyze the OPEX, revenue projections, and critical path to estimate a realistic timeline to profitability.
5.  **ROI Potential:** Based on the market size, scalability, and financial forecasts, categorize the potential return on investment as 'High', 'Medium', or 'Low'.
6.  **Strategic Recommendation:** Provide a single, decisive sentence. Is this a 'go', a 'no-go', or a 'go with conditions'? Be direct.

The partners only have 60 seconds. Make every word count.
`,
});

const generateExecutiveBriefFlow = ai.defineFlow(
  {
    name: 'generateExecutiveBriefFlow',
    inputSchema: GenerateExecutiveBriefInputSchema,
    outputSchema: GenerateExecutiveBriefOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
