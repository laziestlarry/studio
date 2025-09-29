
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
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [planBuilt, setPlanBuilt] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [structure, setStructure] = useState<BusinessStructure | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const opportunityString = localStorage.getItem('selectedOpportunity');
    if (!opportunityString) {
      router.push('/');
      return;
    }

    const opportunity = JSON.parse(opportunityString);
    setSelectedOpportunity(opportunity);

    // Check if a plan has already been generated and stored
    const storedPlan = localStorage.getItem(`plan_${opportunity.opportunityName}`);
    if (storedPlan) {
      const { analysis, structure, strategy, actionPlan } = JSON.parse(storedPlan);
      setAnalysis(analysis);
      setStructure(structure);
      setStrategy(strategy);
      setActionPlan(actionPlan);
      setPlanBuilt(true);
    }
    
  }, [router]);

  const handleBuildPlan = async () => {
      if (!selectedOpportunity) return;
      try {
        setIsLoading(true);
        setAnalysis(null);
        setStructure(null);
        setStrategy(null);
        setActionPlan(null);

        // Run initial analyses in parallel
        const [analysisResult, structureResult] = await Promise.all([
          analyzeMarketOpportunity({
            opportunityDescription: selectedOpportunity.description,
          }),
          generateBusinessStructure({
            opportunityName: selectedOpportunity.opportunityName,
            opportunityDescription: selectedOpportunity.description,
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
        setPlanBuilt(true);

        // Store the generated plan
        localStorage.setItem(`plan_${selectedOpportunity.opportunityName}`, JSON.stringify({
            analysis: analysisResult,
            structure: structureResult,
            strategy: strategyResult,
            actionPlan: actionPlanResult,
        }));

      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Failed to build the business plan. Please try again.',
        });
        // Reset to opportunity list on failure
        router.push('/opportunities');
      } finally {
        setIsLoading(false);
      }
  };
  
  const handleBackToOpportunities = () => {
    router.push('/opportunities');
  };
  
  const renderInitialState = () => {
    if (!selectedOpportunity) {
      return <OpportunityDashboardSkeleton onBack={handleBackToOpportunities} />;
    }

    return (
       <div className="max-w-4xl mx-auto text-center animate-in fade-in-50 duration-500">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          {selectedOpportunity.opportunityName}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          {selectedOpportunity.description}
        </p>
        <Card className="mt-12 p-6 bg-card/50">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-primary">
                    <Bot className="h-6 w-6"/>
                    <p className="font-semibold">Ready to build your automated business plan?</p>
                </div>
                <p className="text-sm text-muted-foreground">The AI will generate a market analysis, organizational structure, business strategy, and actionable project plan for this opportunity.</p>
                <Button size="lg" onClick={handleBuildPlan} disabled={isLoading}>
                    {isLoading ? "Building Plan..." : "Build Business Plan"}
                </Button>
            </div>
        </Card>
        <Button variant="ghost" size="sm" onClick={handleBackToOpportunities} className="mt-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Opportunities
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
       {isLoading && <OpportunityDashboardSkeleton onBack={handleBackToOpportunities} title="Building Your Business Plan..." />}
       {!isLoading && !planBuilt && renderInitialState()}
       {!isLoading && planBuilt && selectedOpportunity && analysis && structure && strategy && actionPlan && (
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
