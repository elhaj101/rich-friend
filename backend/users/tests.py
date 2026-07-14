import base64

from django.test import override_settings
from rest_framework.test import APITestCase

from .models import User

# 1x1 red PNG.
TINY_PNG = "data:image/png;base64," + base64.b64encode(
    base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    )
).decode()

REGISTER = {"name": "Aya", "email": "aya@example.com", "password": "s3cure-pass"}


class AuthTests(APITestCase):
    def register(self, **overrides):
        return self.client.post("/api/auth/register/", {**REGISTER, **overrides})

    def test_register_returns_user_and_tokens(self):
        res = self.register()
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["user"]["email"], "aya@example.com")
        self.assertEqual(res.data["user"]["name"], "Aya")
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)

    def test_register_validation_codes(self):
        cases = [
            ({"name": ""}, "missing_fields"),
            ({"email": "not-an-email"}, "invalid_email"),
            ({"password": "short"}, "weak_password"),
        ]
        for overrides, code in cases:
            res = self.register(**overrides)
            self.assertEqual(res.data, {"error": code})
        self.register()
        res = self.register()
        self.assertEqual(res.status_code, 409)
        self.assertEqual(res.data, {"error": "email_taken"})

    def test_register_seeds_dashboard_data(self):
        access = self.register().data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        orders = self.client.get("/api/orders/").data["orders"]
        self.assertEqual(len(orders), 2)
        self.assertEqual(orders[0]["status"], "in_transit")  # newest first
        self.assertEqual(orders[1]["status"], "delivered")
        appts = self.client.get("/api/appointments/").data["appointments"]
        self.assertEqual(len(appts), 1)
        self.assertEqual(appts[0]["status"], "confirmed")

    @override_settings(DEMO_AUTH=False)
    def test_login_real_auth(self):
        self.register()
        ok = self.client.post("/api/auth/login/", {"email": REGISTER["email"], "password": REGISTER["password"]})
        self.assertEqual(ok.status_code, 200)
        bad = self.client.post("/api/auth/login/", {"email": REGISTER["email"], "password": "wrong-pass"})
        self.assertEqual(bad.status_code, 401)
        self.assertEqual(bad.data, {"error": "invalid_credentials"})
        unknown = self.client.post("/api/auth/login/", {"email": "nobody@example.com", "password": "whatever1"})
        self.assertEqual(unknown.status_code, 401)

    @override_settings(DEMO_AUTH=True)
    def test_demo_login_creates_account(self):
        res = self.client.post("/api/auth/login/", {"email": "new@example.com", "password": "anything"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["user"]["name"], "new")
        self.assertTrue(User.objects.filter(email="new@example.com").exists())

    @override_settings(DEMO_AUTH=True)
    def test_guest_endpoint(self):
        res = self.client.post("/api/auth/guest/")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["user"]["name"], "Guest")

    @override_settings(DEMO_AUTH=False)
    def test_guest_disabled_outside_demo(self):
        self.assertEqual(self.client.post("/api/auth/guest/").status_code, 403)

    def test_refresh(self):
        refresh = self.register().data["refresh"]
        res = self.client.post("/api/auth/refresh/", {"refresh": refresh})
        self.assertEqual(res.status_code, 200)
        self.assertIn("access", res.data)
        bad = self.client.post("/api/auth/refresh/", {"refresh": "garbage"})
        self.assertEqual(bad.status_code, 401)

    def test_me_requires_auth(self):
        res = self.client.get("/api/users/me/")
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.data, {"error": "unauthorized"})
        access = self.register().data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        res = self.client.get("/api/users/me/")
        self.assertEqual(res.data["user"]["email"], "aya@example.com")


