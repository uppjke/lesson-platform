import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    // Настройки для Passkey fallback
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Типы для пользователей
export interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  full_name?: string;
  created_at: string;
  updated_at: string;
}

// Функция для создания профиля пользователя
export async function createUserProfile(userId: string, email: string, role: 'student' | 'teacher') {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { data, error };
}

// Функция для получения профиля пользователя
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}
