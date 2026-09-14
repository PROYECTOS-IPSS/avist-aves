# P5 Decisions

## D-P5-001 — Inline camera component

### Decision

Keep camera state in a focused `CameraCapture` component rendered inline from `/sightings/new`.

### Reason

P5 needs one point-of-use camera interaction and no independent deep-linkable screen. Inline rendering avoids a new route/modal contract while keeping permission, preview, capture, and retry state out of the registration screen.

## D-P5-002 — App document storage with new FileSystem API

### Decision

Copy captures into `Paths.document/sightings/photos` using `Directory`, `File`, and `Paths` from SDK 57 `expo-file-system`.

### Reason

Document storage is app-owned and durable across app close/reopen. The current class-based API avoids deprecated legacy filesystem calls and makes ownership checks explicit.

## D-P5-003 — Conservative replacement cleanup

### Decision

Persist the replacement first, update the draft, then best-effort delete only the previous URI when it is a direct child of the owned draft-photo directory.

### Reason

A failed copy must not replace a valid existing photo. A failed old-file deletion must not invalidate a newly accepted photo. Abandoned-draft garbage collection is deferred rather than guessing lifecycle ownership.