class OrderTests(APITestCase):
    def setUp(self):
        res = self.client.post("/api/auth/register/", REGISTER)
        self.user_id = res.data["user"]["id"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['access']}")

    def test_create_order_matches_contract(self):
        res = self.client.post("/api/orders/", {
            "itemName": "Birkin 25",
            "brand": "Hermès",
            "size": "25",
            "color": "Gold",
            "budget": "€18,000",
            "destinationCountry": "UAE",
            "notes": "Togo leather preferred.",
            "referencePhoto": TINY_PNG,
        })
        self.assertEqual(res.status_code, 201)
        order = res.data["order"]
        self.assertEqual(order["itemName"], "Birkin 25")
        self.assertEqual(order["destinationCountry"], "UAE")
        self.assertEqual(order["status"], "requested")
        self.assertEqual(order["shopper"], "Camille Laurent")
        self.assertTrue(order["ref"].startswith("RF-"))
        self.assertIn("http", order["referencePhoto"])
        self.assertIn("createdAt", order)

    def test_create_order_missing_fields(self):
        res = self.client.post("/api/orders/", {"brand": "Hermès"})
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.data, {"error": "missing_fields"})

    def test_detail_includes_status_history(self):
        order = self.client.post("/api/orders/", {
            "itemName": "Le Chiquito", "brand": "Jacquemus", "destinationCountry": "Qatar",
        }).data["order"]
        res = self.client.get(f"/api/orders/{order['id']}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["statusHistory"][0]["status"], "requested")

    def test_user_cannot_see_others_orders(self):
        mine = self.client.post("/api/orders/", {
            "itemName": "X", "brand": "Y", "destinationCountry": "Qatar",
        }).data["order"]
        other = self.client.post("/api/auth/register/", {**REGISTER, "email": "other@example.com"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {other.data['access']}")
        res = self.client.get(f"/api/orders/{mine['id']}/")
        self.assertEqual(res.status_code, 404)
        refs = [o["ref"] for o in self.client.get("/api/orders/").data["orders"]]
        self.assertNotIn(mine["ref"], refs)

    def test_admin_status_update_writes_history(self):
        order = self.client.post("/api/orders/", {
            "itemName": "X", "brand": "Y", "destinationCountry": "Qatar",
        }).data["order"]

        # Regular client is refused.
        res = self.client.patch(f"/api/orders/{order['id']}/", {"status": "sourcing"})
        self.assertEqual(res.status_code, 403)

        admin = User.objects.create_user(
            email="admin@richfriend.com", password="admin-pass-1", name="Ops", role="ADMIN"
        )
        login = self.client.post("/api/auth/login/", {"email": admin.email, "password": "admin-pass-1"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

        res = self.client.patch(
            f"/api/orders/{order['id']}/",
            {"status": "sourcing", "note": "Contacted the Paris boutique."},
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["order"]["status"], "sourcing")
        history = self.client.get(f"/api/orders/{order['id']}/").data["statusHistory"]
        self.assertEqual([h["status"] for h in history], ["requested", "sourcing"])
        self.assertEqual(history[-1]["note"], "Contacted the Paris boutique.")

    def test_admin_sees_all_orders(self):
        User.objects.create_user(
            email="admin@richfriend.com", password="admin-pass-1", name="Ops", role="ADMIN"
        )
        login = self.client.post("/api/auth/login/", {"email": "admin@richfriend.com", "password": "admin-pass-1"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        orders = self.client.get("/api/orders/").data["orders"]
        self.assertEqual(len(orders), 2)  # the seeded client's orders


class AppointmentTests(APITestCase):
    def setUp(self):
        res = self.client.post("/api/auth/register/", REGISTER)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['access']}")

    def test_request_appointment(self):
        res = self.client.post("/api/appointments/", {
            "kind": "phone_call",
            "scheduledAt": "2026-08-01T15:00:00Z",
            "note": "Discuss the autumn wishlist.",
        })
        self.assertEqual(res.status_code, 201)
        appt = res.data["appointment"]
        self.assertEqual(appt["status"], "pending")
        self.assertEqual(appt["shopper"], "Camille Laurent")
        self.assertEqual(appt["kind"], "phone_call")

    def test_invalid_kind_rejected(self):
        res = self.client.post("/api/appointments/", {
            "kind": "carrier_pigeon", "scheduledAt": "2026-08-01T15:00:00Z",
        })
        self.assertEqual(res.status_code, 400)


class WishlistTests(APITestCase):
    def setUp(self):
        res = self.client.post("/api/auth/register/", REGISTER)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['access']}")

    def test_get_returns_five_slots(self):
        wishlist = self.client.get("/api/wishlist/").data["wishlist"]
        self.assertEqual([w["priority"] for w in wishlist], [1, 2, 3, 4, 5])

    def test_put_roundtrip_with_photo(self):
        res = self.client.put("/api/wishlist/", {"items": [
            {"priority": 1, "title": "Cartier Panthère", "photo": TINY_PNG, "note": "Small model"},
            {"priority": 3, "title": "Loro Piana scarf", "link": "https://example.com/scarf"},
        ]})
        self.assertEqual(res.status_code, 200)
        wl = res.data["wishlist"]
        self.assertEqual(wl[0]["title"], "Cartier Panthère")
        self.assertIn("http", wl[0]["photo"])
        self.assertEqual(wl[2]["link"], "https://example.com/scarf")
        self.assertIsNone(wl[1]["title"])

        # Re-PUT with the served photo URL keeps the photo; clearing removes it.
        wl[0]["note"] = "Yellow gold"
        res = self.client.put("/api/wishlist/", {"items": wl})
        self.assertIn("http", res.data["wishlist"][0]["photo"])
        self.assertEqual(res.data["wishlist"][0]["note"], "Yellow gold")

        res = self.client.put("/api/wishlist/", {"items": [{"priority": 1, "title": "Kept, no photo"}]})
        self.assertIsNone(res.data["wishlist"][0]["photo"])
        self.assertEqual(res.data["wishlist"][0]["title"], "Kept, no photo")
