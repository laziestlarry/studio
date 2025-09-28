'use client';

import { useState } from 'react';
import { identifyPromisingOpportunities } from '@/ai/flows/identify-promising-opportunities';
import { analyzeMarketOpportunity } from '@/ai/flows/analyze-market-opportunity';
import { buildAutomatedBusinessStrategy } from '@/ai/flows/build-automated-business-strategy';
import type { IdentifyPromisingOpportunitiesInput } from '@/ai/flows/identify-promising-opportunities';
import type { Opportunity, Analysis, Strategy } from '@/lib/types';

import AppHeader from '@/components/app-header';
import OpportunityForm from '@/components/opportunity-form';
import OpportunityCard from '@/components/opportunity-card';
import OpportunityDashboard from '@/components/opportunity-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[] | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  const { toast } = useToast();

  const handleDiscover = async (data: IdentifyPromisingOpportunitiesInput) => {
    setIsLoading(true);
    setOpportunities(null);
    setSelectedOpportunity(null);

    try {
      const result = await identifyPromisingOpportunities(data);
      if (result && result.length > 0) {
        setOpportunities(result);
      } else {
        toast({
          variant: 'destructive',
          title: 'No Opportunities Found',
          description: 'The AI could not identify any opportunities. Try adjusting your inputs.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to fetch business opportunities. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOpportunity = async (opportunity: Opportunity) => {
    setIsLoading(true);
    setSelectedOpportunity(opportunity);
    setAnalysis(null);
    setStrategy(null);

    try {
      const analysisResult = await analyzeMarketOpportunity({
        opportunityDescription: opportunity.description,
      });
      setAnalysis(analysisResult);

      const marketAnalysisString = `Demand: ${analysisResult.demandForecast}, Competition: ${analysisResult.competitiveLandscape}, Revenue: ${analysisResult.potentialRevenue}`;
      const strategyResult = await buildAutomatedBusinessStrategy({
        marketAnalysis: marketAnalysisString,
      });
      setStrategy(strategyResult);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Failed to analyze the opportunity. Please try again.',
      });
      // Reset to opportunity list on failure
      setSelectedOpportunity(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToOpportunities = () => {
    setSelectedOpportunity(null);
    setAnalysis(null);
    setStrategy(null);
  };
  
  const handleBackToForm = () => {
    setOpportunities(null);
    setSelectedOpportunity(null);
  }

  const renderContent = () => {
    if (isLoading && !selectedOpportunity) {
      return <OpportunityListSkeleton />;
    }
    
    if (isLoading && selectedOpportunity) {
        return <OpportunityDashboardSkeleton opportunity={selectedOpportunity} onBack={handleBackToOpportunities} />;
    }

    if (selectedOpportunity && analysis && strategy) {
      return (
        <OpportunityDashboard
          opportunity={selectedOpportunity}
          analysis={analysis}
          strategy={strategy}
          onBack={handleBackToOpportunities}
        />
      );
    }

    if (opportunities) {
      return (
        <div>
           <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={handleBackToForm}>
                <ArrowLeft />
            </Button>
            <h2 className="font-headline text-3xl font-bold tracking-tight">Identified Opportunities</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp, index) => (
              <OpportunityCard key={index} opportunity={opp} onSelect={() => handleSelectOpportunity(opp)} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Navigate Your Next Business Venture
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Leverage AI to discover, analyze, and strategize your path into the world of online business.
            Start by telling us about your interests and observations.
          </p>
        </div>
        <OpportunityForm onSubmit={handleDiscover} isSubmitting={isLoading} />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

const OpportunityListSkeleton = () => (
  <div>
    <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">Discovering Opportunities...</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border bg-card text-card-foreground rounded-lg shadow-sm">
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="p-6 pt-0">
             <Skeleton className="h-16 w-full mb-4" />
          </div>
          <div className="flex items-center p-6 pt-0">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OpportunityDashboardSkeleton = ({ opportunity, onBack }: { opportunity: Opportunity, onBack: () => void }) => (
    <div>
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={onBack} disabled>
                <ArrowLeft />
            </Button>
            <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-8 w-72" />
            </div>
        </div>
        <div className="space-y-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
        </div>
    </div>
);
