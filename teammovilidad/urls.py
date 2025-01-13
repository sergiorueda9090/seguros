from django.urls import path, include
from .views import team_movilidad

app_name = 'teammovilidad'

urlpatterns = [
    path("",team_movilidad, name="team_movilidad")
]