# ngAnimatedScroll
A promise based angular.js service to facilitate animated scrolling.

## Features

  * Exposes a service that scrolls an arbitrary element to another element's location.
  * Promise enabled: The service returns a promise and resolves upon completion of the scroll operation.
  * Clean: No classes, no jQuery, no CSS, just plain Angular.js

## Installation

  1. Install the ngAnimatedScroll package

    * via **NPM**:

      ```javascript
      npm install ng-animated-scroll --save
      ```

    * or **Bower**:

      ```javascript
      bower install ngAnimatedScroll --save
      ```

  2. Include the library into your application:

    * if installed via **NPM** include from `node_modules`:

      ```html
      <script src="/node_modules/ngAnimatedScroll/dist/ngAnimatedScroll.min.js"></script>
      ```

    * if installed via **Bower** include from `bower_components`:

      ```html
      <script src="/bower_components/ngAnimatedScroll/dist/ngAnimatedScroll.min.js"></script>
      ```

## Usage

Inject the `animtedScroll` service into your directive, factory, controller, etc. and call it's `scroll()` method.

### Example: Simple scroll operation

  ```javascript
  angular.module('myController', ['animatedScroll', function(animatedScroll) {
    var elementIWantToScrollTo = document.getElementById('anElementIWantToScrollTo');
    animatedScroll.scroll(elementIWantToScrollTo);
  }]);
  ```

### Example: Leveraging the promise

```javascript
angular.module('myController', ['animatedScroll', function(animatedScroll) {
  var elementIWantToScrollTo = document.getElementById('anElementIWantToScrollTo');
  animatedScroll.scroll(elementIWantToScrollTo)
    .then(function(element) {
      // do something after the element was scrolled into view
      // element = elementIWantToScrollTo
    });
}]);
```

### Example: Scrolling within an Element

```javascript
angular.module('myController', ['animatedScroll', function(animatedScroll) {
  var listItemIWantToScrollTo = document.getElementById('listItemIWantToScrollTo');
  var list = document.getElementById('aList');
  animatedScroll.scroll(elementIWantToScrollTo, {
    scrollElement: list
  }).then(function(element) {
    // do something after the the list item was scrolled into view
    // element = listItemIWantToScrollTo
  });
}]);
```

## Arguments

### element *(required)*
Type: `Element | angular.element`

The element to scroll to.

### options *(optional)*
Type: `Object`

Options for the scroll operation. *(See [Options](#options))*

## <a name="options"></a>Options

### duration
Type: `Integer`
Default: `800`

The duration of the scroll animation in milliseconds.

### offset
Type: `Integer`
Default: `0`

An offset to the element's top at which to stop scrolling.

### easing
Type: `String`
Default: `easeInOutQuart`

The easing function to be used for the animation. Currently supported are:

  * `easeInQuad`
  * `easeOutQuad`
  * `easeInOutQuad`
  * `easeInCubic`
  * `easeOutCubic`
  * `easeInOutCubic`
  * `easeInQuart`
  * `easeOutQuart`
  * `easeInOutQuart`
  * `easeInQuint`
  * `easeOutQuint`
  * `easeInOutQuint`
  * `none` (no easing)

### timePerFrame
Type: `Integer`
Default: `16`

The time for one animation frame in milliseconds.

### scrollElement
Type: `Element | angular.element`
Default: `window`

The element to scroll.

## [Changelog](CHANGELOG.md)

## Credits

[ngSmoothScroll](https://github.com/d-oliveros/ngSmoothScroll) by [David Oliveros](https://github.com/d-oliveros) which formed the base for ngAnimatedScroll
https://github.com/d-oliveros/ngSmoothScroll



## [License](LICENSE)

The MIT License (MIT)

Copyright &copy; Hans-Peter Dietz | [@h_p_d](https://twitter.com/h_p_d) | [h.p.dietz@gmail.com](mailto:h.p.dietz@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
