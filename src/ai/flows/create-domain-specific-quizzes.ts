'use server';

/**
 * @fileOverview Generates domain-specific quizzes and assessments.
 *
 * - createDomainSpecificQuizzes - A function that generates quizzes based on the specified domain.
 * - CreateDomainSpecificQuizzesInput - The input type for the createDomainSpecificQuizzes function.
 * - CreateDomainSpecificQuizzesOutput - The return type for the createDomainSpecificQuizzes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateDomainSpecificQuizzesInputSchema = z.object({
  domain: z.string().describe('The domain for which to generate the quiz (e.g., medicine, art, tech, business).'),
  topic: z.string().describe('The specific topic within the domain for the quiz.'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe('The difficulty level of the quiz.'),
  numberOfQuestions: z.number().int().min(1).max(20).default(5).describe('The number of questions to generate.'),
});
export type CreateDomainSpecificQuizzesInput = z.infer<typeof CreateDomainSpecificQuizzesInputSchema>;

const CreateDomainSpecificQuizzesOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers for the question.'),
      correctAnswerIndex: z.number().int().min(0).describe('The index of the correct answer in the options array.'),
      explanation: z.string().describe('An explanation of why the answer is correct.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type CreateDomainSpecificQuizzesOutput = z.infer<typeof CreateDomainSpecificQuizzesOutputSchema>;

export async function createDomainSpecificQuizzes(input: CreateDomainSpecificQuizzesInput): Promise<CreateDomainSpecificQuizzesOutput> {
  return createDomainSpecificQuizzesFlow(input);
}

const quizPrompt = ai.definePrompt({
  name: 'quizPrompt',
  input: {schema: CreateDomainSpecificQuizzesInputSchema},
  output: {schema: CreateDomainSpecificQuizzesOutputSchema},
  prompt: `You are an expert quiz generator in the domain of {{{domain}}}. Generate a quiz with {{{numberOfQuestions}}} questions on the topic of {{{topic}}} at the {{{difficulty}}} level.

Each question should have multiple choice options, and you must specify the index of the correct answer.
Also, provide an explanation of why the answer is correct. Adhere to the schema strictly.

Example Quiz Format:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Paris", "Rome", "Madrid"],
    "correctAnswerIndex": 1,
    "explanation": "Paris is the capital of France."
  },
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswerIndex": 1,
    "explanation": "2 + 2 = 4"
  }
]

Now generate the quiz:
`,
});

const createDomainSpecificQuizzesFlow = ai.defineFlow(
  {
    name: 'createDomainSpecificQuizzesFlow',
    inputSchema: CreateDomainSpecificQuizzesInputSchema,
    outputSchema: CreateDomainSpecificQuizzesOutputSchema,
  },
  async input => {
    const {output} = await quizPrompt(input);
    return output!;
  }
);
