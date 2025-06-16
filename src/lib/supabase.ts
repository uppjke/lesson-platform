import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Проверяем, настроены ли production credentials
const isProduction = supabaseUrl &&
  !supabaseUrl.includes('demo-project') &&
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('demo') &&
  supabaseAnonKey.length > 100; // JWT токены длинные

if (!isProduction) {
  console.warn('⚠️  DEMO MODE: Используются тестовые Supabase credentials');
  console.warn('📖 Для production настройте реальный Supabase согласно PRODUCTION_SETUP.md');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce', // Более безопасный flow для production
  },
});

// Экспортируем флаг для компонентов
export const IS_PRODUCTION = isProduction;

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
