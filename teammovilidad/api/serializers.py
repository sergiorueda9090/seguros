from rest_framework import serializers
from teammovilidad.models import CrearRegistroMovilidad

class CrearRegistroMovilidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrearRegistroMovilidad
        fields = '__all__'  # Incluir todos los campos del modelo
