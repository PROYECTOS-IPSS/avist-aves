# P12 UI + Accessibility Audit

Audit scope: `app/index.tsx`, `app/sightings/new.tsx`, `app/sightings/[id].tsx`, reusable components, hooks, and NativeWind tokens. Review is code-based; no Android visual result is claimed here.

| Area | Existing behavior | Issue | Severity | P12 action |
|---|---|---|---|---|
| Safe area | `AppScreen` uses `SafeAreaView` on top/bottom edges. | No code issue found. | OK | Keep unchanged. |
| Shared primary actions | `PrimaryButton` provides 56dp minimum height and button role. | Disabled color is pale and busy state is not exposed to assistive technology. | P1 | Strengthen disabled styling; add optional busy state and hints. |
| Shared back action | `AppHeader` back control is 48dp and has a label. | Outcome hint is missing. | P2 | Add concise navigation hint. |
| Home loading/error/empty | Home has contextual loading, retry, and first-record CTA states. | Dynamic loading/error text is not announced consistently. | P2 | Add live-region/alert semantics without blocking content. |
| Home registration CTA | Pine callout places registration action near the top. | Existing hierarchy is already clear. | OK | Keep composition and wording. |
| Home sorting | Three large radio-like `Pressable` controls expose selected state and a checkmark. | Controls lack an explicit group label; current selection is visually strong but should also be named. | P2 | Add radio group context and hints. |
| Home sighting cards | Whole card is a large press target; image fallback is usable. | Bird name/location are clipped to one line; nested image label can duplicate the card announcement; card announcement omits location/weather/quantity. | P1 | Allow two-line names/location, make image decorative inside accessible card, complete card label. |
| Registration form labels | `FormField` places labels, helper text, and errors directly around controls. | Required marker is primarily a color/symbol cue. | P2 | Say “obligatorio” in label text; keep nearby error text. |
| Registration inputs | Inputs are 56dp minimum, use useful keyboard types, and support multiline notes. | Existing text-input/date-time decision is appropriate for scope. | OK | Keep input architecture; improve focus/selection affordance only. |
| Registration save error | Save catches failures and disables duplicate submission while saving. | `saveError` is never populated, so a real save failure gives no user-facing explanation. | P1 | Surface concise recovery text and announce it. |
| Registration save state | Save card is visually dominant; validation runs before persistence. | Busy/success state is not fully exposed through shared button semantics. | P1 | Pass busy state and state-specific accessible hint. |
| Camera capture | Permission, loading, preview, capture, accept, retry, and cancel states exist. | Cancel control is below practical 44–48dp target; changing preview/error text is not announced. | P2 | Enlarge cancel target and add live-region semantics to meaningful status/error text. |
| Location capture | Human-readable location is primary; coordinates are secondary; permission recovery exists. | Busy/result/error changes rely mostly on visual text. | P2 | Add polite live status for meaningful async result/error changes. |
| Weather status | Weather is optional and failure does not block save. | Idle/loading/success/unavailable share one visual treatment; loading lacks a progress indicator. | P1 | Use restrained state-specific surfaces and indicator/live text. |
| Detail hierarchy | Bird name, photo, date, location, historical weather, quantity, and notes are grouped. | Coordinates are visually close to primary location value without an explicit secondary label. | P2 | Label coordinates as secondary metadata; keep historical weather grouping. |
| Detail loading/error/not-found | Contextual loading, retry, and home recovery states exist. | Dynamic loading/error text is not consistently announced. | P2 | Add live-region/alert semantics. |
| P10 async ownership | Hooks prevent stale list/detail/weather results and expose loading/error states. | State correctness is good; UI does not consistently communicate transitions to screen readers. | P2 | Change presentation only; leave request ownership logic unchanged. |
| Color/contrast tokens | Paper/pine/ink palette provides strong dark primary text and amber accent. | Disabled control treatment is the weakest important contrast/affordance. | P1 | Use sage/pine disabled treatment plus text/state cue. |
| Text scaling/layout | Scroll containers and flexible rows are used. | One-line card text is the clearest resilience risk. | P1 | Remove hard one-line constraint from prominent card text. |
| Native/build scope | Existing dependencies and native configuration cover current flow. | No P12 native need identified. | OK | Keep JS/TS/styles and docs only. |

## Deliberately unchanged

- Navigation architecture and routes.
- Date/time text inputs.
- Camera, GPS, weather, persistence, and P10 request-ownership logic.
- Product functionality, sorting options, and field-notebook palette.
