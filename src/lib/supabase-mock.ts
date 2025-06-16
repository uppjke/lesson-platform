import { createClient } from '@supabase/supabase-js';

// Для демонстрации создаем mock-клиент если нет реального Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Проверяем, являются ли credentials реальными
const isRealSupabase = supabaseUrl && !supabaseUrl.includes('your-project') &&
    supabaseAnonKey && !supabaseAnonKey.includes('your_supabase');

if (!isRealSupabase) {
    console.warn('⚠️ Используются тестовые Supabase credentials. Для реальной работы создайте проект на https://supabase.com');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
});

// Типы для пользователей
export interface UserProfile {
    id: string;
    email: string;
    role: 'student' | 'teacher';
    full_name?: string;
    created_at?: string;
    updated_at?: string;
}

// Mock функция для демонстрации (если нет реального Supabase)
export const mockAuth = {
    async signInWithOtp(options: { email: string; options?: Record<string, unknown> }) {
        if (!isRealSupabase) {
            // Симулируем успешную отправку OTP
            return {
                data: { user: null, session: null },
                error: null
            };
        }
        return supabase.auth.signInWithOtp(options);
    },

    async getUser() {
        if (!isRealSupabase) {
            return {
                data: { user: null },
                error: null
            };
        }
        return supabase.auth.getUser();
    }
};

// Функция для проверки подключения к Supabase
export async function testSupabaseConnection() {
    try {
        const { error } = await supabase.from('profiles').select('count').limit(1);
        return { connected: !error, error };
    } catch (error) {
        return { connected: false, error };
    }
}
