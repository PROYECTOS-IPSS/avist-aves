import { Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  detail?: string;
};

export function SectionHeader({ title, detail }: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-end justify-between gap-4">
      <Text className="text-lg font-bold text-field-ink">{title}</Text>
      {detail ? <Text className="text-xs font-semibold uppercase tracking-[1px] text-field-muted">{detail}</Text> : null}
    </View>
  );
}
