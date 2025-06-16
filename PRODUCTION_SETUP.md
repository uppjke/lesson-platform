# 🚀 Переход к продакшн-режиму

## Текущее состояние
- ✅ Демо-режим работает полностью
- ✅ Все компоненты протестированы
- ❌ Требуется настройка реального Supabase

## Шаги перехода к продакшену

### 1. Создание Supabase проекта

1. **Перейдите на [supabase.com](https://supabase.com)**
2. **Создайте аккаунт** или войдите
3. **Нажмите "New Project"**
4. **Заполните данные:**
   - Name: `lesson-platform`
   - Database Password: (сгенерируйте надежный пароль)
   - Region: Europe West (или ближайший)
5. **Дождитесь создания** (1-2 минуты)

### 2. Получение production credentials

После создания проекта:

1. **Перейдите в Settings → API**
2. **Скопируйте:**
   - **Project URL**: `https://ваш-проект-id.supabase.co`
   - **anon/public key**: `eyJ...` (длинный JWT токен)

### 3. Обновление переменных окружения

Замените содержимое `.env.local`:

\`\`\`bash
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ

# LiveKit (опционально, для видео-уроков)
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
\`\`\`

### 4. Применение схемы базы данных

В **Supabase Dashboard → SQL Editor** выполните:

\`\`\`sql
-- Создание таблицы профилей пользователей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут видеть только свой профиль
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Политика: пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Политика: система может создавать профили
CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
\`\`\`

### 5. Настройка аутентификации

В **Authentication → Settings**:

1. **Site URL**: 
   - Development: `http://localhost:3001`
   - Production: `https://ваш-домен.com`

2. **Redirect URLs**:
   - `http://localhost:3001/auth/callback`
   - `https://ваш-домен.com/auth/callback`

3. **Enable email confirmations**: ✅
4. **Email templates**: настройте по желанию

### 6. Переключение кода на production

После настройки Supabase и обновления `.env.local`:

1. **Перезапустите приложение**: `pnpm dev`
2. **Проверьте консоль** - не должно быть предупреждений о демо-режиме
3. **Протестируйте регистрацию** с реальным email
4. **Проверьте получение Magic Link** в почте

### 7. Обновление для production

После успешного тестирования замените:

- `src/app/signup/page.tsx` → убрать демо-уведомления
- `src/app/login/page.tsx` → убрать демо-кнопки  
- `src/app/dashboard/page.tsx` → убрать демо-статистику
- `src/lib/supabase.ts` → использовать вместо mock-клиента

## Проверка готовности

- [ ] Supabase проект создан
- [ ] Credentials обновлены в .env.local
- [ ] Схема БД применена
- [ ] Настройки аутентификации сохранены
- [ ] Тестовая регистрация прошла успешно
- [ ] Magic Link приходит на email
- [ ] Профиль создается в таблице profiles
- [ ] Dashboard загружается с реальными данными

После выполнения всех шагов проект будет готов к продакшену! 🎉
