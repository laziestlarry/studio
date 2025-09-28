import type { IdentifyPromisingOpportunitiesOutput } from '@/ai/flows/identify-promising-opportunities';
import type { AnalyzeMarketOpportunityOutput } from '@/ai/flows/analyze-market-opportunity';
import type { BuildAutomatedBusinessStrategyOutput } from '@/ai/flows/build-automated-business-strategy';

export type Opportunity = IdentifyPromisingOpportunitiesOutput[0];

export type Analysis = AnalyzeMarketOpportunityOutput;

export type Strategy = BuildAutomatedBusinessStrategyOutput;
