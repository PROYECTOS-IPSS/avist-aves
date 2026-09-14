# P4 Decisions

## D-P4-001 — Split editable date and time inputs

### Context

P4 requires a visible, editable current date/time but should not add a native picker dependency without a demonstrated need.

### Decision

Use two controlled native `TextInput` fields: `YYYY-MM-DD` and `HH:MM`. Parse local values and normalize to ISO-8601 only after validation.

### Reason

This is dependency-free, Android-compatible, visibly editable, deterministic in tests, and sufficient for P4's form-state scope.

### Alternatives considered

- Add a native date/time picker: deferred until manual Android evidence shows need.
- Keep one non-editable timestamp label: rejected; violates RF-01.
- Store localized display strings: rejected; repository contract expects predictable ISO-oriented values.

### Impact

P5+ can replace or augment controls later without changing the normalized contract.

## D-P4-002 — Defer save until native prerequisites

### Context

Photo and GPS are mandatory for final RF-01 save but belong to P5 and P6.

### Decision

Implement full-draft validation for missing photo/location, keep their UI state `null`, and leave save disabled. Do not call `SightingsRepository.create`.

### Reason

Prevents fake records, incomplete persistence, and false success navigation while keeping required-prerequisite rules ready.

### Alternatives considered

- Insert an incomplete row: rejected; violates RF-01 and P2 repository assumptions.
- Fabricate URI/coordinates: rejected; hides missing native behavior.
- Remove save area: rejected; future primary-action placement is useful foundation.

### Impact

P5/P6 must provide real photo/location state before enabling final save flow.
