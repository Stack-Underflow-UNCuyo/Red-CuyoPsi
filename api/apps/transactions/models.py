from django.db import models


class Transaction(models.Model):
    class Type(models.TextChoices):
        FULL_BOOKING = 'FULL_BOOKING', 'Full booking'
        DEPOSIT_50 = '50_DEPOSIT', '50% deposit'

    class Status(models.TextChoices):
        SUCCESSFUL = 'SUCCESSFUL', 'Successful'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.CASCADE,
        related_name='transactions',
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices)

    class Meta:
        db_table = 'transactions'

    def __str__(self) -> str:
        return f'Transaction {self.id}: {self.type} {self.amount} ({self.status})'
