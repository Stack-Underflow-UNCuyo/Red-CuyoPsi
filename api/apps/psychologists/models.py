from django.db import models


class Psychologist(models.Model):
    class PaymentPolicy(models.TextChoices):
        TOTAL = 'TOTAL', 'Total upfront'
        DEPOSIT_50 = '50_DEPOSIT', '50% deposit'
        EXTERNAL = 'EXTERNAL', 'Pay in office'

    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    session_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_policy = models.CharField(max_length=20, choices=PaymentPolicy.choices)
    address = models.CharField(max_length=500, blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'psychologists'

    def __str__(self) -> str:
        return self.name
