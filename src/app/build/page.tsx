
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Opportunity, ActionPlan } from '@/lib/types';
import AppHeader from '@/components/app-header';
import BuildProgress from '@/components/build-progress';
import { OpportunityDashboardSkeleton } from '@/components/opportunity-skeletons';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BuildPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const opportunityString = localStorage.getItem('selectedOpportunity');
    if (!opportunityString) {
      router.push('/');
      return;
    }
    const opportunity = JSON.parse(opportunityString);
    setSelectedOpportunity(opportunity);

    const storedPlanString = localStorage.getItem(`plan_${opportunity.opportunityName}`);
    if (!storedPlanString) {
      router.push('/dashboard');
      return;
    }
    const storedPlan = JSON.parse(storedPlanString);
    setActionPlan(storedPlan.actionPlan);
    setIsLoading(false);
  }, [router]);
  
  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (isLoading || !selectedOpportunity || !actionPlan) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-1 container mx-auto px-4 py-8">
                <OpportunityDashboardSkeleton onBack={handleBackToDashboard} title="Loading Build Environment..." />
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <Button variant="ghost" size="sm" onClick={handleBackToDashboard} className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blueprint
                </Button>
                <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Build Mode: Genesis</h1>
                <p className="text-muted-foreground mt-1">Executing the plan for: {selectedOpportunity.opportunityName}</p>
            </div>
        </div>

        <BuildProgress actionPlan={actionPlan} />

      </main>
    </div>
  );
}
