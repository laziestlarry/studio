
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeMarketOpportunity } from '@/ai/flows/analyze-market-opportunity';
import { generateBusinessStructure } from '@/ai/flows/generate-business-structure';
import { buildAutomatedBusinessStrategy } from '@/ai/flows/build-automated-business-strategy';
import { extractTasksFromStrategy } from '@/ai/flows/extract-tasks-from-strategy';
import { generateBuildModeAdvice } from '@/ai/flows/generate-build-mode-advice';
import { generateChartData } from '@/ai/flows/generate-chart-data';
import { generateExecutiveBrief } from '@/ai/flows/generate-executive-brief';
import type { Opportunity, Analysis, Strategy, BusinessStructure, ActionPlan, BuildModeAdvice, ChartData, ExecutiveBrief } from '@/lib/types';
import AppHeader from '@/components/app-header';
import OpportunityDashboard from '@/components/opportunity-dashboard';
import { OpportunityDashboardSkeleton } from '@/components/opportunity-skeletons';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Rocket, Printer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BuildModeSelector from '@/components/build-mode-selector';


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [planBuilt, setPlanBuilt] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [structure, setStructure] = useState<BusinessStructure | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [buildModeAdvice, setBuildModeAdvice] = useState<BuildModeAdvice | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [executiveBrief, setExecutiveBrief] = useState<ExecutiveBrief | null>(null);
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
      const { analysis, structure, strategy, actionPlan, chartData, executiveBrief } = JSON.parse(storedPlan);
      setAnalysis(analysis);
      setStructure(structure);
      setStrategy(strategy);
      setActionPlan(actionPlan);
      setChartData(chartData);
      setExecutiveBrief(executiveBrief);
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
        setBuildModeAdvice(null);
        setChartData(null);
        setExecutiveBrief(null);

        // Step 1: Run initial analyses in parallel
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

        // Step 2: Build foundational strategy based on analysis
        const marketAnalysisString = `Demand: ${analysisResult.demandForecast}, Competition: ${analysisResult.competitiveLandscape}, Revenue: ${analysisResult.potentialRevenue}`;
        const strategyResult = await buildAutomatedBusinessStrategy({
          marketAnalysis: marketAnalysisString,
        });
        setStrategy(strategyResult);
        
        // Step 3: Generate build mode advice and chart data in parallel
        const [adviceResult, chartDataResult] = await Promise.all([
            generateBuildModeAdvice({
                businessStrategy: strategyResult.businessStrategy,
            }),
            generateChartData({
                financialForecasts: strategyResult.businessStrategy.financialForecasts,
            })
        ]);
        
        setBuildModeAdvice(adviceResult);
        setChartData(chartDataResult.chartData);


        setPlanBuilt(true);

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

  const handleFinalizePlan = async (buildMode: 'in-house' | 'out-sourced') => {
    if (!strategy || !analysis || !selectedOpportunity) return;
    try {
      setIsFinalizing(true);
      const actionPlanResult = await extractTasksFromStrategy({
        businessStrategy: strategy.businessStrategy,
        buildMode: buildMode,
      });
      setActionPlan(actionPlanResult);
      
      const briefResult = await generateExecutiveBrief({
          opportunityName: selectedOpportunity.opportunityName,
          opportunityDescription: selectedOpportunity.description,
          marketAnalysis: analysis,
          businessStrategy: strategy.businessStrategy,
          actionPlan: {
              criticalPath: actionPlanResult.criticalPath,
              financials: {
                  capex: actionPlanResult.financials.capex,
                  opex: actionPlanResult.financials.opex,
              }
          }
      });
      setExecutiveBrief(briefResult);


      // Store the fully generated plan
       if (selectedOpportunity) {
         localStorage.setItem(`plan_${selectedOpportunity.opportunityName}`, JSON.stringify({
            analysis,
            structure,
            strategy,
            actionPlan: actionPlanResult,
            chartData,
            executiveBrief: briefResult,
        }));
       }

    } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Finalization Failed',
          description: 'Failed to generate the action plan. Please try again.',
        });
    } finally {
        setIsFinalizing(false);
    }
  }
  
  const handleBackToOpportunities = () => {
    router.push('/opportunities');
  };

  const handlePrint = () => {
    window.print();
  }
  
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
                 <Button size="lg" disabled={isLoading} onClick={handleBuildPlan}>
                    <Rocket className="mr-2 h-4 w-4"/>
                    {isLoading ? "Building Foundational Plan..." : "Build Business Plan"}
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

  const renderDashboard = () => {
    if (!selectedOpportunity || !analysis || !structure || !strategy) return null;

    if (!actionPlan) {
        return (
             <OpportunityDashboard
                opportunity={selectedOpportunity}
                analysis={analysis}
                structure={structure}
                strategy={strategy}
                actionPlan={null}
                chartData={chartData}
                executiveBrief={null}
                onBack={handleBackToOpportunities}
            >
                {buildModeAdvice && (
                    <BuildModeSelector 
                        advice={buildModeAdvice} 
                        onSelectBuildMode={handleFinalizePlan}
                        isFinalizing={isFinalizing}
                    />
                )}
             </OpportunityDashboard>
        )
    }

    return (
        <OpportunityDashboard
            opportunity={selectedOpportunity}
            analysis={analysis}
            structure={structure}
            strategy={strategy}
            actionPlan={actionPlan}
            chartData={chartData}
            executiveBrief={executiveBrief}
            onBack={handleBackToOpportunities}
        />
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader>
        {planBuilt && actionPlan && (
          <Button onClick={handlePrint} variant="outline" size="sm" className="ml-auto print:hidden">
            <Printer className="mr-2 h-4 w-4" />
            Export as Blueprint
          </Button>
        )}
      </AppHeader>
      <main className="flex-1 container mx-auto px-4 py-8">
       {isLoading && <OpportunityDashboardSkeleton onBack={handleBackToOpportunities} title="Building Your Business Plan..." />}
       {!isLoading && !planBuilt && renderInitialState()}
       {!isLoading && planBuilt && renderDashboard()}
      </main>
    </div>
  );
}
