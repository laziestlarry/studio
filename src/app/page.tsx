'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { identifyPromisingOpportunities } from '@/ai/flows/identify-promising-opportunities';
import type { IdentifyPromisingOpportunitiesInput } from '@/ai/flows/identify-promising-opportunities';
import AppHeader from '@/components/app-header';
import OpportunityForm from '@/components/opportunity-form';
import { OpportunityListSkeleton } from '@/components/opportunity-skeletons';


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: IdentifyPromisingOpportunitiesInput) => {
    setIsLoading(true);
    try {
      const result = await identifyPromisingOpportunities(data);
      if (result && result.length > 0) {
        localStorage.setItem('discoveredOpportunities', JSON.stringify(result));
        router.push('/opportunities');
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'The AI could not identify any opportunities from the data provided.',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to analyze the provided data. Please try again.',
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
        <div className="text-center mb-12 animate-in fade-in-50 duration-500">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Transform Your Knowledge into Action
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Paste your business plans, internal documents, or raw ideas below. The AI will analyze your data, identify the most promising business opportunities, and generate a complete strategic plan to turn your vision into a reality.
          </p>
        </div>
        <OpportunityForm onSubmit={handleSubmit} isSubmitting={isLoading} />
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
