"""idfa URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from website.views import *

urlpatterns = [

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', SocialMediaView.as_view(), name="socialmedia"),
    url(r'^test/$', TemplateView.as_view(template_name='livewall-test.html'), name="index-test"),
    url(r'^tweet/', TemplateView.as_view(template_name='components/tweet.html'), name="tweet"),
    url(r'^livewall/',TemplateView.as_view(template_name='livewall.html'), name="index"),
    url(r'^socialmedia/', SocialMediaView.as_view(), name="socialmedia"),
    url(r'^programme/', ProgrammeView.as_view(), name="programme"),
    url(r'^message/', MessageView.as_view(), name="message"),

    ## oauth endpoints
    # url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),

    ## API endpoints
    # url(r'^api/twitter', TwitterTestView.as_view()),  # test view for oauth token shiznitz
    url(r'^api/twitterfeedm/', TwitterFeedViewM.as_view()),  # test view for oauth token shiznitz
    url(r'^api/twitterfeed/', TwitterFeedView.as_view()),  # test view for oauth token shiznitz
    url(r'^api/instagram/', TemplateView.as_view(template_name='components/instagram.html'), name="instagram"),  # test view for Instagram
    # url(r'^login/$', 'django.contrib.auth.views.login'),
    # url(r'^logout/$', 'django.contrib.auth.views.logout'),


]

