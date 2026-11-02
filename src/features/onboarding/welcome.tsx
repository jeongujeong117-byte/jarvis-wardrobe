import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/ui/button';
import { PenDrawing } from '@/ui/pen/pen-drawing';
import { Column, Screen } from '@/ui/screen';
import { Text } from '@/ui/text';
import { Wordmark } from '@/ui/wordmark';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <Screen>
      <Column>
        <View style={styles.body}>
          <Wordmark large />
          <View style={styles.art}>
            <PenDrawing name="hanger" size={240} />
          </View>
          <View style={styles.copy}>
            <Text accessibilityRole="header" variant="display">
              산 옷은 저절로 쌓이고,{'\n'}입을 옷은 골라드려요.
            </Text>
            <Text tone="secondary" variant="body">
              주문메일로 옷장을 만들고, 날씨와 일정에 맞는 코디를 받아보세요.
            </Text>
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
  body: { flex: 1, paddingHorizontal: theme.space.xl, paddingTop: theme.space.section },
  art: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', marginRight: -theme.space.lg },
  copy: { gap: theme.space.md, paddingBottom: theme.space.xxl },
  actions: { paddingHorizontal: theme.space.xl, paddingBottom: theme.space.xl },
}));
