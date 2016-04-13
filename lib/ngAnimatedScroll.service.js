/** =============================================================
*   Angular Animated Scroll
*   A service for animated scrolling of arbitrary elements that
*   is based on promises.
*   By Hans-Peter Dietz | h.p.dietz@gmail.com | @h_p_d
*   https://github.com/haensl/ngAnimatedScroll
*
*	  Adaption of Angular Smooth Scroll 1.7.1 by David Oliveros.
*   https://github.com/d-oliveros/ngSmoothScroll
*
*	  Free to use under the MIT License.
*
* ============================================================= */

(function() {
  'use strict';

  angular.module('AnimatedScroll', [])
         .factory('animatedScroll', ['$q', '$timeout',
  function($q, $timeout) {

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    (function() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
          }, timeToCall);

          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
      }
    }());

    /**
     *  Default scroll options
     */
    var DEFAULT_OPTIONS = {
      DURATION: 800,
      OFFSET: 0,
      EASING_PATTERN: 'easeInOutQuart',
      TIME_PER_FRAME: 16,
      SCROLL_ELEMENT: window
    };

    /**
     *  Easing patterns
     *  easeIn*: accelerate from zero velocity
     *  easeOut*: decelerate to zero velocity
     *  easeInOut*: accelerate until halfway, then decelerate
     */
    var easingPatterns = {
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
     *  AnimateScroll.getEasingPattern() [private]
     *  Retrieve the easing function.
     *  @param type (string) the desired easing pattern
     *  @return (Function) the easing function
     */
    var getEasingPattern = function(type) {
      if (easingPatterns[type]) {
        return easingPatterns[type];
      }

      return function() {
        return time;
      };
    };

    /**
     *  AnimateScroll.getEndLocation() [private]
     *  Retrive the scroll end location.
     *  @param element (HTMLElement) the element to scroll to.
     *  @return (Number) the end location of the scroll operation
     */
    var getEndLocation = function(element, offset) {
      var location = element.offsetTop - element.clientHeight;
      var offsetParent = element.offsetParent;
      while (offsetParent) {
        location -= offsetParent.offsetTop;
        offsetParent = offsetParent.offsetParent;
      }

      location = Math.max(location - offset, 0);
      return location;
    };

    /**
     *  AnimateScroll.getScrollLocation() [private]
     *  Retrieve current scroll location of the given element.
     *  @param element (HTMLElement) the scroll element
     *  @return (Number) the current scroll location
     */
    var getScrollLocation = function(element) {
      if (element === window) {
        return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
      }

      return element.scrollTop;
    };

    var getInvalidElementError = function() {
      return new Error('Invalid parameter: element must either be an angular.element, Element or a valid selector string!');
    };

    var getScrollFunction = function(scrollElement) {
      if (scrollElement === window) {
        return function(position) {
          window.scroll(0, position);
        };
      } else {
        return function(position) {
          scrollElement.scrollTop = position;
        };
      }
    };

    return {
      /**
       *  AnimateScroll.scroll()
       *  Scroll an element into view.
       *  @param element (Element) the element to scroll into view
       *  @param options (Object) an optional options object with the following signature:
       *    {
       *      duration: (Number) duration of the scroll animation in [ms] (Default: 800ms)
       *      offset: (Number) Vertical offset from the element's scrollTop (Default: 0)
       *      easingPattern: (String) The easing pattern to use for the animation (Default: easeInOutQuart)
       *      scrollElement: (Element) The element to scroll (Default: window)
       *    }
       *  @return (Promise) a promise. The promise is either resolved with the element when the scroll
       *          operation has finished or rejected with an error.
       */
      scroll: function(element, options) {
        var deferred = $q.defer();
        if (!element) {
          deferred.reject(new Error('Missing parameter: element is not defined!'));
          return deferred.promise;
        } else if (typeof element === 'string') {
          var tmp = document.querySelector(element);
          if (tmp) {
            element = tmp;
          } else {
            deferred.reject(getInvalidElementError());
            return deferred.promise;
          }
        } else if (!(element instanceof Element || element instanceof angular.element)) {
          deferred.reject(getInvalidElementError());
          return deferred.promise;
        }

        options = options || {};
        var duration = parseInt(options.duration, 10) || DEFAULT_OPTIONS.DURATION;
        var offset = parseInt(options.offset, 10) || DEFAULT_OPTIONS.OFFSET;
        var easingPattern = typeof options.easing === 'string' ? options.easing : DEFAULT_OPTIONS.EASING_PATTERN;
        var scrollElement = DEFAULT_OPTIONS.SCROLL_ELEMENT;
        if (options.scrollElement instanceof Element ||
            options.scrollElement instanceof angular.element) {
          scrollElement = options.scrollElement instanceof angular.element ? options.scrollElement[0] : options.scrollElement;
        } else if (typeof options.scrollElement === 'string') {
          var tmp = document.querySelector(options.scrollElement);
          if (tmp) {
            scrollElement = tmp;
          }
        }

        if (element instanceof angular.element) {
          element = element[0];
        }

        var easing = getEasingPattern(easingPattern);
        var timeLapsed = 0;
        var scrollTo = getScrollFunction(scrollElement);
        var startLocation = getScrollLocation(scrollElement);
        var endLocation = getEndLocation(element, offset);
        var distance = endLocation - startLocation;
        var percentage;
        var currentLocation;
        var time;
        var now;
        var animationID;
        var position;
        var animation = function() {
          animationID = window.requestAnimationFrame(animation);
          now = Date.now();
          timeLapsed += now - (time || now);
          time = now;
          percentage = (timeLapsed / duration) || 0;
          if (percentage > 1) {
            percentage = 1;
          }

          currentLocation = getScrollLocation(scrollElement);
          position = startLocation + (distance * easing(percentage));
          scrollTo(position);

          if (position === endLocation || currentLocation === endLocation) {
            window.cancelAnimationFrame(animationID);
            $timeout(function() {
              deferred.resolve(element);
            });
          }
        };

        animation();
        return deferred.promise;
      }
    };
  }]);
})();
