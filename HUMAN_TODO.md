# Human checklist — things only you can do

The backend is built, tested, and wired to the frontend (see
[BACKEND_WORKFLOW.md](BACKEND_WORKFLOW.md) for what was done). Everything below
is account/credential/hosting work that needs a human. Nothing here blocks
local development — `backend/README.md` quick start + `npm run dev` already
work end to end on your machine.

## Before/at first deploy

1. **Create the Django admin superuser** (local or production):
   `cd backend && .venv/bin/python manage.py createsuperuser`
   Then log into `/admin/` — this is your ops dashboard for advancing order
   statuses, confirming appointments, and viewing client wishlists.

2. **Provision production Postgres** (Heroku Postgres add-on, Railway, RDS…)
   and set `DATABASE_URL` on the backend host.

3. **Deploy Django** (Heroku, as the README suggests, or any host):
   - Set env vars: `SECRET_KEY` (generate:
     `python -c "import secrets; print(secrets.token_urlsafe(50))"`),
     `DEBUG=false`, `ALLOWED_HOSTS=<api domain>`,
     `CORS_ALLOWED_ORIGINS=https://<frontend domain>`,
     **`DEMO_AUTH=false`**, **`SEED_NEW_USERS=false`** (or leave seeding on if
     you want demo data for early users).
   - Release commands: `python manage.py migrate && python manage.py collectstatic --noinput`
   - Procfile line if Heroku: `web: gunicorn config.wsgi`

4. **Deploy the frontend to Vercel** and set its env vars:
   - `BACKEND_API_URL=https://<api domain>` (server-side; the Route Handler proxy uses it)
   - `NEXT_PUBLIC_DEMO_AUTH=false` (turns off the "any credentials" preview mode)
   - `NEXT_PUBLIC_WHATSAPP=<your concierge WhatsApp number>`

5. **Media bucket (optional but recommended for production)** — Cloudflare R2
   or S3. Create a bucket + API token, then set on the backend:
   `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`,
   `AWS_S3_ENDPOINT_URL` (R2 endpoint), optionally `AWS_S3_CUSTOM_DOMAIN`.
   Without this, photos land on the server's local disk (fine for a single
   long-lived VPS; lost on Heroku dyno restarts).

## Nice-to-have / later

6. **Create an ADMIN user for staff API access** (role-based, separate from the
   superuser): in `/admin/` → Users → set `role = ADMIN` on the staff account.
   Admins see all orders via the API and may PATCH order status.

7. **Backups**: enable automated Postgres backups on your host.

8. **Local dev convenience**: `backend/.env` currently points at the local
   Postgres db `richfriend` (already created). If you ever work on a machine
   without Postgres, set `DATABASE_URL=` (empty) to use SQLite.

## What was intentionally NOT built (still open product decisions)

- Custom Next.js admin UI — Django admin covers ops (README §6 calls it optional).
- Email notifications on status changes (no email provider configured).
- Payment/checkout — out of scope for the concierge model (settled via WhatsApp).
