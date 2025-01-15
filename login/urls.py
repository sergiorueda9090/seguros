from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('api/login/', include('login.api.urls')),  # Ruta para la autenticación JWT
]

#'api/login/logout