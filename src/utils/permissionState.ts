export type PermissionLike = {
  granted: boolean;
  canAskAgain: boolean;
};

export type PermissionRecoveryState = 'loading' | 'granted' | 'requestable' | 'blocked';

export function permissionRecoveryState(permission: PermissionLike | null): PermissionRecoveryState {
  if (!permission) return 'loading';
  if (permission.granted) return 'granted';
  return permission.canAskAgain ? 'requestable' : 'blocked';
}
