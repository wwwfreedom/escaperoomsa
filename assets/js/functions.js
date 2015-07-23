$(document).ready(function($){
  navigation();
  faqExpander();
  emailControl();
  subscribeForm();
  formControl();
  // lazyloadMap();
  copyright();
  smoothScroll();

});

// to make the internal link of the one page site scroll smoothly instead of the default jump
function smoothScroll() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
}


function copyright() {
  var year = new Date().getFullYear();
  $('.copyright').text(year);
}

function lazyloadMap() {
  ;( function( $, window, document, undefined )
    {

        $( '.contact--map' ).lazyLoadGoogleMaps(
        {
            callback: function( container, map )
            {
                var $container  = $( container ),
                    center      = new google.maps.LatLng( $container.attr( 'data-lat' ), $container.attr( 'data-lng' ) );

                map.setOptions({ zoom: 14, center: center });
                new google.maps.Marker({ position: center, map: map });
            }
        });

    })( jQuery, window, document );

    var $window         = $( window ),  // variable cache for a better performance
    mapInstances    = [],           // stack of map instances

    // change the class below to what ever you name the map
    $pluginInstance = $( '.google-map' ).lazyLoadGoogleMaps(
    {
        callback: function( container, map )
        {
            var $container  = $( container ),
                center      = new google.maps.LatLng( $container.attr( 'data-lat' ), $container.attr( 'data-lng' ) );

            $.data( map, 'center', center );
            mapInstances.push( map );
        }
    });

$window.on( 'resize', $pluginInstance.debounce( 1000, function()
{
    $.each( mapInstances, function()
    {
        this.setCenter( $.data( this, 'center' ) );
    });
}));

}

// function to control the submission of the email form
//
function emailControl() {
  // get the form
  var form = $('.emailSubscribeForm');
  var formMessages = $('.emailForm-messages p');
  var emailInput = $('#emailSubscribe');

  // set up an event listener for the email form
  $(form).submit(function(e) {
    e.preventDefault();
    var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,10})+$/;
    var emailText = $("#email").val();
    if (!emailFilter.test(emailText)) {
      $(formMessages).text("Please enter a valid email address").toggleClass('error');
      $(emailInput).toggleClass('error');
      return false;
    } else {
      $(formMessages).text('').toggleClass('error');
      $(emailInput).toggleClass('error');
    }
  });
}

function subscribeForm() {
  var form = $('#mc-subscribe-form');
  var formMessages = $('.emailForm-messages p');
  var emailInput = $('#mce-EMAIL');
  var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,10})+$/;

  $(form).submit(function(e) {
    e.preventDefault();
    // store the value of the email
    var emailText = $(emailInput).val();
    console.log(emailText);
    // test the email for basic validation
    if (!emailFilter.test(emailText)) {
      $(formMessages).text("Please enter a valid email address").toggleClass('error');
      $(emailInput).toggleClass('error');
      return false;
    } else {
      $(formMessages).text('').toggleClass('error');
      $(emailInput).toggleClass('error');

      $.ajax({
        type: $(form).attr('method'),
        url: $(form).attr('action'),
        data: $(form).serialize(),
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        error: function(err) {
          // Make sure that the formMessage div has the 'error' class
          $(formMessages).removeClass('success');
          $(formMessages).addClass('error');

          // Set the message text
          // if (err.responseText !== '') {
          //   $(formMessages).text(data.responseText);
          // } else {
          $(formMessages).text('Oops! Could not connect to the registration server. Please subscribe again later.');
        },
        success: function(data) {
          if(data.result != "success") {
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');

            // Set the message text
            // if (err.responseText !== '') {
            //   $(formMessages).text(data.responseText);
            // } else {
            $(formMessages).text(data.msg);
          }
          else {
            // Make sure that the formMessages div has the 'success' class.
            $(formMessages).removeClass('error');
            $(formMessages).addClass('success');
            console.log(data);
            // Set the message text
            $(formMessages).text("Awesome! Thank you for subscribing. Check your inbox or spam folder now to confirm your subscription.");

            // Clear the form
            $('#name').val('');
            $('#email').val('');
            $('#message').val('');
          }
        }
      });
    }
  });
}

