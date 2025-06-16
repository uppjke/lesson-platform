'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';

function HomeContent() {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Проверяем ошибки авторизации из URL
  useEffect(() => {
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
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  // Автоматическое перенаправление авторизованных пользователей
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleAuthSuccess = () => {
    // AuthProvider автоматически обновит состояние
    setAuthModalOpen(false);
    setAuthError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если пользователь авторизован, показываем загрузку пока не произойдет redirect
  if (user) {
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
            </div>
            <nav className="flex items-center space-x-4">
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
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        </div>

        {/* Setup Notice */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <span className="text-yellow-600 text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Настройка Supabase требуется
              </h3>
              <p className="text-yellow-700 text-sm">
                Для полноценной работы приложения необходимо настроить Supabase. 
                Обновите переменные окружения в <code className="bg-yellow-100 px-1 rounded">.env.local</code> с реальными credentials из вашего Supabase проекта.
                Смотрите инструкции в <code className="bg-yellow-100 px-1 rounded">SUPABASE_SETUP.md</code>.
              </p>
            </div>
          </div>
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
              Общайтесь с опытными преподавателями в режиме реального времени через встроенные видеозвонки.
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
              Следите за своими достижениями, получайте сертификаты и ставьте новые цели в обучении.
            </p>
          </div>
        </div>
      </main>

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
