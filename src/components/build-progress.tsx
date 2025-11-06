
'use client';

import { useState, useEffect, useRef } from 'react';
import type { ActionPlan, Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle, CircleDashed, Cpu, PartyPopper, Play, RotateCcw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function BuildProgress({ actionPlan }: { actionPlan: ActionPlan }) {
  const allTasks = actionPlan.actionPlan.flatMap(category => category.tasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [executionLog, setExecutionLog] = useState<string[]>(['Genesis build sequence initiated...']);
  const [isComplete, setIsComplete] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const tasksToExecute = allTasks.filter(task => !completedTasks.includes(task.id));
  const progressPercentage = (completedTasks.length / allTasks.length) * 100;
  
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [executionLog]);

  const handleExecuteNext = () => {
    if (tasksToExecute.length > 0) {
      const nextTask = tasksToExecute[0];
      setCompletedTasks(prev => [...prev, nextTask.id]);
      setExecutionLog(prev => [...prev, `[DONE] ${nextTask.title}`]);
      
      if (tasksToExecute.length === 1) {
        setIsComplete(true);
         setExecutionLog(prev => [...prev, `✨ Genesis build complete! Your new business is ready for launch.`]);
      }
    }
  };

  const handleReset = () => {
    setCompletedTasks([]);
    setExecutionLog(['Genesis build sequence initiated...']);
    setIsComplete(false);
  };

  const getTaskStatusIcon = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (tasksToExecute.length > 0 && tasksToExecute[0].id === taskId) {
        return <Cpu className="h-5 w-5 text-primary animate-pulse" />;
    }
    return <CircleDashed className="h-5 w-5 text-muted-foreground" />;
  }

  if (isComplete) {
    return (
        <Card className="animate-in fade-in-50 duration-500 text-center">
            <CardHeader>
                <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-4 w-fit">
                    <PartyPopper className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="font-headline text-3xl mt-4">Genesis Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">The AI has finished executing the build plan. Your business is ready to launch.</p>
                <Button onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4"/>
                    Run Simulation Again
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Action Plan Execution</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={actionPlan.actionPlan.map(c => c.categoryTitle)}>
            {actionPlan.actionPlan.map(category => (
              <AccordionItem key={category.categoryTitle} value={category.categoryTitle}>
                <AccordionTrigger className="text-lg font-semibold">{category.categoryTitle}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4 pt-2">
                    {category.tasks.map(task => (
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
            <CardTitle>Build Progress</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-4">
                <Progress value={progressPercentage} className="flex-1"/>
                <span className="font-bold text-lg">{Math.round(progressPercentage)}%</span>
            </div>
            <Button className="w-full mt-6" onClick={handleExecuteNext} disabled={isComplete}>
                <Play className="mr-2 h-4 w-4"/>
                Execute Next Task
            </Button>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Execution Log</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={logContainerRef} className="h-64 bg-muted/50 rounded-md p-4 overflow-y-auto font-mono text-xs space-y-2">
                    {executionLog.map((log, index) => (
                        <p key={index} className="flex items-start">
                            <Check className="h-3 w-3 text-green-500 mr-2 mt-0.5 shrink-0"/>
                            <span>{log}</span>
                        </p>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
