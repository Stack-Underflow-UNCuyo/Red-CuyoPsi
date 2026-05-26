import re
from pathlib import Path

from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='dev-insecure-key-replace-in-production')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'django_filters',
    # Local apps
    'apps.psychologists',
    'apps.patients',
    'apps.appointments',
    'apps.session_notes',
    'apps.transactions',
    'apps.payments',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database — defaults to SQLite for local dev; set DATABASE_URL for PostgreSQL
_db_url = config('DATABASE_URL', default='')

if _db_url.startswith('postgres'):
    _match = re.match(
        r'postgres(?:ql)?://(?P<user>[^:]+):(?P<password>[^@]*)@(?P<host>[^:/]+):?(?P<port>\d*)/(?P<name>.+)',
        _db_url,
    )
    if not _match:
        raise ValueError(f'Could not parse DATABASE_URL: {_db_url}')
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': _match.group('name'),
            'USER': _match.group('user'),
            'PASSWORD': _match.group('password'),
            'HOST': _match.group('host'),
            'PORT': _match.group('port') or '5432',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# All datetimes stored in UTC — frontend handles timezone conversion
USE_TZ = True
TIME_ZONE = 'UTC'
USE_I18N = True
LANGUAGE_CODE = 'en-us'

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    # TODO: Add DEFAULT_AUTHENTICATION_CLASSES and DEFAULT_PERMISSION_CLASSES when auth is implemented
}
