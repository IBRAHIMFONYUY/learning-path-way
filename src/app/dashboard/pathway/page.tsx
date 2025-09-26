
'use client';

import LearningPathway from '@/components/dashboard/learning-pathway';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

function PathwayContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <LearningPathway domain={domain} />;
}

export default function PathwayPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader /></div>}>
            <PathwayContent />
        </Suspense>
    )
}
