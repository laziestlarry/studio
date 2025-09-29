
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeMarketOpportunity } from '@/ai/flows/analyze-market-opportunity';
import { generateBusinessStructure } from '@/ai/flows/generate-business-structure';
import { buildAutomatedBusinessStrategy } from '@/ai/flows/build-automated-business-strategy';
import { extractTasksFromStrategy } from '@/ai/flows/extract-tasks-from-strategy';
import type { Opportunity, Analysis, Strategy, BusinessStructure, ActionPlan } from '@/lib/types';
import AppHeader from '@/components/app-header';
import OpportunityDashboard from '@/components/opportunity-dashboard';
import { OpportunityDashboardSkeleton } from '@/components/opportunity-skeletons';
import { useToast } from '@/hooks/use-toast';


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [structure, setStructure] = useState<BusinessStructure | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleSelectOpportunity = useCallback(async (opportunity: Opportunity) => {
    setIsLoading(true);
    setSelectedOpportunity(opportunity);
    setAnalysis(null);
    setStructure(null);
    setStrategy(null);
    setActionPlan(null);

    try {
      // Run initial analyses in parallel
      const [analysisResult, structureResult] = await Promise.all([
        analyzeMarketOpportunity({
          opportunityDescription: opportunity.description,
        }),
        generateBusinessStructure({
          opportunityName: opportunity.opportunityName,
          opportunityDescription: opportunity.description,
        })
      ]);

      setAnalysis(analysisResult);
      setStructure(structureResult);

      const marketAnalysisString = `Demand: ${analysisResult.demandForecast}, Competition: ${analysisResult.competitiveLandscape}, Revenue: ${analysisResult.potentialRevenue}`;
      const strategyResult = await buildAutomatedBusinessStrategy({
        marketAnalysis: marketAnalysisString,
      });
      setStrategy(strategyResult);
      
      const actionPlanResult = await extractTasksFromStrategy({
        businessStrategy: strategyResult.businessStrategy,
      });
      setActionPlan(actionPlanResult);

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Failed to analyze the opportunity. Please try again.',
      });
      // Reset to opportunity list on failure
      router.push('/opportunities');
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    const opportunityString = localStorage.getItem('selectedOpportunity');
    if (opportunityString) {
      const opportunity = JSON.parse(opportunityString);
      handleSelectOpportunity(opportunity);
    } else {
      router.push('/');
    }
  }, [router, handleSelectOpportunity]);

  const handleBackToOpportunities = () => {
    router.push('/opportunities');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
       {(isLoading || !selectedOpportunity) && <OpportunityDashboardSkeleton onBack={handleBackToOpportunities} />}
       {!isLoading && selectedOpportunity && analysis && structure && strategy && actionPlan && (
          <OpportunityDashboard
            opportunity={selectedOpportunity}
            analysis={analysis}
            structure={structure}
            strategy={strategy}
            actionPlan={actionPlan}
            onBack={handleBackToOpportunities}
          />
       )}
      </main>
    </div>
  );
}
