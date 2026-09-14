import { Text, View } from 'react-native';

type FoundationCardProps = {
  label: string;
  title: string;
  description: string;
  mark: string;
  tone?: 'sage' | 'sky' | 'amber';
};

const toneClasses = {
  sage: 'bg-field-sage text-field-pine',
  sky: 'bg-field-sky text-field-pine',
  amber: 'bg-field-amber text-field-ink',
} as const;

export function FoundationCard({
  label,
  title,
  description,
  mark,
  tone = 'sage',
}: FoundationCardProps) {
  const [backgroundClass, textClass] = toneClasses[tone].split(' ');

  return (
    <View className="rounded-3xl border border-field-line bg-field-white p-5">
      <View className="flex-row items-start gap-4">
        <View className={`h-11 w-11 items-center justify-center rounded-2xl ${backgroundClass}`}>
          <Text className={`text-lg font-bold ${textClass}`}>{mark}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold uppercase tracking-[1.5px] text-field-muted">{label}</Text>
          <Text className="mt-1 text-lg font-bold text-field-ink">{title}</Text>
          <Text className="mt-2 text-sm leading-5 text-field-muted">{description}</Text>
        </View>
      </View>
    </View>
  );
}
