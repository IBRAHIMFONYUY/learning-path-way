
'use client';

import PerformanceReport from '@/components/dashboard/performance-report';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

function ReportsContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <PerformanceReport domain={domain} />;
}

export default function ReportsPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader /></div>}>
            <ReportsContent />
        </Suspense>
    )
}
