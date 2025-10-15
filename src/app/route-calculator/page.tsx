// 👇 Función mejorada con geocoding reverso
const handleUseCurrentLocation = async (segmentId: number) => {
  if (!navigator.geolocation) {
    toast({
      title: 'No disponible',
      description: 'Tu navegador no soporta geolocalización.',
      variant: 'destructive',
    });
    return;
  }

  setIsGettingLocation(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        // Llamar a la API de geocoding reverso
        const response = await fetch('/api/reverse-geocode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude, longitude }),
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener la dirección');
        }

        const data = await response.json();
        
        setSegments(segments.map(seg => 
          seg.id === segmentId 
            ? { ...seg, origin: data.address } 
            : seg
        ));

        toast({
          title: '📍 Ubicación obtenida',
          description: `Tu ubicación: ${data.address}`,
        });
      } catch (error) {
        console.error('Error getting address:', error);
        
        // Fallback: usar coordenadas si falla el geocoding
        const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setSegments(segments.map(seg => 
          seg.id === segmentId 
            ? { ...seg, origin: locationString } 
            : seg
        ));
        
        toast({
          title: '📍 Ubicación obtenida',
          description: 'Se usaron las coordenadas (no se pudo obtener la dirección).',
        });
      } finally {
        setIsGettingLocation(false);
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      setIsGettingLocation(false);
      
      let errorMessage = 'No se pudo obtener tu ubicación.';
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Debes permitir el acceso a tu ubicación en el navegador.';
      }
      
      toast({
        title: 'Error de ubicación',
        description: errorMessage,
        variant: 'destructive',
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};
