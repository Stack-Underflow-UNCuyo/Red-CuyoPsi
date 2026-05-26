from django.db import models


class Patient(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50)

    class Meta:
        db_table = 'patients'

    def __str__(self) -> str:
        return self.name
