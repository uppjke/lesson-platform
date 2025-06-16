'use client';

import { useState, useEffect } from 'react';
import { getPublishedLessons, enrollInLesson, Lesson } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LessonsPage() {
    const { user, loading: authLoading } = useAuth();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
    const [enrolling, setEnrolling] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                router.push('/');
                return;
            }

            try {
                // Загружаем уроки из Supabase
                const { data: lessonsData, error: lessonsError } = await getPublishedLessons();
                
                if (lessonsError) {
                    console.error('Ошибка загрузки уроков:', lessonsError);
                    setLessons([]);
                } else {
                    setLessons(lessonsData || []);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                setLessons([]);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            loadData();
        }
    }, [user, authLoading, router]);

    const handleEnroll = async (lessonId: string) => {
        if (!user) return;
        
        setEnrolling(lessonId);
        try {
            const { error } = await enrollInLesson(lessonId, user.id);
            if (error) {
                console.error('Ошибка записи на урок:', error);
                alert('Ошибка записи на урок: ' + error.message);
            } else {
                alert('Вы успешно записались на урок!');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при записи на урок');
        } finally {
            setEnrolling(null);
        }
    };

    const filteredLessons = filter === 'all'
        ? lessons
        : lessons.filter(lesson => lesson.level === filter);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка уроков...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                                📚 LessonPlatform
                            </Link>
                        </div>
                        <nav className="flex items-center space-x-6">
                            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
                                Dashboard
                            </Link>
                            <Link href="/lessons" className="text-blue-600 font-medium">
                                Уроки
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Доступные уроки
                    </h1>
                    <p className="text-gray-600">
                        Выберите урок для изучения новых навыков
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'Все уровни' },
                            { key: 'beginner', label: 'Начинающий' },
                            { key: 'intermediate', label: 'Средний' },
                            { key: 'advanced', label: 'Продвинутый' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key as 'all' | 'beginner' | 'intermediate' | 'advanced')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filter === key
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                        lesson.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                        lesson.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {lesson.level === 'beginner' ? 'Начинающий' :
                                         lesson.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {lesson.duration} мин
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {lesson.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {lesson.description}
                            </p>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">
                                    Преподаватель: {lesson.profiles?.full_name || 'Неизвестный преподаватель'}
                                </p>
                                
                                {lesson.subjects && lesson.subjects.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {lesson.subjects.map((subject, index) => (
                                            <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-green-600">
                                    {lesson.price > 0 ? `${lesson.price}₽` : 'Бесплатно'}
                                </span>
                                
                                <button
                                    onClick={() => handleEnroll(lesson.id)}
                                    disabled={enrolling === lesson.id}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {enrolling === lesson.id ? 'Записываем...' : 'Записаться'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredLessons.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {loading ? 'Загрузка уроков...' : 'Уроки не найдены'}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            {lessons.length === 0 ? 
                                'Преподаватели еще не создали уроки или база данных не настроена' :
                                'Попробуйте изменить фильтр уровня сложности'
                            }
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
