from django.db import models

# Create your models here.
class Cliente(models.Model):
    nombre      = models.CharField(max_length=255)
    apellido    = models.CharField(max_length=255)
    email       = models.EmailField(unique=True)
    telefono    = models.CharField(max_length=15, blank=True, null=True)
    direccion   = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Precio(models.Model):
    cliente     = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='precios')
    descripcion = models.CharField(max_length=255)
    monto       = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.descripcion} - {self.monto} ({self.cliente.nombre})"