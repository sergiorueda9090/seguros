from rest_framework import serializers
from clientes.models import Cliente, Precio

class PrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Precio
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    precios = PrecioSerializer(many=True, read_only=True)

    class Meta:
        model = Cliente
        fields = '__all__'
