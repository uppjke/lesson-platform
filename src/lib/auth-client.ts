import { supabase, IS_PRODUCTION } from './supabase';
import { mockSupabaseClient, getCurrentDemoUser, UserProfile } from './supabase-demo';

// Умный клиент, который автоматически выбирает режим
export const smartSupabaseClient = {
    auth: {
        async signInWithOtp(options: { email: string; options?: Record<string, unknown> }) {
            if (IS_PRODUCTION) {
                console.log('🚀 PRODUCTION: Отправка реального Magic Link');
                return await supabase.auth.signInWithOtp(options);
            } else {
                console.log('🎭 DEMO: Симуляция Magic Link');
                return await mockSupabaseClient.auth.signInWithOtp(options);
            }
        },

        async getUser() {
            if (IS_PRODUCTION) {
                return await supabase.auth.getUser();
            } else {
                return await mockSupabaseClient.auth.getUser();
            }
        },

        async getSession() {
            if (IS_PRODUCTION) {
                return await supabase.auth.getSession();
            } else {
                return await mockSupabaseClient.auth.getSession();
            }
        },

        async signOut() {
            if (IS_PRODUCTION) {
                console.log('🚀 PRODUCTION: Выход из системы');
                return await supabase.auth.signOut();
            } else {
                console.log('🎭 DEMO: Выход из демо-режима');
                return await mockSupabaseClient.auth.signOut();
            }
        },

        // Для демо-режима
        async demoSignIn(email: string) {
            if (IS_PRODUCTION) {
                throw new Error('demoSignIn не доступен в production режиме');
            }
            return await mockSupabaseClient.auth.demoSignIn(email);
        }
    },

    from: (table: string) => {
        if (IS_PRODUCTION) {
            return supabase.from(table);
        } else {
            return mockSupabaseClient.from(table);
        }
    }
};

// Функции для работы с профилями
export async function getUserProfile(): Promise<{ data: UserProfile | null, error: unknown }> {
    if (IS_PRODUCTION) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: { message: 'Пользователь не авторизован' } };
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return { data, error };
    } else {
        const user = getCurrentDemoUser();
        return { data: user, error: null };
    }
}

export async function createUserProfile(email: string, role: 'student' | 'teacher', fullName?: string): Promise<{ data: UserProfile | null, error: unknown }> {
    if (IS_PRODUCTION) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: { message: 'Пользователь не авторизован' } };
        }

        const { data, error } = await supabase
            .from('profiles')
            .insert([
                {
                    id: user.id,
                    email,
                    role,
                    full_name: fullName || '',
                },
            ])
            .select()
            .single();

        return { data, error };
    } else {
        // В демо-режиме профиль уже создан при "входе"
        const user = getCurrentDemoUser();
        return { data: user, error: null };
    }
}

// Проверка режима для компонентов
export function isProductionMode(): boolean {
    return Boolean(IS_PRODUCTION);
}

export function isDemoMode(): boolean {
    return !Boolean(IS_PRODUCTION);
}

// Экспорт типов
export type { UserProfile } from './supabase-demo';
