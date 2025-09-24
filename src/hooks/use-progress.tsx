
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

type Progress = {
  quizzesTaken: number;
  simulationsRun: number;
  rolePlaysCompleted: number;
};

type Achievement = {
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
};

type ProgressContextType = {
  progress: Progress;
  achievements: Achievement[];
  incrementQuizzesTaken: () => void;
  incrementSimulationsRun: () => void;
  incrementRolePlaysCompleted: () => void;
  addAchievements: (newAchievements: Omit<Achievement, 'unlocked' | 'progress'>[]) => void;
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
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = useCallback((type: 'progress' | 'achievements') => {
    if (!user?.email) return null;
    return `adapt-learn-${type}-${user.email}`;
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      setIsLoading(true);
      try {
        const progressKey = getStorageKey('progress');
        const achievementsKey = getStorageKey('achievements');
        
        const savedProgress = progressKey ? localStorage.getItem(progressKey) : null;
        const savedAchievements = achievementsKey ? localStorage.getItem(achievementsKey) : null;

        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        } else {
            setProgress({ quizzesTaken: 0, simulationsRun: 0, rolePlaysCompleted: 0 });
        }
        if (savedAchievements) {
          setAchievements(JSON.parse(savedAchievements));
        } else {
            setAchievements([]);
        }
      } catch (error) {
        console.error("Failed to load progress from localStorage", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, getStorageKey]);

  const saveData = useCallback((key: string | null, data: any) => {
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to save to localStorage with key ${key}`, error);
      }
    }
  }, []);

  const updateProgress = (updateFn: (prev: Progress) => Progress) => {
    setProgress(prev => {
      const newState = updateFn(prev);
      saveData(getStorageKey('progress'), newState);
      return newState;
    });
  };

  const incrementQuizzesTaken = () => updateProgress(p => ({ ...p, quizzesTaken: p.quizzesTaken + 1 }));
  const incrementSimulationsRun = () => updateProgress(p => ({ ...p, simulationsRun: p.simulationsRun + 1 }));
  const incrementRolePlaysCompleted = () => updateProgress(p => ({ ...p, rolePlaysCompleted: p.rolePlaysCompleted + 1 }));

  const addAchievements = (newAchievements: Omit<Achievement, 'unlocked' | 'progress'>[]) => {
    setAchievements(prev => {
        const existingTitles = new Set(prev.map(a => a.title));
        const uniqueNewAchievements = newAchievements
            .filter(a => !existingTitles.has(a.title))
            .map(a => ({ ...a, unlocked: false, progress: 0 })); // ensure default values

        const updatedList = [...prev, ...uniqueNewAchievements];
        saveData(getStorageKey('achievements'), updatedList);
        return updatedList;
    });
  };

  const value = {
    progress,
    achievements,
    incrementQuizzesTaken,
    incrementSimulationsRun,
    incrementRolePlaysCompleted,
    addAchievements,
    isLoading,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
