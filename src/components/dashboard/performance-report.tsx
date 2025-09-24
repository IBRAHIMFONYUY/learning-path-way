'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateReportAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, AlertTriangle, ArrowUpRight, Award, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Report
    </Button>
  );
}

const exampleHistory = `
- Completed 'Introduction to JavaScript' course with 92% average quiz score.
- Built a 'To-Do List' application project.
- Struggled with 'Asynchronous JavaScript' module, quiz score 65%.
- Participated in 3 role-play labs for 'Client Communication'.
`;

export default function PerformanceReport({ domain }: { domain: string }) {
  const initialState = { data: null, error: null };
  const [state, dispatch] = useActionState(generateReportAction, initialState);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const ReportSection = ({ icon, title, content, placeholder }: { icon: React.ReactNode, title: string, content?: string, placeholder: string }) => (
     <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">{icon} {title}</CardTitle>
        </CardHeader>
        <CardContent>
            {pending ? (
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-1 sticky top-6">
        <form action={dispatch}>
          <CardHeader>
            <CardTitle>Performance Report Generator</CardTitle>
            <CardDescription>
              Provide your learning history to get a detailed performance analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="learningHistory">Learning History &amp; Progress</Label>
              <Textarea
                id="learningHistory"
                name="learningHistory"
                placeholder="Detail your completed courses, projects, scores, etc."
                required
                rows={8}
                defaultValue={exampleHistory}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Your Goals</Label>
              <Textarea
                id="goals"
                name="goals"
                placeholder="What are you aiming to achieve?"
                required
                rows={3}
                defaultValue={`Master ${domain} and get a job.`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferences">Learning Preferences</Label>
              <Textarea
                id="preferences"
                name="preferences"
                placeholder="e.g., Hands-on projects, video tutorials"
                required
                rows={3}
                defaultValue="I prefer hands-on projects and interactive simulations."
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <div className="lg:col-span-2 space-y-6">
        {!state.data && !pending && (
            <Card className="flex flex-col items-center justify-center text-center py-24">
                <CardHeader>
                    <div className="p-4 bg-secondary rounded-full mx-auto">
                        <BarChart3 className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="mt-4">Your Performance Report</CardTitle>
                    <CardDescription className="max-w-sm mx-auto">Fill out the form to generate a detailed report on your strengths, weaknesses, and areas for growth.</CardDescription>
                </CardHeader>
            </Card>
        )}
        {(state.data || pending) && (
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
