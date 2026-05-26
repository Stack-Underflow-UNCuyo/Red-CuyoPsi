from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.appointments.models import Appointment
from apps.patients.models import Patient
from apps.psychologists.models import Psychologist
from apps.session_notes.models import SessionNote
from apps.transactions.models import Transaction


class Command(BaseCommand):
    help = 'Seed the database with development fixtures'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        psychologist = Psychologist.objects.get_or_create(
            id=1,
            defaults={
                'name': 'Dra. Laura Méndez',
                'specialty': 'Ansiedad y Estrés',
                'session_price': '3500.00',
                'payment_policy': Psychologist.PaymentPolicy.TOTAL,
                'address': 'Av. San Martín 1234, Mendoza',
                'latitude': -32.8908,
                'longitude': -68.8272,
            },
        )[0]

        psychologist2 = Psychologist.objects.get_or_create(
            id=2,
            defaults={
                'name': 'Lic. Carlos Romero',
                'specialty': 'Terapia Cognitivo-Conductual',
                'session_price': '2800.00',
                'payment_policy': Psychologist.PaymentPolicy.DEPOSIT_50,
                'address': 'Belgrano 567, Mendoza',
                'latitude': -32.8956,
                'longitude': -68.8451,
            },
        )[0]

        patient = Patient.objects.get_or_create(
            id=1,
            defaults={
                'name': 'Ana Torres',
                'email': 'ana.torres@example.com',
                'phone': '+54 261 555-0001',
            },
        )[0]

        Patient.objects.get_or_create(
            id=2,
            defaults={
                'name': 'Marcos Díaz',
                'email': 'marcos.diaz@example.com',
                'phone': '+54 261 555-0002',
            },
        )

        now = timezone.now()

        appointment_confirmed = Appointment.objects.get_or_create(
            id=1,
            defaults={
                'psychologist': psychologist,
                'patient': patient,
                'date_time': now.replace(hour=10, minute=0, second=0, microsecond=0)
                + timezone.timedelta(days=3),
                'status': Appointment.Status.CONFIRMED,
                'payment_status': Appointment.PaymentStatus.FULLY_PAID,
            },
        )[0]

        appointment_pending = Appointment.objects.get_or_create(
            id=2,
            defaults={
                'psychologist': psychologist2,
                'patient': patient,
                'date_time': now.replace(hour=15, minute=0, second=0, microsecond=0)
                + timezone.timedelta(days=7),
                'status': Appointment.Status.PENDING,
                'payment_status': Appointment.PaymentStatus.PENDING,
            },
        )[0]

        appointment_past = Appointment.objects.get_or_create(
            id=3,
            defaults={
                'psychologist': psychologist,
                'patient': patient,
                'date_time': now.replace(hour=9, minute=0, second=0, microsecond=0)
                - timezone.timedelta(days=14),
                'status': Appointment.Status.CONFIRMED,
                'payment_status': Appointment.PaymentStatus.FULLY_PAID,
            },
        )[0]

        SessionNote.objects.get_or_create(
            id=1,
            defaults={
                'appointment': appointment_past,
                'patient': patient,
                'date': appointment_past.date_time,
                'encrypted_content': 'Paciente reporta avances en manejo de ansiedad. Continuar con técnicas de respiración.',
            },
        )

        Transaction.objects.get_or_create(
            id=1,
            defaults={
                'appointment': appointment_confirmed,
                'amount': '3500.00',
                'type': Transaction.Type.FULL_BOOKING,
                'status': Transaction.Status.SUCCESSFUL,
            },
        )

        Transaction.objects.get_or_create(
            id=2,
            defaults={
                'appointment': appointment_past,
                'amount': '3500.00',
                'type': Transaction.Type.FULL_BOOKING,
                'status': Transaction.Status.SUCCESSFUL,
            },
        )

        self.stdout.write(self.style.SUCCESS(
            'Done. Created: 2 psychologists, 2 patients, 3 appointments, 1 session note, 2 transactions.'
        ))
