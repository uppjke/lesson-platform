'use client';

import { useState, useEffect } from 'react';
import { supabase, getUserProfile, UserProfile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface Lesson {
    id: string;
    title: string;
    description: string;
    teacher_id: string;
    teacher_name: string;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    subjects: string[];
    created_at: string;
}

export default function LessonsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    router.push('/');
                    return;
                }

                setUser(user);

                const { data: profileData } = await getUserProfile(user.id);
                setProfile(profileData);

                // Загружаем уроки (временно используем mock данные)
                setLessons(mockLessons);
            } catch (error) {
                console.error('Ошибка:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const filteredLessons = filter === 'all'
        ? lessons
        : lessons.filter(lesson => lesson.level === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="text-2xl font-bold text-gray-900">
                                📚 LessonPlatform
                            </Link>
                            <nav className="hidden md:flex space-x-8">
                                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                                    Панель управления
                                </Link>
                                <Link href="/lessons" className="text-blue-600 font-medium">
                                    Уроки
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {user?.email} ({profile?.role === 'teacher' ? 'Преподаватель' : 'Студент'})
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Доступные уроки
                    </h1>
                    <p className="text-gray-600">
                        Найдите подходящий урок и начните обучение уже сегодня
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Все уроки
                        </button>
                        <button
                            onClick={() => setFilter('beginner')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'beginner'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Начинающий
                        </button>
                        <button
                            onClick={() => setFilter('intermediate')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'intermediate'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Средний
                        </button>
                        <button
                            onClick={() => setFilter('advanced')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'advanced'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Продвинутый
                        </button>
                    </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {lesson.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${lesson.level === 'beginner'
                                        ? 'bg-green-100 text-green-800'
                                        : lesson.level === 'intermediate'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {lesson.level === 'beginner' ? 'Начинающий' :
                                        lesson.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4">
                                {lesson.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {lesson.subjects.map((subject, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                        {subject}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                <span>Преподаватель: {lesson.teacher_name}</span>
                                <span>Длительность: {lesson.duration} мин</span>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                Записаться на урок
                            </button>
                        </div>
                    ))}
                </div>

                {filteredLessons.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            Уроки данного уровня пока не найдены
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

// Mock данные для демонстрации
const mockLessons: Lesson[] = [
    {
        id: '1',
        title: 'Введение в JavaScript',
        description: 'Изучите основы JavaScript с нуля. Переменные, функции, условия и циклы.',
        teacher_id: '1',
        teacher_name: 'Анна Смирнова',
        duration: 60,
        level: 'beginner',
        subjects: ['JavaScript', 'Программирование'],
        created_at: '2024-01-15'
    },
    {
        id: '2',
        title: 'React Hooks на практике',
        description: 'Глубокое изучение React Hooks: useState, useEffect, useContext и создание собственных хуков.',
        teacher_id: '2',
        teacher_name: 'Максим Петров',
        duration: 90,
        level: 'intermediate',
        subjects: ['React', 'Frontend'],
        created_at: '2024-01-16'
    },
    {
        id: '3',
        title: 'Архитектура микросервисов',
        description: 'Проектирование и реализация микросервисной архитектуры с использованием современных технологий.',
        teacher_id: '3',
        teacher_name: 'Дмитрий Козлов',
        duration: 120,
        level: 'advanced',
        subjects: ['Архитектура', 'Backend'],
        created_at: '2024-01-17'
    },
    {
        id: '4',
        title: 'HTML и CSS для начинающих',
        description: 'Основы веб-разработки: HTML разметка, CSS стили, Flexbox и Grid.',
        teacher_id: '4',
        teacher_name: 'Елена Иванова',
        duration: 75,
        level: 'beginner',
        subjects: ['HTML', 'CSS', 'Frontend'],
        created_at: '2024-01-18'
    },
    {
        id: '5',
        title: 'TypeScript в больших проектах',
        description: 'Использование TypeScript для создания масштабируемых приложений. Типы, интерфейсы, декораторы.',
        teacher_id: '5',
        teacher_name: 'Сергей Волков',
        duration: 100,
        level: 'intermediate',
        subjects: ['TypeScript', 'JavaScript'],
        created_at: '2024-01-19'
    },
    {
        id: '6',
        title: 'Machine Learning с Python',
        description: 'Введение в машинное обучение. Pandas, NumPy, Scikit-learn на практических примерах.',
        teacher_id: '6',
        teacher_name: 'Ольга Федорова',
        duration: 150,
        level: 'advanced',
        subjects: ['Python', 'ML', 'Data Science'],
        created_at: '2024-01-20'
    }
];
