import { Directory, File, Paths } from 'expo-file-system';

import {
  createDraftPhotoFilename,
  isOwnedPhotoPath,
} from './photoPath';

export const DRAFT_PHOTO_DIRECTORY = new Directory(Paths.document, 'sightings', 'photos');

export function isOwnedPhotoUri(uri: string): boolean {
  return isOwnedPhotoPath(uri, DRAFT_PHOTO_DIRECTORY.uri);
}

export async function persistSelectedPhoto(sourceUri: string): Promise<string> {
  const source = new File(sourceUri);
  const destination = new File(DRAFT_PHOTO_DIRECTORY, createDraftPhotoFilename(sourceUri));

  try {
    DRAFT_PHOTO_DIRECTORY.create({ intermediates: true, idempotent: true });
    await source.copy(destination);

    if (!destination.exists) {
      throw new Error('La copia persistente no está disponible.');
    }

    return destination.uri;
  } catch (error) {
    try {
      if (destination.exists) destination.delete();
    } catch {
      // A failed cleanup must not hide the original persistence error.
    }
    throw error;
  }
}

export async function deleteOwnedPhoto(uri: string): Promise<void> {
  if (!isOwnedPhotoUri(uri)) return;

  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Record deletion remains successful when file cleanup is unavailable.
  }
}
