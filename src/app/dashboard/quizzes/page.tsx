
'use client';

import Quizzes from '@/components/dashboard/quizzes';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

function QuizzesContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <Quizzes domain={domain} />;
}

export default function QuizzesPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader /></div>}>
            <QuizzesContent />
        </Suspense>
    )
}
