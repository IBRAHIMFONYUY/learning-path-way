
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import PREDEFINED_ACHIEVEMENTS from '@/lib/achievements.json';

type Progress = {
  quizzesTaken: number;
  simulationsRun: number;
  rolePlaysCompleted: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  criteria: Partial<Progress>;
  unlockedAt: string | null;
  progress: number;
};

export type HistoryItem = {
    id: string;
    type: 'quiz' | 'simulation' | 'role-play';
    title: string;
    timestamp: string;
    details?: any;
}

type ProgressContextType = {
  progress: Progress;
  achievements: Achievement[];
  history: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;
  isLoading: boolean;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({
    quizzesTaken: 0,
    simulationsRun: 0,
    rolePlaysCompleted: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = useCallback((type: 'progress' | 'achievements' | 'history') => {
    if (!user?.email) return null;
    return `adapt-learn-${type}-${user.email}`;
  }, [user?.email]);
  
  const calculateAchievementProgress = useCallback((userProgress: Progress, allAchievements: Achievement[]): Achievement[] => {
    return allAchievements.map(ach => {
        if (ach.unlockedAt) {
            return { ...ach, progress: 100 };
        }

        let totalProgress = 0;
        let criteriaCount = 0;

        for (const key in ach.criteria) {
            const criteriaKey = key as keyof Progress;
            criteriaCount++;
            const required = ach.criteria[criteriaKey]!;
            const current = userProgress[criteriaKey];
            totalProgress += Math.min(current / required, 1);
        }

        const calculatedProgress = criteriaCount > 0 ? (totalProgress / criteriaCount) * 100 : 0;
        const isUnlocked = calculatedProgress >= 100;

        return {
            ...ach,
            progress: Math.floor(calculatedProgress),
            unlockedAt: isUnlocked ? new Date().toISOString() : null
        };
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      setIsLoading(true);
      try {
        const progressKey = getStorageKey('progress');
        const achievementsKey = getStorageKey('achievements');
        const historyKey = getStorageKey('history');
        
        const savedProgress = progressKey ? JSON.parse(localStorage.getItem(progressKey) || 'null') : null;
        const savedAchievements = achievementsKey ? JSON.parse(localStorage.getItem(achievementsKey) || 'null') : null;
        const savedHistory = historyKey ? JSON.parse(localStorage.getItem(historyKey) || '[]') : [];

        const currentProgress = savedProgress || { quizzesTaken: 0, simulationsRun: 0, rolePlaysCompleted: 0 };
        setProgress(currentProgress);
        setHistory(savedHistory);

        const allAchievements = PREDEFINED_ACHIEVEMENTS.map(ach => {
            const saved = savedAchievements?.find((sa: Achievement) => sa.id === ach.id);
            return { ...ach, unlockedAt: saved?.unlockedAt || null, progress: 0 };
        });

        const updatedAchievements = calculateAchievementProgress(currentProgress, allAchievements);
        setAchievements(updatedAchievements);
        
      } catch (error) {
        console.error("Failed to load data from localStorage", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, getStorageKey, calculateAchievementProgress]);

  const saveData = useCallback((key: string | null, data: any) => {
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to save to localStorage with key ${key}`, error);
      }
    }
  }, []);

  const addHistoryItem = (item: HistoryItem) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    saveData(getStorageKey('history'), newHistory);

    // Update progress based on history item type
    const newProgress = { ...progress };
    if(item.type === 'quiz') newProgress.quizzesTaken += 1;
    if(item.type === 'simulation') newProgress.simulationsRun += 1;
    if(item.type === 'role-play') newProgress.rolePlaysCompleted += 1;
    setProgress(newProgress);
    saveData(getStorageKey('progress'), newProgress);

    // Recalculate achievements
    const updatedAchievements = calculateAchievementProgress(newProgress, achievements);
    setAchievements(updatedAchievements);
    saveData(getStorageKey('achievements'), updatedAchievements);
  };

  const value = {
    progress,
    achievements,
    history,
    addHistoryItem,
    isLoading,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
