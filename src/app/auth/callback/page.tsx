'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, createUserProfile } from '@/lib/supabase';

function AuthCallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Получаем текущего пользователя
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Ошибка аутентификации:', error);
          router.push('/?error=auth_error');
          return;
        }

        if (user) {
          // Получаем данные из metadata (если это регистрация)
          const role = user.user_metadata?.role || 'student';
          const fullName = user.user_metadata?.full_name || '';

          // Пытаемся создать профиль пользователя (если он еще не существует)
          const { error: profileError } = await createUserProfile(
            user.id,
            user.email || '',
            role,
            fullName
          );

          // Игнорируем ошибку, если профиль уже существует
          if (profileError && !profileError.message.includes('duplicate key')) {
            console.error('Ошибка создания профиля:', profileError);
          }

          // Перенаправляем на главную страницу
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Неожиданная ошибка:', err);
        router.push('/?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <h2 className="text-lg font-medium text-gray-900">
              Завершаем регистрацию...
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Пожалуйста, подождите, пока мы настраиваем ваш аккаунт.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthCallbackComponent />
    </Suspense>
  );
}
