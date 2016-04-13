(function(angular) {
  'use strict';

  describe('ngAnimatedScroll\n', function() {
    var animatedScroll;
    var $rootScope;

    beforeEach(angular.mock.module('AnimatedScroll'));

    beforeEach(angular.mock.inject(function(_$rootScope_, _animatedScroll_) {
      $rootScope = _$rootScope_;
      animatedScroll = _animatedScroll_;
    }));

    describe('scroll()\n', function() {
      beforeEach(function() {
        jasmine.clock().install();
      });

      afterEach(function() {
        jasmine.clock().uninstall();
      });

      describe('When calling the scroll function', function() {
        describe('without providing an element', function() {
          var deferred;
          var resolved;
          var rejectArgs;
          beforeEach(function() {
            resolved = false;
            deferred = animatedScroll.scroll()
              .then(function() {
                resolved = true;
              }).catch(function() {
                rejectArgs = arguments;
              });

            $rootScope.$apply();
          });

          it('should reject the promise', function() {
            expect(resolved).toBe(false);
          });

          it('should pass an error into the reject handler', function() {
            expect(rejectArgs[0] instanceof Error).toBe(true);
          });
        });

        describe('providing an invalid argument as element', function() {
          var deferred;
          var resolved;
          var rejectArgs;
          beforeEach(function() {
            resolved = false;
            deferred = animatedScroll.scroll('test')
              .then(function() {
                resolved = true;
              }).catch(function() {
                rejectArgs = arguments;
              });

            $rootScope.$apply();
          });

          it('should reject the promise', function() {
            expect(resolved).toBe(false);
          });

          it('should pass an error into the reject handler', function() {
            expect(rejectArgs[0] instanceof Error).toBe(true);
          });
        });

        describe('providing an angular.element as element', function() {
          var deferred;
          var resolved;
          var rejectArgs;
          var list;
          var elementToScrollTo;
          beforeEach(function() {
            (function() {
              var l = document.getElementById('list');
              if (l) {
                l.parentElement.removeChild(l);
              }
            })();

            list = angular.element('<ul>').attr('id', 'list').attr('height', '150px').attr('style', 'overflow: scroll; max-height: 150px;');
            elementToScrollTo = angular.element('<li>').attr('height', '25px');
            list.append(elementToScrollTo);
            for (var i = 0; i < 20; i++) {
              list.append(angular.element('<li>').attr('height', '25px'));
            }

            document.body.appendChild(list[0]);
            resolved = false;
            deferred = animatedScroll.scroll(elementToScrollTo)
              .then(function() {
                resolved = true;
              });
          });

          it('should resolve the promise', function() {
            window.setTimeout(function() {
              expect(resolved).toBe(true);
            });
          });
        });

        describe('providing an element as element', function() {
          var deferred;
          var resolved;
          var rejectArgs;
          var list;
          var elementToScrollTo;
          beforeEach(function() {
            (function() {
              var l = document.getElementById('list');
              if (l) {
                l.parentElement.removeChild(l);
              }
            })();

            list = angular.element('<ul>').attr('id', 'list').attr('height', '150px').attr('style', 'overflow: scroll; max-height: 150px;');
            elementToScrollTo = angular.element('<li>').attr('height', '25px');
            list.append(elementToScrollTo);
            for (var i = 0; i < 20; i++) {
              list.append(angular.element('<li>').attr('height', '25px'));
            }

            document.body.appendChild(list[0]);
            resolved = false;
            deferred = animatedScroll.scroll(elementToScrollTo[0])
              .then(function() {
                resolved = true;
              });
          });

          it('should resolve the promise', function() {
            window.setTimeout(function() {
              expect(resolved).toBe(true);
            });
          });
        });

        describe('providing a selector as element', function() {
          var deferred;
          var resolved;
          var rejectArgs;
          var list;
          var elementToScrollTo;
          beforeEach(function() {
            (function() {
              var l = document.getElementById('list');
              if (l) {
                l.parentElement.removeChild(l);
              }
            })();

            list = angular.element('<ul>').attr('id', 'list').attr('height', '150px').attr('style', 'overflow: scroll; max-height: 150px;');
            elementToScrollTo = angular.element('<li>').attr('height', '25px').attr('id', 'scroll-to');
            list.append(elementToScrollTo);
            for (var i = 0; i < 20; i++) {
              list.append(angular.element('<li>').attr('height', '25px'));
            }

            document.body.appendChild(list[0]);
            resolved = false;
            deferred = animatedScroll.scroll('#scroll-to')
              .then(function() {
                resolved = true;
              });
          });

          it('should resolve the promise', function() {
            window.setTimeout(function() {
              expect(resolved).toBe(true);
            });
          });
        });

        describe('with a valid element', function() {
          var deferred;
          var resolved;
          var elementToScrollTo;
          var list;
          beforeEach(function() {
            (function() {
              var l = document.getElementById('list');
              if (l) {
                l.parentElement.removeChild(l);
              }
            })();

            list = angular.element('<ul>').attr('id', 'list').attr('height', '150px').attr('style', 'overflow: scroll; max-height: 150px;');
            elementToScrollTo = angular.element('<li>').attr('height', '25px').attr('id', 'scroll-to');
            list.append(elementToScrollTo);
            for (var i = 0; i < 20; i++) {
              list.append(angular.element('<li>').attr('height', '25px'));
            }

            document.body.appendChild(list[0]);
            resolved = false;
          });

          describe('scrolling on the window', function() {
            beforeEach(function() {
              window.scroll(0, 10000);
              window.scrollTop = 10000;
              window.innerHeight = 150;
            });

            beforeEach(function() {
              deferred = animatedScroll.scroll(elementToScrollTo)
                .then(function() {
                  resolved = true;
                });
            });

            it('should resolve the promise', function() {
              window.setTimeout(function() {
                expect(resolved).toBe(true);
              });
            });

            it('should scroll to the top of the page', function() {
              window.setTimeout(function() {
                expect(window.scrollTop).toBe(0);
              });
            });
          });

          describe('scrolling on the list', function() {
            describe('providing the scrollElement as angular.element', function() {
              beforeEach(function() {
                window.scroll(0, 0);
                list[0].scrollTop = 10000;
                deferred = animatedScroll.scroll(elementToScrollTo, {
                  scrollElement: list
                }).then(function() {
                  resolved = true;
                });
              });

              it('should resolve the promise', function() {
                window.setTimeout(function() {
                  expect(resolved).toBe(true);
                });
              });

              it('should scroll to the top of the list', function() {
                window.setTimeout(function() {
                  expect(list[0].scrollTop).toBe(0);
                });
              });
            });

            describe('providing the scrollElement as HTMLElement', function() {
              beforeEach(function() {
                window.scroll(0, 0);
                list[0].scrollTop = 10000;
                deferred = animatedScroll.scroll(elementToScrollTo, {
                  scrollElement: list[0]
                }).then(function() {
                  resolved = true;
                });
              });

              it('should resolve the promise', function() {
                window.setTimeout(function() {
                  expect(resolved).toBe(true);
                });
              });

              it('should scroll to the top of the list', function() {
                window.setTimeout(function() {
                  expect(list[0].scrollTop).toBe(0);
                });
              });
            });

            describe('providing the scrollElement as selector', function() {
              beforeEach(function() {
                window.scroll(0, 0);
                list[0].scrollTop = 10000;
                deferred = animatedScroll.scroll(elementToScrollTo, {
                  scrollElement: '#list'
                }).then(function() {
                  resolved = true;
                });
              });

              it('should resolve the promise', function() {
                window.setTimeout(function() {
                  expect(resolved).toBe(true);
                });
              });

              it('should scroll to the top of the list', function() {
                window.setTimeout(function() {
                  expect(list[0].scrollTop).toBe(0);
                });
              });
            });
          });

          describe('increasing the scroll duration', function() {
            beforeEach(function() {
              window.scroll(0, 0);
              list[0].scrollTop = 10000;
              deferred = animatedScroll.scroll(elementToScrollTo, {
                scrollElement: list,
                duration: 1000
              }).then(function() {
                  resolved = true;
                });
            });

            it('should not have scrolled to the top of the list, yet', function() {
              window.setTimeout(function() {
                expect(list[0].scrollTop).toBeGreaterThan(0);
              });
            });
          });

          describe('setting an offset', function() {
            beforeEach(function() {
              window.scroll(0, 0);
              list[0].scrollTop = 10000;
              deferred = animatedScroll.scroll(elementToScrollTo, {
                scrollElement: list,
                offset: -20
              }).then(function() {
                  resolved = true;
                });
            });

            it('should scroll to the offset', function() {
              window.setTimeout(function() {
                expect(list[0].scrollTop).toBeGreaterThan(0);
              });
            });
          });
        });
      });
    });

  });
})(window.angular);
