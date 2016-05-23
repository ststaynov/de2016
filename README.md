# DE2016 LIVE WALL #


### Staging environment ###


### Setting up a local environment ###

nmp install
copy local_settings.default to local settings, configure as needed
python manage.py migrate


#### Run server ####

Run `npm run gulp` to clean, build(fast), watch and serve at http://localhost:8080.  
Run `npm gun build` to clean and build(complete).
Run `python manage.py runserver` to serve.

#### Watch sass files ####

