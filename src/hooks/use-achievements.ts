// src/hooks/use-achievements-provider.ts
import { useState, useEffect } from 'react';
import { allAchievements, type Achievement } from '@/lib/achievements';

type AchievementState = {
  [id: string]: { unlocked: boolean; progress: number };
};

export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementState>({});

  // Cargar logros desde localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('tachoAchievements');
    if (stored) {
      setAchievements(JSON.parse(stored));
    } else {
      // inicializar con todos los logros bloqueados
      const initialState: AchievementState = {};
      allAchievements.forEach(a => {
        initialState[a.id] = { unlocked: false, progress: 0 };
      });
      setAchievements(initialState);
    }
  }, []);

  // Guardar cambios automáticamente en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tachoAchievements', JSON.stringify(achievements));
    }
  }, [achievements]);

  // Desbloquear un logro
  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const current = prev[id] || { unlocked: false, progress: 0 };
      if (current.unlocked) return prev; // ya desbloqueado
      const updated = { ...prev, [id]: { ...current, unlocked: true, progress: 100 } };
      // opcional: mostrar toast aquí si quieres
      // toast({ title: `¡Logro desbloqueado!`, description: allAchievements.find(a => a.id === id)?.title });
      return updated;
    });
  };

  // Actualizar progreso de un logro (0-100)
  const updateProgress = (id: string, progress: number) => {
    setAchievements(prev => {
      const current = prev[id] || { unlocked: false, progress: 0 };
      const newProgress = Math.min(100, Math.max(0, progress));
      return { ...prev, [id]: { ...current, progress: newProgress, unlocked: newProgress >= 100 ? true : current.unlocked } };
    });
  };

  // Resetear logros (opcional)
  const resetAchievements = () => {
    const resetState: AchievementState = {};
    allAchievements.forEach(a => {
      resetState[a.id] = { unlocked: false, progress: 0 };
    });
    setAchievements(resetState);
    localStorage.removeItem('tachoAchievements');
  };

  return { achievements, unlockAchievement, updateProgress, resetAchievements };
}
