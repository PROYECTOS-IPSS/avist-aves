# P7 Decisions

## D-P7-001 — Fetch weather after GPS and reuse at save

### Decision

Start one weather request after successful location acquisition. Final save reuses the in-flight or cached result instead of issuing a second request for the same coordinate bucket.

### Reason

The user sees current weather status before saving, while the save path remains bounded and avoids duplicate network work. Weather remains optional if the request fails.

## D-P7-002 — Five-second timeout and one retry

### Decision

Abort each attempt after five seconds and allow one retry only for network/timeout failures, HTTP 5xx, and HTTP 429.

### Reason

Open-Meteo is external and weather must never hold registration indefinitely. The bounded retry covers transient failures without recursive or unbounded behavior.

## D-P7-003 — Cache successful weather by coordinate bucket

### Decision

Cache successful results for ten minutes using latitude/longitude rounded to three decimals. Keep cache process-memory only.

### Reason

Small coordinate differences during one registration session should not cause redundant requests. Weather is not source-of-truth data and does not need persistence outside the sighting snapshot.

## D-P7-004 — No wind schema migration

### Decision

Request and display `wind_speed_10m` when available, but do not add a persisted wind column.

### Reason

Authoritative project requirements require temperature, humidity, weather code, and readable condition. Existing schema version 1 satisfies that contract; changing SQLite schema would add scope without a requirement.

## D-P7-005 — Alert-confirmed post-insert navigation

### Decision

Set success state and show success feedback only after `SightingsRepository.create` resolves. Navigate to `/` from the success action.

### Reason

Repository failure must leave draft and photo available for retry. No list card is fabricated in P7; list rendering remains P8.
