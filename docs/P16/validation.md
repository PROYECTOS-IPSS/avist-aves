# P16 — Android manual validation pending

Automated tests do not prove native camera, gallery, permissions, picker, or restart behavior. Do not mark these items PASS until exercised on Android real/device build:

- [ ] Location `FormInfo` renders correctly.
- [ ] Photo `FormInfo` renders correctly.
- [ ] Existing camera capture still works.
- [ ] Gallery permission granted flow works.
- [ ] Gallery permission denied flow remains stable and camera remains available.
- [ ] Gallery picker cancellation preserves form state and previous photo.
- [ ] Gallery image appears in existing preview.
- [ ] Gallery image can be removed.
- [ ] Camera image can be removed.
- [ ] Camera works after selecting/removing a gallery image.
- [ ] Gallery works after taking/removing a camera image.
- [ ] Gallery image persists after save and app restart.
- [ ] Future calendar date is constrained where supported.
- [ ] Future time on today is rejected.
- [ ] Future date/time shows the custom validation error.
- [ ] Correcting date/time enables save.
- [ ] Valid past/current sighting still saves normally.

No EAS Build or Android native build was run for P16.
