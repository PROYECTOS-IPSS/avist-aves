const SHORT_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatObservedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';

  return `${pad(date.getDate())} ${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTemperature(value: number | null): string {
  return typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(1)} °C` : 'Clima no disponible';
}
