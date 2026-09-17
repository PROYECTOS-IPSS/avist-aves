export function requiresMediaLibraryPermission(platform: string): boolean {
  // expo-image-picker SDK 57 uses Android Photo Picker for this image-only flow.
  return platform === 'ios';
}
