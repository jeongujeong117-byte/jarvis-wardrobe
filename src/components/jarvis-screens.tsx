import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { GarmentImage, Icon, JarvisMark } from '@/components/jarvis-visuals';
import { jarvisColors as c } from '@/constants/jarvis-theme';
import { categories, ClothingItem, gmailItems } from '@/data/wardrobe';

export function Action({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.action, secondary && s.secondary, disabled && s.disabled, pressed && s.pressed]}><Text style={[s.actionText, secondary && { color: c.ink }]}>{label}</Text><Icon name="arrow" size={18} color={secondary ? c.ink : c.surface} /></Pressable>;
}

function LinkAction({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={s.link}><Text style={s.linkText}>{label}</Text><Icon name="arrow" size={16} /></Pressable>;
}

export function WelcomeScreen({ onStart, onPreview }: { onStart: () => void; onPreview: () => void }) {
  const wide = useWindowDimensions().width >= 960;
  return <ScrollView contentContainerStyle={s.welcome} showsVerticalScrollIndicator={false}>
    <View style={s.welcomeNav}><JarvisMark /><Text style={s.caps}>YOUR EVERYDAY STYLIST</Text></View>
    <View style={[s.hero, wide && s.heroWide]}>
      <View style={[s.words, wide && s.flex]}>
        <View style={s.intro}><View style={s.dot} /><Text style={s.kicker}>일상을 가볍게, 나의 패션 비서</Text></View>
        <Text style={[s.heroTitle, wide && { fontSize: 53, lineHeight: 72 }]}>입을 옷 고민은,{`\n`}자비스에게.</Text>
        <Text style={s.heroBody}>옷장 속 익숙한 옷으로 새로운 하루를.{`\n`}오늘의 날씨와 약속에 어울리는 조합을{`\n`}함께 찾아드릴게요.</Text>
        <View style={s.heroActions}><Action label="내 옷장 시작하기" onPress={onStart} /><LinkAction label="샘플 옷장 둘러보기" onPress={onPreview} /></View>
        <Text style={s.disclosure}>현재는 샘플 코디로 경험하는 미리보기 버전이에요.</Text>
      </View>
      <View style={[s.editorial, wide && { width: '47%', padding: 27 }]}>
        <View style={s.rowBetween}><Text style={s.serif}>A little less to think about.</Text><Text style={s.caps}>01 / 03</Text></View>
        <View style={s.heroComposition}>
          <View style={s.heroShirt}><GarmentImage item={gmailItems[0]} /></View>
          <View style={s.heroPants}><GarmentImage item={gmailItems[3]} /></View>
          <View style={s.heroShoes}><GarmentImage item={gmailItems[5]} /></View>
        </View>
        <View style={s.heroNote}><JarvisMark small /><View style={s.flex}><Text style={s.noteTitle}>오늘은 가볍고 단정하게.</Text><Text style={s.small}>화이트 셔츠에 베이지 팬츠를 더해보세요.</Text></View></View>
        <Text style={s.artCaption}>AI 생성 의류 이미지 · 예시 코디</Text>
      </View>
    </View>
    <View style={[s.promises, wide && s.promisesWide]}>{[
      ['01', '내 옷을 한곳에', '흩어진 옷을 모아 정리하고'],
      ['02', '오늘에 맞게', '하루의 분위기를 고르면'],
      ['03', '고민은 짧게', '마음에 드는 코디로 출발해요'],
    ].map(([number, title, body]) => <View key={number} style={s.promise}><Text style={s.promiseNumber}>{number}</Text><View><Text style={s.promiseTitle}>{title}</Text><Text style={s.small}>{body}</Text></View></View>)}</View>
  </ScrollView>;
}

export function TodayScreen({ items, outfitIndex, setOutfitIndex, setActiveTab, setScreen, tpo, setTpo, wearCount, onWear }: {
  items: ClothingItem[]; outfitIndex: number; setOutfitIndex: (value: number) => void;
  setActiveTab: (value: 'today' | 'closet' | 'my') => void; setScreen: (value: 'import') => void;
  tpo: string; setTpo: (value: string) => void; wearCount: number; onWear: () => void;
}) {
  const wide = useWindowDimensions().width >= 960;
  const [date] = useState(() => new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const tops = items.filter((item) => item.category === '상의');
  const bottoms = items.filter((item) => item.category === '하의');
  const top = tops[outfitIndex % tops.length];
  const bottom = bottoms[(outfitIndex + 1) % bottoms.length];
  const shoe = items.find((item) => item.category === '신발');
  const ready = !!top && !!bottom;
  const titles: Record<string, string> = { 일상: '가볍게 나서는 하루', 출근: '단정하게 시작하는 하루', 약속: '조금 더 기분 좋은 외출', 운동: '움직임이 있는 하루' };
  const reasons: Record<string, string> = {
    일상: '익숙한 옷도 조합이 달라지면 새로워요. 편안한 분위기의 예시 코디를 준비했어요.',
    출근: '단정한 인상을 생각하며 골라보세요. 실제 소재와 핏은 직접 확인해주세요.',
    약속: '좋아하는 액세서리 하나를 더해보세요. 나다운 분위기로 기분 좋은 외출을 준비해요.',
    운동: '옷장 속 조합을 보여드려요. 운동에 적합한 소재와 활동성은 직접 확인해주세요.',
  };
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.page, wide && s.pageWide]}>
    <View style={s.topBar}><JarvisMark /><Pressable accessibilityRole="button" accessibilityLabel="마이 페이지 열기" onPress={() => setActiveTab('my')} style={s.avatar}><Icon name="user" size={19} /></Pressable></View>
    <View style={s.greetingBlock}><Text style={s.kicker}>{date}</Text><Text style={[s.greeting, wide && { fontSize: 38, lineHeight: 49 }]}>오늘의 나를,{`\n`}가볍게 준비해요.</Text><Text style={s.body}>옷 고르는 일 하나, 자비스와 함께 덜어보세요.</Text></View>
    <View style={[s.columns, wide && s.columnsWide]}>
      <View style={[s.column, wide && { flex: 1.55 }]}>
        <View style={s.sectionHeading}><Text style={s.sectionTitle}>오늘의 코디</Text><View style={s.tag}><Text style={s.tagText}>추천 미리보기</Text></View></View>
        <View style={s.occasions}>{['일상', '출근', '약속', '운동'].map((value) => <Pressable accessibilityRole="button" accessibilityState={{ selected: tpo === value }} key={value} onPress={() => setTpo(value)} style={[s.occasion, tpo === value && s.occasionActive]}><Text style={[s.occasionText, tpo === value && { color: c.ink, fontWeight: '600' }]}>{value}</Text></Pressable>)}</View>
        {ready ? <View style={s.outfitCard}>
          <View style={s.rowBetween}><Text style={s.outfitTitle}>{titles[tpo]}</Text><Text style={s.caps}>LOOK {String(outfitIndex + 1).padStart(2, '0')}</Text></View>
          <View style={s.composition}>
            <Pressable accessibilityRole="button" accessibilityLabel={`${top.name} 정보 보기`} onPress={() => setSelectedItem(top)} style={s.outfitTop}><GarmentImage item={top} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`${bottom.name} 정보 보기`} onPress={() => setSelectedItem(bottom)} style={s.outfitBottom}><GarmentImage item={bottom} /></Pressable>
            {shoe && <Pressable accessibilityRole="button" accessibilityLabel={`${shoe.name} 정보 보기`} onPress={() => setSelectedItem(shoe)} style={s.outfitShoe}><GarmentImage item={shoe} /></Pressable>}
            <Text style={s.compositionCaption}>FROM YOUR WARDROBE</Text>
          </View>
          <View style={s.outfitNames}><Text style={s.itemTitle}>{selectedItem?.name ?? top.name}</Text><Text style={s.small}>{selectedItem ? selectedItem.detail : `+ ${bottom.name}${shoe ? ` + ${shoe.name}` : ''}`}</Text></View>
          <View style={s.outfitActions}><View style={s.flex}><Action label={wearCount > 0 ? '오늘의 코디 선택 완료' : '오늘 이렇게 입기'} onPress={onWear} disabled={wearCount > 0} /></View><Pressable accessibilityRole="button" accessibilityLabel="다른 코디 보기" onPress={() => { setSelectedItem(null); setOutfitIndex(outfitIndex + 1); }} style={s.reroll}><Icon name="refresh" /></Pressable></View>
          <Text style={s.artCaption}>예시 조합 · 의류 이미지는 AI 생성 또는 미등록 표시</Text>
        </View> : <View style={s.empty}><View style={s.emptyMark}><Icon name="hanger" size={48} color={c.accent} /></View><Text style={s.emptyTitle}>첫 코디를 준비해볼까요?</Text><Text style={s.emptyBody}>상의와 하의를 한 벌씩 담아주세요.{`\n`}내 옷으로 조합을 만들어볼 수 있어요.</Text><Action label="내 옷 담으러 가기" onPress={() => setScreen('import')} /></View>}
      </View>
      <View style={[s.column, wide && { flex: 1 }]}>
        <View style={s.sectionHeading}><Text style={s.sectionTitle}>자비스의 한마디</Text><Icon name="spark" size={20} color={c.accent} /></View>
        <View style={s.brief}><Text style={s.briefTitle}>{ready ? '작은 선택이,\n가벼운 아침을 만들어요.' : '새 옷보다 먼저,\n내 옷을 발견해보세요.'}</Text><Text style={s.briefBody}>{ready ? reasons[tpo] : '좋아하는 옷부터 시작해보세요. 옷장을 채우면 여기에서 오늘의 조합을 살펴볼 수 있어요.'}</Text><View style={s.divider} /><View style={s.weather}><Icon name="sun" size={29} color={c.accent} /><View style={s.flex}><Text style={s.weatherTitle}>서울 · 맑음 24°</Text><Text style={s.small}>날씨 연동 전, 샘플 정보예요</Text></View></View></View>
        <View style={s.miniCloset}><View style={s.sectionHeading}><Text style={s.sectionTitle}>내 옷장</Text><Text style={s.total}>{items.length}<Text style={s.small}>벌</Text></Text></View><Text style={s.small}>이미 가진 옷으로 충분한 하루.</Text>{items.length > 0 && <View style={s.previewStrip}>{items.slice(0, 3).map((item) => <View key={item.id} style={s.previewTile}><GarmentImage item={item} /></View>)}</View>}<LinkAction label="옷장 전체 보기" onPress={() => setActiveTab('closet')} /></View>
        {wearCount > 0 && <View style={s.wearNote}><Icon name="check" size={20} color={c.success} /><Text style={[s.small, s.flex]}>오늘의 코디를 골랐어요.{`\n`}선택은 이번 미리보기에서만 유지돼요.</Text></View>}
      </View>
    </View>
    <Text style={s.endNote}>좋아하는 옷과 함께, 나다운 하루를 보내세요.</Text>
  </ScrollView>;
}

