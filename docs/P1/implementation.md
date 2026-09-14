# P1 Implementation

## Initialization

Created project with `create-expo-app@latest` using the blank TypeScript template, then removed template `App.tsx` and `index.ts` in favor of Expo Router's `expo-router/entry`.

## Runtime and dependencies

- Expo `~57.0.22`
- React Native `0.86.3`
- React `19.2.3`
- Expo Router `~57.0.21`
- NativeWind `^4.2.6` with Tailwind CSS `^3.4.17`
- TypeScript `~6.0.3`
- Jest `^29.7.0`, `jest-expo` `^57.0.5`, and `@react-native/jest-preset` `^0.86.3`
- ESLint `^9.0.0` with `eslint-config-expo` `~57.0.2`
- `react-dom` and `react-native-web` for the declared web script

No `expo-camera`, `expo-location`, or `expo-sqlite` packages were installed.

## Expo Router

`package.json` uses `"main": "expo-router/entry"`. `app/_layout.tsx` defines a simple Stack with three screens:

- `app/index.tsx` → `/`
- `app/sightings/new.tsx` → `/sightings/new`
- `app/sightings/[id].tsx` → `/sightings/:id`

The list has temporary links to registration and demo detail. Registration has a temporary back action. Detail reads `id` with `useLocalSearchParams`; it does not access data.

## NativeWind

- `babel.config.js` uses Expo's Babel preset with NativeWind JSX support.
- `metro.config.js` wraps Expo Metro with `withNativeWind` and `global.css` input.
- `tailwind.config.js` scans `app/` and `src/` and uses the NativeWind preset.
- `global.css` imports Tailwind layers.
- `nativewind-env.d.ts` provides NativeWind types; `global.d.ts` declares CSS imports.
- Placeholder screens use `className`, visibly proving the styling pipeline.

No final palette or design system was created.

## TypeScript

`tsconfig.json` extends `expo/tsconfig.base` and sets `compilerOptions.strict` to `true`. Jest types are included for the smoke test. No aliases were added.

## Lint and testing

- `eslint.config.js` uses Expo's flat configuration.
- `jest.config.js` uses the single `jest-expo` preset and ignores route files under `app/`.
- `src/utils/__tests__/smoke.test.ts` contains one environment smoke test only.
- `package.json` exposes `typecheck`, `lint`, and `test` scripts.

## Expo configuration

`app.json` identity is:

- `name`: `AvistAves`
- `slug`: `avistaves`

Only the Router and existing status-bar plugins are configured. No Android package, credentials, permissions, or EAS configuration was added.

## Git hygiene

`.gitignore` retains Node/Expo/Metro/local environment/native generated exclusions and explicitly adds `*.apk` and `*.aab`. No build artifact or credential was added.

## Architecture boundary

P1 creates only route shells and test utility location. It intentionally does not create empty `services`, `repositories`, `db`, `domain`, `hooks`, or `components` files. Those modules will be added with their first real responsibility in later phases, preserving P0's thin layered architecture without dead scaffolding.
