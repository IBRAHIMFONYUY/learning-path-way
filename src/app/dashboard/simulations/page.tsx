
'use client';

import SimulationPlayground from '@/components/dashboard/simulation-playground';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

function SimulationsContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <SimulationPlayground domain={domain} />;
}

export default function SimulationsPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader /></div>}>
            <SimulationsContent />
        </Suspense>
    )
}
