'use client';

import type { ExecutiveBrief } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react';
import { Gauge, GaugeCircle } from 'lucide-react';


const BriefGadget = ({ title, value, icon }: { title: string; value: React.ReactNode; icon: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center p-4 text-center rounded-lg bg-card/50">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            {icon}
            <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
);

const ViabilityGauge = ({ score }: { score: number }) => {
    const rotation = -90 + (score / 10) * 180;
    return (
        <div className="relative w-24 h-24">
            <Gauge
                value={score * 10}
                size="lg"
                gap={8}
                showValue
                className="text-primary"
                />
        </div>
    );
};


export default function ExecutiveBriefDisplay({ brief }: { brief: ExecutiveBrief }) {
    return (
        <Card className="mb-8 border-2 border-primary/50 shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Executive Brief</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <BriefGadget 
                        title="Viability Score"
                        icon={<GaugeCircle className="h-4 w-4" />}
                        value={<ViabilityGauge score={brief.viabilityScore} />} 
                    />
                    <BriefGadget 
                        title="ROI Potential" 
                        icon={<TrendingUp className="h-4 w-4" />}
                        value={<Badge variant={brief.roiPotential === 'High' ? 'default' : 'secondary'} className="text-xl px-4 py-1">{brief.roiPotential}</Badge>} 
                    />
                    <BriefGadget 
                        title="Time to Breakeven" 
                        icon={<Clock className="h-4 w-4" />}
                        value={brief.timeToBreakeven} 
                    />
                     <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-4 text-center rounded-lg bg-card/50">
                        <p className="text-sm font-semibold text-center">{brief.strategicRecommendation}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-green-500">
                                <CheckCircle className="h-5 w-5" />
                                Key Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {brief.keyStrengths.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-destructive">
                                <XCircle className="h-5 w-5" />
                                Potential Risks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {brief.potentialRisks.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
