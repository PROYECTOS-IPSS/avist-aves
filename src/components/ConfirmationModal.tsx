import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  body: string;
  error?: string | null;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({ visible, title, body, error, busy = false, onCancel, onConfirm }: ConfirmationModalProps) {
  return (
    <Modal accessibilityViewIsModal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 justify-center bg-black/50 px-6">
        <View accessible accessibilityRole="alert" className="rounded-3xl bg-field-white p-6">
          <Text className="text-2xl font-bold text-field-ink">{title}</Text>
          <Text className="mt-2 text-base leading-6 text-field-muted">{body}</Text>
          {error ? <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="mt-3 text-sm leading-5 text-red-800">{error}</Text> : null}
          <View className="mt-5 gap-3">
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} className="min-h-12 items-center justify-center rounded-2xl border border-field-line px-4 py-3" disabled={busy} onPress={onCancel}>
              <Text className="font-bold text-field-pine">Cancelar</Text>
            </Pressable>
            <Pressable accessibilityLabel="Eliminar" accessibilityRole="button" accessibilityState={{ busy, disabled: busy }} className="min-h-12 items-center justify-center rounded-2xl bg-red-800 px-4 py-3" disabled={busy} onPress={onConfirm}>
              {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-bold text-field-white">Eliminar</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
