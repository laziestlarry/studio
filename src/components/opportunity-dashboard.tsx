import type { Opportunity, Analysis, Strategy, BusinessStructure } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, BarChart3, Bot, BrainCircuit, Building2, Cpu, DollarSign, FileCog, Lightbulb, LineChart, Target, Users } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface OpportunityDashboardProps {
  opportunity: Opportunity;
  analysis: Analysis;
  strategy: Strategy;
  structure: BusinessStructure;
  onBack: () => void;
}

const chartData = [
  { month: 'Jan', revenue: 186 },
  { month: 'Feb', revenue: 305 },
  { month: 'Mar', revenue: 237 },
  { month: 'Apr', revenue: 73 },
  { month: 'May', revenue: 209 },
  { month: 'Jun', revenue: 214 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
};

export default function OpportunityDashboard({ opportunity, analysis, strategy, structure, onBack }: OpportunityDashboardProps) {
  return (
    <div className="animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Opportunities
          </Button>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">{opportunity.opportunityName}</h1>
          <p className="text-muted-foreground mt-1">{opportunity.description}</p>
        </div>
        <Card className="p-3 bg-accent/30">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary"/>
            <p className="text-sm font-semibold">AI Generated Insights</p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:w-[600px] md:grid-cols-3">
          <TabsTrigger value="analysis">
            <LineChart className="mr-2 h-4 w-4" /> Market Analysis
          </TabsTrigger>
          <TabsTrigger value="structure">
            <Building2 className="mr-2 h-4 w-4" /> Org Structure
          </TabsTrigger>
          <TabsTrigger value="strategy">
            <BrainCircuit className="mr-2 h-4 w-4" /> Business Strategy
          </TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="mt-6">
          <div className="space-y-6">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Guidance</AlertTitle>
              <AlertDescription>
                Review this market analysis to understand the competitive environment and potential demand. This data helps validate the viability of the business idea.
              </AlertDescription>
            </Alert>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Demand Forecast</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{analysis.demandForecast}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Competitive Landscape</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{analysis.competitiveLandscape}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{analysis.potentialRevenue}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Illustrative Revenue Projection</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} tickFormatter={(value) => `$${value}K`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="structure" className="mt-6">
            <div className="space-y-6">
                 <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Organizational Blueprint</AlertTitle>
                    <AlertDescription>
                        This is an AI-generated organizational structure designed for automation and efficiency. Use this as a guide to build your team and workflows.
                    </AlertDescription>
                </Alert>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline">
                            <Users className="h-6 w-6 text-primary" />
                            Multi-Layered Commander
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{structure.commander}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline">
                            <Cpu className="h-6 w-6 text-primary" />
                            AI-Core Base
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{structure.aiCore}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">AI-Powered Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible defaultValue="item-0">
                            {structure.departments.map((dept, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-lg font-semibold">{dept.name}</AccordionTrigger>
                                    <AccordionContent className="pt-2 text-base space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Function</h4>
                                            <p className="text-muted-foreground whitespace-pre-line">{dept.function}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">AI Integration</h4>
                                            <p className="text-muted-foreground whitespace-pre-line">{dept.aiIntegration}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="strategy" className="mt-6">
           <div className="space-y-6">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Guidance</AlertTitle>
              <AlertDescription>
                This automated strategy provides a starting point. Adapt these tactics and workflows to your specific goals and resources.
              </AlertDescription>
            </Alert>
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible defaultValue="marketing">
                  <AccordionItem value="marketing">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Marketing Tactics
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-base text-muted-foreground whitespace-pre-line">
                      {strategy.businessStrategy.marketingTactics}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="operations">
                    <AccordionTrigger className="text-lg font-semibold">
                       <div className="flex items-center gap-3">
                        <FileCog className="h-5 w-5 text-primary" />
                        Operational Workflows
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-base text-muted-foreground whitespace-pre-line">
                      {strategy.businessStrategy.operationalWorkflows}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="financials">
                    <AccordionTrigger className="text-lg font-semibold">
                       <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Financial Forecasts
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-base text-muted-foreground whitespace-pre-line">
                      {strategy.businessStrategy.financialForecasts}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
