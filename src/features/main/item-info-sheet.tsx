import { Image } from 'expo-image';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { itemPhotos } from '@/data/photos';
import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Sheet } from '@/ui/sheet';
import { Text } from '@/ui/text';

/** expo-image is a third-party view: Unistyles styles must not be passed to it, so this stays a plain object. */
const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

/** Small sheet shown when a photo tag is tapped: the real item, then a way to its detail page. */
export function ItemInfoSheet({
  item,
  onClose,
  onOpenDetail,
}: {
  item: ClothingItem | null;
  onClose: () => void;
  onOpenDetail: (id: string) => void;
}) {
  return (
    <Sheet
      footer={
        item ? (
          <>
            <Button block label="옷 상세 보기" onPress={() => onOpenDetail(item.id)} />
            <Button block label="닫기" onPress={onClose} variant="text" />
          </>
        ) : undefined
      }
      onClose={onClose}
      title={item?.name ?? ''}
      visible={item !== null}>
      {item ? (
        <View style={styles.row}>
          <View style={[styles.photo, { backgroundColor: item.colorHex }]}>
            {itemPhotos[item.id] ? (
              <Image contentFit="cover" source={itemPhotos[item.id]} style={fill} />
            ) : null}
          </View>
          <View style={styles.text}>
            <Text tone="secondary" variant="label">
              {item.category}
            </Text>
            <Text variant="body">{item.detail}</Text>
          </View>
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: 'row', gap: theme.space.lg, alignItems: 'center' },
  photo: { width: 96, height: 96 },
  text: { flex: 1, gap: theme.space.xs },
}));
