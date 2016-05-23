
from django.contrib import admin
from .models import Talk, Location, Event


class TalkAdmin(admin.TabularInline):
    model = Talk


class EventAdmin(admin.ModelAdmin):
    inlines = [TalkAdmin, ]

admin.site.register(Event, EventAdmin)
admin.site.register(Location)
admin.site.register(Talk)
