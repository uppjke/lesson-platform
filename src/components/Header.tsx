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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-3">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className="flex items-center cursor-default"
          >
            <Logo size="md" className="text-gray-900" />
          </Link>

          {/* Навигация */}
          {user ? (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Дашборд
              </Link>
              <Link 
                href="/lessons" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Уроки
              </Link>
              
              {/* Профиль пользователя */}
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-base font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-base font-medium text-gray-900 block">
                      {user.email}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition-all duration-200 text-base font-medium px-4 py-2 rounded-md hover:bg-red-50 transform hover:scale-105"
                >
                  Выйти
                </button>
              </div>
            </nav>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-all duration-200 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transform hover:scale-105 text-base"
              >
                Войти
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-lg transform hover:scale-105 text-base"
              >
                Регистрация
              </button>
            </div>
          )}

          {/* Мобильное меню */}
          {user && (
            <div className="md:hidden flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-base font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition-all duration-200 text-base font-medium px-3 py-2 rounded hover:bg-red-50 transform hover:scale-105"
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
