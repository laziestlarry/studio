import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import type { Opportunity } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { RankedOpportunity } from '@/app/opportunities/page';

interface OpportunityCardProps {
  opportunity: Opportunity | RankedOpportunity;
  onSelect: () => void;
}

const getImageForOpportunity = (name: string) => {
  const lowerCaseName = name.toLowerCase();
  if (lowerCaseName.includes('e-commerce') || lowerCaseName.includes('shop')) {
    return PlaceHolderImages.find(img => img.id === 'ecommerce');
  }
  if (lowerCaseName.includes('freelance') || lowerCaseName.includes('portal')) {
    return PlaceHolderImages.find(img => img.id === 'freelance');
  }
  if (lowerCaseName.includes('saas') || lowerCaseName.includes('software')) {
    return PlaceHolderImages.find(img => img.id === 'saas');
  }
  if (lowerCaseName.includes('social') || lowerCaseName.includes('media')) {
    return PlaceHolderImages.find(img => img.id === 'social-media');
  }
  if (lowerCaseName.includes('creator') || lowerCaseName.includes('content')) {
    return PlaceHolderImages.find(img => img.id === 'creator');
  }
  return PlaceHolderImages.find(img => img.id === 'default');
};

export default function OpportunityCard({ opportunity, onSelect }: OpportunityCardProps) {
  const { opportunityName, description, potential, risk, quickReturn, priority } = opportunity;
  const placeholder = getImageForOpportunity(opportunityName);
  const isRanked = 'rank' in opportunity;

  const priorityValue = parseInt(priority, 10);
  const priorityColor =
    priorityValue >= 8
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : priorityValue >= 5
      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';

  const rankColor = isRanked && (opportunity as RankedOpportunity).rank <= 3
      ? 'bg-primary/20 text-primary border-primary/30'
      : 'bg-secondary text-secondary-foreground';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:border-primary/50">
      <CardHeader>
        <div className="relative aspect-video mb-4">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={placeholder.description}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={placeholder.imageHint}
            />
          )}
           {isRanked && (
            <Badge variant="outline" className={cn("absolute top-2 right-2 text-lg font-bold", rankColor)}>
              #{(opportunity as RankedOpportunity).rank}
            </Badge>
          )}
        </div>
        <CardTitle className="font-headline text-xl">{opportunityName}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {isRanked && (opportunity as RankedOpportunity).rationale && (
            <CardDescription className="text-xs italic pt-2 text-accent">
                <strong>Rationale:</strong> {(opportunity as RankedOpportunity).rationale}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 mt-1 text-primary shrink-0" />
          <div>
            <h4 className="font-semibold">Potential</h4>
            <p className="text-sm text-muted-foreground">{potential}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 mt-1 text-destructive shrink-0" />
          <div>
            <h4 className="font-semibold">Risk</h4>
            <p className="text-sm text-muted-foreground">{risk}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 mt-1 text-accent shrink-0" />
          <div>
            <h4 className="font-semibold">Quick Return</h4>
            <p className="text-sm text-muted-foreground">{quickReturn}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto pt-4">
        <Button onClick={onSelect} variant="default">
          Select & Build Plan <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Badge variant="outline" className={cn('font-semibold', priorityColor)}>Priority: {priority}</Badge>
      </CardFooter>
    </Card>
  );
}
