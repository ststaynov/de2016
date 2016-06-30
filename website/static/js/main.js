(function () {

  'use strict';

  var container = $('.c-twitter .c-tweets');
  var staticContainer = $('.c-twitter .c-tweets .static-tweets');  // static tweets, moved by one transition
  var dataFeed;
  var refreshIntervalId;

  var currentTweets = [];
  var maximumTweets = 3;  // on init loading, this should be enough to fill the screen
  var maximumOnscreen = 3; // maximum in the DOM, old ones will be removed with fire and brimstone

  function appearAnimation() {
    //this smoothly fades in new tweets from the top, and pushes the others down, lots of css transition magic here
    $('.c-twitter').addClass('incoming');  // this translates everythin smoothly

    // set the translate value for the old tweet container
    var newTweetElement = $('.c-twitter div.tweet:first');  // this one actually disappears, so yea
    var elementHeight = $(newTweetElement).innerHeight();
    //newTweetElement.addClass('byebye');

    $('.c-twitter').addClass('incoming-disabling'); // kill transition temporarily
    setTimeout(function () {
      var removed = $('.c-twitter div.tweet:first').remove();
      //removed.addClass('byebye');
      $('.c-twitter').prepend(removed);
      $('.static-tweets').css({'transform': 'translateY(' + elementHeight + 'px'});

      setTimeout(function () {
        $('.c-twitter div.tweet:first').addClass('byebye');
        $('.c-twitter').removeClass('incoming-disabling'); // kill transition temporarily
        $('.static-tweets').css({'transform': 'translateY(0px)'});
      }, 10)
    }, 10);


    setTimeout(function () {
      $('.c-twitter').addClass('incoming-disabling'); // this disables transitions, it needs to snap into new postions

      $('.c-twitter div').removeClass('new'); // remove new class for all tweets, since this is after anim
      $('.c-twitter').removeClass('incoming'); // remove this until the next round
      //$('.static-tweets').css({'transform':'translateY(0px)'});

      setTimeout(function () { // remove transition after the next tick
        $('.c-twitter').removeClass('incoming-disabling');
      }, 10)

      //clean up old tweets that are clogging up our html lol
      var tweets = $('.c-twitter div.tweet');
      if (tweets.length > maximumOnscreen) {
        var removed = $('.c-twitter div.tweet:first').remove();
      }

      // move the new tweet into the static container
      //var newTweet = $('.c-twitter div.tweet:last').remove();
      //$(staticContainer).append(newTweet);


    }, 1100); // note no 1000, it will create race condition sometimes, yay for browser tick/tocks...

  }

  function parseTweets(tweets, init) {

    var newTweets = [];
    if (init) {
      currentTweets = [];
    }

    // get the current tweet ids and push them into the array
    $('.c-twitter div.tweet').each(function (i) {
      currentTweets.push($(this).data('tweetid'));
    });
    //console.log('current', currentTweets)
    //console.log('new', newTweets)

    //var tweetContainer = init ? staticContainer : container;
    var tweetContainer = staticContainer; // always add it here, since we are coming in from the bottom

    function insertNewTweet(tweet) {
      $(tweetContainer).append(tweet.content); // add it last
      setTimeout(function () {
        appearAnimation();
      }, 10)
    }

    var visibleTweets = currentTweets.length;

    $.each(tweets, function (i, tweet) {
      // loop over the fetched tweets, check if there are new id's
      // check if tweet exists in current tweets, if not add it

      if ($.inArray(tweet.id, currentTweets) == -1) {
        // add it at the bottom
        if (visibleTweets < maximumTweets) {
          if ($('.blocks-container.move-in')[0]) { // checks if new container exists and if yes pushes new tweets to it
            console.log('putting tweets in new container');
            $('.blocks-container.move-in .c-twitter .c-tweets .static-tweets').append(tweet.content);
          } else {
            $(tweetContainer).append(tweet.content);
          }
          visibleTweets++;
        } else {
          if (!init) {
            newTweets.push(tweet)
          }
        }
      }

    });

    // loopover new ones, with timeout, to add them one after the other..
    function insertDelayedTweets() {

      if (newTweets.length > 0) {
        var nextTweet = newTweets[0];
        newTweets.shift(); // remove the first one
        insertNewTweet(nextTweet);

        //more left? do a delay and repeat, 1500ms to prevent clashing of css class transitions
        if (newTweets.length > 0) {
          setTimeout(function () {
            insertDelayedTweets()
          }, 2000)
        }
      }
    }

    insertDelayedTweets();

    // this is only done after initial load, no animations before this!
    if (init) {
      $('.c-twitter div').removeClass('new');  // reset m all
      $('.c-twitter').addClass('initialized');
    }

  }

  $('body').on('click', '#incoming', function (e) {
    e.preventDefault();
    //appearAnimation();
    //get_instagram_feed();
  });

  $('body').on('click', '#refresh', function (e) {
    e.preventDefault();
    console.log('clicked, if Instagram feed doesnt refresh that means that the data is the same as last time');
    get_tweets();
    get_instagram_feed(false);
  });

  $('body').on('click', '#btn-programma-page', function (e) {
    clearInterval(refreshIntervalId); //refresh Instagram Interval
    clearInterval(eventContainerLoop); //refresh eventContainer Interval for small resolution
    e.preventDefault();
    get_programme();
  });

  $('body').on('click', '#btn-message-page', function (e) {
    clearInterval(refreshIntervalId); //refresh Instagram Interval
    clearInterval(eventContainerLoop); //refresh eventContainer Interval for small resolution
    e.preventDefault();
    get_message();
  });

  $('body').on('click', '#btn-socialmedia-page', function (e) {
    clearInterval(refreshIntervalId); //refresh Instagram Interval
    clearInterval(eventContainerLoop); //refresh eventContainer Interval for small resolution
    e.preventDefault();
    get_social_media();
  });

  // get_tweets(true);

  get_tweets(true);
  function get_tweets(init) {

    $.ajax({
      url: '/api/twitterfeed/',
      error: function () {
        console.log('error');
      },
      success: function (data) {
        //clearInterval(refreshIntervalId);
        //$('#tweet-container').html(data.tweets);
        parseTweets(data.tweets, init);
      },
      type: 'GET'
    });

  }

  get_instagram_feed(false);

  function get_instagram_feed(forceUpdate) {
    $.ajax({
      url: '/api/instagram/',
      error: function () {
        console.log('error');
      },
      success: function (data) {
        if (forceUpdate) {
          console.log('succeeded in force-getting data  ');
          $('.middle-column-container.move-in > .middle-content').html(data);
          clearInterval(refreshIntervalId);
          use_instagram_feed();
        } else if (dataFeed != data) {
          console.log('succeeded in getting data (not forced) ');
          $('.middle-column-container.move-out > .middle-content').html(data);
          clearInterval(refreshIntervalId);
          use_instagram_feed();
        }
        dataFeed = data;
      },
      type: 'GET'
    });
  }

  function use_instagram_feed() {
    var $divs = $('div#media');
    var count = 1;

    $divs.eq(0).addClass('is-shown');
    refreshIntervalId = setInterval(function () {
      $divs.eq(count - 1).removeClass('is-shown');
      if (count == 10) {
        $divs.eq(9).addClass('is-shown');
        count = 0;
      }
      if (count == 0) {
        $divs.eq(9).removeClass('is-shown');
        $divs.eq(count).addClass('is-shown');
      } else {
        $divs.eq(count - 1).removeClass('is-shown');
        $divs.eq(count).addClass('is-shown');
      }
      count++;
    }, 4000)
  }


  var pageType = '',
    pageName = '';

  function get_programme() {
    $.ajax({
      url: '/programme/',
      error: function () {
        console.log('error');
      },
      type: "GET",
      success: function (data) {
        pageType = 'programme theme-white';
        pageName = 'programme';
        split_columns(data, pageType, pageName);
      }
    });
  }

  function get_social_media() {
    $.ajax({
      url: '/socialmedia/',
      error: function () {
        console.log('error');
      },
      type: "GET",
      success: function (data) {
        pageType = 'socialmedia theme-blue';
        pageName = 'socialmedia';
        split_columns(data, pageType, pageName);
      }
    });
  }

  function get_message() {
    $.ajax({
      url: '/message/',
      error: function () {
        console.log('error');
      },
      type: "GET",
      success: function (data) {
        pageType = 'message theme-pink';
        pageName = 'message';
        split_columns(data, pageType, pageName);
      }
    });
  }


  /* Animating left column START */
  function split_columns(data, pageType, pageName) {
    var $loadedleftNew = $('.left-column-container', $(data)),
      $loadedleftOld = $('.left-column-container.move-out'),
      $leftContainerHolder = $('.left-column-container').parent(),
      $rightContainerHolder = $('.blocks-container').parent(),
      $middleContainerHolder = $('.middle-column-container').parent(),
      $loadedmiddleNew = $('.middle-column-container', $(data)),
      $loadedmiddleOld = $('.middle-column-container.move-out'),
      $loadedRightNew = $('.blocks-container', $(data)),
      $loadedRightOld = $('.blocks-container.move-out');

    $loadedleftNew.addClass('move-in v-' + pageName);
    $loadedmiddleNew.addClass('move-in v-' + pageName);
    $loadedRightNew.addClass('move-in v-' + pageName);

    $leftContainerHolder.prepend($loadedleftNew);
    $middleContainerHolder.prepend($loadedmiddleNew);
    $rightContainerHolder.prepend($loadedRightNew);

    if (pageType == 'socialmedia theme-blue') {
      // currentTweets = [];
      get_instagram_feed(true);
      get_tweets(true);
    }

    setTimeout(function () {
      loadTheme(pageType);
      animateColumns($loadedleftNew, $loadedleftOld, $loadedmiddleNew, $loadedmiddleOld, $loadedRightNew, $loadedRightOld);
    }, 2000);
  }

  function animateColumns($loadedLeftNew, $loadedLeftOld, $loadedMiddleNew, $loadedMiddleOld, $loadedRightNew, $loadedRightOld) {
    TweenMax.to($loadedLeftNew, 2, {top: '55px'});
    TweenMax.to($loadedLeftOld, 2, {top: '110vh'});

    TweenMax.to($loadedRightNew, 2, {bottom: '55px'}); //                                                      Why god ?
    TweenMax.to($loadedRightOld, 2, {bottom: '-110vh'});

    TweenMax.to($loadedMiddleNew, 2, {top: '55px'});
    TweenMax.to($loadedMiddleOld, 2, {top: '-110vh', onComplete: finishedAnimating});
  }

  function finishedAnimating() {
    var $toRemove = [$('.left-column-container.move-out'), $('.middle-column-container.move-out'), $('.blocks-container.move-out')],// , $('.blocks-container.move-out')
      $toUpdate = [$('.left-column-container.move-in'), $('.middle-column-container.move-in'), $('.blocks-container.move-in')]; //, $('.blocks-container.move-in')

    $.each($toRemove, function (val) {
      $(this).remove();
    });

    $.each($toUpdate, function (val) {
      var element = $(this);

      element.addClass('move-out');
      element.removeClass('move-in');
    });
  }

  function loadTheme(pageType) {
    var $currentTheme = $('#type');

    switch (pageType) {
      case 'programme theme-white':
        startEventContainerLoop();
        TweenMax.to($currentTheme, 2.8, {backgroundColor: '#FFF', clearProps: "all", onStart: setClasses});
        break;
      case 'socialmedia theme-blue':
        TweenMax.to($currentTheme, 2.8, {backgroundColor: '#B6D8F6', clearProps: "all", onStart: setClasses});
        break;
      case 'message theme-pink':
        TweenMax.to($currentTheme, 2.8, {backgroundColor: '#F4B3D6', clearProps: "all", onStart: setClasses});
        break;
    }

    function setClasses() {
      $currentTheme.removeClass();
      $currentTheme.addClass(pageType);
    }

  }

  /* Animating left column END */

  /* Redrawing function for SVG color bug START */

  $.fn.redraw = function () {
    $(this).each(function () {
      var redraw = this.offsetHeight;
    });
  };
  /* Redrawing function END */

  /* EventContainerLoop START */
  var eventContainerLoop;

  function startEventContainerLoop() {
    var $eventsContainer = $('.e-coming-events'),
      $navigationContainer = $('.c-events-navigation');


    eventContainerLoop = setInterval(function () {
      changeEventsContainerClass()
    }, baseAnimation.programmeEventsTiming + '000');

    function changeEventsContainerClass() {
      if ($eventsContainer.hasClass('first')) {
        $eventsContainer.removeClass('first');
        $navigationContainer.removeClass('first');

        $eventsContainer.addClass('second');
        $navigationContainer.addClass('second');
      } else if ($eventsContainer.hasClass('second')) {
        $eventsContainer.removeClass('second');
        $navigationContainer.removeClass('second');

        $eventsContainer.addClass('third');
        $navigationContainer.addClass('third');
      } else if ($eventsContainer.hasClass('third')) {
        $eventsContainer.removeClass('third');
        $navigationContainer.removeClass('third');

        $eventsContainer.addClass('fourth');
        $navigationContainer.addClass('fourth');
      } else if ($eventsContainer.hasClass('fourth')) {
        $eventsContainer.removeClass('fourth');
        $navigationContainer.removeClass('fourth');

        $eventsContainer.addClass('first');
        $navigationContainer.addClass('first');
      } else {
        $eventsContainer.addClass('first');
        $navigationContainer.addClass('first');
      }
    }
  }

  /* EventContainerLoop END */


  window.startPageAnimation = function startPageAnimation(programmeEventsTiming, pageMessageScreenTime, pageSocialScreenTime, pageProgrammeScreenTime) {
    var currentPage = $('#type');

    startPageAnimationLoop();
    function startPageAnimationLoop() {
      if (currentPage.hasClass('socialmedia')) {
        if (!messagePageExists()) {
          // clearInterval(refreshIntervalId); //refresh Instagram Interval
          clearInterval(eventContainerLoop); //refresh eventContainer Interval for small resolution
          get_programme();
          setTimeout(function () {
            startPageAnimationLoop();
          }, (pageProgrammeScreenTime * '1000') + 3000); //make things into seconds and add the animation time
        } else {
          // clearInterval(refreshIntervalId); //refresh Instagram Interval
          clearInterval(eventContainerLoop); //refresh eventContainer Interval for small resolution
          get_message();
          setTimeout(function () {
            startPageAnimationLoop();
          }, (pageMessageScreenTime * '1000') + 3000); //make things into seconds and add the animation time
        }
      } else if (currentPage.hasClass('programme')) {
        if (!messagePageExists()) {
          // clearInterval(refreshIntervalId); //refresh Instagram Interval
          clearInterval(eventContainerLoop); //refresh eventContainer Interval for small resolution
          get_social_media();

          var tweetLoop;
          console.log('Go to Social Media page');
          setTimeout(function () {
            get_tweets(true);
            console.log('Get the tweets now');
            tweetLoop = setInterval(function () {
              get_tweets(false);
              console.log('Getting tweets each second');
            }, 2000); //Check for new tweets every second
          }, 3000);

          setTimeout(function () {
            clearInterval(tweetLoop); //Clears the tweet interval
            startPageAnimationLoop();
          }, (pageSocialScreenTime * '1000') + 3000); //make things into seconds and add the animation time
        } else {
          // clearInterval(refreshIntervalId); //refresh Instagram Interval
          clearInterval(eventContainerLoop); //refresh eventContainer Interval for small resolution
          get_message();
          setTimeout(function () {
            startPageAnimationLoop();
          }, (pageMessageScreenTime * '1000') + 3000); //make things into seconds and add the animation time
        }
      }
    }

    function messagePageExists() {
      if ($('.message-page-exists').length > 0) return true;
      else return false;
    }
  }

})(window);



