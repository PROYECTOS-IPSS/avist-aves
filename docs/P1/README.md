# P1 — Expo Scaffold + Architecture Baseline

- **Previous phase:** P0
- **Current phase:** P1
- **Next phase:** P2

## Objective

Establish the smallest runnable React Native + Expo + TypeScript application with Expo Router, NativeWind, strict TypeScript, lint, and smoke-test infrastructure.

## Scope

Implemented only scaffold, route placeholders, styling infrastructure, project scripts, and validation tooling. No exam functionality was implemented.

## Final state

- Expo SDK 57 project starts successfully.
- Expo Router Stack exposes list, registration, and dynamic detail routes.
- NativeWind class styling is visible on placeholders.
- TypeScript strict mode, ESLint, and Jest Expo smoke test pass.
- Web route smoke test confirmed `/`, `/sightings/new`, `/sightings/demo`, dynamic `id`, and back navigation.

## Main files

- `app/_layout.tsx`
- `app/index.tsx`
- `app/sightings/new.tsx`
- `app/sightings/[id].tsx`
- `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`
- `tsconfig.json`, `eslint.config.js`, `jest.config.js`
- `src/utils/__tests__/smoke.test.ts`
- `package.json`, `app.json`, `.gitignore`, `README.md`

## Main stack versions

- Expo `~57.0.22`
- React Native `0.86.3`
- React `19.2.3`
- Expo Router `~57.0.21`
- NativeWind `^4.2.6`
- TypeScript `~6.0.3`
- Jest `^29.7.0` with `jest-expo` `^57.0.5`

## Quality gates

- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm test`: PASS
- `npx expo-doctor`: PASS — 21/21 checks
- `npx expo start`: PASS — Metro startup observed
- Browser route smoke test: PASS

Details and exact commands: `implementation.md` and `validation.md`.

## Deviations

- `npm run lint` uses direct `eslint .` rather than `expo lint`. Expo's auto-configuration installed ESLint correctly, but its CLI invocation could not resolve the root ESLint module in this workspace. Direct ESLint uses the same Expo flat config and passes.
- `eas.json` was not created. P14 owns Preview build configuration.
- Future architectural directories remain uncreated until their first real implementation; empty placeholders would add no value.

## Risks discovered

- Expo SDK 57's dependency graph requires explicit test preset dependencies (`babel-preset-expo`, `@react-native/jest-preset`, and compatible `react-native-worklets`). `expo-doctor` passes after alignment.
- Web smoke validation requires `react-dom` and `react-native-web`; both are installed because the project exposes a real `web` script.

## Conclusion

P1 establishes a runnable, minimal routing and styling baseline without implementing camera, GPS, Open-Meteo, SQLite, persistence, permissions, or backend behavior.

**READY FOR P2: YES**
