
'use client';

import SimulationPlayground from '@/components/dashboard/simulation-playground';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SimulationsContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <SimulationPlayground domain={domain} />;
}

export default function SimulationsPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <SimulationsContent />
        </Suspense>
    )
}
