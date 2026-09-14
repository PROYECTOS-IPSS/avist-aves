# P2 Validation

Commands and runtime checks were executed after implementation.

| Check | Command / scenario | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | **PASS** — no diagnostics. |
| Lint | `npm run lint` | **PASS** — ESLint completed cleanly. |
| Tests | `npm test` | **PASS** — 3 suites, 9 tests passed. |
| Expo diagnostics | `npx expo-doctor` | **PASS** — 21/21 checks passed. |
| SQLite initialization | Android Expo Go temporary smoke route | **PASS** — `openDatabaseAsync` opened `avistaves.db` and migration completed. |
| Migration v1 | Android UI reported `schema=1` | **PASS** |
| Repeated initialization | Two concurrent `getDatabase()` calls returned one cached connection | **PASS** |
| Repository create | Android runtime inserted synthetic `file:///test/bird.jpg` row | **PASS** |
| Repository findById | Android runtime retrieved created row by bound ID | **PASS** |
| Repository findAll | Android runtime returned inserted rows with default ordering | **PASS** |

## Automated test coverage

- Mapper complete row: **PASS**
- Mapper nullable weather/location fields: **PASS**
- Default date ordering: **PASS**
- Name ordering whitelist: **PASS**
- Quantity ordering whitelist: **PASS**
- Invalid order rejected before SQL construction: **PASS**
- Jest Expo baseline smoke: **PASS**

## Runtime evidence

A temporary route was used only for validation and removed before delivery. It ran on the Android emulator through Expo Go after a clean Metro bundle and displayed:

```text
PASS schema=1 rows=3
```

The same route called `getDatabase()` twice, created a record with all weather/location nullable fields, called `findById`, and called `findAll`. It was not retained as a product route.

## Runtime limitations

- Jest does not execute the native Expo SQLite module in its pure Node environment. No fake SQL adapter was added. Pure mapping/ordering logic is covered by Jest; actual SQLite initialization and repository operations were exercised on Android Expo Go.
- Expo web bundling of SQLite was not used: Expo SQLite's worker requires WASM asset configuration not needed by the Android target. This does not block P3 or the mobile persistence contract.

## Scope verification

- SQLite implemented: **YES**
- Migrations implemented: **YES**
- SightingsRepository implemented: **YES**
- Camera implemented: **NO**
- GPS implemented: **NO**
- Reverse geocoding implemented: **NO**
- Open-Meteo implemented: **NO**
- Photo file persistence implemented: **NO**
- Functional registration form implemented: **NO**
- Backend introduced: **NO**
- Prisma/ORM introduced: **NO**
