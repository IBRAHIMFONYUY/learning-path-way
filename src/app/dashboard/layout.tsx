
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/app/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell,
  Briefcase,
  FileQuestion,
  GitMerge,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  ToyBrick,
  User,
  BarChart3,
  Award,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { ProgressProvider } from '@/hooks/use-progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const domain = searchParams.get('domain') || 'general';
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const menuItems = [
    { href: `/dashboard/pathway?domain=${domain}`, label: 'Learning Pathway', icon: GitMerge, value: 'pathway' },
    { href: `/dashboard/quizzes?domain=${domain}`, label: 'Quizzes', icon: FileQuestion, value: 'quizzes' },
    { href: `/dashboard/labs?domain=${domain}`, label: 'Role-Play Labs', icon: MessageCircle, value: 'labs' },
    { href: `/dashboard/simulations?domain=${domain}`, label: 'Simulations', icon: ToyBrick, value: 'simulations' },
    { href: `/dashboard/reports?domain=${domain}`, label: 'Reports', icon: BarChart3, value: 'reports' },
    { href: `/dashboard/career?domain=${domain}`, label: 'Career Guide', icon: Briefcase, value: 'career' },
    { href: `/dashboard/achievements?domain=${domain}`, label: 'Achievements', icon: Award, value: 'achievements' },
    { href: `/dashboard/history?domain=${domain}`, label: 'History', icon: History, value: 'history' },
  ];

  const getTabValue = () => {
    const path = pathname.split('/').pop();
    if (path === 'dashboard') return 'pathway'; // Default to pathway
    return path;
  }
  
  // Redirect to pathway if on /dashboard
  useEffect(() => {
    if (pathname === '/dashboard') {
      router.replace(`/dashboard/pathway?domain=${domain}`);
    }
  }, [pathname, router, domain]);

  if (loading || !user) {
    // You can show a loading spinner here
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
    <ProgressProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href.split('?')[0])}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
              {/* Header Content can go here, e.g., Search */}
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name || ''} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary/40">
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-semibold md:text-3xl font-headline">
                {capitalize(domain)} Learning Dashboard
              </h1>
            </div>
             <Tabs value={getTabValue()} className="space-y-4">
                <TabsList>
                  {menuItems.map(tab => (
                    <TabsTrigger value={tab.value} asChild key={tab.value}>
                        <Link href={tab.href}>
                            <tab.icon className="mr-2 h-4 w-4" />
                            {tab.label}
                        </Link>
                    </TabsTrigger>
                  ))}
                </TabsList>
            </Tabs>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProgressProvider>
  );
}
