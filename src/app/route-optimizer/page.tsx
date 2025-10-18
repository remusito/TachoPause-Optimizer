'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '../components/settings-sheet';
import { PremiumPlaceholder } from '../components/premium-placeholder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { findServiceAreas } from '@/ai/flows/optimize-route-breaks';
import type { FindServiceAreasOutput } from '@/ai/flows/optimize-route-breaks';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function RouteOptimizerPage() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindServiceAreasOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!currentLocation || !destination) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor, introduce la ubicación actual y el destino.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await findServiceAreas({
        currentLocation,
        destination,
      });
      setResult(response);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Error al buscar áreas de servicio: ${errorMessage}`);
        toast({
            title: 'Error de Búsqueda',
            description: `No se pudo obtener la información de la ruta. ${errorMessage}`,
            variant: 'destructive',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="w-full p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.Route className="h-6 w-6 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground">
            Buscador de Paradas
          </h1>
        </div>
        <SettingsSheet />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center w-full p-4 sm:p-6 gap-6">
        <PremiumPlaceholder
          title="Buscador de Áreas de Servicio"
          description="Encuentra fácilmente áreas de servicio, gasolineras y restaurantes en tu ruta."
        >
          <div className="w-full max-w-md space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Busca paradas en tu ruta</CardTitle>
                <CardDescription>Introduce tu punto de partida y destino para ver las áreas de servicio disponibles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-location">Ubicación Actual</Label>
                    <Input 
                      id="current-location" 
                      placeholder="Ej: Madrid, España" 
                      value={currentLocation} 
                      onChange={(e) => setCurrentLocation(e.target.value)} 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destino</Label>
                    <Input 
                      id="destination" 
                      placeholder="Ej: París, Francia" 
                      value={destination} 
                      onChange={(e) => setDestination(e.target.value)} 
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleOptimize} disabled={isLoading} className="w-full">
                  {isLoading ? <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.Route className="mr-2 h-4 w-4" />}
                  {isLoading ? 'Buscando...' : 'Buscar Paradas'}
                </Button>
              </CardFooter>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Áreas de Servicio Encontradas</CardTitle>
                  <CardDescription>{result.routeSummary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.serviceAreas.length === 0 && (
                    <p className="text-muted-foreground text-center">No se encontraron áreas de servicio para esta ruta.</p>
                  )}
                  <div className="space-y-4">
                    {result.serviceAreas.map((area, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-muted/50 flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <Icons.Coffee className="h-6 w-6 text-primary mt-1 shrink-0" />
                          <div className="flex-grow">
                            <p className="font-semibold text-base">{area.name}</p>
                            <p className="text-sm text-muted-foreground">{area.location}</p>
                            <p className="text-sm font-bold text-primary mt-1">{area.distance}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {area.services.includes('gas_station') && <Badge variant="secondary">Gasolinera</Badge>}
                              {area.services.includes('restaurant') && <Badge variant="secondary">Restaurante</Badge>}
                              {area.services.includes('lodging') && <Badge variant="secondary">Alojamiento</Badge>}
                            </div>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                          <a href={area.mapsUrl} target="_blank" rel="noopener noreferrer">
                            <Icons.Map className="mr-2 h-4 w-4" />
                            Ver en mapa
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </PremiumPlaceholder>
      </main>
    </div>
  );
}
