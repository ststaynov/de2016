/**
 * Created by stoyans on 23/06/16.
 */

(function(){

    $('body').on('click', '#btn-submit-time', function (e) {
    e.preventDefault();
    var pageMessage = $('#timing-message').val(),
        pageSocial = $('#timing-social').val(),
        pageProgramme = $('#timing-programme').val(),
        programmeEventsTiming = $('#timing-programme-events').val();

        if (pageMessage >= 1 && pageSocial >= 1 && pageProgramme >= 1 && programmeEventsTiming >= 1) {
            $('.timing-overlay').hide();
            createAnimationTimingObject (programmeEventsTiming, pageMessage, pageSocial, pageProgramme);
        } else {
            alert('Fill in all the fields with numbers above 1 a.u.b.');
        }
  });

    function createAnimationTimingObject (programmeEventsTiming, pageMessageScreenTime, pageSocialScreenTime, pageProgrammeScreenTime) {
        console.log('Created object');
        var baseAnimation = new Animation(programmeEventsTiming, pageMessageScreenTime, pageSocialScreenTime, pageProgrammeScreenTime);

        function Animation(programmeEventsTiming, pageMessageScreenTime, pageSocialScreenTime, pageProgrammeScreenTime) {
            this.programmeEventsTiming = programmeEventsTiming;
            this.pageMessageScreenTime = pageMessageScreenTime;
            this.pageSocialScreenTime = pageSocialScreenTime;
            this.pageProgrammeScreenTime = pageProgrammeScreenTime;
        }
        window.baseAnimation = baseAnimation;
        startPageAnimation(programmeEventsTiming, pageMessageScreenTime, pageSocialScreenTime, pageProgrammeScreenTime);
    }
}(window));

