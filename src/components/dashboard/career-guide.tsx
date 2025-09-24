'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { suggestCareerAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Award, GraduationCap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Get Suggestions
    </Button>
  );
}

const exampleJourney = `
- Learning Path: Full-Stack Web Development
- Completed Courses: JavaScript Basics, React Advanced, Node.js Essentials
- Projects: E-commerce site, personal portfolio
- Quiz Average: 88%
`;

export default function CareerGuide({ domain }: { domain: string }) {
  const initialState = { data: null, error: null };
  const [state, dispatch] = useActionState(suggestCareerAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const renderList = (items: string[] | undefined, placeholder: string) => (
    <div className="flex flex-wrap gap-2">
      {items && items.length > 0 ? (
        items.map((item, index) => <Badge key={index} variant="secondary" className="text-base py-1 px-3">{item}</Badge>)
      ) : (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-1 sticky top-6">
        <form action={dispatch}>
          <CardHeader>
            <CardTitle>AI Career &amp; Skill Guide</CardTitle>
            <CardDescription>
              Let our AI suggest career paths, skills, and opportunities based on your progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="learningJourney">Learning Journey Summary</Label>
              <Textarea
                id="learningJourney"
                name="learningJourney"
                placeholder="Summarize your courses, projects, and achievements."
                required
                rows={6}
                defaultValue={exampleJourney}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Career Goals</Label>
              <Textarea
                id="goals"
                name="goals"
                placeholder="e.g., Land a role as a Machine Learning Engineer"
                required
                rows={3}
                defaultValue={`Find a role in the ${domain} industry.`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Textarea
                id="interests"
                name="interests"
                placeholder="e.g., Data visualization, mobile app development"
                required
                rows={3}
                defaultValue={`Interested in the intersection of ${domain} and AI.`}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="text-primary"/> Suggested Career Paths</CardTitle>
            </CardHeader>
            <CardContent>
                {renderList(state.data?.careerPaths, "Career path suggestions will appear here.")}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><GraduationCap className="text-primary"/> Recommended Skills to Develop</CardTitle>
            </CardHeader>
            <CardContent>
                 {renderList(state.data?.skills, "Skill recommendations will appear here.")}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="text-primary"/> Relevant Certifications</CardTitle>
            </CardHeader>
            <CardContent>
                 {renderList(state.data?.certifications, "Certification suggestions will appear here.")}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Project &amp; Job Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
                {renderList(state.data?.opportunities, "Project and job opportunities will appear here.")}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
