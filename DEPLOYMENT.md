# Deployment Guide

## 1. Architecture and prerequisites

Create a Neon account, a Cloudflare account, and install Node.js, pnpm, and Wrangler. The frontend is a static Pages site; the API is a separate Worker; Neon is reachable only from the Worker.

## 2. Neon setup

1. Create a Neon project and PostgreSQL database.
2. Copy the pooled PostgreSQL connection string.
3. Apply `database/schema.sql` from the Neon SQL Editor or with `psql "$DATABASE_URL" -f database/schema.sql`.
4. The migration creates the `admins`, `admin_sessions`, and `certificates` tables and idempotently seeds certificate `603778716` for Aida Badri.
5. Generate a PBKDF2 admin hash with the helper in `worker/src/auth.ts` or use the documented setup script below, then insert the admin row. Never insert a plaintext password.

A simple one-off setup can use the included local helper, then SQL with the generated hash:

```sql
INSERT INTO admins (email, password_hash)
VALUES ('admin@example.com', 'pbkdf2$210000$REPLACE_WITH_SALT$REPLACE_WITH_DIGEST');
```

Generate the value without storing the plaintext in the project:

```bash
node scripts/hash-password.mjs 'choose-a-strong-password'
```

Replace the placeholder with the command output, run the insert once, and then clear your shell history if the password was typed directly in a command.

## 3. Cloudflare Worker

```bash
pnpm install
pnpm wrangler login
pnpm wrangler secret put DATABASE_URL --config worker/wrangler.toml
pnpm wrangler secret put SESSION_SECRET --config worker/wrangler.toml
pnpm wrangler deploy --config worker/wrangler.toml
```

`SESSION_SECRET` is retained as a deployment secret for future key rotation and must be a long random value. Record the actual Worker URL returned by Wrangler as `YOUR_WORKER_URL`.

Update `worker/wrangler.toml` so `ALLOWED_ORIGIN` is the actual Pages origin. Redeploy after changing it.

## 4. Cloudflare Pages

Create a Pages project connected to this repository. Use:

- Build command: `pnpm run build`
- Output directory: `dist`
- Root directory: repository root

Set the public Pages environment variable `VITE_API_URL` to `YOUR_WORKER_URL` for production builds. This is a public API origin, not a secret. Pages includes `client/public/_redirects`, which keeps `/`, `/verify`, and `/admin` on the React SPA entry point.

## 5. Local development

```bash
cp .env.example .env
# VITE_API_URL=https://YOUR_WORKER_URL
pnpm dev
pnpm run check
pnpm run build
pnpm run worker:dev
```

For local Worker secrets, create `worker/.dev.vars` (never commit it):

```text
DATABASE_URL=YOUR_NEON_DATABASE_URL
SESSION_SECRET=local-development-random-secret
ALLOWED_ORIGIN=http://localhost:5173
```

## 6. Testing

Verify `/` and `/verify`; submit `603778716` and confirm Aida Badri, N974687, 09/03/1982, Formation en Data Science, and `valid`. Verify an unknown code shows the existing not-found UI. Open `/admin`, log in, create/edit/delete a record, and verify it publicly. Confirm unauthenticated requests to `/api/admin/certificates` return 401. Generate a QR and confirm it opens the Pages `/verify` route.

## 7. Updates and troubleshooting

After Worker code changes, run `pnpm run check` and redeploy the Worker. After frontend changes, run `pnpm run check`, `pnpm run build`, and deploy Pages. A CORS error means `ALLOWED_ORIGIN` does not exactly match the Pages origin. A 401 means the session cookie is missing, expired, or the request is not using credentials. A database error means `DATABASE_URL` is missing or the schema has not been applied.

No production domain, Worker URL, account ID, database URL, password, or secret is included in this repository; replace the placeholders with values from your own accounts.
