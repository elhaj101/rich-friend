# Architecture & Workflow Blueprint (v2)
## Luxury Personal Shopping Concierge — Next.js Frontend + Django REST Framework Backend

Two-service architecture: Next.js handles everything the user sees (landing page, animations, dashboards, forms). Django + Django REST Framework (DRF) handles data, auth, and business logic — reusing the same patterns you already used in The Castle Hotel project (Django + MySQL, CRUD, auth, admin dashboard).

---

## 1. Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS (also on your CV), Framer Motion for animations
- **Backend:** Django + Django REST Framework — exposes a JSON API instead of rendering templates
- **Database:** PostgreSQL or MySQL (both on your CV; Postgres is the slightly better fit long-term)
- **Auth:** Django's built-in auth system + `djangorestframework-simplejwt` (JWT tokens) or DRF session/token auth — Next.js stores the token and attaches it to API requests
- **Admin dashboard:** Django admin, customized — you get 90% of the admin dashboard for free, same as before
- **Media:** Django handles file uploads (`django-storages` to Cloudflare R2/S3-compatible bucket for HD images/video); Next.js renders them via `next/image`/`<video>`
- **Hosting:** Next.js on Vercel (free/cheap tier, zero-config), Django on Heroku (you've already deployed there twice) or a VPS later

---

## 2. How the two pieces talk

Next.js is a pure frontend calling Django's API over HTTPS — same relationship as any React app talking to a REST backend. Nothing in Django needs to know about Next.js beyond CORS config (`django-cors-headers`) allowing requests from your frontend's domain.

```
Browser → Next.js (renders pages, calls API) → Django REST Framework (auth, orders, users) → PostgreSQL/MySQL
```

---

## 3. Django project structure (backend)

```
/backend
  /config              → settings, urls, wsgi/asgi
  /users
    models.py           → User (extends AbstractUser, adds role: CLIENT/ADMIN)
    serializers.py
    views.py             → sign-up, sign-in (JWT), profile
    urls.py
  /orders
    models.py            → Order, OrderStatusEvent
    serializers.py
    views.py              → list/create orders, admin status updates
    urls.py
  /uploads
    views.py              → signed upload URLs for R2/S3
  manage.py
```

**Key models** (same shape as before, now Django models instead of Prisma):

```python
class User(AbstractUser):
    ROLE_CHOICES = [("CLIENT", "Client"), ("ADMIN", "Admin")]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="CLIENT")
    phone = models.CharField(max_length=20, blank=True)

class Order(models.Model):
    STATUS_CHOICES = [
        ("SUBMITTED", "Submitted"), ("UNDER_REVIEW", "Under Review"),
        ("SOURCING", "Sourcing"), ("FOUND_AWAITING_APPROVAL", "Found - Awaiting Approval"),
        ("PURCHASED", "Purchased"), ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"), ("CANCELLED", "Cancelled"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    item_description = models.TextField()
    brand = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100)
    budget_min = models.IntegerField(null=True, blank=True)
    budget_max = models.IntegerField(null=True, blank=True)
    reference_urls = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="SUBMITTED")
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderStatusEvent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    status = models.CharField(max_length=30)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

Register `Order`, `OrderStatusEvent`, and `User` in Django admin (`admin.py`) with `list_display`, `list_filter`, and `search_fields` — this alone gives you a working internal admin dashboard on day one, before any custom admin UI in Next.js exists.

---

## 4. API endpoints (DRF)

```
POST   /api/auth/register/         → sign up
POST   /api/auth/login/            → sign in, returns JWT access + refresh
POST   /api/auth/refresh/          → refresh access token
GET    /api/orders/                → list current user's orders (admin sees all)
POST   /api/orders/                → create order
GET    /api/orders/<id>/           → order detail + status history
PATCH  /api/orders/<id>/           → admin-only status update
GET    /api/users/me/              → current user profile
POST   /api/uploads/sign/          → signed upload URL for reference images
```

Use DRF's `permissions.IsAuthenticated` and a custom `IsAdmin` permission class (checks `request.user.role == "ADMIN"`) to protect admin-only endpoints — direct equivalent of the role checks you'd have written in Django views before, just returning JSON now instead of rendering a template.

---

## 5. Next.js project structure (frontend)

```
/app
  /(marketing)/page.tsx              → Landing page
  /about/page.tsx                    → About Us
  /sign-in/page.tsx
  /sign-up/page.tsx
  /dashboard/page.tsx                 → User dashboard
  /dashboard/orders/[id]/page.tsx
  /orders/new/page.tsx                 → Make an order
  /admin/page.tsx                       → Admin dashboard (custom, optional — Django admin covers this too)
  /admin/orders/page.tsx
/lib
  /api.ts                              → fetch wrapper, attaches JWT, points at Django API base URL
  /auth.ts                             → stores/reads JWT (httpOnly cookie set via a small Next.js route handler proxy, to avoid exposing tokens to client JS)
/components
  /marketing, /dashboard, /admin, /ui
```

**Auth handling note:** to keep JWTs out of `localStorage` (XSS risk), have Next.js route handlers (`/app/api/auth/*`) act as a thin proxy: the browser calls Next.js, Next.js calls Django, and the JWT is stored in an HTTP-only cookie set by Next.js. This is the one piece of "custom" glue code needed to connect the two familiar technologies safely.

---

## 6. Suggested build order

1. Django models + admin registration + Postgres/MySQL running locally — you can literally manage orders through Django admin before any frontend exists
2. DRF serializers/views/JWT auth, tested with Postman/curl
3. Next.js: sign-up/sign-in pages wired to the Django API via the cookie-proxy pattern
4. Next.js: user dashboard + order creation wizard, calling `/api/orders/`
5. Next.js: landing page + About Us with full animation/media polish
6. Optional custom Next.js admin dashboard, once Django admin proves the workflow (many teams just keep using Django admin permanently and skip this step)

---

## 7. Deployment

- **Frontend:** Vercel (free tier to start, auto-deploys from GitHub)
- **Backend:** Heroku (same platform you've already used for The Castle Hotel and Mildew-Leaf Detector) — Django + Postgres/MySQL add-on
- **Media storage:** Cloudflare R2 or AWS S3-compatible bucket via `django-storages`
- **Env vars:** `NEXT_PUBLIC_API_URL` (Next.js → Django), `CORS_ALLOWED_ORIGINS` (Django), JWT secret, DB URL, bucket credentials

This setup lets you build the backend with tools straight off your CV and Castle Hotel project, while getting the modern, animated frontend experience Next.js provides.
