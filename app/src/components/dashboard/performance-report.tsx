
'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateReportAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, AlertTriangle, ArrowUpRight, Award, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useProgress } from '@/hooks/use-progress';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Report
    </Button>
  );
}

export default function PerformanceReport({ domain }: { domain: string }) {
  const { progress, history } = useProgress();
  const initialState = { data: null, error: null };
  
  const [state, formAction, isPending] = useActionState(generateReportAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleGenerateReport = (formData: FormData) => {
    formData.append('progress', JSON.stringify(progress));
    formData.append('history', JSON.stringify(history));
    formData.append('domain', domain);
    formAction(formData);
  }

  const ReportSection = ({ icon, title, content, placeholder }: { icon: React.ReactNode, title: string, content?: string, placeholder: string }) => (
     <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">{icon} {title}</CardTitle>
        </CardHeader>
        <CardContent>
            {isPending ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ) : (
                <p className="text-muted-foreground">{content || placeholder}</p>
            )}
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Your Progress Summary</CardTitle>
          <CardDescription>This data is used to automatically generate your performance report for the <span className="font-semibold">{domain}</span> domain.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-secondary rounded-lg">
                <h4 className="text-sm font-semibold text-muted-foreground">Quizzes Completed</h4>
                <p className="text-3xl font-bold">{progress.quizzesTaken}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <h4 className="text-sm font-semibold text-muted-foreground">Simulations Run</h4>
                <p className="text-3xl font-bold">{progress.simulationsRun}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <h4 className="text-sm font-semibold text-muted-foreground">Role-Plays Finished</h4>
                <p className="text-3xl font-bold">{progress.rolePlaysCompleted}</p>
            </div>
        </CardContent>
        <CardFooter>
            <form action={handleGenerateReport}>
                 <SubmitButton />
            </form>
        </CardFooter>
       </Card>
      
      <div className="space-y-6">
        {!state.data && !isPending && (
            <Card className="flex flex-col items-center justify-center text-center py-24">
                <CardHeader>
                    <div className="p-4 bg-secondary rounded-full mx-auto">
                        <BarChart3 className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="mt-4">Your Performance Report</CardTitle>
                    <CardDescription className="max-w-sm mx-auto">Click the button above to generate a detailed report on your strengths, weaknesses, and areas for growth based on your activity.</CardDescription>
                </CardHeader>
            </Card>
        )}
        {(state.data || isPending) && (
            <>
                <ReportSection 
                    icon={<Award className="w-6 h-6 text-primary" />}
                    title="Overall Feedback"
                    content={state.data?.overallFeedback}
                    placeholder="Your overall feedback will be displayed here."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReportSection
                        icon={<Zap className="w-6 h-6 text-green-500"/>}
                        title="Strengths"
                        content={state.data?.strengths}
                        placeholder="Identified strengths will appear here."
                    />
                    <ReportSection
                        icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
                        title="Weaknesses"
                        content={state.data?.weaknesses}
                        placeholder="Identified weaknesses will appear here."
                    />
                </div>
                <ReportSection
                    icon={<ArrowUpRight className="w-6 h-6 text-blue-500" />}
                    title="Growth Areas"
                    content={state.data?.growthAreas}
                    placeholder="Suggested areas for growth will appear here."
                />
            </>
        )}
      </div>
    </div>
  );
}
