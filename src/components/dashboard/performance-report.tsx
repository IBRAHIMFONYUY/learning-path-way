'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateReportAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, AlertTriangle, ArrowUpRight, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
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
  const [state, dispatch] = useFormState(generateReportAction, initialState);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
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
        <Card>
            <CardHeader>
                <CardTitle>Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <Award className="w-8 h-8 text-primary mt-1" />
                    <p className="text-muted-foreground">
                        {state.data?.overallFeedback || "Your overall feedback will be displayed here."}
                    </p>
                </div>
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="text-green-500"/> Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{state.data?.strengths || "Identified strengths will appear here."}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-yellow-500" /> Weaknesses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{state.data?.weaknesses || "Identified weaknesses will appear here."}</p>
            </CardContent>
          </Card>
        </div>
         <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ArrowUpRight className="text-blue-500" /> Growth Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{state.data?.growthAreas || "Suggested areas for growth will appear here."}</p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
