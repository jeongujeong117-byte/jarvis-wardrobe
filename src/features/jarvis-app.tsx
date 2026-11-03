/**
 * App shell. State and handlers are carried over unchanged from the former
 * wardrobe-prototype.tsx — this redesign changes presentation only.
 */
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { captureItem, categories, type ClothingItem, gmailItems } from '@/data/wardrobe';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { createClothingItem, loadClothingItems } from '@/services/clothing-items';
import { Screen } from '@/ui/screen';
import { FloatingBar, tabSlots } from '@/ui/floating-bar';
import { Toast } from '@/ui/toast';

import { AuthSheet } from './account/auth-sheet';
import { AddItemSheet } from './closet/add-item-sheet';
import { ClosetScreen } from './main/closet';
import { ItemDetailScreen } from './main/item-detail';
import { MyScreen } from './main/my';
import { TodayScreen } from './main/today';
import { CaptureScreen } from './onboarding/capture';
import { ImportScreen } from './onboarding/import-method';
import { PrivacyScreen } from './onboarding/privacy';
import { ResultsScreen } from './onboarding/results';
import { ScanningScreen } from './onboarding/scanning';
import { WelcomeScreen } from './onboarding/welcome';
import type { DataStatus, FlowScreen, MainTab } from './types';

export function JarvisApp() {
  const [screen, setScreen] = useState<FlowScreen>('welcome');
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedIds, setSelectedIds] = useState(() => new Set(gmailItems.map((item) => item.id)));
  const [activeTab, setActiveTab] = useState<MainTab>('today');
  const [filter, setFilter] = useState<(typeof categories)[number]>('전체');
  const [tpo, setTpo] = useState('일상');
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [wearCount, setWearCount] = useState(0);
  const [worn, setWorn] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [issuePage, setIssuePage] = useState(0);
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

  const unwear = () => {
    setWorn(false);
    setWearCount((count) => Math.max(0, count - 1));
  };

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

  if (screen === 'welcome') return <WelcomeScreen onStart={() => setScreen('import')} />;

  if (screen === 'import') {
    return (
      <ImportScreen
        onBack={() => setScreen('welcome')}
        onCapture={() => setScreen('capture')}
        onGmail={() => setScreen('privacy')}
        onManual={() => {
          setScreen('main');
          setActiveTab('closet');
          setShowAdd(true);
        }}
      />
    );
  }

  if (screen === 'privacy') {
    return <PrivacyScreen onBack={() => setScreen('import')} onConnect={() => setScreen('scanning')} />;
  }

  if (screen === 'scanning') return <ScanningScreen />;

  if (screen === 'results') {
    return (
      <ResultsScreen
        items={gmailItems}
        onBack={() => setScreen('privacy')}
        onImport={importSelectedItems}
        onToggle={(id) => {
          const next = new Set(selectedIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          setSelectedIds(next);
        }}
        selectedIds={selectedIds}
      />
    );
  }

  if (screen === 'capture') {
    return (
      <CaptureScreen
        item={captureItem}
        onAdd={addCapturedItem}
        onBack={() => setScreen('import')}
        onPickOther={() => Alert.alert('데모 안내', '실제 이미지 선택은 다음 구현 단계에서 연결합니다.')}
      />
    );
  }

  const detailItem = detailId ? items.find((item) => item.id === detailId) : undefined;
  if (detailItem) {
    return (
      <Screen>
        <ItemDetailScreen item={detailItem} onBack={() => setDetailId(null)} />
      </Screen>
    );
  }

  return (
    <Screen bottomInset={false}>
      <View style={styles.content}>
        {activeTab === 'today' ? (
          <TodayScreen
            items={items}
            onImport={() => setScreen('import')}
            onOpenCloset={() => setActiveTab('closet')}
            onNavigate={setActiveTab}
            onOpenItem={(id) => setDetailId(id)}
            onOtherOutfit={() => {
              // Picking another outfit cancels today's "worn" record so the count never double-counts.
              if (worn) unwear();
              setOutfitIndex(outfitIndex + 1);
            }}
            onUnwear={unwear}
            page={issuePage}
            setPage={setIssuePage}
            onWear={() => {
              setWorn(true);
              setWearCount((count) => count + 1);
            }}
            outfitIndex={outfitIndex}
            setTpo={setTpo}
            tpo={tpo}
            worn={worn}
          />
        ) : null}
        {activeTab === 'closet' ? (
          <ClosetScreen
            filter={filter}
            items={items}
            onAdd={() => setShowAdd(true)}
            onImport={() => setScreen('import')}
            onOpenItem={(id) => setDetailId(id)}
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
        <Toast message={toast} />
      </View>

      {activeTab !== 'today' ? <FloatingBar groups={[tabSlots(activeTab, setActiveTab)]} /> : null}

      <AuthSheet
        onAuthenticated={() => {
          setShowAuth(false);
          setToast('Supabase 옷장을 연결했어요');
        }}
        onClose={() => setShowAuth(false)}
        visible={showAuth}
      />
      <AddItemSheet onClose={() => setShowAdd(false)} onSave={addManualItem} visible={showAdd} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
});
