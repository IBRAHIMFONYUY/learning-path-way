
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LearningPathway from '@/components/dashboard/learning-pathway';
import Quizzes from '@/components/dashboard/quizzes';
import RolePlayLab from '@/components/dashboard/role-play-lab';
import SimulationPlayground from '@/components/dashboard/simulation-playground';
import PerformanceReport from '@/components/dashboard/performance-report';
import CareerGuide from '@/components/dashboard/career-guide';
import { GitMerge, FileQuestion, MessageCircle, ToyBrick, BarChart3, Briefcase, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Achievements from '@/components/dashboard/achievements';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain') || 'general';

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl font-headline">
          {capitalize(domain)} Learning Dashboard
        </h1>
      </div>
      <Tabs defaultValue="pathway" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pathway" asChild><Link href="/dashboard/pathway"><GitMerge className="mr-2 h-4 w-4" />Pathway</Link></TabsTrigger>
          <TabsTrigger value="quizzes" asChild><Link href="/dashboard/quizzes"><FileQuestion className="mr-2 h-4 w-4" />Quizzes</Link></TabsTrigger>
          <TabsTrigger value="labs" asChild><Link href="/dashboard/labs"><MessageCircle className="mr-2 h-4 w-4" />Labs</Link></TabsTrigger>
          <TabsTrigger value="simulations" asChild><Link href="/dashboard/simulations"><ToyBrick className="mr-2 h-4 w-4" />Simulations</Link></TabsTrigger>
          <TabsTrigger value="reports" asChild><Link href="/dashboard/reports"><BarChart3 className="mr-2 h-4 w-4" />Reports</Link></TabsTrigger>
          <TabsTrigger value="career" asChild><Link href="/dashboard/career"><Briefcase className="mr-2 h-4 w-4" />Career</Link></TabsTrigger>
          <TabsTrigger value="achievements" asChild><Link href="/dashboard/achievements"><Award className="mr-2 h-4 w-4" />Achievements</Link></TabsTrigger>
        </TabsList>
        {/* The content for the tabs is now handled by individual pages */}
      </Tabs>
      <div className="mt-6">
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
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-full" />}>
      <DashboardContent />
    </Suspense>
  );
}
