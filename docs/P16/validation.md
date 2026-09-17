# P16.1 — Android manual validation pending

Automated tests do not prove native camera, gallery, permissions, picker, scrolling, deletion, or restart behavior. Do not mark these items PASS until exercised on an Android development/preview build or physical device.

## Camera

- [ ] Reset permissions or use fresh install.
- [ ] Press `Tomar foto`; native Android camera permission dialog appears immediately.
- [ ] Grant permission; camera opens.
- [ ] Deny permission; Photo section keeps denied state and gallery remains available.
- [ ] Permanently deny permission; `Abrir ajustes` opens app settings.
- [ ] Cancel camera; form remains stable.
- [ ] Capture and accept; photo persists.

## Gallery

- [ ] Press `Elegir de galería`.
- [ ] Verify actual Android version uses system Photo Picker without an unnecessary storage/media permission.
- [ ] Cancel picker; form and previous photo remain stable.
- [ ] Select image; preview and persistence work.
- [ ] If platform/API requires media-library permission, deny it; denied state and `Abrir ajustes` are recoverable.
- [ ] Camera remains available after gallery denial.
- [ ] Gallery remains available after camera denial.
- [ ] Remove and replace camera/gallery photos.

## Required focus

- [ ] With only Photo missing, save scrolls Photo block into view and runs subtle highlight pulse.
- [ ] With only GPS missing, save scrolls Location block into view and runs same pulse.
- [ ] With both missing, both blocks are visible as reasonably centered and both pulse.
- [ ] Verify on at least one physical Android device when available.

## Date/time

- [ ] Future calendar date is constrained where supported.
- [ ] Future time on today is rejected.
- [ ] Future date/time shows `La fecha y hora del avistamiento no pueden estar en el futuro.`
- [ ] Correcting date/time enables save.
- [ ] Valid past/current sighting saves normally.

## Delete from card

- [ ] Tap card trash action; confirmation appears without opening detail.
- [ ] Cancel; sighting remains.
- [ ] Confirm; card disappears.
- [ ] Restart app; deleted sighting remains deleted.

## Delete from detail

- [ ] Open sighting and tap `Eliminar avistamiento`.
- [ ] Cancel; sighting remains.
- [ ] Confirm; app returns to list and record remains deleted after restart.
- [ ] Confirm owned application photo is cleaned up; external/gallery source is never deleted.

## Back button

- [ ] Visually verify arrow is centered horizontally and vertically in circular button.

No EAS, Gradle, or Android build command is part of automated validation. User runs Development/Preview builds manually.
