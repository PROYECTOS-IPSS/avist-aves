import type { PropsWithChildren, Ref } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
  scrollRef?: Ref<ScrollView>;
  onScrollLayout?: (event: LayoutChangeEvent) => void;
  onContentSizeChange?: (width: number, height: number) => void;
}>;

export function AppScreen({ children, scroll = true, scrollRef, onScrollLayout, onContentSizeChange }: AppScreenProps) {
  const content = <View className={`${scroll ? '' : 'flex-1'} px-5 pb-10 pt-4`}>{children}</View>;

  return (
    <SafeAreaView className="flex-1 bg-field-paper" edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={onContentSizeChange}
          onLayout={onScrollLayout}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
