import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Sighting, SightingsOrder } from '../domain/sightings';
import { SightingsRepository } from '../repositories/SightingsRepository';

type ListStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

type InFlightLoad = {
  order: SightingsOrder;
  promise: Promise<void>;
};

export function useSightingsList(order: SightingsOrder) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [status, setStatus] = useState<ListStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const inFlightRef = useRef<InFlightLoad | null>(null);

  const load = useCallback(async () => {
    const inFlight = inFlightRef.current;
    if (inFlight?.order === order) return inFlight.promise;

    const version = requestVersion.current + 1;
    requestVersion.current = version;
    setStatus('loading');
    setError(null);

    const promise = (async () => {
      try {
        const rows = await new SightingsRepository().findAll(order);
        if (requestVersion.current !== version) return;
        setSightings(rows);
        setStatus(rows.length > 0 ? 'success' : 'empty');
      } catch {
        if (requestVersion.current !== version) return;
        setStatus('error');
        setError('No pudimos cargar tus avistamientos. Inténtalo nuevamente.');
      } finally {
        if (inFlightRef.current?.order === order) inFlightRef.current = null;
      }
    })();

    inFlightRef.current = { order, promise };
    return promise;
  }, [order]);

  useFocusEffect(
    useCallback(() => {
      void load();
      return () => {
        requestVersion.current += 1;
      };
    }, [load]),
  );

  return { error, load, sightings, status };
}
