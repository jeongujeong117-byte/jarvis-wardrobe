import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from './icon-button';
import { Text } from './text';

/** Bottom sheet: grab handle, tap-outside to close, close button, keyboard-aware. */
export function Sheet({
  visible,
  onClose,
  title,
  caption,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** @deprecated eyebrow labels are not used in this design */
  caption?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <Pressable accessibilityLabel="닫기" onPress={onClose} style={styles.backdrop} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text accessibilityRole="header" variant="heading">
                {title}
              </Text>
            </View>
            <IconButton icon={X} label={`${title} 닫기`} onPress={onClose} />
          </View>
          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: theme.colors.scrim },
  sheet: {
    width: '100%',
    maxWidth: theme.layout.readable,
    maxHeight: '92%',
    alignSelf: 'center',
    backgroundColor: theme.colors.surfaceRaised,
    paddingBottom: rt.insets.bottom + theme.space.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: theme.colors.borderInteractive,
    marginTop: theme.space.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.space.xl,
    paddingRight: theme.space.sm,
    paddingTop: theme.space.md,
  },
  headerText: { flex: 1, gap: 2 },
  body: { paddingHorizontal: theme.space.xl, paddingTop: theme.space.lg, gap: theme.space.xxl },
  footer: { paddingHorizontal: theme.space.xl, paddingTop: theme.space.lg, gap: theme.space.sm },
}));
