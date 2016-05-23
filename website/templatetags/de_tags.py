"""
Created on 12/dic/2013

@author: Marco Pompili
"""

from instagram.client import InstagramAPI

from django import template

from django_instagram.models import InstagramConfiguration

register = template.Library()

DJANGO_INSTAGRAM_CLIENT_ID = "5668831cb13b4876a63fa53fe768927e"
DJANGO_INSTAGRAM_REDIRECT_URI = "http://www.emarcs.net/instagram/"


def instagram_sign_in_with_token():
    token = InstagramConfiguration.objects.first()

    if token is None:
        print("Django Instagram, configuration not found")
        return token
    else:
        return InstagramAPI(access_token=token.app_access_token)


def instagram_get_recent_media(count):
    api = instagram_sign_in_with_token()

    if api:
        recent_media, next_ = api.user_recent_media(count=count)
        return recent_media
    else:
        return None


class InstagramPopularMediaNode(template.Node):
    """
        Template node for displaying the popular media of Instagram.
        The API doesn't need authentication, just basic access.
    """
    def __init__(self, count):
        self.count = count
        self.api = InstagramAPI(client_id=DJANGO_INSTAGRAM_CLIENT_ID)

    def render(self, context):
        search_media, next_ = self.api.tag_recent_media(tag_name="UX", count=self.count)
        # import pdb;pdb.set_trace()

        context['popular_media'] = search_media

        return ''


@register.tag
def instagram_popular_media(parser, token):
    """
        Tag for getting data about popular media on Instagram.
    """
    try:
        tagname, count = token.split_contents()

        return InstagramPopularMediaNode(count.split('=')[1])
    except ValueError:
        raise template.TemplateSyntaxError(
            "%r tag requires a single argument" % token.contents.split()[0]
        )
