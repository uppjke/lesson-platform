'use client';

import { useEffect, useState, Suspense } from 'react';
import { smartSupabaseClient, isDemoMode, getUserProfile, UserProfile } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';

function HomeContent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Проверяем ошибки авторизации из URL
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'auth_error':
          setAuthError('Ошибка авторизации. Попробуйте еще раз.');
          break;
        case 'unexpected_error':
          setAuthError('Произошла неожиданная ошибка. Попробуйте еще раз.');
          break;
        default:
          setAuthError('Произошла ошибка. Попробуйте еще раз.');
      }
      setAuthModalOpen(true);
      // Очищаем URL от параметра ошибки
      router.replace('/');
    }

    // Проверяем авторизованного пользователя
    const checkUser = async () => {
      try {
        const { data: userProfile } = await getUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error('Ошибка проверки пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [searchParams, router]);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleSignOut = async () => {
    try {
      await smartSupabaseClient.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const handleAuthSuccess = () => {
    // Обновляем состояние пользователя после успешной авторизации
    const checkUser = async () => {
      try {
        const { data: userProfile } = await getUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error('Ошибка проверки пользователя:', error);
      }
    };
    checkUser();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                📚 LessonPlatform
              </h1>
              {/* Индикатор режима */}
              {isDemoMode() && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  🎭 Demo
                </span>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Добро пожаловать, {user.email}
                  </span>
                  <Link
                    href="/lessons"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Уроки
                  </Link>
                  <button
                    onClick={handleGoToDashboard}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Панель управления
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Начать обучение
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Статус режима */}
        {isDemoMode() ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-800">
                  🎭 Демонстрационный режим
                </h3>
                <div className="mt-2 text-blue-700">
                  <p>
                    Платформа работает в демо-режиме. Вы можете полноценно протестировать все функции!
                    Для запуска в production следуйте инструкции в <strong>PRODUCTION_SETUP.md</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-green-800">
                  🚀 Production режим активен
                </h3>
                <div className="mt-2 text-green-700">
                  <p>
                    Платформа работает в production режиме с реальным Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Современная платформа
            <br />
            <span className="text-blue-600">для онлайн-обучения</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Изучайте новые навыки с помощью интерактивных уроков,
            видеозвонков с преподавателями и персонализированных программ обучения.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Зарегистрироваться
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Войти как преподаватель
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Интерактивные уроки
            </h3>
            <p className="text-gray-600">
              Проходите уроки в удобном темпе с интерактивными заданиями и мгновенной обратной связью.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📹</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Видеозвонки с преподавателями
            </h3>
            <p className="text-gray-600">
              Получайте персональные консультации и участвуйте в групповых занятиях через видеозвонки.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Отслеживание прогресса
            </h3>
            <p className="text-gray-600">
              Следите за своими достижениями и получайте рекомендации для дальнейшего развития.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-20 bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Готовы начать обучение?
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Присоединяйтесь к тысячам студентов, которые уже изучают новые навыки на нашей платформе.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Начать бесплатно
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 LessonPlatform. Создано с помощью Next.js 15 и Supabase.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthError(null);
        }}
        onSuccess={handleAuthSuccess}
        initialError={authError}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}