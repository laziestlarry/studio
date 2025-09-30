import type { IdentifyPromisingOpportunitiesOutput } from '@/ai/flows/identify-promising-opportunities';
import type { AnalyzeMarketOpportunityOutput } from '@/ai/flows/analyze-market-opportunity';
import type { BuildAutomatedBusinessStrategyOutput } from '@/ai/flows/build-automated-business-strategy';
import type { GenerateBusinessStructureOutput } from '@/ai/flows/generate-business-structure';
import type { ExtractTasksFromStrategyOutput } from '@/ai/flows/extract-tasks-from-strategy';
import { z } from 'zod';


export type Opportunity = IdentifyPromisingOpportunitiesOutput[0];

export type Analysis = AnalyzeMarketOpportunityOutput;

export type Strategy = BuildAutomatedBusinessStrategyOutput;

export type BusinessStructure = GenerateBusinessStructureOutput;

export type ActionPlan = ExtractTasksFromStrategyOutput;

export type Task = ActionPlan['actionPlan'][0]['tasks'][0];

const BuildModeAnalysis = z.object({
    costBenefitAnalysis: z.string(),
    resourceMetrics: z.string(),
    strategicRecommendation: z.string(),
});

export const GenerateBuildModeAdviceOutputSchema = z.object({
    inHouse: BuildModeAnalysis,
    outSourced: BuildModeAnalysis,
});
export type BuildModeAdvice = z.infer<typeof GenerateBuildModeAdviceOutputSchema>;


export const GenerateBuildModeAdviceInputSchema = z.object({
  businessStrategy: z.object({
    marketingTactics: z.string(),
    operationalWorkflows: z.string(),
    financialForecasts: z.string(),
  }),
});
export type GenerateBuildModeAdviceInput = z.infer<typeof GenerateBuildModeAdviceInputSchema>;
