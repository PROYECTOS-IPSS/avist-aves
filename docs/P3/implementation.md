# P3 Implementation

## Route structure

```text
app/
├── _layout.tsx
├── index.tsx
└── sightings/
    ├── new.tsx
    └── [id].tsx
```

`app/_layout.tsx` uses Expo Router `Stack` with `headerShown: false`. This avoids duplicate native/custom headers and keeps navigation predictable.

- `/`: renders `SightingsListScreen`; `router.push('/sightings/new')` activates the primary CTA.
- `/sightings/new`: renders registration foundation and calls `router.back()` from the visible back control.
- `/sightings/[id]`: reads the route parameter with `useLocalSearchParams`, normalizes a possible array value, and displays the identifier without loading data. Back uses `router.back()`.

No tabs, drawer, modal, database query, or fake production detail link was added.

## Visual direction

Field notebook, not dashboard:

- paper background: `field.paper`
- ink: `field.ink`
- deep pine: `field.pine`
- moss: `field.moss`
- quiet sage: `field.sage`
- pale sky: `field.sky`
- amber action accent: `field.amber`
- restrained borders: `field.line`

Signature detail: the pine field-note hero with a small amber status dot and paper-colored action. It gives app identity without gradients, glass effects, or decorative animation.

Tokens live in `tailwind.config.js`, keeping colors and radius decisions centralized while NativeWind remains the primary styling mechanism.

## Reusable components

- `AppScreen`: SafeAreaView, StatusBar, scroll container, shared page padding.
- `AppHeader`: eyebrow, large title, subtitle, and optional accessible back action.
- `PrimaryButton`: large primary action with disabled foundation state and accessibility role/state.
- `SectionHeader`: section title and concise context label.
- `EmptyState`: intentional no-records guidance.
- `FoundationCard`: composed future-flow card reused across registration/detail shells.

Components remain small and compositional. No design-system framework or mega-component was added.

## Screen responsibilities

### Home/list

Communicates application identity and purpose, exposes the dominant registration action, labels the future sightings area, and explains the empty state. It does not query SQLite or render persisted records.

### Registration

Shows future photo, location, and observation groupings plus the future save-action placement. It does not own form state, validation, permissions, native APIs, or insertion.

### Detail

Shows photo and detail placeholders plus the dynamic route ID. It does not claim placeholder content came from SQLite and does not perform lookup.

## Accessibility baseline

- Visible button labels and meaningful back label.
- `accessibilityRole="button"` on actions.
- Disabled action exposes `accessibilityState`.
- 48px back control and 56px primary action target.
- High-contrast text/surfaces and readable body sizes.
- Meaning is communicated through labels and structure, not color alone.
- Scroll containers support smaller Android heights.

Full accessibility contrast audit and polish remain P12 work.

## Genuine React patterns

P3 naturally uses Component Composition: screens compose shared primitives rather than duplicating layout. It also uses Expo Router's `useLocalSearchParams` hook where route state requires it. No Provider/Context was invented because P3 has no shared mutable state.

Repository and Service/Adapter remain application architecture patterns from P0/P2, not claimed as React framework patterns here.