export function ClosetScreen({ items, filter, setFilter, onAdd, onImport }: {
  items: ClothingItem[]; filter: (typeof categories)[number]; setFilter: (value: (typeof categories)[number]) => void;
  onAdd: () => void; onImport: () => void;
}) {
  const wide = useWindowDimensions().width >= 960;
  const [query, setQuery] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);
  const filtered = useMemo(() => items.filter((item) => (filter === '전체' || item.category === filter) && `${item.name} ${item.color}`.toLowerCase().includes(query.trim().toLowerCase())), [items, filter, query]);
  return <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[s.page, wide && s.pageWide]}>
    <View style={s.closetHeading}><View><Text style={s.kicker}>나다운 스타일의 시작</Text><Text style={s.greeting}>내 옷장 <Text style={s.total}>{items.length}</Text></Text></View><Pressable accessibilityRole="button" accessibilityLabel="옷 직접 등록" onPress={onAdd} style={s.add}><Icon name="plus" color={c.surface} /></Pressable></View>
    <Text style={s.body}>어떤 옷이 있는지 알면, 입을 옷이 보여요.</Text>
    <View style={s.searchBox}><Icon name="search" size={20} color={c.muted} /><TextInput accessibilityLabel="옷 이름이나 색상 검색" placeholder="옷 이름이나 색상으로 찾기" placeholderTextColor={c.muted} onChangeText={setQuery} value={query} style={s.searchInput} /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>{categories.map((category) => <Pressable accessibilityRole="button" accessibilityState={{ selected: filter === category }} key={category} onPress={() => setFilter(category)} style={[s.filter, filter === category && s.filterActive]}><Text style={[s.filterText, filter === category && { color: c.surface }]}>{category}</Text></Pressable>)}</ScrollView>
    <View style={s.rowBetween}><Text style={s.small}>{filtered.length}벌의 옷</Text><LinkAction label="옷 가져오기" onPress={onImport} /></View>
    {items.length === 0 ? <View style={s.empty}><Icon name="closet" size={48} color={c.accent} /><Text style={s.emptyTitle}>좋아하는 옷부터 한 벌.</Text><Text style={s.emptyBody}>직접 등록하거나 샘플 주문을 가져와보세요.</Text><Action label="옷장 채우기" onPress={onImport} /></View> : <View style={s.grid}>{filtered.map((item) => <Pressable accessibilityRole="button" accessibilityLabel={`${item.name} 정보 보기`} accessibilityState={{ expanded: detailId === item.id }} key={item.id} onPress={() => setDetailId(detailId === item.id ? null : item.id)} style={[s.tile, wide && s.tileWide]}><View style={[s.tileImage, detailId === item.id && { borderColor: c.accent }]}><GarmentImage item={item} /></View><View style={s.tileMeta}><Text style={s.itemCategory}>{item.category}</Text><View style={[s.colorDot, { backgroundColor: item.colorHex }]} /></View><Text numberOfLines={2} style={s.itemTitle}>{item.name}</Text><Text style={s.tileDetail}>{item.color} · {item.source === 'manual' ? '직접 등록' : '샘플'}</Text>{detailId === item.id && <Text style={s.detail}>{item.detail}{`\n`}{item.source === 'manual' ? '직접 등록한 옷' : '미리보기용 상품'}</Text>}</Pressable>)}</View>}
    {items.length > 0 && filtered.length === 0 && <View style={s.emptySearch}><Text style={s.body}>조건에 맞는 옷이 없어요.</Text><LinkAction label="전체 옷 보기" onPress={() => { setQuery(''); setFilter('전체'); }} /></View>}
    {items.some((item) => item.source !== 'manual') && <Text style={s.disclosure}>샘플 옷은 미리보기용이에요. 실제 메일·사진에서 가져온 데이터가 아닙니다.</Text>}
  </ScrollView>;
}

