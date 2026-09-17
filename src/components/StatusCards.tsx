import { ActivityIndicator, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

type LoadingCardProps = {
  message?: string;
};

export function LoadingCard({ message = 'Cargando tus avistamientos…' }: LoadingCardProps) {
  return (
    <View accessibilityLiveRegion="polite" className="items-center rounded-3xl border border-field-line bg-field-white p-8">
      <ActivityIndicator color="#193D32" />
      <Text className="mt-3 text-sm font-semibold text-field-muted">{message}</Text>
    </View>
  );
}

type ErrorCardProps = {
  title?: string;
  message: string;
  retryHint?: string;
  onRetry: () => void;
};

export function ErrorCard({
  title = 'No pudimos cargar tus avistamientos',
  message,
  retryHint = 'Vuelve a cargar los datos',
  onRetry,
}: ErrorCardProps) {
  return (
    <View className="rounded-3xl border border-red-200 bg-field-white p-6">
      <Text className="text-xl font-bold text-field-ink">{title}</Text>
      <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-2 text-sm leading-5 text-red-800">
        {message}
      </Text>
      <View className="mt-5">
        <PrimaryButton accessibilityHint={retryHint} label="Reintentar" onPress={onRetry} />
      </View>
    </View>
  );
}
