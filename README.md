# Certificate Verification Platform

A React + Vite + TypeScript certificate verification site with the existing IABAC visual design preserved. The browser calls a Cloudflare Worker API, and the Worker uses Neon PostgreSQL for certificate data and secure admin sessions.

## Architecture

`React/Vite → Cloudflare Pages → Cloudflare Worker API → Neon PostgreSQL`

The public `/` and `/verify` pages require no authentication. The `/admin` page uses email/password authentication with a server-side PBKDF2 password hash, an opaque HTTP-only session cookie, expiration, and logout invalidation. No database credentials or private secrets are exposed to the browser.

## Local development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Set `VITE_API_URL` to a running Worker URL when the API is not proxied locally. Check and build the Pages frontend with:

```bash
pnpm run check
pnpm run build
```

Run the Worker locally with `pnpm run worker:dev` after configuring Wrangler secrets or a local `worker/.dev.vars` file.

## Deployment

Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for Neon setup, admin creation, Worker secrets, Cloudflare Pages configuration, and validation. See [DATABASE.md](./DATABASE.md) for the schema and seed procedure.

The admin QR generator uses `${window.location.origin}/verify`, so production QR codes automatically use the real Pages origin and never a hardcoded localhost or API URL.
