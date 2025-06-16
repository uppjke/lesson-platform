# Coding guidelines  (обязательны)
- Frontend: Next.js 15 (App Router, React Server Components) + TypeScript
- Styling: Tailwind CSS v4 **ТОЛЬКО через CSS-tokens** из /styles/design-tokens.css  
  · цвета      → bg-[--color-primary] / text-[--color-muted]  
  · отступы    → p-[--spacing-4]      / gap-[--spacing-2]  
  · радиусы    → rounded-[--radius-lg]
- UI primitives: shadcn/ui (импортировать кодом, без сторонних UI-китов)
- Auth & DB: Supabase (Auth + Postgres 17 + Storage), Row-Level Security
- Realtime: LiveKit 1.9 (React SDK)  — **НЕ** Jitsi, **НЕ** Twilio
- Whiteboard: tldraw + Liveblocks CRDT
- Payments: Stripe Checkout/Billing
- Tests: Vitest + Playwright
- Комментарии бизнес-логики — на русском
- Для тёмной темы используем селектор `html[data-theme='dark']`
- Каждый новый CSS-токен сначала добавлять в /styles/design-tokens.css

# Output conventions
1. В JSX-коде использовать ТОЛЬКО утилиты Tailwind и переменные CSS-tokens  
   `className="bg-[--color-bg] text-[--color-foreground]"`,  
   **inline-style запрещён**, кроме dynamic width/height.
2. Все компоненты должны поддерживать тёмную тему без дополнительного JS.
3. Сторонние иконки — lucide-react; анимации — framer-motion.
4. Файлы тестов:  
   · unit — `*.test.ts` (Vitest)  
   · e2e — `*.spec.ts` (Playwright)  
   Расширения не смешивать.

# Запрещено
- Firebase Auth / Firestore
- styled-components, Emotion, CSS-Modules, CSS-in-JS
- UI-киты: MUI, Chakra, AntD, Bootstrap
- Хардкод цветов вида `#3498db` или `bg-blue-500`
- inline style={{ … }}, кроме неизбежных случаев (документировать!)