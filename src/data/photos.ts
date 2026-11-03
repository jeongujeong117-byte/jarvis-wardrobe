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

/** Tag position in percent of the 4:5 photo. `flip` puts the label on the left of the dot. */
export type PhotoTag = { itemId: string; x: number; y: number; flip?: boolean };

export type AiCut = {
  image: ImageSource;
  /** Pixel size of the source image — needed to place tags when the photo is cropped to fill. */
  size: { w: number; h: number };
  /** Average color of the image, shown while it loads. */
  background: string;
  /** Text printed over this photo: light on dark photos, ink on light photos. */
  textOn: 'light' | 'dark';
  tags: PhotoTag[];
};

/** Fixed colors for type printed over photos (they do not follow light/dark mode). */
export const overPhotoInk = { light: '#F6F3EE', dark: '#161514' } as const;

export type AiOutfit = { flatlay: AiCut; model: AiCut };

const aiFlatlay: AiCut = {
  image: require('../../assets/images/wardrobe/ai-flatlay.jpg'),
  size: { w: 800, h: 1000 },
  background: '#948B7B',
  // Ink reads on both the taupe floor and the white shirt; light type vanished on the shirt.
  textOn: 'dark',
  tags: [
    { itemId: 'gmail-1', x: 50, y: 16 },
    { itemId: 'gmail-4', x: 53, y: 62 },
    { itemId: 'gmail-6', x: 16, y: 73 },
  ],
};

const aiModel: AiCut = {
  image: require('../../assets/images/wardrobe/ai-model.jpg'),
  size: { w: 800, h: 1000 },
  background: '#B9B9BB',
  textOn: 'dark',
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
