import { useState } from 'react';
import type { Opportunity, Analysis, Strategy, BusinessStructure, ActionPlan, Task } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, BarChart3, Bot, BrainCircuit, Building2, CheckSquare, Clock, Cpu, DollarSign, FileCog, Gavel, Lightbulb, LineChart, Milestone, Scale, Search, ShieldQuestion, Target, User, Users, Users2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OpportunityDashboardProps {
  opportunity: Opportunity;
  analysis: Analysis;
  strategy: Strategy;
  structure: BusinessStructure;
  actionPlan: ActionPlan;
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

const getPriorityBadgeColor = (priority: 'High' | 'Medium' | 'Low') => {
  switch (priority) {
    case 'High':
      return 'bg-destructive text-destructive-foreground';
    case 'Medium':
      return 'bg-accent text-accent-foreground';
    case 'Low':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const TaskItem = ({ task, onToggle }: { task: Task, onToggle: (id: string) => void }) => (
  <div className="flex items-start gap-4 p-4 border-b">
    <Checkbox
      id={`task-${task.id}`}
      checked={task.completed}
      onCheckedChange={() => onToggle(task.id)}
      className="mt-1"
    />
    <div className="grid gap-1.5 flex-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`task-${task.id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {task.title}
        </label>
        <Badge className={cn("text-xs", getPriorityBadgeColor(task.priority))}>{task.priority} Priority</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{task.description}</p>
      {task.humanContribution && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <User className="h-3 w-3 text-accent"/>
            <strong>Human Contribution:</strong>
            <span>{task.humanContribution}</span>
        </div>
      )}
    </div>
  </div>
);


export default function OpportunityDashboard({ opportunity, analysis, strategy, structure, actionPlan, onBack }: OpportunityDashboardProps) {
  const [tasks, setTasks] = useState(actionPlan.actionPlan.flatMap(category => category.tasks));

  const handleToggleTask = (id: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const getCategorizedTasks = () => {
    return actionPlan.actionPlan.map(category => ({
      ...category,
      tasks: category.tasks.map(task => tasks.find(t => t.id === task.id) || task),
    }));
  };

  const getIconForRole = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('legal')) return <Gavel className="h-5 w-5 text-primary" />;
    if (lowerRole.includes('debat')) return <Scale className="h-5 w-5 text-primary" />;
    if (lowerRole.includes('philosopher') || lowerRole.includes('ethic')) return <BrainCircuit className="h-5 w-5 text-primary" />;
    if (lowerRole.includes('audit')) return <Search className="h-5 w-5 text-primary" />;
    return <User className="h-5 w-5 text-primary" />;
  };

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
        <TabsList className="grid w-full grid-cols-1 md:w-auto md:grid-cols-4">
          <TabsTrigger value="analysis">
            <LineChart className="mr-2 h-4 w-4" /> Market Analysis
          </TabsTrigger>
          <TabsTrigger value="structure">
            <Building2 className="mr-2 h-4 w-4" /> Org Structure
          </TabsTrigger>
          <TabsTrigger value="strategy">
            <BrainCircuit className="mr-2 h-4 w-4" /> Business Strategy
          </TabsTrigger>
          <TabsTrigger value="action-plan">
            <CheckSquare className="mr-2 h-4 w-4" /> Action Plan
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline">
                                <User className="h-6 w-6 text-primary" />
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
                            <CardTitle className="flex items-center gap-3 font-headline">
                                <ShieldQuestion className="h-6 w-6 text-primary" />
                                Advisory Council
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Accordion type="single" collapsible>
                                {structure.advisoryCouncil.map((advisor, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-base font-semibold">
                                          <div className="flex items-center gap-3">
                                            {getIconForRole(advisor.role)}
                                            {advisor.role}
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 text-sm">
                                           <p className="text-muted-foreground">{advisor.description}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline">
                                <Users2 className="h-6 w-6 text-primary" />
                                C-Level Board
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                                {structure.cLevelBoard.map((role, index) => (
                                    <div key={index} className="p-3 border rounded-lg">
                                       <h4 className="font-semibold">{role.role}</h4>
                                       <p className="text-sm text-muted-foreground">{role.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline">
                                <Milestone className="h-6 w-6 text-primary" />
                                Project Management Framework
                            </CardTitle>
                            <CardDescription>{structure.projectManagementFramework.methodology}</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Accordion type="single" collapsible defaultValue="item-0">
                                {structure.projectManagementFramework.phases.map((phase, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-base font-semibold">{phase.phaseName}</AccordionTrigger>
                                        <AccordionContent className="pt-2 text-sm space-y-3">
                                           <p className="text-muted-foreground">{phase.description}</p>
                                           <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                            {phase.keyActivities.map((activity, i) => <li key={i}>{activity}</li>)}
                                           </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                  </div>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">AI-Powered Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            {structure.departments.map((dept, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-lg font-semibold">{dept.name}</AccordionTrigger>
                                    <AccordionContent className="pt-2 text-base space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">Function</h4>
                                            <p className="text-muted-foreground whitespace-pre-line">{dept.function}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">AI Integration</h4>
                                            <p className="text-muted-foreground whitespace-pre-line">{dept.aiIntegration}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-foreground mb-2">AI Staff & Personas</h4>
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                              {dept.staff.map((staff, i) => (
                                                <div key={i} className="p-4 border rounded-lg bg-background/50">
                                                  <h5 className="font-bold">{staff.role}</h5>
                                                  <p className="text-sm text-muted-foreground italic mt-1">{staff.persona}</p>
                                                </div>
                                              ))}
                                            </div>
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
         <TabsContent value="action-plan" className="mt-6">
          <div className="space-y-6">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Actionable Steps</AlertTitle>
              <AlertDescription>
                This is your AI-generated to-do list. Check off tasks as you complete them to track your progress towards launching your business. The AI has prioritized tasks based on urgency and importance.
              </AlertDescription>
            </Alert>
             <Alert variant="destructive">
                <Clock className="h-4 w-4" />
                <AlertTitle>Critical Path Estimate</AlertTitle>
                <AlertDescription>
                    The AI has identified <strong>`{actionPlan.criticalPath.taskTitle}`</strong> as the most time-consuming task, with an estimated duration of <strong>{actionPlan.criticalPath.timeEstimate}</strong>. Prioritizing this will be key to timely project completion.
                </AlertDescription>
            </Alert>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Implementation Progress</CardTitle>
                <div className="flex items-center gap-4 pt-2">
                  <Progress value={progressPercentage} className="w-full" />
                  <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                    {completedTasks} / {totalTasks} Tasks
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="multiple" defaultValue={getCategorizedTasks().map(c => c.categoryTitle)}>
                  {getCategorizedTasks().map(category => (
                    <AccordionItem key={category.categoryTitle} value={category.categoryTitle}>
                      <AccordionTrigger className="px-6 text-lg font-semibold">
                        {category.categoryTitle}
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="border-t">
                          {category.tasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
