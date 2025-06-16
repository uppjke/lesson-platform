# Coding guidelines  (обязательны)
- Frontend: Next.js 15 (App Router, React Server Components) + TypeScript
- Styling: Tailwind CSS v4 через CSS-tokens в /styles/design-tokens.css
- UI primitives: shadcn/ui (компоненты импортировать кодом)
- Auth & DB: Supabase (Auth + Postgres 17 + Storage), Row-Level Security
- Realtime: LiveKit 1.9 (React SDK)  — НЕ Jitsi, не Twilio
- Whiteboard: tldraw + Liveblocks CRDT
- Payments: Stripe Checkout/Billing
- Tests: Vitest + Playwright
- Комментарии бизнес-логики на русском

# Запрещено
- Не использовать Firebase Auth/Firestore
- Не добавлять styled-components, MUI, Chakra, AntD
- Не писать CSS вне Tailwind утилит и CSS-tokens