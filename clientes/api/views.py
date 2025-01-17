from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from clientes.models import Cliente, Precio
from clientes.api.serializers import ClienteSerializer, PrecioSerializer
from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cliente_list_create(request):
    if request.method == 'GET':
        clientes = Cliente.objects.prefetch_related('precios').all()
        cliente_data = []

        for cliente in clientes:
            cliente_data.append({
                "id": cliente.id,
                "nombre": cliente.nombre,
                "apellido": cliente.apellido,
                "email": cliente.email,
                "telefono": cliente.telefono,
                "direccion": cliente.direccion,
                "precios": [
                    {"id": precio.id, "descripcion": precio.descripcion, "monto": precio.monto}
                    for precio in cliente.precios.all()
                ],
            })

        return Response(cliente_data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        try:
            # Extraer datos del cliente
            cliente_data = {
                "nombre"    : request.data.get("nombre"),
                "apellido"  : request.data.get("apellido"),
                "email"     : request.data.get("email"),
                "telefono"  : request.data.get("telefono"),
                "direccion" : request.data.get("direccion"),
            }

            # Serializar y guardar el cliente
            cliente_serializer = ClienteSerializer(data=cliente_data)
            if cliente_serializer.is_valid():
                cliente = cliente_serializer.save()

                # Extraer y guardar precios asociados
                precios_data = request.data.get("precios", [])
                for precio in precios_data:
                    precio["cliente"] = cliente.id  # Asignar cliente al precio
                    precio_serializer = PrecioSerializer(data=precio)
                    if precio_serializer.is_valid():
                        precio_serializer.save()
                    else:
                        return Response(precio_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                return Response(cliente_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(cliente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def cliente_detail_update(request, pk):
    try:
        cliente = Cliente.objects.prefetch_related('precios').get(pk=pk)
    except Cliente.DoesNotExist:
        return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = {
            "id": cliente.id,
            "nombre": cliente.nombre,
            "apellido": cliente.apellido,
            "email": cliente.email,
            "telefono": cliente.telefono,
            "direccion": cliente.direccion,
            "precios": [
                {"id": precio.id, "descripcion": precio.descripcion, "monto": precio.monto}
                for precio in cliente.precios.all()
            ]
        }
        return Response(data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        try:
            # Actualizar datos del cliente
            cliente_data = {
                "nombre": request.data.get("nombre"),
                "apellido": request.data.get("apellido"),
                "email": request.data.get("email"),
                "telefono": request.data.get("telefono"),
                "direccion": request.data.get("direccion"),
            }
            cliente_serializer = ClienteSerializer(cliente, data=cliente_data, partial=True)
            if cliente_serializer.is_valid():
                cliente_serializer.save()

                # Manejar precios asociados
                precios_data = request.data.get("precios", [])
                for precio in precios_data:
                    if precio.get("id"):  # Si tiene ID, actualizar precio existente
                        try:
                            precio_instance = Precio.objects.get(id=precio["id"], cliente=cliente)
                            precio_serializer = PrecioSerializer(precio_instance, data=precio, partial=True)
                            if precio_serializer.is_valid():
                                precio_serializer.save()
                            else:
                                return Response(precio_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                        except Precio.DoesNotExist:
                            return Response({"error": f"Precio con ID {precio['id']} no existe."}, status=status.HTTP_404_NOT_FOUND)
                    else:  # Si no tiene ID, crear nuevo precio
                        precio["cliente"] = cliente.id
                        precio_serializer = PrecioSerializer(data=precio)
                        if precio_serializer.is_valid():
                            precio_serializer.save()
                        else:
                            return Response(precio_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                return Response(cliente_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(cliente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(['GET', 'PUT', 'DELETE'])
def cliente_detail(request, pk):
    try:
        cliente = Cliente.objects.get(pk=pk)
    except Cliente.DoesNotExist:
        return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        cliente.delete()
        return Response({'message': 'Cliente eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def precio_list_create(request):
    if request.method == 'GET':
        precios = Precio.objects.all()
        serializer = PrecioSerializer(precios, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PrecioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def precio_detail(request, pk):
    try:
        precio = Precio.objects.get(pk=pk)
    except Precio.DoesNotExist:
        return Response({'error': 'Precio no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PrecioSerializer(precio)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = PrecioSerializer(precio, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        precio.delete()
        return Response({'message': 'Precio eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)


