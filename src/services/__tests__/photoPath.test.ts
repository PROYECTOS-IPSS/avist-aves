import {
  createDraftPhotoFilename,
  isOwnedPhotoPath,
  safePhotoExtension,
} from '../photoPath';

describe('photo path helpers', () => {
  it.each([
    ['file:///cache/capture.jpg', 'jpg'],
    ['file:///cache/capture.PNG?token=1', 'png'],
    ['file:///cache/capture.unknown', 'jpg'],
    ['file:///cache/capture', 'jpg'],
  ])('normalizes safe extensions for %s', (uri, expected) => {
    expect(safePhotoExtension(uri)).toBe(expected);
  });

  it('creates a unique app-owned filename without source path data', () => {
    expect(createDraftPhotoFilename('file:///cache/my bird.jpg', 'fixed-id')).toBe('photo-fixed-id.jpg');
  });

  it.each([
    ['file:///documents/sightings/photos/photo-one.jpg', true],
    ['file:///documents/sightings/photos/photo-two.png', true],
    ['file:///documents/sightings/photos/other.jpg', false],
    ['file:///documents/sightings/photos/photo-one.jpg/child', false],
    ['file:///documents/other/photo-one.jpg', false],
  ])('accepts only owned draft photo paths: %s', (uri, expected) => {
    expect(isOwnedPhotoPath(uri, 'file:///documents/sightings/photos')).toBe(expected);
  });
});
