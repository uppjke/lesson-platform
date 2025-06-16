'use client';

import { useState, useEffect, Fragment } from 'react';
import { smartSupabaseClient, isDemoMode } from '@/lib/auth-client';

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

      if (isDemoMode()) {
        console.log(`🎭 ДЕМО-РЕЖИМ: ${mode === 'login' ? 'Вход' : 'Регистрация'}`);
        console.log('📧 Email:', email);
        if (mode === 'signup') {
          console.log('👤 Роль:', role);
          console.log('📝 Имя:', fullName);
        }

        // В демо-режиме используем специальную функцию для входа
        if (mode === 'login') {
          const result = await smartSupabaseClient.auth.demoSignIn(email);
          if (result.error) {
            throw new Error(result.error.message);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        
        setTimeout(() => {
          onSuccess?.();
          onClose();
          // Перезагружаем страницу чтобы обновить состояние пользователя
          window.location.reload();
        }, 1500);
      } else {
        console.log('🚀 PRODUCTION: Реальная авторизация');
        
        const options = mode === 'signup' ? {
          emailRedirectTo: `${window.location.origin}/auth/callback?role=${role}`,
          data: {
            role: role,
            full_name: fullName,
          },
        } : {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        };

        const { error: authError } = await smartSupabaseClient.auth.signInWithOtp({
          email,
          options,
        });

        if (authError) {
          throw authError;
        }

        setSuccess(true);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
      setSuccess(false);
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

          {/* Статус режима */}
          {isDemoMode() ? (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-sm text-blue-700">
                    🎭 Демо-режим. {mode === 'login' ? 'Попробуйте teacher@example.com' : 'Введите любой email'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-sm text-green-700">
                    🚀 Production режим. Magic Link будет отправлен на email.
                  </p>
                </div>
              </div>
            </div>
          )}

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
                placeholder={isDemoMode() && mode === 'login' ? "teacher@example.com" : "your@email.com"}
              />
            </div>

            {/* Быстрый вход (только для демо и входа) */}
            {isDemoMode() && mode === 'login' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Быстрый вход:</p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEmail('teacher@example.com')}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    👨‍🏫 Преподаватель
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail('student@example.com')}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    👨‍🎓 Студент
                  </button>
                </div>
              </div>
            )}

            {/* Дополнительные поля для регистрации */}
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Полное имя {isDemoMode() && <span className="text-gray-400">(опционально)</span>}
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
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-sm">
                ✅ {isDemoMode() 
                  ? (mode === 'login' ? 'Входим в систему...' : 'Регистрация завершена!')
                  : 'Magic Link отправлен на ваш email!'}
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isDemoMode() ? 'Подключаемся...' : 'Отправляем...'}
                </span>
              ) : (
                <>
                  {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                  {isDemoMode() && ' (демо)'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
