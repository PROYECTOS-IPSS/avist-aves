import { SightingsRepository } from '../repositories/SightingsRepository';
import { deleteOwnedPhoto } from './photoService';

export async function deleteSighting(id: string): Promise<boolean> {
  const normalizedId = id.trim();
  if (!normalizedId) return false;

  const repository = new SightingsRepository();
  const sighting = await repository.findById(normalizedId);
  if (!sighting) return false;

  const deleted = await repository.deleteById(normalizedId);
  if (!deleted) return false;

  await deleteOwnedPhoto(sighting.photoUri);
  return true;
}
