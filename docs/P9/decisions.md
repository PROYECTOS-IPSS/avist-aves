# P9 Decisions

## D-P9-001 — Detail loads independently by ID

### Decision

Use `useSightingDetail(id)` and `SightingsRepository.findById(id)` as the detail source of truth.

### Reason

Direct route access must work without list memory or global state. Repository loading also keeps database boundaries out of the route component.

## D-P9-002 — Card navigation uses real IDs only

### Decision

Make persisted cards tappable only when their trimmed ID is valid, encode that ID in the route, and leave empty-ID cards non-navigable.

### Reason

P9 must connect real SQLite rows without inventing identifiers or sending malformed values to the repository.

## D-P9-003 — Historical weather remains read-only

### Decision

Render persisted temperature, description, and humidity only. Never call Open-Meteo from detail.

### Reason

A sighting stores a registration-time weather snapshot. Refetching would replace historical conditions and violate P7/P9 data integrity.
