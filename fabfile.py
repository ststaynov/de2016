from subprocess import call
from fabric.api import env, roles, cd, run, hosts

env.forward_agent = True

env.roledefs = {
    'hostsDev': ['dev1', 'dev2'],
    'hostsSTG': ['fabrique@ma.fabriquehq.nl', ],
    'hostsPRD': ['fabrique@ma.fabriquehq.nl', ],
    }

STAGING_LOCATION = '/var/www/ma/staging'
PRODUCTION_LOCATION = '/var/www/ma/production'
MAIN_APP = 'ma'
STAGING_WSGI = 'ma/wsgi.py'

@roles('hostsSTG')
def deploy_stg():
    with cd(STAGING_LOCATION):
        print("Pulling from GIT for staging...")
        run("git pull")

        # print "Checking requirements"
        # run ("pip install -r requirements.txt")
        print("Performing migrations...")
        run("source ../staging-env/bin/activate && python ./manage.py migrate")
        # not neded, static urls are there
        run("source ../staging-env/bin/activate && python ./manage.py collectstatic --noinput")
        # fixRosetta()
        run("source ../staging-env/bin/activate && python ./manage.py compilemessages")
        #run("source ../staging-env/bin/activate && chown fabrique:www-data locale -R")
        #run("source ../staging-env/bin/activate && chmod g+w locale -R")
        # print("Compress css")
        #run("source ../staging-env/bin/activate && python ./manage.py compress")
        print("touching your wsgis!")
        run("touch {}".format(STAGING_WSGI))
        print("Done!")


def get_prd_locale():
    call(['rsync', '-avz', '-e', 'ssh', '{}:{}/locale'.format(env.roledefs['hostsPRD'][0], PRODUCTION_LOCATION), '.'])


@roles('hostsSTG')
def get_stg_db_mysql(stg_user='staging', stg_name='staging', stg_password='u4HajE8RftnsJGtaRPaqm6JH', local_user='root',
               local_name='ma', local_password=''):
    run("mysqldump --user {0} --password={2} {1} > ~/dump.sql".format(stg_user, stg_name, stg_password))
    call(['scp', '{}:dump.sql'.format(env.roledefs['hostsSTG'][0]), '.'])
    if local_password:
        call(['mysql', '-u{}'.format(local_user), '-p{}'.format(local_password), '-e',
              'drop database {}'.format(local_name)])
        call(['mysql', '-u{}'.format(local_user), '-p{}'.format(local_password), '-e',
              'create database {}'.format(local_name)])
        call(['mysql', '-u{}'.format(local_user), '-p{}'.format(local_password), '-e', '\. dump.sql', local_name])
    else:
        call(['mysql', '-u{}'.format(local_user), '-e', 'drop database {}'.format(local_name)])
        call(['mysql', '-u{}'.format(local_user), '-e', 'create database {}'.format(local_name)])
        call(['mysql', '-u{}'.format(local_user), '-e', '\. dump.sql', local_name])
    call(['rm', 'dump.sql'])


@roles('hostsSTG')
def get_stg_db(local_name='mediacollege'):
    run("pg_dump --user staging staging > ~/dump_staging.sql")
    call(['scp', 'fabrique@ma.fabriquehq.nl:dump_staging.sql', '.'])
    call(['dropdb', local_name])
    call(['createdb', local_name])
    call(['psql', '-f', 'dump_staging.sql', local_name ], stdout=open('/dev/null', 'w'),  stderr=open('/dev/null', 'w'))
    call(['rm', 'dump_staging.sql'])


def get_stg_media():
    call(['rsync', '-avz', '-e', 'ssh', '{}:{}/media'.format(env.roledefs['hostsSTG'][0], STAGING_LOCATION), '.'])


def fixRosetta():
    print("Fixing Rosetta permissions...")
    run("chmod 666 locale/nl/LC_MESSAGES/django.po")
    run("chmod 666 locale/nl/LC_MESSAGES/django.mo")
    # chmod 666 locale/en/LC_MESSAGES/django.po
    # chmod 666 locale/en/LC_MESSAGES/django.mo