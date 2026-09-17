import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  busy?: boolean;
  accessibilityHint?: string;
};

export function PrimaryButton({ label, onPress, disabled = false, busy = false, accessibilityHint }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy }}
      className={`min-h-14 flex-row items-center justify-between rounded-2xl border px-5 py-4 ${
        disabled ? 'border-field-line bg-field-sage' : 'border-transparent bg-field-amber active:bg-field-amber-dark'
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className={`text-base font-bold ${disabled ? 'text-field-moss' : 'text-field-ink'}`}>
        {label}
      </Text>
      <Text className={`text-2xl ${disabled ? 'text-field-moss' : 'text-field-ink'}`}>→</Text>
    </Pressable>
  );
}
