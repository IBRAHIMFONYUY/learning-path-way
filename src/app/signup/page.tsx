'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/app/logo';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('tech'); // default domain
  const [otherDomainInput, setOtherDomainInput] = useState(false);
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const domainData = [
    'tech',
    'medicine',
    'business',
    'language',
    'art',
    'general',
    'other',
  ];

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'other') {
      setOtherDomainInput(true);
      setSelectedDomain(''); // reset until user types their own
    } else {
      setOtherDomainInput(false);
      setSelectedDomain(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If "other" was selected, ensure a custom domain was entered
    if (otherDomainInput && !selectedDomain.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Domain',
        description: 'Please enter your custom domain.',
      });
      return;
    }

    const success = signup(name, email, password, selectedDomain);
    if (success) {
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'An account with this email already exists.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Logo />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ibrahim Fonyuy"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <select
                  id="domain"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  onChange={handleDomainChange}
                  defaultValue="tech"
                >
                  {domainData.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {otherDomainInput && (
                <div className="space-y-2">
                  <Label htmlFor="otherDomain">Other Domain</Label>
                  <Input
                    id="otherDomain"
                    placeholder="Enter your custom domain"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                  />
                </div>
              )}

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-4 text-center text-sm flex items-center justify-center gap-2">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
              or
              <Link href="/" className="underline">
                Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
