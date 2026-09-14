import type { SightingsOrder } from '../domain/sightings';

export const SIGHTINGS_ORDER_OPTIONS: readonly { value: SightingsOrder; label: string }[] = [
  { value: 'date', label: 'Más recientes' },
  { value: 'name', label: 'Nombre A–Z' },
  { value: 'quantity', label: 'Mayor cantidad' },
];

export function sightingsOrderLabel(order: SightingsOrder): string {
  return SIGHTINGS_ORDER_OPTIONS.find((option) => option.value === order)?.label ?? 'Más recientes';
}
