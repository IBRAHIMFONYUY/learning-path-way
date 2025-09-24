
'use client';

import { useEffect, useState, useTransition } from 'react';
import { generateSimulationAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FlaskConical, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useProgress } from '@/hooks/use-progress';

type Simulation = {
  title: string;
  description: string;
  tasks: string[];
};

export default function SimulationPlayground({ domain }: { domain: string }) {
  const { toast } = useToast();
  const { incrementSimulationsRun } = useProgress();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [isPending, startTransition] = useTransition();

  const generateSimulation = () => {
    startTransition(async () => {
      const result = await generateSimulationAction(domain);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setSimulation(null);
      } else {
        setSimulation(result.data);
        if (result.data) {
          incrementSimulationsRun();
          toast({
            title: "New Simulation Generated!",
            description: "Your progress has been updated."
          })
        }
      }
    });
  };

  // Generate a simulation on initial load
  useEffect(() => {
    if(!simulation) {
      generateSimulation();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);


  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start gap-3">
          <FlaskConical className="w-8 h-8 text-primary mt-1 shrink-0" />
          <div>
            <CardTitle className="text-2xl">
              {isPending ? <Skeleton className="h-7 w-64" /> : simulation?.title || 'Simulation Playground'}
            </CardTitle>
            <CardDescription className="mt-1">
              {isPending ? (
                <div className="space-y-2 mt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                simulation?.description || 'Generate a scenario to begin.'
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 min-h-[150px]">
        <div>
          <h3 className="font-semibold mb-3 text-lg">Your Tasks</h3>
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          ) : simulation && simulation.tasks.length > 0 ? (
            <ul className="space-y-3">
              {simulation.tasks.map((task: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          ) : (
             <div className="text-center text-muted-foreground py-12">
                Click the button below to generate a new simulation scenario.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 p-4 border-t">
        <Button onClick={generateSimulation} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Generating...' : 'Generate New Simulation'}
        </Button>
      </CardFooter>
    </Card>
  );
}
