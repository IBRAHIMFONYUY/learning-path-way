
import Achievements from '@/components/dashboard/achievements';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AchievementsPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <Achievements />
        </Suspense>
    )
}
