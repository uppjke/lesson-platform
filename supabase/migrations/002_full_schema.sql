-- Расширенная схема базы данных для lesson-platform

-- Создание таблицы профилей пользователей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Таблица уроков
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration INTEGER DEFAULT 60, -- в минутах
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  subjects TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) DEFAULT 0,
  max_students INTEGER DEFAULT 10,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Политики для lessons
CREATE POLICY "Anyone can view published lessons" ON lessons
  FOR SELECT USING (status = 'published');

CREATE POLICY "Teachers can manage own lessons" ON lessons
  FOR ALL USING (auth.uid() = teacher_id);

-- Таблица записей на уроки
CREATE TABLE lesson_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('enrolled', 'completed', 'cancelled')) DEFAULT 'enrolled',
  UNIQUE(lesson_id, student_id)
);

ALTER TABLE lesson_enrollments ENABLE ROW LEVEL SECURITY;

-- Политики для lesson_enrollments
CREATE POLICY "Students can view own enrollments" ON lesson_enrollments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view enrollments for their lessons" ON lesson_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lessons 
      WHERE lessons.id = lesson_enrollments.lesson_id 
      AND lessons.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in lessons" ON lesson_enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Таблица расписания уроков
CREATE TABLE lesson_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60, -- в минутах
  room_url TEXT, -- для видеозвонков
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE lesson_sessions ENABLE ROW LEVEL SECURITY;

-- Политики для lesson_sessions
CREATE POLICY "Students can view sessions for enrolled lessons" ON lesson_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lesson_enrollments 
      WHERE lesson_enrollments.lesson_id = lesson_sessions.lesson_id 
      AND lesson_enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage sessions for own lessons" ON lesson_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM lessons 
      WHERE lessons.id = lesson_sessions.lesson_id 
      AND lessons.teacher_id = auth.uid()
    )
  );

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Вставка тестовых данных
INSERT INTO profiles (id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'teacher1@example.com', 'Анна Смирнова', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440002', 'teacher2@example.com', 'Максим Петров', 'teacher');

INSERT INTO lessons (title, description, teacher_id, duration, level, subjects, status) VALUES
  (
    'Введение в JavaScript',
    'Изучите основы JavaScript с нуля. Переменные, функции, условия и циклы.',
    '550e8400-e29b-41d4-a716-446655440001',
    60,
    'beginner',
    ARRAY['JavaScript', 'Программирование'],
    'published'
  ),
  (
    'React Hooks на практике',
    'Глубокое изучение React Hooks: useState, useEffect, useContext и создание собственных хуков.',
    '550e8400-e29b-41d4-a716-446655440002',
    90,
    'intermediate',
    ARRAY['React', 'Frontend'],
    'published'
  ),
  (
    'TypeScript в больших проектах',
    'Использование TypeScript для создания масштабируемых приложений.',
    '550e8400-e29b-41d4-a716-446655440002',
    100,
    'intermediate',
    ARRAY['TypeScript', 'JavaScript'],
    'published'
  );
