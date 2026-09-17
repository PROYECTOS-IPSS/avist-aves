# P15 — Android manual validation pending

Automated tests and mocks do not prove native behavior. Do not mark these items PASS until exercised on a real Android device or the Android development/Preview build:

- [ ] DatePicker opens.
- [ ] TimePicker opens.
- [ ] DatePicker cancellation preserves prior value.
- [ ] TimePicker cancellation preserves prior value.
- [ ] Camera permission granted flow works.
- [ ] Camera permission rejected flow remains stable and offers recovery.
- [ ] Camera capture cancellation returns to the form without saving a photo.
- [ ] Camera capture persists a previewed photo.
- [ ] Photo removal clears the form and allows another capture.
- [ ] GPS permission granted flow works.
- [ ] GPS permission rejected flow remains stable and offers recovery.
- [ ] GPS acquisition displays coordinates/location.
- [ ] Location removal clears coordinates, label, and weather.
- [ ] GPS can be acquired again after removal.
- [ ] Valid sighting saves and remains persisted after returning Home.
- [ ] Custom success modal appears only after persistence completes.
- [ ] Quantity sort shows both directions.
- [ ] Name sort shows A-Z and Z-A, including accented names.

No EAS Build was run for P15. Hardware-dependent behavior remains pending this checklist.
