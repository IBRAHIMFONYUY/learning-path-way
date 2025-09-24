'use server';

/**
 * @fileOverview Generates personalized performance reports for users based on their learning progress.
 *
 * - generatePersonalizedPerformanceReport - A function that generates the performance report.
 * - GeneratePersonalizedPerformanceReportInput - The input type for the generatePersonalizedPerformanceReport function.
 * - GeneratePersonalizedPerformanceReportOutput - The return type for the generatePersonalizedPerformanceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedPerformanceReportInputSchema = z.object({
  learningHistory: z.object({
    quizzesTaken: z.number().describe('The number of quizzes the user has completed.'),
    simulationsRun: z.number().describe('The number of simulations the user has run.'),
    rolePlaysCompleted: z.number().describe('The number of role-play scenarios the user has completed.'),
  }).describe("A detailed record of the user's learning activities."),
  goals: z.string().describe('The user-defined learning goals and objectives.'),
  preferences: z
    .string()
    .describe('The user specified learning style and preferences.'),
});
export type GeneratePersonalizedPerformanceReportInput = z.infer<typeof GeneratePersonalizedPerformanceReportInputSchema>;

const GeneratePersonalizedPerformanceReportOutputSchema = z.object({
  strengths: z.string().describe('A summary of the user’s strengths based on their learning history.'),
  weaknesses: z.string().describe('A summary of the user’s weaknesses based on their learning history.'),
  growthAreas: z
    .string()
    .describe('Suggested areas for improvement and further learning.'),
  overallFeedback: z.string().describe('An overall assessment of the user’s progress and potential.'),
});
export type GeneratePersonalizedPerformanceReportOutput = z.infer<typeof GeneratePersonalizedPerformanceReportOutputSchema>;

export async function generatePersonalizedPerformanceReport(
  input: GeneratePersonalizedPerformanceReportInput
): Promise<GeneratePersonalizedPerformanceReportOutput> {
  return generatePersonalizedPerformanceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedPerformanceReportPrompt',
  input: {schema: GeneratePersonalizedPerformanceReportInputSchema},
  output: {schema: GeneratePersonalizedPerformanceReportOutputSchema},
  prompt: `You are an AI learning assistant that specializes in providing personalized feedback to students.

  Based on the student's learning history, goals, and preferences, provide a detailed performance report.

  Learning History:
  - Quizzes Taken: {{{learningHistory.quizzesTaken}}}
  - Simulations Run: {{{learningHistory.simulationsRun}}}
  - Role-Plays Completed: {{{learningHistory.rolePlaysCompleted}}}

  Goals: {{{goals}}}
  Preferences: {{{preferences}}}

  Consider the student's goals and preferences when generating the report.
  The report should include:
  - Strengths: A summary of the student’s strengths based on their learning history.
  - Weaknesses: A summary of the student’s weaknesses based on their learning history.
  - Growth Areas: Suggested areas for improvement and further learning.
  - Overall Feedback: An overall assessment of the student’s progress and potential.
  `,
});

const generatePersonalizedPerformanceReportFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedPerformanceReportFlow',
    inputSchema: GeneratePersonalizedPerformanceReportInputSchema,
    outputSchema: GeneratePersonalizedPerformanceReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
