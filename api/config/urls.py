from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.appointments.views import AppointmentViewSet
from apps.patients.views import PatientViewSet
from apps.psychologists.views import PsychologistViewSet
from apps.session_notes.views import SessionNoteViewSet
from apps.transactions.views import TransactionViewSet, psychologist_transactions
from apps.payments import views as payments_views

router = DefaultRouter()
router.register(r'psychologists', PsychologistViewSet, basename='psychologist')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'session-notes', SessionNoteViewSet, basename='session-note')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    # Psychologist-scoped transaction list — view lives in transactions app to respect entity boundaries
    path(
        'api/v1/psychologists/<int:psychologist_id>/transactions/',
        psychologist_transactions,
        name='psychologist-transactions',
    ),
    # Deferred payment stubs — return HTTP 501 until payment gateway is integrated
    path('api/v1/payments/initiate/', payments_views.payments_initiate, name='payments-initiate'),
    path('api/v1/payments/webhook/', payments_views.payments_webhook, name='payments-webhook'),
]
