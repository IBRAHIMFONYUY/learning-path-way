
'use client';

import CareerGuide from '@/components/dashboard/career-guide';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

function CareerContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <CareerGuide domain={domain} />;
}

export default function CareerPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader /></div>}>
            <CareerContent />
        </Suspense>
    )
}
