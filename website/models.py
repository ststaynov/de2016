from django.db import models


class Event(models.Model):
    location = models.ForeignKey('Location', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    time_start = models.DateTimeField('date start')
    time_end = models.DateTimeField('date end')

    def __unicode__(self):
        return self.title


class Talk(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    author = models.CharField(max_length=250)
    description = models.TextField()

    def __unicode__(self):
        return u"{}-{}".format(self.author, self.event)



class Location(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name
