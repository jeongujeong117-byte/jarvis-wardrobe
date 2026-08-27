import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthModal } from '@/components/auth-modal';
import {
  captureItem,
  categories,
  Category,
  ClothingItem,
  gmailItems,
  sourceLabels,
} from '@/data/wardrobe';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { createClothingItem, loadClothingItems } from '@/services/clothing-items';

const palette = {
  ink: '#261E2C',
  muted: '#776F7D',
  canvas: '#FBF9FE',
  surface: '#FFFFFF',
  line: '#E9E1EF',
  soft: '#F7EFFB',
  green: '#7658C7',
  greenSoft: '#F0EBFF',
  olive: '#B496C7',
  orange: '#D96D9F',
  danger: '#B45174',
};

type FlowScreen = 'welcome' | 'import' | 'privacy' | 'scanning' | 'results' | 'capture' | 'main';
type MainTab = 'today' | 'closet' | 'my';
type DataStatus = 'demo' | 'auth-needed' | 'connected';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

function PrimaryButton({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text
        style={[
          styles.buttonText,
          variant === 'primary' ? styles.buttonTextPrimary : styles.buttonTextSecondary,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function AppMark() {
  return (
    <View style={styles.appMarkRow}>
      <View style={styles.appMark}>
        <Text style={styles.appMarkIcon}>◫</Text>
      </View>
      <Text style={styles.appName}>자비스</Text>
    </View>
  );
}

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.backHeader}>
      <Pressable accessibilityLabel="뒤로 가기" onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹</Text>
      </Pressable>
      <Text style={styles.backHeaderTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function OptionCard({
  icon,
  title,
  description,
  meta,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  meta?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.optionCard, pressed && styles.pressed]}>
      <View style={styles.optionIcon}>
        <Text style={styles.optionIconText}>{icon}</Text>
      </View>
      <View style={styles.optionBody}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>{title}</Text>
          {meta ? <Text style={styles.optionMeta}>{meta}</Text> : null}
        </View>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <Text style={styles.optionArrow}>›</Text>
    </Pressable>
  );
}

function ItemTile({ item, onPress }: { item: ClothingItem; onPress?: () => void }) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.itemTile, pressed && styles.pressed]}>
      <View style={[styles.itemImage, { backgroundColor: item.colorHex }]}>
        <Text style={styles.itemEmoji}>{item.emoji}</Text>
        <View style={styles.itemSourceDot} />
      </View>
      <Text numberOfLines={1} style={styles.itemCategory}>
        {item.category} · {item.color}
      </Text>
      <Text numberOfLines={2} style={styles.itemName}>
        {item.name}
      </Text>
    </Pressable>
  );
}

