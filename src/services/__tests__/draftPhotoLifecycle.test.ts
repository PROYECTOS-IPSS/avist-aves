import { deleteOwnedPhoto, isOwnedPhotoUri } from '../photoService';
import { createDraftPhotoLifecycle } from '../draftPhotoLifecycle';

jest.mock('../photoService');

const deleteOwnedPhotoMock = deleteOwnedPhoto as jest.MockedFunction<typeof deleteOwnedPhoto>;
const isOwnedPhotoUriMock = isOwnedPhotoUri as jest.MockedFunction<typeof isOwnedPhotoUri>;

const photoA = 'file:///documents/sightings/photos/photo-a.jpg';
const photoB = 'file:///documents/sightings/photos/photo-b.jpg';

beforeEach(() => {
  jest.clearAllMocks();
  isOwnedPhotoUriMock.mockImplementation((uri) => uri.startsWith('file:///documents/sightings/photos/photo-'));
  deleteOwnedPhotoMock.mockResolvedValue();
});

describe('draft photo lifecycle', () => {
  it('deletes the active app-owned photo when an unsaved draft is abandoned', async () => {
    const lifecycle = createDraftPhotoLifecycle();
    await lifecycle.replace(photoA);

    await lifecycle.abandon();

    expect(deleteOwnedPhotoMock).toHaveBeenCalledTimes(1);
    expect(deleteOwnedPhotoMock).toHaveBeenCalledWith(photoA);
  });

  it('keeps the photo after the sighting is committed', async () => {
    const lifecycle = createDraftPhotoLifecycle();
    await lifecycle.replace(photoA);
    lifecycle.commit();

    await lifecycle.abandon();

    expect(deleteOwnedPhotoMock).not.toHaveBeenCalled();
  });

  it('never deletes an external URI', async () => {
    const lifecycle = createDraftPhotoLifecycle();
    await lifecycle.replace('content://gallery/bird.jpg');

    await lifecycle.abandon();

    expect(deleteOwnedPhotoMock).not.toHaveBeenCalled();
  });

  it('deletes only the replaced photo and keeps the current photo after commit', async () => {
    const lifecycle = createDraftPhotoLifecycle();
    await lifecycle.replace(photoA);
    await lifecycle.replace(photoB);
    lifecycle.commit();

    await lifecycle.abandon();

    expect(deleteOwnedPhotoMock).toHaveBeenCalledTimes(1);
    expect(deleteOwnedPhotoMock).toHaveBeenCalledWith(photoA);
  });

  it('deletes a removed photo once and leaves no pending cleanup', async () => {
    const lifecycle = createDraftPhotoLifecycle();
    await lifecycle.replace(photoA);
    await lifecycle.remove();

    await lifecycle.abandon();

    expect(deleteOwnedPhotoMock).toHaveBeenCalledTimes(1);
    expect(deleteOwnedPhotoMock).toHaveBeenCalledWith(photoA);
  });

  it('absorbs cleanup failures and does not repeat deletion', async () => {
    const lifecycle = createDraftPhotoLifecycle();
    deleteOwnedPhotoMock.mockRejectedValueOnce(new Error('filesystem unavailable'));
    await lifecycle.replace(photoA);

    await expect(lifecycle.abandon()).resolves.toBeUndefined();
    await expect(lifecycle.abandon()).resolves.toBeUndefined();

    expect(deleteOwnedPhotoMock).toHaveBeenCalledTimes(1);
  });
});
