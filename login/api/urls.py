from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import logout_view

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtener token de acceso y refresco
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refrescar token de acceso
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Verificar token
    path('logout/', logout_view, name='logout'),
]


