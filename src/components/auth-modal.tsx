import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type AuthMode = 'sign-in' | 'sign-up';

export function AuthModal({
  onAuthenticated,
  onClose,
  visible,
}: {
  onAuthenticated: () => void;
  onClose: () => void;
  visible: boolean;
}) {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'success'; message: string } | null>(null);

  const submit = async () => {
    if (!supabase) return;
    if (!email.trim() || password.length < 8) {
      setFeedback({ kind: 'error', message: '이메일과 8자 이상의 비밀번호를 입력해주세요.' });
      return;
    }

    setFeedback(null);
    setSubmitting(true);
    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setPassword('');
        onAuthenticated();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { display_name: '자비스 사용자' } },
      });
      if (error) throw error;

      setPassword('');
      if (data.session) {
        onAuthenticated();
      } else {
        setFeedback({ kind: 'success', message: '이메일을 확인해주세요. 인증 링크를 누른 뒤 로그인하면 옷장이 연결됩니다.' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.';
      setFeedback({ kind: 'error', message: `${mode === 'sign-in' ? '로그인하지 못했어요' : '가입하지 못했어요'}. ${message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => { if (!submitting) onClose(); }}
      transparent
      visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <Pressable
          accessibilityLabel="계정 창 닫기"
          accessibilityRole="button"
          disabled={submitting}
          onPress={onClose}
          style={styles.backdrop}
        />
        <View accessibilityViewIsModal style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.heading}>
              <Text style={styles.kicker}>자비스 계정</Text>
              <Text accessibilityRole="header" style={styles.title}>나만의 옷장을 이어가세요</Text>
            </View>
            <Pressable
              accessibilityLabel="계정 창 닫기"
              accessibilityRole="button"
              accessibilityState={{ disabled: submitting }}
              disabled={submitting}
              onPress={onClose}
              style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          {!isSupabaseConfigured ? (
            <View style={styles.setupCard}>
              <Text style={styles.setupIcon}>J</Text>
              <Text style={styles.setupTitle}>계정 연결을 준비하고 있어요</Text>
              <Text style={styles.setupText}>
                지금은 예시 옷장으로 자비스를 둘러볼 수 있어요. 계정 저장은 연결이 준비된 뒤 이용할 수 있어요.
              </Text>
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>예시 옷장 둘러보기</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.modeRow}>
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected: mode === 'sign-in', disabled: submitting }}
                  disabled={submitting}
                  onPress={() => { setMode('sign-in'); setFeedback(null); }}
                  style={[styles.modeButton, mode === 'sign-in' && styles.modeButtonActive]}>
                  <Text style={[styles.modeText, mode === 'sign-in' && styles.modeTextActive]}>로그인</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected: mode === 'sign-up', disabled: submitting }}
                  disabled={submitting}
                  onPress={() => { setMode('sign-up'); setFeedback(null); }}
                  style={[styles.modeButton, mode === 'sign-up' && styles.modeButtonActive]}>
                  <Text style={[styles.modeText, mode === 'sign-up' && styles.modeTextActive]}>회원가입</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>이메일</Text>
              <TextInput
                accessibilityLabel="이메일"
                autoCapitalize="none"
                autoComplete="email"
                editable={!submitting}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="#72716E"
                style={styles.input}
                value={email}
              />

              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                accessibilityLabel="비밀번호, 8자 이상"
                autoCapitalize="none"
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                editable={!submitting}
                onChangeText={setPassword}
                placeholder="8자 이상 입력"
                placeholderTextColor="#72716E"
                secureTextEntry
                style={styles.input}
                value={password}
              />

              <Text style={styles.helper}>
                {mode === 'sign-in'
                  ? '로그인한 뒤 직접 등록한 옷을 내 계정에 보관해요.'
                  : '인증 메일이 도착하면 링크를 눌러 가입을 완료해주세요.'}
              </Text>

              {feedback && (
                <Text
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                  style={[styles.feedback, feedback.kind === 'success' ? styles.feedbackSuccess : styles.feedbackError]}>
                  {feedback.message}
                </Text>
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: submitting, busy: submitting }}
                disabled={submitting}
                onPress={submit}
                style={[styles.primaryButton, submitting && styles.disabled]}>
                <Text style={styles.primaryButtonText}>
                  {submitting ? '연결하고 있어요…' : mode === 'sign-in' ? '로그인하기' : '계정 만들기'}
                </Text>
              </Pressable>
            </>
          )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(37,37,37,0.38)',
  },
  sheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    alignSelf: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FAF9F6',
    overflow: 'hidden',
  },
  sheetContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 36 : 28 },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#E5E2DC',
    alignSelf: 'center',
    marginBottom: 24,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  heading: { flex: 1 },
  kicker: { color: '#6F597E', fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  title: { color: '#252525', fontSize: 24, lineHeight: 34, fontWeight: '600', letterSpacing: -0.8, marginTop: 8 },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#72716E', fontSize: 25, lineHeight: 27 },
  modeRow: { flexDirection: 'row', gap: 6, padding: 4, borderRadius: 14, backgroundColor: '#F0EDE7', marginTop: 28, marginBottom: 8 },
  modeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: { backgroundColor: '#FFFFFF' },
  modeText: { color: '#72716E', fontSize: 14, fontWeight: '500' },
  modeTextActive: { color: '#252525', fontWeight: '600' },
  label: { color: '#252525', fontSize: 13, fontWeight: '500', marginTop: 20, marginBottom: 8 },
  input: {
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2DC',
    paddingHorizontal: 16,
    color: '#252525',
    fontSize: 15,
  },
  helper: { color: '#72716E', fontSize: 13, lineHeight: 21, marginTop: 14 },
  feedback: { fontSize: 13, lineHeight: 22, marginTop: 14, padding: 14, borderRadius: 10 },
  feedbackError: { color: '#A1454F', backgroundColor: '#F7E9E9' },
  feedbackSuccess: { color: '#496454', backgroundColor: '#F0EDE7' },
  primaryButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  disabled: { opacity: 0.45 },
  setupCard: { alignItems: 'center', paddingTop: 28, paddingBottom: 4 },
  setupIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#EDE8F5',
    color: '#6F597E',
    fontSize: 23,
    lineHeight: 58,
    fontWeight: '500',
  },
  setupTitle: { color: '#252525', fontSize: 18, lineHeight: 28, textAlign: 'center', fontWeight: '600', marginTop: 18 },
  setupText: {
    color: '#72716E',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 9,
    paddingHorizontal: 10,
  },
});
