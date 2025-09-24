
'use server';

/**
 * @fileOverview Generates a detailed simulation scenario for a specific domain.
 *
 * - generateSimulationScenario - A function that generates a simulation scenario.
 * - GenerateSimulationScenarioInput - The input type for the generateSimulationScenario function.
 * - GenerateSimulationScenarioOutput - The return type for the generateSimulationScenario function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSimulationScenarioInputSchema = z.object({
  domain: z.string().describe('The domain for which to generate the simulation (e.g., tech, art, medicine).'),
});
export type GenerateSimulationScenarioInput = z.infer<typeof GenerateSimulationScenarioInputSchema>;

const GenerateSimulationScenarioOutputSchema = z.object({
  title: z.string().describe('The title of the simulation scenario.'),
  description: z.string().describe('A detailed description of the scenario, setting the scene for the user.'),
  tasks: z.array(z.string()).describe('A list of 3-5 specific, actionable tasks the user must complete within the simulation.'),
});
export type GenerateSimulationScenarioOutput = z.infer<typeof GenerateSimulationScenarioOutputSchema>;

export async function generateSimulationScenario(input: GenerateSimulationScenarioInput): Promise<GenerateSimulationScenarioOutput> {
  return generateSimulationScenarioFlow(input);
}

const simulationPrompt = ai.definePrompt({
  name: 'simulationPrompt',
  input: { schema: GenerateSimulationScenarioInputSchema },
  output: { schema: GenerateSimulationScenarioOutputSchema.pick({ title: true, description: true, tasks: true }) },
  prompt: `You are an expert scenario designer for educational simulations. Generate a compelling and realistic simulation scenario for the domain of {{{domain}}}.

The scenario must include:
1. A clear and engaging title.
2. A detailed description that sets the scene, explains the user's role, and outlines the primary goal.
3. A list of 3 to 5 concrete tasks that the user needs to accomplish to complete the simulation successfully.

Make the scenario challenging but achievable, suitable for a learner looking to apply their knowledge in a practical context.
`,
});

const generateSimulationScenarioFlow = ai.defineFlow(
  {
    name: 'generateSimulationScenarioFlow',
    inputSchema: GenerateSimulationScenarioInputSchema,
    outputSchema: GenerateSimulationScenarioOutputSchema,
  },
  async (input) => {
    const { output } = await simulationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate simulation scenario.');
    }
    return output;
  }
);
