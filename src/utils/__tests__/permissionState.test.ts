import { permissionRecoveryState } from '../permissionState';

describe('permission recovery state', () => {
  it('distinguishes loading, granted, requestable, and blocked states', () => {
    expect(permissionRecoveryState(null)).toBe('loading');
    expect(permissionRecoveryState({ granted: true, canAskAgain: false })).toBe('granted');
    expect(permissionRecoveryState({ granted: false, canAskAgain: true })).toBe('requestable');
    expect(permissionRecoveryState({ granted: false, canAskAgain: false })).toBe('blocked');
  });
});