export function WardrobePrototype() {
  const [screen, setScreen] = useState<FlowScreen>('welcome');
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedIds, setSelectedIds] = useState(() => new Set(gmailItems.map((item) => item.id)));
  const [activeTab, setActiveTab] = useState<MainTab>('today');
  const [filter, setFilter] = useState<(typeof categories)[number]>('전체');
  const [tpo, setTpo] = useState('일상');
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [wearCount, setWearCount] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [dataStatus, setDataStatus] = useState<DataStatus>(
    isSupabaseConfigured ? 'auth-needed' : 'demo',
  );

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const applySession = (id: string | null) => {
      if (!active) return;
      setUserId(id);
      setDataStatus(id ? 'connected' : 'auth-needed');
    };

    supabase.auth.getSession().then(({ data }) => applySession(data.session?.user.id ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user.id ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    loadClothingItems(userId)
      .then((storedItems) => {
        setItems(storedItems);
      })
      .catch(() => setToast('저장된 옷장을 불러오지 못했어요'));
  }, [userId]);

  useEffect(() => {
    if (screen !== 'scanning') return;
    const timer = setTimeout(() => setScreen('results'), 1700);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const importSelectedItems = () => {
    const imported = gmailItems.filter((item) => selectedIds.has(item.id));
    setItems((current) => [...current.filter((item) => item.source !== 'gmail'), ...imported]);
    setActiveTab('today');
    setScreen('main');
    setToast(`${imported.length}벌을 옷장에 담았어요`);
  };

  const addCapturedItem = () => {
    setItems((current) =>
      current.some((item) => item.id === captureItem.id) ? current : [...current, captureItem],
    );
    setActiveTab('closet');
    setScreen('main');
    setToast('캡처에서 찾은 옷을 담았어요');
  };

  const addManualItem = async (item: ClothingItem) => {
    try {
      const storedItem = userId ? await createClothingItem(userId, item) : item;
      setItems((current) => [storedItem, ...current]);
      setShowAdd(false);
      setActiveTab('closet');
      setToast(userId ? 'Supabase에 새 옷을 저장했어요' : '새 옷을 데모로 등록했어요');
    } catch {
      Alert.alert('저장하지 못했어요', '네트워크와 Supabase 설정을 확인한 뒤 다시 시도해주세요.');
      throw new Error('Failed to save clothing item');
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('로그아웃하지 못했어요', error.message);
      return;
    }
    setItems([]);
    setToast('로그아웃했어요');
  };

  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.centeredPage}>
          <View style={styles.welcomeTop}>
            <AppMark />
            <View style={styles.prototypeBadge}>
              <Text style={styles.prototypeBadgeText}>FUNCTION PROTOTYPE</Text>
            </View>
          </View>

          <View style={styles.wardrobeVisual}>
            <View style={styles.wardrobeRail} />
            <View style={styles.hangerRow}>
              <View style={[styles.hangingItem, { backgroundColor: '#F8DDEB' }]}>
                <Text style={styles.hangingEmoji}>👔</Text>
              </View>
              <View style={[styles.hangingItem, styles.hangingItemTall, { backgroundColor: '#E7DDF8' }]}>
                <Text style={styles.hangingEmoji}>🧥</Text>
              </View>
              <View style={[styles.hangingItem, { backgroundColor: '#DDD9F8' }]}>
                <Text style={styles.hangingEmoji}>👕</Text>
              </View>
            </View>
            <View style={styles.visualShelf}>
              <Text style={styles.visualShoe}>👟</Text>
              <Text style={styles.visualShoe}>👞</Text>
            </View>
          </View>

          <View style={styles.welcomeCopy}>
            <Text style={styles.eyebrow}>산 옷은 자동으로</Text>
            <Text style={styles.displayTitle}>쌓이고, 오늘 입을 옷은{`\n`}바로 골라드려요.</Text>
            <Text style={styles.bodyCopy}>
              주문메일에서 내 옷장을 만들고{`\n`}날씨와 일정에 맞는 코디를 추천받으세요.
            </Text>
          </View>

          <View style={styles.bottomActions}>
            <PrimaryButton label="내 옷장 시작하기" onPress={() => setScreen('import')} />
            <Text style={styles.helperText}>현재 화면은 핵심 기능 검증용 프로토타입입니다.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'import') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.page}>
          <BackHeader title="옷 가져오기" onBack={() => setScreen('welcome')} />
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepLabel}>STEP 1</Text>
            <Text style={styles.pageTitle}>내 옷장을{`\n`}어떻게 채울까요?</Text>
            <Text style={styles.pageDescription}>가장 편한 방법을 선택하세요. 나중에 추가할 수도 있어요.</Text>

            <View style={styles.optionList}>
              <OptionCard
                icon="G"
                title="Gmail 연결하기"
                description="무신사 주문메일을 찾아 자동으로 가져와요."
                meta="추천"
                onPress={() => setScreen('privacy')}
              />
              <OptionCard
                icon="▧"
                title="주문내역 캡처하기"
                description="주문 화면을 캡처해서 빠르게 등록해요."
                onPress={() => setScreen('capture')}
              />
              <OptionCard
                icon="＋"
                title="직접 등록하기"
                description="상품명과 카테고리만 간단히 입력해요."
                onPress={() => {
                  setScreen('main');
                  setActiveTab('closet');
                  setShowAdd(true);
                }}
              />
            </View>

            <View style={styles.infoStrip}>
              <Text style={styles.infoStripIcon}>⌁</Text>
              <Text style={styles.infoStripText}>Gmail 연결을 건너뛰어도 앱의 모든 기능을 이용할 수 있어요.</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'privacy') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.page}>
          <BackHeader title="Gmail 연결" onBack={() => setScreen('import')} />
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            <View style={styles.gmailHero}>
              <View style={styles.gmailIcon}>
                <Text style={styles.gmailIconText}>G</Text>
              </View>
              <View style={styles.connectionLine} />
              <View style={styles.closetIcon}>
                <Text style={styles.closetIconText}>◫</Text>
              </View>
            </View>
            <Text style={styles.pageTitle}>주문메일만 골라서{`\n`}옷장으로 가져올게요.</Text>
            <Text style={styles.pageDescription}>
              로그인과 메일 연결은 별도예요. 연결하기 전에 어떤 정보를 사용하는지 확인하세요.
            </Text>

            <View style={styles.privacyList}>
              {[
                ['✓', '무신사 주문·취소 메일만 검색해요.'],
                ['✓', '상품명, 옵션, 이미지 정보만 저장해요.'],
                ['✓', '메일 원문은 처리 후 바로 폐기해요.'],
                ['✓', '마이 페이지에서 언제든 연결을 끊을 수 있어요.'],
              ].map(([icon, text]) => (
                <View key={text} style={styles.privacyRow}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>{icon}</Text>
                  </View>
                  <Text style={styles.privacyText}>{text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeTitle}>이번 제출 버전에서는</Text>
              <Text style={styles.demoNoticeBody}>
                실제 Gmail 권한 대신 샘플 주문메일로 연결 흐름을 시연합니다.
              </Text>
            </View>
          </ScrollView>
          <View style={styles.fixedAction}>
            <PrimaryButton label="Gmail 연결 데모 시작" onPress={() => setScreen('scanning')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'scanning') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.scanningPage}>
          <ActivityIndicator color={palette.green} size="large" />
          <Text style={styles.scanningTitle}>주문메일을 찾고 있어요</Text>
          <Text style={styles.scanningDescription}>최근 1년의 무신사 주문·취소 메일만 확인합니다.</Text>
          <View style={styles.scanProgress}>
            <View style={styles.scanProgressFill} />
          </View>
          <View style={styles.scanSteps}>
            <Text style={styles.scanStepDone}>✓ Gmail 연결 확인</Text>
            <Text style={styles.scanStepDone}>✓ 무신사 메일 필터링</Text>
            <Text style={styles.scanStepCurrent}>• 상품 정보 정리 중</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'results') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.page}>
          <BackHeader title="가져오기 결과" onBack={() => setScreen('privacy')} />
          <ScrollView contentContainerStyle={styles.resultsBody} showsVerticalScrollIndicator={false}>
            <View style={styles.resultSummary}>
              <View>
                <Text style={styles.resultKicker}>최근 1년 주문에서</Text>
                <Text style={styles.resultCount}>옷 6개를 찾았어요.</Text>
              </View>
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>1건 취소 제외</Text>
              </View>
            </View>
            <Text style={styles.resultGuide}>가져오지 않을 상품은 선택을 해제하세요.</Text>

            <View style={styles.resultList}>
              {gmailItems.map((item) => {
                const selected = selectedIds.has(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      const next = new Set(selectedIds);
                      if (selected) next.delete(item.id);
                      else next.add(item.id);
                      setSelectedIds(next);
                    }}
                    style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]}>
                    <View style={[styles.resultThumb, { backgroundColor: item.colorHex }]}>
                      <Text style={styles.resultEmoji}>{item.emoji}</Text>
                    </View>
                    <View style={styles.resultText}>
                      <Text numberOfLines={1} style={styles.resultName}>
                        {item.name}
                      </Text>
                      <Text style={styles.resultDetail}>{item.detail}</Text>
                    </View>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      <Text style={styles.checkboxText}>{selected ? '✓' : ''}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
          <View style={styles.fixedAction}>
            <PrimaryButton
              disabled={selectedIds.size === 0}
              label={`${selectedIds.size}벌 옷장에 담기`}
              onPress={importSelectedItems}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'capture') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.page}>
          <BackHeader title="캡처로 가져오기" onBack={() => setScreen('import')} />
          <ScrollView contentContainerStyle={styles.captureBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>주문내역을 캡처하면{`\n`}옷을 찾아드려요.</Text>
            <Text style={styles.pageDescription}>상품명과 옵션이 보이도록 주문 화면을 캡처해주세요.</Text>

            <View style={styles.capturePreview}>
              <View style={styles.fakeScreenshotHeader}>
                <View style={styles.fakeDot} />
                <View style={styles.fakeLineShort} />
              </View>
              <View style={styles.fakeOrderCard}>
                <View style={[styles.fakeProductImage, { backgroundColor: captureItem.colorHex }]}>
                  <Text style={styles.captureEmoji}>{captureItem.emoji}</Text>
                </View>
                <View style={styles.fakeProductText}>
                  <View style={styles.fakeLine} />
                  <View style={styles.fakeLineMedium} />
                  <View style={styles.fakeLineTiny} />
                </View>
              </View>
              <View style={styles.captureScanBox}>
                <Text style={styles.captureScanText}>상품 영역 자동 인식</Text>
              </View>
            </View>

            <View style={styles.detectedCard}>
              <Text style={styles.detectedLabel}>DEMO RESULT</Text>
              <Text style={styles.detectedTitle}>{captureItem.name}</Text>
              <Text style={styles.detectedDetail}>{captureItem.detail}</Text>
            </View>
          </ScrollView>
          <View style={styles.fixedAction}>
            <PrimaryButton label="이 상품 옷장에 담기" onPress={addCapturedItem} />
            <PrimaryButton label="다른 캡처 선택" variant="ghost" onPress={() => Alert.alert('데모 안내', '실제 이미지 선택은 다음 구현 단계에서 연결합니다.')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
      <View style={styles.mainShell}>
        <View style={styles.mainContent}>
          {activeTab === 'today' ? (
            <TodayScreen
              items={items}
              outfitIndex={outfitIndex}
              setOutfitIndex={setOutfitIndex}
              setActiveTab={setActiveTab}
              setScreen={setScreen}
              tpo={tpo}
              setTpo={setTpo}
              wearCount={wearCount}
              onWear={() => {
                setWearCount((count) => count + 1);
                setToast('오늘의 코디로 기록했어요');
              }}
            />
          ) : null}
          {activeTab === 'closet' ? (
            <ClosetScreen
              filter={filter}
              items={items}
              onAdd={() => setShowAdd(true)}
              onImport={() => setScreen('import')}
              setFilter={setFilter}
            />
          ) : null}
          {activeTab === 'my' ? (
            <MyScreen
              dataStatus={dataStatus}
              itemCount={items.length}
              onAuthPress={() => setShowAuth(true)}
              onSignOut={signOut}
              wearCount={wearCount}
            />
          ) : null}
        </View>

        {toast ? (
          <View style={styles.toast}>
            <Text style={styles.toastText}>✓ {toast}</Text>
          </View>
        ) : null}

        <View style={styles.tabBar}>
          <TabButton active={activeTab === 'today'} icon="☀" label="오늘" onPress={() => setActiveTab('today')} />
          <TabButton active={activeTab === 'closet'} icon="▦" label="옷장" onPress={() => setActiveTab('closet')} />
          <TabButton active={activeTab === 'my'} icon="●" label="마이" onPress={() => setActiveTab('my')} />
        </View>
      </View>
      <AuthModal
        onAuthenticated={() => {
          setShowAuth(false);
          setToast('Supabase 옷장을 연결했어요');
        }}
        onClose={() => setShowAuth(false)}
        visible={showAuth}
      />
      <AddItemModal onClose={() => setShowAdd(false)} onSave={addManualItem} visible={showAdd} />
    </SafeAreaView>
  );
}

