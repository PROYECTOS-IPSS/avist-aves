# P2 Decisions

## D-P2-001 — Lazy singleton database initialization

### Context

P2 must expose a usable SQLite database without introducing UI/provider work from later phases. The repository needs migration completion before any query.

### Decision

`getDatabase()` lazily opens `avistaves.db`, runs migrations, caches the promise, and clears it after failure. P2 does not wire initialization into the root layout.

### Reason

This is the smallest safe boundary: no duplicate opens, no blank P1 screen, and no P3 state management introduced early. Repository callers cannot receive a database before schema setup completes.

### Alternatives considered

- Root-layout provider: deferred until a screen needs loading/error UI.
- Module-level eager open: rejected; performs native work during import and complicates failure handling.

### Impact

P3/P10 can add visible initialization states when UI consumes the repository. Current native runtime proves lazy initialization and migration.

## D-P2-002 — SQLite `user_version` migrations

### Context

The project needs auditable schema versioning without an external migration framework.

### Decision

Read/write SQLite `PRAGMA user_version`; apply ordered migration functions in `withTransactionAsync`. Version 1 creates the table and indexes with `IF NOT EXISTS`.

### Reason

SQLite-native versioning is sufficient for one table, deterministic, dependency-free, and preserves existing data. No drop/recreate fallback is allowed.

### Alternatives considered

- External migration package: rejected; unnecessary dependency.
- `DROP TABLE` and recreate: rejected; risks data loss.
- Expo `SQLiteProvider` `onInit`: deferred because no P2 UI provider is needed yet.

### Impact

Future schema changes append migration entries and increment `CURRENT_SCHEMA_VERSION`.

## D-P2-003 — Local UUID with runtime fallback

### Context

IDs must be stable and unique offline, but P2 should not add a package solely for ID generation.

### Decision

Use `globalThis.crypto.randomUUID()` when available, with a timestamp/random local fallback for runtimes without it.

### Reason

Expo SDK 57 runtimes provide a native-capable standard mechanism in supported environments; fallback avoids a new dependency while preserving local route identity.

### Alternatives considered

- Add `expo-crypto`: rejected for current scope; revisit only if runtime evidence shows fallback usage or collision risk.
- Numeric autoincrement: rejected; less suitable as a stable route identifier across future data moves.

### Impact

IDs remain server-independent and ready for dynamic routes.

## D-P2-004 — Native Android integration evidence

### Context

Jest's Node environment cannot execute Expo's native SQLite module, and web SQLite requires separate WASM bundler configuration.

### Decision

Use Jest for pure mapper/order behavior and a temporary Android Expo Go route for real database initialization, migration, create, findById, and findAll.

### Reason

This avoids false confidence from SQL mocks and validates the actual mobile target.

### Alternatives considered

- Mock `expo-sqlite` in Jest: rejected; would not execute real SQL.
- Add web WASM configuration: rejected; P2 targets Android and web is not a required product platform.

### Impact

Native runtime smoke must be repeated in P14 Preview APK validation.
