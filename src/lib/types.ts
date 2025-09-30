import type { IdentifyPromisingOpportunitiesOutput } from '@/ai/flows/identify-promising-opportunities';
import type { AnalyzeMarketOpportunityOutput } from '@/ai/flows/analyze-market-opportunity';
import type { BuildAutomatedBusinessStrategyOutput } from '@/ai/flows/build-automated-business-strategy';
import type { GenerateBusinessStructureOutput } from '@/ai/flows/generate-business-structure';
import type { ExtractTasksFromStrategyOutput } from '@/ai/flows/extract-tasks-from-strategy';
import type { GenerateBuildModeAdviceOutput } from '@/ai/flows/generate-build-mode-advice';

export type Opportunity = IdentifyPromisingOpportunitiesOutput[0];

export type Analysis = AnalyzeMarketOpportunityOutput;

export type Strategy = BuildAutomatedBusinessStrategyOutput;

export type BusinessStructure = GenerateBusinessStructureOutput;

export type ActionPlan = ExtractTasksFromStrategyOutput;

export type Task = ActionPlan['actionPlan'][0]['tasks'][0];

export type BuildModeAdvice = GenerateBuildModeAdviceOutput;
