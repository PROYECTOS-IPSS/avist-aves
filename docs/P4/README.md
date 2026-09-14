# P4 — Registration Form + Validation

- **Previous:** P3 — Navigation + UI Foundation
- **Current:** P4 — Registration Form + Validation
- **Next:** P5 — Camera + Persistent Image

## Objective

Implement editable registration draft state, field normalization, deterministic validation, and inline feedback without connecting native acquisition or persistence.

## Implemented scope

- Real controlled React Native inputs for bird name, date, time, quantity, and notes.
- One-time current date/time initialization per form instance.
- Free-text bird name accepting ordinary values and `No identificada`.
- Integer quantity validation with minimum `1`.
- Optional multiline notes.
- ISO normalization for valid editable date/time values.
- Typed `SightingDraft`, normalized editable result, validation errors, and validation results.
- Whole-draft validation that reports missing photo and GPS prerequisites.
- Touched-field/submit-aware inline errors.
- Required photo/location status cards without fake values.
- Disabled final save action; no success or persistence flow.
- Android-friendly scroll/keyboard behavior and input accessibility labels.

## Explicitly deferred

No camera, gallery, photo persistence, GPS, permissions, reverse geocoding, weather, SQLite insertion, final save, or navigation after save was implemented.

## Quality gates

- `yarn typecheck`: PASS
- `yarn lint`: PASS
- `yarn test`: PASS — 4 suites, 29 tests
- `npx expo-doctor`: PASS — 21/21 checks
- Web validation: not executed
- Android runtime P4 validation: pending manual user check; no rebuild was executed by OMP.

## Known non-blocking issue

The existing development APK predates P4 source changes. Manual P4 phone validation requires the user to rebuild/install the development client using the already configured P2.1 workflow.

**READY FOR P5: YES**
