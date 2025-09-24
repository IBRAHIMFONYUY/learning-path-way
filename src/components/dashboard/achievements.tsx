
'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateAchievementsAction } from '@/lib/actions';
import { useProgress } from '@/hooks/use-progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate New Achievements
    </Button>
  );
}

export default function Achievements() {
  const { progress, achievements, addAchievements } = useProgress();
  const initialState = { data: null, error: null };
  const [state, dispatch] = useActionState(generateAchievementsAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error generating achievements',
        description: state.error,
      });
    }
    if (state.data?.achievements) {
      addAchievements(state.data.achievements);
    }
  }, [state, toast, addAchievements]);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Here is a summary of your activity across the platform.</CardDescription>
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
       </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Complete tasks to unlock new achievements and showcase your mastery.</CardDescription>
            </div>
            <form action={() => {
              const formData = new FormData();
              formData.append('progress', JSON.stringify(progress));
              formData.append('unlockedAchievements', JSON.stringify(achievements.filter(a => a.unlocked).map(a => a.title)));
              dispatch(formData);
            }}>
              <SubmitButton />
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="mx-auto h-12 w-12 mb-4" />
              <p>No achievements yet. Generate some to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach, index) => (
                <Card key={index} className={`flex flex-col ${ach.unlocked ? 'bg-amber-50 border-amber-200' : 'bg-card'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                       <Award className={`w-6 h-6 ${ach.unlocked ? 'text-amber-500' : 'text-muted-foreground'}`} />
                       {ach.title}
                    </CardTitle>
                    <CardDescription>{ach.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <Progress value={ach.unlocked ? 100 : ach.progress} className={ach.unlocked ? '[&>div]:bg-amber-500' : ''} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
