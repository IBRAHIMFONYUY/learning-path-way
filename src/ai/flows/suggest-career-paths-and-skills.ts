'use server';

/**
 * @fileOverview AI flow to suggest relevant career paths, certifications, and skills based on the user's learning journey and goals.
 *
 * - suggestCareerPathsAndSkills - A function that suggests career paths and skills based on user's learning journey and goals.
 * - SuggestCareerPathsAndSkillsInput - The input type for the suggestCareerPathsAndSkills function.
 * - SuggestCareerPathsAndSkillsOutput - The return type for the suggestCareerPathsAndSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCareerPathsAndSkillsInputSchema = z.object({
  learningJourney: z
    .string()
    .describe('The user\'s learning journey, including completed courses, projects, and assessments.'),
  goals: z.string().describe('The user\'s career goals and aspirations.'),
  interests: z.string().describe('The user\'s interests and preferences.'),
});

export type SuggestCareerPathsAndSkillsInput = z.infer<
  typeof SuggestCareerPathsAndSkillsInputSchema
>;

const SuggestCareerPathsAndSkillsOutputSchema = z.object({
  careerPaths: z
    .array(z.string())
    .describe('A list of suggested career paths based on the user\'s learning journey and goals.'),
  certifications: z
    .array(z.string())
    .describe(
      'A list of suggested certifications that would be beneficial to the user.'
    ),
  skills: z
    .array(z.string())
    .describe(
      'A list of skills that the user should focus on developing to achieve their goals.'
    ),
  opportunities: z
    .array(z.string())
    .describe(
      'A list of projects and job opportunities that align with the suggested career paths and skills.'
    ),
});

export type SuggestCareerPathsAndSkillsOutput = z.infer<
  typeof SuggestCareerPathsAndSkillsOutputSchema
>;

export async function suggestCareerPathsAndSkills(
  input: SuggestCareerPathsAndSkillsInput
): Promise<SuggestCareerPathsAndSkillsOutput> {
  return suggestCareerPathsAndSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCareerPathsAndSkillsPrompt',
  input: {schema: SuggestCareerPathsAndSkillsInputSchema},
  output: {schema: SuggestCareerPathsAndSkillsOutputSchema},
  prompt: `You are a career counselor who specializes in helping people align their learning with real-world opportunities.

  Based on the user's learning journey, goals, and interests, suggest relevant career paths, certifications, skills, and opportunities.

  Learning Journey: {{{learningJourney}}}
  Goals: {{{goals}}}
  Interests: {{{interests}}}

  Consider the following when making your suggestions:
  - The user's current skill level and areas of expertise.
  - The user's desired career path and industry.
  - The current job market and emerging trends.
  - Certifications that would validate the user's skills and knowledge.
  - Projects and job opportunities that align with the suggested career paths and skills.

  Output the career paths, certifications, skills and opportunities as lists of strings.`,
});

const suggestCareerPathsAndSkillsFlow = ai.defineFlow(
  {
    name: 'suggestCareerPathsAndSkillsFlow',
    inputSchema: SuggestCareerPathsAndSkillsInputSchema,
    outputSchema: SuggestCareerPathsAndSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
