
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { ActionPlan, Task, Opportunity, BusinessStructure } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle, CircleDashed, Cpu, PartyPopper, Play, RotateCcw, Link, Server, GitBranch, ArrowRight, Rocket, Building2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const mapCategoryToDept = (category: string): string => {
    const mapping: { [key: string]: string } = {
        'Marketing': 'Strategy & Innovation',
        'Operations': 'Technology & Development',
        'Quality Assurance': 'Technology & Development',
        'Finance': 'Strategy & Innovation',
        'Customer Service': 'Strategy & Innovation'
    };
    return mapping[category] || 'Strategy & Innovation';
};

export default function BuildProgress({ actionPlan, structure, opportunity }: { actionPlan: ActionPlan, structure: BusinessStructure, opportunity: Opportunity }) {
  const allTasks = actionPlan.actionPlan.flatMap(category => 
    category.tasks.map(task => ({ ...task, department: mapCategoryToDept(task.category) }))
  );

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [executionLog, setExecutionLog] = useState<string[]>(['[SYSTEM] AI-Corp Genesis sequence initiated...']);
  const [isBuildFinished, setIsBuildFinished] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const tasksToExecute = allTasks.filter(task => !completedTasks.includes(task.id));
  const progressPercentage = (completedTasks.length / allTasks.length) * 100;

  const tasksByDepartment = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {};
    allTasks.forEach(task => {
        const dept = task.department;
        if (!grouped[dept]) {
            grouped[dept] = [];
        }
        grouped[dept].push(task);
    });
    return structure.departments.map(dept => ({
        ...dept,
        tasks: grouped[dept.name] || []
    })).filter(dept => dept.tasks.length > 0);
  }, [allTasks, structure.departments]);
  
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  const handleExecuteNext = () => {
    if (tasksToExecute.length > 0) {
      const nextTask = tasksToExecute[0];
      setExecutionLog(prev => [...prev, `[COMMAND] Directive issued to ${nextTask.department}...`]);
      setTimeout(() => {
        setCompletedTasks(prev => [...prev, nextTask.id]);
        setExecutionLog(prev => [...prev, `[DONE] ${nextTask.department} completed: ${nextTask.title}`]);
        
        if (tasksToExecute.length === 1) {
          setIsBuildFinished(true);
          setExecutionLog(prev => [...prev, `[SYSTEM] All build tasks complete. AI-Corp systems are configured and ready for launch.`]);
        }
      }, 300);
    }
  };

  const handleLaunch = () => {
    setExecutionLog(prev => [...prev, `[LAUNCH] Genesis Protocol initiated by Commander. Activating all systems...`]);
    setIsLaunched(true);
  }

  const handleReset = () => {
    setCompletedTasks([]);
    setExecutionLog(['[SYSTEM] AI-Corp Genesis sequence initiated...']);
    setIsBuildFinished(false);
    setIsLaunched(false);
  };
  
  const handleVisitApp = () => {
    router.push('/dashboard');
  }

  const getTaskStatusIcon = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (!isBuildFinished && tasksToExecute.length > 0 && tasksToExecute[0].id === taskId) {
        return <Cpu className="h-5 w-5 text-primary animate-pulse" />;
    }
    return <CircleDashed className="h-5 w-5 text-muted-foreground" />;
  }

  const generatedUrl = `https://${opportunity.opportunityName.toLowerCase().replace(/\s+/g, '-')}.genesis.app`;

  if (isLaunched) {
    return (
        <Card className="animate-in fade-in-50 duration-500 text-center">
            <CardHeader>
                <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-4 w-fit">
                    <PartyPopper className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="font-headline text-3xl mt-4">Genesis Complete: AI Empire is Live</CardTitle>
                 <CardDescription>The AI-Corp has finished executing the build plan. Your new business is now operational.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="text-left">
                    <CardHeader>
                        <CardTitle className="text-xl">Your New App is Live</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                            <Link className="h-5 w-5 text-primary"/>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleVisitApp(); }} className="font-mono text-sm font-semibold text-primary truncate hover:underline">{generatedUrl}</a>
                        </div>
                        <Button onClick={handleVisitApp} className="w-full">
                            Access Mission Control <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="text-left">
                    <CardHeader>
                        <CardTitle className="text-xl">Automated Systems Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       <div className="flex items-center gap-3">
                           <GitBranch className="h-5 w-5 text-green-500" />
                           <span className="font-medium">CI/CD Pipeline:</span>
                           <span className="text-green-500 font-semibold ml-auto">Active</span>
                       </div>
                        <div className="flex items-center gap-3">
                           <Server className="h-5 w-5 text-green-500" />
                           <span className="font-medium">Scheduled AI Workflows:</span>
                           <span className="text-green-500 font-semibold ml-auto">Running</span>
                       </div>
                    </CardContent>
                </Card>
                <Button onClick={handleReset} variant="outline" className="w-full">
                    <RotateCcw className="mr-2 h-4 w-4"/>
                    Re-run Genesis Simulation
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>AI-Corp: Departmental Execution</CardTitle>
          <CardDescription>Issue directives to your AI-Corp. The AI-Core will orchestrate departmental task completion.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={tasksByDepartment.map(d => d.name)} className="w-full">
            {tasksByDepartment.map(dept => (
              <AccordionItem key={dept.name} value={dept.name}>
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary"/>
                    {dept.name}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4 pt-2">
                    {dept.tasks.map(task => (
                      <li key={task.id} className="flex items-center gap-4">
                        {getTaskStatusIcon(task.id)}
                        <span className={cn(
                            "flex-1",
                            completedTasks.includes(task.id) ? "line-through text-muted-foreground" : "text-foreground"
                        )}>{task.title}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Commander's Control</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-4 mb-4">
                <Progress value={progressPercentage} className="flex-1"/>
                <span className="font-bold text-lg">{Math.round(progressPercentage)}%</span>
            </div>
            {isBuildFinished ? (
              <Button className="w-full" size="lg" onClick={handleLaunch}>
                  <Rocket className="mr-2 h-5 w-5" />
                  Launch Genesis Protocol
              </Button>
            ) : (
              <Button className="w-full" onClick={handleExecuteNext}>
                  <Play className="mr-2 h-4 w-4"/>
                  Execute Next Directive
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>AI-Core Execution Log</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={logContainerRef} className="h-64 bg-muted/50 rounded-md p-4 overflow-y-auto font-mono text-xs space-y-2">
                    {executionLog.map((log, index) => (
                        <p key={index} className="flex items-start">
                            <Check className="h-3 w-3 text-green-500 mr-2 mt-0.5 shrink-0"/>
                            <span>{log}</span>
                        </p>
                    ))}
                     {!isBuildFinished && tasksToExecute.length > 0 && (
                       <p className="flex items-start animate-pulse">
                            <Cpu className="h-3 w-3 text-primary mr-2 mt-0.5 shrink-0"/>
                            <span>Awaiting next directive from Commander for task: {tasksToExecute[0].title}</span>
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
