from django.urls import path
from . import views

urlpatterns = [
    path('', views.roles_list_create, name='roles-list-create'),  # GET, POST
    path('<int:pk>/', views.role_detail, name='role-detail'),  # GET, PUT, DELETE
]
