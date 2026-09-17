# P15 — Form UX and Home sorting

## Implementation

- Removed redundant photo/location summary cards and the three requested helper paragraphs.
- Added Expo SDK 57-compatible `@react-native-community/datetimepicker` 9.1.0. Android uses `DateTimePickerAndroid`; non-Android platforms use the component fallback.
- Date/time remain initialized from `new Date()`, stored in existing draft format, and rendered as non-editable controls.
- Bird names sanitize during entry and validate again before persistence: Unicode letters/diacritics, numbers, spaces, `#`, and `&`, maximum 30 characters.
- Camera remains the only photo source. Capture cancellation does not persist a URI; captured photos can be replaced or removed before save.
- GPS remains mandatory. Location removal clears coordinates, reverse-geocoded label, and weather state; acquisition can be retried.
- Weather remains best-effort and does not block persistence.
- Successful persistence opens an accessible in-app modal. Persistence errors keep the form and do not open success UI.
- Home keeps one source sort state (`field` + `direction`) and derives labels and list order. Name order uses Spanish `localeCompare`; sorting copies source data.

## Dependencies

- Added `@react-native-community/datetimepicker` through Expo's SDK-compatible installer.

## Automated verification

- `npx yarn typecheck`
- `npx yarn lint`
- `npx yarn test`


## P15.16 — Jest/Babel gate

The observed missing-module errors came from an incomplete installed dependency tree, not 14 functional test failures. Expo SDK 57's existing `babel-preset-expo@57.0.11` declares both `@babel/plugin-proposal-decorators@^7.12.9` and `@babel/plugin-proposal-export-default-from@^7.24.7`; `yarn.lock` contains both entries and Yarn resolves each to `7.29.7`.

Installed versions checked:

- `expo` 57.0.22
- `babel-preset-expo` 57.0.11
- `@babel/core` 7.29.7
- `@react-native/jest-preset` 0.86.3
- `jest` 29.7.0
- `jest-expo` 57.0.5
- `@babel/plugin-proposal-decorators` 7.29.7
- `@babel/plugin-proposal-export-default-from` 7.29.7

`node_modules` was removed and rebuilt with normal `npx --yes yarn install` from the canonical `yarn.lock`. Both required plugin directories and `require.resolve` calls succeed. No direct Babel dependency, Jest preset replacement, test exclusion, or functional P15 change was needed.

Final gates, run through Yarn 1.22.22 via `npx` because global `yarn` is unavailable:

- `npx --yes yarn typecheck` — PASS
- `npx --yes yarn lint` — PASS
- `npx --yes yarn test` — PASS; 14 suites, 123 tests

No dependency was added for P15.16.
See `validation.md` for the hardware-dependent boundary.
