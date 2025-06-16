'use client';

import { useAuth } from './AuthProvider';
import Logo from './Logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center">
            <Logo size="sm" className="text-blue-600 hover:text-blue-700 transition-colors" />
          </Link>

          {/* Навигация */}
          {user ? (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/lessons" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Уроки
              </Link>
              
              {/* Профиль пользователя */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden lg:block">
                    {user.email}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  Выйти
                </button>
              </div>
            </nav>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Войти
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Начать обучение
              </button>
            </div>
          )}

          {/* Мобильное меню (можно расширить позже) */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition-colors text-sm"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </header>
  );
}
