export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

export type LocationAddressParts = {
  street?: string | null;
  streetNumber?: string | null;
  district?: string | null;
  subregion?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
};

export function isValidCoordinates(latitude: unknown, longitude: unknown): latitude is number {
  return (
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function formatLocationLabel(address?: LocationAddressParts | null): string {
  if (!address) return 'Ubicación obtenida';

  const street = [address.streetNumber, address.street].filter((part) => part?.trim()).join(' ');
  const pieces = [
    street,
    address.district,
    address.city,
    address.subregion,
    address.region,
    address.country,
  ]
    .map((part) => part?.trim() ?? '')
    .filter(Boolean);
  const seen: Record<string, true> = {};
  const uniquePieces = pieces.filter((piece) => {
    const key = piece.toLocaleLowerCase();
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });

  return uniquePieces.join(', ') || 'Ubicación obtenida';
}

export function formatCoordinateForDisplay(value: number): string {
  return value.toFixed(4);
}
