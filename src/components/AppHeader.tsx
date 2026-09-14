import { Pressable, Text, View } from 'react-native';

type AppHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  onBack?: () => void;
};

export function AppHeader({ eyebrow, title, subtitle, onBack }: AppHeaderProps) {
  return (
    <View className="mb-7">
      {onBack ? (
        <Pressable
          accessibilityLabel="Volver"
          accessibilityRole="button"
          className="mb-6 h-12 w-12 items-center justify-center rounded-full border border-field-line bg-field-white active:bg-field-sage"
          hitSlop={8}
          onPress={onBack}
        >
          <Text className="text-2xl leading-6 text-field-ink">←</Text>
        </Pressable>
      ) : null}
      <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-field-moss">
        {eyebrow}
      </Text>
      <Text className="max-w-[360px] text-4xl font-bold leading-[42px] text-field-ink">
        {title}
      </Text>
      <Text className="mt-3 max-w-[360px] text-base leading-6 text-field-muted">{subtitle}</Text>
    </View>
  );
}
