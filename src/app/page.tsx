'use client';

import { useState } from 'react';
import { identifyPromisingOpportunities } from '@/ai/flows/identify-promising-opportunities';
import type { Opportunity } from '@/lib/types';
import { useRouter } from 'next/navigation';

import AppHeader from '@/components/app-header';
import { useToast } from '@/hooks/use-toast';
import { OpportunityListSkeleton } from '@/components/opportunity-skeletons';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLaunch = async () => {
    setIsLoading(true);

    const ventureInput = {
      context: 'A Shopify-based e-commerce store selling digital content, specifically wall art printables, with distribution across multiple platforms including Etsy, Amazon, and eBay.'
    };

    try {
      const result = await identifyPromisingOpportunities(ventureInput);
      if (result && result.length > 0) {
        localStorage.setItem('discoveredOpportunities', JSON.stringify(result));
        router.push('/opportunities');
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'The AI could not generate a plan for this venture. Please try again.',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to generate the business plan. Please try again.',
      });
      setIsLoading(false);
    } 
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <OpportunityListSkeleton title="Analyzing Your Digital Art Venture..." />;
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in-50 duration-500">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Focus & Execute: Launch Your Wall Art Business
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Your immediate priority is generating income. We will focus on your most direct path to revenue: selling your ready-to-publish digital wall art. The B2B tool is a powerful asset for the future, but cash flow is the mission today.
          </p>
        </div>
        <Card className="shadow-lg animate-in fade-in-50 delay-200 duration-500">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Mission: Digital Product Launch</CardTitle>
                <CardDescription>
                    Click the button below to generate a complete, AI-powered business plan specifically for your Shopify/Etsy printable wall art venture. The AI will create your market analysis, business strategy, and a step-by-step action plan to go from idea to income.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleLaunch} disabled={isLoading} size="lg" className="w-full">
                    <Rocket className="mr-2 h-5 w-5"/>
                    Generate Wall Art Business Plan
                </Button>
            </CardContent>
        </Card>
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
