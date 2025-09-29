
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Opportunity } from '@/lib/types';
import { rankBusinessOpportunities } from '@/ai/flows/rank-business-opportunities';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OpportunityCard from '@/components/opportunity-card';
import { OpportunityListSkeleton } from '@/components/opportunity-skeletons';

export type RankedOpportunity = Opportunity & {
  rank: number;
  rationale: string;
};

export default function OpportunitiesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rankedOpportunities, setRankedOpportunities] = useState<RankedOpportunity[] | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const opportunitiesString = localStorage.getItem('discoveredOpportunities');
    if (opportunitiesString) {
      const opportunities: Opportunity[] = JSON.parse(opportunitiesString);
      rankOpportunities(opportunities);
    } else {
      // Redirect to home if no opportunities are found
      router.push('/');
    }
  }, [router]);

  const rankOpportunities = async (opportunities: Opportunity[]) => {
    setIsLoading(true);
    try {
      const result = await rankBusinessOpportunities({
        opportunities,
        focus: 'Maximum profit potential with minimal risk and fastest time-to-market.',
      });
      if (result) {
        // The flow already returns sorted items, but we sort again just in case
        const sorted = result.sort((a, b) => a.rank - b.rank);
        setRankedOpportunities(sorted);
      } else {
        toast({
          variant: 'destructive',
          title: 'Ranking Failed',
          description: 'Could not rank the opportunities. Displaying original list.',
        });
        // Fallback to showing unranked opportunities
        setRankedOpportunities(opportunities.map((o, i) => ({ ...o, rank: i + 1, rationale: 'N/A' })));
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to rank business opportunities. Please try again.',
      });
      // Fallback to showing unranked opportunities
      setRankedOpportunities(opportunities.map((o, i) => ({ ...o, rank: i + 1, rationale: 'N/A' })));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectOpportunity = (opportunity: Opportunity) => {
    // Store selected opportunity and navigate to dashboard
    localStorage.setItem('selectedOpportunity', JSON.stringify(opportunity));
    router.push('/dashboard');
  };

  const handleBackToForm = () => {
    localStorage.removeItem('discoveredOpportunities');
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading && <OpportunityListSkeleton title="Ranking Opportunities..." />}
        {!isLoading && rankedOpportunities && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" onClick={handleBackToForm}>
                <ArrowLeft />
              </Button>
              <h2 className="font-headline text-3xl font-bold tracking-tight">Ranked Opportunities</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rankedOpportunities.map((opp) => (
                <OpportunityCard key={opp.rank} opportunity={opp} onSelect={() => handleSelectOpportunity(opp)} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
