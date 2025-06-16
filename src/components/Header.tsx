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
    <>
      <header 
        className="bg-white border-b border-gray-200 rounded"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <Link 
              href={user ? "/dashboard" : "/"} 
              className="flex items-center transition-transform hover:scale-105"
            >
              <Logo size="md" />
            </Link>

            {/* Навигация */}
            {user ? (
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-50 transition-all duration-200 rounded"
                >
                  Дашборд
                </Link>
                <Link 
                  href="/lessons" 
                  className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-50 transition-all duration-200 rounded"
                >
                  Уроки
                </Link>
                
                {/* Профиль пользователя */}
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <span className="text-sm font-medium text-gray-900">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 font-medium px-4 py-2 hover:bg-red-50 transition-all duration-200 rounded"
                  >
                    Выйти
                  </button>
                </div>
              </nav>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-50 transition-all duration-200 rounded"
                >
                  Войти
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-black text-white font-medium px-6 py-2 hover:bg-gray-800 transition-all duration-200 rounded"
                >
                  Начать
                </button>
              </div>
            )}

            {/* Мобильное меню */}
            {user && (
              <div className="md:hidden flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 font-medium px-3 py-2 hover:bg-red-50/80 transition-all duration-200 rounded-floating"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
