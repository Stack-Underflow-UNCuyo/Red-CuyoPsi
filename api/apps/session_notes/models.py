from django.db import models


class SessionNote(models.Model):
    appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.CASCADE,
        related_name='session_notes',
    )
    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.CASCADE,
        related_name='session_notes',
    )
    date = models.DateTimeField()
    # TODO: encrypted_content must be encrypted via Fernet before any write — never store or return plaintext
    encrypted_content = models.TextField()

    class Meta:
        db_table = 'session_notes'

    def __str__(self) -> str:
        return f'SessionNote {self.id} · patient {self.patient_id} · {self.date}'