// function to control the submission of the contact form
//
function formControl() {
  // get the form
  var form = $('.form');

  // Get the message div
  var formMessages = $('.form-messages p');
  var emailInput = $('#email');

  // Set up an event listener for the contact form
  $(form).submit(function(e) {
    e.preventDefault();

    var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,10})+$/;
    var emailText = $("#email").val();
    if (!emailFilter.test(emailText)) {
      $(formMessages).text("Please enter a valid email address").toggleClass('error');
      $(emailInput).toggleClass('error');
      return false;
    } else {
      $(formMessages).text('').toggleClass('error');
      $(emailInput).toggleClass('error');
    }

    // else {
    //   // $("#email").css({
    //   //   "color" : "#CE3B46"
    //   // });
    // }

    // don't need to filter name as much but if I need to activate this code below
    // var nameFilter = /^([a-zA-Z \t]{3,15})+$/;
    // var nameText = $("#name").val();
    // if (nameFilter.test(nameText)) {
    //   $("#name").css({
    //     "color" : "#609D29"
    //   });
    // }
    // else {
    //   // $("#name").css({
    //   //   "color" : "#CE3B46"
    //   // });
    //   $(formMessages).text("Please enter a valid name");
    //   return false;
    // }

    $.ajax({
      type: 'POST',
      url: "http://formspree.io/escaperoomsa@gmail.com",
      // Must serialize the form data
      data: $(form).serialize(),
      dataType: "json",
      beforeSend: function() {
        // validate the
      },
      success: function(data) {
        // Make sure that the formMessages div has the 'success' class.
        $(formMessages).removeClass('error');
        $(formMessages).addClass('success');
        console.log(data);
        // Set the message text
        $(formMessages).text("The message is on it's way. We'll get back to you asap.");

        // Clear the form
        $('#name').val('');
        $('#email').val('');
        $('#message').val('');

      },
      error: function(err) {
        // Make sure that the formMessage div has the 'error' class
        $(formMessages).removeClass('success');
        $(formMessages).addClass('error');

        // Set the message text
        // if (err.responseText !== '') {
        //   $(formMessages).text(data.responseText);
        // } else {
          $(formMessages).text('Oops! An error occured and your message could not be sent. Please try again.');
        }
      }); // end ajax function
  });
}


function faqExpander() {
  var $tab = $('.tab');

  $tab.on("click", function(e){
    e.preventDefault();
    var $this = $(this);
    $this.toggleClass('active');
    $this.next('.panel').toggleClass('active');
  });
}

// THIS IS THE FUNCITON TO CONTROL NAVIGATION BEHAVIOURS
function navigation() {
  //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
  var MQL = 1170;

  //primary navigation slide-in effect
  if($(window).width() > MQL) {
    var headerHeight = $('.header').height();
    $(window).on('scroll',
    {
          previousTop: 0
      },
      function () {
        var currentTop = $(window).scrollTop();
        //check if user is scrolling up
        if (currentTop < this.previousTop ) {
          //if scrolling up...
          if (currentTop > 0 && $('.header').hasClass('is-fixed')) {
            $('.header').addClass('is-visible');
          } else {
            $('.header').removeClass('is-visible is-fixed');
          }
        } else {
          //if scrolling down...
          $('.header').removeClass('is-visible');
          if( currentTop > headerHeight && !$('.header').hasClass('is-fixed')) $('.header').addClass('is-fixed');
        }
        this.previousTop = currentTop;
    });
  }

  //open/close primary navigation
  $('.primary-nav-trigger').on('click', function(){
    $('.menu-icon').toggleClass('is-clicked');
    $('.header').toggleClass('menu-is-open');

    //in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    if( $('.primary-nav').hasClass('is-visible') ) {
      $('.primary-nav').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
        $('body').removeClass('overflow-hidden');
      });
    } else {
      $('.primary-nav').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
        $('body').addClass('overflow-hidden');
      });
    }
  });

// this is to close the menu once one of the link is clicked
  $('.primary-nav li a').click(function(e){
    // this is a mistake here it's a link so you want it to link somewhere if you prevent default it will not link anywhere. the prevent default is only good for submit button
    // e.preventDefault();
    $('.menu-icon').toggleClass('is-clicked');
    if( $('.primary-nav').hasClass('is-visible') ) {
      $('.primary-nav').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
        $('body').removeClass('overflow-hidden');
      });
    } else {
      $('.primary-nav').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
        $('body').addClass('overflow-hidden');
      });
    }
  });
}