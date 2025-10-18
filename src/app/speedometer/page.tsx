'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { SettingsSheet } from '../components/settings-sheet';
import { cn } from '@/lib/utils';
import { MainSidebar } from '@/components/ui/sidebar';
import { useAchievements } from '@/hooks/use-achievements-provider';
import { addHistoryItem } from '@/lib/data';
import { useAuth, useFirestore } from '@/firebase';

// Helper: calcula distancia entre dos puntos lat/lon en metros
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;
};

export default function SpeedometerPage() {
  const [speed, setSpeed] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const { toast } = useToast();
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const lastPositionRef = useRef<GeolocationPosition | null>(null);
  const speedSamplesRef = useRef<number[]>([]);
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
      const lastCoords = lastPositionRef.current.coords;
      if (lastCoords) {
        const newDistance = calculateDistance(
          lastCoords.latitude,
          lastCoords.longitude,
          position.coords.latitude,
          position.coords.longitude
        );
        const newTotalDistance = distance + newDistance;
        setDistance(newTotalDistance);
        updateAchievementProgress('marathoner', newTotalDistance / 1000);
      }
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
      case err.PERMISSION_DENIED:
        errorMessage = 'Permiso de geolocalización denegado.';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Información de ubicación no disponible.';
        break;
      case err.TIMEOUT:
        errorMessage = 'Se agotó el tiempo de espera para obtener la ubicación.';
        break;
    }
    setError(errorMessage);
    toast({ title: 'Error de GPS', description: errorMessage, variant: 'destructive' });
    stopTracking(false);
  };

  const resetStats = () => {
    setSpeed(0);
    setMaxSpeed(0);
    setAverageSpeed(0);
    setDistance(0);
    setElapsedTime(0);
    setStartTime(null);
    lastPositionRef.current = null;
    speedSamplesRef.current = [];
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no es compatible con este navegador.');
      toast({
        title: 'Error de compatibilidad',
        description: 'La geolocalización no es compatible con este navegador.',
        variant: 'destructive',
      });
      return;
    }
    resetStats();
    setIsTracking(true);
    setStartTime(Date.now());
    toast({ title: 'GPS Activado', description: 'Iniciando seguimiento de velocidad y distancia.' });
    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  const stopTracking = (showToast = true) => {
    setIsTracking(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (user && db && distance > 0 && elapsedTime > 0) {
      addHistoryItem(db, user.uid, {
        type: 'conduccion',
        duration: Math.floor(elapsedTime / 1000),
        distance: distance / 1000,
        status: 'completado',
      });
      if (showToast) {
        toast({
          title: 'Sesión Guardada',
          description: `Viaje de ${(distance / 1000).toFixed(2)} km guardado en tu historial.`,
        });
      }
    } else if (showToast) {
      toast({ title: 'GPS Desactivado', description: 'Seguimiento detenido.', variant: 'destructive' });
    }
    resetStats();
  };

  const handleToggleTracking = () => {
    if (isTracking) stopTracking();
    else startTracking();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTracking && startTime) {
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime(elapsed);
        if (user) incrementAchievementProgress('explorer', 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTracking, startTime, incrementAchievementProgress, user]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Solo mostrar sidebar en home
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    setShowSidebar(window.location.pathname === '/');
  }, []);

  return (
    <div className="flex min-h-dvh">
      {showSidebar && <MainSidebar />}
      <div className="flex-1 flex flex-col bg-background text-foreground p-4 sm:p-6">
        <header className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icons.Gauge className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">Velocímetro</h1>
          </div>
          <SettingsSheet />
        </header>

        <main className="flex-1 w-full">
          <Card className="mb-6 p-4 text-center">
            {error && <p className="text-red-600">{error}</p>}
            <h2 className="text-4xl font-bold">{speed} km/h</h2>
            <Button onClick={handleToggleTracking} className="mt-4">
              {isTracking ? 'Detener' : 'Iniciar'}
            </Button>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumen de la Sesión Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Vel. Máxima</h4>
                  <p>{maxSpeed} km/h</p>
                </div>
                <div>
                  <h4 className="font-semibold">Vel. Media</h4>
                  <p>{averageSpeed} km/h</p>
                </div>
                <div>
                  <h4 className="font-semibold">Distancia</h4>
                  <p>{(distance / 1000).toFixed(2)} km</p>
                </div>
                <div>
                  <h4 className="font-semibold">Tiempo</h4>
                  <p>{formatTime(elapsedTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground mt-4">
            La precisión de la velocidad depende del GPS de tu dispositivo.
          </p>
        </main>
      </div>
    </div>
  );
}
