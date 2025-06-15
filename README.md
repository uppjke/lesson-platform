# Платформа уроков

Полнофункциональная платформа для проведения онлайн уроков с использованием Next.js 15, Supabase и LiveKit.

## 🚀 Технологии

- **Next.js 15** с App Router и TypeScript
- **Tailwind CSS v4** с дизайн-токенами
- **Supabase** для аутентификации и базы данных
- **LiveKit 1.9** для WebRTC видеосвязи
- **pnpm** как пакетный менеджер

## 📋 Функции

- ✅ Регистрация и аутентификация пользователей
- ✅ Роли: студент/преподаватель
- ✅ Passkey поддержка с Magic Link fallback
- ✅ Дизайн-токены в /styles/design-tokens.css
- ✅ Респонсивный дизайн с Tailwind CSS
- 🚧 LiveKit интеграция для видео уроков (в разработке)

## 🛠 Настройка проекта

### 1. Установка зависимостей

\`\`\`bash
pnpm install
\`\`\`

### 2. Настройка Supabase

1. Создайте проект в [Supabase](https://supabase.com)
2. Выполните SQL из файла \`supabase/setup.sql\` в SQL Editor вашего проекта
3. Скопируйте \`.env.example\` в \`.env.local\` и заполните переменные:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Настройка LiveKit (опционально)

1. Зарегистрируйтесь в [LiveKit Cloud](https://livekit.io)
2. Добавьте переменные в \`.env.local\`:

\`\`\`env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
\`\`\`

### 4. Запуск проекта

\`\`\`bash
pnpm dev
\`\`\`

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

\`\`\`
src/
├── app/                    # App Router страницы
│   ├── auth/
│   │   └── callback/      # Callback для аутентификации
│   ├── dashboard/         # Главная страница после входа
│   ├── signup/            # Страница регистрации
│   ├── globals.css        # Глобальные стили
│   └── page.tsx           # Главная страница (редирект)
├── lib/
│   └── supabase.ts        # Конфигурация Supabase
styles/
└── design-tokens.css      # Дизайн-токены
supabase/
└── setup.sql              # SQL для настройки БД
\`\`\`

## 🎨 Дизайн-токены

Все дизайн-токены определены в \`/styles/design-tokens.css\` и используются через CSS переменные:

- **Цвета**: \`--color-primary\`, \`--color-success\`, etc.
- **Типографика**: \`--font-size-*\`
- **Отступы**: \`--spacing-*\`
- **Радиусы**: \`--radius-*\`
- **Тени**: \`--shadow-*\`

## 👥 Роли пользователей

### Студент
- Регистрация с ролью "студент"
- Просмотр доступных уроков
- Участие в уроках

### Преподаватель
- Регистрация с ролью "преподаватель"
- Создание и управление уроками
- Проведение видео уроков

## 🔐 Аутентификация

Используется Supabase Auth с поддержкой:
- Magic Link (основной метод)
- Email + OTP
- Fallback для Passkey (готов к реализации)

## 📝 Разработка

### Команды

\`\`\`bash
pnpm dev          # Запуск в режиме разработки
pnpm build        # Сборка для продакшена
pnpm start        # Запуск продакшен сборки
pnpm lint         # Проверка линтером
\`\`\`

### Добавление новых токенов

1. Добавьте CSS переменную в \`styles/design-tokens.css\`
2. Обновите \`tailwind.config.js\` для использования через \`@theme\`
3. Импортируйте в \`globals.css\`

## 🚀 Деплой

Проект готов к деплою на Vercel:

1. Подключите GitHub репозиторий к Vercel
2. Добавьте переменные окружения в настройках проекта
3. Деплойте!

## 📄 Лицензия

MIT
