'use client';

import { useState } from 'react';
import { mockSupabaseClient } from '@/lib/supabase-demo';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Функция для входа через Magic Link (демо)
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log('🎭 ДЕМО-РЕЖИМ: Симуляция входа через Magic Link');
      console.log('📧 Email:', email);
      
      // В демо-режиме сразу "логиним" пользователя
      const result = await mockSupabaseClient.auth.demoSignIn(email);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setError(null);

      // Переходим в dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при входе';
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    await handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в систему
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Войдите в свой аккаунт на платформе уроков
          </p>
        </div>

        {/* Статус демо-режима */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Демо-режим входа
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Введите любой email для демонстрации входа в систему.
                  После "входа" вы будете перенаправлены в Dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email поле */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email адрес
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email адрес (например: teacher@example.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Быстрые демо-аккаунты */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Быстрый вход (демо):</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setEmail('teacher@example.com')}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                👨‍🏫 teacher@example.com (Преподаватель)
              </button>
              <button
                type="button"
                onClick={() => setEmail('student@example.com')}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                👨‍🎓 student@example.com (Студент)
              </button>
            </div>
          </div>

          {/* Кнопка входа */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Отправляем Magic Link...' : 'Войти через Magic Link'}
            </button>
          </div>

          {/* Сообщения об ошибках */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Сообщение об успехе */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    ✅ Вход выполняется! (демо)
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Переходим в Dashboard... В реальном режиме вы получили бы письмо с ссылкой.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Ссылки */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Еще нет аккаунта?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Зарегистрироваться
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              ← Вернуться на главную
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
