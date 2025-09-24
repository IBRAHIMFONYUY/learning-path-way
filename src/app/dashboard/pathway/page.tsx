
'use client';

import LearningPathway from '@/components/dashboard/learning-pathway';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PathwayContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <LearningPathway domain={domain} />;
}

export default function PathwayPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <PathwayContent />
        </Suspense>
    )
}
