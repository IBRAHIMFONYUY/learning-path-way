'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { simulateScenarioAction from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Start Simulation
    </Button>
  );
}

export default function RolePlayLab({ domain }: { domain: string }) {
  const initialState = { data: null, error: null };
  const [state, dispatch] = useFormState(simulateScenarioAction, initialState);
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
            <CardTitle>Role-Play Lab</CardTitle>
            <CardDescription>
              Set up a scenario and practice your skills with an AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <input type="hidden" name="domain" value={domain} />
            <div className="space-y-2">
              <Label htmlFor="scenarioDescription">Scenario Description</Label>
              <Textarea
                id="scenarioDescription"
                name="scenarioDescription"
                placeholder={`e.g., A patient comes in with chest pain (${domain})`}
                required
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Your Role</Label>
              <Input id="userRole" name="userRole" placeholder={`e.g., Doctor in ER`} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiRole">AI's Role</Label>
              <Input id="aiRole" name="aiRole" placeholder={`e.g., Anxious patient`} required />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Simulation Chat</CardTitle>
          <CardDescription>
            The AI's response will appear here. Voice chat is not yet supported.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] overflow-y-auto bg-muted/50 p-4 rounded-md">
          {state.data ? (
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                <div className="p-2 bg-primary text-primary-foreground rounded-full">
                    <Bot size={20} />
                </div>
                <div className="bg-background p-3 rounded-lg max-w-[80%]">
                  <p className="font-semibold text-sm">AI</p>
                  <p>{state.data.response}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              Your role-play simulation will begin here.
            </div>
          )}
        </CardContent>
         <CardFooter className="pt-4">
            <div className="w-full flex gap-2">
                <Textarea placeholder="Your response..." className="flex-grow" />
                <Button>Send</Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
