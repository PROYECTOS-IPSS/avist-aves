import { requiresMediaLibraryPermission } from '../mediaPermissions';

describe('media library permission policy', () => {
  it('uses Android Photo Picker without a broad media permission', () => {
    expect(requiresMediaLibraryPermission('android')).toBe(false);
  });

  it('requests media library permission on iOS where picker access requires it', () => {
    expect(requiresMediaLibraryPermission('ios')).toBe(true);
  });
});
