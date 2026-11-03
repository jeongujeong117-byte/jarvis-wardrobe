/**
 * Photos for the demo wardrobe and the two AI outfit cuts.
 * Items without a photo (manual / captured) fall back to a flat color plane.
 */
import type { ImageSource } from 'expo-image';

import type { ClothingItem } from './wardrobe';

export const itemPhotos: Record<string, ImageSource> = {
  'gmail-1': require('../../assets/images/wardrobe/gmail-1.jpg'),
  'gmail-2': require('../../assets/images/wardrobe/gmail-2.jpg'),
  'gmail-3': require('../../assets/images/wardrobe/gmail-3.jpg'),
  'gmail-4': require('../../assets/images/wardrobe/gmail-4.jpg'),
  'gmail-5': require('../../assets/images/wardrobe/gmail-5.jpg'),
  'gmail-6': require('../../assets/images/wardrobe/gmail-6.jpg'),
};

export type PhotoMode = 'flatlay' | 'model' | 'mine';

export const photoModes: { key: PhotoMode; label: string }[] = [
  { key: 'flatlay', label: '코디 컷' },
  { key: 'model', label: '착용 컷' },
  { key: 'mine', label: '내 사진' },
];

/** Tag position in percent of the 4:5 photo. `flip` puts the label on the left of the dot. */
export type PhotoTag = { itemId: string; x: number; y: number; flip?: boolean };

export type AiCut = {
  image: ImageSource;
  /** Average edge color of the AI image — the stage behind it uses it so the photo has no visible seam. */
  background: string;
  tags: PhotoTag[];
};

export type AiOutfit = { flatlay: AiCut; model: AiCut };

const aiFlatlay: AiCut = {
  image: require('../../assets/images/wardrobe/ai-flatlay.jpg'),
  background: '#948B7B',
  tags: [
    { itemId: 'gmail-1', x: 50, y: 16 },
    { itemId: 'gmail-4', x: 53, y: 62 },
    { itemId: 'gmail-6', x: 16, y: 73 },
  ],
};

const aiModel: AiCut = {
  image: require('../../assets/images/wardrobe/ai-model.jpg'),
  background: '#B9B9BB',
  tags: [
    { itemId: 'gmail-5', x: 36, y: 42, flip: true },
    { itemId: 'gmail-1', x: 50, y: 30 },
    { itemId: 'gmail-4', x: 54, y: 65 },
    { itemId: 'gmail-6', x: 46, y: 90 },
  ],
};

/** The demo has AI cuts for one outfit only: oxford shirt + one-tuck chinos. */
export function aiOutfitFor(top: ClothingItem, bottom: ClothingItem): AiOutfit | undefined {
  return top.id === 'gmail-1' && bottom.id === 'gmail-4'
    ? { flatlay: aiFlatlay, model: aiModel }
    : undefined;
}
