from django.urls import path
from .views import LogContactClick

urlpatterns = [
    path("log/", LogContactClick.as_view()),
]
