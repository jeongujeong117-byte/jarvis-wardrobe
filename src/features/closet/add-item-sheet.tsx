import { useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { Category, ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Field } from '@/ui/field';
import { GarmentPlate } from '@/ui/pen/garment-plate';
import { PenChoice, PenChoiceRow } from '@/ui/pen/pen-choice';
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
      footer={
        <Button block disabled={saving} label={saving ? '저장 중...' : '옷장에 저장하기'} onPress={save} />
      }
      onClose={onClose}
      title="옷 등록하기"
      visible={visible}>
      {/* Live preview: the garment as it will appear — plane and pen contour. */}
      <View style={styles.preview}>
        <View style={styles.previewField}>
          <GarmentPlate id="add-preview" item={{ category, colorHex: colorHex[color] ?? '#B6B0A4' }} />
        </View>
        <View style={styles.previewText}>
          <Text numberOfLines={2} tone={name ? 'primary' : 'tertiary'} variant="title">
            {name || '이름을 적어주세요'}
          </Text>
          <Text tone="secondary" variant="caption">
            {color} {category}
          </Text>
        </View>
      </View>

      <Field label="이름" onChangeText={setName} placeholder="예: 스트라이프 셔츠" value={name} />

      <View style={styles.group}>
        <Text tone="secondary" variant="label">
          카테고리
        </Text>
        <PenChoiceRow>
          {categoryOptions.map((value) => (
            <PenChoice key={value} label={value} onPress={() => setCategory(value)} selected={category === value} />
          ))}
        </PenChoiceRow>
      </View>

      <View style={styles.group}>
        <Text tone="secondary" variant="label">
          색상
        </Text>
        <PenChoiceRow>
          {colorOptions.map((value) => (
            <PenChoice key={value} label={value} onPress={() => setColor(value)} selected={color === value} />
          ))}
        </PenChoiceRow>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  preview: { flexDirection: 'row', alignItems: 'center', gap: theme.space.lg },
  previewField: { width: 104 },
  previewText: { flex: 1, gap: theme.space.xs },
  group: { gap: theme.space.sm },
}));
