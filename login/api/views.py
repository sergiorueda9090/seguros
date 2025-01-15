from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import logout

@api_view(['POST'])
def logout_view(request):
    try:
        #refresh_token = request.data["refresh"]
        #token = RefreshToken(refresh_token)
        #token.blacklist()  # Revocar el token de refresco
        logout(request)  # Cierra la sesión del usuario
        return Response({"message": "Cierre de sesión exitoso."}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
