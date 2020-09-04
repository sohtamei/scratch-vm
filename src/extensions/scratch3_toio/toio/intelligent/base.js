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
 * Base class for commonly used in derived classes.
 */

var IntelligentBase =
/** @class */
function () {
  function IntelligentBase(coreCube) {
    this.detachStartTime = null;
    this.coreCube = coreCube;
  }
  /**
   * Start a loop to repeatedly drive motors and check the current state.
   *
   * @param {CancelablePromise} promise Promise to move or rotate the Core Cube.
   * @param {function} callback Callback is called to drive motors and/or check
   * the current state is close to the target.
   */


  IntelligentBase.prototype.startLoop = function (promise, callback) {
    var _this = this;

    this.promise = promise;

    var tick = function tick() {
      if (!_this.coreCube.isConnected()) {
        _this.stopLoop();

        return;
      }

      if (_this.promise === null || _this.promise.isCanceled) {
        return;
      }

      var isCompleted = callback();

      if (isCompleted) {
        // Workaround for a next immediate intelligent command to work as expected.
        setTimeout(function () {
          return _this.stopLoop();
        }, IntelligentBase.WAIT_FOR_NEXT_COMMAND);
        return;
      } // Initiate a next task to be executed when it is ready.


      setTimeout(tick, 1);
    };

    setTimeout(tick, 1);
  };
  /**
   * Stop the loop.
   */


  IntelligentBase.prototype.stopLoop = function () {
    if (this.promise) {
      this.promise.cancel(true, true);
      this.promise = null;
    }
  };
  /**
   * Check if the Core Cube is detached from the mat.
   *
   * Avoid chattering, this checks for a while to keep detached.
   * @returns {boolean} Flag if the Core Cube is detached from a mat.
   */


  IntelligentBase.prototype.isDetachedFromMat = function () {
    var state = this.coreCube.getState();

    if (state.isTouched) {
      this.detachStartTime = null;
    } else {
      if (this.detachStartTime === null) {
        this.detachStartTime = Date.now();
      } else {
        var elapsedTime = Date.now() - this.detachStartTime;

        if (elapsedTime >= IntelligentBase.DETACH_DURATION) {
          this.detachStartTime = null;
          return true;
        }
      }
    }

    return false;
  };
  /**
   * Check if the current position is close to the given position.
   *
   * @param {number} x X coordinate of the target.
   * @param {number} y Y coordinate of the target.
   * @returns {boolean} Flag if the position is close to the given position.
   */


  IntelligentBase.prototype.isCloseToTargetPosition = function (x, y) {
    var state = this.coreCube.getState();
    var deltaX = x - state.rawX;
    var deltaY = y - state.rawY;
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance <= IntelligentBase.DISTANCE_THRESHOLD;
  };
  /**
   * Check if the current direction is close to the given direction.
   *
   * @param {number} direction Direction of the target.
   * @returns {boolean} Flag if the direction is close to the given direction.
   */


  IntelligentBase.prototype.isCloseToTargetDirection = function (direction) {
    var deltaAngle = direction - this.coreCube.getState().rawDirection;

    if (deltaAngle > 180) {
      deltaAngle -= 360;
    } else if (deltaAngle < -180) {
      deltaAngle += 360;
    }

    return Math.abs(deltaAngle) <= IntelligentBase.DIRECTION_THRESHOLD;
  };

  IntelligentBase.WAIT_FOR_NEXT_COMMAND = 100;
  IntelligentBase.DETACH_DURATION = 100;
  IntelligentBase.DISTANCE_THRESHOLD = 15;
  IntelligentBase.DIRECTION_THRESHOLD = 8;
  return IntelligentBase;
}();

exports.default = IntelligentBase;
