// Демо-клиент Supabase для разработки
export const mockSupabaseClient = {
    auth: {
        async signInWithOtp(options: { email: string; options?: any }) {
            console.log('🎭 ДЕМО: Симуляция signInWithOtp');
            console.log('📧 Email:', options.email);
            console.log('⚙️ Options:', options.options);

            // Симулируем успешный ответ
            return {
                data: { user: null, session: null },
                error: null
            };
        },

        async getUser() {
            return {
                data: { user: currentDemoUser },
                error: null
            };
        },

        async getSession() {
            return {
                data: { session: currentDemoSession },
                error: null
            };
        },

        async signOut() {
            console.log('🎭 ДЕМО: Выход из системы');
            currentDemoUser = null;
            currentDemoSession = null;
            return { error: null };
        },

        // Функция для демо-входа
        async demoSignIn(email: string) {
            console.log('🎭 ДЕМО: Вход в систему для', email);
            
            const user = demoUsers[email];
            if (user) {
                currentDemoUser = user;
                currentDemoSession = {
                    access_token: 'demo-token',
                    user: user,
                    expires_at: Date.now() + 3600000 // 1 час
                };
                
                console.log('✅ Пользователь вошел:', user);
                return { user, session: currentDemoSession, error: null };
            }
            
            return { user: null, session: null, error: { message: 'Пользователь не найден' } };
        }
    },

    from: (table: string) => ({
        select: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
    })
};

// Простое управление сессией для демо
let currentDemoUser: UserProfile | null = null;
let currentDemoSession: any = null;

// Демо пользователи
const demoUsers: Record<string, UserProfile> = {
  'teacher@example.com': {
    id: 'demo-teacher-1',
    email: 'teacher@example.com',
    role: 'teacher',
    full_name: 'Анна Преподавателева',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  'student@example.com': {
    id: 'demo-student-1', 
    email: 'student@example.com',
    role: 'student',
    full_name: 'Петр Студентов',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

// Типы для пользователей
export interface UserProfile {
    id: string;
    email: string;
    role: 'student' | 'teacher';
    full_name?: string;
    created_at?: string;
    updated_at?: string;
}

// Функции для работы с текущим пользователем
export function getCurrentDemoUser(): UserProfile | null {
  return currentDemoUser;
}

export function isDemoLoggedIn(): boolean {
  return currentDemoUser !== null;
}

export function getDemoUserRole(): 'student' | 'teacher' | null {
  return currentDemoUser?.role || null;
}
