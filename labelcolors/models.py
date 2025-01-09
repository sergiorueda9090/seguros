from django.db import models

# Create your models here.
class LabelColor(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    color       = models.CharField(max_length=12)  # Código de color hexadecimal (#FFFFFF)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name