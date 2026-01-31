import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Gjeolokacioni nuk mbështetet nga shfletuesi juaj.',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const onSuccess: PositionCallback = (position) => {
      console.log('Geolocation success:', position.coords.latitude, position.coords.longitude);
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.log('Geolocation error:', error.code, error.message);
      let errorMessage = 'Gabim në marrjen e lokacionit.';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Leja për lokacionin u refuzua.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Lokacioni nuk është i disponueshëm.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Kërkesa për lokacion skadoi. Provo përsëri ose aktivizo shërbimet e lokacionit (GPS).';
          break;
      }
      setState({
        latitude: null,
        longitude: null,
        error: errorMessage,
        loading: false,
      });
    };

    // 1) Try high accuracy first
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (error) => {
        // 2) If it times out, retry once with low accuracy (often faster on desktop)
        if (error.code === error.TIMEOUT) {
          navigator.geolocation.getCurrentPosition(
            onSuccess,
            handleError,
            {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 600000,
            }
          );
          return;
        }

        handleError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  // Check for existing permission on mount and auto-request if granted
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        }
      }).catch(() => {
        // Permissions API not supported, user needs to click button
      });
    }
  }, [requestLocation]);

  return { ...state, requestLocation };
}
