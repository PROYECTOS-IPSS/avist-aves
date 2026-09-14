import { Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="rounded-3xl border border-field-line bg-field-white p-6">
      <View className="mb-5 h-12 w-12 items-center justify-center rounded-2xl bg-field-sage">
        <Text className="text-xl font-bold text-field-pine">+</Text>
      </View>
      <Text className="text-xl font-bold text-field-ink">{title}</Text>
      <Text className="mt-2 text-base leading-6 text-field-muted">{description}</Text>
    </View>
  );
}
