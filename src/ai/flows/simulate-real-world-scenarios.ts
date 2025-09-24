'use server';
/**
 * @fileOverview Implements AI-driven role-play scenarios with voice chat integration for skill practice.
 *
 * - simulateRealWorldScenario - A function that simulates real-world scenarios using AI role-play.
 * - SimulateRealWorldScenarioInput - The input type for the simulateRealWorldScenario function.
 * - SimulateRealWorldScenarioOutput - The return type for the simulateRealWorldScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateRealWorldScenarioInputSchema = z.object({
  scenarioDescription: z.string().describe('The description of the real-world scenario.'),
  userRole: z.string().describe('The role of the user in the scenario.'),
  aiRole: z.string().describe('The role the AI should adopt in the scenario.'),
  voiceChatEnabled: z.boolean().describe('Whether voice chat is enabled for the scenario.'),
});

export type SimulateRealWorldScenarioInput = z.infer<typeof SimulateRealWorldScenarioInputSchema>;

const SimulateRealWorldScenarioOutputSchema = z.object({
  response: z.string().describe('The AI response in the role-play scenario.'),
  audioDataUri: z.string().optional().describe('The audio data URI for the AI response, if voice chat is enabled.'),
});

export type SimulateRealWorldScenarioOutput = z.infer<typeof SimulateRealWorldScenarioOutputSchema>;

export async function simulateRealWorldScenario(input: SimulateRealWorldScenarioInput): Promise<SimulateRealWorldScenarioOutput> {
  return simulateRealWorldScenarioFlow(input);
}

const simulateRealWorldScenarioPrompt = ai.definePrompt({
  name: 'simulateRealWorldScenarioPrompt',
  input: {schema: SimulateRealWorldScenarioInputSchema},
  output: {schema: SimulateRealWorldScenarioOutputSchema},
  prompt: `You are an AI that simulates real-world scenarios for users to practice their skills.

The user will be playing the role of: {{{userRole}}}.
You will be playing the role of: {{{aiRole}}}.

The scenario is described as follows: {{{scenarioDescription}}}.

Generate your response as the assigned role. If voice chat is enabled, indicate that the response can be converted to speech.
`,
});

const simulateRealWorldScenarioFlow = ai.defineFlow(
  {
    name: 'simulateRealWorldScenarioFlow',
    inputSchema: SimulateRealWorldScenarioInputSchema,
    outputSchema: SimulateRealWorldScenarioOutputSchema,
  },
  async input => {
    const {voiceChatEnabled} = input;
    const {output} = await simulateRealWorldScenarioPrompt(input);

    let audioDataUri: string | undefined = undefined;
    if (voiceChatEnabled) {
      const ttsOutput = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {voiceName: 'Algenib'},
            },
          },
        },
        prompt: output!.response,
      });

      if (ttsOutput.media) {
        // Convert PCM data to WAV format
        const audioBuffer = Buffer.from(
          ttsOutput.media.url.substring(ttsOutput.media.url.indexOf(',') + 1),
          'base64'
        );

        const wav = require('wav');
        async function toWav(
          pcmData: Buffer,
          channels = 1,
          rate = 24000,
          sampleWidth = 2
        ): Promise<string> {
          return new Promise((resolve, reject) => {
            const writer = new wav.Writer({
              channels,
              sampleRate: rate,
              bitDepth: sampleWidth * 8,
            });

            let bufs = [] as any[];
            writer.on('error', reject);
            writer.on('data', function (d) {
              bufs.push(d);
            });
            writer.on('end', function () {
              resolve(Buffer.concat(bufs).toString('base64'));
            });

            writer.write(pcmData);
            writer.end();
          });
        }

        audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
      }
    }

    return {response: output!.response, audioDataUri};
  }
);
