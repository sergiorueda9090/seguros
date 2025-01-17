from django.contrib import admin
from django.urls import path, include
from .views import clientes_html
app_name = 'clientes'

urlpatterns = [
    path('', clientes_html, name="clientes_html"),
    path('api/', include('clientes.api.urls')),
]
