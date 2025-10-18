'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '../components/settings-sheet';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
// ❌ Eliminado: import { MainSidebar } from '@/components/ui/sidebar';
// (El sidebar causaba que en móviles se redujera el ancho del contenido)
import React, { useMemo } from 'react';
import { useAchievements } from '@/hooks/use-achievements-provider';
import { allAchievements, type Achievement } from '@/lib/achievements';

export default function RewardsPage() {
  const { achievements: achievementState } = useAchievements();

  const processedAchievements = useMemo(() => {
    return allAchievements.map((achDef) => {
      const state = achievementState[achDef.id];
      const isUnlocked = state?.unlocked || false;
      const progress = state?.progress || 0;
      const progressPercent =
        achDef.goal > 0 ? (progress / achDef.goal) * 100 : 0;

      return {
        ...achDef,
        unlocked: isUnlocked,
        progress: progressPercent,
      };
    });
  }, [achievementState]);

  const unlockedCount = processedAchievements.filter((a) => a.unlocked).length;
  const totalCount = processedAchievements.length;

  return (
    // 🔄 CAMBIO: antes era `className="flex min-h-dvh"` (fila)
    // ahora es `flex flex-col` para apilar verticalmente (encabezado arriba, contenido abajo)
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      
      {/* 🔄 CAMBIO: añadí padding responsive y borde inferior al header */}
      <header className="w-full p-4 sm:p-6 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Icons.Award className="h-6 w-6 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground">
            Recompensas
          </h1>
        </div>
        <SettingsSheet />
      </header>

      {/* 🔄 CAMBIO: 
          - Eliminado el contenedor con `<MainSidebar />`
          - Añadido un main centrado con `max-w-5xl mx-auto`
          - Añadido `overflow-y-auto` para evitar scroll cortado en móvil */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 overflow-y-auto">

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Progreso de Logros</CardTitle>
            <CardDescription>
              Has desbloqueado {unlockedCount} de {totalCount} logros. ¡Sigue así!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(unlockedCount / totalCount) * 100} />
          </CardContent>
        </Card>

        {/* 🔄 CAMBIO: ligera mejora de grid (más adaptable) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processedAchievements.map((achievement, index) => (
            <Card
              key={index}
              className={cn(
                'transition-all',
                achievement.unlocked
                  ? 'border-primary shadow-lg'
                  : 'bg-muted/50'
              )}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <achievement.icon
                    className={cn(
                      'h-10 w-10 shrink-0',
                      achievement.unlocked
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                  <div>
                    <CardTitle className="text-lg">
                      {achievement.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {achievement.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {!achievement.unlocked && (
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Progress value={achievement.progress} className="h-2" />
                    <span>{Math.round(achievement.progress)}%</span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
