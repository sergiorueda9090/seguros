from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def team_movilidad(request):
    return render(request, 'teammovilidad.html')