from django.urls import path
from . import views

urlpatterns = [
    path('registro-movilidad-agrupado/', views.registro_movilidad_grouped_by_user, name='registro-grouped-by-user'),
    path('registro-movilidad/', views.registro_movilidad_list_create, name='registro-list-create'),
    path('registro-movilidad/<int:pk>/', views.registro_movilidad_detail, name='registro-detail'),
    path('registro-movilidad-subregistros/<int:idregistroMovilidad>/', views.registro_movilidad_subregistrosmovilidad, name='registro_movilidad_subregistros'),
]