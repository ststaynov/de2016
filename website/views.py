import json
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from django.views.generic import View, TemplateView
from django.shortcuts import render

from twitter_api.api import api_call, TwitterApi, TwitterError


# class TwitterTestView(View):
#     def get(self, request, *args, **kwargs):
#
#
#         response = api_call('get_user', 'BarackObama')
#         sample = "userid: {}, username: {}".format(response.id, response.name)
#         result = {'output':  sample }
#         # result = json.dumps(result)
#         return JsonResponse(result)

## more examples of json output: https://docs.djangoproject.com/en/1.8/ref/request-response/#jsonresponse-objects

class TwitterFeedViewM(View):
    def get(self, request, *args, **kwargs):
        tweets = [1, 2, 3, 4, 5, 6, 7, 8]
        twitterfeed_tweets = []
        for tweet in tweets[:7]:
            height = 100 + (20 * tweet)
            output = "<div class='tweet new' data-tweetid='%s' style='height:%spx'><div class='inner'> <h1>%s</h1></div></div>" % (
            tweet, height, tweet)
            twitterfeed_tweets.append({'content': output, 'id': tweet})

        twitterfeed = {'tweets': twitterfeed_tweets}
        return JsonResponse(twitterfeed)  # , safe=False)
        ## more examples of json output: https://docs.djangoproject.com/en/1.8/ref/request-response/#jsonresponse-objects


class TwitterFeedView(View):
    def get(self, request, *args, **kwargs):
        tweets = api_call("search", q="iron maiden")
        twitterfeed_tweets = []
        for tweet in tweets[:7]:
            output = render_to_string("components/tweet.html", context={'tweet': tweet})
            twitterfeed_tweets.append({'content': output, 'id': tweet.id_str})

        twitterfeed = {'tweets': twitterfeed_tweets}

        return JsonResponse(twitterfeed)  # , safe=False)
        ## more examples of json output: https://docs.djangoproject.com/en/1.8/ref/request-response/#jsonresponse-objects


class TwitterTestView(View):
    def get(self, request, *args, **kwargs):
        # response = api_call('get_status', 327926550815207424)
        # sample = "status_id: {}, status: {}".format(response.id, response.text)
        # result = {'output':  sample }
        # # result = json.dumps(result)
        # return JsonResponse(result)

        query = api_call("search", q="food")
        # tweet = format(tweets[0].text)
        # tweet0 = tweets[0]
        # tweet_info = u"text: {}".format(tweet0.text)
        # output = {'output':  tweet_info }
        for tweet in query[:5]:
            output = render_to_string("tweet.html", context=tweet)
            tweet_info = u"id: {}, name: {}, handle: {}, text: {}, created_at: {}, retweeted {}, retweet_count {}, favourite_count {}".format(
                tweet.id, tweet.user.name, tweet.user.screen_name, tweet.text, tweet.created_at, tweet.retweeted,
                tweet.retweet_count, tweet.favorite_count)
            # media_url {}, tweet.entities.media.media_url
            tweet_json = {'tweet': tweet_info}
            print tweet_json
            # return JsonResponse(tweet, safe=False)

            # return JsonResponse(output, safe=False)

            ## more examples of json output: https://docs.djangoproject.com/en/1.8/ref/request-response/#jsonresponse-objects



class DynamicView(TemplateView):

    def get_context_data(self, request, *args, **kwargs):
        context = {}
        if request.is_ajax():
            context['is_partial'] = True
        context['extend_template'] = self.get_extend_template()
        return context

    def get_extend_template(self):
        return 'contentonly.html' if self.request.is_ajax() else 'livewall.html'


class SocialMediaView(DynamicView):

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(request, *args, **kwargs)

        return render(request, 'socialmedia.html', context)


class ProgrammeView(DynamicView):

    def get(self, request, *args, **kwargs):

        context = self.get_context_data(request, *args, **kwargs)

        return render(request, 'programme.html', context)


class MessageView(DynamicView):

    def get(self, request, *args, **kwargs):

        context = self.get_context_data(request, *args, **kwargs)

        return render(request, 'message.html', context)
        # else:
        #     return render(request, 'message.html', {})