function TodayScreen({
  items,
  outfitIndex,
  setOutfitIndex,
  setActiveTab,
  setScreen,
  tpo,
  setTpo,
  wearCount,
  onWear,
}: {
  items: ClothingItem[];
  outfitIndex: number;
  setOutfitIndex: (value: number) => void;
  setActiveTab: (tab: MainTab) => void;
  setScreen: (screen: FlowScreen) => void;
  tpo: string;
  setTpo: (value: string) => void;
  wearCount: number;
  onWear: () => void;
}) {
  const tops = items.filter((item) => item.category === '상의');
  const bottoms = items.filter((item) => item.category === '하의');
  const outer = items.find((item) => item.category === '아우터');
  const ready = tops.length > 0 && bottoms.length > 0;
  const top = ready ? tops[outfitIndex % tops.length] : undefined;
  const bottom = ready ? bottoms[(outfitIndex + 1) % bottoms.length] : undefined;

  return (
    <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.mainHeader}>
        <AppMark />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
      </View>

      <View style={styles.weatherRow}>
        <View>
          <Text style={styles.dateText}>8월 27일 · 목요일</Text>
          <Text style={styles.greeting}>오늘 뭐 입지?</Text>
        </View>
        <View style={styles.weatherBadge}>
          <Text style={styles.weatherIcon}>☀</Text>
          <View>
            <Text style={styles.weatherTemp}>24°</Text>
            <Text style={styles.weatherSub}>서울</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionCaption}>오늘의 일정</Text>
      <View style={styles.chipRow}>
        {['일상', '출근', '약속', '운동'].map((value) => (
          <Pressable
            key={value}
            onPress={() => setTpo(value)}
            style={[styles.chip, tpo === value && styles.chipActive]}>
            <Text style={[styles.chipText, tpo === value && styles.chipTextActive]}>{value}</Text>
          </Pressable>
        ))}
      </View>

      {ready && top && bottom ? (
        <View style={styles.outfitCard}>
          <View style={styles.outfitTopRow}>
            <View>
              <Text style={styles.outfitKicker}>오늘의 추천 1/3</Text>
              <Text style={styles.outfitTitle}>{tpo}에 잘 맞는 편안한 조합</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>날씨 적합</Text>
            </View>
          </View>

          <View style={styles.outfitItems}>
            <View style={[styles.outfitItem, { backgroundColor: top.colorHex }]}>
              <Text style={styles.outfitEmoji}>{top.emoji}</Text>
              <View style={styles.outfitLabel}>
                <Text numberOfLines={1} style={styles.outfitLabelText}>{top.name}</Text>
              </View>
            </View>
            <Text style={styles.plusText}>＋</Text>
            <View style={[styles.outfitItem, { backgroundColor: bottom.colorHex }]}>
              <Text style={styles.outfitEmoji}>{bottom.emoji}</Text>
              <View style={styles.outfitLabel}>
                <Text numberOfLines={1} style={styles.outfitLabelText}>{bottom.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.reasonBox}>
            <Text style={styles.reasonIcon}>✦</Text>
            <Text style={styles.reasonText}>
              낮에는 가볍고, 저녁 일교차에는 {outer ? `${outer.name}을 더하기` : '얇은 아우터 더하기'} 좋은 조합이에요.
            </Text>
          </View>

          <View style={styles.outfitActions}>
            <Pressable onPress={() => setOutfitIndex(outfitIndex + 1)} style={styles.rerollButton}>
              <Text style={styles.rerollText}>↻ 다른 코디</Text>
            </Pressable>
            <Pressable onPress={onWear} style={styles.wearButton}>
              <Text style={styles.wearButtonText}>이 코디 입기</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.emptyRecommendation}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>◫</Text>
          </View>
          <Text style={styles.emptyTitle}>첫 코디를 만들 옷이 부족해요</Text>
          <Text style={styles.emptyText}>상의와 하의를 한 벌씩 추가하면 바로 추천해드릴게요.</Text>
          <PrimaryButton label="옷 가져오기" onPress={() => setScreen('import')} />
          <PrimaryButton label="옷장 보기" variant="ghost" onPress={() => setActiveTab('closet')} />
        </View>
      )}

      {wearCount > 0 ? (
        <View style={styles.weeklyCard}>
          <View>
            <Text style={styles.weeklyLabel}>이번 주 착용 기록</Text>
            <Text style={styles.weeklyValue}>{wearCount}회</Text>
          </View>
          <View style={styles.weekDots}>
            {['월', '화', '수', '목', '금'].map((day, index) => (
              <View key={day} style={styles.dayColumn}>
                <View style={[styles.dayDot, index < wearCount && styles.dayDotActive]} />
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

function ClosetScreen({
  items,
  filter,
  setFilter,
  onAdd,
  onImport,
}: {
  items: ClothingItem[];
  filter: (typeof categories)[number];
  setFilter: (value: (typeof categories)[number]) => void;
  onAdd: () => void;
  onImport: () => void;
}) {
  const filteredItems = useMemo(
    () => (filter === '전체' ? items : items.filter((item) => item.category === filter)),
    [filter, items],
  );

  return (
    <View style={styles.closetPage}>
      <View style={styles.closetHeader}>
        <View>
          <Text style={styles.closetKicker}>MY ARCHIVE</Text>
          <Text style={styles.closetTitle}>내 옷장 <Text style={styles.closetCount}>{items.length}</Text></Text>
        </View>
        <Pressable onPress={onAdd} style={styles.addCircle}>
          <Text style={styles.addCircleText}>＋</Text>
        </Pressable>
      </View>

      <View style={styles.filterScrollWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setFilter(category)}
              style={[styles.filterChip, filter === category && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, filter === category && styles.filterChipTextActive]}>{category}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.closetScroll} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyCloset}>
            <View style={styles.emptyClosetVisual}>
              <Text style={styles.emptyClosetEmoji}>👕</Text>
            </View>
            <Text style={styles.emptyTitle}>아직 옷장이 비어 있어요</Text>
            <Text style={styles.emptyText}>Gmail 주문메일이나 주문 캡처에서 옷을 가져와보세요.</Text>
            <PrimaryButton label="옷 가져오기" onPress={onImport} />
            <PrimaryButton label="직접 등록하기" variant="ghost" onPress={onAdd} />
          </View>
        ) : (
          <>
            <View style={styles.syncBanner}>
              <View style={styles.syncIcon}>
                <Text style={styles.syncIconText}>G</Text>
              </View>
              <View style={styles.syncTextWrap}>
                <Text style={styles.syncTitle}>Gmail 주문메일 연결됨</Text>
                <Text style={styles.syncText}>새 주문을 자동으로 확인하는 데모 상태예요.</Text>
              </View>
              <View style={styles.liveDot} />
            </View>
            <View style={styles.itemGrid}>
              {filteredItems.map((item) => (
                <ItemTile
                  item={item}
                  key={item.id}
                  onPress={() =>
                    Alert.alert(item.name, `${item.detail}\n${sourceLabels[item.source]}로 등록됨`)
                  }
                />
              ))}
            </View>
            {filteredItems.length === 0 ? (
              <Text style={styles.noFilterResult}>이 카테고리에는 아직 옷이 없어요.</Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function MyScreen({
  dataStatus,
  itemCount,
  onAuthPress,
  onSignOut,
  wearCount,
}: {
  dataStatus: DataStatus;
  itemCount: number;
  onAuthPress: () => void;
  onSignOut: () => void;
  wearCount: number;
}) {
  const dataStatusText = {
    demo: '환경 변수 설정 필요',
    'auth-needed': '연결됨 · 로그인 필요',
    connected: '로그인됨 · 실제 DB 사용 중',
  }[dataStatus];

  return (
    <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.mainHeader}>
        <Text style={styles.myTitle}>마이</Text>
        <View style={styles.prototypeBadge}>
          <Text style={styles.prototypeBadgeText}>PROTOTYPE</Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>J</Text>
        </View>
        <View>
          <Text style={styles.profileName}>나의 옷장</Text>
          <Text style={styles.profileMeta}>옷 {itemCount}벌 · 착용기록 {wearCount}회</Text>
        </View>
      </View>

      <Text style={styles.settingsSectionTitle}>연결</Text>
      <View style={styles.settingGroup}>
        <Pressable onPress={onAuthPress} style={styles.settingRow}>
          <View style={styles.settingIcon}><Text style={styles.settingIconText}>S</Text></View>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingTitle}>Supabase 데이터</Text>
            <Text style={styles.settingDescription}>{dataStatusText}</Text>
          </View>
          <View style={[styles.statusDot, dataStatus === 'connected' && styles.statusDotConnected]} />
        </Pressable>
        <View style={styles.settingDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingIcon}><Text style={styles.settingIconText}>G</Text></View>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingTitle}>Gmail 주문메일</Text>
            <Text style={styles.settingDescription}>{itemCount > 0 ? '연결됨 · 데모 모드' : '연결되지 않음'}</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </View>
        <View style={styles.settingDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingIcon}><Text style={styles.settingIconText}>⌖</Text></View>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingTitle}>날씨 지역</Text>
            <Text style={styles.settingDescription}>서울 · 샘플 날씨</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </View>
      </View>

      <Text style={styles.settingsSectionTitle}>데이터와 개인정보</Text>
      <View style={styles.settingGroup}>
        {[
          '메일 처리 방식 보기',
          '내 데이터 내려받기',
          dataStatus === 'connected' ? '로그아웃' : 'Gmail 연결 해제',
        ].map((label, index) => (
          <View key={label}>
            <Pressable
              onPress={() => {
                if (label === '로그아웃') {
                  onSignOut();
                  return;
                }
                Alert.alert('프로토타입', `${label} 기능은 실제 백엔드 연결 단계에서 구현합니다.`);
              }}
              style={({ pressed }) => [styles.simpleSettingRow, pressed && styles.pressed]}>
              <Text
                style={[
                  styles.simpleSettingText,
                  (label.includes('해제') || label === '로그아웃') && styles.dangerText,
                ]}>
                {label}
              </Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            {index < 2 ? <View style={styles.settingDivider} /> : null}
          </View>
        ))}
      </View>

      <View style={styles.buildNote}>
        <Text style={styles.buildNoteTitle}>현재 개발 상태</Text>
        <Text style={styles.buildNoteText}>DB 스키마 · 보안 정책 · 이메일 로그인 · 실제 저장 코드 완료</Text>
      </View>
    </ScrollView>
  );
}

function TabButton({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function AddItemModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (item: ClothingItem) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('상의');
  const [color, setColor] = useState('블랙');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('상품명을 입력해주세요');
      return;
    }
    const categoryEmoji: Record<Category, string> = {
      상의: '👕',
      하의: '👖',
      아우터: '🧥',
      신발: '👟',
    };
    const colorHex: Record<string, string> = {
      블랙: '#343634',
      화이트: '#ECEAE4',
      네이비: '#3D4961',
      베이지: '#BCA98B',
    };
    setSaving(true);
    try {
      await onSave({
        id: `manual-${Date.now()}`,
        name: name.trim(),
        category,
        color,
        colorHex: colorHex[color] ?? '#B6B0A4',
        emoji: categoryEmoji[category],
        source: 'manual',
        detail: `${color} / 직접 등록`,
      });
      setName('');
      setCategory('상의');
      setColor('블랙');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <Pressable onPress={onClose} style={styles.modalBackdrop} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalKicker}>MANUAL ADD</Text>
              <Text style={styles.modalTitle}>옷 직접 등록</Text>
            </View>
            <Pressable onPress={onClose} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderIcon}>＋</Text>
            <Text style={styles.photoPlaceholderText}>사진 추가는 다음 단계</Text>
          </View>

          <Text style={styles.formLabel}>상품명</Text>
          <TextInput
            onChangeText={setName}
            placeholder="예: 스트라이프 셔츠"
            placeholderTextColor="#9A9D98"
            style={styles.input}
            value={name}
          />

          <Text style={styles.formLabel}>카테고리</Text>
          <View style={styles.formChipRow}>
            {(['상의', '하의', '아우터', '신발'] as Category[]).map((value) => (
              <Pressable
                key={value}
                onPress={() => setCategory(value)}
                style={[styles.formChip, category === value && styles.formChipActive]}>
                <Text style={[styles.formChipText, category === value && styles.formChipTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.formLabel}>색상</Text>
          <View style={styles.formChipRow}>
            {['블랙', '화이트', '네이비', '베이지'].map((value) => (
              <Pressable
                key={value}
                onPress={() => setColor(value)}
                style={[styles.formChip, color === value && styles.formChipActive]}>
                <Text style={[styles.formChipText, color === value && styles.formChipTextActive]}>{value}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.modalAction}>
            <PrimaryButton
              disabled={saving}
              label={saving ? '저장 중...' : '옷장에 저장하기'}
              onPress={save}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.canvas,
    experimental_backgroundImage:
      'linear-gradient(145deg, #FFFFFF 0%, #FFF7FC 48%, #F2EFFF 100%)',
  },
  page: { flex: 1, width: '100%', maxWidth: 540, alignSelf: 'center' },
  centeredPage: {
    flex: 1,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingBottom: 14,
  },
  pressed: { opacity: 0.72 },
  welcomeTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 },
  appMarkRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  appMark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: palette.green,
    experimental_backgroundImage: 'linear-gradient(145deg, #E989B6, #7658C7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appMarkIcon: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  appName: { color: palette.ink, fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  prototypeBadge: { backgroundColor: palette.greenSoft, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20 },
  prototypeBadgeText: { color: palette.green, fontSize: 9, fontWeight: '800', letterSpacing: 0.7 },
  wardrobeVisual: {
    height: 230,
    marginTop: 28,
    borderRadius: 28,
    backgroundColor: '#F8F1FA',
    experimental_backgroundImage:
      'linear-gradient(145deg, #FFF9FC 0%, #F9EAF3 52%, #EAE5FF 100%)',
    borderWidth: 1,
    borderColor: '#EADDEA',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  wardrobeRail: { height: 5, borderRadius: 5, backgroundColor: '#967EAA', marginHorizontal: 8 },
  hangerRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 8, paddingTop: 14 },
  hangingItem: { width: 76, height: 105, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hangingItemTall: { height: 126 },
  hangingEmoji: { fontSize: 44 },
  visualShelf: { height: 43, borderTopWidth: 1, borderColor: '#E3D5E7', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10, paddingRight: 12 },
  visualShoe: { fontSize: 24 },
  welcomeCopy: { paddingTop: 28 },
  eyebrow: { color: palette.orange, fontSize: 13, fontWeight: '800', marginBottom: 9 },
  displayTitle: { color: palette.ink, fontSize: 31, lineHeight: 40, fontWeight: '800', letterSpacing: -1.25 },
  bodyCopy: { color: palette.muted, fontSize: 15, lineHeight: 23, marginTop: 14 },
  bottomActions: { marginTop: 'auto', gap: 8 },
  helperText: { color: palette.muted, textAlign: 'center', fontSize: 11, lineHeight: 16 },
  button: { minHeight: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  buttonPrimary: {
    backgroundColor: palette.green,
    experimental_backgroundImage: 'linear-gradient(100deg, #D96D9F, #7658C7)',
  },
  buttonSecondary: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonDisabled: { opacity: 0.38 },
  buttonText: { fontSize: 15, fontWeight: '800' },
  buttonTextPrimary: { color: '#FFFFFF' },
  buttonTextSecondary: { color: palette.ink },
  backHeader: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: palette.ink, fontSize: 36, lineHeight: 38, fontWeight: '300' },
  backHeaderTitle: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  headerSpacer: { width: 42 },
  scrollBody: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32 },
  stepLabel: { color: palette.orange, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginBottom: 10 },
  pageTitle: { color: palette.ink, fontSize: 29, lineHeight: 38, fontWeight: '800', letterSpacing: -1 },
  pageDescription: { color: palette.muted, fontSize: 14, lineHeight: 22, marginTop: 12 },
  optionList: { gap: 12, marginTop: 32 },
  optionCard: { minHeight: 96, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 16 },
  optionIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: palette.soft, alignItems: 'center', justifyContent: 'center' },
  optionIconText: { color: palette.green, fontSize: 19, fontWeight: '900' },
  optionBody: { flex: 1, marginLeft: 14 },
  optionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionTitle: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  optionMeta: { color: palette.green, backgroundColor: palette.greenSoft, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, fontSize: 10, fontWeight: '800' },
  optionDescription: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  optionArrow: { color: '#9A9C96', fontSize: 28, fontWeight: '300', marginLeft: 4 },
  infoStrip: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 24, backgroundColor: '#F8F1FB', padding: 14, borderRadius: 14 },
  infoStripIcon: { color: palette.green, fontSize: 16, fontWeight: '800' },
  infoStripText: { flex: 1, color: palette.muted, fontSize: 12, lineHeight: 18 },
  gmailHero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 34 },
  gmailIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' },
  gmailIconText: { color: '#CC4F45', fontSize: 28, fontWeight: '900' },
  connectionLine: { width: 52, height: 2, backgroundColor: '#DDCDE6' },
  closetIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },
  closetIconText: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  privacyList: { backgroundColor: palette.surface, borderRadius: 20, borderWidth: 1, borderColor: palette.line, padding: 18, gap: 17, marginTop: 28 },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: palette.green, fontSize: 12, fontWeight: '900' },
  privacyText: { flex: 1, color: palette.ink, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  demoNotice: { backgroundColor: '#FFF0F7', borderRadius: 16, padding: 16, marginTop: 18 },
  demoNoticeTitle: { color: palette.orange, fontSize: 11, fontWeight: '900', marginBottom: 5 },
  demoNoticeBody: { color: palette.ink, fontSize: 12, lineHeight: 18 },
  fixedAction: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14, gap: 2, borderTopWidth: 1, borderColor: palette.line, backgroundColor: '#FCFAFF' },
  scanningPage: { flex: 1, width: '100%', maxWidth: 540, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 38 },
  scanningTitle: { color: palette.ink, fontSize: 24, fontWeight: '800', marginTop: 22 },
  scanningDescription: { color: palette.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 9 },
  scanProgress: { width: '100%', height: 8, borderRadius: 8, backgroundColor: '#EEE6F3', overflow: 'hidden', marginTop: 34 },
  scanProgressFill: { width: '78%', height: '100%', backgroundColor: palette.green, borderRadius: 8 },
  scanSteps: { width: '100%', marginTop: 24, gap: 11 },
  scanStepDone: { color: palette.muted, fontSize: 13 },
  scanStepCurrent: { color: palette.green, fontSize: 13, fontWeight: '800' },
  resultsBody: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 },
  resultSummary: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  resultKicker: { color: palette.muted, fontSize: 13, marginBottom: 5 },
  resultCount: { color: palette.ink, fontSize: 25, fontWeight: '800', letterSpacing: -0.7 },
  resultBadge: { backgroundColor: '#FCEAF2', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 7 },
  resultBadgeText: { color: palette.danger, fontSize: 10, fontWeight: '800' },
  resultGuide: { color: palette.muted, fontSize: 12, marginTop: 12 },
  resultList: { gap: 10, marginTop: 24 },
  resultRow: { minHeight: 78, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 16, borderWidth: 1, borderColor: palette.line, padding: 11 },
  resultThumb: { width: 54, height: 54, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  resultEmoji: { fontSize: 28 },
  resultText: { flex: 1, marginLeft: 12 },
  resultName: { color: palette.ink, fontSize: 14, fontWeight: '800' },
  resultDetail: { color: palette.muted, fontSize: 11, marginTop: 5 },
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: '#CBBFD2', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: palette.green, borderColor: palette.green },
  checkboxText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  captureBody: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28 },
  capturePreview: { height: 310, borderRadius: 24, backgroundColor: '#F8F1FA', borderWidth: 1, borderColor: '#E7DAEC', marginTop: 28, padding: 22, overflow: 'hidden' },
  fakeScreenshotHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 22 },
  fakeDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#C3BEB2' },
  fakeLineShort: { width: 84, height: 9, borderRadius: 8, backgroundColor: '#CAC5BA' },
  fakeOrderCard: { flexDirection: 'row', padding: 14, borderRadius: 18, backgroundColor: palette.surface },
  fakeProductImage: { width: 92, height: 112, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  captureEmoji: { fontSize: 46 },
  fakeProductText: { flex: 1, paddingLeft: 14, paddingTop: 8, gap: 12 },
  fakeLine: { width: '90%', height: 12, borderRadius: 8, backgroundColor: '#D8D5CD' },
  fakeLineMedium: { width: '70%', height: 9, borderRadius: 8, backgroundColor: '#E2DFD8' },
  fakeLineTiny: { width: '45%', height: 9, borderRadius: 8, backgroundColor: '#E2DFD8' },
  captureScanBox: { position: 'absolute', left: 16, right: 16, top: 67, height: 160, borderWidth: 2, borderColor: palette.orange, borderRadius: 20, alignItems: 'center', justifyContent: 'flex-end' },
  captureScanText: { color: '#FFFFFF', backgroundColor: palette.orange, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, fontSize: 10, fontWeight: '800', transform: [{ translateY: 13 }] },
  detectedCard: { backgroundColor: palette.green, borderRadius: 18, padding: 18, marginTop: 18 },
  detectedLabel: { color: '#BFD0C4', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  detectedTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', marginTop: 8 },
  detectedDetail: { color: '#D9E3DC', fontSize: 12, marginTop: 5 },
  mainShell: {
    flex: 1,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    backgroundColor: palette.canvas,
    experimental_backgroundImage:
      'linear-gradient(160deg, #FFFFFF 0%, #FFF8FC 50%, #F5F1FF 100%)',
  },
  mainContent: { flex: 1 },
  mainScroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30 },
  mainHeader: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F0E6F7', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  weatherRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 28 },
  dateText: { color: palette.muted, fontSize: 12, marginBottom: 7 },
  greeting: { color: palette.ink, fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  weatherBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.surface, borderRadius: 16, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 12, paddingVertical: 9 },
  weatherIcon: { color: palette.orange, fontSize: 22 },
  weatherTemp: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  weatherSub: { color: palette.muted, fontSize: 9, marginTop: 1 },
  sectionCaption: { color: palette.ink, fontSize: 13, fontWeight: '800', marginTop: 28, marginBottom: 11 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface, paddingHorizontal: 16, paddingVertical: 10 },
  chipActive: { backgroundColor: palette.green, borderColor: palette.green },
  chipText: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },
  outfitCard: { backgroundColor: palette.surface, borderRadius: 24, borderWidth: 1, borderColor: palette.line, padding: 18, marginTop: 18 },
  outfitTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  outfitKicker: { color: palette.orange, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  outfitTitle: { color: palette.ink, fontSize: 16, fontWeight: '800', marginTop: 6 },
  matchBadge: { backgroundColor: palette.greenSoft, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6 },
  matchBadgeText: { color: palette.green, fontSize: 9, fontWeight: '800' },
  outfitItems: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  outfitItem: { width: '43%', aspectRatio: 0.88, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  outfitEmoji: { fontSize: 55 },
  outfitLabel: { position: 'absolute', left: 8, right: 8, bottom: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.88)', paddingHorizontal: 8, paddingVertical: 6 },
  outfitLabelText: { color: palette.ink, fontSize: 9, fontWeight: '800' },
  plusText: { color: palette.muted, fontSize: 20, marginHorizontal: 6 },
  reasonBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: '#FBF4FC', borderRadius: 14, padding: 13, marginTop: 16 },
  reasonIcon: { color: palette.orange, fontSize: 14 },
  reasonText: { flex: 1, color: palette.muted, fontSize: 11, lineHeight: 17 },
  outfitActions: { flexDirection: 'row', gap: 9, marginTop: 14 },
  rerollButton: { flex: 1, minHeight: 46, borderRadius: 14, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' },
  rerollText: { color: palette.ink, fontSize: 12, fontWeight: '800' },
  wearButton: { flex: 1.35, minHeight: 46, borderRadius: 14, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },
  wearButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  emptyRecommendation: { backgroundColor: palette.surface, borderRadius: 22, borderWidth: 1, borderColor: palette.line, padding: 22, alignItems: 'center', marginTop: 18 },
  emptyIcon: { width: 62, height: 62, borderRadius: 20, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyIconText: { color: palette.green, fontSize: 28, fontWeight: '800' },
  emptyTitle: { color: palette.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: palette.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8, marginBottom: 18 },
  weeklyCard: { backgroundColor: palette.surface, borderRadius: 20, borderWidth: 1, borderColor: palette.line, padding: 17, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weeklyLabel: { color: palette.muted, fontSize: 10 },
  weeklyValue: { color: palette.ink, fontSize: 21, fontWeight: '800', marginTop: 4 },
  weekDots: { flexDirection: 'row', gap: 10 },
  dayColumn: { alignItems: 'center', gap: 5 },
  dayDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EAE1EF' },
  dayDotActive: { backgroundColor: palette.orange },
  dayLabel: { color: palette.muted, fontSize: 8 },
  tabBar: { minHeight: 70, flexDirection: 'row', backgroundColor: palette.surface, borderTopWidth: 1, borderColor: palette.line, paddingTop: 7, paddingBottom: Platform.OS === 'ios' ? 16 : 8 },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon: { color: '#A99EAE', fontSize: 19, fontWeight: '700' },
  tabIconActive: { color: palette.green },
  tabLabel: { color: '#9A909F', fontSize: 10, fontWeight: '700' },
  tabLabelActive: { color: palette.green },
  toast: { position: 'absolute', left: 42, right: 42, bottom: 82, borderRadius: 14, backgroundColor: palette.ink, paddingHorizontal: 16, paddingVertical: 13, alignItems: 'center', zIndex: 20 },
  toastText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  closetPage: { flex: 1 },
  closetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18 },
  closetKicker: { color: palette.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  closetTitle: { color: palette.ink, fontSize: 27, fontWeight: '800', marginTop: 5 },
  closetCount: { color: palette.muted, fontSize: 17 },
  addCircle: { width: 44, height: 44, borderRadius: 15, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },
  addCircleText: { color: '#FFFFFF', fontSize: 25, fontWeight: '400' },
  filterScrollWrap: { borderBottomWidth: 1, borderColor: palette.line },
  filterScroll: { paddingHorizontal: 20, paddingBottom: 13, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line },
  filterChipActive: { backgroundColor: palette.ink, borderColor: palette.ink },
  filterChipText: { color: palette.muted, fontSize: 11, fontWeight: '700' },
  filterChipTextActive: { color: '#FFFFFF' },
  closetScroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  syncBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.greenSoft, borderRadius: 16, padding: 13, marginBottom: 16 },
  syncIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  syncIconText: { color: '#CC4F45', fontSize: 14, fontWeight: '900' },
  syncTextWrap: { flex: 1, marginLeft: 10 },
  syncTitle: { color: palette.green, fontSize: 11, fontWeight: '800' },
  syncText: { color: '#766687', fontSize: 9, marginTop: 3 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#A276D0' },
  statusDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#D0C7D5' },
  statusDotConnected: { backgroundColor: '#8C63CD' },
  itemGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 20 },
  itemTile: { width: '48%' },
  itemImage: { width: '100%', aspectRatio: 0.9, borderRadius: 19, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemEmoji: { fontSize: 55 },
  itemSourceDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: palette.green, borderWidth: 2, borderColor: '#FFFFFF' },
  itemCategory: { color: palette.muted, fontSize: 9, marginTop: 8 },
  itemName: { color: palette.ink, fontSize: 12, lineHeight: 17, fontWeight: '800', marginTop: 3 },
  emptyCloset: { alignItems: 'center', paddingTop: 46 },
  emptyClosetVisual: { width: 120, height: 120, borderRadius: 35, backgroundColor: '#F2EAF7', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  emptyClosetEmoji: { fontSize: 54 },
  noFilterResult: { color: palette.muted, textAlign: 'center', fontSize: 12, paddingVertical: 40 },
  myTitle: { color: palette.ink, fontSize: 28, fontWeight: '800' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: palette.green, experimental_backgroundImage: 'linear-gradient(100deg, #C86FA4, #7658C7)', borderRadius: 22, padding: 18, marginTop: 22 },
  profileAvatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#F2E9FF', alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { color: palette.green, fontSize: 19, fontWeight: '900' },
  profileName: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  profileMeta: { color: '#EEE5F7', fontSize: 11, marginTop: 5 },
  settingsSectionTitle: { color: palette.muted, fontSize: 11, fontWeight: '800', marginTop: 26, marginBottom: 9, marginLeft: 3 },
  settingGroup: { backgroundColor: palette.surface, borderRadius: 20, borderWidth: 1, borderColor: palette.line, overflow: 'hidden' },
  settingRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  settingIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F5EEF8', alignItems: 'center', justifyContent: 'center' },
  settingIconText: { color: palette.green, fontSize: 14, fontWeight: '900' },
  settingTextWrap: { flex: 1, marginLeft: 12 },
  settingTitle: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  settingDescription: { color: palette.muted, fontSize: 10, marginTop: 4 },
  settingArrow: { color: '#A4A59F', fontSize: 25, fontWeight: '300' },
  settingDivider: { height: 1, backgroundColor: '#F0E8F3', marginLeft: 64 },
  simpleSettingRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  simpleSettingText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  dangerText: { color: palette.danger },
  buildNote: { backgroundColor: '#F5ECF8', borderRadius: 16, padding: 15, marginTop: 24 },
  buildNoteTitle: { color: palette.ink, fontSize: 11, fontWeight: '800' },
  buildNoteText: { color: palette.muted, fontSize: 10, lineHeight: 16, marginTop: 5 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(42,25,53,0.42)',
  },
  modalSheet: { backgroundColor: palette.canvas, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
  modalHandle: { width: 38, height: 4, borderRadius: 4, backgroundColor: '#C5B8CA', alignSelf: 'center', marginBottom: 15 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalKicker: { color: palette.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  modalTitle: { color: palette.ink, fontSize: 22, fontWeight: '800', marginTop: 4 },
  modalClose: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#F1EAF4', alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { color: palette.ink, fontSize: 25, lineHeight: 27 },
  photoPlaceholder: { height: 82, borderRadius: 17, borderWidth: 1, borderStyle: 'dashed', borderColor: '#CBBBD1', backgroundColor: '#F7F0FA', alignItems: 'center', justifyContent: 'center', marginTop: 17 },
  photoPlaceholderIcon: { color: palette.green, fontSize: 22 },
  photoPlaceholderText: { color: palette.muted, fontSize: 10, marginTop: 3 },
  formLabel: { color: palette.ink, fontSize: 11, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  input: { minHeight: 48, borderRadius: 14, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 14, color: palette.ink, fontSize: 14 },
  formChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  formChip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line },
  formChipActive: { backgroundColor: palette.green, borderColor: palette.green },
  formChipText: { color: palette.muted, fontSize: 11, fontWeight: '700' },
  formChipTextActive: { color: '#FFFFFF' },
  modalAction: { marginTop: 22 },
});
