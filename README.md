# Red CuyoPsi

Plataforma de turnos para profesionales de salud mental de la región de Cuyo/Mendoza.

**Stack:** Django + DRF (`api/`) · Expo SDK 56 / React Native (`mobile/`)

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Python | 3.11+ |
| Node.js | 18+ |
| Expo Go (dispositivo) | SDK 56 compatible |

---

## Levantar la API

```bash
cd api/

# Primera vez: crear entorno virtual e instalar dependencias
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Aplicar migraciones (usa SQLite por defecto en desarrollo)
.venv/bin/python manage.py migrate

# Iniciar servidor
.venv/bin/python manage.py runserver
```

La API queda disponible en `http://localhost:8000/api/v1/`.

### Variables de entorno (opcional)

Crear un archivo `.env` en `api/` para sobreescribir los valores por defecto:

```env
# Base de datos PostgreSQL para producción
DATABASE_URL=postgres://user:password@localhost:5432/cuyopsi

# Clave secreta de Django
SECRET_KEY=tu-clave-secreta
```

Sin `DATABASE_URL`, el proyecto usa SQLite (`db.sqlite3`). **En producción siempre usar PostgreSQL.**

---

## Levantar la app mobile

```bash
cd mobile/

# Primera vez: instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

Escanear el QR con la app **Expo Go** (disponible en App Store y Google Play). El teléfono y la computadora deben estar en la misma red Wi-Fi.

> **Nota:** La URL base de la API en `src/services/apiClient.ts` apunta a `http://localhost:8000`. Para probar desde un dispositivo físico reemplazarla con la IP local de la máquina (ej: `http://192.168.x.x:8000`).

---

## Estructura del proyecto

```
.
├── api/                        # Backend — Django + DRF
│   ├── config/                 # settings.py, urls.py
│   ├── apps/
│   │   ├── psychologists/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── session_notes/
│   │   ├── transactions/
│   │   └── payments/           # Stubs HTTP 501 (integración futura)
│   ├── manage.py
│   └── requirements.txt
│
└── mobile/                     # Frontend — Expo / React Native
    ├── src/
    │   ├── app/                # AppNavigator, providers
    │   ├── features/           # Módulos por feature (search, booking, etc.)
    │   ├── components/         # ui/ y shared/
    │   ├── services/           # apiClient, servicios por entidad, queryKeys
    │   ├── store/              # Estado global
    │   ├── hooks/              # Hooks globales (useTheme)
    │   ├── types/              # Interfaces TypeScript por entidad
    │   ├── constants/          # colors, spacing, typography
    │   └── utils/
    ├── app.json
    └── package.json
```

---

## Endpoints principales

Todos con prefijo `/api/v1/`.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/psychologists/` | Listar profesionales |
| GET | `/psychologists/{id}/` | Detalle de un profesional |
| GET | `/psychologists/{id}/availability/` | Slots disponibles (`?date_from=&date_to=`) |
| GET | `/psychologists/{id}/transactions/` | Transacciones del profesional (`?month=YYYY-MM`) |
| GET | `/patients/{id}/` | Detalle de un paciente |
| GET | `/appointments/` | Turnos (`?patient_id=`, `?psychologist_id=`, `?status=`) |
| PATCH | `/appointments/{id}/cancel/` | Cancelar turno |
| PATCH | `/appointments/{id}/confirm/` | Confirmar turno |
| GET | `/session-notes/` | Notas clínicas (`?patient_id=`, `?appointment_id=`) |
| GET | `/transactions/` | Transacciones (`?appointment_id=`) |
| POST | `/payments/initiate/` | **No implementado** — HTTP 501 |
| GET | `/psychologists/nearby/` | **No implementado** — HTTP 501 |

---

## Features implementadas

| Feature | Pantallas | Estado |
|---|---|---|
| Search | `SearchScreen`, `MapScreen` | Funcional (mapa placeholder) |
| Auth | `LoginScreen`, `RegisterScreen` | Scaffold |
| Booking | `CalendarScreen`, `PaymentScreen`, `ConfirmationScreen` | Scaffold |
| Appointments | `AppointmentsScreen` | Scaffold |
| Patient profile | `PatientProfileScreen` | Scaffold |
| Professional settings | `ProfessionalSettingsScreen` | Scaffold |
| Clinical record | `PatientRecordScreen` | Scaffold |
| Financial dashboard | `FinancialDashboardScreen` | Scaffold |

---

## Arquitectura mobile (MVC)

```
Model      →  src/services/   src/store/   src/types/   src/utils/
Controller →  src/features/[feature]/hooks/   src/hooks/
View       →  src/features/[feature]/screens/   src/components/
```

Reglas: las Views solo importan hooks. Los hooks solo importan servicios/store. Los servicios no importan React.
