from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from labelcolors.models import LabelColor
from .serializers import LabelColorSerializer

# Listar y crear etiquetas
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def labelcolor_list_create(request):
    if request.method == 'GET':
        # Listar etiquetas
        labels      = LabelColor.objects.all()
        serializer  = LabelColorSerializer(labels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Crear nueva etiqueta
        serializer = LabelColorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Obtener, actualizar y eliminar una etiqueta por ID
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def labelcolor_detail(request, pk):
    try:
        label = LabelColor.objects.get(pk=pk)
    except LabelColor.DoesNotExist:
        return Response({'error': 'Etiqueta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Obtener detalles de la etiqueta
        serializer = LabelColorSerializer(label)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        # Actualizar la etiqueta
        serializer = LabelColorSerializer(label, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Eliminar la etiqueta
        label.delete()
        return Response({'message': 'Etiqueta eliminada correctamente'}, status=status.HTTP_204_NO_CONTENT)
