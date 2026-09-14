# P5 Implementation

## Camera API

`src/components/CameraCapture.tsx` uses Expo SDK 57 `CameraView` and `useCameraPermissions` from `expo-camera`. The component is rendered inline by `app/sightings/new.tsx`; no nested route or modal navigation was added.

Permission is requested only after the user taps `Tomar foto` and then chooses `Permitir cámara`. The UI explains that the photo must be taken by the camera and that no gallery is used. Permission denial remains non-fatal. A retry is available when Android allows another prompt; otherwise `Linking.openSettings()` provides a practical settings action.

## Capture flow

1. User taps `Tomar foto` or `Repetir foto`.
2. Permission state is loaded and requested at point of use.
3. `CameraView` reports `onCameraReady` before capture is enabled.
4. `takePictureAsync({ quality: 0.75, skipProcessing: false })` captures one camera image.
5. Capture-in-progress state disables the capture action and ignores duplicate calls.
6. Temporary camera URI is shown in an in-app preview.
7. User chooses `Usar esta foto` or `Repetir foto`.
8. Acceptance persists the file before updating `SightingDraft.photoUri`.

Capture, mount, camera-ref, and persistence failures remain visible and leave the photo requirement unsatisfied when persistence fails.

## PhotoService

`src/services/photoService.ts` owns destination and file operations:

- Directory: `Paths.document/sightings/photos`.
- Directory creation: `Directory.create({ intermediates: true, idempotent: true })`.
- Copy: `File.copy()` from the temporary camera URI to a unique destination file.
- Verification: destination `File.exists` must be true before returning its URI.
- Cleanup: failed partial destination cleanup is best effort.
- Ownership: `isOwnedPhotoUri` accepts only a direct `photo-<id>.<safe-extension>` child under the app-owned directory.
- Deletion: `deleteOwnedDraftPhoto` ignores arbitrary URIs and swallows old-file deletion failures.

`src/services/photoPath.ts` contains deterministic extension, filename, and ownership helpers. Filenames use a timestamp/random suffix and never include user-entered bird names. Supported extensions are `jpg`, `jpeg`, `png`, and `webp`; unknown or missing extensions fall back to `jpg`.

## Temporary to persistent transition

The camera cache URI is preview-only. `persistCapturedPhoto(tempUri)` copies it into app document storage and returns the durable app-owned URI. Only that returned URI is assigned to `draft.photoUri`. SQLite will later receive this URI as text, not image binary.

## Replacement cleanup

When an already accepted draft photo is replaced, the new persistent copy is completed first. The draft then points to the new URI. The previous URI is deleted only when it passes the ownership check; deletion failure cannot invalidate the new photo.

Abandoned draft garbage collection is intentionally deferred. No broad lifecycle cleanup was added.

## Form integration and save deferral

The existing `useSightingForm` and `SightingDraft` remain the single source of draft state. The screen calls the existing `setField('photoUri', persistentUri)` setter. The UI shows `Foto *`, preview, ready status, and retake action. The location card remains `Pendiente de GPS`.

P5 does not call `SightingsRepository.create`, insert SQLite rows, enable final save, fabricate GPS, or navigate after save. Final save remains deferred until P6 supplies valid location data.

## Native configuration

`app.json` adds the `expo-camera` config plugin with:

`AvistAves necesita acceso a la cámara para registrar la fotografía del avistamiento.`

No microphone, location, or gallery permission was added. `expo-camera@~57.0.5` and `expo-file-system@~57.0.7` were installed with `npx expo install` for Expo SDK 57.
