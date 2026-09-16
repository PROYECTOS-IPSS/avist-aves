import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type FormFieldProps = PropsWithChildren<{
  label: string;
  labelId: string;
  required?: boolean;
  helper?: string;
  error?: string;
}>;

export function FormField({ children, label, labelId, required = false, helper, error }: FormFieldProps) {
  return (
    <View className="mb-5">
      <Text nativeID={labelId} className="mb-2 text-sm font-bold text-field-ink">
        {label}
        {required ? <Text className="text-field-moss"> · obligatorio</Text> : null}
      </Text>
      {children}
      {error ? (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-2 text-sm leading-5 text-red-800">
          {error}
        </Text>
      ) : helper ? (
        <Text className="mt-2 text-xs leading-4 text-field-muted">{helper}</Text>
      ) : null}
    </View>
  );
}
