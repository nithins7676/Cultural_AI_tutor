import { createClient } from '@supabase/supabase-js';
import { config } from '@/config/env';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// Database types
export interface User {
  id?: string;
  name: string;
  culture: string;
  subjects: string[];
  topics?: string[];
  level: string;
  created_at?: string;
}

export interface Progress {
  id?: string;
  user_id: string;
  subject: string;
  topic: string;
  lessons_completed: number;
  created_at?: string;
}

export interface Story {
  id?: string;
  culture: string;
  story: Record<string, any>;
  questions: Record<string, any>;
  created_at?: string;
} 