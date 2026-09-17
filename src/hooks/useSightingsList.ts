import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Sighting, SightingsSort } from '../domain/sightings';
import { SightingsRepository } from '../repositories/SightingsRepository';
import { sortSightings } from '../utils/sightingsList';

type ListStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export function useSightingsList(sort: SightingsSort) {
  const [sourceSightings, setSourceSightings] = useState<Sighting[]>([]);
  const [status, setStatus] = useState<ListStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const inFlightRef = useRef<Promise<void> | null>(null);
  const sightings = useMemo(() => sortSightings(sourceSightings, sort), [sourceSightings, sort]);

  const load = useCallback(async () => {
    if (inFlightRef.current) return inFlightRef.current;

    const version = requestVersion.current + 1;
    requestVersion.current = version;
    setStatus('loading');
    setError(null);

    let promise: Promise<void>;
    promise = (async () => {
      try {
        const rows = await new SightingsRepository().findAll('date');
        if (requestVersion.current !== version) return;
        setSourceSightings(rows);
        setStatus(rows.length > 0 ? 'success' : 'empty');
      } catch {
        if (requestVersion.current !== version) return;
        setStatus('error');
        setError('No pudimos cargar tus avistamientos. Inténtalo nuevamente.');
      } finally {
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = promise;
    return promise;
  }, []);

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
