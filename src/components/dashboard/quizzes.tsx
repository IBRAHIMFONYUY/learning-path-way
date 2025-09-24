'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createQuizAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Quiz
    </Button>
  );
}

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

type Answers = { [key: number]: number };

export default function Quizzes({ domain }: { domain: string }) {
  const initialState = { data: null, error: null };
  const [state, dispatch] = useActionState(createQuizAction, initialState);
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.data) {
      setQuiz(state.data.quiz);
      setAnswers({});
      setSubmitted(false);
      setScore(0);
    }
  }, [state, toast]);

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!quiz) return;
    let newScore = 0;
    for (let i = 0; i < quiz.length; i++) {
      if (answers[i] === quiz[i].correctAnswerIndex) {
        newScore++;
      }
    }
    setScore(newScore);
    setSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <form action={dispatch}>
          <CardHeader>
            <CardTitle>Quiz Generator</CardTitle>
            <CardDescription>
              Create a quiz for any topic within your chosen domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="hidden" name="domain" value={domain} />
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" placeholder="e.g., React Hooks, Human Anatomy" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select name="difficulty" defaultValue="beginner" required>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfQuestions">Number of Questions</Label>
              <Input id="numberOfQuestions" name="numberOfQuestions" type="number" min="1" max="10" defaultValue="5" required />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your Quiz</CardTitle>
          {submitted && quiz && <CardDescription>Your score: {score} / {quiz.length}</CardDescription>}
        </CardHeader>
        <CardContent>
          {quiz ? (
            <div className="space-y-6">
              {quiz.map((q, qIndex) => (
                <div key={qIndex}>
                  <p className="font-medium mb-4">{qIndex + 1}. {q.question}</p>
                  <RadioGroup value={answers[qIndex]?.toString()} onValueChange={(val) => handleAnswerChange(qIndex, parseInt(val))}>
                    {q.options.map((option, oIndex) => {
                       const isCorrect = oIndex === q.correctAnswerIndex;
                       const isSelected = answers[qIndex] === oIndex;
                       let colorClass = '';
                       if (submitted) {
                           if (isCorrect) colorClass = 'text-green-700 dark:text-green-400';
                           else if (isSelected && !isCorrect) colorClass = 'text-red-700 dark:text-red-400';
                       }
                      return (
                        <div key={oIndex} className={`flex items-center space-x-2 p-2 rounded-md ${colorClass}`}>
                          <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}o${oIndex}`} />
                          <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {submitted && (
                    <div className="mt-2 p-3 bg-secondary rounded-md text-sm">
                        <p className="font-semibold">Explanation:</p>
                        <p>{q.explanation}</p>
                    </div>
                  )}
                  {qIndex < quiz.length -1 && <Separator className="mt-6" />}
                </div>
              ))}
              <Button onClick={handleSubmitQuiz} disabled={submitted || Object.keys(answers).length !== quiz.length}>
                Submit Quiz
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">Your generated quiz will appear here.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
