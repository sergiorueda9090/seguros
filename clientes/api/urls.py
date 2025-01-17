from django.urls import path
from clientes.api import views

urlpatterns = [
    # Rutas para clientes
    path('clientes/',           views.cliente_list_create,   name='cliente-list-create'),
    path('clientes/<int:pk>/',  views.cliente_detail_update, name='cliente_detail_update'),
    path('clientesremove/<int:pk>/',  views.cliente_detail,  name='clientesremove'),

    # Rutas para precios
    path('precios/',            views.precio_list_create,   name='precio-list-create'),
    path('precios/<int:pk>/',   views.precio_detail,        name='precio-detail'),
]
