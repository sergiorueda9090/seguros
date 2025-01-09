from rest_framework import serializers
from labelcolors.models import LabelColor

class LabelColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabelColor
        fields = ['id', 'name', 'color', 'description']