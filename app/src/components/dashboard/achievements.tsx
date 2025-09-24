
'use client';

import { useState } from 'react';
import { useProgress } from '@/hooks/use-progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Check, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Achievement } from '@/hooks/use-progress';
import { Badge } from '../ui/badge';


function AchievementDetails({ achievement }: { achievement: Achievement }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Award className={`w-8 h-8 ${achievement.unlockedAt ? 'text-amber-500' : 'text-muted-foreground'}`} />
          {achievement.title}
        </DialogTitle>
        <DialogDescription>{achievement.description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Status</h4>
          {achievement.unlockedAt ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <Check className="mr-2 h-4 w-4" />
              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </Badge>
          )}
        </div>
        <div>
          <h4 className="font-semibold mb-2">Your Progress</h4>
          <Progress value={achievement.progress} className={achievement.unlockedAt ? '[&>div]:bg-amber-500' : ''} />
          <p className="text-sm text-muted-foreground mt-1">{achievement.progress}% complete</p>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Requirements</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
                {Object.entries(achievement.criteria).map(([key, value]) => (
                    <li key={key}>Complete {value} {key.replace(/([A-Z])/g, ' $1').toLowerCase()}(s)</li>
                ))}
            </ul>
        </div>
      </div>
    </DialogContent>
  );
}


export default function Achievements() {
  const { achievements, progress: userProgress } = useProgress();

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;
    if (a.unlockedAt && b.unlockedAt) return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    return b.progress - a.progress;
  });

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
                <p className="text-3xl font-bold">{userProgress.quizzesTaken}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <h4 className="text-sm font-semibold text-muted-foreground">Simulations Run</h4>
                <p className="text-3xl font-bold">{userProgress.simulationsRun}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <h4 className="text-sm font-semibold text-muted-foreground">Role-Plays Finished</h4>
                <p className="text-3xl font-bold">{userProgress.rolePlaysCompleted}</p>
            </div>
        </CardContent>
       </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Your Achievements</CardTitle>
            <CardDescription>Complete tasks to unlock new achievements and showcase your mastery.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {sortedAchievements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="mx-auto h-12 w-12 mb-4" />
              <p>No achievements have been defined yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAchievements.map((ach) => (
                <Dialog key={ach.id}>
                  <DialogTrigger asChild>
                    <Card className={`flex flex-col cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${ach.unlockedAt ? 'bg-amber-50 border-amber-200' : 'bg-card'}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Award className={`w-6 h-6 ${ach.unlockedAt ? 'text-amber-500' : 'text-muted-foreground'}`} />
                          {ach.title}
                        </CardTitle>
                        <CardDescription>{ach.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow mt-auto">
                        <Progress value={ach.progress} className={ach.unlockedAt ? '[&>div]:bg-amber-500' : ''} />
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <AchievementDetails achievement={ach} />
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
