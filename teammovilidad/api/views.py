from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Prefetch
from rest_framework import status
from teammovilidad.models import CrearRegistroMovilidad, SubregistrosMovilidad
from django.contrib.auth.models import User
from .serializers import CrearRegistroMovilidadSerializer

# Listar y Crear registros
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])  # Asegurar que solo usuarios autenticados accedan
def registro_movilidad_list_create(request):
    user = request.user  # Obtener el usuario autenticado

    if request.method == 'GET':
        # Filtrar los registros por el usuario autenticado
        registros = CrearRegistroMovilidad.objects.all()
        serializer = CrearRegistroMovilidadSerializer(registros, many=True)
        return Response({
            'user_info': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'registros': serializer.data,
        })

    if request.method == 'POST':
        # Incluir automáticamente el usuario en los datos enviados
        data = request.data.copy()  # Crear una copia de los datos enviados
        data['idusuario'] = user.id  # Agregar el ID del usuario autenticado

        serializer = CrearRegistroMovilidadSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def registro_movilidad_grouped_by_user(request):
    # Obtener todos los usuarios con sus registros relacionados
    users = User.objects.prefetch_related(
        Prefetch(
            'registros_movilidad',  # Nombre del related_name en CrearRegistroMovilidad
            queryset=CrearRegistroMovilidad.objects.all(),
            to_attr='user_registros'
        )
    )

    # Construir la respuesta agrupada
    grouped_data = []
    for user in users:
        grouped_data.append({
            'idusuario': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'registros': CrearRegistroMovilidadSerializer(user.user_registros, many=True).data
        })

    return Response(grouped_data)

@api_view(['GET', 'PUT', 'DELETE'])
def registro_movilidad_detail(request, pk):
    try:
        registro = CrearRegistroMovilidad.objects.get(pk=pk)
    except CrearRegistroMovilidad.DoesNotExist:
        return Response({'error': 'Registro no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CrearRegistroMovilidadSerializer(registro)
        return Response(serializer.data)

    if request.method == 'PUT':
        # Obtener el usuario autenticado del token
        usuario_autenticado = request.user
        data = request.data
        data['idusuario'] = usuario_autenticado.id
        data['cliente'] = "cliente"

        serializer = CrearRegistroMovilidadSerializer(registro, data=data)

        if serializer.is_valid():
            # Obtener los valores actuales antes de la actualización
            valores_antes = registro.__dict__.copy()

            # Guardar el registro actualizado
            registro_actualizado = serializer.save()

            # Comparar los valores antes y después de la actualización
            campos_modificados = []
            for campo, nuevo_valor in data.items():
                # Obtener el valor anterior
                valor_anterior = valores_antes.get(campo)

                # Normalizar valores para comparación
                if isinstance(valor_anterior, (int, float)):
                    valor_anterior = float(valor_anterior)
                if isinstance(nuevo_valor, (int, float)):
                    nuevo_valor = float(nuevo_valor)

                # Ignorar si los valores son iguales
                if str(valor_anterior) == str(nuevo_valor):
                    continue

                # Agregar a la lista de campos modificados
                campos_modificados.append({
                    "campo": campo,
                    "valor_antes": valor_anterior,
                    "valor_despues": nuevo_valor
                })

            # Registrar cada campo modificado en SubregistrosMovilidad
            for cambio in campos_modificados:
                SubregistrosMovilidad.objects.create(
                    idregistroMovilidad=registro_actualizado,
                    idusuario=usuario_autenticado,
                    id_color_id=4,  # Asigna un valor adecuado según tu lógica
                    accion='editar',
                    campo_modificado=cambio['campo'],
                    valor_antes=str(cambio['valor_antes']),
                    valor_despues=str(cambio['valor_despues'])
                )

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        # Registrar la eliminación en SubregistrosMovilidad
        SubregistrosMovilidad.objects.create(
            idregistroMovilidad=registro,
            idusuario=request.user,
            id_color_id=4,  # Asigna un valor adecuado según tu lógica
            accion='eliminar',
            campo_modificado='Registro completo',
            valor_antes=str(registro),
            valor_despues=None
        )
        registro.delete()
        return Response({'message': 'Registro eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def registro_movilidad_subregistrosmovilidad(request, idregistroMovilidad):
    try:
        # Obtener el registro de movilidad por ID
        registro = CrearRegistroMovilidad.objects.get(id=idregistroMovilidad)
        
        # Obtener subregistros relacionados
        subregistros = SubregistrosMovilidad.objects.filter(idregistroMovilidad=registro)
        
        # Obtener datos del usuario
        usuario = registro.idusuario

        # Construir la respuesta
        response_data = {
            "registro_movilidad": {
                "id": registro.id,
                "cliente": registro.cliente,
                "total": registro.total,
                "precioLey": registro.precioLey,
                "comision": registro.comision,
                "placa": registro.placa,
                "chasis": registro.chasis,
                "nombreCompleto": registro.nombreCompleto,
                "correo": registro.correo,
                "direccion": registro.direccion,
                "fecha_creacion": registro.fecha_creacion,
            },
            "usuario": {
                "id": usuario.id,
                "username": usuario.username,
                "email": usuario.email,
                "first_name": usuario.first_name,
                "last_name": usuario.last_name,
            },
            "subregistros": [
                {
                    "id": subregistro.id,
                    "accion": subregistro.accion,
                    "campo_modificado": subregistro.campo_modificado,
                    "valor_antes": subregistro.valor_antes,
                    "valor_despues": subregistro.valor_despues,
                    "fecha_creacion": subregistro.fecha_creacion,
                }
                for subregistro in subregistros
            ],
        }

        return Response(response_data)

    except CrearRegistroMovilidad.DoesNotExist:
        return Response({"error": "El registro de movilidad no existe."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)