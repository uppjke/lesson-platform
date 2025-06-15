'use client';

import { useState } from 'react';
import { supabase, createUserProfile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Функция для регистрации с Magic Link (Passkey fallback)
  const handlePasskeySignup = async () => {
    try {
      setLoading(true);
      setError(null);

      // Отправляем Magic Link для авторизации (fallback для Passkey)
      const { data, error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Редирект после подтверждения email
          emailRedirectTo: `${window.location.origin}/auth/callback?role=${role}`,
          data: {
            role: role, // Передаем роль в метаданных
          },
        },
      });

      if (signInError) {
        throw signInError;
      }

      // Показываем сообщение об отправке письма
      alert('Проверьте вашу почту! Мы отправили вам ссылку для входа.');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Введите email');
      return;
    }

    await handlePasskeySignup();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Регистрация на платформе
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Создайте учетную запись для доступа к урокам
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email адрес
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                Выберите роль
              </legend>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="student"
                    name="role"
                    type="radio"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="student" className="ml-3 block text-sm font-medium text-gray-700">
                    Студент
                    <span className="block text-xs text-gray-500">
                      Изучайте новые навыки и участвуйте в уроках
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="teacher"
                    name="role"
                    type="radio"
                    value="teacher"
                    checked={role === 'teacher'}
                    onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="teacher" className="ml-3 block text-sm font-medium text-gray-700">
                    Преподаватель
                    <span className="block text-xs text-gray-500">
                      Создавайте и проводите уроки для студентов
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Регистрация...
                  </div>
                ) : (
                  'Зарегистрироваться'
                )}
              </button>
            </div>

            {/* Additional info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                После нажатия кнопки вам будет отправлено письмо для подтверждения регистрации
              </p>
            </div>
          </form>

          {/* Link to login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Уже есть аккаунт?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Войти в существующий аккаунт
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
