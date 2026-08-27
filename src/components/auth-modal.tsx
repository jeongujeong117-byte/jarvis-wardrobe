import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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

  const submit = async () => {
    if (!supabase) return;
    if (!email.trim() || password.length < 8) {
      Alert.alert('입력 확인', '이메일과 8자 이상의 비밀번호를 입력해주세요.');
      return;
    }

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
        Alert.alert('이메일을 확인해주세요', '인증 링크를 누른 뒤 로그인하면 옷장이 연결됩니다.');
        onClose();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.';
      Alert.alert(mode === 'sign-in' ? '로그인하지 못했어요' : '가입하지 못했어요', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <Pressable onPress={onClose} style={styles.backdrop} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>JARVIS ACCOUNT</Text>
              <Text style={styles.title}>옷장 데이터 연결</Text>
            </View>
            <Pressable accessibilityLabel="로그인 창 닫기" onPress={onClose} style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          {!isSupabaseConfigured ? (
            <View style={styles.setupCard}>
              <Text style={styles.setupIcon}>S</Text>
              <Text style={styles.setupTitle}>Supabase 프로젝트 정보가 필요해요</Text>
              <Text style={styles.setupText}>
                프로젝트 루트의 .env 파일에 Project URL과 Publishable key를 입력한 뒤 앱을 다시 실행해주세요.
              </Text>
              <Pressable onPress={onClose} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>확인</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => setMode('sign-in')}
                  style={[styles.modeButton, mode === 'sign-in' && styles.modeButtonActive]}>
                  <Text style={[styles.modeText, mode === 'sign-in' && styles.modeTextActive]}>로그인</Text>
                </Pressable>
                <Pressable
                  onPress={() => setMode('sign-up')}
                  style={[styles.modeButton, mode === 'sign-up' && styles.modeButtonActive]}>
                  <Text style={[styles.modeText, mode === 'sign-up' && styles.modeTextActive]}>회원가입</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>이메일</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="#A99EAE"
                style={styles.input}
                value={email}
              />

              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                onChangeText={setPassword}
                placeholder="8자 이상 입력"
                placeholderTextColor="#A99EAE"
                secureTextEntry
                style={styles.input}
                value={password}
              />

              <Text style={styles.helper}>
                {mode === 'sign-in'
                  ? '로그인하면 직접 등록한 옷이 내 계정에 저장됩니다.'
                  : '가입 후 인증 메일 확인이 필요할 수 있습니다.'}
              </Text>

              <Pressable
                disabled={submitting}
                onPress={submit}
                style={[styles.primaryButton, submitting && styles.disabled]}>
                <Text style={styles.primaryButtonText}>
                  {submitting ? '처리 중...' : mode === 'sign-in' ? '로그인하기' : '가입하기'}
                </Text>
              </Pressable>
            </>
          )}
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
    backgroundColor: 'rgba(42,25,53,0.42)',
  },
  sheet: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FBF9FE',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 22,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#C5B8CA',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: '#D96D9F', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  title: { color: '#261E2C', fontSize: 22, fontWeight: '800', marginTop: 4 },
  close: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#F1EAF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#261E2C', fontSize: 25, lineHeight: 27 },
  modeRow: { flexDirection: 'row', gap: 8, marginTop: 24, marginBottom: 8 },
  modeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E1EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: { backgroundColor: '#F0EBFF', borderColor: '#B9A4E3' },
  modeText: { color: '#776F7D', fontSize: 12, fontWeight: '700' },
  modeTextActive: { color: '#7658C7' },
  label: { color: '#261E2C', fontSize: 11, fontWeight: '800', marginTop: 15, marginBottom: 8 },
  input: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E1EF',
    paddingHorizontal: 14,
    color: '#261E2C',
    fontSize: 14,
  },
  helper: { color: '#776F7D', fontSize: 10, lineHeight: 16, marginTop: 12 },
  primaryButton: {
    width: '100%',
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#7658C7',
    experimental_backgroundImage: 'linear-gradient(100deg, #D96D9F, #7658C7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  disabled: { opacity: 0.45 },
  setupCard: { alignItems: 'center', paddingTop: 28, paddingBottom: 4 },
  setupIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#F0EBFF',
    color: '#7658C7',
    fontSize: 23,
    lineHeight: 58,
    fontWeight: '900',
  },
  setupTitle: { color: '#261E2C', fontSize: 17, fontWeight: '800', marginTop: 18 },
  setupText: {
    color: '#776F7D',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 9,
    paddingHorizontal: 10,
  },
});
