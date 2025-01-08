from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('api/login/', include('login.api.urls')),  # Ruta para la autenticación JWT
]