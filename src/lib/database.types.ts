export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          price: number;
          condition: string;
          brand: string;
          location: string;
          contact: string;
          photos: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          price: number;
          condition: string;
          brand: string;
          location: string;
          contact: string;
          photos?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          price?: number;
          condition?: string;
          brand?: string;
          location?: string;
          contact?: string;
          photos?: string[];
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}