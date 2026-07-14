# Backend Build Workflow — Rich Friend

**Written:** 2026-07-14 · **Status:** living document — checkboxes updated as work lands.
This is the plan of record for building the real backend. If a session is interrupted,
resume from the first unchecked item.

## Goal

Replace the mock in-memory backend (`frontend/src/lib/server/mockStore.ts`) with the
Django + Django REST Framework backend specified in the root [README.md](README.md),
covering **every feature the frontend actually ships**:

| Feature | Frontend surface | Backend responsibility |
|---|---|---|
| Auth (register/login/logout/me + demo guest) | `(auth)` pages, `AuthContext` | Custom `User` model, JWT via simplejwt, guest provisioning |
| Orders | `/dashboard/orders`, new-order form | `Order` + `OrderStatusEvent` models, list/create, admin status updates |
| Appointments | `/dashboard/appointments` | `Appointment` model, list/request |
| Wishlist (5 priority slots) | `/dashboard/wishlist` | `WishlistItem` model, get/replace |
| Reference photos (data-URL uploads) | order form + wishlist | Decode data URLs → `ImageField` media files, serve URLs |
| Admin dashboard | none (deferred by design) | Django admin, customized (`list_display`, filters, search) |

## Architecture decisions (made autonomously where README was silent)

1. **Integration pattern:** README §5's cookie-proxy. Next.js Route Handlers under
   `frontend/src/app/api/*` proxy to Django; JWTs live in httpOnly cookies set by
   Next.js. Browser contract (paths, camelCase, `{ user }` / `{ orders }` wrappers,
   error codes) is **unchanged** — zero UI edits.
2. **Mock fallback stays:** route handlers use Django when `BACKEND_API_URL` is set
   (see `frontend/.env.local`), else fall back to the mock store. Demo mode keeps working
   with no backend running.
3. **Database:** PostgreSQL (server already running locally, db `richfriend`).
   Configured via `DATABASE_URL`; falls back to SQLite if unset so the repo runs anywhere.
4. **Python:** Homebrew Python 3.12 in `backend/.venv` (system 3.9 too old for Django 5).
5. **Contract parity:** Django serializers emit the frontend's camelCase field names and
   status vocabulary (`requested/sourcing/purchased/in_transit/delivered` — the frontend's
   five-stage timeline, not the README's eight; README predates the built UI).
   `OrderStatusEvent` rows are written on every status change for future timeline detail.
6. **Guest/demo auth** is implemented server-side too (`POST /api/auth/guest/`), gated by
   `DEMO_AUTH` env on Django, so demo parity survives the swap.
7. **Seeding:** new users get the same 2 orders + 1 appointment the mock seeded, via a
   `seed_user_data()` service called on register/guest (gated by `SEED_NEW_USERS` env).
8. **Media:** local `MEDIA_ROOT` in dev; `django-storages[s3]` config is env-gated for
   Cloudflare R2/S3 later (human provides bucket creds — see HUMAN_TODO.md).

## Phases

- [x] **P1 — Scaffold:** `backend/` Django project (`config` + apps `users`, `orders`,
      `appointments`, `wishlist`), venv, requirements.txt, `.env.example`, settings
      (Postgres/SQLite via `DATABASE_URL`, CORS, DRF+JWT, media).
- [x] **P2 — Models & admin:** `User(AbstractUser, role, phone)`, `Order`,
      `OrderStatusEvent`, `Appointment`, `WishlistItem`; migrations; admin registration
      with list_display/filters/search.
- [x] **P3 — API:** serializers (camelCase contract), views, urls, custom exception
      handler mapping to frontend error codes (`invalid_credentials`, `email_taken`, …),
      `IsAdmin` permission, data-URL→file media handling, guest endpoint.
- [x] **P4 — Backend verification:** 19-test Django suite (auth, orders, appointments,
      wishlist, permissions) green + live curl smoke test against runserver + Postgres.
- [x] **P5 — Frontend wiring:** `frontend/src/lib/server/backend.ts` proxy client
      (JWT cookies, auto-refresh, error mapping); route handlers choose Django vs mock;
      `frontend/.env.local` + `.env.example`. Lint + tsc clean.
- [x] **P6 — End-to-end verification (2026-07-14):** both servers live; browser
      sign-up → dashboard rendered Django-seeded orders (RF-2043/44) from Postgres;
      cookie-jar curl through the Next proxy: register → create order with photo
      (media file stored + URL served) → appointment → wishlist PUT → me → logout ✓.
- [x] **P7 — Docs & handoff:** `backend/README.md` (setup/run/deploy),
      `HUMAN_TODO.md` (deploy, secrets, bucket, superuser), commit.

**Status: COMPLETE.** Remaining work is human-only (see [HUMAN_TODO.md](HUMAN_TODO.md)).

## API surface (Django, all under /api/)

```
POST /api/auth/register/   {name,email,password}        → {user}
POST /api/auth/login/      {email,password}             → {user, access, refresh}
POST /api/auth/refresh/    {refresh}                    → {access}
POST /api/auth/guest/      (DEMO_AUTH only)             → {user, access, refresh}
GET  /api/users/me/                                     → {user}
GET  /api/orders/                                       → {orders:[...]}
POST /api/orders/          NewOrderInput (camelCase)    → {order}
GET  /api/orders/<id>/                                  → {order, statusHistory}
PATCH /api/orders/<id>/    {status, note} (admin only)  → {order}
GET  /api/appointments/                                 → {appointments:[...]}
POST /api/appointments/    NewAppointmentInput          → {appointment}
GET  /api/wishlist/                                     → {wishlist:[5 slots]}
PUT  /api/wishlist/        {items:[...]}                → {wishlist}
```

Login is email-based (custom `USERNAME_FIELD=email`). Errors: `{"error": "<code>"}` with
codes from `frontend/src/lib/api.ts` `ApiErrorCode`.
