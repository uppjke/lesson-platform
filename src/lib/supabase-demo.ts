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
        data: { user: null },
        error: null
      };
    },
    
    async getSession() {
      return {
        data: { session: null },
        error: null
      };
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

// Типы для пользователей
export interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}
