# P8 Implementation

## Repository/list architecture

`src/hooks/useSightingsList.ts` owns list state and calls the existing `SightingsRepository.findAll(order)`. It exposes explicit `idle`, `loading`, `success`, `empty`, and `error` states plus retry/load behavior. No SQL is duplicated in the screen and no second data-access layer was added.

The Home route owns only selected typed order state and declarative presentation. Default order is `'date'`, which maps to the repository's existing `observed_at DESC` SQL clause.

## Ordering controls

`src/utils/sightingsList.ts` maps the closed `SightingsOrder` union to:

- `date` → `Más recientes`
- `name` → `Nombre A–Z`
- `quantity` → `Mayor cantidad`

Selected controls expose both a check mark and accessibility selected state. Changing order changes the repository query; raw UI strings never enter SQL.

## Focus refresh and race handling

`useFocusEffect` runs the initial query and re-runs it whenever Home regains focus, including return from `/sightings/new` after P7 save. Order changes recreate the focused callback and trigger a query for the new order. A request version invalidates results from blurred or superseded loads, and same-order in-flight requests are reused to avoid duplicate work.

## FlatList/layout decision

P3 `AppScreen` now gives its `scroll={false}` content a flex layout. Home uses `FlatList` inside that non-scrolling shell, avoiding a vertical `ScrollView` containing a vertical `FlatList`. The list supplies header, empty, and row composition itself while preserving the shared safe-area/paper/pine shell.

## Card presentation

`src/components/SightingCard.tsx` renders persisted values only:

- app-owned `photoUri` thumbnail with bounded 24×24 styling;
- bird name;
- formatted observation date;
- stored location label or unavailable text;
- stored temperature or `Clima no disponible`;
- persisted weather description when present;
- quantity.

Broken image URIs switch to a readable `Foto no disponible` placeholder. No base64 conversion, file copy, blob query, image cache, or weather request occurs.

Cards intentionally do not navigate to the incomplete P9 detail route.

## Formatting and states

`src/utils/formatSighting.ts` formats ISO timestamps as `14 sep 2026 · 18:42` and safely falls back to `Fecha no disponible`. Temperature formatting preserves one decimal and maps null/non-finite values to `Clima no disponible`.

Home presents:

- loading: progress indicator and text;
- error: user-facing message plus `Reintentar`;
- empty: designed `EmptyState` with direct registration action;
- success: real persisted cards.

The existing `EmptyState` gained optional action props without changing its prior no-action behavior.

## Navigation

Registration remains directly available in the pine header card for every list state and in the empty state. No fake newly saved card is inserted by P8; focus refresh obtains it from SQLite after P7 persistence.
