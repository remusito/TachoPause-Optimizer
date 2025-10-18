'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { SettingsSheet } from '../components/settings-sheet';
import { cn } from '@/lib/utils';
import { useAchievements } from '@/hooks/use-achievements-provider';
import { addHistoryItem } from '@/lib/data';
import { useAuth, useFirestore } from '@/firebase';

// El sidebar solo se mostrará si esta variable es true (en home)
const showSidebar = false;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
};

export default function SpeedometerPage() {
  const [speed, setSpeed] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null); // <-- tipo correcto
  const lastPositionRef = useRef<GeolocationPosition | null>(null); // <-- tipo correcto
  const speedSamplesRef = useRef<number[]>([]);
  const { toast } = useToast();
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { user } = useAuth();
  const db = useFirestore();
  const { updateAchievementProgress, incrementAchievementProgress } = useAchievements();

  const handleSuccess: PositionCallback = (position) => {
    const currentSpeed = position.coords.speed;
    const speedKmh = currentSpeed ? Math.round(currentSpeed * 3.6) : 0;
    setSpeed(speedKmh);
    setError(null);

    if (speedKmh > maxSpeed) {
      setMaxSpeed(speedKmh);
      updateAchievementProgress('speeder', speedKmh);
      updateAchievementProgress('supersonic', speedKmh);
    }

    if (lastPositionRef.current) {
      const newDistance = calculateDistance(
        lastPositionRef.current.coords.latitude,
        lastPositionRef.current.coords.longitude,
        position.coords.latitude,
        position.coords.longitude
      );
      setDistance(prev => prev + newDistance);
      updateAchievementProgress('marathoner', (distance + newDistance) / 1000);
    }

    lastPositionRef.current = position;

    if (speedKmh > 0) {
      speedSamplesRef.current.push(speedKmh);
      const totalSpeed = speedSamplesRef.current.reduce((sum, s) => sum + s, 0);
      setAverageSpeed(Math.round(totalSpeed / speedSamplesRef.current.length));
    }
  };

  const handleError: PositionErrorCallback = (err) => {
    let errorMessage = 'Error desconocido al obtener la ubicación.';
    switch (err.code) {
      case err.PERMISSION_DENIED: errorMessage = 'Permiso de geolocalización denegado.'; break;
      case err.POSITION_UNAVAILABLE: errorMessage = 'Información de ubicación no disponible.'; break;
      case err.TIMEOUT: errorMessage = 'Se agotó el tiempo de espera para obtener la ubicación.'; break;
    }
    setError(errorMessage);
    toast({ title: 'Error de GPS', description: errorMessage, variant: 'destructive' });
    stopTracking(false);
  };

  const resetStats = () => {
    setSpeed(0); setMaxSpeed(0); setAverageSpeed(0);
    setDistance(0); setElapsedTime(0); setStartTime(null);
    lastPositionRef.current = null;
    speedSamplesRef.current = [];
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no es compatible con este navegador.');
      toast({ title: 'Error de compatibilidad', description: 'La geolocalización no es compatible con este navegador.', variant: 'destructive' });
      return;
    }
    resetStats();
    setIsTracking(true);
    setStartTime(Date.now());
    toast({ title: 'GPS Activado', description: 'Iniciando seguimiento de velocidad y distancia.' });
    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  const stopTracking = (showToast = true) => {
    setIsTracking(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (user && db && distance > 0 && elapsedTime > 0) {
      addHistoryItem(db, user.uid, { type: 'conduccion', duration: Math.floor(elapsedTime / 1000), distance: distance / 1000, status: 'completado' });
      if (showToast) {
        toast({ title: 'Sesión Guardada', description: `Viaje de ${(distance / 1000).toFixed(2)} km guardado en tu historial.` });
      }
    } else if (showToast) {
      toast({ title: 'GPS Desactivado', description: 'Seguimiento detenido.', variant: 'destructive' });
    }

    resetStats();
  };

  const handleToggleTracking = () => { isTracking ? stopTracking() : startTracking(); };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTracking && startTime) {
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime(elapsed);
        if (user) incrementAchievementProgress('explorer', 1);
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isTracking, startTime, incrementAchievementProgress, user]);

  useEffect(() => {
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, []);

  return (
    <div className="flex min-h-dvh">
      {showSidebar && <MainSidebar />}
      <div className="flex-1 flex flex-col bg-background text-foreground p-4 sm:p-6">
        <header className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icons.Speedometer className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">Velocímetro</h1>
          </div>
          <SettingsSheet />
        </header>

        <main className="flex-1">
          {/* Aquí va tu contenido original de la página */}
        </main>
      </div>
    </div>
  );
}
