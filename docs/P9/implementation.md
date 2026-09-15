# P9 Implementation

## Card navigation and route IDs

`SightingCard` now accepts an optional `onPress` and exposes button semantics only when a valid persisted ID exists. Home encodes the real `sighting.id` into `/sightings/<id>`. Empty IDs remain non-navigable; no fake ID is generated.

`normalizeRouteId()` accepts Router's `string | string[] | undefined`, selects the first array value, trims whitespace, rejects empty values, and rejects unexpectedly oversized values. Invalid IDs never reach the repository.

## Detail repository flow

`src/hooks/useSightingDetail.ts` owns detail state and calls `new SightingsRepository().findById(id)`. The route does not reuse list memory and works with direct route access. `useFocusEffect` loads initially, reloads when the route ID changes, and invalidates stale responses when the screen loses focus. Retry calls the same repository path again.

States:

- `loading`: ActivityIndicator and text.
- `success`: persisted sighting content.
- `notFound`: missing/malformed ID or repository `null`, with Home action.
- `error`: user-facing repository failure with retry.

## Photo and field mapping

The detail route renders the persisted `photoUri` directly in a large bounded image. It never copies, moves, base64-loads, or refetches the file. Missing/broken photo files show `Foto no disponible` without breaking the rest of the screen.

Persisted fields map as follows:

- `birdName`: prominent title.
- `observedAt`: shared P8 Spanish-friendly formatter.
- `quantity`: shared singular/plural formatter.
- `notes`: shown only when non-empty.
- `locationLabel`: primary location text, fallback `Ubicación registrada`.
- `latitude`/`longitude`: secondary four-decimal coordinates.
- `temperature`, `weatherDescription`, `humidity`: historical weather card.

No database column names or raw ISO timestamps are shown.

## Historical weather integrity

Detail reads only nullable weather fields persisted by P7. It does not call Open-Meteo, recalculate weather, mutate the cache, or refresh GPS. Missing/partial weather renders only available values; no numeric weather code is presented as the condition.

## Navigation and scope

`AppHeader` keeps `router.back()` available in every state. Not-found includes a Home action. Error includes retry. Detail is read-only; edit/delete and P10 permission/async consolidation are not implemented.
