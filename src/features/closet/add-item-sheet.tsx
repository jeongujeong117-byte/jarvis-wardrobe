import { useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { Category, ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Chip } from '@/ui/chip';
import { Field } from '@/ui/field';
import { GarmentField } from '@/ui/garment/garment-field';
import { Sheet } from '@/ui/sheet';
import { Text } from '@/ui/text';

// Data mapping unchanged from the prototype.
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
const categoryOptions: Category[] = ['상의', '하의', '아우터', '신발'];
const colorOptions = ['블랙', '화이트', '네이비', '베이지'];

export function AddItemSheet({
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
    <Sheet
      caption="직접 등록"
      footer={
        <Button disabled={saving} label={saving ? '저장 중...' : '옷장에 저장하기'} onPress={save} />
      }
      onClose={onClose}
      title="옷 등록하기"
      visible={visible}>
      {/* Live preview: the garment as it will appear — a color field. */}
      <View style={styles.preview}>
        <View style={styles.previewField}>
          <GarmentField glyphSize={40} item={{ category, colorHex: colorHex[color] ?? '#B6B0A4' }} />
        </View>
        <View style={styles.previewText}>
          <Text numberOfLines={2} tone={name ? 'primary' : 'tertiary'} variant="title">
            {name || '상품명을 입력하세요'}
          </Text>
          <Text tone="secondary" variant="caption">
            {category} · {color}
          </Text>
        </View>
      </View>

      <Field label="상품명" onChangeText={setName} placeholder="예: 스트라이프 셔츠" value={name} />

      <View style={styles.group}>
        <Text tone="secondary" variant="label">
          카테고리
        </Text>
        <View style={styles.chips}>
          {categoryOptions.map((value) => (
            <Chip key={value} label={value} onPress={() => setCategory(value)} selected={category === value} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text tone="secondary" variant="label">
          색상
        </Text>
        <View style={styles.chips}>
          {colorOptions.map((value) => (
            <Chip key={value} label={value} onPress={() => setColor(value)} selected={color === value} />
          ))}
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  preview: { flexDirection: 'row', alignItems: 'center', gap: theme.space.lg },
  previewField: { width: 88 },
  previewText: { flex: 1, gap: theme.space.xs },
  group: { gap: theme.space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
}));
