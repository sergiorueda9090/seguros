from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CrearRegistroMovilidad, SubregistrosMovilidad

@receiver(post_save, sender=CrearRegistroMovilidad)
def crear_subregistro(sender, instance, created, **kwargs):
    if created:  # Verificar si es un registro recién creado
        SubregistrosMovilidad.objects.create(
            idregistroMovilidad=instance,
            idusuario=instance.idusuario,
            accion='crear',  # Acción predeterminada
            campo_modificado="Todos los campos",
            valor_antes=None,
            valor_despues=str(instance.__dict__),  # Guardar todos los valores del registro
            id_color=instance.id_color,  # Asociar el color si está presente
        )
