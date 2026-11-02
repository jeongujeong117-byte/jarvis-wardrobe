import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/ui/button';
import { RailIllustration } from '@/ui/line-art';
import { Column, Screen } from '@/ui/screen';
import { Text } from '@/ui/text';
import { TopBar } from '@/ui/top-bar';
import { Wordmark } from '@/ui/wordmark';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <Screen>
      <Column>
        <TopBar leading={<Wordmark />} />
        <View style={styles.body}>
          <View style={styles.copy}>
            <Text tone="secondary" variant="label">
              산 옷은 자동으로 쌓이고
            </Text>
            <Text accessibilityRole="header" variant="display">
              오늘 입을 옷은{'\n'}
              <Text tone="accent" variant="display">
                바로 골라드려요
              </Text>
            </Text>
            <Text tone="secondary" variant="body">
              주문메일에서 내 옷장을 만들고, 날씨와 일정에 맞는 코디를 추천받으세요.
            </Text>
          </View>
          <View style={styles.art}>
            <RailIllustration />
          </View>
        </View>
        <View style={styles.actions}>
          <Button label="내 옷장 시작하기" onPress={onStart} />
        </View>
      </Column>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  body: { flex: 1, paddingHorizontal: theme.space.xl, justifyContent: 'space-between' },
  copy: { gap: theme.space.md, paddingTop: theme.space.xxl },
  art: { paddingVertical: theme.space.xxl },
  actions: { paddingHorizontal: theme.space.xl, paddingBottom: theme.space.lg },
}));
