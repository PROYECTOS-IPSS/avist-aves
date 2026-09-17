import type { Sighting, SightingsSort } from '../domain/sightings';

export const SIGHTINGS_ORDER_OPTIONS: readonly { value: SightingsSort['field']; label: string }[] = [
  { value: 'date', label: 'Más recientes' },
  { value: 'name', label: 'Nombre A-Z' },
  { value: 'quantity', label: 'Cantidad ↑' },
];

export function sightingsOrderLabel(sort: SightingsSort): string {
  if (sort.field === 'name') return sort.direction === 'asc' ? 'Nombre A-Z' : 'Nombre Z-A';
  if (sort.field === 'quantity') return sort.direction === 'desc' ? 'Cantidad ↑' : 'Cantidad ↓';
  return 'Más recientes';
}

export function sortSightings(sightings: readonly Sighting[], sort: SightingsSort): Sighting[] {
  return [...sightings].sort((left, right) => {
    const comparison = sort.field === 'name'
      ? left.birdName.localeCompare(right.birdName, 'es', { sensitivity: 'base' })
      : sort.field === 'quantity'
        ? left.quantity - right.quantity
        : left.observedAt.localeCompare(right.observedAt);
    return sort.direction === 'asc' ? comparison : -comparison;
  });
}
