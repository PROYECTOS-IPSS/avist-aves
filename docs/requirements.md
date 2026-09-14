# AvistAves — Requirements Baseline

## Source and scope

Baseline derived from P0 examination brief and rubric supplied for this repository. Items are labelled **mandatory**, **technical decision**, or **optional**. P0 creates documentation only; no functional code is introduced.

## Functional requirements

| ID    | Requirement       | Mandatory behavior / acceptance criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-01 | Register sighting | Capture photo with camera only; obtain GPS coordinates from device; collect bird name, date/time, quantity, notes, weather. Quantity integer >= 1. Photo and location required. Show field validation. Successful save persists record and returns to list. Coordinates never manually entered. The sighting date/time is initialized automatically with the current value but remains editable by the user. Bird name is free text. The user may enter values such as "no identificada"; the application must not require selecting a species from a predefined catalog. |
| RF-02 | Obtain weather    | Query Open-Meteo for sighting coordinates. Persist temperature, weather condition/code, and humidity when available. Translate `weather_code` to readable text and visual indicator. Timeout and controlled error handling. Weather failure informs user, records error state, stores weather unavailable, and never blocks save.                                                                                                                                                                                                                                         |
| RF-03 | List sightings    | Show thumbnail, bird name, date, temperature or unavailable indicator. Default newest-first. Provide at least one sort/filter alternative; selected MVP: sort by date/name/quantity. Provide designed empty state and direct create action.                                                                                                                                                                                                                                                                                                                               |
| RF-04 | View detail       | Show large photo, bird, date/time, quantity, notes, weather, coordinates, and human-readable location label. Reverse geocoding may fail without invalidating original coordinates.                                                                                                                                                                                                                                                                                                                                                                                        |
| RF-05 | Persist locally   | SQLite is primary sighting store. Records survive navigation, normal close, and reopen. Camera temporary URI is copied to persistent app storage before SQLite insert; SQLite stores persistent URI.                                                                                                                                                                                                                                                                                                                                                                      |
| RF-06 | Navigate          | Expo Router provides list, create, and detail routes. Back and cancel paths always return to a usable screen; no trapped screen.                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Mandatory vs decisions vs optional

- **Mandatory:** RF-01–RF-06 behaviors above; React Native, Expo, TypeScript, Expo Router, NativeWind; `expo-camera`; `expo-location`; `expo-sqlite`; Open-Meteo; EAS Preview APK; no backend.
- **Technical decisions:** SQLite schema in `data-model.md`; repository/service boundaries in `architecture.md`; one retry, timeout, and location-bucket cache in `implementation-plan.md`.
- **Optional:** editing/deleting sightings, gallery import, accounts, sync, maps, advanced filters, background location, remote backend. Excluded from MVP because brief does not require them.

## Non-functional requirements

- Local-first and usable offline; weather is best-effort.
- Clear loading, success, and error states for camera, GPS, reverse geocoding, API, and persistence.
- Permission rationale, retry path, no crash on denial.
- Outdoor usability: high contrast, readable type, adequate touch targets, one-hand primary actions.
- Data integrity: photo URI points to durable file; quantity and required fields validated at trust boundary.
- Maintainable TypeScript with thin screens and testable services/repository.
- Avoid unnecessary dependencies and backend/configuration secrets.
- Android behavior verified in a Preview APK, not only Expo Go.

## Acceptance scenarios

1. User denies camera: app explains requirement, offers retry/settings path, and blocks save without crashing.
2. User denies location or GPS unavailable: app explains requirement, offers retry, and blocks save without crashing.
3. Valid photo + GPS + fields + available weather: sighting appears newest-first after save and restart.
4. Valid photo + GPS + weather timeout/offline: controlled message appears; record saves with unavailable weather.
5. Temporary camera URI is no longer assumed after restart; stored photo remains viewable.
6. Empty database shows useful empty state and create action.
7. Alternative ordering changes visible list deterministically.
8. Detail presents location label plus original coordinates.

## Out of scope / constraints

No Node.js, Express, PostgreSQL, Docker, Firebase, auth, remote sync, gallery selection, or APK committed to Git history. No P0 implementation, dependency installation, Expo config changes, database creation, API/service code, screens, or release.
