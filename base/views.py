from django.shortcuts import render

# Create your views here.
def login(request):
    return render(request, 'adminlte/login.html')


def dashboard_view(request):
    return render(request, 'adminlte/dashboard.html')