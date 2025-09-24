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
import { GitMerge, FileQuestion, MessageCircle, ToyBrick, BarChart3, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain') || 'general';

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          {capitalize(domain)} Learning Dashboard
        </h1>
      </div>
      <Tabs defaultValue="pathway" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="pathway"><GitMerge className="mr-2 h-4 w-4" />Pathway</TabsTrigger>
          <TabsTrigger value="quizzes"><FileQuestion className="mr-2 h-4 w-4" />Quizzes</TabsTrigger>
          <TabsTrigger value="labs"><MessageCircle className="mr-2 h-4 w-4" />Labs</TabsTrigger>
          <TabsTrigger value="simulations"><ToyBrick className="mr-2 h-4 w-4" />Simulations</TabsTrigger>
          <TabsTrigger value="reports"><BarChart3 className="mr-2 h-4 w-4" />Reports</TabsTrigger>
          <TabsTrigger value="career"><Briefcase className="mr-2 h-4 w-4" />Career</TabsTrigger>
        </TabsList>
        <div className="flex-grow mt-4">
          <TabsContent value="pathway"><LearningPathway domain={domain} /></TabsContent>
          <TabsContent value="quizzes"><Quizzes domain={domain} /></TabsContent>
          <TabsContent value="labs"><RolePlayLab domain={domain} /></TabsContent>
          <TabsContent value="simulations"><SimulationPlayground domain={domain} /></TabsContent>
          <TabsContent value="reports"><PerformanceReport domain={domain} /></TabsContent>
          <TabsContent value="career"><CareerGuide domain={domain} /></TabsContent>
        </div>
      </Tabs>
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
