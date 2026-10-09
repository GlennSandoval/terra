(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.terra = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				var isInstance = false;
	      try {
	        isInstance = this instanceof a;
	      } catch (e) {}
				if (isInstance) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var alea$1 = {exports: {}};

	var alea = alea$1.exports;

	var hasRequiredAlea;

	function requireAlea () {
		if (hasRequiredAlea) return alea$1.exports;
		hasRequiredAlea = 1;
		(function (module) {
			// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
			// http://baagoe.com/en/RandomMusings/javascript/
			// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
			// Original work is under MIT license -

			// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
			//
			// Permission is hereby granted, free of charge, to any person obtaining a copy
			// of this software and associated documentation files (the "Software"), to deal
			// in the Software without restriction, including without limitation the rights
			// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
			// copies of the Software, and to permit persons to whom the Software is
			// furnished to do so, subject to the following conditions:
			//
			// The above copyright notice and this permission notice shall be included in
			// all copies or substantial portions of the Software.
			//
			// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
			// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
			// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
			// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
			// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
			// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
			// THE SOFTWARE.



			(function(global, module, define) {

			function Alea(seed) {
			  var me = this, mash = Mash();

			  me.next = function() {
			    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
			    me.s0 = me.s1;
			    me.s1 = me.s2;
			    return me.s2 = t - (me.c = t | 0);
			  };

			  // Apply the seeding algorithm from Baagoe.
			  me.c = 1;
			  me.s0 = mash(' ');
			  me.s1 = mash(' ');
			  me.s2 = mash(' ');
			  me.s0 -= mash(seed);
			  if (me.s0 < 0) { me.s0 += 1; }
			  me.s1 -= mash(seed);
			  if (me.s1 < 0) { me.s1 += 1; }
			  me.s2 -= mash(seed);
			  if (me.s2 < 0) { me.s2 += 1; }
			  mash = null;
			}

			function copy(f, t) {
			  t.c = f.c;
			  t.s0 = f.s0;
			  t.s1 = f.s1;
			  t.s2 = f.s2;
			  return t;
			}

			function impl(seed, opts) {
			  var xg = new Alea(seed),
			      state = opts && opts.state,
			      prng = xg.next;
			  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; };
			  prng.double = function() {
			    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
			  };
			  prng.quick = prng;
			  if (state) {
			    if (typeof(state) == 'object') copy(state, xg);
			    prng.state = function() { return copy(xg, {}); };
			  }
			  return prng;
			}

			function Mash() {
			  var n = 0xefc8249d;

			  var mash = function(data) {
			    data = String(data);
			    for (var i = 0; i < data.length; i++) {
			      n += data.charCodeAt(i);
			      var h = 0.02519603282416938 * n;
			      n = h >>> 0;
			      h -= n;
			      h *= n;
			      n = h >>> 0;
			      h -= n;
			      n += h * 0x100000000; // 2^32
			    }
			    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
			  };

			  return mash;
			}


			if (module && module.exports) {
			  module.exports = impl;
			} else {
			  this.alea = impl;
			}

			})(
			  alea,
			  module); 
		} (alea$1));
		return alea$1.exports;
	}

	var xor128$1 = {exports: {}};

	var xor128 = xor128$1.exports;

	var hasRequiredXor128;

	function requireXor128 () {
		if (hasRequiredXor128) return xor128$1.exports;
		hasRequiredXor128 = 1;
		(function (module) {
			// A Javascript implementaion of the "xor128" prng algorithm by
			// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

			(function(global, module, define) {

			function XorGen(seed) {
			  var me = this, strseed = '';

			  me.x = 0;
			  me.y = 0;
			  me.z = 0;
			  me.w = 0;

			  // Set up generator function.
			  me.next = function() {
			    var t = me.x ^ (me.x << 11);
			    me.x = me.y;
			    me.y = me.z;
			    me.z = me.w;
			    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
			  };

			  if (seed === (seed | 0)) {
			    // Integer seed.
			    me.x = seed;
			  } else {
			    // String seed.
			    strseed += seed;
			  }

			  // Mix in string seed, then discard an initial batch of 64 values.
			  for (var k = 0; k < strseed.length + 64; k++) {
			    me.x ^= strseed.charCodeAt(k) | 0;
			    me.next();
			  }
			}

			function copy(f, t) {
			  t.x = f.x;
			  t.y = f.y;
			  t.z = f.z;
			  t.w = f.w;
			  return t;
			}

			function impl(seed, opts) {
			  var xg = new XorGen(seed),
			      state = opts && opts.state,
			      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
			  prng.double = function() {
			    do {
			      var top = xg.next() >>> 11,
			          bot = (xg.next() >>> 0) / 0x100000000,
			          result = (top + bot) / (1 << 21);
			    } while (result === 0);
			    return result;
			  };
			  prng.int32 = xg.next;
			  prng.quick = prng;
			  if (state) {
			    if (typeof(state) == 'object') copy(state, xg);
			    prng.state = function() { return copy(xg, {}); };
			  }
			  return prng;
			}

			if (module && module.exports) {
			  module.exports = impl;
			} else {
			  this.xor128 = impl;
			}

			})(
			  xor128,
			  module); 
		} (xor128$1));
		return xor128$1.exports;
	}

	var xorwow$1 = {exports: {}};

	var xorwow = xorwow$1.exports;

	var hasRequiredXorwow;

	function requireXorwow () {
		if (hasRequiredXorwow) return xorwow$1.exports;
		hasRequiredXorwow = 1;
		(function (module) {
			// A Javascript implementaion of the "xorwow" prng algorithm by
			// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

			(function(global, module, define) {

			function XorGen(seed) {
			  var me = this, strseed = '';

			  // Set up generator function.
			  me.next = function() {
			    var t = (me.x ^ (me.x >>> 2));
			    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
			    return (me.d = (me.d + 362437 | 0)) +
			       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
			  };

			  me.x = 0;
			  me.y = 0;
			  me.z = 0;
			  me.w = 0;
			  me.v = 0;

			  if (seed === (seed | 0)) {
			    // Integer seed.
			    me.x = seed;
			  } else {
			    // String seed.
			    strseed += seed;
			  }

			  // Mix in string seed, then discard an initial batch of 64 values.
			  for (var k = 0; k < strseed.length + 64; k++) {
			    me.x ^= strseed.charCodeAt(k) | 0;
			    if (k == strseed.length) {
			      me.d = me.x << 10 ^ me.x >>> 4;
			    }
			    me.next();
			  }
			}

			function copy(f, t) {
			  t.x = f.x;
			  t.y = f.y;
			  t.z = f.z;
			  t.w = f.w;
			  t.v = f.v;
			  t.d = f.d;
			  return t;
			}

			function impl(seed, opts) {
			  var xg = new XorGen(seed),
			      state = opts && opts.state,
			      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
			  prng.double = function() {
			    do {
			      var top = xg.next() >>> 11,
			          bot = (xg.next() >>> 0) / 0x100000000,
			          result = (top + bot) / (1 << 21);
			    } while (result === 0);
			    return result;
			  };
			  prng.int32 = xg.next;
			  prng.quick = prng;
			  if (state) {
			    if (typeof(state) == 'object') copy(state, xg);
			    prng.state = function() { return copy(xg, {}); };
			  }
			  return prng;
			}

			if (module && module.exports) {
			  module.exports = impl;
			} else {
			  this.xorwow = impl;
			}

			})(
			  xorwow,
			  module); 
		} (xorwow$1));
		return xorwow$1.exports;
	}

	var xorshift7$1 = {exports: {}};

	var xorshift7 = xorshift7$1.exports;

	var hasRequiredXorshift7;

	function requireXorshift7 () {
		if (hasRequiredXorshift7) return xorshift7$1.exports;
		hasRequiredXorshift7 = 1;
		(function (module) {
			// A Javascript implementaion of the "xorshift7" algorithm by
			// François Panneton and Pierre L'ecuyer:
			// "On the Xorgshift Random Number Generators"
			// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

			(function(global, module, define) {

			function XorGen(seed) {
			  var me = this;

			  // Set up generator function.
			  me.next = function() {
			    // Update xor generator.
			    var X = me.x, i = me.i, t, v;
			    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
			    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
			    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
			    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
			    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
			    X[i] = v;
			    me.i = (i + 1) & 7;
			    return v;
			  };

			  function init(me, seed) {
			    var j, X = [];

			    if (seed === (seed | 0)) {
			      // Seed state array using a 32-bit integer.
			      X[0] = seed;
			    } else {
			      // Seed state using a string.
			      seed = '' + seed;
			      for (j = 0; j < seed.length; ++j) {
			        X[j & 7] = (X[j & 7] << 15) ^
			            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
			      }
			    }
			    // Enforce an array length of 8, not all zeroes.
			    while (X.length < 8) X.push(0);
			    for (j = 0; j < 8 && X[j] === 0; ++j);
			    if (j == 8) X[7] = -1; else X[j];

			    me.x = X;
			    me.i = 0;

			    // Discard an initial 256 values.
			    for (j = 256; j > 0; --j) {
			      me.next();
			    }
			  }

			  init(me, seed);
			}

			function copy(f, t) {
			  t.x = f.x.slice();
			  t.i = f.i;
			  return t;
			}

			function impl(seed, opts) {
			  if (seed == null) seed = +(new Date);
			  var xg = new XorGen(seed),
			      state = opts && opts.state,
			      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
			  prng.double = function() {
			    do {
			      var top = xg.next() >>> 11,
			          bot = (xg.next() >>> 0) / 0x100000000,
			          result = (top + bot) / (1 << 21);
			    } while (result === 0);
			    return result;
			  };
			  prng.int32 = xg.next;
			  prng.quick = prng;
			  if (state) {
			    if (state.x) copy(state, xg);
			    prng.state = function() { return copy(xg, {}); };
			  }
			  return prng;
			}

			if (module && module.exports) {
			  module.exports = impl;
			} else {
			  this.xorshift7 = impl;
			}

			})(
			  xorshift7,
			  module); 
		} (xorshift7$1));
		return xorshift7$1.exports;
	}

	var xor4096$1 = {exports: {}};

	var xor4096 = xor4096$1.exports;

	var hasRequiredXor4096;

	function requireXor4096 () {
		if (hasRequiredXor4096) return xor4096$1.exports;
		hasRequiredXor4096 = 1;
		(function (module) {
			// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
			//
			// This fast non-cryptographic random number generator is designed for
			// use in Monte-Carlo algorithms. It combines a long-period xorshift
			// generator with a Weyl generator, and it passes all common batteries
			// of stasticial tests for randomness while consuming only a few nanoseconds
			// for each prng generated.  For background on the generator, see Brent's
			// paper: "Some long-period random number generators using shifts and xors."
			// http://arxiv.org/pdf/1004.3115v1.pdf
			//
			// Usage:
			//
			// var xor4096 = require('xor4096');
			// random = xor4096(1);                        // Seed with int32 or string.
			// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
			// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
			//
			// For nonzero numeric keys, this impelementation provides a sequence
			// identical to that by Brent's xorgens 3 implementaion in C.  This
			// implementation also provides for initalizing the generator with
			// string seeds, or for saving and restoring the state of the generator.
			//
			// On Chrome, this prng benchmarks about 2.1 times slower than
			// Javascript's built-in Math.random().

			(function(global, module, define) {

			function XorGen(seed) {
			  var me = this;

			  // Set up generator function.
			  me.next = function() {
			    var w = me.w,
			        X = me.X, i = me.i, t, v;
			    // Update Weyl generator.
			    me.w = w = (w + 0x61c88647) | 0;
			    // Update xor generator.
			    v = X[(i + 34) & 127];
			    t = X[i = ((i + 1) & 127)];
			    v ^= v << 13;
			    t ^= t << 17;
			    v ^= v >>> 15;
			    t ^= t >>> 12;
			    // Update Xor generator array state.
			    v = X[i] = v ^ t;
			    me.i = i;
			    // Result is the combination.
			    return (v + (w ^ (w >>> 16))) | 0;
			  };

			  function init(me, seed) {
			    var t, v, i, j, w, X = [], limit = 128;
			    if (seed === (seed | 0)) {
			      // Numeric seeds initialize v, which is used to generates X.
			      v = seed;
			      seed = null;
			    } else {
			      // String seeds are mixed into v and X one character at a time.
			      seed = seed + '\0';
			      v = 0;
			      limit = Math.max(limit, seed.length);
			    }
			    // Initialize circular array and weyl value.
			    for (i = 0, j = -32; j < limit; ++j) {
			      // Put the unicode characters into the array, and shuffle them.
			      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
			      // After 32 shuffles, take v as the starting w value.
			      if (j === 0) w = v;
			      v ^= v << 10;
			      v ^= v >>> 15;
			      v ^= v << 4;
			      v ^= v >>> 13;
			      if (j >= 0) {
			        w = (w + 0x61c88647) | 0;     // Weyl.
			        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
			        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
			      }
			    }
			    // We have detected all zeroes; make the key nonzero.
			    if (i >= 128) {
			      X[(seed && seed.length || 0) & 127] = -1;
			    }
			    // Run the generator 512 times to further mix the state before using it.
			    // Factoring this as a function slows the main generator, so it is just
			    // unrolled here.  The weyl generator is not advanced while warming up.
			    i = 127;
			    for (j = 4 * 128; j > 0; --j) {
			      v = X[(i + 34) & 127];
			      t = X[i = ((i + 1) & 127)];
			      v ^= v << 13;
			      t ^= t << 17;
			      v ^= v >>> 15;
			      t ^= t >>> 12;
			      X[i] = v ^ t;
			    }
			    // Storing state as object members is faster than using closure variables.
			    me.w = w;
			    me.X = X;
			    me.i = i;
			  }

			  init(me, seed);
			}

			function copy(f, t) {
			  t.i = f.i;
			  t.w = f.w;
			  t.X = f.X.slice();
			  return t;
			}
			function impl(seed, opts) {
			  if (seed == null) seed = +(new Date);
			  var xg = new XorGen(seed),
			      state = opts && opts.state,
			      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
			  prng.double = function() {
			    do {
			      var top = xg.next() >>> 11,
			          bot = (xg.next() >>> 0) / 0x100000000,
			          result = (top + bot) / (1 << 21);
			    } while (result === 0);
			    return result;
			  };
			  prng.int32 = xg.next;
			  prng.quick = prng;
			  if (state) {
			    if (state.X) copy(state, xg);
			    prng.state = function() { return copy(xg, {}); };
			  }
			  return prng;
			}

			if (module && module.exports) {
			  module.exports = impl;
			} else {
			  this.xor4096 = impl;
			}

			})(
			  xor4096,                                     // window object or global
			  module); 
		} (xor4096$1));
		return xor4096$1.exports;
	}

	var tychei$1 = {exports: {}};

	var tychei = tychei$1.exports;

	var hasRequiredTychei;

	function requireTychei () {
		if (hasRequiredTychei) return tychei$1.exports;
		hasRequiredTychei = 1;
		(function (module) {
			// A Javascript implementaion of the "Tyche-i" prng algorithm by
			// Samuel Neves and Filipe Araujo.
			// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

			(function(global, module, define) {

			function XorGen(seed) {
			  var me = this, strseed = '';

			  // Set up generator function.
			  me.next = function() {
			    var b = me.b, c = me.c, d = me.d, a = me.a;
			    b = (b << 25) ^ (b >>> 7) ^ c;
			    c = (c - d) | 0;
			    d = (d << 24) ^ (d >>> 8) ^ a;
			    a = (a - b) | 0;
			    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
			    me.c = c = (c - d) | 0;
			    me.d = (d << 16) ^ (c >>> 16) ^ a;
			    return me.a = (a - b) | 0;
			  };

			  /* The following is non-inverted tyche, which has better internal
			   * bit diffusion, but which is about 25% slower than tyche-i in JS.
			  me.next = function() {
			    var a = me.a, b = me.b, c = me.c, d = me.d;
			    a = (me.a + me.b | 0) >>> 0;
			    d = me.d ^ a; d = d << 16 ^ d >>> 16;
			    c = me.c + d | 0;
			    b = me.b ^ c; b = b << 12 ^ d >>> 20;
			    me.a = a = a + b | 0;
			    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
			    me.c = c = c + d | 0;
			    b = b ^ c;
			    return me.b = (b << 7 ^ b >>> 25);
			  }
			  */

			  me.a = 0;
			  me.b = 0;
			  me.c = 2654435769 | 0;
			  me.d = 1367130551;

			  if (seed === Math.floor(seed)) {
			    // Integer seed.
			    me.a = (seed / 0x100000000) | 0;
			    me.b = seed | 0;
			  } else {
			    // String seed.
			    strseed += seed;
			  }

			  // Mix in string seed, then discard an initial batch of 64 values.
			  for (var k = 0; k < strseed.length + 20; k++) {
			    me.b ^= strseed.charCodeAt(k) | 0;
			    me.next();
			  }
			}

			function copy(f, t) {
			  t.a = f.a;
			  t.b = f.b;
			  t.c = f.c;
			  t.d = f.d;
			  return t;
			}
			function impl(seed, opts) {
			  var xg = new XorGen(seed),
			      state = opts && opts.state,
			      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
			  prng.double = function() {
			    do {
			      var top = xg.next() >>> 11,
			          bot = (xg.next() >>> 0) / 0x100000000,
			          result = (top + bot) / (1 << 21);
			    } while (result === 0);
			    return result;
			  };
			  prng.int32 = xg.next;
			  prng.quick = prng;
			  if (state) {
			    if (typeof(state) == 'object') copy(state, xg);
			    prng.state = function() { return copy(xg, {}); };
			  }
			  return prng;
			}

			if (module && module.exports) {
			  module.exports = impl;
			} else {
			  this.tychei = impl;
			}

			})(
			  tychei,
			  module); 
		} (tychei$1));
		return tychei$1.exports;
	}

	var seedrandom$3 = {exports: {}};

	var _nodeResolve_empty = {};

	var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: _nodeResolve_empty
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

	/*
	Copyright 2019 David Bau.

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	*/
	var seedrandom$2 = seedrandom$3.exports;

	var hasRequiredSeedrandom$1;

	function requireSeedrandom$1 () {
		if (hasRequiredSeedrandom$1) return seedrandom$3.exports;
		hasRequiredSeedrandom$1 = 1;
		(function (module) {
			(function (global, pool, math) {
			//
			// The following constants are related to IEEE 754 limits.
			//

			var width = 256,        // each RC4 output is 0 <= x < 256
			    chunks = 6,         // at least six RC4 outputs for each double
			    digits = 52,        // there are 52 significant digits in a double
			    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
			    startdenom = math.pow(width, chunks),
			    significance = math.pow(2, digits),
			    overflow = significance * 2,
			    mask = width - 1,
			    nodecrypto;         // node.js crypto module, initialized at the bottom.

			//
			// seedrandom()
			// This is the seedrandom function described above.
			//
			function seedrandom(seed, options, callback) {
			  var key = [];
			  options = (options == true) ? { entropy: true } : (options || {});

			  // Flatten the seed string or build one from local entropy if needed.
			  var shortseed = mixkey(flatten(
			    options.entropy ? [seed, tostring(pool)] :
			    (seed == null) ? autoseed() : seed, 3), key);

			  // Use the seed to initialize an ARC4 generator.
			  var arc4 = new ARC4(key);

			  // This function returns a random double in [0, 1) that contains
			  // randomness in every bit of the mantissa of the IEEE 754 value.
			  var prng = function() {
			    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
			        d = startdenom,                 //   and denominator d = 2 ^ 48.
			        x = 0;                          //   and no 'extra last byte'.
			    while (n < significance) {          // Fill up all significant digits by
			      n = (n + x) * width;              //   shifting numerator and
			      d *= width;                       //   denominator and generating a
			      x = arc4.g(1);                    //   new least-significant-byte.
			    }
			    while (n >= overflow) {             // To avoid rounding up, before adding
			      n /= 2;                           //   last byte, shift everything
			      d /= 2;                           //   right using integer math until
			      x >>>= 1;                         //   we have exactly the desired bits.
			    }
			    return (n + x) / d;                 // Form the number within [0, 1).
			  };

			  prng.int32 = function() { return arc4.g(4) | 0; };
			  prng.quick = function() { return arc4.g(4) / 0x100000000; };
			  prng.double = prng;

			  // Mix the randomness into accumulated entropy.
			  mixkey(tostring(arc4.S), pool);

			  // Calling convention: what to return as a function of prng, seed, is_math.
			  return (options.pass || callback ||
			      function(prng, seed, is_math_call, state) {
			        if (state) {
			          // Load the arc4 state from the given state if it has an S array.
			          if (state.S) { copy(state, arc4); }
			          // Only provide the .state method if requested via options.state.
			          prng.state = function() { return copy(arc4, {}); };
			        }

			        // If called as a method of Math (Math.seedrandom()), mutate
			        // Math.random because that is how seedrandom.js has worked since v1.0.
			        if (is_math_call) { math[rngname] = prng; return seed; }

			        // Otherwise, it is a newer calling convention, so return the
			        // prng directly.
			        else return prng;
			      })(
			  prng,
			  shortseed,
			  'global' in options ? options.global : (this == math),
			  options.state);
			}

			//
			// ARC4
			//
			// An ARC4 implementation.  The constructor takes a key in the form of
			// an array of at most (width) integers that should be 0 <= x < (width).
			//
			// The g(count) method returns a pseudorandom integer that concatenates
			// the next (count) outputs from ARC4.  Its return value is a number x
			// that is in the range 0 <= x < (width ^ count).
			//
			function ARC4(key) {
			  var t, keylen = key.length,
			      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

			  // The empty key [] is treated as [0].
			  if (!keylen) { key = [keylen++]; }

			  // Set up S using the standard key scheduling algorithm.
			  while (i < width) {
			    s[i] = i++;
			  }
			  for (i = 0; i < width; i++) {
			    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
			    s[j] = t;
			  }

			  // The "g" method returns the next (count) outputs as one number.
			  (me.g = function(count) {
			    // Using instance members instead of closure state nearly doubles speed.
			    var t, r = 0,
			        i = me.i, j = me.j, s = me.S;
			    while (count--) {
			      t = s[i = mask & (i + 1)];
			      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
			    }
			    me.i = i; me.j = j;
			    return r;
			    // For robust unpredictability, the function call below automatically
			    // discards an initial batch of values.  This is called RC4-drop[256].
			    // See http://google.com/search?q=rsa+fluhrer+response&btnI
			  })(width);
			}

			//
			// copy()
			// Copies internal state of ARC4 to or from a plain object.
			//
			function copy(f, t) {
			  t.i = f.i;
			  t.j = f.j;
			  t.S = f.S.slice();
			  return t;
			}
			//
			// flatten()
			// Converts an object tree to nested arrays of strings.
			//
			function flatten(obj, depth) {
			  var result = [], typ = (typeof obj), prop;
			  if (depth && typ == 'object') {
			    for (prop in obj) {
			      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
			    }
			  }
			  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
			}

			//
			// mixkey()
			// Mixes a string seed into a key that is an array of integers, and
			// returns a shortened string seed that is equivalent to the result key.
			//
			function mixkey(seed, key) {
			  var stringseed = seed + '', smear, j = 0;
			  while (j < stringseed.length) {
			    key[mask & j] =
			      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
			  }
			  return tostring(key);
			}

			//
			// autoseed()
			// Returns an object for autoseeding, using window.crypto and Node crypto
			// module if available.
			//
			function autoseed() {
			  try {
			    var out;
			    if (nodecrypto && (out = nodecrypto.randomBytes)) {
			      // The use of 'out' to remember randomBytes makes tight minified code.
			      out = out(width);
			    } else {
			      out = new Uint8Array(width);
			      (global.crypto || global.msCrypto).getRandomValues(out);
			    }
			    return tostring(out);
			  } catch (e) {
			    var browser = global.navigator,
			        plugins = browser && browser.plugins;
			    return [+new Date, global, plugins, global.screen, tostring(pool)];
			  }
			}

			//
			// tostring()
			// Converts an array of charcodes to a string
			//
			function tostring(a) {
			  return String.fromCharCode.apply(0, a);
			}

			//
			// When seedrandom.js is loaded, we immediately mix a few bits
			// from the built-in RNG into the entropy pool.  Because we do
			// not want to interfere with deterministic PRNG state later,
			// seedrandom will not call math.random on its own again after
			// initialization.
			//
			mixkey(math.random(), pool);

			//
			// Nodejs and AMD support: export the implementation as a module using
			// either convention.
			//
			if (module.exports) {
			  module.exports = seedrandom;
			  // When in node.js, try using crypto package for autoseeding.
			  try {
			    nodecrypto = require$$0;
			  } catch (ex) {}
			} else {
			  // When included as a plain script, set up Math.seedrandom global.
			  math['seed' + rngname] = seedrandom;
			}


			// End anonymous scope, and pass initial values.
			})(
			  // global: `self` in browsers (including strict mode and web workers),
			  // otherwise `this` in Node and other environments
			  (typeof self !== 'undefined') ? self : seedrandom$2,
			  [],     // pool: entropy pool starts empty
			  Math    // math: package containing random, pow, and seedrandom
			); 
		} (seedrandom$3));
		return seedrandom$3.exports;
	}

	var seedrandom$1;
	var hasRequiredSeedrandom;

	function requireSeedrandom () {
		if (hasRequiredSeedrandom) return seedrandom$1;
		hasRequiredSeedrandom = 1;
		// A library of seedable RNGs implemented in Javascript.
		//
		// Usage:
		//
		// var seedrandom = require('seedrandom');
		// var random = seedrandom(1); // or any seed.
		// var x = random();       // 0 <= x < 1.  Every bit is random.
		// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

		// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
		// Period: ~2^116
		// Reported to pass all BigCrush tests.
		var alea = requireAlea();

		// xor128, a pure xor-shift generator by George Marsaglia.
		// Period: 2^128-1.
		// Reported to fail: MatrixRank and LinearComp.
		var xor128 = requireXor128();

		// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
		// Period: 2^192-2^32
		// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
		var xorwow = requireXorwow();

		// xorshift7, by François Panneton and Pierre L'ecuyer, takes
		// a different approach: it adds robustness by allowing more shifts
		// than Marsaglia's original three.  It is a 7-shift generator
		// with 256 bits, that passes BigCrush with no systmatic failures.
		// Period 2^256-1.
		// No systematic BigCrush failures reported.
		var xorshift7 = requireXorshift7();

		// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
		// very long period that also adds a Weyl generator. It also passes
		// BigCrush with no systematic failures.  Its long period may
		// be useful if you have many generators and need to avoid
		// collisions.
		// Period: 2^4128-2^32.
		// No systematic BigCrush failures reported.
		var xor4096 = requireXor4096();

		// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
		// number generator derived from ChaCha, a modern stream cipher.
		// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
		// Period: ~2^127
		// No systematic BigCrush failures reported.
		var tychei = requireTychei();

		// The original ARC4-based prng included in this library.
		// Period: ~2^1600
		var sr = requireSeedrandom$1();

		sr.alea = alea;
		sr.xor128 = xor128;
		sr.xorwow = xorwow;
		sr.xorshift7 = xorshift7;
		sr.xor4096 = xor4096;
		sr.tychei = tychei;

		seedrandom$1 = sr;
		return seedrandom$1;
	}

	var seedrandomExports = requireSeedrandom();
	var seedrandom = /*@__PURE__*/getDefaultExportFromCjs(seedrandomExports);

	var lodash_custom_min$1 = {exports: {}};

	/**
	 * @license
	 * Lo-Dash 2.4.1 (Custom Build) lodash.com/license | Underscore.js 1.5.2 underscorejs.org/LICENSE
	 * Build: `lodash exports="commonjs" include="assign,clone,filter,each,map,random,reduce,some"`
	 */
	var lodash_custom_min = lodash_custom_min$1.exports;

	var hasRequiredLodash_custom_min;

	function requireLodash_custom_min () {
		if (hasRequiredLodash_custom_min) return lodash_custom_min$1.exports;
		hasRequiredLodash_custom_min = 1;
		(function (module, exports) {
	(function(){function n(n){return typeof n.toString!="function"&&typeof(n+"")=="string"}function t(n){n.length=0,S.length<C&&S.push(n);}function e(n,t){var e;t||(t=0),typeof e=="undefined"&&(e=n?n.length:0);var r=-1;e=e-t||0;for(var o=Array(0>e?0:e);++r<e;)o[r]=n[t+r];return o}function r(){}function o(n){function t(){if(o){var n=e(o);at.apply(n,arguments);}if(this instanceof t){var c=a(r.prototype),n=r.apply(c,n||arguments);return h(n)?n:c}return r.apply(u,n||arguments)}var r=n[0],o=n[2],u=n[4];return dt(t,n),t
			}function u(r,o,a,c,i){if(a){var l=a(r);if(typeof l!="undefined")return l}if(!h(r))return r;var f=tt.call(r);if(!G[f]||!bt.nodeClass&&n(r))return r;var p=ht[f];switch(f){case R:case L:return new p(+r);case T:case M:return new p(r);case K:return l=p(r.source,D.exec(r)),l.lastIndex=r.lastIndex,l}if(f=mt(r),o){var s=!c;c||(c=S.pop()||[]),i||(i=S.pop()||[]);for(var g=c.length;g--;)if(c[g]==r)return i[g];l=f?p(r.length):{};}else l=f?e(r):xt({},r);return f&&(ut.call(r,"index")&&(l.index=r.index),ut.call(r,"input")&&(l.input=r.input)),o?(c.push(r),i.push(l),(f?_t:St)(r,function(n,t){l[t]=u(n,o,a,c,i);
			}),s&&(t(c),t(i)),l):l}function a(n){return h(n)?ft(n):{}}function c(n,t,e){if(typeof n!="function")return _;if(typeof t=="undefined"||!("prototype"in n))return n;var r=n.__bindData__;if(typeof r=="undefined"&&(bt.funcNames&&(r=!n.name),r=r||!bt.funcDecomp,!r)){var o=ot.call(n);bt.funcNames||(r=!P.test(o)),r||(r=F.test(o),dt(n,r));}if(false===r||true!==r&&1&r[1])return n;switch(e){case 1:return function(e){return n.call(t,e)};case 2:return function(e,r){return n.call(t,e,r)};case 3:return function(e,r,o){return n.call(t,e,r,o)
			};case 4:return function(e,r,o,u){return n.call(t,e,r,o,u)}}return w(n,t)}function i(n){function t(){var n=p?l:this;if(u){var b=e(u);at.apply(b,arguments);}return (c||g)&&(b||(b=e(arguments)),c&&at.apply(b,c),g&&b.length<f)?(o|=16,i([r,y?o:-4&o,b,null,l,f])):(b||(b=arguments),s&&(r=n[v]),this instanceof t?(n=a(r.prototype),b=r.apply(n,b),h(b)?b:n):r.apply(n,b))}var r=n[0],o=n[1],u=n[2],c=n[3],l=n[4],f=n[5],p=1&o,s=2&o,g=4&o,y=8&o,v=r;return dt(t,n),t}function l(e,r,o,u,a,c){var i; if(e===r)return 0!==e||1/e==1/r;if(e===e&&!(e&&H[typeof e]||r&&H[typeof r]))return false;if(null==e||null==r)return e===r;var f=tt.call(e),p=tt.call(r);if(f==B&&(f=z),p==B&&(p=z),f!=p)return false;switch(f){case R:case L:return +e==+r;case T:return e!=+e?r!=+r:0==e?1/e==1/r:e==+r;case K:case M:return e==r+""}if(p=f==N,!p){var s=ut.call(e,"__wrapped__"),h=ut.call(r,"__wrapped__");if(s||h)return l(s?e.__wrapped__:e,h?r.__wrapped__:r,o,u,a,c);if(f!=z||!bt.nodeClass&&(n(e)||n(r)))return false;if(f=!bt.argsObject&&g(e)?Object:e.constructor,s=!bt.argsObject&&g(r)?Object:r.constructor,f!=s&&!(y(f)&&f instanceof f&&y(s)&&s instanceof s)&&"constructor"in e&&"constructor"in r)return false
			}for(f=!a,a||(a=S.pop()||[]),c||(c=S.pop()||[]),s=a.length;s--;)if(a[s]==e)return c[s]==r;var v=0,i=true;if(a.push(e),c.push(r),p){if(s=e.length,v=r.length,(i=v==s)||u)for(;v--;)if(p=s,h=r[v],u)for(;p--&&!(i=l(e[p],h,o,u,a,c)););}else Ot(r,function(n,t,r){return ut.call(r,t)?(v++,i=ut.call(e,t)&&l(e[t],n,o,u,a,c)):void 0});return a.pop(),c.pop(),f&&(t(a),t(c)),i}function f(n,t,r,u,a,c){var l=1&t,p=4&t,s=16&t,g=32&t;
			if(!(2&t||y(n)))throw new TypeError;s&&!r.length&&(t&=-17,s=r=false),g&&!u.length&&(t&=-33,g=u=false);var h=n&&n.__bindData__;return h&&true!==h?(h=e(h),h[2]&&(h[2]=e(h[2])),h[3]&&(h[3]=e(h[3])),!l||1&h[1]||(h[4]=a),!l&&1&h[1]&&(t|=8),!p||4&h[1]||(h[5]=c),s&&at.apply(h[2]||(h[2]=[]),r),g&&it.apply(h[3]||(h[3]=[]),u),h[1]|=t,f.apply(null,h)):(1==t||17===t?o:i)([n,t,r,u,a,c])}function p(){q.h=I,q.b=q.c=q.g=q.i="",q.e="t",q.j=true;for(var n,t=0;n=arguments[t];t++)for(var e in n)q[e]=n[e];t=q.a,q.d=/^[^,]+/.exec(t)[0],n=Function,t="return function("+t+"){",e=q;
			var r="var n,t="+e.d+",E="+e.e+";if(!t)return E;"+e.i+";";e.b?(r+="var u=t.length;n=-1;if("+e.b+"){",bt.unindexedChars&&(r+="if(s(t)){t=t.split('')}"),r+="while(++n<u){"+e.g+";}}else{"):bt.nonEnumArgs&&(r+="var u=t.length;n=-1;if(u&&p(t)){while(++n<u){n+='';"+e.g+";}}else{"),bt.enumPrototypes&&(r+="var G=typeof t=='function';"),bt.enumErrorProps&&(r+="var F=t===k||t instanceof Error;");var o=[];if(bt.enumPrototypes&&o.push('!(G&&n=="prototype")'),bt.enumErrorProps&&o.push('!(F&&(n=="message"||n=="name"))'),e.j&&e.f)r+="var C=-1,D=B[typeof t]&&v(t),u=D?D.length:0;while(++C<u){n=D[C];",o.length&&(r+="if("+o.join("&&")+"){"),r+=e.g+";",o.length&&(r+="}"),r+="}";
			else if(r+="for(n in t){",e.j&&o.push("m.call(t, n)"),o.length&&(r+="if("+o.join("&&")+"){"),r+=e.g+";",o.length&&(r+="}"),r+="}",bt.nonEnumShadows){for(r+="if(t!==A){var i=t.constructor,r=t===(i&&i.prototype),f=t===J?I:t===k?j:L.call(t),x=y[f];",k=0;7>k;k++)r+="n='"+e.h[k]+"';if((!(r&&x[n])&&m.call(t,n))",e.j||(r+="||(!x[n]&&t[n]!==A[n])"),r+="){"+e.g+"}";r+="}";}return (e.b||bt.nonEnumArgs)&&(r+="}"),r+=e.c+";return E",n("d,j,k,m,o,p,q,s,v,A,B,y,I,J,L",t+r+"}")(c,$,Y,ut,A,g,mt,v,q.f,Z,H,vt,M,nt,tt)
			}function s(n){return typeof n=="function"&&et.test(n)}function g(n){return n&&typeof n=="object"&&typeof n.length=="number"&&tt.call(n)==B||false}function y(n){return typeof n=="function"}function h(n){return !(!n||!H[typeof n])}function v(n){return typeof n=="string"||n&&typeof n=="object"&&tt.call(n)==M||false}function b(n,t,e){var o=[];if(t=r.createCallback(t,e,3),mt(n)){e=-1;for(var u=n.length;++e<u;){var a=n[e];t(a,e,n)&&o.push(a);}}else _t(n,function(n,e,r){t(n,e,r)&&o.push(n);});return o}function d(n,t,e){if(t&&typeof e=="undefined"&&mt(n)){e=-1;
			for(var r=n.length;++e<r&&false!==t(n[e],e,n););}else _t(n,t,e);return n}function m(n,t,e){var o=-1,u=n?n.length:0,a=Array(typeof u=="number"?u:0);if(t=r.createCallback(t,e,3),mt(n))for(;++o<u;)a[o]=t(n[o],o,n);else _t(n,function(n,e,r){a[++o]=t(n,e,r);});return a}function j(n,t,e,o){var u=3>arguments.length;if(t=r.createCallback(t,o,4),mt(n)){var a=-1,c=n.length;for(u&&(e=n[++a]);++a<c;)e=t(e,n[a],a,n);}else _t(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o);});return e}function E(n,t,e){var o;if(t=r.createCallback(t,e,3),mt(n)){e=-1;
			for(var u=n.length;++e<u&&!(o=t(n[e],e,n)););}else _t(n,function(n,e,r){return !(o=t(n,e,r))});return !!o}function w(n,t){return 2<arguments.length?f(n,17,e(arguments,2),null,t):f(n,1,null,null,t)}function _(n){return n}function x(){}function O(n){return function(t){return t[n]}}var S=[],A={},C=40,D=/\w*$/,P=/^\s*function[ \n\r\t]+\w/,F=/\bthis\b/,I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),B="[object Arguments]",N="[object Array]",R="[object Boolean]",L="[object Date]",$="[object Error]",T="[object Number]",z="[object Object]",K="[object RegExp]",M="[object String]",G={"[object Function]":false};
			G[B]=G[N]=G[R]=G[L]=G[T]=G[z]=G[K]=G[M]=true;var J={configurable:false,enumerable:false,value:null,writable:false},q={a:"",b:null,c:"",d:"",e:"",v:null,g:"",h:null,support:null,i:"",j:false},H={"boolean":false,"function":true,object:true,number:false,string:false,undefined:false},V=H[typeof window]&&window||this,W=H['object']&&exports&&!exports.nodeType&&exports,Q=H['object']&&module&&!module.nodeType&&module,U=H[typeof commonjsGlobal]&&commonjsGlobal;!U||U.global!==U&&U.window!==U||(V=U);var X=[],Y=Error.prototype,Z=Object.prototype,nt=String.prototype,tt=Z.toString,et=RegExp("^"+(tt+"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),rt=Math.floor,ot=Function.prototype.toString,ut=Z.hasOwnProperty,at=X.push,ct=Z.propertyIsEnumerable,it=X.unshift,lt=function(){try{var n={},t=s(t=Object.defineProperty)&&t,e=t(n,n,n)&&t;
			}catch(r){}return e}(),ft=s(ft=Object.create)&&ft,pt=s(pt=Array.isArray)&&pt,st=s(st=Object.keys)&&st,gt=Math.min,yt=Math.random,ht={};ht[N]=Array,ht[R]=Boolean,ht[L]=Date,ht["[object Function]"]=Function,ht[z]=Object,ht[T]=Number,ht[K]=RegExp,ht[M]=String;var vt={};vt[N]=vt[L]=vt[T]={constructor:true,toLocaleString:true,toString:true,valueOf:true},vt[R]=vt[M]={constructor:true,toString:true,valueOf:true},vt[$]=vt["[object Function]"]=vt[K]={constructor:true,toString:true},vt[z]={constructor:true},function(){for(var n=I.length;n--;){var t,e=I[n];
			for(t in vt)ut.call(vt,t)&&!ut.call(vt[t],e)&&(vt[t][e]=false);}}();var bt=r.support={};!function(){function n(){this.x=1;}var t={0:1,length:1},e=[];n.prototype={valueOf:1,y:1};for(var r in new n)e.push(r);for(r in arguments);bt.argsClass=tt.call(arguments)==B,bt.argsObject=arguments.constructor==Object&&!(arguments instanceof Array),bt.enumErrorProps=ct.call(Y,"message")||ct.call(Y,"name"),bt.enumPrototypes=ct.call(n,"prototype"),bt.funcDecomp=!s(V.k)&&F.test(function(){return this}),bt.funcNames=typeof Function.name=="string",bt.nonEnumArgs=0!=r,bt.nonEnumShadows=!/valueOf/.test(e),bt.spliceObjects=(X.splice.call(t,0,1),false),bt.unindexedChars="xx"!="x"[0]+Object("x")[0];
			try{bt.nodeClass=!(tt.call(document)==z&&!({toString:0}+""));}catch(o){bt.nodeClass=true;}}(1),ft||(a=function(){function n(){}return function(t){if(h(t)){n.prototype=t;var e=new n;n.prototype=null;}return e||V.Object()}}());var dt=lt?function(n,t){J.value=t,lt(n,"__bindData__",J);}:x;bt.argsClass||(g=function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&ut.call(n,"callee")&&!ct.call(n,"callee")||false});var mt=pt||function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&tt.call(n)==N||false
			},jt=p({a:"z",e:"[]",i:"if(!(B[typeof z]))return E",g:"E.push(n)"}),Et=st?function(n){return h(n)?bt.enumPrototypes&&typeof n=="function"||bt.nonEnumArgs&&n.length&&g(n)?jt(n):st(n):[]}:jt,U={a:"g,e,K",i:"e=e&&typeof K=='undefined'?e:d(e,K,3)",b:"typeof u=='number'",v:Et,g:"if(e(t[n],n,g)===false)return E"},pt={a:"z,H,l",i:"var a=arguments,b=0,c=typeof l=='number'?2:a.length;while(++b<c){t=a[b];if(t&&B[typeof t]){",v:Et,g:"if(typeof E[n]=='undefined')E[n]=t[n]",c:"}}"},wt={i:"if(!B[typeof t])return E;"+U.i,b:false},_t=p(U),xt=p(pt,{i:pt.i.replace(";",";if(c>3&&typeof a[c-2]=='function'){var e=d(a[--c-1],a[c--],2)}else if(c>2&&typeof a[c-1]=='function'){e=a[--c]}"),g:"E[n]=e?e(E[n],t[n]):t[n]"}),Ot=p(U,wt,{j:false}),St=p(U,wt);
			y(/x/)&&(y=function(n){return typeof n=="function"&&"[object Function]"==tt.call(n)}),r.assign=xt,r.bind=w,r.createCallback=function(n,t,e){var r=typeof n;if(null==n||"function"==r)return c(n,t,e);if("object"!=r)return O(n);var o=Et(n),u=o[0],a=n[u];return 1!=o.length||a!==a||h(a)?function(t){for(var e=o.length,r=false;e--&&(r=l(t[o[e]],n[o[e]],null,true)););return r}:function(n){return n=n[u],a===n&&(0!==a||1/a==1/n)}},r.filter=b,r.forEach=d,r.forIn=Ot,r.forOwn=St,r.keys=Et,r.map=m,r.property=O,r.collect=m,r.each=d,r.extend=xt,r.select=b,r.clone=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=t,t=false),u(n,t,typeof e=="function"&&c(e,r,1))
			},r.identity=_,r.isArguments=g,r.isArray=mt,r.isFunction=y,r.isObject=h,r.isString=v,r.noop=x,r.random=function(n,t,e){var r=null==n,o=null==t;return null==e&&(typeof n=="boolean"&&o?(e=n,n=1):o||typeof t!="boolean"||(e=t,o=true)),r&&o&&(t=1),n=+n||0,o?(t=n,n=0):t=+t||0,e||n%1||t%1?(e=yt(),gt(n+e*(t-n+parseFloat("1e-"+((e+"").length-1))),t)):n+rt(yt()*(t-n+1))},r.reduce=j,r.some=E,r.any=E,r.foldl=j,r.inject=j,r.VERSION="2.4.1",W&&Q&&(W._=r);}).call(lodash_custom_min); 
		} (lodash_custom_min$1, lodash_custom_min$1.exports));
		return lodash_custom_min$1.exports;
	}

	var lodash_custom_minExports = requireLodash_custom_min();
	var customLodash = /*@__PURE__*/getDefaultExportFromCjs(lodash_custom_minExports);

	seedrandom('terra :)', { global: true });
	var _ = customLodash._;
	/**
	 * Takes a cell and returns the coordinates of its neighbors
	 * @param  {int} x0     - x position of cell
	 * @param  {int} y0     - y position of cell
	 * @param  {int} xMax   - maximum x index i.e. grid width
	 * @param  {int} yMax   - maximum x index i.e. grid height
	 * @param  {int} radius - (default = 1) neighbor radius
	 * @return {array}      - an array of [x, y] pairs of the neighboring cells
	 */
	_.getNeighborCoordsFn = function (xMax, yMax, vonNeumann, periodic) {
	    if (periodic) {
	        if (vonNeumann) {
	            // periodic von neumann
	            return function (x0, y0, radius) {
	                var coords = [], x, rX, y, rY, rYMax;
	                for (rX = -radius; rX <= radius; ++rX) {
	                    rYMax = radius - Math.abs(rX);
	                    for (rY = -rYMax; rY <= rYMax; ++rY) {
	                        x = ((rX + x0) % xMax + xMax) % xMax;
	                        y = ((rY + y0) % yMax + yMax) % yMax;
	                        if (x !== x0 || y !== y0) {
	                            coords.push({
	                                x: x,
	                                y: y
	                            });
	                        }
	                    }
	                }
	                return coords;
	            };
	        }
	        else {
	            // periodic moore
	            return function (x0, y0, radius) {
	                var coords = [], x, xLo, xHi, y, yLo, yHi;
	                xLo = x0 - radius;
	                yLo = y0 - radius;
	                xHi = x0 + radius;
	                yHi = y0 + radius;
	                for (x = xLo; x <= xHi; ++x) {
	                    for (y = yLo; y <= yHi; ++y) {
	                        if (x !== x0 || y !== y0) {
	                            coords.push({
	                                x: (x % xMax + xMax) % xMax,
	                                y: (y % yMax + yMax) % yMax
	                            });
	                        }
	                    }
	                }
	                return coords;
	            };
	        }
	    }
	    else {
	        // non-periodic, need to restrict to within [0, max)
	        xMax -= 1;
	        yMax -= 1;
	        if (vonNeumann) {
	            //non-periodic von-neumann
	            return function (x0, y0, radius) {
	                var coords = [], x, rX, y, rY, rYMax;
	                for (rX = -radius; rX <= radius; ++rX) {
	                    rYMax = radius - Math.abs(rX);
	                    for (rY = -rYMax; rY <= rYMax; ++rY) {
	                        x = rX + x0;
	                        y = rY + y0;
	                        if (x >= 0 && y >= 0 && x <= xMax && y <= yMax && (x !== x0 || y !== y0)) {
	                            coords.push({
	                                x: x,
	                                y: y
	                            });
	                        }
	                    }
	                }
	                return coords;
	            };
	        }
	        else {
	            // non-periodic moore
	            return function (x0, y0, radius) {
	                var coords = [], x, xLo, xHi, y, yLo, yHi;
	                xLo = Math.max(0, x0 - radius);
	                yLo = Math.max(0, y0 - radius);
	                xHi = Math.min(x0 + radius, xMax);
	                yHi = Math.min(y0 + radius, yMax);
	                for (x = xLo; x <= xHi; ++x)
	                    for (y = yLo; y <= yHi; ++y)
	                        if (x !== x0 || y !== y0)
	                            coords.push({ x: x, y: y });
	                return coords;
	            };
	        }
	    }
	};
	_.pickRandomWeighted = function (weightedArrays) {
	    var sum = 0, rand = _.random(100, true);
	    for (var i = 0; i < weightedArrays.length; i++) {
	        var cur = weightedArrays[i];
	        sum += cur[1];
	        if (sum > rand)
	            return cur[0];
	    }
	    return false;
	};

	// abstract factory that adds a superclass of baseCreature
	var factory = (function () {
	    function baseCreature() {
	        this.age = -1;
	    }
	    function baseCA() {
	        this.age = -1;
	    }
	    // The legacy function constructors back the dynamically registered prototype chains.
	    const BaseCreatureConstructor = baseCreature;
	    const BaseCAConstructor = baseCA;
	    baseCreature.prototype.initialEnergy = 50;
	    baseCreature.prototype.maxEnergy = 100;
	    baseCreature.prototype.efficiency = 0.7;
	    baseCreature.prototype.size = 50;
	    baseCreature.prototype.actionRadius = 1;
	    baseCreature.prototype.sustainability = 2;
	    // used as percentages of maxEnergy
	    baseCreature.prototype.reproduceLv = 0.70;
	    baseCreature.prototype.moveLv = 0;
	    baseCreature.prototype.boundEnergy = function () {
	        if (this.energy > this.maxEnergy)
	            this.energy = this.maxEnergy;
	    };
	    baseCreature.prototype.isDead = function () {
	        return this.energy <= 0;
	    };
	    baseCreature.prototype.reproduce = function (neighbors) {
	        var spots = _.filter(neighbors, function (spot) {
	            return !spot.creature;
	        });
	        if (spots.length) {
	            var step = spots[_.random(spots.length - 1)];
	            var coords = step.coords;
	            var creature = factory.make(this.type);
	            var successFn = (function () {
	                this.energy -= this.initialEnergy;
	                return true;
	            }).bind(this);
	            var failureFn = this.wait;
	            return {
	                x: coords.x,
	                y: coords.y,
	                creature: creature,
	                successFn: successFn,
	                failureFn: failureFn
	            };
	        }
	        else
	            return false;
	    };
	    baseCreature.prototype.move = function (neighbors) {
	        var creature = this;
	        // first, look for creatures to eat
	        var spots = _.filter(neighbors, (function (spot) {
	            return spot.creature ? spot.creature.size < this.size : false;
	        }).bind(this));
	        // if there's not enough food, try to move
	        if (spots.length < this.sustainability) {
	            spots = _.filter(neighbors, function (spot) {
	                return !spot.creature;
	            });
	        }
	        // if we've got a spot to move to...
	        if (spots.length) {
	            // ...pick one
	            var step = spots[_.random(spots.length - 1)];
	            var coords = step.coords;
	            var successFn = (function () {
	                var foodEnergy = (step.creature ? step.creature.energy : undefined) * this.efficiency;
	                // add foodEnergy if eating, subtract 10 if moving
	                this.energy = this.energy + (foodEnergy || -10);
	                // clear the original location
	                return false;
	            }).bind(this);
	            return {
	                x: coords.x,
	                y: coords.y,
	                creature: creature,
	                successFn: successFn
	            };
	        }
	        else
	            return false;
	    };
	    baseCreature.prototype.wait = function () {
	        this.energy -= 5;
	        return true;
	    };
	    baseCreature.prototype.process = function (neighbors, x, y) {
	        var step = { x: 0, y: 0, creature: false };
	        var maxEnergy = this.maxEnergy;
	        if (this.energy > maxEnergy * this.reproduceLv && this.reproduce) {
	            step = this.reproduce(neighbors);
	        }
	        else if (this.energy > maxEnergy * this.moveLv && this.move) {
	            step = this.move(neighbors);
	        }
	        if (step !== false && step.creature) {
	            var creature = step.creature;
	            creature.successFn = step.successFn || creature.wait;
	            creature.failureFn = step.failureFn || creature.wait;
	            return {
	                x: step.x,
	                y: step.y,
	                creature: creature,
	                observed: true
	            };
	        }
	        else
	            return this.energy !== this.maxEnergy;
	    };
	    baseCA.prototype.actionRadius = 1;
	    baseCA.prototype.boundEnergy = function () { };
	    baseCA.prototype.isDead = function () { return false; };
	    baseCA.prototype.process = function (neighbors, x, y) { };
	    baseCA.prototype.wait = function () { };
	    // Storage for our creature types
	    var types = {};
	    return {
	        make: function (type, options) {
	            var CreatureType = types[String(type)];
	            return (CreatureType ? new CreatureType(options) : false);
	        },
	        registerCreature: function (options, init) {
	            var type = options.type;
	            // only register classes that fulfill the creature contract
	            if (typeof type === 'string' && typeof types[type] === 'undefined') {
	                // set the constructor, including init if it's defined
	                // These dynamic constructors get their typed prototype directly below.
	                if (typeof init === 'function') {
	                    types[type] = (function () {
	                        this.energy = this.initialEnergy;
	                        init.call(this);
	                    });
	                }
	                else {
	                    types[type] = (function () {
	                        this.energy = this.initialEnergy;
	                    });
	                }
	                var color = options.color || options.colour;
	                // set the color randomly if none is provided
	                if (typeof color !== 'object' || color.length !== 3) {
	                    options.color = [_.random(255), _.random(255), _.random(255)];
	                }
	                types[type].prototype = new BaseCreatureConstructor();
	                types[type].prototype.constructor = types[type];
	                _.each(options, function (value, key) {
	                    types[type].prototype[key] = value;
	                });
	                types[type].prototype.successFn = types[type].prototype.wait;
	                types[type].prototype.failureFn = types[type].prototype.wait;
	                types[type].prototype.energy = options.initialEnergy;
	                return true;
	            }
	            else
	                return false;
	        },
	        registerCA: function (options, init) {
	            var type = options.type;
	            if (typeof type === 'string' && typeof types[type] === 'undefined') {
	                // set the constructor, including init if it's defined
	                // These dynamic constructors get their typed prototype directly below.
	                types[type] = (typeof init === 'function' ?
	                    function () { init.call(this); } :
	                    function () { });
	                var color = options.color = options.color || options.colour;
	                // set the color randomly if none is provided
	                if (typeof color !== 'object' || color.length !== 3) {
	                    options.color = [_.random(255), _.random(255), _.random(255)];
	                }
	                options.colorFn = options.colorFn || options.colourFn;
	                types[type].prototype = new BaseCAConstructor();
	                types[type].prototype.constructor = types[type];
	                _.each(options, function (value, key) {
	                    types[type].prototype[key] = value;
	                });
	                return true;
	            }
	            else
	                return false;
	        }
	    };
	})();

	function display(canvas, grid, cellSize, trails, background) {
	    var ctx = canvas.getContext('2d');
	    if (trails && background) {
	        ctx.fillStyle = 'rgba(' + background + ',' + (1 - trails) + ')';
	        ctx.fillRect(0, 0, canvas.width, canvas.height);
	    }
	    else if (trails) {
	        throw "Background must also be set for trails";
	    }
	    else
	        ctx.clearRect(0, 0, canvas.width, canvas.height);
	    _.each(grid, function (column, x) {
	        _.each(column, function (creature, y) {
	            if (creature) {
	                var color = creature.colorFn ?
	                    creature.colorFn() :
	                    String(creature.color) + ',' + creature.energy / creature.maxEnergy;
	                ctx.fillStyle = 'rgba(' + color + ')';
	                if (creature.character) {
	                    ctx.fillText(creature.character, x * cellSize, y * cellSize + cellSize);
	                }
	                else {
	                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	                }
	            }
	        });
	    });
	}

	var createCanvasElement = function (width, height, cellSize, id, insertAfter, background) {
	    width *= cellSize;
	    height *= cellSize;
	    // Creates a scaled-up canvas based on the device's
	    // resolution, then displays it properly using styles
	    function createHDCanvas() {
	        var canvas = document.createElement('canvas');
	        var ctx = canvas.getContext('2d');
	        // Creates a dummy canvas to test device's pixel ratio
	        var ratio = (function () {
	            var ctx = document.createElement('canvas').getContext('2d');
	            var dpr = window.devicePixelRatio || 1;
	            var bsr = ctx.webkitBackingStorePixelRatio ||
	                ctx.mozBackingStorePixelRatio ||
	                ctx.msBackingStorePixelRatio ||
	                ctx.oBackingStorePixelRatio ||
	                ctx.backingStorePixelRatio || 1;
	            return dpr / bsr;
	        })();
	        canvas.width = width * ratio;
	        canvas.height = height * ratio;
	        canvas.style.width = width + 'px';
	        canvas.style.height = height + 'px';
	        ctx.scale(ratio, ratio);
	        ctx.font = 'bold ' + cellSize + 'px Arial';
	        if (id)
	            canvas.id = id;
	        if (background)
	            canvas.style.background = 'rgb(' + background + ')';
	        return canvas;
	    }
	    var canvas = createHDCanvas();
	    if (insertAfter)
	        insertAfter.parentNode.insertBefore(canvas, insertAfter.nextSibling);
	    else
	        document.body.appendChild(canvas);
	    return canvas;
	};

	/**
	 * Terrarium constructor function
	 * @param {int} width             number of cells in the x-direction
	 * @param {int} height            number of cells in the y-direction
	 * @param {object} options
	 *   @param {string} id             id assigned to the generated canvas
	 *   @param {int} cellSize          pixel width of each cell (default 10)
	 *   @param {string} insertAfter    id of the element to insert the canvas after
	 *   @param {float} trails          a number from [0, 1] indicating whether trails should
	 *                                    be drawn (0 = no trails, 1 = neverending trails)
	 *                                    "background" option is required if trails is set
	 *   @param {array} background      an RGB triplet for the canvas' background
	 */
	const Terrarium = function (width, height, options) {
	    var cellSize, neighborhood;
	    // cast width and height to integers
	    width = Math.ceil(width);
	    height = Math.ceil(height);
	    // set default options
	    options = options || {};
	    cellSize = options.cellSize || 10;
	    neighborhood = options.neighborhood || options.neighbourhood;
	    if (typeof neighborhood === 'string')
	        neighborhood = neighborhood.toLowerCase();
	    this.width = width;
	    this.height = height;
	    this.cellSize = cellSize;
	    this.trails = options.trails;
	    this.background = options.background;
	    this.canvas = createCanvasElement(width, height, cellSize, options.id, options.insertAfter, this.background);
	    this.grid = [];
	    this.nextFrame = false;
	    this.hasChanged = false;
	    this.getNeighborCoords = _.getNeighborCoordsFn(width, height, neighborhood === 'vonneumann', options.periodic);
	};
	/**
	 * Create a grid and fill it by using a function, 2-d array, or uniform type
	 * @param  {*} content  if  function, fill grid according to fn(x, y)
	 *                        if array, fill grid cells with the corresponding creatureType
	 *                        if string, fill grid with that creatureType
	 *                        otherwise, create empty grid
	 * @return {grid}       a grid adhering to the above rules
	 */
	Terrarium.prototype.makeGrid = function (content) {
	    var grid = [];
	    for (var x = 0, _w = this.width; x < _w; x++) {
	        grid.push([]);
	        for (var y = 0, _h = this.height; y < _h; y++) {
	            grid[x].push(factory.make(typeof content === 'function' ? content(x, y) :
	                typeof content === 'object' && content.length ? (content[y] || [])[x] :
	                    typeof content === 'string' ? content :
	                        undefined));
	        }
	    }
	    return grid;
	};
	/**
	 * Create a grid and fill it randomly with a set creature distribution
	 * @param  {array} distribution   an array of arrays of the form [string 'creatureName', float fillPercent]
	 */
	Terrarium.prototype.makeGridWithDistribution = function (distribution) {
	    var grid = [];
	    for (var x = 0, _w = this.width; x < _w; x++) {
	        grid.push([]);
	        for (var y = 0, _h = this.height; y < _h; y++) {
	            grid[x].push(factory.make(_.pickRandomWeighted(distribution)));
	        }
	    }
	    return grid;
	};
	/**
	 * Returns the next step of the simulation
	 * @param  {} steps   the number of steps to run through before returning
	 * @return {grid}     a new grid after <steps> || 1 steps
	 */
	Terrarium.prototype.step = function (steps) {
	    function copyAndRemoveInner(origCreature) {
	        if (origCreature) {
	            // Registered cells retain their concrete constructors when copied.
	            const CreatureConstructor = origCreature.constructor;
	            var copy = _.assign(new CreatureConstructor(), origCreature);
	            var dead = copy && copy.isDead();
	            if (dead && !self.hasChanged)
	                self.hasChanged = true;
	            copy.age++;
	            return !dead ? copy : false;
	        }
	        else
	            return false;
	    }
	    function copyAndRemove(origCols) {
	        return _.map(origCols, copyAndRemoveInner);
	    }
	    // TODO: Switch coords to just x and y to be consistent w/ pickWinnerInner
	    function zipCoordsWithNeighbors(coords) {
	        return {
	            coords: coords,
	            creature: oldGrid[coords.x][coords.y]
	        };
	    }
	    function processLoser(loser) {
	        // Losers are either creatures or action records; preserve the legacy property probe.
	        var action = loser;
	        var loserCreature = action.creature;
	        if (loserCreature) {
	            loserCreature.failureFn();
	            loserCreature.boundEnergy();
	        }
	        else {
	            var creature = loser;
	            creature.wait();
	            creature.boundEnergy();
	        }
	    }
	    function processCreaturesInner(creature, x, y) {
	        if (creature) {
	            var neighbors = _.map(self.getNeighborCoords(x, y, creature.actionRadius), zipCoordsWithNeighbors);
	            var result = creature.process(neighbors, x, y);
	            if (typeof result === 'object') {
	                var eigenColumn = eigenGrid[result.x];
	                var returnedCreature = result.creature;
	                var returnedY = result.y;
	                var contenders = eigenColumn[returnedY];
	                if (!contenders) {
	                    contenders = [];
	                    eigenColumn[returnedY] = contenders;
	                }
	                contenders.push({
	                    x: x,
	                    y: y,
	                    creature: returnedCreature
	                });
	                if (!self.hasChanged && result.observed)
	                    self.hasChanged = true;
	            }
	            else {
	                if (result && !self.hasChanged)
	                    self.hasChanged = true;
	                processLoser(creature);
	            }
	        }
	    }
	    function processCreatures(column, x) {
	        _.each(column, function (creature, y) { processCreaturesInner(creature, x, y); });
	    }
	    function pickWinnerInner(superposition, x, y) {
	        if (superposition) {
	            var winner = superposition.splice(_.random(superposition.length - 1), 1)[0];
	            // Actions in this grid were emitted by live creatures.
	            var winnerCreature = winner.creature;
	            // clear the original creature's square if successFn returns false
	            if (!winnerCreature.successFn()) {
	                newGrid[winner.x][winner.y] = false;
	            }
	            // TODO: so many calls to this. Can we just run it once at the start of a step?
	            winnerCreature.boundEnergy();
	            // put the winner in its rightful place
	            newGrid[x][y] = winnerCreature;
	            // ...and call wait() on the losers. We can do this without
	            // affecting temporal consistency because all callbacks have
	            // already been created with prior conditions
	            _.each(superposition, processLoser);
	        }
	    }
	    function pickWinner(column, x) {
	        _.each(column, function (superposition, y) {
	            pickWinnerInner(superposition, x, y);
	        });
	    }
	    var self = this;
	    var oldGrid = this.grid, newGrid, eigenGrid;
	    if (typeof steps !== 'number')
	        steps = 1;
	    while (steps--) {
	        this.hasChanged = false;
	        oldGrid = newGrid ? _.clone(newGrid) : this.grid;
	        // copy the old grid & remove dead creatures
	        newGrid = _.map(oldGrid, copyAndRemove);
	        // create an empty grid to hold creatures competing for the same square
	        // This grid is reused as a matrix of contender lists during the simulation step.
	        eigenGrid = this.makeGrid();
	        // Add each creature's intended destination to the eigenGrid
	        _.each(newGrid, processCreatures);
	        // Choose a winner from each of the eigenGrid's superpositions
	        _.each(eigenGrid, pickWinner);
	        if (!this.hasChanged)
	            return false;
	    }
	    return newGrid;
	};
	/**
	 * Updates the canvas to reflect the current grid
	 */
	Terrarium.prototype.draw = function () {
	    display(this.canvas, this.grid, this.cellSize, this.trails, this.background);
	};
	/**
	 * Starts animating the simulation. Can be called with only a function.
	 * @param  {int}   steps   the simulation will stop after <steps> steps if specified
	 * @param  {Function} fn   called as a callback once the animation finishes
	 */
	Terrarium.prototype.animate = function (steps, fn) {
	    function tick() {
	        var grid = self.step();
	        if (grid) {
	            self.grid = grid;
	            self.draw();
	            if (++i !== steps)
	                return self.nextFrame = requestAnimationFrame(tick);
	        } // if grid hasn't changed || reached last step
	        self.nextFrame = false;
	        if (fn)
	            fn();
	    }
	    if (typeof steps === 'function') {
	        fn = steps;
	        steps = null;
	    }
	    if (!this.nextFrame) {
	        var i = 0;
	        var self = this;
	        self.nextFrame = requestAnimationFrame(tick);
	    }
	};
	/**
	 * Stops a currently running animation
	 */
	Terrarium.prototype.stop = function () {
	    cancelAnimationFrame(this.nextFrame || 0);
	    this.nextFrame = false;
	};
	/**
	 * Stops any currently running animation and cleans up the DOM
	 */
	Terrarium.prototype.destroy = function () {
	    var canvas = this.canvas;
	    this.stop();
	    canvas.parentNode.removeChild(canvas);
	};

	const registerCreature = factory.registerCreature;
	const registerCA = factory.registerCA;

	exports.Terrarium = Terrarium;
	exports.registerCA = registerCA;
	exports.registerCreature = registerCreature;

}));
