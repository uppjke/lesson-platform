# 🚀 Настройка полноценной авторизации с Supabase

## Текущее состояние

✅ **Работает демо-режим** - вы можете тестировать интерфейс регистрации
❌ **Не работает** - реальная отправка Magic Link и сохранение пользователей

## Шаги для настройки реального Supabase

### 1. Создание проекта Supabase

1. Перейдите на [https://supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Создайте аккаунт или войдите
4. Нажмите "New Project"
5. Заполните данные:
   - **Name**: lesson-platform
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший регион
6. Нажмите "Create new project"

### 2. Получение credentials

После создания проекта:

1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://abcdefgh.supabase.co`)
   - **Project API Key** → **anon** **public** (длинный JWT токен)

### 3. Обновление .env.local

Замените значения в файле `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ
```

### 4. Выполнение SQL миграции

1. В панели Supabase перейдите в **SQL Editor**
2. Выполните содержимое файла `supabase/migrations/001_initial_setup.sql`:

```sql
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

-- Политики безопасности...
-- (остальной код из файла)
```

### 5. Настройка аутентификации

1. В панели Supabase перейдите в **Authentication** → **Settings**
2. Настройте **Site URL**:
   - Для разработки: `http://localhost:3001`
   - Для продакшена: ваш домен
3. Добавьте **Redirect URLs**:
   - `http://localhost:3001/auth/callback`
   - ваш_домен/auth/callback (для продакшена)

### 6. Тестирование

После выполнения всех шагов:

1. Перезапустите приложение: `pnpm dev`
2. Перейдите на `/signup`
3. Введите реальный email и выберите роль
4. Нажмите "Зарегистрироваться с Magic Link"
5. Проверьте email - должно прийти письмо от Supabase
6. Перейдите по ссылке в письме

## Альтернатива: Локальный Supabase

Если у вас есть Docker, можете запустить локальный Supabase:

```bash
# Установка Supabase CLI (уже сделано)
supabase start

# Применение миграций
supabase db reset

# Получение локальных credentials
supabase status
```

Затем используйте локальные credentials в `.env.local`.

## После настройки

Когда Supabase настроен, автоматически заработают:

- ✅ Отправка Magic Link на email
- ✅ Создание пользователей в auth.users
- ✅ Создание профилей в таблице profiles
- ✅ Авторизация и сессии
- ✅ Переход к следующим модулям (Dashboard, Lessons)

## Нужна помощь?

Сообщите, на каком шаге возникли проблемы, и я помогу их решить!
