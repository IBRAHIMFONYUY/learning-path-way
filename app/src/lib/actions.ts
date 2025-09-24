
'use server';

import {
  generatePersonalizedLearningPathway,
  type GeneratePersonalizedLearningPathwayInput,
  type GeneratePersonalizedLearningPathwayOutput,
} from '@/ai/flows/generate-personalized-learning-pathway';
import {
  createDomainSpecificQuizzes,
  type CreateDomainSpecificQuizzesInput,
  type CreateDomainSpecificQuizzesOutput,
} from '@/ai/flows/create-domain-specific-quizzes';
import {
  simulateRealWorldScenario,
  type SimulateRealWorldScenarioInput,
  type SimulateRealWorldScenarioOutput,
} from '@/ai/flows/simulate-real-world-scenarios';
import {
  generatePersonalizedPerformanceReport,
  type GeneratePersonalizedPerformanceReportInput,
  type GeneratePersonalizedPerformanceReportOutput,
} from '@/ai/flows/generate-personalized-performance-reports';
import {
  suggestCareerPathsAndSkills,
  type SuggestCareerPathsAndSkillsInput,
  type SuggestCareerPathsAndSkillsOutput,
} from '@/ai/flows/suggest-career-paths-and-skills';
import {
  generateSimulationScenario,
  type GenerateSimulationScenarioOutput,
} from '@/ai/flows/generate-simulation-scenario';
import {
    generateAchievements,
    type GenerateAchievementsInput,
    type GenerateAchievementsOutput,
} from '@/ai/flows/generate-achievements';


type FormState<T> = {
  data: T | null;
  error: string | null;
};

export async function generatePathwayAction(
  prevState: FormState<GeneratePersonalizedLearningPathwayOutput>,
  formData: FormData
): Promise<FormState<GeneratePersonalizedLearningPathwayOutput>> {
  try {
    const input: GeneratePersonalizedLearningPathwayInput = {
      skills: formData.get('skills') as string,
      preferences: formData.get('preferences') as string,
      goals: formData.get('goals') as string,
      domain: formData.get('domain') as string,
    };
    const result = await generatePersonalizedLearningPathway(input);
    return { data: result, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to generate pathway.' };
  }
}

export async function createQuizAction(
  prevState: FormState<CreateDomainSpecificQuizzesOutput>,
  formData: FormData
): Promise<FormState<CreateDomainSpecificQuizzesOutput>> {
  try {
    const input: CreateDomainSpecificQuizzesInput = {
      domain: formData.get('domain') as string,
      topic: formData.get('topic') as string,
      difficulty: formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced',
      numberOfQuestions: parseInt(formData.get('numberOfQuestions') as string, 10),
    };
    const result = await createDomainSpecificQuizzes(input);
    return { data: result, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to create quiz.' };
  }
}

export async function simulateScenarioAction(
  prevState: FormState<SimulateRealWorldScenarioOutput>,
  formData: FormData
): Promise<FormState<SimulateRealWorldScenarioOutput>> {
  try {
    const input: SimulateRealWorldScenarioInput = {
      scenarioDescription: formData.get('scenarioDescription') as string,
      userRole: formData.get('userRole') as string,
      aiRole: formData.get('aiRole') as string,
      history: JSON.parse(formData.get('history') as string || '[]'),
      voiceChatEnabled: formData.get('voiceChatEnabled') === 'true',
    };
    const result = await simulateRealWorldScenario(input);
    return { data: result, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to simulate scenario.' };
  }
}

export async function generateReportAction(
  prevState: FormState<GeneratePersonalizedPerformanceReportOutput>,
  formData: FormData
): Promise<FormState<GeneratePersonalizedPerformanceReportOutput>> {
  try {
    const input: GeneratePersonalizedPerformanceReportInput = {
      learningHistory: JSON.parse(formData.get('progress') as string),
      // For simplicity, we'll use generic goals and preferences.
      // These could be collected from the user in a settings page in a future iteration.
      goals: 'Improve skills in the selected domain and gain practical experience.',
      preferences: 'A preference for hands-on, interactive learning experiences like quizzes and simulations.',
    };
    const result = await generatePersonalizedPerformanceReport(input);
    return { data: result, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to generate report.' };
  }
}

export async function suggestCareerAction(
  prevState: FormState<SuggestCareerPathsAndSkillsOutput>,
  formData: FormData
): Promise<FormState<SuggestCareerPathsAndSkillsOutput>> {
  try {
    const input: SuggestCareerPathsAndSkillsInput = {
      learningJourney: formData.get('learningJourney') as string,
      goals: formData.get('goals') as string,
      interests: formData.get('interests') as string,
    };
    const result = await suggestCareerPathsAndSkills(input);
    return { data: result, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to suggest career paths.' };
  }
}

export async function generateSimulationAction(
  domain: string
): Promise<FormState<GenerateSimulationScenarioOutput>> {
  try {
    const result = await generateSimulationScenario({ domain });
    return { data: result, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to generate simulation.' };
  }
}

export async function generateAchievementsAction(
    prevState: FormState<GenerateAchievementsOutput>,
    formData: FormData
  ): Promise<FormState<GenerateAchievementsOutput>> {
    try {
      const input: GenerateAchievementsInput = {
        progress: JSON.parse(formData.get('progress') as string),
        unlockedAchievements: JSON.parse(formData.get('unlockedAchievements') as string),
      };
      const result = await generateAchievements(input);
      return { data: result, error: null };
    } catch (e: any) {
      return { data: null, error: e.message || 'Failed to generate achievements.' };
    }
  }
