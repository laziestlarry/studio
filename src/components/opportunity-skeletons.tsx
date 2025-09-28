
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Opportunity } from '@/lib/types';


export const OpportunityListSkeleton = ({title = "Discovering Opportunities..."}: {title?: string}) => (
  <div>
    <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">{title}</h2>
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

export const OpportunityDashboardSkeleton = ({ onBack }: { onBack: () => void }) => (
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
