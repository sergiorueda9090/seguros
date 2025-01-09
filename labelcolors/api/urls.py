from django.urls import path
from .views import labelcolor_list_create, labelcolor_detail

urlpatterns = [
    path('',          labelcolor_list_create, name='labelcolor-list-create'),  # GET, POST
    path('<int:pk>/', labelcolor_detail, name='labelcolor-detail'),  # GET, PUT, DELETE
]
