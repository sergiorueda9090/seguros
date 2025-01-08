from django.urls import path
from .views import create_user, list_users, retrieve_user, update_user, delete_user

urlpatterns = [
    path('', list_users, name='list_users'),  # GET para listar usuarios
    path('create/', create_user, name='create_user'),  # POST para crear usuario
    path('<int:user_id>/', retrieve_user, name='retrieve_user'),  # GET para obtener un usuario
    path('<int:user_id>/update/', update_user, name='update_user'),  # PUT para actualizar usuario
    path('<int:user_id>/delete/', delete_user, name='delete_user'),  # DELETE para eliminar usuario
]
