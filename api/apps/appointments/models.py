from django.db import models


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        CANCELED = 'CANCELED', 'Canceled'

    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PARTIALLY_PAID = 'PARTIALLY_PAID', 'Partially paid'
        FULLY_PAID = 'FULLY_PAID', 'Fully paid'

    psychologist = models.ForeignKey(
        'psychologists.Psychologist',
        on_delete=models.CASCADE,
        related_name='appointments',
    )
    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.CASCADE,
        related_name='appointments',
    )
    date_time = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )

    class Meta:
        db_table = 'appointments'

    def __str__(self) -> str:
        return f'Appointment {self.id}: patient {self.patient_id} · psychologist {self.psychologist_id} · {self.date_time}'
