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

var coreCube_1 = __importDefault(require("../coreCube"));
/**
 * This serves intelligent functionalities on Core Cube.
 */


var IntelligentOnCoreCube =
/** @class */
function (_super) {
  __extends(IntelligentOnCoreCube, _super);

  function IntelligentOnCoreCube() {
    return _super !== null && _super.apply(this, arguments) || this;
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


  IntelligentOnCoreCube.prototype.moveTo = function (promise, x, y, speed, allowBackward) {
    var _this = this;

    if (allowBackward === void 0) {
      allowBackward = false;
    }

    var state = this.coreCube.getState(); // Clip the given position with x- or y-axis if x or y is negative

    if (x < 0) {
      y = state.rawY + (y - state.rawY) * state.rawX / (state.rawX - x);
      x = 0;
    }

    if (y < 0) {
      x = state.rawX + (x - state.rawX) * state.rawY / (state.rawY - y);
      y = 0;
    }

    var data = [// Type = auto move
    3, // Command index
    0, // Timeout = 255s
    0xff, allowBackward ? 0 : 1, speed, // Easing type = linear
    0, // Reserved
    0,
    /* tslint:disable:no-bitwise */
    // x
    x & 0xff, x >> 8, // y
    y & 0xff, y >> 8, // Angle = depend on movement
    0x00, 0x05 << 5
    /* tslint:enable:no-bitwise */
    ];
    this.coreCube.write(coreCube_1.default.CharacteristicUuid.MOTOR, data); // Repeatedly check if the current position is close to the target

    this.startLoop(promise, function () {
      return _this.isDetachedFromMat() || _this.isCloseToTargetPosition(x, y);
    });
  };
  /**
   * Point the Core Cube in the given direction.
   *
   * @param {CancelablePromise} promise Promise to rotate the Core Cube.
   * @param {number} direction Direction to point the Core Cube in.
   * @param {number} speed Speed to point the Core Cube in the direction.
   */


  IntelligentOnCoreCube.prototype.pointInDirection = function (promise, direction, speed) {
    var _this = this;

    var data = [3, 0, 0xff, 1, speed, 0, 0];
    /* tslint:disable:no-bitwise */

    data.push(0xff, 0xff); // keep current x position

    data.push(0xff, 0xff); // keep current y position

    data.push(direction & 0xff, direction >> 8 & 0x1f);
    /* tslint:enable:no-bitwise */

    this.coreCube.write(coreCube_1.default.CharacteristicUuid.MOTOR, data); // Repeatedly check if the current direction is close to the target

    this.startLoop(promise, function () {
      return _this.isDetachedFromMat() || _this.isCloseToTargetDirection(direction);
    });
  };

  IntelligentOnCoreCube.HALF_PI = Math.PI / 2;
  IntelligentOnCoreCube.TWICE_PI = Math.PI * 2;
  IntelligentOnCoreCube.DEGREE_TO_RADIAN = Math.PI / 180;
  return IntelligentOnCoreCube;
}(base_1.default);

exports.default = IntelligentOnCoreCube;
