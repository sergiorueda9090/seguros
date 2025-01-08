from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer
from django.contrib.auth.models import User


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    """Crear un usuario"""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        username    = serializer.validated_data['username']
        first_name  = serializer.validated_data['first_name']
        last_name   = serializer.validated_data['last_name']
        email       = serializer.validated_data['email']
        password    = request.data.get('password')

        if not password:
            return Response({'success': False, 'message': 'El campo password es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'success': False, 'message': 'El nombre de usuario ya existe.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        return Response({'success': True, 'message': 'Usuario creado exitosamente.', 'user_id': user.id},status=status.HTTP_201_CREATED)

    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    """Listar usuarios"""
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({'success': True, 'users': serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retrieve_user(request, user_id):
    """Obtener detalles de un usuario por ID"""
    user = get_object_or_404(User, id=user_id)
    serializer = UserSerializer(user)
    return Response({'success': True, 'user': serializer.data}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    """Actualizar un usuario"""
    user = get_object_or_404(User, id=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        #password = request.data.get('password')
        #if password:
        #    user.set_password(password)
        serializer.save()
        return Response({'success': True, 'message': 'Usuario actualizado correctamente.'}, status=status.HTTP_200_OK)

    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    """Eliminar un usuario"""
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return Response({'success': True, 'message': 'Usuario eliminado correctamente.'}, status=status.HTTP_204_NO_CONTENT)
