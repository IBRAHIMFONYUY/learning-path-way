
'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitMerge, FileQuestion, MessageCircle, ToyBrick, BarChart3, Briefcase, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const domain = searchParams.get('domain') || 'general';

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const getTabValue = () => {
    const path = pathname.split('/').pop();
    if (['dashboard', ''].includes(path || '')) return 'overview';
    return path;
  }

  const tabs = [
    { value: 'pathway', label: 'Pathway', icon: GitMerge },
    { value: 'quizzes', label: 'Quizzes', icon: FileQuestion },
    { value: 'labs', label: 'Labs', icon: MessageCircle },
    { value: 'simulations', label: 'Simulations', icon: ToyBrick },
    { value: 'reports', label: 'Reports', icon: BarChart3 },
    { value: 'career', label: 'Career', icon: Briefcase },
    { value: 'achievements', label: 'Achievements', icon: Award },
  ];

  return (
    <>
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl font-headline">
          {capitalize(domain)} Learning Dashboard
        </h1>
      </div>
      <Tabs value={getTabValue()} className="space-y-4">
        <TabsList>
            <TabsTrigger value="overview" asChild>
                <Link href={`/dashboard?domain=${domain}`}>Overview</Link>
            </TabsTrigger>
          {tabs.map(tab => (
             <TabsTrigger value={tab.value} asChild key={tab.value}>
                <Link href={`/dashboard/${tab.value}?domain=${domain}`}>
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.label}
                </Link>
            </TabsTrigger>
          ))}
        </TabsList>
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
