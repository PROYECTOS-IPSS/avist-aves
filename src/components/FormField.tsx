import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Animated, Text } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

type FormFieldProps = PropsWithChildren<{
  label: string;
  labelId: string;
  required?: boolean;
  helper?: string;
  error?: string;
  highlightToken?: number;
  onLayout?: (event: LayoutChangeEvent) => void;
}>;

export function FormField({ children, label, labelId, required = false, helper, error, highlightToken, onLayout }: FormFieldProps) {
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!highlightToken) return;
    scale.setValue(1);
    const animation = Animated.sequence([
      Animated.timing(scale, { toValue: 1.025, duration: 180, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.015, duration: 140, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [highlightToken, scale]);

  return (
    <Animated.View onLayout={onLayout} style={highlightToken ? { transform: [{ scale }] } : undefined} className="mb-5">
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
    </Animated.View>
  );
}
