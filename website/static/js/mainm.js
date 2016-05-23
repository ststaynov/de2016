(function () {

  'use strict';

  var container = $('.c-twitter .c-tweets');
  var staticContainer = $('.c-twitter .c-tweets .static-tweets');  // static tweets, moved by one transition
  var dataFeed;
  var refreshIntervalId;

  var currentTweets = [];
  var maximumTweets = 2;  // on init loading, this should be enough to fill the screen
  var maximumOnscreen = 5; // maximum in the DOM, old ones will be removed with fire and brimstone

  function appearAnimation() {
    //this smoothly fades in new tweets from the top, and pushes the others down, lots of css transition magic here
    $('.c-twitter').addClass('incoming');  // this translates everythin smoothly

    // set the translate value for the old tweet container
    var newTweetElement = $('.c-twitter div.tweet:first');
    var elementHeight = $(newTweetElement).innerHeight();
    $('.static-tweets').css({'transform':'translateY('+elementHeight+'px'})

    setTimeout(function () {
      $('.c-twitter').addClass('incoming-disabling'); // this disables transitions, it needs to snap into new postions

      $('.c-twitter div').removeClass('new'); // remove new class for all tweets, since this is after anim
      $('.c-twitter').removeClass('incoming'); // remove this until the next round
      $('.static-tweets').css({'transform':'translateY(0px)'});

      setTimeout(function () { // remove transition after the next tick
        $('.c-twitter').removeClass('incoming-disabling');
      }, 10)

      //clean up old tweets that are clogging up our html lol
      var tweets = $('.c-twitter div.tweet');
      if (tweets.length > maximumOnscreen) {
        var removed = $('.c-twitter div.tweet:last').remove();
      }

      // move the new tweet into the static container
      var newTweet = $('.c-twitter div.tweet:first').remove();
      $(staticContainer).prepend(newTweet);


    }, 1100); // note no 1000, it will create race condition sometimes, yay for browser tick/tocks...

  };

  function parseTweets(tweets, init) {

    var newTweets = [];

    // get the current tweet ids and push them into the array
    $('.c-twitter div.tweet').each(function (i) {
      currentTweets.push($(this).data('tweetid'));
    });

    var tweetContainer = init ? staticContainer : container;

    function insertNewTweet(tweet) {
      $(tweetContainer).prepend(tweet.content);
      setTimeout(function () {
        appearAnimation();
      }, 10)
    }

    var visibleTweets = currentTweets.length;

    $.each(tweets, function (i, tweet) {
      // loop over the fetched tweets, check if there are new id's
      // check if tweet exists in current tweets, if not add it

      if ($.inArray(tweet.id, currentTweets) == -1) {
        // add it at the top
        if (visibleTweets < maximumTweets) {
          $(tweetContainer).prepend(tweet.content)
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

    insertDelayedTweets()

    // this is only done after initial load, no animations before this!
    if (init) {
      $('.c-twitter div').removeClass('new');  // reset m all
      $('.c-twitter').addClass('initialized');
    }

  };

  $('#incoming').on('click', function (e) {
    e.preventDefault();
    appearAnimation();
    //get_instagram_feed();
  });

  $('#refresh').on('click', function (e) {
    e.preventDefault();
    get_tweets();
    //get_instagram_feed();
  });
  get_tweets(true);




  //setInterval(function() {
  //  get_instagram_feed();
  //}, 60000)

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
  
  function get_instagram_feed() {
    $.ajax({
      url: '/api/instagram/',
      error: function () {
        console.log('error');
      },
      success: function (data) {
        if (dataFeed != data) {
          console.log('update');
          $('.c-instagram').html(data);
          clearInterval(refreshIntervalId);
          use_instagram_feed();
        }
        dataFeed = data;
      },
      type: 'GET'
    });
  }

  function use_instagram_feed(){
    var $divs = $('div#media');
    var count = 1;

    $divs.eq(0).addClass('is-shown');
    console.log('use_instagram_feed');
    refreshIntervalId = setInterval(function() {
      console.log('In Interval');
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
    }, 4000)}

})();

