export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ClothingItemSource = 'gmail' | 'capture' | 'manual';
type ImportType = 'gmail' | 'capture';
type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      clothing_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          subcategory: string | null;
          color: string | null;
          color_hex: string | null;
          emoji: string | null;
          image_url: string | null;
          source: ClothingItemSource;
          source_ref: string | null;
          detail: string | null;
          attributes: Json;
          confidence: number | null;
          needs_review: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          subcategory?: string | null;
          color?: string | null;
          color_hex?: string | null;
          emoji?: string | null;
          image_url?: string | null;
          source?: ClothingItemSource;
          source_ref?: string | null;
          detail?: string | null;
          attributes?: Json;
          confidence?: number | null;
          needs_review?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['clothing_items']['Insert']>;
        Relationships: [];
      };
      imports: {
        Row: {
          id: string;
          user_id: string;
          type: ImportType;
          status: ImportStatus;
          source_ref: string | null;
          found_count: number;
          imported_count: number;
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: ImportType;
          status?: ImportStatus;
          source_ref?: string | null;
          found_count?: number;
          imported_count?: number;
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['imports']['Insert']>;
        Relationships: [];
      };
      outfits: {
        Row: {
          id: string;
          user_id: string;
          tpo: string;
          weather: Json;
          reason: string | null;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tpo: string;
          weather?: Json;
          reason?: string | null;
          source?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['outfits']['Insert']>;
        Relationships: [];
      };
      outfit_items: {
        Row: { outfit_id: string; clothing_item_id: string; slot: string };
        Insert: { outfit_id: string; clothing_item_id: string; slot: string };
        Update: { slot?: string };
        Relationships: [];
      };
      wear_logs: {
        Row: {
          id: string;
          user_id: string;
          outfit_id: string | null;
          worn_on: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          outfit_id?: string | null;
          worn_on?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['wear_logs']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
