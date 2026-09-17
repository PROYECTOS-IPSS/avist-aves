export type Sighting = {
  id: string;
  birdName: string;
  photoUri: string;
  latitude: number;
  longitude: number;
  locationLabel: string | null;
  observedAt: string;
  quantity: number;
  notes: string | null;
  temperature: number | null;
  humidity: number | null;
  weatherCode: number | null;
  weatherDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSightingInput = Omit<Sighting, 'id' | 'createdAt' | 'updatedAt'>;

export type SightingsOrder = 'date' | 'name' | 'quantity';
export type SortDirection = 'asc' | 'desc';

export type SightingsSort = {
  field: SightingsOrder;
  direction: SortDirection;
};
