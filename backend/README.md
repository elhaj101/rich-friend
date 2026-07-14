# Rich Friend — Django REST Backend

The real backend for the Next.js frontend in `../frontend`, per the root
[README](../README.md) blueprint: Django 5 + Django REST Framework + JWT
(simplejwt) + PostgreSQL, with the Django admin as the concierge/ops dashboard.

## Quick start (local)

```bash
cd backend
python3.12 -m venv .venv            # any Python ≥3.10
.venv/bin/pip install -r requirements.txt
cp .env.example .env                 # defaults work if local Postgres has db "richfriend"
createdb richfriend                  # or leave DATABASE_URL empty for SQLite
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver 8000
```

Point the frontend at it: in `frontend/.env.local` set
`BACKEND_API_URL=http://127.0.0.1:8000`, then `npm run dev`. Delete that line to
fall back to the frontend's built-in in-memory mock.

Admin dashboard: `manage.py createsuperuser`, then http://127.0.0.1:8000/admin/
— manage users, orders (with status-history inline), appointments, wishlists.
Changing an order's status in admin automatically writes an `OrderStatusEvent`.

## Layout

| App | Models | Endpoints |
|---|---|---|
| `users` | `User` (email login, `role` CLIENT/ADMIN, `phone`, `is_guest`) | `/api/auth/{register,login,refresh,guest}/`, `/api/users/me/` |
| `orders` | `Order`, `OrderStatusEvent` | `/api/orders/`, `/api/orders/<id>/` (GET detail+history, PATCH admin) |
| `appointments` | `Appointment` | `/api/appointments/` |
| `wishlist` | `WishlistItem` (5 priority slots/user) | `/api/wishlist/` (GET, PUT) |

Serializers speak the frontend's camelCase contract (`itemName`,
`destinationCountry`, `scheduledAt`, …) and errors return
`{"error": "<code>"}` using the codes in `frontend/src/lib/api.ts`
(`config/exceptions.py`). Photos arrive as data URLs (the client resizes
them), are stored as media files (`core/datauri.py`), and are served back as
absolute URLs.

`users/services.py` seeds every new account with two orders + one appointment
(demo parity with the old mock). Disable with `SEED_NEW_USERS=false`.
`DEMO_AUTH=true` enables guest accounts and any-credential login — **set both
to false in production.**

## Tests

```bash
.venv/bin/python manage.py test      # 19 tests: auth, orders, appointments, wishlist, permissions
```

## Deployment notes

- WSGI entrypoint: `config.wsgi` (gunicorn installed). Static files served by
  whitenoise after `manage.py collectstatic`.
- Required env in production: `SECRET_KEY`, `DEBUG=false`, `ALLOWED_HOSTS`,
  `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `DEMO_AUTH=false`, `SEED_NEW_USERS=false`.
- Media: local disk by default; set the `AWS_*` vars (works with Cloudflare R2
  via `AWS_S3_ENDPOINT_URL`) to switch to bucket storage — no code changes.
- The Next.js app talks to this API **server-side only** via the proxy in
  `frontend/src/lib/server/backend.ts`; browsers never hold the JWTs.
