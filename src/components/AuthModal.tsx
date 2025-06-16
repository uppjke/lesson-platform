'use client';

import { useState, useEffect } from 'react';
import { supabase, checkEmailExists } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialError?: string | null;
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialError }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [success, setSuccess] = useState(false);

  // Обновляем ошибку когда изменяется initialError
  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Проверяем, настроен ли Supabase
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id') || 
          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo.supabase.co') ||
          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo-ui-test')) {
        throw new Error('Supabase не настроен. Пожалуйста, обновите переменные окружения в .env.local с реальными credentials из вашего Supabase проекта.');
      }

      // Проверяем подключение к Supabase
      console.log('🔍 Testing Supabase connection...');
      const { error: healthError } = await supabase.from('profiles').select('count').limit(1).maybeSingle();
      
      if (healthError) {
        console.error('❌ Supabase health check failed:', healthError);
        if (healthError.message.includes('relation "public.profiles" does not exist')) {
          throw new Error('База данных не настроена. Пожалуйста, примените SQL схему в Supabase Dashboard → SQL Editor. См. SUPABASE_AUTH_FIX.md');
        }
      } else {
        console.log('✅ Supabase connection OK');
      }

      // Проверяем существование пользователя
      console.log(`🔐 Attempting ${mode} for:`, email);
      
      const { exists, isConfirmed } = await checkEmailExists(email);
      
      if (mode === 'signup' && exists) {
        if (isConfirmed) {
          throw new Error(`Пользователь с email ${email} уже зарегистрирован и подтвержден. Попробуйте войти.`);
        } else {
          throw new Error(`Пользователь с email ${email} уже зарегистрирован, но не подтвержден. Проверьте почту или попробуйте войти.`);
        }
      }
      
      if (mode === 'login' && !exists) {
        throw new Error(`Пользователь с email ${email} не найден. Попробуйте зарегистрироваться.`);
      }

      console.log('🌐 Redirect URL:', `${window.location.origin}/auth/callback`);

      // Отправляем Magic Link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: mode === 'signup' ? {
            role: role,
            full_name: fullName,
          } : undefined,
        },
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        
        // Обрабатываем специфичные ошибки аутентификации
        if (authError.message.includes('User already registered')) {
          throw new Error(`Пользователь с email ${email} уже зарегистрирован. Попробуйте войти вместо регистрации.`);
        }
        
        throw authError;
      }

      console.log('✅ Magic link sent successfully');
      setSuccess(true);
      
      // Автоматически закрываем через 3 секунды
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 3000);

    } catch (err: unknown) {
      console.error('❌ Full error:', err);
      let errorMessage = 'Произошла ошибка';
      let shouldSwitchMode = false;
      
      if (err instanceof Error) {
        // Обрабатываем специфичные ошибки Supabase
        if (err.message.includes('уже зарегистрирован')) {
          errorMessage = err.message;
          shouldSwitchMode = true; // Предлагаем переключиться на вход
        } else if (err.message.includes('fetch')) {
          errorMessage = 'Ошибка сети. Проверьте подключение к интернету и настройки Supabase.';
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Пользователь не найден. Попробуйте зарегистрироваться.';
          if (mode === 'login') shouldSwitchMode = true; // Предлагаем переключиться на регистрацию
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Email не подтвержден. Проверьте почту и перейдите по ссылке.';
        } else if (err.message.includes('CORS')) {
          errorMessage = 'Ошибка CORS. Проверьте Redirect URLs в Supabase Dashboard.';
        } else if (err.message.includes('relation') && err.message.includes('does not exist')) {
          errorMessage = 'База данных не настроена. См. инструкции в SUPABASE_AUTH_FIX.md';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setSuccess(false);
      
      // Показываем кнопку для переключения режима
      if (shouldSwitchMode) {
        setTimeout(() => {
          const newMode = mode === 'signup' ? 'login' : 'signup';
          const actionText = newMode === 'login' ? 'войти' : 'зарегистрироваться';
          if (confirm(`Хотите ${actionText} вместо этого?`)) {
            switchMode(newMode);
          }
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setFullName('');
    setRole('student');
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Заголовок */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Переключатель режима */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email адрес
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Дополнительные поля для регистрации */}
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Полное имя (опционально)
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ваше полное имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Роль на платформе
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={role === 'student'}
                        onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        👨‍🎓 Студент - изучать новые навыки
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="teacher"
                        checked={role === 'teacher'}
                        onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        👨‍🏫 Преподаватель - проводить уроки
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Сообщения */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                {error}
                {error.includes('уже зарегистрирован') && (
                  <div className="mt-2">
                    <button
                      onClick={() => switchMode('login')}
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Перейти к входу →
                    </button>
                  </div>
                )}
                {error.includes('не найден') && mode === 'login' && (
                  <div className="mt-2">
                    <button
                      onClick={() => switchMode('signup')}
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Зарегистрироваться →
                    </button>
                  </div>
                )}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-sm">
                ✅ Magic Link отправлен на ваш email! Проверьте почту и перейдите по ссылке.
              </div>
            )}

            {/* Информация о Magic Link */}
            {!error && !success && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm">
                💡 {mode === 'login' 
                  ? 'Введите email для получения ссылки входа'
                  : 'После регистрации на email придет ссылка для подтверждения'
                }
              </div>
            )}

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 14 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправляем...
                </span>
              ) : (
                mode === 'login' ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
