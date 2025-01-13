from django.urls import path, include
from .views import page_roles

app_name = 'roles'
urlpatterns = [
    path('', page_roles, name='page_roles'),
    path('api/roles/',   include('roles.api.urls')),
]
