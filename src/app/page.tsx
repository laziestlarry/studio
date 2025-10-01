'use client';

import { useState } from 'react';
import { identifyPromisingOpportunities } from '@/ai/flows/identify-promising-opportunities';
import type { IdentifyPromisingOpportunitiesInput } from '@/ai/flows/identify-promising-opportunities';
import type { Opportunity } from '@/lib/types';
import { useRouter } from 'next/navigation';

import AppHeader from '@/components/app-header';
import OpportunityForm from '@/components/opportunity-form';
import { useToast } from '@/hooks/use-toast';
import { OpportunityListSkeleton } from '@/components/opportunity-skeletons';


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDiscover = async (data: IdentifyPromisingOpportunitiesInput) => {
    setIsLoading(true);

    try {
      const result = await identifyPromisingOpportunities(data);
      if (result && result.length > 0) {
        // Store opportunities in local storage to pass to the next page
        localStorage.setItem('discoveredOpportunities', JSON.stringify(result));
        router.push('/opportunities');
      } else {
        toast({
          variant: 'destructive',
          title: 'No Opportunities Found',
          description: 'The AI could not identify any opportunities. Try adjusting your inputs.',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to fetch business opportunities. Please try again.',
      });
      setIsLoading(false);
    } 
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <OpportunityListSkeleton />;
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Turn Raw Data Into Actionable Business Ventures
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Paste any document, article, or unstructured text into the field below. The AI will analyze it to identify and frame high-potential business opportunities for you.
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
