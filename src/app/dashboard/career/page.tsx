
'use client';

import CareerGuide from '@/components/dashboard/career-guide';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function CareerContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <CareerGuide domain={domain} />;
}

export default function CareerPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <CareerContent />
        </Suspense>
    )
}
