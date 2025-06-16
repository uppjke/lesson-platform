# 📚 LessonPlatform - Платформа онлайн-обучения

Современная платформа для онлайн-обучения, построенная на Next.js 15, Tailwind CSS v4 и Supabase.

## ✨ Особенности

- 🎭 **Демо-режим** - полностью функциональная демонстрация без настройки Supabase
- 🚀 **Production-ready** - автоматическое переключение на реальный Supabase
- 🔐 **Magic Link авторизация** - безопасный вход по email
- 👥 **Роли пользователей** - студенты и преподаватели
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🎨 **Современный UI** - с Tailwind CSS v4 и design tokens

## 🚀 Быстрый старт

### 1. Установка

```bash
git clone https://github.com/uppjke/lesson-platform.git
cd lesson-platform
npm install
```

### 2. Запуск в демо-режиме

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) и протестируйте демо:

- **Войти как студент:** `student@example.com`
- **Войти как преподаватель:** `teacher@example.com`

### 3. Настройка для production

Следуйте подробной инструкции в [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)

## 🎯 Режимы работы

### Демо-режим (по умолчанию)
- ✅ Полная симуляция всех функций
- ✅ Тестовые пользователи
- ✅ Локальная "база данных"
- ℹ️ Индикация демо-режима в интерфейсе

### Production-режим 
- ✅ Реальный Supabase backend
- ✅ Настоящая отправка email
- ✅ Постоянная база данных
- ✅ Автоматическое определение режима

## 📁 Структура проекта

```
src/
├── app/
│   ├── login/          # Страница входа (demo/production)
│   ├── signup/         # Страница регистрации
│   ├── dashboard/      # Панель управления
│   ├── auth/callback/  # Обработка Magic Link
│   └── lessons/        # Страница уроков
├── lib/
│   ├── supabase.ts     # Основной Supabase клиент
│   ├── auth-client.ts  # Умный клиент (demo/production)
│   └── supabase-demo.ts # Mock клиент для демо
└── styles/
    └── design-tokens.css # Tailwind v4 дизайн токены
```

## 🔧 Технологии

- **Frontend:** Next.js 15 (App Router), TypeScript, React 18
- **Стили:** Tailwind CSS v4 с design tokens
- **Backend:** Supabase (Auth + Database)
- **Деплой:** Готов для Vercel, Netlify
- **Видеозвонки:** LiveKit 1.9 (планируется)

## 🎮 Функционал

### Реализовано
- ✅ Magic Link авторизация
- ✅ Роли пользователей (студент/преподаватель)
- ✅ Профили пользователей
- ✅ Демо-режим с тестовыми данными
- ✅ Адаптивный дизайн
- ✅ Production-ready setup

### В планах
- 🔄 Управление уроками
- 🔄 Видеозвонки с LiveKit
- 🔄 Система платежей
- 🔄 Календарь занятий
- 🔄 Чат между участниками

## 📖 Документация

- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Настройка production
- [Database Schema](./docs/database.md) - Схема базы данных
- [API Documentation](./docs/api.md) - API эндпоинты

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку (`git checkout -b feature/amazing-feature`)
3. Коммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - смотрите [LICENSE](LICENSE) для деталей.

## 🙋‍♂️ Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [Issues](https://github.com/uppjke/lesson-platform/issues)
2. Создайте новый Issue
3. Обращайтесь к [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) для настройки

---

**Сделано с ❤️ для образования**
