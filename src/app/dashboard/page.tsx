'use client';

import { useEffect, useState } from 'react';
import { supabase, getUserProfile, UserProfile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/signup');
          return;
        }

        setUser(user);

        const { data: profileData, error: profileError } = await getUserProfile(user.id);
        
        if (profileError) {
          console.error('Ошибка получения профиля:', profileError);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();

    // Подписка на изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/signup');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Платформа уроков
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Добро пожаловать{profile?.role === 'teacher' ? ', преподаватель' : ', студент'}!
              </h2>
              
              {profile && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Информация о профиле
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Роль:</strong> {profile.role === 'teacher' ? 'Преподаватель' : 'Студент'}</p>
                    <p><strong>Дата регистрации:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {profile?.role === 'teacher' ? (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Возможности преподавателя
                  </h3>
                  <p className="text-blue-700">
                    Здесь вы сможете создавать и проводить уроки с помощью LiveKit.
                  </p>
                  <button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => alert('Функционал в разработке')}
                  >
                    Создать урок
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-green-900 mb-2">
                    Возможности студента
                  </h3>
                  <p className="text-green-700">
                    Здесь вы сможете присоединяться к урокам и взаимодействовать с преподавателями.
                  </p>
                  <button
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    onClick={() => alert('Функционал в разработке')}
                  >
                    Найти уроки
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
