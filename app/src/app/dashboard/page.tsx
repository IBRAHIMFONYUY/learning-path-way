
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain') || 'general';

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">
          {capitalize(domain)} Learning Dashboard
        </h1>
      </div>
      <div className="flex-grow">
        <Card>
            <CardHeader>
                <CardTitle>Welcome to your Dashboard</CardTitle>
                <CardDescription>Select a tab above to get started with your personalized learning journey.</CardDescription>
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
