export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          plan: "free" | "pro";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          plan?: "free" | "pro";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          plan?: "free" | "pro";
          updated_at?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_role: string | null;
          template_id: string;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          target_role?: string | null;
          template_id?: string;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          target_role?: string | null;
          template_id?: string;
          content?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      resume_audits: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          score: number;
          result: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          score: number;
          result: Json;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      ai_usage_events: {
        Row: {
          id: string;
          user_id: string;
          kind: string;
          provider: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kind: string;
          provider?: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      uploads: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string | null;
          bucket: string;
          path: string;
          mime_type: string;
          size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id?: string | null;
          bucket?: string;
          path: string;
          mime_type: string;
          size_bytes: number;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      rate_limit_events: {
        Row: {
          id: string;
          ip_hash: string;
          user_id: string | null;
          kind: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          ip_hash: string;
          user_id?: string | null;
          kind: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
