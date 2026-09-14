import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`min-h-14 flex-row items-center justify-between rounded-2xl px-5 py-4 ${
        disabled ? 'bg-field-line' : 'bg-field-amber active:bg-field-amber-dark'
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className={`text-base font-bold ${disabled ? 'text-field-muted' : 'text-field-ink'}`}>
        {label}
      </Text>
      <Text className={`text-2xl ${disabled ? 'text-field-muted' : 'text-field-ink'}`}>→</Text>
    </Pressable>
  );
}
