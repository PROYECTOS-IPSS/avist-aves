# Technical Risk Register

| Risk | Probability | Impact | Mitigation / evidence |
|---|---|---|---|
| Camera URI temporary | High | High | Copy to persistent app directory before DB insert; restart test; cleanup orphan on failure. |
| Camera permission rejected | Medium | High | Rationale, retry/settings path, disable save, no crash; physical test. |
| Location permission rejected | Medium | High | Same handling; save blocked without GPS. |
| GPS unavailable/slow | Medium | High | Loading + timeout/error/retry; never accept manual coordinates. |
| Reverse geocoding fails | Medium | Medium | Keep coordinates, nullable label, readable fallback. |
| Open-Meteo offline | High | Medium | Controlled error, unavailable weather, save continues; offline smoke test. |
| API timeout | Medium | Medium | Finite timeout, one recoverable retry, visible state. |
| Unknown weather code | Low | Low | Default safe description/visual; mapping test. |
| SQLite migration error | Low | High | Versioned idempotent migrations, initialization error state, install/reopen test. |
| Expo Go differs from preview build | High | High | Validate camera/location/files in EAS Preview APK, not Expo Go alone. |
| Android device differences | Medium | High | Test target Android device; record OS/device; avoid platform assumptions. |
| EAS build failure | Medium | High | Build early at P14; verify project/account/config without secrets in Git. |
| Secrets/configuration drift | Low | Medium | Open-Meteo needs no secret; keep environment/config minimal; document setup. |
| Unnecessary dependencies | Medium | Medium | Use mandatory stack only; review package additions at P1/P12. |
| Overarchitecture | Medium | Medium | Three boundaries only (repository/services/components); no backend/sync/CRUD without requirement. |
| Large/invalid photo files | Medium | Medium | Use app storage, inspect capture result, handle copy failure; optional size policy only if device test requires. |
| Concurrent saves / duplicate taps | Low | Medium | Disable save during loading and use single submission state; manual check. |

Risk owner is implementation phase owner; each mitigation becomes acceptance evidence at P15. Highest priority before feature polish: persistent photos, permissions/GPS, preview APK, and weather non-blocking failure.
