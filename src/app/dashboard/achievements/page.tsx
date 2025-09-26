
import Achievements from '@/components/dashboard/achievements';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

export default function AchievementsPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader /></div>}>
            <Achievements />
        </Suspense>
    )
}
