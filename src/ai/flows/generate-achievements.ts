
'use server';

/**
 * @fileOverview Generates achievements for users based on their learning progress.
 *
 * - generateAchievements - A function that generates achievements.
 * - GenerateAchievementsInput - The input type for the generateAchievements function.
 * - GenerateAchievementsOutput - The return type for the generateAchievements function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAchievementsInputSchema = z.object({
  progress: z.object({
    quizzesTaken: z.number().describe('The number of quizzes the user has completed.'),
    simulationsRun: z.number().describe('The number of simulations the user has run.'),
    rolePlaysCompleted: z.number().describe('The number of role-play scenarios the user has completed.'),
  }).describe('The user\'s current progress metrics.'),
  unlockedAchievements: z.array(z.string()).describe('A list of titles of achievements the user has already unlocked.'),
});
export type GenerateAchievementsInput = z.infer<typeof GenerateAchievementsInputSchema>;

const GenerateAchievementsOutputSchema = z.object({
  achievements: z.array(z.object({
    title: z.string().describe('The title of the achievement.'),
    description: z.string().describe('A brief description of what is required to unlock the achievement.'),
    progress: z.number().min(0).max(100).describe('The user\'s current progress towards this achievement (0-100).'),
    unlocked: z.boolean().describe('Whether the user has unlocked this achievement.'),
  })).describe('A list of generated achievements, both locked and unlocked.'),
});
export type GenerateAchievementsOutput = z.infer<typeof GenerateAchievementsOutputSchema>;

export async function generateAchievements(input: GenerateAchievementsInput): Promise<GenerateAchievementsOutput> {
  return generateAchievementsFlow(input);
}

const achievementsPrompt = ai.definePrompt({
  name: 'achievementsPrompt',
  input: { schema: GenerateAchievementsInputSchema },
  output: { schema: GenerateAchievementsOutputSchema },
  prompt: `You are an AI that generates motivating achievements for a learning platform. Based on the user's progress, generate a list of 3-5 relevant achievements.

Current User Progress:
- Quizzes Taken: {{{progress.quizzesTaken}}}
- Simulations Run: {{{progress.simulationsRun}}}
- Role-Plays Completed: {{{progress.rolePlaysCompleted}}}

Achievements Already Unlocked:
{{#if unlockedAchievements}}
{{#each unlockedAchievements}}
- {{{this}}}
{{/each}}
{{else}}
None
{{/if}}

Instructions:
1.  **Do NOT include achievements the user has already unlocked.**
2.  Create achievements that are the next logical step for the user. For example, if they have taken 4 quizzes, suggest an achievement for taking 5 quizzes, not 50.
3.  Calculate the user's current progress towards each new achievement as a percentage (0-100). For example, if the goal is 5 quizzes and they have taken 4, the progress is 80.
4.  Determine if any of the new achievements are already completed by the user's current stats and set the 'unlocked' flag to true.
5.  Make the titles and descriptions fun and engaging.
`,
});

const generateAchievementsFlow = ai.defineFlow(
  {
    name: 'generateAchievementsFlow',
    inputSchema: GenerateAchievementsInputSchema,
    outputSchema: GenerateAchievementsOutputSchema,
  },
  async (input) => {
    const { output } = await achievementsPrompt(input);
    return output!;
  }
);
