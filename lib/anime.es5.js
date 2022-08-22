/*
  * anime.js v3.3.0 - ES5 IIFE
  * (c) 2022 Julian Garnier
  * Released under the MIT license
  * animejs.com
*/

var anime = (function () {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // Misc
  var noop = function noop() {};
  var pi = Math.PI;
  var minValue = Number.MIN_VALUE; // Strings

  var emptyString = '';
  var openParenthesisString = '(';
  var closeParenthesisString = ')';
  var commaString = ',';
  var rgbaString = 'rgba(';
  var hexValuePrefix = '0x'; // Default animation parameters

  var defaultInstanceSettings = {
    update: noop,
    begin: noop,
    loopBegin: noop,
    changeBegin: noop,
    change: noop,
    changeComplete: noop,
    loopComplete: noop,
    complete: noop,
    loop: 1,
    direction: 'normal',
    autoplay: true,
    timelineOffset: 0
  };
  var defaultTweenSettings = {
    duration: 1000,
    delay: 0,
    endDelay: 0,
    easing: 'easeOutElastic(1, .5)',
    round: 0
  }; // Global settings

  var settings = {
    speed: 1,
    suspendWhenDocumentHidden: true
  }; // Animation type

  var animationTypes = {
    OBJECT: 0,
    ATTRIBUTE: 1,
    CSS: 2,
    TRANSFORM: 3
  };
  var valueTypes = {
    NUMBER: 0,
    UNIT: 1,
    COLOR: 2,
    PATH: 3,
    COMPLEX: 4
  }; // Transforms

  var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d']; // Regex

  var hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
  var rgbTestRgx = /^rgb/i;
  var hslTestRgx = /^hsl/i;
  var rgbExecRgx = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
  var rgbaExecRgx = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
  var hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
  var hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
  var springTestRgx = /^spring/;
  var easingsExecRgx = /\(([^)]+)\)/;
  var digitWithExponentRgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  var unitsExecRgx = /^([+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)+(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)$/;
  var lowerCaseRgx = /([a-z])([A-Z])/g;
  var lowerCaseRgxParam = '$1-$2';
  var transformsExecRgx = /(\w+)\(([^)]*)\)/g;
  var relativeValuesExecRgx = /^(\*=|\+=|-=)/;

  function selectString(str) {
    try {
      var nodes = document.querySelectorAll(str);
      return nodes;
    } catch (e) {
      return;
    }
  } // Numbers functions

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
  function round(val) {
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return Math.round(val * base) / base;
  }
  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } // Types

  var is = {
    arr: function arr(a) {
      return Array.isArray(a);
    },
    obj: function obj(a) {
      return a.constructor === Object;
    },
    svg: function svg(a) {
      return a instanceof SVGElement;
    },
    dom: function dom(a) {
      return a.nodeType || is.svg(a);
    },
    num: function num(a) {
      return typeof a === 'number';
    },
    str: function str(a) {
      return typeof a === 'string';
    },
    fnc: function fnc(a) {
      return typeof a === 'function';
    },
    und: function und(a) {
      return typeof a === 'undefined';
    },
    nil: function nil(a) {
      return is.und(a) || a === null;
    },
    hex: function hex(a) {
      return hexTestRgx.test(a);
    },
    rgb: function rgb(a) {
      return rgbTestRgx.test(a);
    },
    hsl: function hsl(a) {
      return hslTestRgx.test(a);
    },
    col: function col(a) {
      return is.hex(a) || is.rgb(a) || is.hsl(a);
    },
    key: function key(a) {
      return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
    }
  }; // Arrays

  function filterArray(arr, callback) {
    var len = arr.length;
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    var result = [];

    for (var i = 0; i < len; i++) {
      if (i in arr) {
        var val = arr[i];

        if (callback.call(thisArg, val, i, arr)) {
          result.push(val);
        }
      }
    }

    return result;
  }
  function flattenArray(arr) {
    return arr.reduce(function (a, b) {
      return a.concat(is.arr(b) ? flattenArray(b) : b);
    }, []);
  }
  function toArray(o) {
    if (is.arr(o)) return o;
    if (is.str(o)) o = selectString(o) || o;
    if (o instanceof NodeList || o instanceof HTMLCollection) return [].slice.call(o);
    return [o];
  }
  function arrayContains(arr, val) {
    return arr.some(function (a) {
      return a === val;
    });
  } // Objects

  function replaceObjectProps(o1, o2) {
    var o = _objectSpread2({}, o1);

    for (var p in o1) {
      o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
    }

    return o;
  }
  function mergeObjects(o1, o2) {
    var o = _objectSpread2({}, o1);

    for (var p in o2) {
      o[p] = is.und(o1[p]) ? o2[p] : o1[p];
    }

    return o;
  } // Functions

  function applyArguments(func, args) {
    return func.apply(null, args);
  } // Document

  var isBrowser = !is.und(window) && !is.und(window.document);
  function isDocumentHidden() {
    return isBrowser && document.hidden;
  }

  // Cache
  var cache = {
    CSS: {},
    propertyNames: {},
    springs: {}
  };

  function parseEasingParameters(string) {
    var match = easingsExecRgx.exec(string);
    return match ? match[1].split(',').map(function (p) {
      return parseFloat(p);
    }) : [];
  } // Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js


  function spring(string, duration) {
    var params = parseEasingParameters(string);
    var mass = clamp(is.und(params[0]) ? 1 : params[0], .1, 100);
    var stiffness = clamp(is.und(params[1]) ? 100 : params[1], .1, 100);
    var damping = clamp(is.und(params[2]) ? 10 : params[2], .1, 100);
    var velocity = clamp(is.und(params[3]) ? 0 : params[3], .1, 100);
    var w0 = Math.sqrt(stiffness / mass);
    var zeta = damping / (2 * Math.sqrt(stiffness * mass));
    var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
    var a = 1;
    var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

    function solver(t) {
      var progress = duration ? duration * t / 1000 : t;

      if (zeta < 1) {
        progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
      } else {
        progress = (a + b * progress) * Math.exp(-progress * w0);
      }

      if (t === 0 || t === 1) return t;
      return 1 - progress;
    }

    function getDuration() {
      var cached = cache.springs[string];
      if (cached) return cached;
      var frame = 1 / 6;
      var elapsed = 0;
      var rest = 0;

      while (true) {
        elapsed += frame;

        if (solver(elapsed) === 1) {
          rest++;
          if (rest >= 16) break;
        } else {
          rest = 0;
        }
      }

      var duration = elapsed * frame * 1000;
      cache.springs[string] = duration;
      return duration;
    }

    return duration ? solver : getDuration;
  } // Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function


  function steps() {
    var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    return function (t) {
      return Math.ceil(clamp(t, 0.000001, 1) * steps) * (1 / steps);
    };
  } // BezierEasing https://github.com/gre/bezier-easing


  var bezier = function () {
    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    function A(aA1, aA2) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }

    function B(aA1, aA2) {
      return 3.0 * aA2 - 6.0 * aA1;
    }

    function C(aA1) {
      return 3.0 * aA1;
    }

    function calcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }

    function getSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function binarySubdivide(aX, aA, aB, mX1, mX2) {
      var currentX,
          currentT,
          i = 0;

      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;

        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > 0.0000001 && ++i < 10);

      return currentT;
    }

    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
      for (var i = 0; i < 4; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }

      return aGuessT;
    }

    function bezier(mX1, mY1, mX2, mY2) {
      if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) return;
      var sampleValues = new Float32Array(kSplineTableSize);

      if (mX1 !== mY1 || mX2 !== mY2) {
        for (var i = 0; i < kSplineTableSize; ++i) {
          sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
      }

      function getTForX(aX) {
        var intervalStart = 0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }

        --currentSample;
        var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);

        if (initialSlope >= 0.001) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
      }

      return function (x) {
        if (mX1 === mY1 && mX2 === mY2) return x;
        if (x === 0 || x === 1) return x;
        return calcBezier(getTForX(x), mY1, mY2);
      };
    }

    return bezier;
  }();

  var penner = function () {
    // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
    var eases = {
      linear: function linear() {
        return function (t) {
          return t;
        };
      }
    };
    var functionEasings = {
      Sine: function Sine() {
        return function (t) {
          return 1 - Math.cos(t * Math.PI / 2);
        };
      },
      Circ: function Circ() {
        return function (t) {
          return 1 - Math.sqrt(1 - t * t);
        };
      },
      Back: function Back() {
        return function (t) {
          return t * t * (3 * t - 2);
        };
      },
      Bounce: function Bounce() {
        return function (t) {
          var pow2,
              b = 4;

          while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}
          return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
        };
      },
      Elastic: function Elastic() {
        var amplitude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var period = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : .5;
        var a = clamp(amplitude, 1, 10);
        var p = clamp(period, .1, 2);
        return function (t) {
          return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
        };
      }
    };
    var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
    baseEasings.forEach(function (name, i) {
      functionEasings[name] = function () {
        return function (t) {
          return Math.pow(t, i + 2);
        };
      };
    });
    Object.keys(functionEasings).forEach(function (name) {
      var easeIn = functionEasings[name];
      eases['easeIn' + name] = easeIn;

      eases['easeOut' + name] = function (a, b) {
        return function (t) {
          return 1 - easeIn(a, b)(1 - t);
        };
      };

      eases['easeInOut' + name] = function (a, b) {
        return function (t) {
          return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
        };
      };

      eases['easeOutIn' + name] = function (a, b) {
        return function (t) {
          return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
        };
      };
    });
    return eases;
  }();

  function parseEasings(easing, duration) {
    if (is.fnc(easing)) return easing;
    var name = easing.split('(')[0];
    var ease = penner[name];
    var args = parseEasingParameters(easing);

    switch (name) {
      case 'spring':
        return spring(easing, duration);

      case 'cubicBezier':
        return applyArguments(bezier, args);

      case 'steps':
        return applyArguments(steps, args);

      default:
        return applyArguments(ease, args);
    }
  }

  function getTransformUnit(propName) {
    if (propName.includes('scale')) return 0;
    if (propName.includes('rotate') || propName.includes('skew')) return 'deg';
    return 'px';
  }
  var nonConvertableUnitsYet = ['', 'deg', 'rad', 'turn'];
  function convertValueUnit(el, decomposedValue, unit) {
    nonConvertableUnitsYet[0] = unit;

    if (decomposedValue.type === valueTypes.UNIT && arrayContains(nonConvertableUnitsYet, decomposedValue.unit)) {
      return decomposedValue;
    }

    var valueNumber = decomposedValue.number;
    var valueUnit = decomposedValue.unit;
    var cached = cache.CSS[valueNumber + valueUnit + unit];

    if (!is.und(cached)) {
      decomposedValue.number = cached;
    } else {
      var baseline = 100;
      var tempEl = document.createElement(el.tagName);
      var parentNode = el.parentNode;
      var parentEl = parentNode && parentNode !== document ? parentNode : document.body;
      parentEl.appendChild(tempEl);
      tempEl.style.position = 'absolute';
      tempEl.style.width = baseline + valueUnit;
      var currentUnitWidth = tempEl.offsetWidth ? tempEl.offsetWidth / 100 : 0;
      tempEl.style.width = baseline + unit;
      var newUnitWidth = tempEl.offsetWidth ? tempEl.offsetWidth / 100 : 0;
      var factor = tempEl.offsetWidth ? currentUnitWidth / newUnitWidth : 0;
      parentEl.removeChild(tempEl);
      var convertedValue = factor * valueNumber;
      decomposedValue.number = convertedValue;
      cache.CSS[valueNumber + valueUnit + unit] = convertedValue;
    }

    decomposedValue.type === valueTypes.UNIT;
    decomposedValue.unit = unit;
    return decomposedValue;
  }

  function sanitizePropertyName(propertyName, targetEl, animationType) {
    if (animationType === animationTypes.CSS || // Handle special cases where properties like "strokeDashoffset" needs to be set as "stroke-dashoffset"
    // but properties like "baseFrequency" should stay in lowerCamelCase
    animationType === animationTypes.ATTRIBUTE && is.svg(targetEl) && propertyName in targetEl.style) {
      var cachedPropertyName = cache.propertyNames[propertyName];

      if (cachedPropertyName) {
        return cachedPropertyName;
      } else {
        var lowerCaseName = propertyName.replace(lowerCaseRgx, lowerCaseRgxParam).toLowerCase();
        cache.propertyNames[propertyName] = lowerCaseName;
        return lowerCaseName;
      }
    } else {
      return propertyName;
    }
  }

  function getTransformValue(animatable, propName, clearCache) {
    if (clearCache) {
      for (var key in animatable.transforms) {
        delete animatable.transforms[key];
      }

      var str = animatable.target.style.transform;

      if (str) {
        var t;

        while (t = transformsExecRgx.exec(str)) {
          animatable.transforms[t[1]] = t[2];
        }
      }
    }

    var cachedValue = animatable.transforms[propName];
    return !is.und(cachedValue) ? cachedValue : (propName.includes(validTransforms[7]) ? 1 : 0) + getTransformUnit(propName);
  }

  var activeInstances = [];
  var raf;

  function tick(t) {
    // memo on algorithm issue:
    // dangerous iteration over mutable `activeInstances`
    // (that collection may be updated from within callbacks of `tick`-ed animation instances)
    var activeInstancesLength = activeInstances.length;
    var i = 0;

    while (i < activeInstancesLength) {
      var activeInstance = activeInstances[i];

      if (!activeInstance.paused) {
        activeInstance.tick(t);
        i++;
      } else {
        activeInstances.splice(i, 1);
        activeInstancesLength--;
      }
    }

    raf = i > 0 ? requestAnimationFrame(tick) : undefined;
  }

  function startEngine() {
    if (!raf && (!isDocumentHidden() || !settings.suspendWhenDocumentHidden) && activeInstances.length > 0) {
      raf = requestAnimationFrame(tick);
    }
  }

  function handleVisibilityChange() {

    if (isDocumentHidden()) {
      // suspend ticks
      raf = cancelAnimationFrame(raf);
    } else {
      // is back to active tab
      // first adjust animations to consider the time that ticks were suspended
      activeInstances.forEach(function (instance) {
        return instance._onDocumentVisibility();
      });
      startEngine();
    }
  }

  if (isBrowser) {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  var animatablesMap = new Map();

  function registerAnimatable(target, i, total) {
    var registeredAnimatable = animatablesMap.get(target);

    if (!registeredAnimatable) {
      registeredAnimatable = {
        target: target,
        id: i,
        total: total
      };

      if (is.dom(target)) {
        registeredAnimatable.isDOM = true;
        registeredAnimatable.transforms = {};
      }

      if (is.svg(target)) registeredAnimatable.isSVG = true;
      animatablesMap.set(target, registeredAnimatable);
    }

    return registeredAnimatable;
  }

  function parseTargets(targets) {
    var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
    return filterArray(targetsArray, function (item, pos, self) {
      return self.indexOf(item) === pos;
    });
  }

  function getAnimatables(targets) {
    var parsed = parseTargets(targets);
    var total = parsed.length;
    return parsed.map(function (target, i) {
      return registerAnimatable(target, i, total);
    });
  } // Remove targets from animation

  function removeAnimationsWithTargets(targetsArray, animations) {
    for (var i = animations.length; i--;) {
      if (arrayContains(targetsArray, animations[i].animatable.target)) {
        animations.splice(i, 1);
      }
    }
  }

  function removeAnimationsWithTargetsFromIntance(targetsArray, instance) {
    var animations = instance.animations;
    var children = instance.children;

    for (var i = children.length; i--;) {
      var child = children[i];
      var childAnimations = child.animations;
      removeAnimationsWithTargets(targetsArray, childAnimations);
      if (!childAnimations.length && !child.children.length) children.splice(i, 1);
    } // Return early to prevent instances created without targets (and without animations) to be paused


    if (!animations.length) return;
    removeAnimationsWithTargets(targetsArray, animations);
    if (!animations.length && !children.length) instance.pause();
  }

  function removeAnimatablesFromInstance(targets, instance) {
    var targetsArray = parseTargets(targets);
    removeAnimationsWithTargetsFromIntance(targetsArray, instance);
  }
  function removeAnimatablesFromActiveInstances(targets) {
    var targetsArray = parseTargets(targets);

    for (var i = activeInstances.length; i--;) {
      var instance = activeInstances[i];
      removeAnimationsWithTargetsFromIntance(targetsArray, instance);
    }
  }

  // adapted from https://gist.github.com/SebLambla/3e0550c496c236709744

  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCircleLength(el) {
    return pi * 2 * el.getAttribute('r');
  }

  function getRectLength(el) {
    return el.getAttribute('width') * 2 + el.getAttribute('height') * 2;
  }

  function getLineLength(el) {
    return getDistance({
      x: el.getAttribute('x1'),
      y: el.getAttribute('y1')
    }, {
      x: el.getAttribute('x2'),
      y: el.getAttribute('y2')
    });
  }

  function getPolylineLength(el) {
    var points = el.points;
    if (is.und(points)) return;
    var totalLength = 0;
    var previousPos;

    for (var i = 0; i < points.numberOfItems; i++) {
      var currentPos = points.getItem(i);
      if (i > 0) totalLength += getDistance(previousPos, currentPos);
      previousPos = currentPos;
    }

    return totalLength;
  }

  function getPolygonLength(el) {
    var points = el.points;
    if (is.und(points)) return;
    return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
  }

  function getTotalLength(el) {
    if (el.getTotalLength) return el.getTotalLength();

    switch (el.tagName.toLowerCase()) {
      case 'circle':
        return getCircleLength(el);

      case 'rect':
        return getRectLength(el);

      case 'line':
        return getLineLength(el);

      case 'polyline':
        return getPolylineLength(el);

      case 'polygon':
        return getPolygonLength(el);
    }
  }

  function setDashoffset(el) {
    var pathLength = getTotalLength(el);
    el.setAttribute('stroke-dasharray', pathLength);
    return pathLength;
  }

  function getParentSvgEl(el) {
    var parentEl = el.parentNode;

    while (is.svg(parentEl)) {
      var parentNode = parentEl.parentNode;
      if (!is.svg(parentNode)) break;
      parentEl = parentNode;
    }

    return parentEl;
  } // SVG Responsive utils


  function getPathParentSvg(pathEl, svgData) {
    var svg = svgData || {};
    var parentSvgEl = svg.el || getParentSvgEl(pathEl);
    var rect = parentSvgEl.getBoundingClientRect();
    var viewBoxAttr = parentSvgEl.getAttribute('viewBox');
    var width = rect.width;
    var height = rect.height;
    var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
    return {
      el: parentSvgEl,
      viewBox: viewBox,
      x: viewBox[0] / 1,
      y: viewBox[1] / 1,
      w: width,
      h: height,
      vW: viewBox[2],
      vH: viewBox[3]
    };
  } // Path animation


  function getPath(path, percent) {
    var pathEl = is.str(path) ? selectString(path)[0] : path;
    var p = percent || 100;
    return function (property) {
      return {
        isPath: true,
        isTargetInsideSVG: false,
        property: property,
        el: pathEl,
        svg: getPathParentSvg(pathEl),
        totalLength: +getTotalLength(pathEl) * (p / 100)
      };
    };
  }

  function getPathPoint(pathEl, progress) {
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var length = progress + offset >= 1 ? progress + offset : 0;
    return pathEl.getPointAtLength(length);
  }

  function getPathProgress(pathObject, progress) {
    var pathEl = pathObject.el;
    var isPathTargetInsideSVG = pathObject.isTargetInsideSVG;
    var parentSvg = getPathParentSvg(pathEl, pathObject.svg);
    var p = getPathPoint(pathEl, progress, 0);
    var p0 = getPathPoint(pathEl, progress, -1);
    var p1 = getPathPoint(pathEl, progress, +1);
    var scaleX = isPathTargetInsideSVG ? 1 : parentSvg.w / parentSvg.vW;
    var scaleY = isPathTargetInsideSVG ? 1 : parentSvg.h / parentSvg.vH;

    switch (pathObject.property) {
      case 'x':
        return (p.x - parentSvg.x) * scaleX;

      case 'y':
        return (p.y - parentSvg.y) * scaleY;

      case 'angle':
        return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / pi;
    }
  }

  function isValidSvgAttribute(el, propertyName) {
    if (propertyName === 'opacity') return; // Return false and to use CSS opacity animation instead (already better default values (opacity: 1 instead of 0))

    if (propertyName in el.style || propertyName in el) {
      if (propertyName === 'scale') {
        var elParentNode = el.parentNode;
        return elParentNode && elParentNode.tagName === 'filter'; // Only consider scale as a valid SVG attribute on filter element
      }

      return true;
    }
  }

  function rgbToRgba(rgbValue) {
    var rgba = rgbExecRgx.exec(rgbValue) || rgbaExecRgx.exec(rgbValue);
    var r = +rgba[1];
    var g = +rgba[2];
    var b = +rgba[3];
    var a = +(rgba[4] || 1);
    return [r, g, b, a];
  } // HEX3 / HEX3A / HEX6 / HEX6A Color value string -> RGBA values array


  function hexToRgba(hexValue) {
    var hexLength = hexValue.length;
    var isShort = hexLength === 4 || hexLength === 5;
    var isAlpha = hexLength === 5 || hexLength === 9;
    var r = +(hexValuePrefix + hexValue[1] + hexValue[isShort ? 1 : 2]);
    var g = +(hexValuePrefix + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]);
    var b = +(hexValuePrefix + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]);
    var a = isAlpha ? +((hexValuePrefix + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1;
    return [r, g, b, a];
  } // HSL / HSLA Color value string -> RGBA values array


  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  function hslToRgba(hslValue) {
    var hsla = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
    var h = hsla[1] / 360;
    var s = hsla[2] / 100;
    var l = hsla[3] / 100;
    var a = +(hsla[4] || 1);
    var r, g, b;

    if (s == 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = round(hue2rgb(p, q, h + 1 / 3) * 255, 1);
      g = round(hue2rgb(p, q, h) * 255, 1);
      b = round(hue2rgb(p, q, h - 1 / 3) * 255, 1);
    }

    return [r, g, b, a];
  } // All in one color converter to convert color strings to RGBA array values


  function convertColorStringValuesToRgbaArray(colorValue) {
    if (is.rgb(colorValue)) return rgbToRgba(colorValue);
    if (is.hex(colorValue)) return hexToRgba(colorValue);
    if (is.hsl(colorValue)) return hslToRgba(colorValue);
  }

  function getFunctionValue(functionValue, animatable) {
    if (!is.fnc(functionValue)) return functionValue;
    return functionValue(animatable.target, animatable.id, animatable.total) || 0; // Fallback to 0 if the function results in undefined / NaN / null
  }
  function getAnimationType(animatable, prop) {
    if (!animatable.isDOM) {
      return animationTypes.OBJECT;
    } else {
      var _el = animatable.target;
      if (!is.nil(_el.getAttribute(prop)) || animatable.isSVG && isValidSvgAttribute(_el, prop)) return animationTypes.ATTRIBUTE; // Handle DOM and SVG attributes

      if (arrayContains(validTransforms, prop)) return animationTypes.TRANSFORM; // Handle CSS Transform properties differently than CSS to allow individual animations

      if (prop in _el.style) return animationTypes.CSS; // All other CSS properties

      if (!is.und(_el[prop])) return animationTypes.OBJECT; // Handle DOM elements properies that can't be accessed using getAttribute()

      return console.warn("Can't find property '".concat(prop, "' on target '").concat(_el, "'."));
    }
  }
  function getOriginalAnimatableValue(animatable, propName, animationType) {
    var target = animatable.target;
    var animType = is.num(animationType) ? animationType : getAnimationType(animatable, propName);

    switch (animType) {
      case animationTypes.OBJECT:
        return target[propName] || 0;
      // Fallaback to 0 if the property doesn't exist on the object.

      case animationTypes.ATTRIBUTE:
        return target.getAttribute(propName);

      case animationTypes.TRANSFORM:
        return getTransformValue(animatable, propName, true);

      case animationTypes.CSS:
        return target.style[propName] || getComputedStyle(target).getPropertyValue(propName);
    }
  }
  function getRelativeValue(x, y, operator) {
    switch (operator) {
      case '+':
        return x + y;

      case '-':
        return x - y;

      case '*':
        return x * y;
    }
  }
  function decomposeValue(rawValue) {
    var val = rawValue;
    var value = {
      type: valueTypes.NUMBER
    };
    var numberedVal = +val;

    if (!isNaN(numberedVal)) {
      value.number = numberedVal;
      return value;
    } else if (rawValue.isPath) {
      value.type = valueTypes.PATH;
      value.path = rawValue;
      value.number = value.path.totalLength;
      value.unit = emptyString;
      return value;
    } else {
      var operatorMatch = relativeValuesExecRgx.exec(val);

      if (operatorMatch) {
        val = val.slice(2);
        value.operator = operatorMatch[0][0];
      }

      var unitMatch = unitsExecRgx.exec(val);

      if (unitMatch) {
        value.type = valueTypes.UNIT;
        value.number = +unitMatch[1];
        value.unit = unitMatch[2];
        return value;
      } else if (value.operator) {
        value.number = +val;
        return value;
      } else if (is.col(val)) {
        value.type = valueTypes.COLOR;
        value.numbers = convertColorStringValuesToRgbaArray(val);
        return value;
      } else {
        var stringifiedVal = val + emptyString;
        var matchedNumbers = stringifiedVal.match(digitWithExponentRgx);
        value.type = valueTypes.COMPLEX;
        value.numbers = matchedNumbers ? matchedNumbers.map(Number) : [0];
        value.strings = stringifiedVal.split(digitWithExponentRgx) || [];
        return value;
      }
    }
  }

  function getNumberProgress(fromNumber, toNumber, progressValue, roundValue) {
    var value = fromNumber + progressValue * (toNumber - fromNumber);
    if (roundValue) return round(value, roundValue);
    return value;
  }

  function recomposeNumberValue(tween) {
    return getNumberProgress(tween.from.number, tween.to.number, tween.progress, tween.round);
  }

  function recomposeUnitValue(tween) {
    return getNumberProgress(tween.from.number, tween.to.number, tween.progress, tween.round) + tween.to.unit;
  }

  function recomposeColorValue(tween) {
    var fn = tween.from.numbers;
    var tn = tween.to.numbers;
    var value = rgbaString;
    value += getNumberProgress(fn[0], tn[0], tween.progress, 1) + commaString;
    value += getNumberProgress(fn[1], tn[1], tween.progress, 1) + commaString;
    value += getNumberProgress(fn[2], tn[2], tween.progress, 1) + commaString;
    value += getNumberProgress(fn[3], tn[3], tween.progress) + closeParenthesisString;
    return value;
  }

  function recomposePathValue(tween) {
    var value = getPathProgress(tween.to.path, tween.progress * tween.to.number) + tween.to.unit;
    if (tween.round) return round(value, tween.round);
    return value;
  }

  function recomposeComplexValue(tween) {
    var value = tween.to.strings[0];

    for (var i = 0, l = tween.to.numbers.length; i < l; i++) {
      var number = getNumberProgress(tween.from.numbers[i], tween.to.numbers[i], tween.progress, tween.round);
      var nextString = tween.to.strings[i + 1];

      if (!nextString) {
        value += number;
      } else {
        value += number + nextString;
      }
    }

    return value;
  }

  var recomposeValueFunctions = [recomposeNumberValue, recomposeUnitValue, recomposeColorValue, recomposePathValue, recomposeComplexValue];

  function setObjectAnimationValue(t, p, v) {
    return t[p] = v;
  }

  function setAttributeAnimationValue(t, p, v) {
    return t.setAttribute(p, v);
  }

  function setCssAnimationValue(t, p, v) {
    return t.style[p] = v;
  }

  function setTransformsAnimationValue(t, p, v, transforms, needsRender) {
    transforms[p] = v;

    if (needsRender) {
      var string = emptyString;

      for (var prop in transforms) {
        string += "".concat(prop).concat(openParenthesisString).concat(transforms[prop]).concat(closeParenthesisString);
      }

      return t.style.transform = string;
    }
  }

  var setAnimationValueFunctions = [setObjectAnimationValue, setAttributeAnimationValue, setCssAnimationValue, setTransformsAnimationValue];
  function getTargetValue(target, propName, unit) {
    var animatables = getAnimatables(target);

    if (animatables) {
      var animatable = animatables[0];
      var value = getOriginalAnimatableValue(animatable, propName);

      if (unit) {
        var decomposedValue = decomposeValue(value);

        if (decomposedValue.type === valueTypes.NUMBER || decomposedValue.type === valueTypes.UNIT) {
          var convertedValue = convertValueUnit(animatable.target, decomposedValue, unit);
          value = convertedValue.number + convertedValue.unit;
        }
      }

      return value;
    }
  }

  function convertKeyframeToTween(keyframe, animatable) {
    var tween = {};

    for (var p in keyframe) {
      var prop = getFunctionValue(keyframe[p], animatable);

      if (is.arr(prop)) {
        prop = prop.map(function (v) {
          return getFunctionValue(v, animatable);
        });

        if (prop.length === 1) {
          prop = prop[0];
        }
      }

      tween[p] = prop;
    } // Make sure duration is not equal to 0 to prevents NaN when (progress = 0 / duration = 0);


    tween.duration = parseFloat(tween.duration) || minValue;
    tween.delay = parseFloat(tween.delay);
    return tween;
  }

  function convertKeyframesToTweens(keyframes, animatable, propertyName, animationType) {
    var prevTween;
    var tweens = [];

    var _loop = function _loop(i, l) {
      var keyframe = keyframes[i];
      var tween = convertKeyframeToTween(keyframe, animatable);
      var tweenValue = tween.value;
      var originalValue = decomposeValue(getOriginalAnimatableValue(animatable, propertyName, animationType));
      var from = void 0,
          to = void 0; // Decompose values

      if (is.arr(tweenValue)) {
        from = decomposeValue(tweenValue[0]);
        to = decomposeValue(tweenValue[1]);

        if (from.type === valueTypes.NUMBER) {
          if (prevTween) {
            if (prevTween.to.type === valueTypes.UNIT) {
              from.type = valueTypes.UNIT;
              from.unit = prevTween.to.unit;
            }
          } else {
            if (originalValue.type === valueTypes.UNIT) {
              from.type = valueTypes.UNIT;
              from.unit = originalValue.unit;
            }
          }
        }
      } else {
        if (!is.und(tweenValue)) {
          to = decomposeValue(tweenValue);
        } else if (prevTween) {
          to = _objectSpread2({}, prevTween.to);
        }

        if (prevTween) {
          from = _objectSpread2({}, prevTween.to);
        } else {
          from = _objectSpread2({}, originalValue);

          if (is.und(to)) {
            to = _objectSpread2({}, originalValue);
          }
        }
      } // Apply operators


      if (from.operator) {
        from.number = getRelativeValue(!prevTween ? originalValue.number : prevTween.to.number, from.number, from.operator);
      }

      if (to.operator) {
        to.number = getRelativeValue(from.number, to.number, to.operator);
      } // Values omogenisation in cases of type difference between "from" and "to"


      if (from.type !== to.type) {
        if (from.type === valueTypes.COMPLEX || to.type === valueTypes.COMPLEX) {
          var complexValue = from.type === valueTypes.COMPLEX ? from : to;
          var notComplexValue = from.type === valueTypes.COMPLEX ? to : from;
          notComplexValue.type = valueTypes.COMPLEX;
          notComplexValue.strings = complexValue.strings;
          notComplexValue.numbers = [notComplexValue.number];
        } else if (from.type === valueTypes.UNIT && to.type === valueTypes.PATH) {
          to.unit = from.unit;
        } else if (from.type === valueTypes.UNIT || to.type === valueTypes.UNIT) {
          var unitValue = from.type === valueTypes.UNIT ? from : to;
          var notUnitValue = from.type === valueTypes.UNIT ? to : from;
          notUnitValue.type = valueTypes.UNIT;
          notUnitValue.unit = unitValue.unit;
        } else if (from.type === valueTypes.COLOR || to.type === valueTypes.COLOR) {
          var colorValue = from.type === valueTypes.COLOR ? from : to;
          var notColorValue = from.type === valueTypes.COLOR ? to : from;
          notColorValue.type = valueTypes.COLOR;
          notColorValue.strings = colorValue.strings;
          notColorValue.numbers = [0, 0, 0, 0];
        }
      }

      if (from.unit !== to.unit) {
        var valueToConvert = to.unit ? from : to;
        var unitToConvertTo = to.unit ? to.unit : from.unit;
        convertValueUnit(animatable.target, valueToConvert, unitToConvertTo);
      } // Default to 0 for values 


      if (to.numbers && from.numbers && to.numbers.length !== from.numbers.length) {
        to.numbers.forEach(function (number, i) {
          return from.numbers[i] = 0;
        });
        to.strings.forEach(function (string, i) {
          return from.strings[i] = string;
        });
      }

      if (to.type === valueTypes.PATH) {
        to.path.isTargetInsideSVG = is.svg(animatable.target);
      }

      tween.from = from;
      tween.to = to;
      tween.type = to.type;
      tween.start = prevTween ? prevTween.end : 0;
      tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
      tween.easing = parseEasings(tween.easing, tween.duration);
      tween.progress = 0;
      tween.value = null;
      prevTween = tween;
      tweens.push(tween);
    };

    for (var i = 0, l = keyframes.length; i < l; i++) {
      _loop(i);
    }

    return tweens;
  }

  function getAnimations(animatables, keyframes) {
    var animations = [];
    var animationsIndex = 0;

    for (var a = 0, aLength = animatables.length; a < aLength; a++) {
      var animatable = animatables[a];

      if (animatable) {
        var lastAnimatableTransformAnimationIndex = void 0;

        for (var p = 0, pLength = keyframes.length; p < pLength; p++) {
          var animationKeyframes = keyframes[p];
          var animationKeyframesPropertyName = animationKeyframes[0].propertyName;
          var animationType = getAnimationType(animatable, animationKeyframesPropertyName);
          var propertyName = sanitizePropertyName(animationKeyframesPropertyName, animatable.target, animationType);

          if (is.num(animationType)) {
            var tweens = convertKeyframesToTweens(animationKeyframes, animatable, propertyName, animationType);
            var firstTween = tweens[0];
            var lastTween = tweens[tweens.length - 1];
            var animation = {
              type: animationType,
              property: propertyName,
              animatable: animatable,
              tweens: tweens,
              delay: firstTween.delay,
              duration: lastTween.end,
              endDelay: lastTween.endDelay,
              timelineOffset: 0
            };

            if (animationType === animationTypes.TRANSFORM) {
              lastAnimatableTransformAnimationIndex = animationsIndex;
            }

            animations.push(animation);
            animationsIndex++;
          }
        }

        if (!is.und(lastAnimatableTransformAnimationIndex)) {
          animations[lastAnimatableTransformAnimationIndex].renderTransforms = true;
        }
      }
    }

    return animations;
  } // function createAnimation(animatable, keyframes) {
  //   const keyframesPropertyName = keyframes[0].propertyName;
  //   const animationType = getAnimationType(animatable, keyframesPropertyName);
  //   const propertyName = sanitizePropertyName(keyframesPropertyName, animatable.target, animationType);
  //   if (is.num(animationType)) {
  //     const tweens = convertKeyframesToTweens(keyframes, animatable, propertyName, animationType);
  //     const firstTween = tweens[0];
  //     const lastTween = tweens[tweens.length - 1];
  //     return {
  //       type: animationType,
  //       property: propertyName,
  //       animatable: animatable,
  //       tweens: tweens,
  //       delay: firstTween.delay,
  //       duration: lastTween.end,
  //       endDelay: lastTween.endDelay,
  //       timelineOffset: 0
  //     }
  //   }
  // }
  // export function getAnimations(animatables, animationsKeyframes) {
  //   const animations = [];
  //   for (let a = 0, aLength = animatables.length; a < aLength; a++) {
  //     const animatable = animatables[a];
  //     if (animatable) {
  //       for (let p = 0, pLength = animationsKeyframes.length; p < pLength; p++) {
  //         const animation = createAnimation(animatable, animationsKeyframes[p]);
  //         if (animation) {
  //           animations.push(animation);
  //         }
  //       }
  //     }
  //   }
  //   return animations;
  // }

  function getTimingsFromAnimations(animations, tweenSettings) {
    var animationsLength = animations.length;

    if (!animationsLength) {
      return tweenSettings;
    } else {
      var timings = {};

      for (var i = 0; i < animationsLength; i++) {
        var anim = animations[i];
        var delay = anim.timelineOffset + anim.delay;

        if (is.und(timings.delay) || delay < timings.delay) {
          timings.delay = delay;
        }

        var duration = anim.timelineOffset + anim.duration;

        if (is.und(timings.duration) || duration > timings.duration) {
          timings.duration = duration;
        }

        var endDelay = anim.timelineOffset + anim.duration - anim.endDelay;

        if (is.und(timings.endDelay) || endDelay > timings.endDelay) {
          timings.endDelay = endDelay;
        }
      }

      timings.endDelay = timings.duration - timings.endDelay;
      return timings;
    }
  }

  function convertPropertyValueToTweens(propertyName, propertyValue, tweenSettings) {
    var value = propertyValue;

    var settings = _objectSpread2({}, tweenSettings);

    settings.propertyName = propertyName; // Override duration if easing is a spring

    if (springTestRgx.test(settings.easing)) {
      settings.duration = spring(settings.easing);
    }

    if (is.arr(value)) {
      var l = value.length;
      var isFromTo = l === 2 && !is.obj(value[0]);

      if (!isFromTo) {
        // In case of a keyframes array, duration is divided by the number of tweens
        if (!is.fnc(tweenSettings.duration)) {
          settings.duration = tweenSettings.duration / l;
        }
      } else {
        // Transform [from, to] values shorthand to a valid tween value
        value = {
          value: value
        };
      }
    }

    var valuesArray = is.arr(value) ? value : [value];
    return valuesArray.map(function (v, i) {
      var obj = is.obj(v) && !v.isPath ? v : {
        value: v
      }; // Default delay value should only be applied to the first tween

      if (is.und(obj.delay)) {
        obj.delay = !i ? tweenSettings.delay : 0;
      } // Default endDelay value should only be applied to the last tween


      if (is.und(obj.endDelay)) {
        obj.endDelay = i === valuesArray.length - 1 ? tweenSettings.endDelay : 0;
      }

      return obj;
    }).map(function (k) {
      return mergeObjects(k, settings);
    });
  }

  function flattenParamsKeyframes(keyframes) {
    var properties = {};
    var propertyNames = filterArray(flattenArray(keyframes.map(function (key) {
      return Object.keys(key);
    })), function (p) {
      return is.key(p);
    }).reduce(function (a, b) {
      if (a.indexOf(b) < 0) {
        a.push(b);
      }

      return a;
    }, []);

    var _loop = function _loop(i) {
      var propName = propertyNames[i];
      properties[propName] = keyframes.map(function (key) {
        var newKey = {};

        for (var p in key) {
          if (is.key(p)) {
            if (p == propName) {
              newKey.value = key[p];
            }
          } else {
            newKey[p] = key[p];
          }
        }

        return newKey;
      });
    };

    for (var i = 0; i < propertyNames.length; i++) {
      _loop(i);
    }

    return properties;
  }

  function getKeyframesFromProperties(tweenSettings, params) {
    var keyframes = [];
    var paramsKeyframes = params.keyframes;

    if (paramsKeyframes) {
      params = mergeObjects(flattenParamsKeyframes(paramsKeyframes), params);
    }

    for (var p in params) {
      if (is.key(p)) {
        keyframes.push(convertPropertyValueToTweens(p, params[p], tweenSettings));
      }
    }

    return keyframes;
  }

  var instancesId = 0;
  function createInstance(params) {
    var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
    var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
    var properties = getKeyframesFromProperties(tweenSettings, params);
    var animatables = getAnimatables(params.targets);
    var animations = getAnimations(animatables, properties);
    var timings = getTimingsFromAnimations(animations, tweenSettings);
    return mergeObjects(instanceSettings, {
      id: instancesId++,
      children: [],
      animatables: animatables,
      animations: animations,
      delay: timings.delay,
      duration: timings.duration,
      endDelay: timings.endDelay
    });
  }
  function animate() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var startTime = 0,
        lastTime = 0,
        now = 0;
    var children,
        childrenLength = 0;
    var resolve = null;

    function makePromise(instance) {
      var promise = window.Promise && new Promise(function (_resolve) {
        return resolve = _resolve;
      });
      instance.finished = promise;
      return promise;
    }

    var instance = createInstance(params);
    makePromise(instance);

    function toggleInstanceDirection() {
      var direction = instance.direction;

      if (direction !== 'alternate') {
        instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
      }

      instance.reversed = !instance.reversed;
      children.forEach(function (child) {
        return child.reversed = instance.reversed;
      });
    }

    function adjustTime(time) {
      return instance.reversed ? instance.duration - time : time;
    }

    function resetTime() {
      startTime = 0;
      lastTime = adjustTime(instance.currentTime) * (1 / settings.speed);
    }

    function seekChild(time, child, muteCallbacks) {
      if (child) {
        if (!muteCallbacks) {
          child.seek(time - child.timelineOffset);
        } else {
          child.seekSilently(time - child.timelineOffset);
        }
      }
    }

    function syncInstanceChildren(time, muteCallbacks) {
      if (!instance.reversePlayback) {
        for (var i = 0; i < childrenLength; i++) {
          seekChild(time, children[i], muteCallbacks);
        }
      } else {
        for (var j = childrenLength; j--;) {
          seekChild(time, children[j], muteCallbacks);
        }
      }
    }

    function setAnimationsProgress(insTime) {
      var i = 0;
      var animations = instance.animations;
      var animationsLength = animations.length;

      while (i < animationsLength) {
        var animation = animations[i];
        var animatable = animation.animatable;
        var tweens = animation.tweens;
        var tweensLength = tweens.length - 1;
        var tween = tweens[tweensLength]; // Only check for keyframes if there is more than one tween

        if (tweensLength) tween = filterArray(tweens, function (t) {
          return insTime < t.end;
        })[0] || tween;
        tween.progress = tween.easing(clamp(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration);
        tween.value = recomposeValueFunctions[tween.type](tween);
        setAnimationValueFunctions[animation.type](animatable.target, animation.property, tween.value, animatable.transforms, animation.renderTransforms);
        animation.currentValue = tween.value;
        i++;
      }
    }

    function countIteration() {
      if (instance.remainingLoops && instance.remainingLoops !== true) {
        instance.remainingLoops--;
      }
    }

    function setInstanceProgress(engineTime) {
      var insDuration = instance.duration;
      var insDelay = instance.delay;
      var insEndDelay = insDuration - instance.endDelay;
      var insTime = adjustTime(engineTime);
      instance.progress = clamp(insTime / insDuration, 0, 1);
      instance.reversePlayback = insTime < instance.currentTime;

      if (children) {
        syncInstanceChildren(insTime);
      }

      if (!instance.began && instance.currentTime > 0) {
        instance.began = true;
        instance.begin(instance);
      }

      if (!instance.loopBegan && instance.currentTime > 0) {
        instance.loopBegan = true;
        instance.loopBegin(instance);
      }

      if (insTime <= insDelay && instance.currentTime !== 0) {
        setAnimationsProgress(0);
      }

      if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
        setAnimationsProgress(insDuration);
      }

      if (insTime > insDelay && insTime < insEndDelay) {
        if (!instance.changeBegan) {
          instance.changeBegan = true;
          instance.changeCompleted = false;
          instance.changeBegin(instance);
        }

        instance.change(instance);
        setAnimationsProgress(insTime);
      } else {
        if (instance.changeBegan) {
          instance.changeCompleted = true;
          instance.changeBegan = false;
          instance.changeComplete(instance);
        }
      }

      instance.currentTime = clamp(insTime, 0, insDuration);
      if (instance.began) instance.update(instance);

      if (engineTime >= insDuration) {
        lastTime = 0;
        countIteration();

        if (!instance.remainingLoops) {
          instance.paused = true;

          if (!instance.completed) {
            instance.completed = true;
            instance.loopComplete(instance);
            instance.complete(instance);
            resolve();
            makePromise(instance);
          }
        } else {
          startTime = now;
          instance.loopComplete(instance);
          instance.loopBegan = false;

          if (instance.direction === 'alternate') {
            toggleInstanceDirection();
          }
        }
      }
    }

    instance.reset = function () {
      var direction = instance.direction;
      instance.currentTime = 0;
      instance.progress = 0;
      instance.paused = true;
      instance.began = false;
      instance.loopBegan = false;
      instance.changeBegan = false;
      instance.completed = false;
      instance.changeCompleted = false;
      instance.reversePlayback = false;
      instance.reversed = direction === 'reverse';
      instance.remainingLoops = instance.loop;
      children = instance.children;
      childrenLength = children.length;

      for (var i = childrenLength; i--;) {
        instance.children[i].reset();
      }

      if (instance.reversed && instance.loop !== true || direction === 'alternate' && instance.loop === 1) instance.remainingLoops++;
      setAnimationsProgress(instance.reversed ? instance.duration : 0);
    }; // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)


    instance._onDocumentVisibility = resetTime;

    instance.tick = function (t) {
      now = t;
      if (!startTime) startTime = now;
      setInstanceProgress((now + (lastTime - startTime)) * settings.speed);
    };

    instance.seek = function (time) {
      setInstanceProgress(adjustTime(time));
    };

    instance.seekSilently = function (time) {
      // const insTime = adjustTime(time);
      if (children) {
        syncInstanceChildren(time, true);
      }

      setAnimationsProgress(time);
    };

    instance.pause = function () {
      instance.paused = true;
      resetTime();
    };

    instance.play = function () {
      if (!instance.paused) return;
      if (instance.completed) instance.reset();
      instance.paused = false;
      activeInstances.push(instance);
      resetTime();
      startEngine();
    };

    instance.reverse = function () {
      toggleInstanceDirection();
      instance.completed = instance.reversed ? false : true;
      resetTime();
    };

    instance.restart = function () {
      instance.reset();
      instance.play();
    };

    instance.remove = function (targets) {
      removeAnimatablesFromInstance(targets, instance);
    };

    instance.reset();

    if (instance.autoplay) {
      if (instance.duration === minValue) {
        instance.seek(minValue);
      } else {
        instance.play();
      }
    }

    return instance;
  }

  function parseTimelineOffset(timelineOffset, timelineDuration) {
    if (is.und(timelineOffset)) return timelineDuration;
    if (is.num(timelineOffset)) return timelineOffset;
    var operatorMatch = relativeValuesExecRgx.exec(timelineOffset);

    if (operatorMatch) {
      var parsedOffset = +timelineOffset.slice(2);
      var operator = operatorMatch[0][0];
      return getRelativeValue(timelineDuration, parsedOffset, operator); // NEEDS FIX
    }
  }

  function createTimeline() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var tl = animate(params);
    tl.duration = 0;

    tl.add = function (instanceParams, timelineOffset) {
      var tlIndex = activeInstances.indexOf(tl);
      var children = tl.children;
      if (tlIndex > -1) activeInstances.splice(tlIndex, 1);
      var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
      insParams.targets = insParams.targets || params.targets;
      var tlDuration = tl.duration;
      insParams.autoplay = false;
      insParams.direction = tl.direction;
      insParams.timelineOffset = parseTimelineOffset(timelineOffset, tlDuration);
      tl.seekSilently(insParams.timelineOffset);
      var ins = animate(insParams);
      ins.duration + insParams.timelineOffset;
      children.push(ins);
      var timings = getTimingsFromAnimations(children, params);
      tl.delay = timings.delay;
      tl.endDelay = timings.endDelay;
      tl.duration = timings.duration;
      tl.seekSilently(0);
      tl.reset();
      if (tl.autoplay) tl.play();
      return tl;
    };

    return tl;
  }

  function stagger(val) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var direction = params.direction || 'normal';
    var easing = params.easing ? parseEasings(params.easing) : null;
    var grid = params.grid;
    var axis = params.axis;
    var fromIndex = params.from || 0;
    var fromFirst = fromIndex === 'first';
    var fromCenter = fromIndex === 'center';
    var fromLast = fromIndex === 'last';
    var isRange = is.arr(val);
    var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
    var val2 = isRange ? parseFloat(val[1]) : 0;
    var unitMatch = unitsExecRgx.exec(isRange ? val[1] : val);
    var unit = unitMatch ? unitMatch[2] : 0;
    var start = params.start || 0 + (isRange ? val1 : 0);
    var values = [];
    var maxValue = 0;
    return function (el, i, t) {
      if (fromFirst) fromIndex = 0;
      if (fromCenter) fromIndex = (t - 1) / 2;
      if (fromLast) fromIndex = t - 1;

      if (!values.length) {
        for (var index = 0; index < t; index++) {
          if (!grid) {
            values.push(Math.abs(fromIndex - index));
          } else {
            var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
            var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
            var toX = index % grid[0];
            var toY = Math.floor(index / grid[0]);
            var distanceX = fromX - toX;
            var distanceY = fromY - toY;
            var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if (axis === 'x') value = -distanceX;
            if (axis === 'y') value = -distanceY;
            values.push(value);
          }

          maxValue = Math.max.apply(Math, _toConsumableArray(values));
        }

        if (easing) values = values.map(function (val) {
          return easing(val / maxValue) * maxValue;
        });
        if (direction === 'reverse') values = values.map(function (val) {
          return axis ? val < 0 ? val * -1 : -val : Math.abs(maxValue - val);
        });
      }

      var spacing = isRange ? (val2 - val1) / maxValue : val1;
      return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
    };
  }

  var anime = animate;
  anime.version = '3.3.0';
  anime.speed = 1;
  anime.suspendWhenDocumentHidden = true;
  anime.running = activeInstances;
  anime.remove = removeAnimatablesFromActiveInstances;
  anime.get = getTargetValue;

  anime.set = function (targets) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    props.targets = targets;
    props.duration = 0;
    return animate(props);
  };

  anime.convertPx = convertValueUnit;
  anime.path = getPath;
  anime.setDashoffset = setDashoffset;
  anime.stagger = stagger;
  anime.timeline = createTimeline;
  anime.easing = parseEasings;
  anime.penner = penner;
  anime.clamp = clamp;
  anime.random = random;

  return anime;

})();