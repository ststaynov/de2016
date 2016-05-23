import sys

# Django settings for plango project.
DEBUG = True
TEMPLATE_DEBUG = DEBUG
THUMBNAIL_DEBUG = DEBUG
COMPRESS_ENABLED = not DEBUG

ADMINS = ()
MANAGERS = ADMINS

CACHES = {
	'default': {
        	'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
	}
} 

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'de2016',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
        'STORAGE_ENGINE': 'MyISAM', # InnoDB future fix (http://stackoverflow.com/questions/6178816/django-cannot-add-or-update-a-child-row-a-foreign-key-constraint-fails)
    }
}

#EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
#EMAIL_FILE_PATH = '/emails'

RAVEN_CONFIG = {}
