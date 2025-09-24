
'use client';

import RolePlayLab from '@/components/dashboard/role-play-lab';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function LabsContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    return <RolePlayLab domain={domain} />;
}

export default function LabsPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-[80vh]" />}>
            <LabsContent />
        </Suspense>
    )
}
