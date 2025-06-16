import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wicrrqjjafaljmnxwdxo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpY3JycWpqYWZhbGptbnh3ZHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNjU2OTcsImV4cCI6MjA2NTY0MTY5N30.z9zIRRAf2H56QgFozO8AvLCHipiB3ooD1iT0UwuOW4w';

// Проверяем наличие переменных окружения
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Supabase environment variables missing!');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing (using production default)');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing (using production default)');
  console.log('ℹ️ Using production Supabase defaults');
}

// Создаем Supabase клиент с улучшенной конфигурацией
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development', // Включаем отладку в dev
  },
  global: {
    headers: {
      'x-client-info': 'lesson-platform-nextjs',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Расширенные типы для базы данных
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  teacher_id: string;
  price: number;
  duration: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
}

export interface Enrollment {
  id: string;
  student_id: string;
  lesson_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  enrolled_at: string;
}

// Функция для создания профиля пользователя
export async function createUserProfile(
  userId: string,
  email: string,
  role: 'student' | 'teacher' = 'student',
  fullName?: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email: email,
        role: role,
        full_name: fullName,
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

// Функция для обновления профиля пользователя
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// Функции для работы с уроками
export async function getPublishedLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      profiles!teacher_id (
        full_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getLessonById(lessonId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      profiles!teacher_id (
        full_name,
        avatar_url,
        email
      )
    `)
    .eq('id', lessonId)
    .single();

  return { data, error };
}

export async function getUserLessons(userId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Функции для работы с записями на уроки
export async function enrollInLesson(studentId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert([
      {
        student_id: studentId,
        lesson_id: lessonId,
        status: 'pending',
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function getUserEnrollments(userId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      lessons (
        title,
        description,
        price,
        duration,
        profiles!teacher_id (
          full_name
        )
      )
    `)
    .eq('student_id', userId)
    .order('enrolled_at', { ascending: false });

  return { data, error };
}

// Статистика для dashboard
export async function getDashboardStats(userId: string, userRole: string) {
  try {
    if (userRole === 'teacher') {
      // Статистика для преподавателя
      const [lessonsResult, enrollmentsResult] = await Promise.all([
        supabase.from('lessons').select('id').eq('teacher_id', userId),
        supabase
          .from('enrollments')
          .select('id, lessons!inner(*)')
          .eq('lessons.teacher_id', userId),
      ]);

      return {
        totalLessons: lessonsResult.data?.length || 0,
        totalStudents: enrollmentsResult.data?.length || 0,
        revenue: 0, // Подсчет выручки можно добавить позже
      };
    } else {
      // Статистика для студента
      const enrollmentsResult = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', userId);

      return {
        enrolledLessons: enrollmentsResult.data?.length || 0,
        completedLessons: 0, // Можно добавить отслеживание прогресса
        totalSpent: 0, // Подсчет трат можно добавить позже
      };
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

// Функция для проверки существования email
export async function checkEmailExists(email: string): Promise<{ exists: boolean; isConfirmed: boolean }> {
  try {
    // Проверяем в таблице profiles (подтвержденные пользователи)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (profileData) {
      console.log('✅ Email found in profiles (confirmed user)');
      return { exists: true, isConfirmed: true };
    }

    // Если в profiles нет, пытаемся проверить через signInWithOtp с невалидным паролем
    // Это более безопасный способ проверки без отправки писем
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'invalid-password-for-check-only-' + Date.now()
      });

      if (signInError) {
        // Если ошибка "Invalid login credentials", то пользователь существует
        if (signInError.message.includes('Invalid login credentials')) {
          console.log('⚠️ Email exists but not confirmed or wrong password');
          return { exists: true, isConfirmed: false };
        }
        
        // Если ошибка "Email not confirmed", то пользователь существует но не подтвержден
        if (signInError.message.includes('Email not confirmed')) {
          console.log('⚠️ Email exists but not confirmed');
          return { exists: true, isConfirmed: false };
        }

        // Если ошибка "User not found" или похожая, пользователя нет
        if (signInError.message.includes('User not found') || 
            signInError.message.includes('Invalid') ||
            signInError.message.includes('not found')) {
          console.log('❌ Email not found');
          return { exists: false, isConfirmed: false };
        }
      }

      // Если нет ошибки, это странно, считаем что пользователь существует
      console.log('⚠️ Unexpected: no error on sign in');
      return { exists: true, isConfirmed: false };

    } catch (authError) {
      console.error('Auth check error:', authError);
      // В случае ошибки проверки, считаем что пользователя нет
      return { exists: false, isConfirmed: false };
    }

  } catch (err) {
    console.error('Error checking email:', err);
    return { exists: false, isConfirmed: false };
  }
}
