# для настройки и конфигурирования проекта
from django.apps import AppConfig


class DbserverConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dbServer'