'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '../components/settings-sheet';
import { BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { MainSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { useFirestore } from '@/hooks/use-firestore';
import { useCollection } from '@/hooks/use-collection';
import { useDocument } from '@/hooks/use-document';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { subDays } from 'date-fns';

interface HistoryItem {
  id: string;
  timestamp: { toDate: () => Date };
  type: 'conduccion' | 'pausa';
  duration: number; // seconds
}

interface StatsSummary {
    totalDistance: number;
    totalDrivingTime: number;
    avgSpeed?: number;
}

export default function StatsPage() {
  const { user } = useAuth();
  const db = useFirestore();

  // Fetch summary document
  const { data: summaryData, loading: summaryLoading } = useDocument<StatsSummary>(
    user && db ? `/users/${user.uid}/stats/summary` : null
  );

  // Fetch history for the last 7 days for the chart
  const weeklyHistoryQuery = useMemo(() => {
    if (!user || !db) return null;
    const sevenDaysAgo = Timestamp.fromDate(subDays(new Date(), 7));
    return query(
      collection(db, `users/${user.uid}/history`),
      where('timestamp', '>=', sevenDaysAgo)
    );
  }, [user, db]);

  const { data: weeklyHistory, loading: historyLoading } = useCollection<HistoryItem>(weeklyHistoryQuery);

  const chartData = useMemo(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const data = days.map(day => ({ day, conduccion: 0, pausa: 0 }));

    weeklyHistory.forEach(item => {
      const date = item.timestamp.toDate();
      const dayIndex = date.getDay();
      const durationHours = item.duration / 3600;

      if (item.type === 'conduccion') {
        data[dayIndex].conduccion += durationHours;
      } else {
        data[dayIndex].pausa += durationHours;
      }
    });
    
    // Format to 2 decimal places
    return data.map(d => ({
        ...d,
        conduccion: parseFloat(d.conduccion.toFixed(2)),
        pausa: parseFloat(d.pausa.toFixed(2))
    }));

  }, [weeklyHistory]);

  const loading = summaryLoading || historyLoading;

  const totalDrivingHours = useMemo(() => {
    return summaryData?.totalDrivingTime ? summaryData.totalDrivingTime / 3600 : 0;
  }, [summaryData]);

  return (
    <div className="flex min-h-dvh">
      <MainSidebar />
      <div className="flex-1 flex flex-col bg-background text-foreground p-4 sm:p-6">
        <header className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icons.BarChart className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Estadísticas
            </h1>
          </div>
          <SettingsSheet />
        </header>
        <main className="w-full flex-1 flex flex-col items-center">
          {loading && <Icons.Spinner className="animate-spin h-10 w-10 text-primary my-16" />}
          {!loading && !user && <p className="text-muted-foreground my-16">Inicia sesión para ver tus estadísticas.</p>}
          {!loading && user && (
            <div className="w-full max-w-4xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Horas de Conducción vs. Pausa (Últimos 7 días)</CardTitle>
                  <CardDescription>Resumen de tu actividad en la última semana, en horas.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    conduccion: { label: 'Conducción', color: 'hsl(var(--primary))' },
                    pausa: { label: 'Pausa', color: 'hsl(var(--secondary))' },
                  }} className="min-h-64 w-full">
                    <RechartsBarChart data={chartData} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis unit="h" />
                      <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar dataKey="conduccion" fill="var(--color-conduccion)" radius={4} />
                      <Bar dataKey="pausa" fill="var(--color-pausa)" radius={4} />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Icons.Milestone/> Distancia Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{(summaryData?.totalDistance || 0).toLocaleString('es-ES', { maximumFractionDigits: 0 })} km</p>
                  <p className="text-sm text-muted-foreground">Acumulado histórico</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Icons.Gauge/> Velocidad Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{(summaryData?.avgSpeed || 0).toFixed(0)} km/h</p>
                  <p className="text-sm text-muted-foreground">Acumulado histórico</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Icons.Timer/> Horas Conducidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{totalDrivingHours.toFixed(1)} h</p>
                  <p className="text-sm text-muted-foreground">Acumulado histórico</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
