import { Text, View } from 'react-native';

type FormInfoProps = {
  message: string;
  icon?: string;
};

export function FormInfo({ message, icon }: FormInfoProps) {
  return (
    <View accessible accessibilityRole="text" className="rounded-2xl bg-field-sky p-4">
      <Text className="text-sm leading-5 text-field-pine">
        {icon ? `${icon} ` : ''}{message}
      </Text>
    </View>
  );
}
