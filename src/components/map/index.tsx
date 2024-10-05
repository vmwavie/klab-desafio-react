import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

mapboxgl.accessToken =
  'pk.eyJ1Ijoidm13YXZpZSIsImEiOiJjbTF0emNzMHQwODBtMm5vaGJoM3M0Y2kzIn0.9VaIgIohQRTYjWkKyZeGig';

export default function Map({
  street,
  neighborhood,
  localidade,
  uf,
}: {
  street: string;
  neighborhood: string;
  localidade: string;
  uf: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-51.9253, -14.235],
        zoom: 2,
      });

      mapRef.current.on('load', () => {
        setMapLoaded(true);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    async function fetchLocationData() {
      if (mapLoaded && mapRef.current) {
        try {
          const query = encodeURIComponent(
            `${street}, ${neighborhood}, ${localidade}, ${uf}, Brasil`
          );
          const mapboxResponse = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`
          );

          const features = mapboxResponse.data.features;
          if (features.length > 0) {
            const [lng, lat] = features[0].center;
            mapRef.current.flyTo({
              center: [lng, lat],
              zoom: 17,
              essential: true,
            });

            if (markerRef.current) {
              markerRef.current.remove();
            }

            markerRef.current = new mapboxgl.Marker({
              element: createCustomMarkerElement(),
              anchor: 'bottom',
            })
              .setLngLat([lng, lat])
              .addTo(mapRef.current);
          } else {
            console.error('location not found');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchLocationData();
  }, [mapLoaded, street, neighborhood, localidade, uf]);

  function createCustomMarkerElement() {
    const el = document.createElement('div');
    // el.className = 'custom-marker';
    // el.style.width = '25px';
    // el.style.height = '41px';
    // el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EA4335'%3E%3Cpath d='M12 0C7.02 0 3 4.02 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.98-4.02-9-9-9z'/%3E%3C/svg%3E")`;
    // el.style.backgroundSize = 'contain';
    // el.style.backgroundRepeat = 'no-repeat';
    // el.style.backgroundPosition = 'center';
    // el.style.cursor = 'pointer';

    return el;
  }

  return (
    <div
      className="rounded-md relative w-full overflow-hidden"
      style={{ height: '40rem' }}
    >
      <div
        ref={mapContainerRef}
        id="mapContainer"
        className="rounded-md absolute inset-0"
      ></div>
    </div>
  );
}
