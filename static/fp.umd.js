/**
 * FingerprintJS v4.6.2 - Copyright (c) FingerprintJS, Inc, 2025 (https://fingerprint.com)
 * 
 * Licensed under Business Source License 1.1 https://mariadb.com/bsl11/
 * Licensor: FingerprintJS, Inc.
 * Licensed Work: FingerprintJS browser fingerprinting library
 * Additional Use Grant: None
 * Change Date: Four years from first release for the specific version.
 * Change License: MIT, text at https://opensource.org/license/mit/ with the following copyright notice:
 * Copyright 2015-present FingerprintJS, Inc.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FingerprintJS = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */


    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var version = "4.6.2";

    function wait(durationMs, resolveWith) {
        return new Promise(function (resolve) { return setTimeout(resolve, durationMs, resolveWith); });
    }
    /**
     * Allows asynchronous actions and microtasks to happen.
     */
    function releaseEventLoop() {
        // Don't use setTimeout because Chrome throttles it in some cases causing very long agent execution:
        // https://stackoverflow.com/a/6032591/1118709
        // https://github.com/chromium/chromium/commit/0295dd09496330f3a9103ef7e543fa9b6050409b
        // Reusing a MessageChannel object gives no noticeable benefits
        return new Promise(function (resolve) {
            var channel = new MessageChannel();
            channel.port1.onmessage = function () { return resolve(); };
            channel.port2.postMessage(null);
        });
    }
    function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout) {
        if (deadlineTimeout === void 0) { deadlineTimeout = Infinity; }
        var requestIdleCallback = window.requestIdleCallback;
        if (requestIdleCallback) {
            // The function `requestIdleCallback` loses the binding to `window` here.
            // `globalThis` isn't always equal `window` (see https://github.com/fingerprintjs/fingerprintjs/issues/683).
            // Therefore, an error can occur. `call(window,` prevents the error.
            return new Promise(function (resolve) { return requestIdleCallback.call(window, function () { return resolve(); }, { timeout: deadlineTimeout }); });
        }
        else {
            return wait(Math.min(fallbackTimeout, deadlineTimeout));
        }
    }
    function isPromise(value) {
        return !!value && typeof value.then === 'function';
    }
    /**
     * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
     * Catches errors in both cases.
     *
     * If just you run a code like this:
     * ```
     * console.time('Action duration')
     * await action()
     * console.timeEnd('Action duration')
     * ```
     * The synchronous function time can be measured incorrectly because another microtask may run before the `await`
     * returns the control back to the code.
     */
    function awaitIfAsync(action, callback) {
        try {
            var returnedValue = action();
            if (isPromise(returnedValue)) {
                returnedValue.then(function (result) { return callback(true, result); }, function (error) { return callback(false, error); });
            }
            else {
                callback(true, returnedValue);
            }
        }
        catch (error) {
            callback(false, error);
        }
    }
    /**
     * If you run many synchronous tasks without using this function, the JS main loop will be busy and asynchronous tasks
     * (e.g. completing a network request, rendering the page) won't be able to happen.
     * This function allows running many synchronous tasks such way that asynchronous tasks can run too in background.
     */
    function mapWithBreaks(items, callback, loopReleaseInterval) {
        if (loopReleaseInterval === void 0) { loopReleaseInterval = 16; }
        return __awaiter(this, void 0, void 0, function () {
            var results, lastLoopReleaseTime, i, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = Array(items.length);
                        lastLoopReleaseTime = Date.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 4];
                        results[i] = callback(items[i], i);
                        now = Date.now();
                        if (!(now >= lastLoopReleaseTime + loopReleaseInterval)) return [3 /*break*/, 3];
                        lastLoopReleaseTime = now;
                        return [4 /*yield*/, releaseEventLoop()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    }
    /**
     * Makes the given promise never emit an unhandled promise rejection console warning.
     * The promise will still pass errors to the next promises.
     * Returns the input promise for convenience.
     *
     * Otherwise, promise emits a console warning unless it has a `catch` listener.
     */
    function suppressUnhandledRejectionWarning(promise) {
        promise.then(undefined, function () { return undefined; });
        return promise;
    }

    /*
     * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
     */
    /**
     * Does the same as Array.prototype.includes but has better typing
     */
    function includes(haystack, needle) {
        for (var i = 0, l = haystack.length; i < l; ++i) {
            if (haystack[i] === needle) {
                return true;
            }
        }
        return false;
    }
    /**
     * Like `!includes()` but with proper typing
     */
    function excludes(haystack, needle) {
        return !includes(haystack, needle);
    }
    /**
     * Be careful, NaN can return
     */
    function toInt(value) {
        return parseInt(value);
    }
    /**
     * Be careful, NaN can return
     */
    function toFloat(value) {
        return parseFloat(value);
    }
    function replaceNaN(value, replacement) {
        return typeof value === 'number' && isNaN(value) ? replacement : value;
    }
    function countTruthy(values) {
        return values.reduce(function (sum, value) { return sum + (value ? 1 : 0); }, 0);
    }
    function round(value, base) {
        if (base === void 0) { base = 1; }
        if (Math.abs(base) >= 1) {
            return Math.round(value / base) * base;
        }
        else {
            // Sometimes when a number is multiplied by a small number, precision is lost,
            // for example 1234 * 0.0001 === 0.12340000000000001, and it's more precise divide: 1234 / (1 / 0.0001) === 0.1234.
            var counterBase = 1 / base;
            return Math.round(value * counterBase) / counterBase;
        }
    }
    /**
     * Parses a CSS selector into tag name with HTML attributes.
     * Only single element selector are supported (without operators like space, +, >, etc).
     *
     * Multiple values can be returned for each attribute. You decide how to handle them.
     */
    function parseSimpleCssSelector(selector) {
        var _a, _b;
        var errorMessage = "Unexpected syntax '".concat(selector, "'");
        var tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
        var tag = tagMatch[1] || undefined;
        var attributes = {};
        var partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
        var addAttribute = function (name, value) {
            attributes[name] = attributes[name] || [];
            attributes[name].push(value);
        };
        for (;;) {
            var match = partsRegex.exec(tagMatch[2]);
            if (!match) {
                break;
            }
            var part = match[0];
            switch (part[0]) {
                case '.':
                    addAttribute('class', part.slice(1));
                    break;
                case '#':
                    addAttribute('id', part.slice(1));
                    break;
                case '[': {
                    var attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
                    if (attributeMatch) {
                        addAttribute(attributeMatch[1], (_b = (_a = attributeMatch[4]) !== null && _a !== void 0 ? _a : attributeMatch[5]) !== null && _b !== void 0 ? _b : '');
                    }
                    else {
                        throw new Error(errorMessage);
                    }
                    break;
                }
                default:
                    throw new Error(errorMessage);
            }
        }
        return [tag, attributes];
    }
    /**
     * Converts a string to UTF8 bytes
     */
    function getUTF8Bytes(input) {
        // Benchmark: https://jsbench.me/b6klaaxgwq/1
        // If you want to just count bytes, see solutions at https://jsbench.me/ehklab415e/1
        var result = new Uint8Array(input.length);
        for (var i = 0; i < input.length; i++) {
            // `charCode` is faster than encoding, so we prefer that when it's possible
            var charCode = input.charCodeAt(i);
            // In case of non-ASCII symbols we use proper encoding
            if (charCode > 127) {
                return new TextEncoder().encode(input);
            }
            result[i] = charCode;
        }
        return result;
    }

    /*
     * Based on https://github.com/karanlyons/murmurHash3.js/blob/a33d0723127e2e5415056c455f8aed2451ace208/murmurHash3.js
     */
    /**
     * Adds two 64-bit values (provided as tuples of 32-bit values)
     * and updates (mutates) first value to write the result
     */
    function x64Add(m, n) {
        var m0 = m[0] >>> 16, m1 = m[0] & 0xffff, m2 = m[1] >>> 16, m3 = m[1] & 0xffff;
        var n0 = n[0] >>> 16, n1 = n[0] & 0xffff, n2 = n[1] >>> 16, n3 = n[1] & 0xffff;
        var o0 = 0, o1 = 0, o2 = 0, o3 = 0;
        o3 += m3 + n3;
        o2 += o3 >>> 16;
        o3 &= 0xffff;
        o2 += m2 + n2;
        o1 += o2 >>> 16;
        o2 &= 0xffff;
        o1 += m1 + n1;
        o0 += o1 >>> 16;
        o1 &= 0xffff;
        o0 += m0 + n0;
        o0 &= 0xffff;
        m[0] = (o0 << 16) | o1;
        m[1] = (o2 << 16) | o3;
    }
    /**
     * Multiplies two 64-bit values (provided as tuples of 32-bit values)
     * and updates (mutates) first value to write the result
     */
    function x64Multiply(m, n) {
        var m0 = m[0] >>> 16, m1 = m[0] & 0xffff, m2 = m[1] >>> 16, m3 = m[1] & 0xffff;
        var n0 = n[0] >>> 16, n1 = n[0] & 0xffff, n2 = n[1] >>> 16, n3 = n[1] & 0xffff;
        var o0 = 0, o1 = 0, o2 = 0, o3 = 0;
        o3 += m3 * n3;
        o2 += o3 >>> 16;
        o3 &= 0xffff;
        o2 += m2 * n3;
        o1 += o2 >>> 16;
        o2 &= 0xffff;
        o2 += m3 * n2;
        o1 += o2 >>> 16;
        o2 &= 0xffff;
        o1 += m1 * n3;
        o0 += o1 >>> 16;
        o1 &= 0xffff;
        o1 += m2 * n2;
        o0 += o1 >>> 16;
        o1 &= 0xffff;
        o1 += m3 * n1;
        o0 += o1 >>> 16;
        o1 &= 0xffff;
        o0 += m0 * n3 + m1 * n2 + m2 * n1 + m3 * n0;
        o0 &= 0xffff;
        m[0] = (o0 << 16) | o1;
        m[1] = (o2 << 16) | o3;
    }
    /**
     * Provides left rotation of the given int64 value (provided as tuple of two int32)
     * by given number of bits. Result is written back to the value
     */
    function x64Rotl(m, bits) {
        var m0 = m[0];
        bits %= 64;
        if (bits === 32) {
            m[0] = m[1];
            m[1] = m0;
        }
        else if (bits < 32) {
            m[0] = (m0 << bits) | (m[1] >>> (32 - bits));
            m[1] = (m[1] << bits) | (m0 >>> (32 - bits));
        }
        else {
            bits -= 32;
            m[0] = (m[1] << bits) | (m0 >>> (32 - bits));
            m[1] = (m0 << bits) | (m[1] >>> (32 - bits));
        }
    }
    /**
     * Provides a left shift of the given int32 value (provided as tuple of [0, int32])
     * by given number of bits. Result is written back to the value
     */
    function x64LeftShift(m, bits) {
        bits %= 64;
        if (bits === 0) {
            return;
        }
        else if (bits < 32) {
            m[0] = m[1] >>> (32 - bits);
            m[1] = m[1] << bits;
        }
        else {
            m[0] = m[1] << (bits - 32);
            m[1] = 0;
        }
    }
    /**
     * Provides a XOR of the given int64 values(provided as tuple of two int32).
     * Result is written back to the first value
     */
    function x64Xor(m, n) {
        m[0] ^= n[0];
        m[1] ^= n[1];
    }
    var F1 = [0xff51afd7, 0xed558ccd];
    var F2 = [0xc4ceb9fe, 0x1a85ec53];
    /**
     * Calculates murmurHash3's final x64 mix of that block and writes result back to the input value.
     * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
     * only place where we need to right shift 64bit ints.)
     */
    function x64Fmix(h) {
        var shifted = [0, h[0] >>> 1];
        x64Xor(h, shifted);
        x64Multiply(h, F1);
        shifted[1] = h[0] >>> 1;
        x64Xor(h, shifted);
        x64Multiply(h, F2);
        shifted[1] = h[0] >>> 1;
        x64Xor(h, shifted);
    }
    var C1 = [0x87c37b91, 0x114253d5];
    var C2 = [0x4cf5ad43, 0x2745937f];
    var M$1 = [0, 5];
    var N1 = [0, 0x52dce729];
    var N2 = [0, 0x38495ab5];
    /**
     * Given a string and an optional seed as an int, returns a 128 bit
     * hash using the x64 flavor of MurmurHash3, as an unsigned hex.
     * All internal functions mutates passed value to achieve minimal memory allocations and GC load
     *
     * Benchmark https://jsbench.me/p4lkpaoabi/1
     */
    function x64hash128(input, seed) {
        var key = getUTF8Bytes(input);
        seed = seed || 0;
        var length = [0, key.length];
        var remainder = length[1] % 16;
        var bytes = length[1] - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var i;
        for (i = 0; i < bytes; i = i + 16) {
            k1[0] = key[i + 4] | (key[i + 5] << 8) | (key[i + 6] << 16) | (key[i + 7] << 24);
            k1[1] = key[i] | (key[i + 1] << 8) | (key[i + 2] << 16) | (key[i + 3] << 24);
            k2[0] = key[i + 12] | (key[i + 13] << 8) | (key[i + 14] << 16) | (key[i + 15] << 24);
            k2[1] = key[i + 8] | (key[i + 9] << 8) | (key[i + 10] << 16) | (key[i + 11] << 24);
            x64Multiply(k1, C1);
            x64Rotl(k1, 31);
            x64Multiply(k1, C2);
            x64Xor(h1, k1);
            x64Rotl(h1, 27);
            x64Add(h1, h2);
            x64Multiply(h1, M$1);
            x64Add(h1, N1);
            x64Multiply(k2, C2);
            x64Rotl(k2, 33);
            x64Multiply(k2, C1);
            x64Xor(h2, k2);
            x64Rotl(h2, 31);
            x64Add(h2, h1);
            x64Multiply(h2, M$1);
            x64Add(h2, N2);
        }
        k1[0] = 0;
        k1[1] = 0;
        k2[0] = 0;
        k2[1] = 0;
        var val = [0, 0];
        switch (remainder) {
            case 15:
                val[1] = key[i + 14];
                x64LeftShift(val, 48);
                x64Xor(k2, val);
            // fallthrough
            case 14:
                val[1] = key[i + 13];
                x64LeftShift(val, 40);
                x64Xor(k2, val);
            // fallthrough
            case 13:
                val[1] = key[i + 12];
                x64LeftShift(val, 32);
                x64Xor(k2, val);
            // fallthrough
            case 12:
                val[1] = key[i + 11];
                x64LeftShift(val, 24);
                x64Xor(k2, val);
            // fallthrough
            case 11:
                val[1] = key[i + 10];
                x64LeftShift(val, 16);
                x64Xor(k2, val);
            // fallthrough
            case 10:
                val[1] = key[i + 9];
                x64LeftShift(val, 8);
                x64Xor(k2, val);
            // fallthrough
            case 9:
                val[1] = key[i + 8];
                x64Xor(k2, val);
                x64Multiply(k2, C2);
                x64Rotl(k2, 33);
                x64Multiply(k2, C1);
                x64Xor(h2, k2);
            // fallthrough
            case 8:
                val[1] = key[i + 7];
                x64LeftShift(val, 56);
                x64Xor(k1, val);
            // fallthrough
            case 7:
                val[1] = key[i + 6];
                x64LeftShift(val, 48);
                x64Xor(k1, val);
            // fallthrough
            case 6:
                val[1] = key[i + 5];
                x64LeftShift(val, 40);
                x64Xor(k1, val);
            // fallthrough
            case 5:
                val[1] = key[i + 4];
                x64LeftShift(val, 32);
                x64Xor(k1, val);
            // fallthrough
            case 4:
                val[1] = key[i + 3];
                x64LeftShift(val, 24);
                x64Xor(k1, val);
            // fallthrough
            case 3:
                val[1] = key[i + 2];
                x64LeftShift(val, 16);
                x64Xor(k1, val);
            // fallthrough
            case 2:
                val[1] = key[i + 1];
                x64LeftShift(val, 8);
                x64Xor(k1, val);
            // fallthrough
            case 1:
                val[1] = key[i];
                x64Xor(k1, val);
                x64Multiply(k1, C1);
                x64Rotl(k1, 31);
                x64Multiply(k1, C2);
                x64Xor(h1, k1);
            // fallthrough
        }
        x64Xor(h1, length);
        x64Xor(h2, length);
        x64Add(h1, h2);
        x64Add(h2, h1);
        x64Fmix(h1);
        x64Fmix(h2);
        x64Add(h1, h2);
        x64Add(h2, h1);
        return (('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) +
            ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) +
            ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) +
            ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8));
    }

    /**
     * Converts an error object to a plain object that can be used with `JSON.stringify`.
     * If you just run `JSON.stringify(error)`, you'll get `'{}'`.
     */
    function errorToObject(error) {
        var _a;
        return __assign({ name: error.name, message: error.message, stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n') }, error);
    }
    function isFunctionNative(func) {
        return /^function\s.*?\{\s*\[native code]\s*}$/.test(String(func));
    }

    function isFinalResultLoaded(loadResult) {
        return typeof loadResult !== 'function';
    }
    /**
     * Loads the given entropy source. Returns a function that gets an entropy component from the source.
     *
     * The result is returned synchronously to prevent `loadSources` from
     * waiting for one source to load before getting the components from the other sources.
     */
    function loadSource(source, sourceOptions) {
        var sourceLoadPromise = suppressUnhandledRejectionWarning(new Promise(function (resolveLoad) {
            var loadStartTime = Date.now();
            // `awaitIfAsync` is used instead of just `await` in order to measure the duration of synchronous sources
            // correctly (other microtasks won't affect the duration).
            awaitIfAsync(source.bind(null, sourceOptions), function () {
                var loadArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    loadArgs[_i] = arguments[_i];
                }
                var loadDuration = Date.now() - loadStartTime;
                // Source loading failed
                if (!loadArgs[0]) {
                    return resolveLoad(function () { return ({ error: loadArgs[1], duration: loadDuration }); });
                }
                var loadResult = loadArgs[1];
                // Source loaded with the final result
                if (isFinalResultLoaded(loadResult)) {
                    return resolveLoad(function () { return ({ value: loadResult, duration: loadDuration }); });
                }
                // Source loaded with "get" stage
                resolveLoad(function () {
                    return new Promise(function (resolveGet) {
                        var getStartTime = Date.now();
                        awaitIfAsync(loadResult, function () {
                            var getArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                getArgs[_i] = arguments[_i];
                            }
                            var duration = loadDuration + Date.now() - getStartTime;
                            // Source getting failed
                            if (!getArgs[0]) {
                                return resolveGet({ error: getArgs[1], duration: duration });
                            }
                            // Source getting succeeded
                            resolveGet({ value: getArgs[1], duration: duration });
                        });
                    });
                });
            });
        }));
        return function getComponent() {
            return sourceLoadPromise.then(function (finalizeSource) { return finalizeSource(); });
        };
    }
    /**
     * Loads the given entropy sources. Returns a function that collects the entropy components.
     *
     * The result is returned synchronously in order to allow start getting the components
     * before the sources are loaded completely.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function loadSources(sources, sourceOptions, excludeSources, loopReleaseInterval) {
        var includedSources = Object.keys(sources).filter(function (sourceKey) { return excludes(excludeSources, sourceKey); });
        // Using `mapWithBreaks` allows asynchronous sources to complete between synchronous sources
        // and measure the duration correctly
        var sourceGettersPromise = suppressUnhandledRejectionWarning(mapWithBreaks(includedSources, function (sourceKey) { return loadSource(sources[sourceKey], sourceOptions); }, loopReleaseInterval));
        return function getComponents() {
            return __awaiter(this, void 0, void 0, function () {
                var sourceGetters, componentPromises, componentArray, components, index;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sourceGettersPromise];
                        case 1:
                            sourceGetters = _a.sent();
                            return [4 /*yield*/, mapWithBreaks(sourceGetters, function (sourceGetter) { return suppressUnhandledRejectionWarning(sourceGetter()); }, loopReleaseInterval)];
                        case 2:
                            componentPromises = _a.sent();
                            return [4 /*yield*/, Promise.all(componentPromises)
                                // Keeping the component keys order the same as the source keys order
                            ];
                        case 3:
                            componentArray = _a.sent();
                            components = {};
                            for (index = 0; index < includedSources.length; ++index) {
                                components[includedSources[index]] = componentArray[index];
                            }
                            return [2 /*return*/, components];
                    }
                });
            });
        };
    }
    /**
     * Modifies an entropy source by transforming its returned value with the given function.
     * Keeps the source properties: sync/async, 1/2 stages.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function transformSource(source, transformValue) {
        var transformLoadResult = function (loadResult) {
            if (isFinalResultLoaded(loadResult)) {
                return transformValue(loadResult);
            }
            return function () {
                var getResult = loadResult();
                if (isPromise(getResult)) {
                    return getResult.then(transformValue);
                }
                return transformValue(getResult);
            };
        };
        return function (options) {
            var loadResult = source(options);
            if (isPromise(loadResult)) {
                return loadResult.then(transformLoadResult);
            }
            return transformLoadResult(loadResult);
        };
    }

    /*
     * Functions to help with features that vary through browsers
     */
    /**
     * Checks whether the browser is based on Trident (the Internet Explorer engine) without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isTrident() {
        var w = window;
        var n = navigator;
        // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
        return (countTruthy([
            'MSCSSMatrix' in w,
            'msSetImmediate' in w,
            'msIndexedDB' in w,
            'msMaxTouchPoints' in n,
            'msPointerEnabled' in n,
        ]) >= 4);
    }
    /**
     * Checks whether the browser is based on EdgeHTML (the pre-Chromium Edge engine) without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isEdgeHTML() {
        // Based on research in October 2020
        var w = window;
        var n = navigator;
        return (countTruthy(['msWriteProfilerMark' in w, 'MSStream' in w, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 3 &&
            !isTrident());
    }
    /**
     * Checks whether the browser is based on Chromium without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isChromium() {
        // Based on research in October 2020. Tested to detect Chromium 42-86.
        var w = window;
        var n = navigator;
        return (countTruthy([
            'webkitPersistentStorage' in n,
            'webkitTemporaryStorage' in n,
            (n.vendor || '').indexOf('Google') === 0,
            'webkitResolveLocalFileSystemURL' in w,
            'BatteryManager' in w,
            'webkitMediaStream' in w,
            'webkitSpeechGrammar' in w,
        ]) >= 5);
    }
    /**
     * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
     * All iOS browsers use WebKit (the Safari engine).
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isWebKit() {
        // Based on research in August 2024
        var w = window;
        var n = navigator;
        return (countTruthy([
            'ApplePayError' in w,
            'CSSPrimitiveValue' in w,
            'Counter' in w,
            n.vendor.indexOf('Apple') === 0,
            'RGBColor' in w,
            'WebKitMediaKeys' in w,
        ]) >= 4);
    }
    /**
     * Checks whether this WebKit browser is a desktop browser.
     * It doesn't check that the browser is based on WebKit, there is a separate function for this.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isDesktopWebKit() {
        // Checked in Safari and DuckDuckGo
        var w = window;
        var HTMLElement = w.HTMLElement, Document = w.Document;
        return (countTruthy([
            'safari' in w,
            !('ongestureend' in w),
            !('TouchEvent' in w),
            !('orientation' in w),
            HTMLElement && !('autocapitalize' in HTMLElement.prototype),
            Document && 'pointerLockElement' in Document.prototype,
        ]) >= 4);
    }
    /**
     * Checks whether this WebKit browser is Safari.
     * It doesn't check that the browser is based on WebKit, there is a separate function for this.
     *
     * Warning! The function works properly only for Safari version 15.4 and newer.
     */
    function isSafariWebKit() {
        // Checked in Safari, Chrome, Firefox, Yandex, UC Browser, Opera, Edge and DuckDuckGo.
        // iOS Safari and Chrome were checked on iOS 11-18. DuckDuckGo was checked on iOS 17-18 and macOS 14-15.
        // Desktop Safari versions 12-18 were checked.
        // The other browsers were checked on iOS 17 and 18; there was no chance to check them on the other OS versions.
        var w = window;
        return (
        // Filters-out Chrome, Yandex, DuckDuckGo (macOS and iOS), Edge
        isFunctionNative(w.print) &&
            // Doesn't work in Safari < 15.4
            String(w.browser) === '[object WebPageNamespace]');
    }
    /**
     * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isGecko() {
        var _a, _b;
        var w = window;
        // Based on research in September 2020
        return (countTruthy([
            'buildID' in navigator,
            'MozAppearance' in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
            'onmozfullscreenchange' in w,
            'mozInnerScreenX' in w,
            'CSSMozDocumentRule' in w,
            'CanvasCaptureMediaStream' in w,
        ]) >= 4);
    }
    /**
     * Checks whether the browser is based on Chromium version ≥86 without using user-agent.
     * It doesn't check that the browser is based on Chromium, there is a separate function for this.
     */
    function isChromium86OrNewer() {
        // Checked in Chrome 85 vs Chrome 86 both on desktop and Android. Checked in macOS Chrome 128, Android Chrome 127.
        var w = window;
        return (countTruthy([
            !('MediaSettingsRange' in w),
            'RTCEncodedAudioFrame' in w,
            '' + w.Intl === '[object Intl]',
            '' + w.Reflect === '[object Reflect]',
        ]) >= 3);
    }
    /**
     * Checks whether the browser is based on Chromium version ≥122 without using user-agent.
     * It doesn't check that the browser is based on Chromium, there is a separate function for this.
     */
    function isChromium122OrNewer() {
        // Checked in Chrome 121 vs Chrome 122 and 129 both on desktop and Android
        var w = window;
        var URLPattern = w.URLPattern;
        return (countTruthy([
            'union' in Set.prototype,
            'Iterator' in w,
            URLPattern && 'hasRegExpGroups' in URLPattern.prototype,
            'RGB8' in WebGLRenderingContext.prototype,
        ]) >= 3);
    }
    /**
     * Checks whether the browser is based on WebKit version ≥606 (Safari ≥12) without using user-agent.
     * It doesn't check that the browser is based on WebKit, there is a separate function for this.
     *
     * @see https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
     */
    function isWebKit606OrNewer() {
        // Checked in Safari 9–18
        var w = window;
        return (countTruthy([
            'DOMRectList' in w,
            'RTCPeerConnectionIceEvent' in w,
            'SVGGeometryElement' in w,
            'ontransitioncancel' in w,
        ]) >= 3);
    }
    /**
     * Checks whether the browser is based on WebKit version ≥616 (Safari ≥17) without using user-agent.
     * It doesn't check that the browser is based on WebKit, there is a separate function for this.
     *
     * @see https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes Safari 17 release notes
     * @see https://tauri.app/v1/references/webview-versions/#webkit-versions-in-safari Safari-WebKit versions map
     */
    function isWebKit616OrNewer() {
        var w = window;
        var n = navigator;
        var CSS = w.CSS, HTMLButtonElement = w.HTMLButtonElement;
        return (countTruthy([
            !('getStorageUpdates' in n),
            HTMLButtonElement && 'popover' in HTMLButtonElement.prototype,
            'CSSCounterStyleRule' in w,
            CSS.supports('font-size-adjust: ex-height 0.5'),
            CSS.supports('text-transform: full-width'),
        ]) >= 4);
    }
    /**
     * Checks whether the device is an iPad.
     * It doesn't check that the engine is WebKit and that the WebKit isn't desktop.
     */
    function isIPad() {
        // Checked on:
        // Safari on iPadOS (both mobile and desktop modes): 8, 11-18
        // Chrome on iPadOS (both mobile and desktop modes): 11-18
        // Safari on iOS (both mobile and desktop modes): 9-18
        // Chrome on iOS (both mobile and desktop modes): 9-18
        // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
        if (navigator.platform === 'iPad') {
            return true;
        }
        var s = screen;
        var screenRatio = s.width / s.height;
        return (countTruthy([
            // Since iOS 13. Doesn't work in Chrome on iPadOS <15, but works in desktop mode.
            'MediaSource' in window,
            // Since iOS 12. Doesn't work in Chrome on iPadOS.
            !!Element.prototype.webkitRequestFullscreen,
            // iPhone 4S that runs iOS 9 matches this, but it is not supported
            // Doesn't work in incognito mode of Safari ≥17 with split screen because of tracking prevention
            screenRatio > 0.65 && screenRatio < 1.53,
        ]) >= 2);
    }
    /**
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function getFullscreenElement() {
        var d = document;
        return d.fullscreenElement || d.msFullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement || null;
    }
    function exitFullscreen() {
        var d = document;
        // `call` is required because the function throws an error without a proper "this" context
        return (d.exitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen).call(d);
    }
    /**
     * Checks whether the device runs on Android without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isAndroid() {
        var isItChromium = isChromium();
        var isItGecko = isGecko();
        var w = window;
        var n = navigator;
        var c = 'connection';
        // Chrome removes all words "Android" from `navigator` when desktop version is requested
        // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
        if (isItChromium) {
            return (countTruthy([
                !('SharedWorker' in w),
                // `typechange` is deprecated, but it's still present on Android (tested on Chrome Mobile 117)
                // Removal proposal https://bugs.chromium.org/p/chromium/issues/detail?id=699892
                // Note: this expression returns true on ChromeOS, so additional detectors are required to avoid false-positives
                n[c] && 'ontypechange' in n[c],
                !('sinkId' in new Audio()),
            ]) >= 2);
        }
        else if (isItGecko) {
            return countTruthy(['onorientationchange' in w, 'orientation' in w, /android/i.test(n.appVersion)]) >= 2;
        }
        else {
            // Only 2 browser engines are presented on Android.
            // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
            return false;
        }
    }
    /**
     * Checks whether the browser is Samsung Internet without using user-agent.
     * It doesn't check that the browser is based on Chromium, please use `isChromium` before using this function.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isSamsungInternet() {
        // Checked in Samsung Internet 21, 25 and 27
        var n = navigator;
        var w = window;
        var audioPrototype = Audio.prototype;
        var visualViewport = w.visualViewport;
        return (countTruthy([
            'srLatency' in audioPrototype,
            'srChannelCount' in audioPrototype,
            'devicePosture' in n,
            visualViewport && 'segments' in visualViewport,
            'getTextInformation' in Image.prototype, // Not available in Samsung Internet 21
        ]) >= 3);
    }

    /**
     * A deep description: https://fingerprint.com/blog/audio-fingerprinting/
     * Inspired by and based on https://github.com/cozylife/audio-fingerprint
     *
     * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
     * Audio signal is noised in private mode of Safari 17, so audio fingerprinting is skipped in Safari 17.
     */
    function getAudioFingerprint() {
        if (doesBrowserPerformAntifingerprinting$1()) {
            return -4 /* SpecialFingerprint.KnownForAntifingerprinting */;
        }
        return getUnstableAudioFingerprint();
    }
    /**
     * A version of the entropy source without stabilization.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function getUnstableAudioFingerprint() {
        var w = window;
        var AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext;
        if (!AudioContext) {
            return -2 /* SpecialFingerprint.NotSupported */;
        }
        // In some browsers, audio context always stays suspended unless the context is started in response to a user action
        // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
        // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
        // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
        if (doesBrowserSuspendAudioContext()) {
            return -1 /* SpecialFingerprint.KnownForSuspending */;
        }
        var hashFromIndex = 4500;
        var hashToIndex = 5000;
        var context = new AudioContext(1, hashToIndex, 44100);
        var oscillator = context.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.value = 10000;
        var compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -50;
        compressor.knee.value = 40;
        compressor.ratio.value = 12;
        compressor.attack.value = 0;
        compressor.release.value = 0.25;
        oscillator.connect(compressor);
        compressor.connect(context.destination);
        oscillator.start(0);
        var _a = startRenderingAudio(context), renderPromise = _a[0], finishRendering = _a[1];
        // Suppresses the console error message in case when the fingerprint fails before requested
        var fingerprintPromise = suppressUnhandledRejectionWarning(renderPromise.then(function (buffer) { return getHash(buffer.getChannelData(0).subarray(hashFromIndex)); }, function (error) {
            if (error.name === "timeout" /* InnerErrorName.Timeout */ || error.name === "suspended" /* InnerErrorName.Suspended */) {
                return -3 /* SpecialFingerprint.Timeout */;
            }
            throw error;
        }));
        return function () {
            finishRendering();
            return fingerprintPromise;
        };
    }
    /**
     * Checks if the current browser is known for always suspending audio context
     */
    function doesBrowserSuspendAudioContext() {
        // Mobile Safari 11 and older
        return isWebKit() && !isDesktopWebKit() && !isWebKit606OrNewer();
    }
    /**
     * Checks if the current browser is known for applying anti-fingerprinting measures in all or some critical modes
     */
    function doesBrowserPerformAntifingerprinting$1() {
        return (
        // Safari ≥17
        (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) ||
            // Samsung Internet ≥26
            (isChromium() && isSamsungInternet() && isChromium122OrNewer()));
    }
    /**
     * Starts rendering the audio context.
     * When the returned function is called, the render process starts finishing.
     */
    function startRenderingAudio(context) {
        var renderTryMaxCount = 3;
        var renderRetryDelay = 500;
        var runningMaxAwaitTime = 500;
        var runningSufficientTime = 5000;
        var finalize = function () { return undefined; };
        var resultPromise = new Promise(function (resolve, reject) {
            var isFinalized = false;
            var renderTryCount = 0;
            var startedRunningAt = 0;
            context.oncomplete = function (event) { return resolve(event.renderedBuffer); };
            var startRunningTimeout = function () {
                setTimeout(function () { return reject(makeInnerError("timeout" /* InnerErrorName.Timeout */)); }, Math.min(runningMaxAwaitTime, startedRunningAt + runningSufficientTime - Date.now()));
            };
            var tryRender = function () {
                try {
                    var renderingPromise = context.startRendering();
                    // `context.startRendering` has two APIs: Promise and callback, we check that it's really a promise just in case
                    if (isPromise(renderingPromise)) {
                        // Suppresses all unhandled rejections in case of scheduled redundant retries after successful rendering
                        suppressUnhandledRejectionWarning(renderingPromise);
                    }
                    switch (context.state) {
                        case 'running':
                            startedRunningAt = Date.now();
                            if (isFinalized) {
                                startRunningTimeout();
                            }
                            break;
                        // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
                        // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
                        // background on iPhone. Retries usually help in this case.
                        case 'suspended':
                            // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
                            // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
                            // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
                            // can be suspended when `document.hidden === false` and start running after a retry.
                            if (!document.hidden) {
                                renderTryCount++;
                            }
                            if (isFinalized && renderTryCount >= renderTryMaxCount) {
                                reject(makeInnerError("suspended" /* InnerErrorName.Suspended */));
                            }
                            else {
                                setTimeout(tryRender, renderRetryDelay);
                            }
                            break;
                    }
                }
                catch (error) {
                    reject(error);
                }
            };
            tryRender();
            finalize = function () {
                if (!isFinalized) {
                    isFinalized = true;
                    if (startedRunningAt > 0) {
                        startRunningTimeout();
                    }
                }
            };
        });
        return [resultPromise, finalize];
    }
    function getHash(signal) {
        var hash = 0;
        for (var i = 0; i < signal.length; ++i) {
            hash += Math.abs(signal[i]);
        }
        return hash;
    }
    function makeInnerError(name) {
        var error = new Error(name);
        error.name = name;
        return error;
    }

    /**
     * Creates and keeps an invisible iframe while the given function runs.
     * The given function is called when the iframe is loaded and has a body.
     * The iframe allows to measure DOM sizes inside itself.
     *
     * Notice: passing an initial HTML code doesn't work in IE.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function withIframe(action, initialHtml, domPollInterval) {
        var _a, _b, _c;
        if (domPollInterval === void 0) { domPollInterval = 50; }
        return __awaiter(this, void 0, void 0, function () {
            var d, iframe;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        d = document;
                        _d.label = 1;
                    case 1:
                        if (!!d.body) return [3 /*break*/, 3];
                        return [4 /*yield*/, wait(domPollInterval)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        iframe = d.createElement('iframe');
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, , 10, 11]);
                        return [4 /*yield*/, new Promise(function (_resolve, _reject) {
                                var isComplete = false;
                                var resolve = function () {
                                    isComplete = true;
                                    _resolve();
                                };
                                var reject = function (error) {
                                    isComplete = true;
                                    _reject(error);
                                };
                                iframe.onload = resolve;
                                iframe.onerror = reject;
                                var style = iframe.style;
                                style.setProperty('display', 'block', 'important'); // Required for browsers to calculate the layout
                                style.position = 'absolute';
                                style.top = '0';
                                style.left = '0';
                                style.visibility = 'hidden';
                                if (initialHtml && 'srcdoc' in iframe) {
                                    iframe.srcdoc = initialHtml;
                                }
                                else {
                                    iframe.src = 'about:blank';
                                }
                                d.body.appendChild(iframe);
                                // WebKit in WeChat doesn't fire the iframe's `onload` for some reason.
                                // This code checks for the loading state manually.
                                // See https://github.com/fingerprintjs/fingerprintjs/issues/645
                                var checkReadyState = function () {
                                    var _a, _b;
                                    // The ready state may never become 'complete' in Firefox despite the 'load' event being fired.
                                    // So an infinite setTimeout loop can happen without this check.
                                    // See https://github.com/fingerprintjs/fingerprintjs/pull/716#issuecomment-986898796
                                    if (isComplete) {
                                        return;
                                    }
                                    // Make sure iframe.contentWindow and iframe.contentWindow.document are both loaded
                                    // The contentWindow.document can miss in JSDOM (https://github.com/jsdom/jsdom).
                                    if (((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.readyState) === 'complete') {
                                        resolve();
                                    }
                                    else {
                                        setTimeout(checkReadyState, 10);
                                    }
                                };
                                checkReadyState();
                            })];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        if (!!((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body)) return [3 /*break*/, 8];
                        return [4 /*yield*/, wait(domPollInterval)];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 8: return [4 /*yield*/, action(iframe, iframe.contentWindow)];
                    case 9: return [2 /*return*/, _d.sent()];
                    case 10:
                        (_c = iframe.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(iframe);
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Creates a DOM element that matches the given selector.
     * Only single element selector are supported (without operators like space, +, >, etc).
     */
    function selectorToElement(selector) {
        var _a = parseSimpleCssSelector(selector), tag = _a[0], attributes = _a[1];
        var element = document.createElement(tag !== null && tag !== void 0 ? tag : 'div');
        for (var _i = 0, _b = Object.keys(attributes); _i < _b.length; _i++) {
            var name_1 = _b[_i];
            var value = attributes[name_1].join(' ');
            // Changing the `style` attribute can cause a CSP error, therefore we change the `style.cssText` property.
            // https://github.com/fingerprintjs/fingerprintjs/issues/733
            if (name_1 === 'style') {
                addStyleString(element.style, value);
            }
            else {
                element.setAttribute(name_1, value);
            }
        }
        return element;
    }
    /**
     * Adds CSS styles from a string in such a way that doesn't trigger a CSP warning (unsafe-inline or unsafe-eval)
     */
    function addStyleString(style, source) {
        // We don't use `style.cssText` because browsers must block it when no `unsafe-eval` CSP is presented: https://csplite.com/csp145/#w3c_note
        // Even though the browsers ignore this standard, we don't use `cssText` just in case.
        for (var _i = 0, _a = source.split(';'); _i < _a.length; _i++) {
            var property = _a[_i];
            var match = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property);
            if (match) {
                var name_2 = match[1], value = match[2], priority = match[4];
                style.setProperty(name_2, value, priority || ''); // The last argument can't be undefined in IE11
            }
        }
    }
    /**
     * Returns true if the code runs in an iframe, and any parent page's origin doesn't match the current origin
     */
    function isAnyParentCrossOrigin() {
        var currentWindow = window;
        for (;;) {
            var parentWindow = currentWindow.parent;
            if (!parentWindow || parentWindow === currentWindow) {
                return false; // The top page is reached
            }
            try {
                if (parentWindow.location.origin !== currentWindow.location.origin) {
                    return true;
                }
            }
            catch (error) {
                // The error is thrown when `origin` is accessed on `parentWindow.location` when the parent is cross-origin
                if (error instanceof Error && error.name === 'SecurityError') {
                    return true;
                }
                throw error;
            }
            currentWindow = parentWindow;
        }
    }

    // We use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated.
    var testString = 'mmMwWLliI0O&1';
    // We test using 48px font size, we may use any size. I guess larger the better.
    var textSize = '48px';
    // A font will be compared against all the three default fonts.
    // And if for any default fonts it doesn't match, then that font is available.
    var baseFonts = ['monospace', 'sans-serif', 'serif'];
    var fontList = [
        // This is android-specific font from "Roboto" family
        'sans-serif-thin',
        'ARNO PRO',
        'Agency FB',
        'Arabic Typesetting',
        'Arial Unicode MS',
        'AvantGarde Bk BT',
        'BankGothic Md BT',
        'Batang',
        'Bitstream Vera Sans Mono',
        'Calibri',
        'Century',
        'Century Gothic',
        'Clarendon',
        'EUROSTILE',
        'Franklin Gothic',
        'Futura Bk BT',
        'Futura Md BT',
        'GOTHAM',
        'Gill Sans',
        'HELV',
        'Haettenschweiler',
        'Helvetica Neue',
        'Humanst521 BT',
        'Leelawadee',
        'Letter Gothic',
        'Levenim MT',
        'Lucida Bright',
        'Lucida Sans',
        'Menlo',
        'MS Mincho',
        'MS Outlook',
        'MS Reference Specialty',
        'MS UI Gothic',
        'MT Extra',
        'MYRIAD PRO',
        'Marlett',
        'Meiryo UI',
        'Microsoft Uighur',
        'Minion Pro',
        'Monotype Corsiva',
        'PMingLiU',
        'Pristina',
        'SCRIPTINA',
        'Segoe UI Light',
        'Serifa',
        'SimHei',
        'Small Fonts',
        'Staccato222 BT',
        'TRAJAN PRO',
        'Univers CE 55 Medium',
        'Vrinda',
        'ZWAdobeF',
    ];
    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
    function getFonts() {
        var _this = this;
        // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
        // https://github.com/fingerprintjs/fingerprintjs/issues/592
        // https://github.com/fingerprintjs/fingerprintjs/issues/628
        return withIframe(function (_, _a) {
            var document = _a.document;
            return __awaiter(_this, void 0, void 0, function () {
                var holder, spansContainer, defaultWidth, defaultHeight, createSpan, createSpanWithFonts, initializeBaseFontsSpans, initializeFontsSpans, isFontAvailable, baseFontsSpans, fontsSpans, index;
                return __generator(this, function (_b) {
                    holder = document.body;
                    holder.style.fontSize = textSize;
                    spansContainer = document.createElement('div');
                    spansContainer.style.setProperty('visibility', 'hidden', 'important');
                    defaultWidth = {};
                    defaultHeight = {};
                    createSpan = function (fontFamily) {
                        var span = document.createElement('span');
                        var style = span.style;
                        style.position = 'absolute';
                        style.top = '0';
                        style.left = '0';
                        style.fontFamily = fontFamily;
                        span.textContent = testString;
                        spansContainer.appendChild(span);
                        return span;
                    };
                    createSpanWithFonts = function (fontToDetect, baseFont) {
                        return createSpan("'".concat(fontToDetect, "',").concat(baseFont));
                    };
                    initializeBaseFontsSpans = function () {
                        return baseFonts.map(createSpan);
                    };
                    initializeFontsSpans = function () {
                        // Stores {fontName : [spans for that font]}
                        var spans = {};
                        var _loop_1 = function (font) {
                            spans[font] = baseFonts.map(function (baseFont) { return createSpanWithFonts(font, baseFont); });
                        };
                        for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
                            var font = fontList_1[_i];
                            _loop_1(font);
                        }
                        return spans;
                    };
                    isFontAvailable = function (fontSpans) {
                        return baseFonts.some(function (baseFont, baseFontIndex) {
                            return fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
                                fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont];
                        });
                    };
                    baseFontsSpans = initializeBaseFontsSpans();
                    fontsSpans = initializeFontsSpans();
                    // add all the spans to the DOM
                    holder.appendChild(spansContainer);
                    // get the default width for the three base fonts
                    for (index = 0; index < baseFonts.length; index++) {
                        defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
                        defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
                    }
                    // check available fonts
                    return [2 /*return*/, fontList.filter(function (font) { return isFontAvailable(fontsSpans[font]); })];
                });
            });
        });
    }

    function getPlugins() {
        var rawPlugins = navigator.plugins;
        if (!rawPlugins) {
            return undefined;
        }
        var plugins = [];
        // Safari 10 doesn't support iterating navigator.plugins with for...of
        for (var i = 0; i < rawPlugins.length; ++i) {
            var plugin = rawPlugins[i];
            if (!plugin) {
                continue;
            }
            var mimeTypes = [];
            for (var j = 0; j < plugin.length; ++j) {
                var mimeType = plugin[j];
                mimeTypes.push({
                    type: mimeType.type,
                    suffixes: mimeType.suffixes,
                });
            }
            plugins.push({
                name: plugin.name,
                description: plugin.description,
                mimeTypes: mimeTypes,
            });
        }
        return plugins;
    }

    /**
     * @see https://www.browserleaks.com/canvas#how-does-it-work
     *
     * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
     * Canvas image is noised in private mode of Safari 17, so image rendering is skipped in Safari 17.
     */
    function getCanvasFingerprint() {
        return getUnstableCanvasFingerprint(doesBrowserPerformAntifingerprinting());
    }
    /**
     * A version of the entropy source without stabilization.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function getUnstableCanvasFingerprint(skipImages) {
        var _a;
        var winding = false;
        var geometry;
        var text;
        var _b = makeCanvasContext(), canvas = _b[0], context = _b[1];
        if (!isSupported(canvas, context)) {
            geometry = text = "unsupported" /* ImageStatus.Unsupported */;
        }
        else {
            winding = doesSupportWinding(context);
            if (skipImages) {
                geometry = text = "skipped" /* ImageStatus.Skipped */;
            }
            else {
                _a = renderImages(canvas, context), geometry = _a[0], text = _a[1];
            }
        }
        return { winding: winding, geometry: geometry, text: text };
    }
    function makeCanvasContext() {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return [canvas, canvas.getContext('2d')];
    }
    function isSupported(canvas, context) {
        return !!(context && canvas.toDataURL);
    }
    function doesSupportWinding(context) {
        // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
        context.rect(0, 0, 10, 10);
        context.rect(2, 2, 6, 6);
        return !context.isPointInPath(5, 5, 'evenodd');
    }
    function renderImages(canvas, context) {
        renderTextImage(canvas, context);
        var textImage1 = canvasToString(canvas);
        var textImage2 = canvasToString(canvas); // It's slightly faster to double-encode the text image
        // Some browsers add a noise to the canvas: https://github.com/fingerprintjs/fingerprintjs/issues/791
        // The canvas is excluded from the fingerprint in this case
        if (textImage1 !== textImage2) {
            return ["unstable" /* ImageStatus.Unstable */, "unstable" /* ImageStatus.Unstable */];
        }
        // Text is unstable:
        // https://github.com/fingerprintjs/fingerprintjs/issues/583
        // https://github.com/fingerprintjs/fingerprintjs/issues/103
        // Therefore it's extracted into a separate image.
        renderGeometryImage(canvas, context);
        var geometryImage = canvasToString(canvas);
        return [geometryImage, textImage1];
    }
    function renderTextImage(canvas, context) {
        // Resizing the canvas cleans it
        canvas.width = 240;
        canvas.height = 60;
        context.textBaseline = 'alphabetic';
        context.fillStyle = '#f60';
        context.fillRect(100, 1, 62, 20);
        context.fillStyle = '#069';
        // It's important to use explicit built-in fonts in order to exclude the affect of font preferences
        // (there is a separate entropy source for them).
        context.font = '11pt "Times New Roman"';
        // The choice of emojis has a gigantic impact on rendering performance (especially in FF).
        // Some newer emojis cause it to slow down 50-200 times.
        // There must be no text to the right of the emoji, see https://github.com/fingerprintjs/fingerprintjs/issues/574
        // A bare emoji shouldn't be used because the canvas will change depending on the script encoding:
        // https://github.com/fingerprintjs/fingerprintjs/issues/66
        // Escape sequence shouldn't be used too because Terser will turn it into a bare unicode.
        var printedText = "Cwm fjordbank gly ".concat(String.fromCharCode(55357, 56835) /* 😃 */);
        context.fillText(printedText, 2, 15);
        context.fillStyle = 'rgba(102, 204, 0, 0.2)';
        context.font = '18pt Arial';
        context.fillText(printedText, 4, 45);
    }
    function renderGeometryImage(canvas, context) {
        // Resizing the canvas cleans it
        canvas.width = 122;
        canvas.height = 110;
        // Canvas blending
        // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
        // http://jsfiddle.net/NDYV8/16/
        context.globalCompositeOperation = 'multiply';
        for (var _i = 0, _a = [
            ['#f2f', 40, 40],
            ['#2ff', 80, 40],
            ['#ff2', 60, 80],
        ]; _i < _a.length; _i++) {
            var _b = _a[_i], color = _b[0], x = _b[1], y = _b[2];
            context.fillStyle = color;
            context.beginPath();
            context.arc(x, y, 40, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
        // Canvas winding
        // https://web.archive.org/web/20130913061632/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
        // http://jsfiddle.net/NDYV8/19/
        context.fillStyle = '#f9c';
        context.arc(60, 60, 60, 0, Math.PI * 2, true);
        context.arc(60, 60, 20, 0, Math.PI * 2, true);
        context.fill('evenodd');
    }
    function canvasToString(canvas) {
        return canvas.toDataURL();
    }
    /**
     * Checks if the current browser is known for applying anti-fingerprinting measures in all or some critical modes
     */
    function doesBrowserPerformAntifingerprinting() {
        // Safari 17
        return isWebKit() && isWebKit616OrNewer() && isSafariWebKit();
    }

    /**
     * This is a crude and primitive touch screen detection. It's not possible to currently reliably detect the availability
     * of a touch screen with a JS, without actually subscribing to a touch event.
     *
     * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
     * @see https://github.com/Modernizr/Modernizr/issues/548
     */
    function getTouchSupport() {
        var n = navigator;
        var maxTouchPoints = 0;
        var touchEvent;
        if (n.maxTouchPoints !== undefined) {
            maxTouchPoints = toInt(n.maxTouchPoints);
        }
        else if (n.msMaxTouchPoints !== undefined) {
            maxTouchPoints = n.msMaxTouchPoints;
        }
        try {
            document.createEvent('TouchEvent');
            touchEvent = true;
        }
        catch (_a) {
            touchEvent = false;
        }
        var touchStart = 'ontouchstart' in window;
        return {
            maxTouchPoints: maxTouchPoints,
            touchEvent: touchEvent,
            touchStart: touchStart,
        };
    }

    function getOsCpu() {
        return navigator.oscpu;
    }

    function getLanguages() {
        var n = navigator;
        var result = [];
        var language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
        if (language !== undefined) {
            result.push([language]);
        }
        if (Array.isArray(n.languages)) {
            // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
            // the value of `navigator.language`. Therefore the value is ignored in this browser.
            if (!(isChromium() && isChromium86OrNewer())) {
                result.push(n.languages);
            }
        }
        else if (typeof n.languages === 'string') {
            var languages = n.languages;
            if (languages) {
                result.push(languages.split(','));
            }
        }
        return result;
    }

    function getColorDepth() {
        return window.screen.colorDepth;
    }

    function getDeviceMemory() {
        // `navigator.deviceMemory` is a string containing a number in some unidentified cases
        return replaceNaN(toFloat(navigator.deviceMemory), undefined);
    }

    /**
     * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
     * The window resolution is always the document size in private mode of Safari 17,
     * so the window resolution is not used in Safari 17.
     */
    function getScreenResolution() {
        if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
            return undefined;
        }
        return getUnstableScreenResolution();
    }
    /**
     * A version of the entropy source without stabilization.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function getUnstableScreenResolution() {
        var s = screen;
        // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
        // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
        // Some browsers even return  screen resolution as not numbers.
        var parseDimension = function (value) { return replaceNaN(toInt(value), null); };
        var dimensions = [parseDimension(s.width), parseDimension(s.height)];
        dimensions.sort().reverse();
        return dimensions;
    }

    var screenFrameCheckInterval = 2500;
    var roundingPrecision = 10;
    // The type is readonly to protect from unwanted mutations
    var screenFrameBackup;
    var screenFrameSizeTimeoutId;
    /**
     * Starts watching the screen frame size. When a non-zero size appears, the size is saved and the watch is stopped.
     * Later, when `getScreenFrame` runs, it will return the saved non-zero size if the current size is null.
     *
     * This trick is required to mitigate the fact that the screen frame turns null in some cases.
     * See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
     */
    function watchScreenFrame() {
        if (screenFrameSizeTimeoutId !== undefined) {
            return;
        }
        var checkScreenFrame = function () {
            var frameSize = getCurrentScreenFrame();
            if (isFrameSizeNull(frameSize)) {
                screenFrameSizeTimeoutId = setTimeout(checkScreenFrame, screenFrameCheckInterval);
            }
            else {
                screenFrameBackup = frameSize;
                screenFrameSizeTimeoutId = undefined;
            }
        };
        checkScreenFrame();
    }
    /**
     * A version of the entropy source without stabilization.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function getUnstableScreenFrame() {
        var _this = this;
        watchScreenFrame();
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var frameSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        frameSize = getCurrentScreenFrame();
                        if (!isFrameSizeNull(frameSize)) return [3 /*break*/, 2];
                        if (screenFrameBackup) {
                            return [2 /*return*/, __spreadArray([], screenFrameBackup, true)];
                        }
                        if (!getFullscreenElement()) return [3 /*break*/, 2];
                        // Some browsers set the screen frame to zero when programmatic fullscreen is on.
                        // There is a chance of getting a non-zero frame after exiting the fullscreen.
                        // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
                        return [4 /*yield*/, exitFullscreen()];
                    case 1:
                        // Some browsers set the screen frame to zero when programmatic fullscreen is on.
                        // There is a chance of getting a non-zero frame after exiting the fullscreen.
                        // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
                        _a.sent();
                        frameSize = getCurrentScreenFrame();
                        _a.label = 2;
                    case 2:
                        if (!isFrameSizeNull(frameSize)) {
                            screenFrameBackup = frameSize;
                        }
                        return [2 /*return*/, frameSize];
                }
            });
        }); };
    }
    /**
     * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
     *
     * Sometimes the available screen resolution changes a bit, e.g. 1900x1440 → 1900x1439. A possible reason: macOS Dock
     * shrinks to fit more icons when there is too little space. The rounding is used to mitigate the difference.
     *
     * The frame width is always 0 in private mode of Safari 17, so the frame is not used in Safari 17.
     */
    function getScreenFrame() {
        var _this = this;
        if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
            return function () { return Promise.resolve(undefined); };
        }
        var screenFrameGetter = getUnstableScreenFrame();
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var frameSize, processSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, screenFrameGetter()];
                    case 1:
                        frameSize = _a.sent();
                        processSize = function (sideSize) { return (sideSize === null ? null : round(sideSize, roundingPrecision)); };
                        // It might look like I don't know about `for` and `map`.
                        // In fact, such code is used to avoid TypeScript issues without using `as`.
                        return [2 /*return*/, [processSize(frameSize[0]), processSize(frameSize[1]), processSize(frameSize[2]), processSize(frameSize[3])]];
                }
            });
        }); };
    }
    function getCurrentScreenFrame() {
        var s = screen;
        // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
        // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
        //
        // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
        // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
        return [
            replaceNaN(toFloat(s.availTop), null),
            replaceNaN(toFloat(s.width) - toFloat(s.availWidth) - replaceNaN(toFloat(s.availLeft), 0), null),
            replaceNaN(toFloat(s.height) - toFloat(s.availHeight) - replaceNaN(toFloat(s.availTop), 0), null),
            replaceNaN(toFloat(s.availLeft), null),
        ];
    }
    function isFrameSizeNull(frameSize) {
        for (var i = 0; i < 4; ++i) {
            if (frameSize[i]) {
                return false;
            }
        }
        return true;
    }

    function getHardwareConcurrency() {
        // sometimes hardware concurrency is a string
        return replaceNaN(toInt(navigator.hardwareConcurrency), undefined);
    }

    function getTimezone() {
        var _a;
        var DateTimeFormat = (_a = window.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat;
        if (DateTimeFormat) {
            var timezone = new DateTimeFormat().resolvedOptions().timeZone;
            if (timezone) {
                return timezone;
            }
        }
        // For browsers that don't support timezone names
        // The minus is intentional because the JS offset is opposite to the real offset
        var offset = -getTimezoneOffset();
        return "UTC".concat(offset >= 0 ? '+' : '').concat(offset);
    }
    function getTimezoneOffset() {
        var currentYear = new Date().getFullYear();
        // The timezone offset may change over time due to daylight saving time (DST) shifts.
        // The non-DST timezone offset is used as the result timezone offset.
        // Since the DST season differs in the northern and the southern hemispheres,
        // both January and July timezones offsets are considered.
        return Math.max(
        // `getTimezoneOffset` returns a number as a string in some unidentified cases
        toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()), toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()));
    }

    function getSessionStorage() {
        try {
            return !!window.sessionStorage;
        }
        catch (error) {
            /* SecurityError when referencing it means it exists */
            return true;
        }
    }

    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    function getLocalStorage() {
        try {
            return !!window.localStorage;
        }
        catch (e) {
            /* SecurityError when referencing it means it exists */
            return true;
        }
    }

    function getIndexedDB() {
        // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
        // visitor identifier in normal and private modes.
        if (isTrident() || isEdgeHTML()) {
            return undefined;
        }
        try {
            return !!window.indexedDB;
        }
        catch (e) {
            /* SecurityError when referencing it means it exists */
            return true;
        }
    }

    function getOpenDatabase() {
        return !!window.openDatabase;
    }

    function getCpuClass() {
        return navigator.cpuClass;
    }

    function getPlatform() {
        // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
        var platform = navigator.platform;
        // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
        // iPad uses desktop mode by default since iOS 13
        // The value is 'MacIntel' on M1 Macs
        // The value is 'iPhone' on iPod Touch
        if (platform === 'MacIntel') {
            if (isWebKit() && !isDesktopWebKit()) {
                return isIPad() ? 'iPad' : 'iPhone';
            }
        }
        return platform;
    }

    function getVendor() {
        return navigator.vendor || '';
    }

    /**
     * Checks for browser-specific (not engine specific) global variables to tell browsers with the same engine apart.
     * Only somewhat popular browsers are considered.
     */
    function getVendorFlavors() {
        var flavors = [];
        for (var _i = 0, _a = [
            // Blink and some browsers on iOS
            'chrome',
            // Safari on macOS
            'safari',
            // Chrome on iOS (checked in 85 on 13 and 87 on 14)
            '__crWeb',
            '__gCrWeb',
            // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
            'yandex',
            // Yandex Browser on iOS (checked in 21.2 on 14)
            '__yb',
            '__ybro',
            // Firefox on iOS (checked in 32 on 14)
            '__firefox__',
            // Edge on iOS (checked in 46 on 14)
            '__edgeTrackingPreventionStatistics',
            'webkit',
            // Opera Touch on iOS (checked in 2.6 on 14)
            'oprt',
            // Samsung Internet on Android (checked in 11.1)
            'samsungAr',
            // UC Browser on Android (checked in 12.10 and 13.0)
            'ucweb',
            'UCShellJava',
            // Puffin on Android (checked in 9.0)
            'puffinDevice',
            // UC on iOS and Opera on Android have no specific global variables
            // Edge for Android isn't checked
        ]; _i < _a.length; _i++) {
            var key = _a[_i];
            var value = window[key];
            if (value && typeof value === 'object') {
                flavors.push(key);
            }
        }
        return flavors.sort();
    }

    /**
     * navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
     * cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past with
     * site-specific exceptions. Don't rely on it.
     *
     * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
     */
    function areCookiesEnabled() {
        var d = document;
        // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
        // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
        // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
        // with site-specific exceptions. Don't rely on it.
        // try..catch because some in situations `document.cookie` is exposed but throws a
        // SecurityError if you try to access it; e.g. documents created from data URIs
        // or in sandboxed iframes (depending on flags/context)
        try {
            // Create cookie
            d.cookie = 'cookietest=1; SameSite=Strict;';
            var result = d.cookie.indexOf('cookietest=') !== -1;
            // Delete cookie
            d.cookie = 'cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT';
            return result;
        }
        catch (e) {
            return false;
        }
    }

    /**
     * Only single element selector are supported (no operators like space, +, >, etc).
     * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
     * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
     *
     * The "inappropriate" selectors are obfuscated. See https://github.com/fingerprintjs/fingerprintjs/issues/734.
     * A function is used instead of a plain object to help tree-shaking.
     *
     * The function code is generated automatically. See docs/content_blockers.md to learn how to make the list.
     */
    function getFilters() {
        var fromB64 = atob; // Just for better minification
        return {
            abpIndo: [
                '#Iklan-Melayang',
                '#Kolom-Iklan-728',
                '#SidebarIklan-wrapper',
                '[title="ALIENBOLA" i]',
                fromB64('I0JveC1CYW5uZXItYWRz'),
            ],
            abpvn: ['.quangcao', '#mobileCatfish', fromB64('LmNsb3NlLWFkcw=='), '[id^="bn_bottom_fixed_"]', '#pmadv'],
            adBlockFinland: [
                '.mainostila',
                fromB64('LnNwb25zb3JpdA=='),
                '.ylamainos',
                fromB64('YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd'),
            ],
            adBlockPersian: [
                '#navbar_notice_50',
                '.kadr',
                'TABLE[width="140px"]',
                '#divAgahi',
                fromB64('YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd'),
            ],
            adBlockWarningRemoval: [
                '#adblock-honeypot',
                '.adblocker-root',
                '.wp_adblock_detect',
                fromB64('LmhlYWRlci1ibG9ja2VkLWFk'),
                fromB64('I2FkX2Jsb2NrZXI='),
            ],
            adGuardAnnoyances: [
                '.hs-sosyal',
                '#cookieconsentdiv',
                'div[class^="app_gdpr"]',
                '.as-oil',
                '[data-cypress="soft-push-notification-modal"]',
            ],
            adGuardBase: [
                '.BetterJsPopOverlay',
                fromB64('I2FkXzMwMFgyNTA='),
                fromB64('I2Jhbm5lcmZsb2F0MjI='),
                fromB64('I2NhbXBhaWduLWJhbm5lcg=='),
                fromB64('I0FkLUNvbnRlbnQ='),
            ],
            adGuardChinese: [
                fromB64('LlppX2FkX2FfSA=='),
                fromB64('YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd'),
                '#widget-quan',
                fromB64('YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd'),
                fromB64('YVtocmVmKj0iLjE5NTZobC5jb20vIl0='),
            ],
            adGuardFrench: [
                '#pavePub',
                fromB64('LmFkLWRlc2t0b3AtcmVjdGFuZ2xl'),
                '.mobile_adhesion',
                '.widgetadv',
                fromB64('LmFkc19iYW4='),
            ],
            adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
            adGuardJapanese: [
                '#kauli_yad_1',
                fromB64('YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0='),
                fromB64('Ll9wb3BJbl9pbmZpbml0ZV9hZA=='),
                fromB64('LmFkZ29vZ2xl'),
                fromB64('Ll9faXNib29zdFJldHVybkFk'),
            ],
            adGuardMobile: [
                fromB64('YW1wLWF1dG8tYWRz'),
                fromB64('LmFtcF9hZA=='),
                'amp-embed[type="24smi"]',
                '#mgid_iframe1',
                fromB64('I2FkX2ludmlld19hcmVh'),
            ],
            adGuardRussian: [
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0='),
                fromB64('LnJlY2xhbWE='),
                'div[id^="smi2adblock"]',
                fromB64('ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd'),
                '#psyduckpockeball',
            ],
            adGuardSocial: [
                fromB64('YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0='),
                fromB64('YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0='),
                '.etsy-tweet',
                '#inlineShare',
                '.popup-social',
            ],
            adGuardSpanishPortuguese: ['#barraPublicidade', '#Publicidade', '#publiEspecial', '#queTooltip', '.cnt-publi'],
            adGuardTrackingProtection: [
                '#qoo-counter',
                fromB64('YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=='),
                fromB64('YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0='),
                fromB64('YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=='),
                '#top100counter',
            ],
            adGuardTurkish: [
                '#backkapat',
                fromB64('I3Jla2xhbWk='),
                fromB64('YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0='),
                fromB64('YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd'),
                fromB64('YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=='),
            ],
            bulgarian: [fromB64('dGQjZnJlZW5ldF90YWJsZV9hZHM='), '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
            easyList: [
                '.yb-floorad',
                fromB64('LndpZGdldF9wb19hZHNfd2lkZ2V0'),
                fromB64('LnRyYWZmaWNqdW5reS1hZA=='),
                '.textad_headline',
                fromB64('LnNwb25zb3JlZC10ZXh0LWxpbmtz'),
            ],
            easyListChina: [
                fromB64('LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=='),
                fromB64('LmZyb250cGFnZUFkdk0='),
                '#taotaole',
                '#aafoot.top_box',
                '.cfa_popup',
            ],
            easyListCookie: [
                '.ezmob-footer',
                '.cc-CookieWarning',
                '[data-cookie-number]',
                fromB64('LmF3LWNvb2tpZS1iYW5uZXI='),
                '.sygnal24-gdpr-modal-wrap',
            ],
            easyListCzechSlovak: [
                '#onlajny-stickers',
                fromB64('I3Jla2xhbW5pLWJveA=='),
                fromB64('LnJla2xhbWEtbWVnYWJvYXJk'),
                '.sklik',
                fromB64('W2lkXj0ic2tsaWtSZWtsYW1hIl0='),
            ],
            easyListDutch: [
                fromB64('I2FkdmVydGVudGll'),
                fromB64('I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=='),
                '.adstekst',
                fromB64('YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0='),
                '#semilo-lrectangle',
            ],
            easyListGermany: [
                '#SSpotIMPopSlider',
                fromB64('LnNwb25zb3JsaW5rZ3J1ZW4='),
                fromB64('I3dlcmJ1bmdza3k='),
                fromB64('I3Jla2xhbWUtcmVjaHRzLW1pdHRl'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0='),
            ],
            easyListItaly: [
                fromB64('LmJveF9hZHZfYW5udW5jaQ=='),
                '.sb-box-pubbliredazionale',
                fromB64('YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=='),
            ],
            easyListLithuania: [
                fromB64('LnJla2xhbW9zX3RhcnBhcw=='),
                fromB64('LnJla2xhbW9zX251b3JvZG9z'),
                fromB64('aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd'),
                fromB64('aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd'),
                fromB64('aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd'),
            ],
            estonian: [fromB64('QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==')],
            fanboyAnnoyances: ['#ac-lre-player', '.navigate-to-top', '#subscribe_popup', '.newsletter_holder', '#back-top'],
            fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
            fanboyEnhancedTrackers: [
                '.open.pushModal',
                '#issuem-leaky-paywall-articles-zero-remaining-nag',
                '#sovrn_container',
                'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
                '.BlockNag__Card',
            ],
            fanboySocial: ['#FollowUs', '#meteored_share', '#social_follow', '.article-sharer', '.community__social-desc'],
            frellwitSwedish: [
                fromB64('YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=='),
                fromB64('YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=='),
                'article.category-samarbete',
                fromB64('ZGl2LmhvbGlkQWRz'),
                'ul.adsmodern',
            ],
            greekAdBlock: [
                fromB64('QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd'),
                fromB64('QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=='),
                fromB64('QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd'),
                'DIV.agores300',
                'TABLE.advright',
            ],
            hungarian: [
                '#cemp_doboz',
                '.optimonk-iframe-container',
                fromB64('LmFkX19tYWlu'),
                fromB64('W2NsYXNzKj0iR29vZ2xlQWRzIl0='),
                '#hirdetesek_box',
            ],
            iDontCareAboutCookies: [
                '.alert-info[data-block-track*="CookieNotice"]',
                '.ModuleTemplateCookieIndicator',
                '.o--cookies--container',
                '#cookies-policy-sticky',
                '#stickyCookieBar',
            ],
            icelandicAbp: [fromB64('QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==')],
            latvian: [
                fromB64('YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0O' +
                    'iA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0='),
                fromB64('YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6I' +
                    'DMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ=='),
            ],
            listKr: [
                fromB64('YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0='),
                fromB64('I2xpdmVyZUFkV3JhcHBlcg=='),
                fromB64('YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=='),
                fromB64('aW5zLmZhc3R2aWV3LWFk'),
                '.revenue_unit_item.dable',
            ],
            listeAr: [
                fromB64('LmdlbWluaUxCMUFk'),
                '.right-and-left-sponsers',
                fromB64('YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=='),
                fromB64('YVtocmVmKj0iYm9vcmFxLm9yZyJd'),
                fromB64('YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd'),
            ],
            listeFr: [
                fromB64('YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=='),
                fromB64('I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=='),
                fromB64('YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0='),
                '.site-pub-interstitiel',
                'div[id^="crt-"][data-criteo-id]',
            ],
            officialPolish: [
                '#ceneo-placeholder-ceneo-12',
                fromB64('W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd'),
                fromB64('YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=='),
                fromB64('YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=='),
                fromB64('ZGl2I3NrYXBpZWNfYWQ='),
            ],
            ro: [
                fromB64('YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0='),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd'),
                'a[href^="/url/"]',
            ],
            ruAd: [
                fromB64('YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd'),
                fromB64('YVtocmVmKj0iLy91dGltZy5ydS8iXQ=='),
                fromB64('YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0='),
                '#pgeldiz',
                '.yandex-rtb-block',
            ],
            thaiAds: [
                'a[href*=macau-uta-popup]',
                fromB64('I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=='),
                fromB64('LmFkczMwMHM='),
                '.bumq',
                '.img-kosana',
            ],
            webAnnoyancesUltralist: [
                '#mod-social-share-2',
                '#social-tools',
                fromB64('LmN0cGwtZnVsbGJhbm5lcg=='),
                '.zergnet-recommend',
                '.yt.btn-link.btn-md.btn',
            ],
        };
    }
    /**
     * The order of the returned array means nothing (it's always sorted alphabetically).
     *
     * Notice that the source is slightly unstable.
     * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
     * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
     * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
     * If you are a website owner, don't make your visitors want to disable content blockers.
     */
    function getDomBlockers(_a) {
        var _b = _a === void 0 ? {} : _a, debug = _b.debug;
        return __awaiter(this, void 0, void 0, function () {
            var filters, filterNames, allSelectors, blockedSelectors, activeBlockers;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!isApplicable()) {
                            return [2 /*return*/, undefined];
                        }
                        filters = getFilters();
                        filterNames = Object.keys(filters);
                        allSelectors = (_c = []).concat.apply(_c, filterNames.map(function (filterName) { return filters[filterName]; }));
                        return [4 /*yield*/, getBlockedSelectors(allSelectors)];
                    case 1:
                        blockedSelectors = _d.sent();
                        if (debug) {
                            printDebug(filters, blockedSelectors);
                        }
                        activeBlockers = filterNames.filter(function (filterName) {
                            var selectors = filters[filterName];
                            var blockedCount = countTruthy(selectors.map(function (selector) { return blockedSelectors[selector]; }));
                            return blockedCount > selectors.length * 0.6;
                        });
                        activeBlockers.sort();
                        return [2 /*return*/, activeBlockers];
                }
            });
        });
    }
    function isApplicable() {
        // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
        return isWebKit() || isAndroid();
    }
    function getBlockedSelectors(selectors) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var d, root, elements, blockedSelectors, i, element, holder, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        d = document;
                        root = d.createElement('div');
                        elements = new Array(selectors.length);
                        blockedSelectors = {} // Set() isn't used just in case somebody need older browser support
                        ;
                        forceShow(root);
                        // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
                        // browser will alternate tree modification and layout reading, that is very slow.
                        for (i = 0; i < selectors.length; ++i) {
                            element = selectorToElement(selectors[i]);
                            if (element.tagName === 'DIALOG') {
                                element.show();
                            }
                            holder = d.createElement('div') // Protects from unwanted effects of `+` and `~` selectors of filters
                            ;
                            forceShow(holder);
                            holder.appendChild(element);
                            root.appendChild(holder);
                            elements[i] = element;
                        }
                        _b.label = 1;
                    case 1:
                        if (!!d.body) return [3 /*break*/, 3];
                        return [4 /*yield*/, wait(50)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        d.body.appendChild(root);
                        try {
                            // Then check which of the elements are blocked
                            for (i = 0; i < selectors.length; ++i) {
                                if (!elements[i].offsetParent) {
                                    blockedSelectors[selectors[i]] = true;
                                }
                            }
                        }
                        finally {
                            // Then remove the elements
                            (_a = root.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(root);
                        }
                        return [2 /*return*/, blockedSelectors];
                }
            });
        });
    }
    function forceShow(element) {
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('display', 'block', 'important');
    }
    function printDebug(filters, blockedSelectors) {
        var message = 'DOM blockers debug:\n```';
        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
            var filterName = _a[_i];
            message += "\n".concat(filterName, ":");
            for (var _b = 0, _c = filters[filterName]; _b < _c.length; _b++) {
                var selector = _c[_b];
                message += "\n  ".concat(blockedSelectors[selector] ? '🚫' : '➡️', " ").concat(selector);
            }
        }
        // console.log is ok here because it's under a debug clause
        // eslint-disable-next-line no-console
        console.log("".concat(message, "\n```"));
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
     */
    function getColorGamut() {
        // rec2020 includes p3 and p3 includes srgb
        for (var _i = 0, _a = ['rec2020', 'p3', 'srgb']; _i < _a.length; _i++) {
            var gamut = _a[_i];
            if (matchMedia("(color-gamut: ".concat(gamut, ")")).matches) {
                return gamut;
            }
        }
        return undefined;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors
     */
    function areColorsInverted() {
        if (doesMatch$5('inverted')) {
            return true;
        }
        if (doesMatch$5('none')) {
            return false;
        }
        return undefined;
    }
    function doesMatch$5(value) {
        return matchMedia("(inverted-colors: ".concat(value, ")")).matches;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
     */
    function areColorsForced() {
        if (doesMatch$4('active')) {
            return true;
        }
        if (doesMatch$4('none')) {
            return false;
        }
        return undefined;
    }
    function doesMatch$4(value) {
        return matchMedia("(forced-colors: ".concat(value, ")")).matches;
    }

    var maxValueToCheck = 100;
    /**
     * If the display is monochrome (e.g. black&white), the value will be ≥0 and will mean the number of bits per pixel.
     * If the display is not monochrome, the returned value will be 0.
     * If the browser doesn't support this feature, the returned value will be undefined.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome
     */
    function getMonochromeDepth() {
        if (!matchMedia('(min-monochrome: 0)').matches) {
            // The media feature isn't supported by the browser
            return undefined;
        }
        // A variation of binary search algorithm can be used here.
        // But since expected values are very small (≤10), there is no sense in adding the complexity.
        for (var i = 0; i <= maxValueToCheck; ++i) {
            if (matchMedia("(max-monochrome: ".concat(i, ")")).matches) {
                return i;
            }
        }
        throw new Error('Too high value');
    }

    /**
     * @see https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
     */
    function getContrastPreference() {
        if (doesMatch$3('no-preference')) {
            return 0 /* ContrastPreference.None */;
        }
        // The sources contradict on the keywords. Probably 'high' and 'low' will never be implemented.
        // Need to check it when all browsers implement the feature.
        if (doesMatch$3('high') || doesMatch$3('more')) {
            return 1 /* ContrastPreference.More */;
        }
        if (doesMatch$3('low') || doesMatch$3('less')) {
            return -1 /* ContrastPreference.Less */;
        }
        if (doesMatch$3('forced')) {
            return 10 /* ContrastPreference.ForcedColors */;
        }
        return undefined;
    }
    function doesMatch$3(value) {
        return matchMedia("(prefers-contrast: ".concat(value, ")")).matches;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
     */
    function isMotionReduced() {
        if (doesMatch$2('reduce')) {
            return true;
        }
        if (doesMatch$2('no-preference')) {
            return false;
        }
        return undefined;
    }
    function doesMatch$2(value) {
        return matchMedia("(prefers-reduced-motion: ".concat(value, ")")).matches;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency
     */
    function isTransparencyReduced() {
        if (doesMatch$1('reduce')) {
            return true;
        }
        if (doesMatch$1('no-preference')) {
            return false;
        }
        return undefined;
    }
    function doesMatch$1(value) {
        return matchMedia("(prefers-reduced-transparency: ".concat(value, ")")).matches;
    }

    /**
     * @see https://www.w3.org/TR/mediaqueries-5/#dynamic-range
     */
    function isHDR() {
        if (doesMatch('high')) {
            return true;
        }
        if (doesMatch('standard')) {
            return false;
        }
        return undefined;
    }
    function doesMatch(value) {
        return matchMedia("(dynamic-range: ".concat(value, ")")).matches;
    }

    var M = Math; // To reduce the minified code size
    var fallbackFn = function () { return 0; };
    /**
     * @see https://gitlab.torproject.org/legacy/trac/-/issues/13018
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=531915
     */
    function getMathFingerprint() {
        // Native operations
        var acos = M.acos || fallbackFn;
        var acosh = M.acosh || fallbackFn;
        var asin = M.asin || fallbackFn;
        var asinh = M.asinh || fallbackFn;
        var atanh = M.atanh || fallbackFn;
        var atan = M.atan || fallbackFn;
        var sin = M.sin || fallbackFn;
        var sinh = M.sinh || fallbackFn;
        var cos = M.cos || fallbackFn;
        var cosh = M.cosh || fallbackFn;
        var tan = M.tan || fallbackFn;
        var tanh = M.tanh || fallbackFn;
        var exp = M.exp || fallbackFn;
        var expm1 = M.expm1 || fallbackFn;
        var log1p = M.log1p || fallbackFn;
        // Operation polyfills
        var powPI = function (value) { return M.pow(M.PI, value); };
        var acoshPf = function (value) { return M.log(value + M.sqrt(value * value - 1)); };
        var asinhPf = function (value) { return M.log(value + M.sqrt(value * value + 1)); };
        var atanhPf = function (value) { return M.log((1 + value) / (1 - value)) / 2; };
        var sinhPf = function (value) { return M.exp(value) - 1 / M.exp(value) / 2; };
        var coshPf = function (value) { return (M.exp(value) + 1 / M.exp(value)) / 2; };
        var expm1Pf = function (value) { return M.exp(value) - 1; };
        var tanhPf = function (value) { return (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1); };
        var log1pPf = function (value) { return M.log(1 + value); };
        // Note: constant values are empirical
        return {
            acos: acos(0.123124234234234242),
            acosh: acosh(1e308),
            acoshPf: acoshPf(1e154),
            asin: asin(0.123124234234234242),
            asinh: asinh(1),
            asinhPf: asinhPf(1),
            atanh: atanh(0.5),
            atanhPf: atanhPf(0.5),
            atan: atan(0.5),
            sin: sin(-1e300),
            sinh: sinh(1),
            sinhPf: sinhPf(1),
            cos: cos(10.000000000123),
            cosh: cosh(1),
            coshPf: coshPf(1),
            tan: tan(-1e300),
            tanh: tanh(1),
            tanhPf: tanhPf(1),
            exp: exp(1),
            expm1: expm1(1),
            expm1Pf: expm1Pf(1),
            log1p: log1p(10),
            log1pPf: log1pPf(10),
            powPI: powPI(-100),
        };
    }

    /**
     * We use m or w because these two characters take up the maximum width.
     * Also there are a couple of ligatures.
     */
    var defaultText = 'mmMwWLliI0fiflO&1';
    /**
     * Settings of text blocks to measure. The keys are random but persistent words.
     */
    var presets = {
        /**
         * The default font. User can change it in desktop Chrome, desktop Firefox, IE 11,
         * Android Chrome (but only when the size is ≥ than the default) and Android Firefox.
         */
        default: [],
        /** OS font on macOS. User can change its size and weight. Applies after Safari restart. */
        apple: [{ font: '-apple-system-body' }],
        /** User can change it in desktop Chrome and desktop Firefox. */
        serif: [{ fontFamily: 'serif' }],
        /** User can change it in desktop Chrome and desktop Firefox. */
        sans: [{ fontFamily: 'sans-serif' }],
        /** User can change it in desktop Chrome and desktop Firefox. */
        mono: [{ fontFamily: 'monospace' }],
        /**
         * Check the smallest allowed font size. User can change it in desktop Chrome, desktop Firefox and desktop Safari.
         * The height can be 0 in Chrome on a retina display.
         */
        min: [{ fontSize: '1px' }],
        /** Tells one OS from another in desktop Chrome. */
        system: [{ fontFamily: 'system-ui' }],
    };
    /**
     * The result is a dictionary of the width of the text samples.
     * Heights aren't included because they give no extra entropy and are unstable.
     *
     * The result is very stable in IE 11, Edge 18 and Safari 14.
     * The result changes when the OS pixel density changes in Chromium 87. The real pixel density is required to solve,
     * but seems like it's impossible: https://stackoverflow.com/q/1713771/1118709.
     * The "min" and the "mono" (only on Windows) value may change when the page is zoomed in Firefox 87.
     */
    function getFontPreferences() {
        return withNaturalFonts(function (document, container) {
            var elements = {};
            var sizes = {};
            // First create all elements to measure. If the DOM steps below are done in a single cycle,
            // browser will alternate tree modification and layout reading, that is very slow.
            for (var _i = 0, _a = Object.keys(presets); _i < _a.length; _i++) {
                var key = _a[_i];
                var _b = presets[key], _c = _b[0], style = _c === void 0 ? {} : _c, _d = _b[1], text = _d === void 0 ? defaultText : _d;
                var element = document.createElement('span');
                element.textContent = text;
                element.style.whiteSpace = 'nowrap';
                for (var _e = 0, _f = Object.keys(style); _e < _f.length; _e++) {
                    var name_1 = _f[_e];
                    var value = style[name_1];
                    if (value !== undefined) {
                        element.style[name_1] = value;
                    }
                }
                elements[key] = element;
                container.append(document.createElement('br'), element);
            }
            // Then measure the created elements
            for (var _g = 0, _h = Object.keys(presets); _g < _h.length; _g++) {
                var key = _h[_g];
                sizes[key] = elements[key].getBoundingClientRect().width;
            }
            return sizes;
        });
    }
    /**
     * Creates a DOM environment that provides the most natural font available, including Android OS font.
     * Measurements of the elements are zoom-independent.
     * Don't put a content to measure inside an absolutely positioned element.
     */
    function withNaturalFonts(action, containerWidthPx) {
        if (containerWidthPx === void 0) { containerWidthPx = 4000; }
        /*
         * Requirements for Android Chrome to apply the system font size to a text inside an iframe:
         * - The iframe mustn't have a `display: none;` style;
         * - The text mustn't be positioned absolutely;
         * - The text block must be wide enough.
         *   2560px on some devices in portrait orientation for the biggest font size option (32px);
         * - There must be much enough text to form a few lines (I don't know the exact numbers);
         * - The text must have the `text-size-adjust: none` style. Otherwise the text will scale in "Desktop site" mode;
         *
         * Requirements for Android Firefox to apply the system font size to a text inside an iframe:
         * - The iframe document must have a header: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
         *   The only way to set it is to use the `srcdoc` attribute of the iframe;
         * - The iframe content must get loaded before adding extra content with JavaScript;
         *
         * https://example.com as the iframe target always inherits Android font settings so it can be used as a reference.
         *
         * Observations on how page zoom affects the measurements:
         * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
         * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
         * - macOS Safari 14.0: offsetWidth = 5% fluctuation;
         * - macOS Safari 14.0: getBoundingClientRect = 5% fluctuation;
         * - iOS Safari 9, 10, 11.0, 12.0: haven't found a way to zoom a page (pinch doesn't change layout);
         * - iOS Safari 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
         * - iOS Safari 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
         * - iOS Safari 14.0: offsetWidth = 100% reliable;
         * - iOS Safari 14.0: getBoundingClientRect = 100% reliable;
         * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + offsetWidth = 1px fluctuation;
         * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + getBoundingClientRect = 100% reliable;
         * - Chrome 87: offsetWidth = 1px fluctuation;
         * - Chrome 87: getBoundingClientRect = 0.7px fluctuation;
         * - Firefox 48, 51: offsetWidth = 10% fluctuation;
         * - Firefox 48, 51: getBoundingClientRect = 10% fluctuation;
         * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: offsetWidth = width 100% reliable, height 10% fluctuation;
         * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: getBoundingClientRect = width 100% reliable, height 10%
         *   fluctuation;
         * - Android Chrome 86: haven't found a way to zoom a page (pinch doesn't change layout);
         * - Android Firefox 84: font size in accessibility settings changes all the CSS sizes, but offsetWidth and
         *   getBoundingClientRect keep measuring with regular units, so the size reflects the font size setting and doesn't
         *   fluctuate;
         * - IE 11, Edge 18: zoom 1/devicePixelRatio + offsetWidth = 100% reliable;
         * - IE 11, Edge 18: zoom 1/devicePixelRatio + getBoundingClientRect = reflects the zoom level;
         * - IE 11, Edge 18: offsetWidth = 100% reliable;
         * - IE 11, Edge 18: getBoundingClientRect = 100% reliable;
         */
        return withIframe(function (_, iframeWindow) {
            var iframeDocument = iframeWindow.document;
            var iframeBody = iframeDocument.body;
            var bodyStyle = iframeBody.style;
            bodyStyle.width = "".concat(containerWidthPx, "px");
            bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = 'none';
            // See the big comment above
            if (isChromium()) {
                iframeBody.style.zoom = "".concat(1 / iframeWindow.devicePixelRatio);
            }
            else if (isWebKit()) {
                iframeBody.style.zoom = 'reset';
            }
            // See the big comment above
            var linesOfText = iframeDocument.createElement('div');
            linesOfText.textContent = __spreadArray([], Array((containerWidthPx / 20) << 0), true).map(function () { return 'word'; }).join(' ');
            iframeBody.appendChild(linesOfText);
            return action(iframeDocument, iframeBody);
        }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
    }

    function isPdfViewerEnabled() {
        return navigator.pdfViewerEnabled;
    }

    /**
     * Unlike most other architectures, on x86/x86-64 when floating-point instructions
     * have no NaN arguments, but produce NaN output, the output NaN has sign bit set.
     * We use it to distinguish x86/x86-64 from other architectures, by doing subtraction
     * of two infinities (must produce NaN per IEEE 754 standard).
     *
     * See https://codebrowser.bddppq.com/pytorch/pytorch/third_party/XNNPACK/src/init.c.html#79
     */
    function getArchitecture() {
        var f = new Float32Array(1);
        var u8 = new Uint8Array(f.buffer);
        f[0] = Infinity;
        f[0] = f[0] - f[0];
        return u8[3];
    }

    /**
     * The return type is a union instead of the enum, because it's too challenging to embed the const enum into another
     * project. Turning it into a union is a simple and an elegant solution.
     */
    function getApplePayState() {
        var ApplePaySession = window.ApplePaySession;
        if (typeof (ApplePaySession === null || ApplePaySession === void 0 ? void 0 : ApplePaySession.canMakePayments) !== 'function') {
            return -1 /* ApplePayState.NoAPI */;
        }
        if (willPrintConsoleError()) {
            return -3 /* ApplePayState.NotAvailableInFrame */;
        }
        try {
            return ApplePaySession.canMakePayments() ? 1 /* ApplePayState.Enabled */ : 0 /* ApplePayState.Disabled */;
        }
        catch (error) {
            return getStateFromError(error);
        }
    }
    /**
     * Starting from Safari 15 calling `ApplePaySession.canMakePayments()` produces this error message when FingerprintJS
     * runs in an iframe with a cross-origin parent page, and the iframe on that page has no allow="payment *" attribute:
     *   Feature policy 'Payment' check failed for element with origin 'https://example.com' and allow attribute ''.
     * This function checks whether the error message is expected.
     *
     * We check for cross-origin parents, which is prone to false-positive results. Instead, we should check for allowed
     * feature/permission, but we can't because none of these API works in Safari yet:
     *   navigator.permissions.query({ name: ‘payment' })
     *   navigator.permissions.query({ name: ‘payment-handler' })
     *   document.featurePolicy
     */
    var willPrintConsoleError = isAnyParentCrossOrigin;
    function getStateFromError(error) {
        // See full expected error messages in the test
        if (error instanceof Error && error.name === 'InvalidAccessError' && /\bfrom\b.*\binsecure\b/i.test(error.message)) {
            return -2 /* ApplePayState.NotAvailableInInsecureContext */;
        }
        throw error;
    }

    /**
     * Checks whether the Safari's Privacy Preserving Ad Measurement setting is on.
     * The setting is on when the value is not undefined.
     * A.k.a. private click measurement, privacy-preserving ad attribution.
     *
     * Unfortunately, it doesn't work in mobile Safari.
     * Probably, it will start working in mobile Safari or stop working in desktop Safari later.
     * We've found no way to detect the setting state in mobile Safari. Help wanted.
     *
     * @see https://webkit.org/blog/11529/introducing-private-click-measurement-pcm/
     * @see https://developer.apple.com/videos/play/wwdc2021/10033
     */
    function getPrivateClickMeasurement() {
        var _a;
        var link = document.createElement('a');
        var sourceId = (_a = link.attributionSourceId) !== null && _a !== void 0 ? _a : link.attributionsourceid;
        return sourceId === undefined ? undefined : String(sourceId);
    }

    /** WebGl context is not available */
    var STATUS_NO_GL_CONTEXT = -1;
    /** WebGL context `getParameter` method is not a function */
    var STATUS_GET_PARAMETER_NOT_A_FUNCTION = -2;
    var validContextParameters = new Set([
        10752, 2849, 2884, 2885, 2886, 2928, 2929, 2930, 2931, 2932, 2960, 2961, 2962, 2963, 2964, 2965, 2966, 2967, 2968,
        2978, 3024, 3042, 3088, 3089, 3106, 3107, 32773, 32777, 32777, 32823, 32824, 32936, 32937, 32938, 32939, 32968, 32969,
        32970, 32971, 3317, 33170, 3333, 3379, 3386, 33901, 33902, 34016, 34024, 34076, 3408, 3410, 3411, 3412, 3413, 3414,
        3415, 34467, 34816, 34817, 34818, 34819, 34877, 34921, 34930, 35660, 35661, 35724, 35738, 35739, 36003, 36004, 36005,
        36347, 36348, 36349, 37440, 37441, 37443, 7936, 7937, 7938,
        // SAMPLE_ALPHA_TO_COVERAGE (32926) and SAMPLE_COVERAGE (32928) are excluded because they trigger a console warning
        // in IE, Chrome ≤ 59 and Safari ≤ 13 and give no entropy.
    ]);
    var validExtensionParams = new Set([
        34047,
        35723,
        36063,
        34852,
        34853,
        34854,
        34229,
        36392,
        36795,
        38449, // MAX_VIEWS_OVR
    ]);
    var shaderTypes = ['FRAGMENT_SHADER', 'VERTEX_SHADER'];
    var precisionTypes = ['LOW_FLOAT', 'MEDIUM_FLOAT', 'HIGH_FLOAT', 'LOW_INT', 'MEDIUM_INT', 'HIGH_INT'];
    var rendererInfoExtensionName = 'WEBGL_debug_renderer_info';
    var polygonModeExtensionName = 'WEBGL_polygon_mode';
    /**
     * Gets the basic and simple WebGL parameters
     */
    function getWebGlBasics(_a) {
        var _b, _c, _d, _e, _f, _g;
        var cache = _a.cache;
        var gl = getWebGLContext(cache);
        if (!gl) {
            return STATUS_NO_GL_CONTEXT;
        }
        if (!isValidParameterGetter(gl)) {
            return STATUS_GET_PARAMETER_NOT_A_FUNCTION;
        }
        var debugExtension = shouldAvoidDebugRendererInfo() ? null : gl.getExtension(rendererInfoExtensionName);
        return {
            version: ((_b = gl.getParameter(gl.VERSION)) === null || _b === void 0 ? void 0 : _b.toString()) || '',
            vendor: ((_c = gl.getParameter(gl.VENDOR)) === null || _c === void 0 ? void 0 : _c.toString()) || '',
            vendorUnmasked: debugExtension ? (_d = gl.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL)) === null || _d === void 0 ? void 0 : _d.toString() : '',
            renderer: ((_e = gl.getParameter(gl.RENDERER)) === null || _e === void 0 ? void 0 : _e.toString()) || '',
            rendererUnmasked: debugExtension ? (_f = gl.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL)) === null || _f === void 0 ? void 0 : _f.toString() : '',
            shadingLanguageVersion: ((_g = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)) === null || _g === void 0 ? void 0 : _g.toString()) || '',
        };
    }
    /**
     * Gets the advanced and massive WebGL parameters and extensions
     */
    function getWebGlExtensions(_a) {
        var cache = _a.cache;
        var gl = getWebGLContext(cache);
        if (!gl) {
            return STATUS_NO_GL_CONTEXT;
        }
        if (!isValidParameterGetter(gl)) {
            return STATUS_GET_PARAMETER_NOT_A_FUNCTION;
        }
        var extensions = gl.getSupportedExtensions();
        var contextAttributes = gl.getContextAttributes();
        var unsupportedExtensions = [];
        // Features
        var attributes = [];
        var parameters = [];
        var extensionParameters = [];
        var shaderPrecisions = [];
        // Context attributes
        if (contextAttributes) {
            for (var _i = 0, _b = Object.keys(contextAttributes); _i < _b.length; _i++) {
                var attributeName = _b[_i];
                attributes.push("".concat(attributeName, "=").concat(contextAttributes[attributeName]));
            }
        }
        // Context parameters
        var constants = getConstantsFromPrototype(gl);
        for (var _c = 0, constants_1 = constants; _c < constants_1.length; _c++) {
            var constant = constants_1[_c];
            var code = gl[constant];
            parameters.push("".concat(constant, "=").concat(code).concat(validContextParameters.has(code) ? "=".concat(gl.getParameter(code)) : ''));
        }
        // Extension parameters
        if (extensions) {
            for (var _d = 0, extensions_1 = extensions; _d < extensions_1.length; _d++) {
                var name_1 = extensions_1[_d];
                if ((name_1 === rendererInfoExtensionName && shouldAvoidDebugRendererInfo()) ||
                    (name_1 === polygonModeExtensionName && shouldAvoidPolygonModeExtensions())) {
                    continue;
                }
                var extension = gl.getExtension(name_1);
                if (!extension) {
                    unsupportedExtensions.push(name_1);
                    continue;
                }
                for (var _e = 0, _f = getConstantsFromPrototype(extension); _e < _f.length; _e++) {
                    var constant = _f[_e];
                    var code = extension[constant];
                    extensionParameters.push("".concat(constant, "=").concat(code).concat(validExtensionParams.has(code) ? "=".concat(gl.getParameter(code)) : ''));
                }
            }
        }
        // Shader precision
        for (var _g = 0, shaderTypes_1 = shaderTypes; _g < shaderTypes_1.length; _g++) {
            var shaderType = shaderTypes_1[_g];
            for (var _h = 0, precisionTypes_1 = precisionTypes; _h < precisionTypes_1.length; _h++) {
                var precisionType = precisionTypes_1[_h];
                var shaderPrecision = getShaderPrecision(gl, shaderType, precisionType);
                shaderPrecisions.push("".concat(shaderType, ".").concat(precisionType, "=").concat(shaderPrecision.join(',')));
            }
        }
        // Postprocess
        extensionParameters.sort();
        parameters.sort();
        return {
            contextAttributes: attributes,
            parameters: parameters,
            shaderPrecisions: shaderPrecisions,
            extensions: extensions,
            extensionParameters: extensionParameters,
            unsupportedExtensions: unsupportedExtensions,
        };
    }
    /**
     * This function usually takes the most time to execute in all the sources, therefore we cache its result.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function getWebGLContext(cache) {
        if (cache.webgl) {
            return cache.webgl.context;
        }
        var canvas = document.createElement('canvas');
        var context;
        canvas.addEventListener('webglCreateContextError', function () { return (context = undefined); });
        for (var _i = 0, _a = ['webgl', 'experimental-webgl']; _i < _a.length; _i++) {
            var type = _a[_i];
            try {
                context = canvas.getContext(type);
            }
            catch (_b) {
                // Ok, continue
            }
            if (context) {
                break;
            }
        }
        cache.webgl = { context: context };
        return context;
    }
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
     * https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.12
     */
    function getShaderPrecision(gl, shaderType, precisionType) {
        var shaderPrecision = gl.getShaderPrecisionFormat(gl[shaderType], gl[precisionType]);
        return shaderPrecision ? [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision] : [];
    }
    function getConstantsFromPrototype(obj) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var keys = Object.keys(obj.__proto__);
        return keys.filter(isConstantLike);
    }
    function isConstantLike(key) {
        return typeof key === 'string' && !key.match(/[^A-Z0-9_x]/);
    }
    /**
     * Some browsers print a console warning when the WEBGL_debug_renderer_info extension is requested.
     * JS Agent aims to avoid printing messages to console, so we avoid this extension in that browsers.
     */
    function shouldAvoidDebugRendererInfo() {
        return isGecko();
    }
    /**
     * Some browsers print a console warning when the WEBGL_polygon_mode extension is requested.
     * JS Agent aims to avoid printing messages to console, so we avoid this extension in that browsers.
     */
    function shouldAvoidPolygonModeExtensions() {
        return isChromium() || isWebKit();
    }
    /**
     * Some unknown browsers have no `getParameter` method
     */
    function isValidParameterGetter(gl) {
        return typeof gl.getParameter === 'function';
    }

    function getAudioContextBaseLatency() {
        // The signal emits warning in Chrome and Firefox, therefore it is enabled on Safari where it doesn't produce warning
        // and on Android where it's less visible
        var isAllowedPlatform = isAndroid() || isWebKit();
        if (!isAllowedPlatform) {
            return -2 /* SpecialFingerprint.Disabled */;
        }
        if (!window.AudioContext) {
            return -1 /* SpecialFingerprint.NotSupported */;
        }
        var latency = new AudioContext().baseLatency;
        if (latency === null || latency === undefined) {
            return -1 /* SpecialFingerprint.NotSupported */;
        }
        if (!isFinite(latency)) {
            return -3 /* SpecialFingerprint.NotFinite */;
        }
        return latency;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
     *
     * The return type is a union instead of a const enum due to the difficulty of embedding const enums in other projects.
     * This makes integration simpler and more elegant.
     */
    function getDateTimeLocale() {
        if (!window.Intl) {
            return -1 /* Status.IntlAPINotSupported */;
        }
        var DateTimeFormat = window.Intl.DateTimeFormat;
        if (!DateTimeFormat) {
            return -2 /* Status.DateTimeFormatNotSupported */;
        }
        var locale = DateTimeFormat().resolvedOptions().locale;
        if (!locale && locale !== '') {
            return -3 /* Status.LocaleNotAvailable */;
        }
        return locale;
    }

    /**
     * The list of entropy sources used to make visitor identifiers.
     *
     * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
     * this package.
     *
     * Note: Rollup and Webpack are smart enough to remove unused properties of this object during tree-shaking, so there is
     * no need to export the sources individually.
     */
    var sources = {
        // READ FIRST:
        // See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-add-an-entropy-source
        // to learn how entropy source works and how to make your own.
        // The sources run in this exact order.
        // The asynchronous sources are at the start to run in parallel with other sources.
        fonts: getFonts,
        domBlockers: getDomBlockers,
        fontPreferences: getFontPreferences,
        audio: getAudioFingerprint,
        screenFrame: getScreenFrame,
        canvas: getCanvasFingerprint,
        osCpu: getOsCpu,
        languages: getLanguages,
        colorDepth: getColorDepth,
        deviceMemory: getDeviceMemory,
        screenResolution: getScreenResolution,
        hardwareConcurrency: getHardwareConcurrency,
        timezone: getTimezone,
        sessionStorage: getSessionStorage,
        localStorage: getLocalStorage,
        indexedDB: getIndexedDB,
        openDatabase: getOpenDatabase,
        cpuClass: getCpuClass,
        platform: getPlatform,
        plugins: getPlugins,
        touchSupport: getTouchSupport,
        vendor: getVendor,
        vendorFlavors: getVendorFlavors,
        cookiesEnabled: areCookiesEnabled,
        colorGamut: getColorGamut,
        invertedColors: areColorsInverted,
        forcedColors: areColorsForced,
        monochrome: getMonochromeDepth,
        contrast: getContrastPreference,
        reducedMotion: isMotionReduced,
        reducedTransparency: isTransparencyReduced,
        hdr: isHDR,
        math: getMathFingerprint,
        pdfViewerEnabled: isPdfViewerEnabled,
        architecture: getArchitecture,
        applePay: getApplePayState,
        privateClickMeasurement: getPrivateClickMeasurement,
        audioBaseLatency: getAudioContextBaseLatency,
        dateTimeLocale: getDateTimeLocale,
        // Some sources can affect other sources (e.g. WebGL can affect canvas), so it's important to run these sources
        // after other sources.
        webGlBasics: getWebGlBasics,
        webGlExtensions: getWebGlExtensions,
    };
    /**
     * Loads the built-in entropy sources.
     * Returns a function that collects the entropy components to make the visitor identifier.
     */
    function loadBuiltinSources(options) {
        return loadSources(sources, options, []);
    }

    var commentTemplate = '$ if upgrade to Pro: https://fpjs.dev/pro';
    function getConfidence(components) {
        var openConfidenceScore = getOpenConfidenceScore(components);
        var proConfidenceScore = deriveProConfidenceScore(openConfidenceScore);
        return { score: openConfidenceScore, comment: commentTemplate.replace(/\$/g, "".concat(proConfidenceScore)) };
    }
    function getOpenConfidenceScore(components) {
        // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
        // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
        // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
        if (isAndroid()) {
            return 0.4;
        }
        // Safari (mobile and desktop)
        if (isWebKit()) {
            return isDesktopWebKit() && !(isWebKit616OrNewer() && isSafariWebKit()) ? 0.5 : 0.3;
        }
        var platform = 'value' in components.platform ? components.platform.value : '';
        // Windows
        if (/^Win/.test(platform)) {
            // The score is greater than on macOS because of the higher variety of devices running Windows.
            // Chrome provides more entropy than Firefox according too
            // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Windows%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
            // So we assign the same score to them.
            return 0.6;
        }
        // macOS
        if (/^Mac/.test(platform)) {
            // Chrome provides more entropy than Safari and Safari provides more entropy than Firefox.
            // Chrome is more popular than Safari and Safari is more popular than Firefox according to
            // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Mac%20OS%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
            // So we assign the same score to them.
            return 0.5;
        }
        // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
        return 0.7;
    }
    function deriveProConfidenceScore(openConfidenceScore) {
        return round(0.99 + 0.01 * openConfidenceScore, 0.0001);
    }

    function componentsToCanonicalString(components) {
        var result = '';
        for (var _i = 0, _a = Object.keys(components).sort(); _i < _a.length; _i++) {
            var componentKey = _a[_i];
            var component = components[componentKey];
            var value = 'error' in component ? 'error' : JSON.stringify(component.value);
            result += "".concat(result ? '|' : '').concat(componentKey.replace(/([:|\\])/g, '\\$1'), ":").concat(value);
        }
        return result;
    }
    function componentsToDebugString(components) {
        return JSON.stringify(components, function (_key, value) {
            if (value instanceof Error) {
                return errorToObject(value);
            }
            return value;
        }, 2);
    }
    function hashComponents(components) {
        return x64hash128(componentsToCanonicalString(components));
    }
    /**
     * Makes a GetResult implementation that calculates the visitor id hash on demand.
     * Designed for optimisation.
     */
    function makeLazyGetResult(components) {
        var visitorIdCache;
        // This function runs very fast, so there is no need to make it lazy
        var confidence = getConfidence(components);
        // A plain class isn't used because its getters and setters aren't enumerable.
        return {
            get visitorId() {
                if (visitorIdCache === undefined) {
                    visitorIdCache = hashComponents(this.components);
                }
                return visitorIdCache;
            },
            set visitorId(visitorId) {
                visitorIdCache = visitorId;
            },
            confidence: confidence,
            components: components,
            version: version,
        };
    }
    /**
     * A delay is required to ensure consistent entropy components.
     * See https://github.com/fingerprintjs/fingerprintjs/issues/254
     * and https://github.com/fingerprintjs/fingerprintjs/issues/307
     * and https://github.com/fingerprintjs/fingerprintjs/commit/945633e7c5f67ae38eb0fea37349712f0e669b18
     */
    function prepareForSources(delayFallback) {
        if (delayFallback === void 0) { delayFallback = 50; }
        // A proper deadline is unknown. Let it be twice the fallback timeout so that both cases have the same average time.
        return requestIdleCallbackIfAvailable(delayFallback, delayFallback * 2);
    }
    /**
     * The function isn't exported from the index file to not allow to call it without `load()`.
     * The hiding gives more freedom for future non-breaking updates.
     *
     * A factory function is used instead of a class to shorten the attribute names in the minified code.
     * Native private class fields could've been used, but TypeScript doesn't allow them with `"target": "es5"`.
     */
    function makeAgent(getComponents, debug) {
        var creationTime = Date.now();
        return {
            get: function (options) {
                return __awaiter(this, void 0, void 0, function () {
                    var startTime, components, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                startTime = Date.now();
                                return [4 /*yield*/, getComponents()];
                            case 1:
                                components = _a.sent();
                                result = makeLazyGetResult(components);
                                if (debug || (options === null || options === void 0 ? void 0 : options.debug)) {
                                    // console.log is ok here because it's under a debug clause
                                    // eslint-disable-next-line no-console
                                    console.log("Copy the text below to get the debug data:\n\n```\nversion: ".concat(result.version, "\nuserAgent: ").concat(navigator.userAgent, "\ntimeBetweenLoadAndGet: ").concat(startTime - creationTime, "\nvisitorId: ").concat(result.visitorId, "\ncomponents: ").concat(componentsToDebugString(components), "\n```"));
                                }
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
    }
    /**
     * Sends an unpersonalized AJAX request to collect installation statistics
     */
    function monitor() {
        // The FingerprintJS CDN (https://github.com/fingerprintjs/cdn) replaces `window.__fpjs_d_m` with `true`
        if (window.__fpjs_d_m || Math.random() >= 0.001) {
            return;
        }
        try {
            var request = new XMLHttpRequest();
            request.open('get', "https://m1.openfpcdn.io/fingerprintjs/v".concat(version, "/npm-monitoring"), true);
            request.send();
        }
        catch (error) {
            // console.error is ok here because it's an unexpected error handler
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
    /**
     * Builds an instance of Agent and waits a delay required for a proper operation.
     */
    function load(options) {
        var _a;
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var delayFallback, debug, getComponents;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if ((_a = options.monitoring) !== null && _a !== void 0 ? _a : true) {
                            monitor();
                        }
                        delayFallback = options.delayFallback, debug = options.debug;
                        return [4 /*yield*/, prepareForSources(delayFallback)];
                    case 1:
                        _b.sent();
                        getComponents = loadBuiltinSources({ cache: {}, debug: debug });
                        return [2 /*return*/, makeAgent(getComponents, debug)];
                }
            });
        });
    }

    // The default export is a syntax sugar (`import * as FP from '...' → import FP from '...'`).
    // It should contain all the public exported values.
    var index = { load: load, hashComponents: hashComponents, componentsToDebugString: componentsToDebugString };
    // The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
    /** Not documented, out of Semantic Versioning, usage is at your own risk */
    var murmurX64Hash128 = x64hash128;

    exports.componentsToDebugString = componentsToDebugString;
    exports.default = index;
    exports.getFullscreenElement = getFullscreenElement;
    exports.getUnstableAudioFingerprint = getUnstableAudioFingerprint;
    exports.getUnstableCanvasFingerprint = getUnstableCanvasFingerprint;
    exports.getUnstableScreenFrame = getUnstableScreenFrame;
    exports.getUnstableScreenResolution = getUnstableScreenResolution;
    exports.getWebGLContext = getWebGLContext;
    exports.hashComponents = hashComponents;
    exports.isAndroid = isAndroid;
    exports.isChromium = isChromium;
    exports.isDesktopWebKit = isDesktopWebKit;
    exports.isEdgeHTML = isEdgeHTML;
    exports.isGecko = isGecko;
    exports.isSamsungInternet = isSamsungInternet;
    exports.isTrident = isTrident;
    exports.isWebKit = isWebKit;
    exports.load = load;
    exports.loadSources = loadSources;
    exports.murmurX64Hash128 = murmurX64Hash128;
    exports.prepareForSources = prepareForSources;
    exports.sources = sources;
    exports.transformSource = transformSource;
    exports.withIframe = withIframe;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
