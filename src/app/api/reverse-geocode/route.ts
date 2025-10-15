import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json();
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key is not configured' },
        { status: 500 }
      );
    }

    const client = new Client({});
    
    const response = await client.reverseGeocode({
      params: {
        latlng: `${latitude},${longitude}`,
        key: apiKey,
        language: 'es',
      },
    });

    if (response.data.results.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró ninguna dirección' },
        { status: 404 }
      );
    }

    // Buscar la localidad/ciudad
    const result = response.data.results[0];
    let city = '';
    let country = '';

    // Intentar encontrar la ciudad y el país
    for (const component of result.address_components) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_2') && !city) {
        city = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      }
    }

    const formattedAddress = city && country ? `${city}, ${country}` : result.formatted_address;

    return NextResponse.json({
      address: formattedAddress,
      fullAddress: result.formatted_address,
    });

  } catch (error: any) {
    console.error('Error in reverse geocoding:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get address' },
      { status: 500 }
    );
  }
}
