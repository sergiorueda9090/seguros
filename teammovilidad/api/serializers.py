from rest_framework import serializers
from teammovilidad.models import CrearRegistroMovilidad

class CrearRegistroMovilidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrearRegistroMovilidad
        fields = '__all__'

    # Hacer los campos opcionales
    comision = serializers.CharField(required=False, allow_blank=True)
    precioLey = serializers.CharField(required=False, allow_blank=True)
    total = serializers.CharField(required=False, allow_blank=True)

    # Hacer los campos opcionales para evitar errores durante la actualización
    cliente = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    placa = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    chasis = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tipoDocumento = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    numeroDocumento = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    nombreCompleto = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    cilindraje = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    modelo = serializers.CharField(required=False, allow_blank=True, allow_null=True)


    def validate(self, data):
        # Si es una actualización, omitir validaciones de campos obligatorios
        if self.instance:
            return data

        # Campos obligatorios a validar
        required_fields = [
            'placa',
            'cilindraje',
            'modelo',
            'chasis',
            'tipoDocumento',
            'numeroDocumento',
            'nombreCompleto',
        ]

        # Verificar campos obligatorios para creación
        missing_fields = [
            field for field in required_fields
            if not data.get(field) or (isinstance(data.get(field), str) and not data.get(field).strip())
        ]

        if missing_fields:
            raise serializers.ValidationError(
                {field: f"El campo {field} es obligatorio y no debe estar vacío." for field in missing_fields}
            )

        # Limpiar datos (quitar espacios en los valores de tipo string)
        for field, value in data.items():
            if isinstance(value, str):
                data[field] = value.strip()

        # Retornar los datos validados
        return data