from django.urls import path

from .views import GuestView, LoginView, RefreshView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("refresh/", RefreshView.as_view()),
    path("guest/", GuestView.as_view()),
]
