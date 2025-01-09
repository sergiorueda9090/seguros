from django.urls import path, include
from .views import list_label

app_name = 'labelcolors'

urlpatterns = [
    path('',            list_label, name='list_label'),
    path('api/labelcolor/', include('labelcolors.api.urls')),
]