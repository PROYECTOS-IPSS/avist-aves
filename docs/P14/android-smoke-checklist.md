# P14 Android Preview Smoke Checklist

Target artifact: `build-outputs/preview/avistaves-preview.apk`

Do not mark any item PASS before user execution on physical Android. Development-client observations do not replace Preview APK evidence.

## Scenario A — Full online sighting

- [ ] Launch Preview APK without Metro.
- [ ] Home renders normally.
- [ ] Open registration.
- [ ] Enter free-text bird name.
- [ ] Confirm `No identificada` is accepted if tested.
- [ ] Confirm date/time default to current values and remain editable.
- [ ] Quantity rejects invalid value and accepts integer ≥ 1.
- [ ] Take a real camera photo.
- [ ] Retake/use-photo flow works.
- [ ] Obtain real foreground GPS.
- [ ] Human-readable location appears first.
- [ ] Coordinates appear as secondary data.
- [ ] Weather loads.
- [ ] Save succeeds.
- [ ] Home shows new record.
- [ ] Open Detail.
- [ ] Detail shows photo and persisted data.
- [ ] Back navigation works.

## Scenario B — Weather unavailable

- [ ] Complete photo and GPS.
- [ ] Disable connectivity before weather request or reproduce network failure.
- [ ] Weather reaches unavailable state in bounded time.
- [ ] Registration remains savable.
- [ ] Saved record shows weather unavailable.
- [ ] Detail shows historical weather unavailable without crashing.

## Scenario C — Multiple records and sorting

Create records with different names, quantities, and observation times.

- [ ] Newest-first default is correct.
- [ ] Name ordering is correct.
- [ ] Quantity ordering is correct.
- [ ] Sort selection is visually clear without color alone.
- [ ] No stale-order flicker or wrong final result appears.

## Scenario D — Persistence restart

After records exist:

- [ ] Fully close AvistAves.
- [ ] Reopen Preview APK.
- [ ] Records still exist.
- [ ] Photos still render.
- [ ] Detail still renders historical data.

## Scenario E — Permission and recovery

Where practical, perform before final demo:

- [ ] Camera denial gives understandable recovery.
- [ ] Location denial gives understandable recovery.
- [ ] Permanent denial exposes Settings recovery.
- [ ] Returning from Settings refreshes permission state.

Avoid destructive permission testing immediately before submission if it could disrupt the demo state.

## Scenario F — Accessibility and UI

- [ ] No content under status bar/notch.
- [ ] Keyboard does not block required workflow.
- [ ] Long bird name remains readable.
- [ ] Disabled/busy actions are understandable.
- [ ] TalkBack identifies important actions.
- [ ] Selected sort state is announced.
- [ ] Layout survives moderately larger system text.
- [ ] Important content remains readable at high brightness/outdoors where practical.

## Evidence boundary

Automated gates prove code/configuration only. Camera, permissions, GPS, network, SQLite restart, navigation feel, TalkBack, and visual layout require this physical Preview APK checklist.
