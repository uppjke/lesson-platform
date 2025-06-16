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

    // Отображаем все уроки (фильтрация по уровню убрана)
    const filteredLessons = lessons;

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

                {/* Lessons Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Урок
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
