from django.db import models
from django.contrib.auth.models import User
from labelcolors.models import LabelColor

class CrearRegistroMovilidad(models.Model):
    idusuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registros_movilidad')
    id_color = models.ForeignKey(LabelColor, on_delete=models.SET_NULL, blank=True, null=True, related_name='registros_movilidad')  # Relación con LabelColor
    cliente = models.CharField(max_length=255)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    precioLey = models.DecimalField(max_digits=10, decimal_places=2)
    comision = models.DecimalField(max_digits=10, decimal_places=2)
    etiqueta1 = models.CharField(max_length=255, blank=True, null=True)
    etiqueta2 = models.CharField(max_length=255, blank=True, null=True)
    placa = models.CharField(max_length=10, unique=True)  # Clave única
    cilindraje = models.PositiveIntegerField(blank=True, null=True)
    modelo = models.PositiveIntegerField(blank=True, null=True)
    chasis = models.CharField(max_length=17)
    cedula = models.CharField(max_length=20, blank=True, null=True)
    nombreCompleto = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    tiempoTramite = models.CharField(max_length=255, blank=True, null=True)
    cuentaBancaria = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Registro {self.placa} - Cliente: {self.cliente}"


class SubregistrosMovilidad(models.Model):
    idregistroMovilidad = models.ForeignKey(
        CrearRegistroMovilidad, 
        on_delete=models.CASCADE, 
        related_name='subregistros'
    )
    idusuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subregistros_movilidad')
    id_color = models.ForeignKey(LabelColor, on_delete=models.SET_NULL, blank=True, null=True, related_name='subregistros_movilidad')  # Relación con LabelColor
    accion = models.CharField(max_length=50, choices=[
        ('crear', 'Crear'),
        ('editar', 'Editar'),
        ('eliminar', 'Eliminar'),
    ])
    campo_modificado = models.CharField(max_length=255)
    valor_antes = models.TextField(blank=True, null=True)
    valor_despues = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.accion.capitalize()} - {self.campo_modificado} (Antes: {self.valor_antes} | Después: {self.valor_despues}) - Color: {self.id_color.name if self.id_color else 'Sin color'}"
