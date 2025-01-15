from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt  # Recomendado solo para pruebas; en producción, usa correctamente CSRF.
def login_view(request):
    print("request.method {}".format(request.method))
    if request.method == 'GET':
        # Renderiza el formulario de login
        return render(request, 'login.html')

    if request.method == 'POST':
        try:
            # Leer datos JSON enviados
            data = json.loads(request.body)
            username = data.get('username', '').strip()
            password = data.get('password', '').strip()

            # Validaciones básicas
            if not username:
                return JsonResponse({'error': 'El nombre de usuario es obligatorio.'}, status=400)
            if not password:
                return JsonResponse({'error': 'La contraseña es obligatoria.'}, status=400)

            # Autenticar al usuario
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'message': 'Inicio de sesión exitoso'}, status=200)
            else:
                return JsonResponse({'error': 'Credenciales incorrectas.'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error en el formato de la solicitud.'}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def logout_view(request):
    logout(request)
    return redirect('login')  # Redirige al formulario de login después de cerrar sesión
