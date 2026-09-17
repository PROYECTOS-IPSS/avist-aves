# P12 Rubric UI Evidence

## UI design principles

### Hierarchy

- `AppHeader` establishes eyebrow, large screen title, and supporting subtitle before content.
- Home gives registration CTA top priority in a pine callout; cards give bird name the strongest local hierarchy.
- Detail prioritizes bird name and large photo, then date/time, human location, historical weather, quantity, and optional notes.
- Registration groups capture requirements before editable observation fields and ends with a visually dominant save panel.

### Contrast and outdoor readability

- Primary text uses existing dark ink/pine tokens on paper/white surfaces.
- Important weather/location values remain dark; pale muted text is limited to supporting metadata.
- Disabled actions now use sage with pine/moss text instead of a weak pale-line-only treatment.
- Errors include explicit red wording and alert/live semantics; selected sort includes a checkmark, weight, border, and wording.
- No formal WCAG certification is claimed.

### Spacing and consistency

- Existing 5/6/7 spacing rhythm and rounded field cards are retained across Home, Registration, and Detail.
- Shared `PrimaryButton`, `FormField`, `AppHeader`, `SectionHeader`, and `FoundationCard` preserve consistent control and grouping behavior.
- P12 changes reuse existing field tokens; no one-off palette or design-system dependency was added.

### Outdoor and one-hand/touch usability

- Primary buttons remain at least 56dp; back, sort, camera cancel, retry, settings, and card surfaces have practical touch areas.
- Registration remains a single scroll flow; keyboard dismisses on drag and required actions remain below reachable content rather than inside fixed overlays.
- Long bird/location content can wrap to two lines on cards; detail image fallback preserves a deliberate 320dp block.

## UI components

Actual components supporting the rubric:

- `FlatList` in `app/index.tsx` for the sighting list and empty/loading/error composition.
- `Pressable` for back, sort radios, cards, camera actions, settings, and shared primary buttons.
- `TextInput` in `app/sightings/new.tsx` for bird name, date, time, quantity, and notes, with existing keyboard types.
- `Image` for captured, list, and detail photos, with meaningful labels or decorative suppression where the parent card already announces content.
- `ActivityIndicator` for Home, Detail, Camera, and Weather loading feedback.
- Reusable `AppScreen`, `AppHeader`, `PrimaryButton`, `SectionHeader`, `FormField`, `FoundationCard`, `EmptyState`, `SightingCard`, `CameraCapture`, `LocationCapture`, and `WeatherStatus` components.
- `SafeAreaView` from `react-native-safe-area-context` for top/bottom safe-area handling.

## Intuitive interfaces

The concrete flow remains:

`Home → Registrar avistamiento → Cámara/GPS/Clima → Guardar → Home → Detalle`

- Home exposes registration immediately and explains the local notebook purpose.
- Registration labels required fields in words, keeps validation beside affected inputs/sections, and states that weather is optional.
- Camera permission, capture, preview, use, retake, cancel, and recovery states name the next action.
- GPS shows human-readable place first, coordinates second, and exposes permission settings recovery.
- Weather distinguishes loading, available, idle, and unavailable without turning an optional API failure into a fatal form error.
- Save exposes validation, saving/busy, success, and retryable failure states while retaining duplicate-submit protection.
- Home refreshes its persisted list; card content is a clear press target and announces its detail content coherently.
- Detail keeps back navigation obvious and provides designed loading, retry, not-found, broken-photo, historical-weather, and optional-notes states.

## Scope boundary

No new functionality, navigation architecture, sorting mode, product domain, native dependency, backend, or release/build work was introduced in P12.
