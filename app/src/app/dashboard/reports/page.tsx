
'use client';

import PerformanceReport from '@/components/dashboard/performance-report';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ReportsContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <PerformanceReport domain={domain} />;
}

export default function ReportsPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-[80vh]" />}>
            <ReportsContent />
        </Suspense>
    )
}
