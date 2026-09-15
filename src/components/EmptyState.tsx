import { Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="rounded-3xl border border-field-line bg-field-white p-6">
      <View className="mb-5 h-12 w-12 items-center justify-center rounded-2xl bg-field-sage">
        <Text className="text-xl font-bold text-field-pine">+</Text>
      </View>
      <Text className="text-xl font-bold text-field-ink">{title}</Text>
      <Text className="mt-2 text-base leading-6 text-field-muted">{description}</Text>
      {actionLabel && onAction ? (
        <View className="mt-5">
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
