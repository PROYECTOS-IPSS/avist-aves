# P3 Decisions

## D-P3-001 — Field notebook visual direction

### Context

AvistAves is used outdoors, standing or walking, with one hand and variable sunlight.

### Decision

Use a paper/pine/sage/amber palette, large readable hierarchy, generous spacing, and a single amber action accent. Keep surfaces quiet and avoid gradients, glass effects, and animation.

### Reason

The visual language connects to field notes and wildlife observation while preserving contrast and quick scanning.

### Alternatives considered

- Dense dashboard: rejected; poor fit for field capture.
- Dark full-screen theme: rejected; less suitable for bright outdoor reading.
- Generic blue application palette: rejected; lacks subject identity.

### Impact

Tailwind tokens in `tailwind.config.js` are shared by all P3 primitives and future screens.

## D-P3-002 — Custom in-app headers

### Context

The three screens need consistent identity and back affordances without duplicate native/template headers.

### Decision

Hide Expo Router Stack headers and compose `AppHeader` inside each screen. Keep Stack navigation itself simple.

### Reason

One visible header per screen, predictable back behavior, and shared layout without adding navigation complexity.

### Alternatives considered

- Keep native headers: rejected; less control over hierarchy and visual foundation.
- Tabs/drawer: rejected; no requirement and adds navigation weight.

### Impact

Future P4+ screens should reuse `AppHeader` and preserve the single Stack.

## D-P3-003 — No fake detail/list records

### Context

Repository-backed list/detail belongs to later phases. P3 still needs a dynamic detail shell.

### Decision

Keep home in designed empty state and validate detail through direct arbitrary route IDs only. Do not add fake production cards or placeholder records.

### Reason

Avoids confusing scaffolding with real persisted behavior and keeps P3/P8 boundaries clear.

### Impact

Manual detail validation uses a direct route URL/development navigation path until P8 supplies real cards.
