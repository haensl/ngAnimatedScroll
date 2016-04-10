/* =============================================================
/*
/*	 Adaption of Angular Smooth Scroll 1.7.1
/*	 Animates scrolling to elements, by David Oliveros.
/*
/*   Callback hooks contributed by Ben Armston
/*   https://github.com/benarmston
/*
/*	 Easing support contributed by Willem Liu.
/*	 https://github.com/willemliu
/*
/*	 Easing functions forked from Gaëtan Renaudeau.
/*	 https://gist.github.com/gre/1650294
/*
/*	 Infinite loop bugs in iOS and Chrome (when zoomed) by Alex Guzman.
/*	 https://github.com/alexguzman
/*
/*	 Influenced by Chris Ferdinandi
/*	 https://github.com/cferdinandi
/*
/*
/*	 Free to use under the MIT License.
/*
/* ============================================================= */

(function() {
  'use strict';

  angular.module('AnimateScroll', [])
         .factory('animateScroll', ['$q', '$timeout', '$interval',
  function($q, $timeout, $interval) {
    var TIME_PER_FRAME = 16; // time between animation frames in [ms]
    /**
     *  Easing patterns
     *  easeIn*: accelerate from zero velocity
     *  easeOut*: decelerate to zero velocity
     *  easeInOut*: accelerate until halfway, then decelerate
     */
    var _easingPatterns = {
      easeInQuad: function(time) {
        return time * time;
      },

      easeOutQuad: function(time) {
        return time * (2 - time);
      },

      easeInOutQuad: function(time) {
        return time < 0.5 ? 2 * time * time :
                            -1 + (4 - 2 * time) * time;
      },

      easeInCubic: function(time) {
         return time * time * time;
       },

      easeOutCubic: function(time) {
        return (--time) * time * time + 1;
      },

      easeInOutCubic: function(time) {
        return time < 0.5 ? 4 * time * time * time :
                            (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
      },

      easeInQuart: function(time) {
        return time * time * time * time;
      },

      easeOutQuart: function(time) {
        return 1 - (--time) * time * time * time;
      },

      easeInOutQuart: function(time) {
        return time < 0.5 ? 8 * time * time * time * time :
                            1 - 8 * (--time) * time * time * time;
      },

      easeInQuint: function(time) {
        return time * time * time * time * time;
      },

      easeOutQuint: function(time) {
        return 1 + (--time) * time * time * time * time;
      },

      easeInOutQuint: function(time) {
        return time < 0.5 ? 16 * time * time * time * time * time :
                            1 + 16 * (--time) * time * time * time * time;
      }
    };

    /**
     *  AnimateScroll._getEasingPattern() [private]
     *  Retrieve the easing function.
     *  @param type (string) the desired easing pattern
     *  @return (Function) the easing function
     */
    var _getEasingPattern = function(type) {
      if (easingPatterns[type]) {
        return easingPatterns[type];
      }

      return function() {
        return time;
      };
    };

    /**
     *  AnimateScroll._getEndLocation() [private]
     *  Retrive the scroll end location.
     *  @param element (HTMLElement) the element to scroll to.
     *  @return (Number) the end location of the scroll operation
     */
    var _getEndLocation = function(element) {
      var location = element.offsetTop - element.clientHeight;
      var offsetParent = element.offsetParent;
      while (offsetParent) {
        location -= offsetParent.offsetTop;
        offsetParent = offsetParent.offsetParent;
      }

      location = Math.max(location - offset, 0);
      return location;
    };

    return {
      /**
       *  AnimateScroll.scroll()
       *  Scroll an element.
       *  @param element ()
       */
      scroll: function(element, options) {
        options = options || {};
        var duration = options.duration || 800;
        var offset = options.offset || 0;
        var easingPattern = options.easing || 'easeInOutQuart';
        var scrollElement = options.scrollElement || window;
        if (scrollElement instanceof angular.element) {
          scrollElement = scrollElement[0];
        }

        var easing = _getEasingPattern(easingPattern);
        var deferred = $q.defer();

        $timeout(function() {
          var startLocation = scrollElement === window ?
                              (window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop) :
                              scrollElement.scrollTop;
          var timeLapsed = 0;
          var percentage;
          var position;
          var endLocation = _getEndLocation(element);
          var distance = endLocation - startLocation;
          var animationInterval = $interval(function() {
            timeLapsed += TIME_PER_FRAME;
            percentage = (timeLapsed / duration);
            if (percentage > 1) {
              percentage = 1;
            }

            position = startLocation + (distance * easing(percentage));
            scrollElement.scrollTop = position;
            if (position === endLocation || currentLocation === endLocation) {
              $interval.cancel(animationInterval);
              deferred.resolve();
            }
          }, TIME_PER_FRAME);
        });

        return deferred.promise;
      }
    };
  }]);
})();
