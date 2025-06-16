'use client';

import { useEffect, useState } from 'react';
import { mockSupabaseClient, getCurrentDemoUser, UserProfile } from '@/lib/supabase-demo';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизованного пользователя (демо-режим)
    const checkUser = async () => {
      try {
        const currentUser = getCurrentDemoUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Ошибка проверки пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleSignOut = async () => {
    try {
      await mockSupabaseClient.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
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
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Начать обучение
                  </Link>
                </div>
              )}
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

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Зарегистрироваться
              </Link>
              <Link
                href="/signup"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Войти как преподаватель
              </Link>
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
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Начать бесплатно
            </Link>
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
    </div>
  );
}