const s = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 }, pressed: { opacity: 0.7 }, disabled: { opacity: 0.55 },
  body: { fontSize: 15, lineHeight: 25, color: c.muted }, small: { fontSize: 13, lineHeight: 21, color: c.muted },
  kicker: { color: c.accent, fontSize: 13, fontWeight: '500', lineHeight: 21 },
  caps: { fontSize: 10, lineHeight: 16, letterSpacing: 1.4, color: c.muted, fontWeight: '500' },
  disclosure: { fontSize: 12, lineHeight: 19, color: c.muted, marginTop: 22 },
  action: { minHeight: 54, paddingHorizontal: 21, paddingVertical: 14, borderRadius: 16, backgroundColor: c.ink, flexDirection: 'row', gap: 14, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
  actionText: { fontSize: 15, lineHeight: 22, fontWeight: '600', color: c.surface, flexShrink: 1 },
  link: { minHeight: 44, flexDirection: 'row', gap: 12, alignItems: 'center', alignSelf: 'flex-start' }, linkText: { color: c.ink, fontSize: 13, fontWeight: '500' },
  welcome: { flexGrow: 1, width: '100%', maxWidth: 1192, paddingHorizontal: 24, alignSelf: 'center', paddingBottom: 35 },
  welcomeNav: { minHeight: 86, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  hero: { paddingTop: 28, gap: 35 }, heroWide: { flexDirection: 'row', alignItems: 'center', gap: 68, paddingVertical: 56 }, words: { alignItems: 'flex-start' },
  intro: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 21 }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent },
  heroTitle: { fontSize: 38, lineHeight: 52, letterSpacing: -1.8, fontWeight: '500', color: c.ink },
  heroBody: { fontSize: 16, color: c.muted, lineHeight: 28, marginTop: 23 }, heroActions: { width: '100%', maxWidth: 325, gap: 6, marginTop: 32 },
  editorial: { borderRadius: 22, padding: 20, backgroundColor: c.stone }, rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  serif: { fontSize: 16, fontStyle: 'italic', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: c.muted },
  heroComposition: { aspectRatio: 1.13, position: 'relative', marginTop: 16 },
  heroShirt: { position: 'absolute', width: '61%', left: 0, top: 0, borderRadius: 14, overflow: 'hidden', transform: [{ rotate: '-7deg' }] },
  heroPants: { position: 'absolute', width: '54%', right: 0, top: '9%', borderRadius: 14, overflow: 'hidden', transform: [{ rotate: '7deg' }] },
  heroShoes: { position: 'absolute', width: '40%', bottom: 0, left: '12%', borderRadius: 14, overflow: 'hidden', transform: [{ rotate: '-6deg' }] },
  heroNote: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, backgroundColor: c.surface }, noteTitle: { fontSize: 14, fontWeight: '600', lineHeight: 23, color: c.ink },
  artCaption: { color: c.muted, textAlign: 'center', fontSize: 12, lineHeight: 19, marginTop: 12 },
  promises: { marginTop: 40, paddingTop: 28, borderTopWidth: 1, borderColor: c.line, gap: 24 }, promisesWide: { flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' },
  promise: { flexDirection: 'row', alignItems: 'flex-start', gap: 17 }, promiseNumber: { fontSize: 13, color: c.accent, paddingTop: 3 }, promiseTitle: { fontSize: 15, fontWeight: '500', color: c.ink, marginBottom: 5 },
  page: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 30 }, pageWide: { paddingHorizontal: 44, paddingTop: 28 }, topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 46 },
  avatar: { width: 44, height: 44, borderWidth: 1, borderColor: c.line, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  greetingBlock: { paddingTop: 30, paddingBottom: 30, gap: 6 }, greeting: { color: c.ink, fontSize: 30, lineHeight: 42, fontWeight: '500', letterSpacing: -1.2, marginTop: 8 },
  columns: { gap: 30 }, columnsWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 26 }, column: { minWidth: 0 },
  sectionHeading: { minHeight: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 13 }, sectionTitle: { color: c.ink, fontSize: 16, fontWeight: '600' },
  tag: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7, backgroundColor: c.stone }, tagText: { color: c.muted, fontSize: 11, lineHeight: 16 },
  occasions: { flexDirection: 'row', backgroundColor: c.stone, padding: 4, borderRadius: 13, marginBottom: 16 }, occasion: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 40, borderRadius: 10 }, occasionActive: { backgroundColor: c.surface }, occasionText: { fontSize: 13, color: c.muted },
  outfitCard: { borderRadius: 22, padding: 18, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line }, outfitTitle: { color: c.ink, fontSize: 16, fontWeight: '500', flexShrink: 1 },
  composition: { aspectRatio: 1.12, backgroundColor: '#F6F5F2', borderRadius: 14, marginTop: 18, position: 'relative', overflow: 'hidden' },
  outfitTop: { position: 'absolute', width: '52%', top: 0, left: 0 }, outfitBottom: { position: 'absolute', width: '48%', top: '13%', right: 0 }, outfitShoe: { position: 'absolute', width: '30%', bottom: '4%', left: '10%' },
  compositionCaption: { position: 'absolute', bottom: 12, right: 12, color: c.muted, fontSize: 8, letterSpacing: 1.4 },
  outfitNames: { marginTop: 17, gap: 3 }, itemTitle: { color: c.ink, fontSize: 14, lineHeight: 22, fontWeight: '500' }, outfitActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  reroll: { width: 54, minHeight: 54, borderWidth: 1, borderColor: c.line, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  empty: { backgroundColor: c.surface, borderRadius: 22, padding: 28, paddingVertical: 40, alignItems: 'center', gap: 20, borderWidth: 1, borderColor: c.line },
  emptyMark: { width: 86, height: 86, borderRadius: 28, backgroundColor: c.lavender, alignItems: 'center', justifyContent: 'center' }, emptyTitle: { fontSize: 22, lineHeight: 32, fontWeight: '500', color: c.ink }, emptyBody: { fontSize: 14, color: c.muted, lineHeight: 24, textAlign: 'center' },
  brief: { padding: 24, borderRadius: 20, backgroundColor: c.lavender, experimental_backgroundImage: 'linear-gradient(140deg, #EDE8F5 0%, #F7E9E9 100%)' },
  briefTitle: { fontSize: 22, lineHeight: 33, color: c.ink, fontWeight: '500', letterSpacing: -0.6 }, briefBody: { color: '#625D69', fontSize: 14, lineHeight: 24, marginTop: 15 }, divider: { height: 1, backgroundColor: '#D9D1DF', marginVertical: 23 },
  weather: { flexDirection: 'row', alignItems: 'center', gap: 14 }, weatherTitle: { color: c.ink, fontSize: 14, fontWeight: '500', marginBottom: 3 },
  miniCloset: { marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderColor: c.line }, total: { fontSize: 26, color: c.muted, fontWeight: '400', letterSpacing: -1 },
  previewStrip: { flexDirection: 'row', gap: 8, marginTop: 17, marginBottom: 8 }, previewTile: { flex: 1, borderRadius: 11, overflow: 'hidden' }, wearNote: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 15 },
  endNote: { fontSize: 12, color: c.muted, textAlign: 'center', paddingTop: 38, paddingBottom: 6 },
  closetHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 22, marginBottom: 12 }, add: { width: 48, height: 48, borderRadius: 16, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 14, paddingHorizontal: 15, marginTop: 27 }, searchInput: { flex: 1, minHeight: 50, color: c.ink, fontSize: 14 },
  filters: { gap: 8, paddingVertical: 20 }, filter: { paddingHorizontal: 18, minHeight: 42, borderRadius: 22, backgroundColor: c.stone, alignItems: 'center', justifyContent: 'center' }, filterActive: { backgroundColor: c.ink }, filterText: { color: c.muted, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: '4%', rowGap: 27, marginTop: 14 }, tile: { width: '48%' }, tileWide: { width: '30.66%' }, tileImage: { borderRadius: 15, borderWidth: 1, borderColor: 'transparent', overflow: 'hidden' },
  tileMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 4 }, itemCategory: { fontSize: 11, lineHeight: 17, color: c.muted }, colorDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: '#00000015' }, tileDetail: { color: c.muted, fontSize: 12, lineHeight: 20, marginTop: 3 },
  emptySearch: { paddingVertical: 65, alignItems: 'center', gap: 14 }, detail: { color: c.accent, fontSize: 12, lineHeight: 21, marginTop: 10 },
});
