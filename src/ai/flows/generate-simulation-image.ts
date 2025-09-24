
'use server';

/**
 * @fileOverview Generates an image for a simulation scenario.
 *
 * - generateSimulationImage - A function that generates an image based on a description.
 * - GenerateSimulationImageInput - The input type for the generateSimulationImage function.
 * - GenerateSimulationImageOutput - The return type for the generateSimulationImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateSimulationImageInputSchema = z.object({
  description: z.string().describe('The description of the simulation scenario to generate an image for.'),
});
export type GenerateSimulationImageInput = z.infer<typeof GenerateSimulationImageInputSchema>;

const GenerateSimulationImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateSimulationImageOutput = z.infer<typeof GenerateSimulationImageOutputSchema>;

export async function generateSimulationImage(input: GenerateSimulationImageInput): Promise<GenerateSimulationImageOutput> {
  return generateSimulationImageFlow(input);
}

const generateSimulationImageFlow = ai.defineFlow(
  {
    name: 'generateSimulationImageFlow',
    inputSchema: GenerateSimulationImageInputSchema,
    outputSchema: GenerateSimulationImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: `Generate a realistic, high-quality image that visually represents the following educational simulation scenario. The style should be professional and clear. Scenario: ${input.description}`,
      });
      
    if (!media.url) {
        throw new Error('Image generation failed to produce an image.');
    }

    return { imageDataUri: media.url };
  }
);
