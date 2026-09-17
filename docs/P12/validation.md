# P12 Validation

## Automated gates executed

| Check | Command | Result |
|---|---|---|
| TypeScript | `yarn typecheck` | **PASS** — no diagnostics. |
| Lint | `yarn lint` | **PASS** — ESLint completed cleanly. |
| Tests | `yarn test` | **PASS** — 14 suites, 101 tests passed. |
| Expo diagnostics | `npx expo-doctor` | **PASS** — 21/21 checks passed. |

These gates validate code and existing deterministic behavior. They do not replace device accessibility or visual review.

## Manual Android visual checklist — pending user validation

Do not mark these items PASS until explicitly observed on Android by the user.

### Global

- [ ] No content under status bar/notch.
- [ ] Back controls are easy to tap.
- [ ] Text remains readable outdoors/high brightness.
- [ ] No important text is obviously low contrast.
- [ ] Primary actions are visually clear.
- [ ] No clipped text on a normal device.
- [ ] Larger system font does not catastrophically break screens.
- [ ] No required field/save flow is blocked by the keyboard.

### Home

- [ ] Empty state looks intentional.
- [ ] Registration CTA is obvious.
- [ ] Real cards are readable at a glance.
- [ ] Long bird name remains usable.
- [ ] Sort selection is obvious without color alone.
- [ ] Card touch target is comfortable.
- [ ] Updating state does not cause disruptive flicker.

### Registration

- [ ] Labels and required states are obvious.
- [ ] Validation errors are easy to associate with fields/sections.
- [ ] Camera actions are comfortable.
- [ ] GPS actions/status are clear.
- [ ] Weather status is clear for loading, available, and unavailable.
- [ ] Save is visually dominant.
- [ ] Disabled save is understandable.
- [ ] Form is usable one-handed where practical.

### Detail

- [ ] Bird name is prominent.
- [ ] Large photo is visually stable.
- [ ] Date/time is readable.
- [ ] Human location is primary.
- [ ] Coordinates are secondary.
- [ ] Historical weather is grouped.
- [ ] Notes layout is clean.
- [ ] Broken-photo state is intentional.
- [ ] Not-found/error states are intentional.

### Accessibility spot-check

- [ ] TalkBack identifies primary buttons meaningfully.
- [ ] Sort selection exposes selected state.
- [ ] Disabled/busy controls expose state.
- [ ] Reading order is sensible.
- [ ] Important async status is understandable.

## Runtime/build scope

- `yarn start`: available for user validation with the existing development client.
- Development-client rebuild required: **NO**.
- Android build/EAS/build scripts: **not executed by OMP**.
- `npx expo run:android`: **not executed**.
- `expo prebuild`: **not executed**.
- Web/browser validation: **not executed**.
