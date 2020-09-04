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
/**
 * Watchdog constantly checks if the connected Core Cube is still alive.
 */

var Watchdog =
/** @class */
function () {
  function Watchdog() {}
  /**
   * Start a watchdog.
   *
   * @param {function} checkFunction Function to check if the Core Cube is alive.
   * @param {duration} interval Interval to check.
   */


  Watchdog.prototype.start = function (checkFunction, interval) {
    var _this = this;

    this.stop();
    this.timer = window.setInterval(function () {
      if (_this.promise) {
        _this.stop();

        if (_this.onDisconnected) {
          _this.onDisconnected();
        }

        return;
      }

      if (checkFunction) {
        _this.promise = new Promise(function (resolve) {
          _this.resolve = resolve;
          checkFunction();
        }).then(function () {
          _this.promise = null;
        });
      }
    }, interval);
  };
  /**
   * This is called when the Core Cube is alive.
   */


  Watchdog.prototype.tick = function () {
    if (this.resolve) {
      this.resolve();
      this.resolve = null;
      this.promise = null;
    }
  };
  /**
   * Stop the watchdog.
   */


  Watchdog.prototype.stop = function () {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.promise = null;
  };

  return Watchdog;
}();

exports.default = Watchdog;


