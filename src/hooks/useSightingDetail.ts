import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Sighting } from '../domain/sightings';
import { SightingsRepository } from '../repositories/SightingsRepository';

type DetailStatus = 'loading' | 'success' | 'notFound' | 'error';

export function useSightingDetail(id: string | null) {
  const [sighting, setSighting] = useState<Sighting | null>(null);
  const [status, setStatus] = useState<DetailStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);

  const load = useCallback(async () => {
    const version = requestVersion.current + 1;
    requestVersion.current = version;

    if (!id) {
      setSighting(null);
      setError(null);
      setStatus('notFound');
      return;
    }

    setSighting(null);
    setError(null);
    setStatus('loading');

    try {
      const result = await new SightingsRepository().findById(id);
      if (requestVersion.current !== version) return;
      if (!result) {
        setStatus('notFound');
        return;
      }
      setSighting(result);
      setStatus('success');
    } catch {
      if (requestVersion.current !== version) return;
      setError('No pudimos cargar este avistamiento. Inténtalo nuevamente.');
      setStatus('error');
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
      return () => {
        requestVersion.current += 1;
      };
    }, [load]),
  );

  return { error, load, sighting, status };
}
