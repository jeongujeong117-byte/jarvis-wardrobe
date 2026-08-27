import { Category, ClothingItem } from '@/data/wardrobe';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type ClothingItemRow = Database['public']['Tables']['clothing_items']['Row'];

function toClothingItem(row: ClothingItemRow): ClothingItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Category,
    color: row.color ?? '기타',
    colorHex: row.color_hex ?? '#EEE8F2',
    emoji: row.emoji ?? '👕',
    source: row.source as ClothingItem['source'],
    detail: row.detail ?? `${row.color ?? '색상 미정'} / ${row.source}`,
  };
}

export async function loadClothingItems(userId: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toClothingItem);
}

export async function createClothingItem(userId: string, item: ClothingItem) {
  if (!supabase) throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');

  const { data, error } = await supabase
    .from('clothing_items')
    .insert({
      user_id: userId,
      name: item.name,
      category: item.category,
      color: item.color,
      color_hex: item.colorHex,
      emoji: item.emoji,
      source: item.source,
      detail: item.detail,
    })
    .select()
    .single();

  if (error) throw error;
  return toClothingItem(data);
}
