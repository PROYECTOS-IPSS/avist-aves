# P8 Decisions

## D-P8-001 — FlatList with non-scrolling AppScreen

### Decision

Use `FlatList` for Home and add a minimal `flex-1` non-scroll variant to `AppScreen`.

### Reason

The repository now returns real persisted rows. FlatList supplies stable keys and scalable row rendering while avoiding a vertical ScrollView/FlatList nesting conflict. Existing P4–P7 screens keep their default ScrollView behavior.

## D-P8-002 — Focus-driven repository refresh

### Decision

Use Expo Router `useFocusEffect` to query the current typed order whenever Home gains focus.

### Reason

P7 returns to `/`, but route lifecycles can retain mounted screens. Focus refresh guarantees newly inserted SQLite rows appear without app restart or global state.

## D-P8-003 — Defer card detail navigation

### Decision

Keep cards non-navigating in P8 and leave `/sightings/[id]` for P9.

### Reason

The route exists as a shell but P9 owns detail loading. A simple real list is less misleading than navigating to incomplete detail content.
