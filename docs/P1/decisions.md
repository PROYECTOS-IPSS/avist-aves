# P1 Decisions

## D-P1-001 — Use Expo SDK 57 baseline

### Context

`create-expo-app@latest` resolved Expo SDK `~57.0.22`, React Native `0.86.3`, and React `19.2.3` at scaffold time. Repository guidance requires versioned Expo documentation.

### Decision

Keep the generated SDK 57 versions and align added packages with Expo Doctor's expected versions.

### Reason

This is the current stable-compatible scaffold resolved by the official initializer; manual downgrading would add risk without meeting a requirement.

### Alternatives considered

- Pin an older SDK: rejected; unnecessary compatibility debt.
- Use an unversioned experimental SDK: rejected; less stable for examination delivery.

### Impact

Future native packages must be installed with Expo-compatible versions and validated by `npx expo-doctor`.

## D-P1-002 — Use Jest with `jest-expo`

### Context

P1 needs one minimal test runner compatible with Expo Router and React Native.

### Decision

Use Jest `29.7.0` with `jest-expo` `57.0.5` and the React Native Jest preset required by RN `0.86.3`.

### Reason

It provides the Expo preset while keeping P1 to one runner and one smoke test.

### Alternatives considered

- Add a second runner: rejected; duplicates infrastructure.
- Test only through ad hoc scripts: rejected; does not validate the configured test command.

### Impact

`npm test` runs a deterministic environment smoke test; native device behavior remains manual in later phases.

## D-P1-003 — Direct ESLint script

### Context

Expo's first-run `expo lint` setup generated the official flat configuration, but the CLI could not resolve the root ESLint module in this npm workspace.

### Decision

Keep `eslint.config.js` based on `eslint-config-expo/flat` and set `npm run lint` to `eslint .`.

### Reason

The same Expo rules execute successfully without the CLI resolution failure. This keeps the required script real rather than suppressing lint.

### Alternatives considered

- Disable lint: rejected; violates P1.
- Add a custom relaxed config: rejected; existing Expo config is sufficient.

### Impact

Lint remains a direct quality gate. Revisit only if a future Expo CLI version resolves its module correctly and offers material value.

## D-P1-004 — Defer `eas.json`

### Context

P1 must not generate an APK or configure a Preview build prematurely.

### Decision

Do not create `eas.json`; defer it to P14.

### Reason

No P1 command consumes EAS build profiles, and P0 assigns Preview delivery to P14.

### Alternatives considered

- Add an empty/default EAS file: rejected; dead configuration.

### Impact

P14 must create and validate the Preview profile before the APK gate.
