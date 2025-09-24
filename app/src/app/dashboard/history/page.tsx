
import History from '@/components/dashboard/history';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <History />
        </Suspense>
    )
}
