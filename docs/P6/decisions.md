# P6 Decisions

## D-P6-001 — Point-of-use foreground permission

### Decision

Request foreground location permission only after the user taps `Obtener ubicación`.

### Reason

The registration form needs one current position, not continuous tracking. Point-of-use permission explains the requirement at the moment it matters and avoids startup prompts or repeated permission requests.

## D-P6-002 — Balanced one-shot accuracy

### Decision

Use `getCurrentPositionAsync` with `LocationAccuracy.Balanced` and no watcher.

### Reason

A bird sighting needs a useful position, not navigation-grade precision or ongoing updates. Balanced accuracy reduces unnecessary power and implementation complexity while satisfying RF-01.

## D-P6-003 — Coordinates survive geocoder failure

### Decision

Accept valid coordinates even when `reverseGeocodeAsync` fails or returns no address, using `Ubicación obtenida` as fallback.

### Reason

GPS coordinates are the mandatory native prerequisite and remain usable for future weather integration. Reverse geocoding improves RF-04 presentation but must not erase valid location data.

## D-P6-004 — Preserve location on failed refresh

### Decision

Update the draft only after a new valid coordinate result is acquired. Failed refreshes leave the prior latitude, longitude, and label intact.

### Reason

A transient GPS, permission, timeout, or geocoder failure must not destroy an already valid registration draft.
