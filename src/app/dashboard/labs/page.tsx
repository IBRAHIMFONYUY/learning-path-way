
'use client';

import RolePlayLab from '@/components/dashboard/role-play-lab';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { withTimeout } from '@/lib/utils';
import { simulateRealWorldScenario } from '@/ai/flows/simulate-real-world-scenarios';

function LabsContent() {
    const searchParams = useSearchParams();
    const domain = searchParams.get('domain') || 'general';
    const { toast } = useToast();
    const [testing, setTesting] = useState(false);

    const runHealthCheck = async () => {
      setTesting(true);
      try {
        const res = await withTimeout(
          simulateRealWorldScenario({
            scenarioDescription: `Quick connectivity test for domain ${domain}. Respond with a short greeting as the AI coach.`,
            userRole: 'Learner',
            aiRole: 'AI Coach',
            voiceChatEnabled: false,
            history: [],
          }),
          12000,
          'AI response timed out'
        );
        if (res?.response) {
          toast({ title: 'AI Health Check Passed', description: 'Text response received successfully.' });
        } else {
          toast({ variant: 'destructive', title: 'AI Health Check Failed', description: 'No response payload returned.' });
        }
      } catch (e: any) {
        toast({ variant: 'destructive', title: 'Health Check Error', description: e?.message || 'Unknown error' });
      } finally {
        setTesting(false);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Labs Health Check</CardTitle>
          </CardHeader>
          <CardContent>
            Quickly verify AI connectivity and response performance.
          </CardContent>
          <CardFooter>
            <Button onClick={runHealthCheck} disabled={testing}>
              {testing ? 'Running...' : 'Run AI Health Check'}
            </Button>
          </CardFooter>
        </Card>
        <RolePlayLab domain={domain} />
      </div>
    );
}

export default function LabsPage() {
    return (
        <Suspense fallback={<div className="flex h-64 w-full items-center justify-center"><Loader /></div>}>
            <LabsContent />
        </Suspense>
    )
}
