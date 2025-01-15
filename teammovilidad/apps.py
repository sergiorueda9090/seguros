from django.apps import AppConfig


class TeammovilidadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'teammovilidad'

    def ready(self):
        import teammovilidad.signals  # Importar las señales