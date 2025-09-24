
'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <Card>
            <CardHeader>
                <CardTitle>Welcome to your Dashboard</CardTitle>
                <CardDescription>Select a feature from the sidebar to get started with your personalized learning journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This is your central hub for learning. From here, you can generate a learning pathway, take quizzes, run simulations, and track your progress.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-full" />}>
      <DashboardContent />
    </Suspense>
  );
}
