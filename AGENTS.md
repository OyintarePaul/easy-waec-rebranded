# Next.js + Supabase Starter Kit

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run update-types` — regenerate Supabase types from dashboard

## Environment

- `.env.local` is required for local development. It must contain at minimum:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SECRET_KEY`
  - `MONNIFY_API_KEY`, `MONNIFY_SECRET_KEY`, `MONNIFY_CONTRACT_CODE`
  - `RESEND_API_KEY`
  - VTPASS keys and `NEXT_PUBLIC_VTPASS_PUBLIC_KEY`
- `NEXT_PUBLIC_APP_URL` is used for auth redirect

## Key Conventions

- App Router enabled (`next.config.ts` with `experimental.serverActions.allowedOrigins: ["localhost:3000"]`)
- Supabase client in `lib/supabase/client.ts`, server in `lib/supabase/server.ts`
- Database tables: `profiles`, `pins`, `transactions` (see `lib/supabase/types.ts`)
- Enum: `transaction_status` = `PENDING | PROCESSING | SUCCESS | FAILED | PIN_DISPATCH_FAILED`
- Shadcn/ui components initialized (`components.json` exists); run `npx shadcn-ui@latest add <component>` to add new ones
- Email lib at `lib/email.ts`; Resend configured via `RESEND_API_KEY`
- Server Actions allowed only from `localhost:3000`

## Supabase Types

- Types auto-generated via `npm run update-types` — runs `supabase gen types typescript --linked --schema public > lib/supabase/types.ts`
- Types are in `lib/supabase/types.ts`; never edit manually unless regenerating

## Database

- Tables: `profiles`, `pins`, `transactions`
- Use Supabase SQL editor or migrations for schema changes
- RLS policies may be configured; check `lib/supabase/` for server-side helpers