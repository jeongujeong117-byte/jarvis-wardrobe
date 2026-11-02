import { Database } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Button } from '@/ui/button';
import { Chip } from '@/ui/chip';
import { Field } from '@/ui/field';
import { Icon } from '@/ui/icon';
import { Sheet } from '@/ui/sheet';
import { Text } from '@/ui/text';

type AuthMode = 'sign-in' | 'sign-up';

/** Restyled from components/auth-modal.tsx. Auth logic is unchanged. */
export function AuthSheet({
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

  if (!isSupabaseConfigured) {
    return (
      <Sheet
        caption="자비스 계정"
        footer={<Button label="확인" onPress={onClose} />}
        onClose={onClose}
        title="옷장 데이터 연결"
        visible={visible}>
        <View style={styles.setup}>
          <Icon icon={Database} size={28} />
          <Text variant="title">Supabase 프로젝트 정보가 필요해요</Text>
          <Text tone="secondary" variant="body">
            프로젝트 루트의 .env 파일에 Project URL과 Publishable key를 입력한 뒤 앱을 다시 실행해주세요.
          </Text>
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet
      caption="자비스 계정"
      footer={
        <Button
          disabled={submitting}
          label={submitting ? '처리 중...' : mode === 'sign-in' ? '로그인하기' : '가입하기'}
          onPress={submit}
        />
      }
      onClose={onClose}
      title="옷장 데이터 연결"
      visible={visible}>
      <View accessibilityRole="tablist" style={styles.modes}>
        <Chip label="로그인" onPress={() => setMode('sign-in')} selected={mode === 'sign-in'} />
        <Chip label="회원가입" onPress={() => setMode('sign-up')} selected={mode === 'sign-up'} />
      </View>

      <Field
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="이메일"
        onChangeText={setEmail}
        placeholder="name@example.com"
        value={email}
      />
      <Field
        autoCapitalize="none"
        autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
        label="비밀번호"
        onChangeText={setPassword}
        placeholder="8자 이상 입력"
        secureTextEntry
        value={password}
      />

      <Text tone="secondary" variant="caption">
        {mode === 'sign-in'
          ? '로그인하면 직접 등록한 옷이 내 계정에 저장됩니다.'
          : '가입 후 인증 메일 확인이 필요할 수 있습니다.'}
      </Text>
    </Sheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  setup: { gap: theme.space.md },
  modes: { flexDirection: 'row', gap: theme.space.sm },
}));
