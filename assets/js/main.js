/*********************************
 * ANIMATION FUNCTIONS           *
 * Animations not related to     *
 * page transitions              *
 *                               *
 *********************************/

function retractNav() {
    'use strict';
    var $navMenu = $(".headroom-container #main-nav");
    if ($navMenu.hasClass("display")) {
        $navMenu.toggleClass("display");
        $navMenu.velocity( { translateY: "-110%", duration: 420 });
        console.log("Menu retracted."); /* TEST */
    }
}

/*** INITIATE ANIMATIONS ***/
function initAnimations() {
    'use strict';
    //MOBILE MENU ANIMATION
    var $navMenu = $(".headroom-container #main-nav");
    $navMenu.css("opacity","0");
    $navMenu.velocity( {translateY: "-110%", duration: 0});
    $(".headroom-container #menu-icon").click(function () {
        $navMenu.css("opacity","1");
        $navMenu.toggleClass("display");
        if ($navMenu.hasClass("display")) {
            $navMenu.velocity( { translateY: 0, duration: 420 });
            console.log("Menu displaying."); /* TEST */
        } else {
            $navMenu.velocity( { translateY: "-110%", duration: 420 });
            console.log("Menu hidden."); /* TEST */
        }
    });
    
    //INITIALIZE ANIMATED DROPDOWN HEADER
    //Select Headroom element
    var bannerElement = document.querySelector("header.banner .headroom-container");
    
    //Initialize element if exists
    if (bannerElement !== null) {
        // construct an instance of Headroom, passing the element
        var headroom  = new Headroom(bannerElement, { onUnpin : function () { retractNav(); } });
        // initialise
        console.log("Headroom initiated."); /* TEST */
        headroom.init();
    }
    
    //INITIALIZE HOMEPAGE ARROW
    homePageArrow();
    return null;
}

/*** ANIMATE HOMEPAGE ARROW ICON ***/

//global var
var bounceInterval;

function homePageArrow(action) {
    'use strict';
    //Set default value
    var $arrow = $("#icon-arrow");
    action = action || "fadeIn";
    if (action === "fadeIn" && !($arrow.hasClass("on"))) {
        $arrow.addClass("on").delay(800).velocity("fadeIn", { duration: 330 });
        bounceInterval = setInterval(function () {
            $arrow.velocity({top: "24px"}, { duration: 300 }).velocity({top: "0"}, {duration: 300});
        }, 700);
        console.log("Set interval."); /* TEST */
    } else if (action === "fadeOut" && $arrow.hasClass("on")) {
        $arrow.removeClass("on");
        clearInterval(bounceInterval);
        $arrow.velocity("fadeOut", { duration: 330 });
        console.log("Cleared interval."); /* TEST */
    }
    return null;
}


/*********************************
 * JQUERY DOCUMENT               *
 * Fires when document loads     *
 *                               *
 *********************************/

$(document).ready(function () {
    'use strict';
    initAnimations();
    //Fade in Home Page Arrow Icon
    if (window.pageYOffset < 10) {
        homePageArrow("fadeIn");
    }
    window.onscroll = function () {
        var $arrow = $("#icon-arrow");
        if (window.pageYOffset < 10 && !($arrow.hasClass("velocity-animating"))) {
            homePageArrow("fadeIn");
        } else if (window.pageYOffset > 10 && $arrow.hasClass("velocity-animating")) {
            homePageArrow("fadeOut");
        }
    };
});

/*********************************
 * PAGE TRANSITIONS              *
 * Powered by smoothstate.js     *
 *                               *
 *********************************/

$(function () {
    'use strict';
    var $page = $('#main'),
        options = {
            debug: true,
            prefetch: false,
            onStart: {
                duration: 330, // Duration of our animation
                render: function ($container) {
                    // Add CSS animation reversing class
                    $container.addClass('is-exiting');
                    // Restart animation
                    smoothState.restartCSSAnimations();
                }
            },
            onReady: {
                duration: 0,
                render: function ($container, $newContent) {
                    // Remove your CSS animation reversing class
                    $container.removeClass('is-exiting');
                    window.scrollTo(0, 0);
                    // Inject the new content
                    $container.html($newContent);
                    homePageArrow("fadeOut");
                }
            },
            onAfter: function ($container, $newContent) {
                initAnimations();
            }
        },
        smoothState = $page.smoothState(options).data('smoothState');
});