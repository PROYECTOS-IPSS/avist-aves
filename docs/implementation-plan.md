# Implementation Roadmap P1–P16

Skills refer to permitted documentation lookup only; frontend-design is intentionally deferred to P12.

| Phase                                                                                    | Objective / scope                     | Depends on      | Skill                      | Definition of Done                                                                                                                               |
| ---------------------------------------------------------------------------------------- | ------------------------------------- | --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1                                                                                       | Scaffold Expo RN TS Router NativeWind | P0              | Context7                   | App starts; route skeleton; no backend.                                                                                                          |
| P2                                                                                       | SQLite schema/provider/repository     | P1              | Context7                   | Create/findAll/findById work; migration version documented.                                                                                      |
| P3                                                                                       | Navigation/UI foundation              | P1              | Context7 + frontend-design | List/create/detail routes reachable; base states and empty shell.                                                                                |
| P4                                                                                       | Form and validation                   | P2,P3           | Context7                   | Required fields; free-text bird name; current date/time initialized automatically but editable; quantity >= 1; validation feedback; save gating. |
| P5                                                                                       | Camera and durable photo              | P4              | Context7                   | Camera-only capture; copied persistent URI survives restart smoke test.                                                                          |
| P6                                                                                       | GPS and reverse geocoding             | P4              | Context7                   | Permission/retry; coordinates captured; label best effort.                                                                                       |
| P7                                                                                       | Open-Meteo integration                | P2,P4,P6        | Context7                   | Temperature/humidity/code parsed; unknown code safe; failure non-blocking.                                                                       |
| P8                                                                                       | Listing/sort/empty state              | P2,P3,P5,P7     | Context7                   | Newest-first cards; alternate date/name/quantity ordering; create CTA.                                                                           |
| P9                                                                                       | Detail                                | P2,P5,P6,P7,P8  | Context7                   | All required fields, photo, label + coordinates visible.                                                                                         |
| P10                                                                                      | Permissions and async states          | P5,P6,P7,P9     | Context7                   | Idle/loading/success/error and denial paths no crashes/freezes.                                                                                  |
| P11                                                                                      | API optimization                      | P7              | Context7                   | Timeout, max one retry, coordinate-bucket TTL cache; request-count evidence.                                                                     |
| P12                                                                                      | Accessibility/UI polish               | P3–P11          | Context7                   | Outdoor principles, labels, contrast, touch targets, keyboard/focus review.                                                                      |
| P13                                                                                      | Automated tests                       | P2,P4,P7,P8,P11 | Context7                   | Critical pure logic/repository/service tests pass; device-only cases manual.                                                                     |
| P14                                                                                      | EAS Preview APK                       | P13             | Context7                   | Android Preview APK builds and installs on target device.                                                                                        |
| P15                                                                                      | Final release gate                    | P14             | Context7                   | Acceptance checklist, clean install/restart/offline/permission smoke checks, evidence captured.                                                  |
| P16                                                                                      | Report/README/demo                    | P15             | Context7                   | README links install/run/APK/demo/report; rubric evidence complete; release published;                                                           |
| AI usage declaration included, describing which AI tools were used and for what purpose. |

## Dependency correction

P5 and P6 can be developed independently after P4, but both must precede reliable end-to-end registration. P10 is intentionally after first integrations: it standardizes real async failure states instead of designing placeholders. P13 follows stable contracts. Roadmap otherwise preserves supplied order.

## Gates

- **G1 P1:** app boots and route navigation works.
- **G2 P7:** local record path works; weather failure cannot block insert.
- **G3 P10:** permission/error transitions demonstrable.
- **G4 P13:** critical checks pass.
- **G5 P14/P15:** APK installation and physical Android acceptance.
- **G6 P16:** 100 rubric points have implementation + test/manual + report evidence.

## Testing strategy

Automate pure validation, weather-code mapping, response parsing, timeout/retry/cache policy, repository row mapping, and deterministic sort. Use a small SQLite integration check for create/find operations. Manually verify camera, GPS, permission dialogs, persistent photo, physical navigation, Android restart, and APK behavior. Avoid mocking every native surface.
