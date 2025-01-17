from django.urls import path, include
from .views import list_users, update_user, delete_user

app_name = 'usermanagement'

urlpatterns = [
    path('',            list_users, name='user_list'),
    path('api/users/',  include('usermanagement.api.urls')),
]
