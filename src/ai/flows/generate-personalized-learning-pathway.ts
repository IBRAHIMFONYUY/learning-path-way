'use server';

/**
 * @fileOverview Generates a personalized learning pathway based on user skills, preferences, and goals.
 *
 * - generatePersonalizedLearningPathway - A function that generates the personalized learning pathway.
 * - GeneratePersonalizedLearningPathwayInput - The input type for the generatePersonalizedLearningPathway function.
 * - GeneratePersonalizedLearningPathwayOutput - The return type for the generatePersonalizedLearningPathway function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedLearningPathwayInputSchema = z.object({
  skills: z.string().describe('The user\'s current skills.'),
  preferences: z.string().describe('The user\'s learning preferences.'),
  goals: z.string().describe('The user\'s learning goals.'),
  domain: z.string().describe('The domain of study (e.g., medicine, business, language, art, tech).'),
});
export type GeneratePersonalizedLearningPathwayInput = z.infer<typeof GeneratePersonalizedLearningPathwayInputSchema>;

const GeneratePersonalizedLearningPathwayOutputSchema = z.object({
  learningPathway: z.string().describe('A structured learning pathway tailored to the user.'),
});
export type GeneratePersonalizedLearningPathwayOutput = z.infer<typeof GeneratePersonalizedLearningPathwayOutputSchema>;

export async function generatePersonalizedLearningPathway(
  input: GeneratePersonalizedLearningPathwayInput
): Promise<GeneratePersonalizedLearningPathwayOutput> {
  return generatePersonalizedLearningPathwayFlow(input);
}

const conceptConnectionTool = ai.defineTool({
  name: 'conceptConnectionTool',
  description: 'Identifies relevant connections between different concepts, subjects, and resources to create interdisciplinary and comprehensive learning paths.',
  inputSchema: z.object({
    concept1: z.string().describe('First concept to connect'),
    concept2: z.string().describe('Second concept to connect'),
  }),
  outputSchema: z.string().describe('Explanation of the relationship between two concepts.'),
}, async (input) => {
  // Placeholder implementation for concept connection.  Replace with actual logic.
  return `The connection between ${input.concept1} and ${input.concept2} is complex and requires further study.`;
});

const pathwayGenerationPrompt = ai.definePrompt({
  name: 'pathwayGenerationPrompt',
  input: {schema: GeneratePersonalizedLearningPathwayInputSchema},
  output: {schema: GeneratePersonalizedLearningPathwayOutputSchema},
  tools: [conceptConnectionTool],
  prompt: `You are an expert learning pathway generator. You will generate a personalized learning pathway based on the user's skills, preferences, and goals.

  Skills: {{{skills}}}
  Preferences: {{{preferences}}}
  Goals: {{{goals}}}
  Domain: {{{domain}}}

  Consider the user's skills, preferences, and goals to create a structured learning pathway with stages, topics, resources, and milestones that adapts dynamically based on user progress and assessments. Use the conceptConnectionTool to identify connections between disparate concepts and topics in order to create a holistic and comprehensive learning journey. The learning pathway should progress from beginner to intermediate to advanced levels.
  `, // eslint-disable-line max-len
});

const generatePersonalizedLearningPathwayFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathwayFlow',
    inputSchema: GeneratePersonalizedLearningPathwayInputSchema,
    outputSchema: GeneratePersonalizedLearningPathwayOutputSchema,
  },
  async input => {
    const {output} = await pathwayGenerationPrompt(input);
    return output!;
  }
);
