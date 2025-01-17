# Generated by Django 4.2 on 2025-01-16 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teammovilidad', '0003_alter_crearregistromovilidad_comision_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='crearregistromovilidad',
            old_name='cedula',
            new_name='numeroDocumento',
        ),
        migrations.AddField(
            model_name='crearregistromovilidad',
            name='tipoDocumento',
            field=models.CharField(choices=[('CC', 'Cédula de Ciudadanía'), ('TI', 'Tarjeta de Identidad'), ('NIT', 'Número de Identificación Tributaria'), ('PAS', 'Pasaporte'), ('CE', 'Cédula de Extranjería'), ('PPT', 'Permiso por Protección Temporal')], default=1, max_length=3),
            preserve_default=False,
        ),
    ]