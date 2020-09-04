"use strict";
/**
 * Copyright (c) Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the BSD-3-Clause license found
 * in the LICENSE file in the root directory of this source tree.
 */

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var base_1 = __importDefault(require("./base"));
/**
 * This serves intelligent functionalities on PC.
 */


var IntelligentOnPc =
/** @class */
function (_super) {
  __extends(IntelligentOnPc, _super);

  function IntelligentOnPc() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.speedCounter = 0;
    return _this;
  }
  /**
   * Move the Core Cube to the given position.
   *
   * @param {CancelablePromise} promise Promise to move the Core Cube.
   * @param {number} x X coordinate to move the Core Cube to.
   * @param {number} y Y coordinate to move the Core Cube to.
   * @param {number} speed Speed to move the Core Cube to.
   * @param {boolean} allowBackward Flag if backward movement is allowed if
   * needed. Default is false.
   */


  IntelligentOnPc.prototype.moveTo = function (promise, x, y, speed, allowBackward) {
    var _this = this;

    if (allowBackward === void 0) {
      allowBackward = false;
    } // Repeatedly drive motors and check if close to the target.


    this.startLoop(promise, function () {
      _this.doMoveTo(x, y, speed, allowBackward);

      return _this.isDetachedFromMat() || _this.isCloseToTargetPosition(x, y);
    });
  };
  /**
   * Move the Core Cube to the given position at each step.
   *
   * @param {number} x X coordinate to move the Core Cube to.
   * @param {number} y Y coordinate to move the Core Cube to.
   * @param {number} speed Speed to move the Core Cube to.
   * @param {boolean} allowBackward Flag if backward movement is allowed if
   * needed. Default is false.
   */


  IntelligentOnPc.prototype.doMoveTo = function (x, y, speed, allowBackward) {
    if (allowBackward === void 0) {
      allowBackward = false;
    }

    var deltaX = x - this.coreCube.getState().rawX;
    var deltaY = y - this.coreCube.getState().rawY;
    var deltaAngle = Math.atan2(deltaY, deltaX) - this.coreCube.getState().rawDirection * IntelligentOnPc.DEGREE_TO_RADIAN;

    while (deltaAngle < -Math.PI) {
      deltaAngle += IntelligentOnPc.TWICE_PI;
    }

    while (deltaAngle > Math.PI) {
      deltaAngle -= IntelligentOnPc.TWICE_PI;
    }

    var isBackward = allowBackward && Math.abs(deltaAngle) > IntelligentOnPc.HALF_PI;

    if (isBackward) {
      deltaAngle = deltaAngle + Math.PI;

      while (deltaAngle < -Math.PI) {
        deltaAngle += IntelligentOnPc.TWICE_PI;
      }

      while (deltaAngle > Math.PI) {
        deltaAngle -= IntelligentOnPc.TWICE_PI;
      }
    }

    var leftSpeed = speed;
    var rightSpeed = speed;

    if (deltaAngle >= 0) {
      rightSpeed *= (IntelligentOnPc.HALF_PI - deltaAngle) / IntelligentOnPc.HALF_PI;
    } else {
      leftSpeed *= (IntelligentOnPc.HALF_PI + deltaAngle) / IntelligentOnPc.HALF_PI;
    }

    if (!isBackward) {
      this.coreCube.move([leftSpeed, rightSpeed]);
    } else {
      this.coreCube.move([-rightSpeed, -leftSpeed]);
    }
  };
  /**
   * Point the Core Cube in the given direction.
   *
   * @param {CancelablePromise} promise Promise to rotate the Core Cube.
   * @param {number} direction Direction to point the Core Cube in.
   * @param {number} speed Speed to point the Core Cube in the direction.
   */


  IntelligentOnPc.prototype.pointInDirection = function (promise, direction, speed) {
    var _this = this;

    this.speedCounter = 0; // Repeatedly drive motors and check if close to the target.

    this.startLoop(promise, function () {
      var outSpeed = _this.doPointInDirection(direction, speed); // Check if the current speed is less than minimum for driving motor.


      if (Math.abs(outSpeed) <= IntelligentOnPc.MINIMUM_SPEED) {
        _this.speedCounter++;
      } // Check if the Core Cube no longer turn.


      var isTimeout = _this.speedCounter > 5;
      return isTimeout || _this.isDetachedFromMat() || _this.isCloseToTargetDirection(direction);
    });
  };
  /**
   * Point the Core Cube in the given direction at each step.
   *
   * @param {number} direction Direction to point the Core Cube in.
   * @param {number} speed Speed to point the Core Cube in the direction.
   * @returns {number} Calculated speed.
   */


  IntelligentOnPc.prototype.doPointInDirection = function (direction, speed) {
    var deltaAngle = (direction - this.coreCube.getState().rawDirection) * IntelligentOnPc.DEGREE_TO_RADIAN;

    if (deltaAngle < -Math.PI) {
      deltaAngle += IntelligentOnPc.TWICE_PI;
    }

    if (deltaAngle > Math.PI) {
      deltaAngle -= IntelligentOnPc.TWICE_PI;
    }

    var outSpeed;

    if (Math.abs(deltaAngle) < IntelligentOnPc.HALF_PI) {
      outSpeed = speed * Math.sin(deltaAngle);
    } else {
      outSpeed = deltaAngle >= 0 ? speed : -speed;
    }

    this.coreCube.move([outSpeed, -outSpeed]);
    return outSpeed;
  }; // Minimum speed for driving motor.


  IntelligentOnPc.MINIMUM_SPEED = 11;
  IntelligentOnPc.HALF_PI = Math.PI / 2;
  IntelligentOnPc.TWICE_PI = Math.PI * 2;
  IntelligentOnPc.DEGREE_TO_RADIAN = Math.PI / 180;
  return IntelligentOnPc;
}(base_1.default);

exports.default = IntelligentOnPc;
