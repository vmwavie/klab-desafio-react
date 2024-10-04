import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { Height } from '@mui/icons-material';

mapboxgl.accessToken =
  'pk.eyJ1Ijoidm13YXZpZSIsImEiOiJjbTF0emNzMHQwODBtMm5vaGJoM3M0Y2kzIn0.9VaIgIohQRTYjWkKyZeGig';

export default function Map({
  localidade,
  uf,
}: {
  localidade: string;
  uf: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-51.9253, -14.235],
        zoom: 4,
      });

      mapRef.current.on('load', () => {
        setMapLoaded(true);
      });

      mapRef.current.getCanvas().style.zIndex = '1';
      mapRef.current.getCanvas().style.height = '100%';
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
          const mapboxResponse = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              `${localidade}, ${uf}, Brasil`
            )}.json?access_token=${mapboxgl.accessToken}`
          );

          const features = mapboxResponse.data.features;
          if (features.length > 0) {
            const [lng, lat] = features[0].center;
            mapRef.current.flyTo({
              center: [lng, lat],
              zoom: 12,
              essential: true,
            });
            if (mapRef.current) {
              new mapboxgl.Marker({
                element: createCustomMarkerElement(),
              })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);
            }
          } else {
            console.error('location not found');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchLocationData();
  }, [mapLoaded, localidade, uf]);

  function createCustomMarkerElement() {
    p;
    const el = document.createElement('div');
    return el;
  }

  return (
    <div className="rounded-md relative w-full" style={{ height: '40rem' }}>
      <div
        ref={mapContainerRef}
        id="mapContainer"
        className="rounded-md absolute inset-0"
      ></div>
    </div>
  );
}
