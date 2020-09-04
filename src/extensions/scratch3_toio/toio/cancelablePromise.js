"use strict";
/**
 * Copyright (c) Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the BSD-3-Clause license found
 * in the LICENSE file in the root directory of this source tree.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PCancelable = require("p-cancelable");
/**
 * This serves promise which can be canceled.
 */


var CancelablePromise =
/** @class */
function () {
  /**
   * Generate a cancelable promise.
   *
   * This cancelable promise is used to execute block which can be interrupted by another block
   * or be stopped by pressing the stop button.
   *
   * @param {?function} callback Callback to be called when this promise is generated.
   * @param {?function} cancelCallback Callback to be called when this promise is canceled.
   * @param {?number} duration Timeout duration if needed.
   */
  function CancelablePromise(callback, cancelCallback, duration) {
    var _this = this;

    this.promise = null;
    this.resolve = null;
    this.timer = null;
    this.cancelPromise = null;
    this.promise = new PCancelable(function (resolve, _, onCancel) {
      _this.resolve = resolve;
      onCancel.shouldReject = false;
      onCancel(function () {
        return _this.cancel(false);
      });

      if (callback) {
        callback(_this);
      }
    });
    this.cancelCallback = cancelCallback; // Start a timer if duration is specified.

    if (typeof duration === 'number' && duration > 0) {
      this.timer = window.setTimeout(function () {
        _this.cancel(true);
      }, duration);
    }
  }

  Object.defineProperty(CancelablePromise.prototype, "rawPromise", {
    /**
     * Return a raw promise instead of this cancelable promise.
     */
    get: function get() {
      return this.promise;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Cancel the promise.
   *
   * @param {boolean} needsStop Flag if it forces to stop.
   * @param {boolean} immediate Flag if it needs to stop immediately.
   */

  CancelablePromise.prototype.cancel = function (needsStop, immediate) {
    var _this = this;

    if (immediate === void 0) {
      immediate = false;
    }

    if (!needsStop && this.cancelPromise) {
      this.cancelPromise.cancel();
      this.cancelPromise = null;
    }

    if (needsStop) {
      if (this.cancelCallback) {
        if (immediate) {
          this.cancelCallback();
        } else {
          this.cancelPromise = new PCancelable(function (_resolve, _reject, onCancel) {
            var timer = setTimeout(function () {
              return _this.cancelCallback();
            }, 50);
            onCancel.shouldReject = false;
            onCancel(function () {
              return clearTimeout(timer);
            });
          });
        }
      }
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.resolve) {
      this.resolve();
      this.resolve = null;
    }

    if (this.promise) {
      this.promise.cancel();
      this.promise = null;
    }
  };

  Object.defineProperty(CancelablePromise.prototype, "isCanceled", {
    /**
     * Return a flag if this promise has been already canceled.
     */
    get: function get() {
      return this.promise === null || this.promise.isCanceled;
    },
    enumerable: true,
    configurable: true
  });
  return CancelablePromise;
}();

exports.default = CancelablePromise;
