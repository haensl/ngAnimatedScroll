# ngAnimatedScroll

A promise based angular.js service to facilitate animated scrolling

[![NPM](https://nodei.co/npm/ng-animated-scroll.png?downloads=true)](https://nodei.co/npm/ng-animated-scroll/)

## Features

- Exposes a service that scrolls an arbitrary element to another element's location.
- Promise enabled: The service returns a promise and resolves upon completion of the scroll operation.
- Selector enabled: Use CSS selectors to specify to which element to scroll.
- Leverages [`window.getAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) for a smooth and efficient scroll animation
- Clean: No classes, no jQuery, no CSS, just plain Angular.js

## Installation

1. Install the ngAnimatedScroll package

  via **NPM**:

  ```javascript
  npm install ng-animated-scroll --save
  ```

  or **Bower**:

  ```javascript
  bower install ng-animated-scroll --save
  ```

2. Include the library into your application:

  if installed via **NPM** include from `node_modules`:

  ```html
  <script src="/node_modules/ng-animated-scroll/dist/ngAnimatedScroll.service.min.js"></script>
  ```

  if installed via **Bower** include from `bower_components`:

  ```html
  <script src="/bower_components/ng-animated-scroll/dist/ngAnimatedScroll.service.min.js"></script>
  ```

## Usage

1.  Add a dependency to `AnimatedScroll` to your app

    ```javascript
    angular.module('myApp', ['AnimatedScroll']);
    ```

2.  Inject the `animatedScroll` service into your directive, factory, controller, etc. and call it's `scroll()` method.
    ```javascript
    angular.module('myController', ['animatedScroll', function(animatedScroll) {
      animatedScroll.scroll(elementToScrollTo);
    }]);
    ```


### Example: Simple scroll operation

```javascript
angular.module('myController', ['animatedScroll', function(animatedScroll) {
  var elementIWantToScrollTo = document.getElementById('anElementIWantToScrollTo');
  animatedScroll.scroll(elementIWantToScrollTo);
}]);
```

### Example: Using CSS selectors

```javascript
angular.module('myController', ['animatedScroll', function(animatedScroll) {
  animatedScroll.scroll('#someElement');
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

### element _(required)_

Type: `Element | angular.element | selector (string)`

The element to scroll to. This can be an angular.element, (HTML)Element or CSS selector string.

### options _(optional)_

Type: `Object`

Options for the scroll operation. _(See [Options](#options))_

## []()Options

### duration

Type: `Integer` Default: `800`

The duration of the scroll animation in milliseconds.

### offset

Type: `Integer` Default: `0`

An offset to the element's top at which to stop scrolling.

### easing

Type: `String` Default: `easeInOutQuart`

The easing function to be used for the animation. Currently supported are:

- `easeInQuad`
- `easeOutQuad`
- `easeInOutQuad`
- `easeInCubic`
- `easeOutCubic`
- `easeInOutCubic`
- `easeInQuart`
- `easeOutQuart`
- `easeInOutQuart`
- `easeInQuint`
- `easeOutQuint`
- `easeInOutQuint`
- `none` (no easing)

### scrollElement

Type: `Element | angular.element | selector (string)` Default: `window`

The element to scroll. This can be an angular.element, (HTML)Element or CSS selector string.

## [Changelog](CHANGELOG.md)

## Credits

[ngSmoothScroll](https://github.com/d-oliveros/ngSmoothScroll) by [David Oliveros](https://github.com/d-oliveros) which formed the base for ngAnimatedScroll

<https://github.com/d-oliveros/ngSmoothScroll>

## [License](LICENSE)

The MIT License (MIT)

Copyright © Hans-Peter Dietz | [@h_p_d](https://twitter.com/h_p_d) | [h.p.dietz@gmail.com](mailto:h.p.dietz@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
