import { deleteOwnedPhoto, isOwnedPhotoUri } from './photoService';

async function safelyDeleteDraftPhoto(uri: string): Promise<void> {
  try {
    if (isOwnedPhotoUri(uri)) await deleteOwnedPhoto(uri);
  } catch {
    // Draft cleanup must not block navigation or surface an unhandled rejection.
  }
}

export interface DraftPhotoLifecycle {
  discard(uri: string): Promise<void>;
  replace(nextUri: string): Promise<boolean>;
  remove(): Promise<void>;
  commit(): void;
  abandon(): Promise<void>;
}

export function createDraftPhotoLifecycle(): DraftPhotoLifecycle {
  let currentUri: string | null = null;
  let committed = false;

  async function removeCurrentPhoto(): Promise<void> {
    if (committed) return;

    const uri = currentUri;
    currentUri = null;
    if (uri) await safelyDeleteDraftPhoto(uri);
  }

  return {
    async discard(uri: string): Promise<void> {
      await safelyDeleteDraftPhoto(uri);
    },

    async replace(nextUri: string): Promise<boolean> {
      if (committed) {
        await safelyDeleteDraftPhoto(nextUri);
        return false;
      }

      const previousUri = currentUri;
      currentUri = nextUri;
      if (previousUri && previousUri !== nextUri) await safelyDeleteDraftPhoto(previousUri);
      return true;
    },

    remove: removeCurrentPhoto,

    commit(): void {
      committed = true;
      currentUri = null;
    },

    abandon: removeCurrentPhoto,
  };
}
