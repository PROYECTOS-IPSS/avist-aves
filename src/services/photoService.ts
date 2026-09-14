import { Directory, File, Paths } from 'expo-file-system';

import {
  createDraftPhotoFilename,
  isOwnedPhotoPath,
} from './photoPath';

export const DRAFT_PHOTO_DIRECTORY = new Directory(Paths.document, 'sightings', 'photos');

export function isOwnedPhotoUri(uri: string): boolean {
  return isOwnedPhotoPath(uri, DRAFT_PHOTO_DIRECTORY.uri);
}

export async function persistCapturedPhoto(tempUri: string): Promise<string> {
  const source = new File(tempUri);
  const destination = new File(DRAFT_PHOTO_DIRECTORY, createDraftPhotoFilename(tempUri));

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

export async function deleteOwnedDraftPhoto(uri: string): Promise<void> {
  if (!isOwnedPhotoUri(uri)) return;

  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Replacement must remain successful when old-file cleanup is unavailable.
  }
}
