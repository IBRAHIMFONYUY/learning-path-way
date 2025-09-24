
'use client';

import Quizzes from '@/components/dashboard/quizzes';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function QuizzesContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <Quizzes domain={domain} />;
}

export default function QuizzesPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-[80vh]" />}>
            <QuizzesContent />
        </Suspense>
    )
}
