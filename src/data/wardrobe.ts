export type Category = '상의' | '하의' | '아우터' | '신발';

export type ClothingItem = {
  id: string;
  name: string;
  category: Category;
  color: string;
  colorHex: string;
  emoji: string;
  source: 'gmail' | 'capture' | 'manual';
  detail: string;
};

export const gmailItems: ClothingItem[] = [
  {
    id: 'gmail-1',
    name: '옥스포드 오버핏 셔츠',
    category: '상의',
    color: '화이트',
    colorHex: '#EDECE8',
    emoji: '👔',
    source: 'gmail',
    detail: '화이트 / L',
  },
  {
    id: 'gmail-2',
    name: '워시드 코튼 티셔츠',
    category: '상의',
    color: '네이비',
    colorHex: '#34425C',
    emoji: '👕',
    source: 'gmail',
    detail: '네이비 / M',
  },
  {
    id: 'gmail-3',
    name: '와이드 데님 팬츠',
    category: '하의',
    color: '블루',
    colorHex: '#7188A8',
    emoji: '👖',
    source: 'gmail',
    detail: '미디엄 블루 / 30',
  },
  {
    id: 'gmail-4',
    name: '원턱 코튼 팬츠',
    category: '하의',
    color: '베이지',
    colorHex: '#BCA98B',
    emoji: '👖',
    source: 'gmail',
    detail: '베이지 / 30',
  },
  {
    id: 'gmail-5',
    name: '라이트 윈드 재킷',
    category: '아우터',
    color: '그레이',
    colorHex: '#8F9390',
    emoji: '🧥',
    source: 'gmail',
    detail: '그레이 / L',
  },
  {
    id: 'gmail-6',
    name: '레더 코트 스니커즈',
    category: '신발',
    color: '화이트',
    colorHex: '#E8E5DE',
    emoji: '👟',
    source: 'gmail',
    detail: '오프화이트 / 270',
  },
];

export const captureItem: ClothingItem = {
  id: 'capture-1',
  name: '램스울 니트 카디건',
  category: '아우터',
  color: '올리브',
  colorHex: '#7B8061',
  emoji: '🧥',
  source: 'capture',
  detail: '올리브 / L',
};

export const categories: ('전체' | Category)[] = ['전체', '상의', '하의', '아우터', '신발'];

export const sourceLabels: Record<ClothingItem['source'], string> = {
  gmail: 'Gmail 자동등록',
  capture: '캡처 가져오기',
  manual: '직접 등록',
};
