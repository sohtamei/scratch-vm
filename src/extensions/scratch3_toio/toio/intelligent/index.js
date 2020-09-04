"use strict";
/**
 * Copyright (c) Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the BSD-3-Clause license found
 * in the LICENSE file in the root directory of this source tree.
 */

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var coreCube_1 = __importDefault(require("./coreCube"));

var pc_1 = __importDefault(require("./pc"));
/**
 * This serves intelligent functionalities to control the Core Cube.
 *
 * This checks protocol version of the Core Cube if it supports intelligent
 * functionalities to move to the given position and point in the given direction
 * by Core Cube. If so, this delegates the functionalities to the Core Cube.
 * Otherwise, the functionalities are processed by PC.
 */


var Intelligent =
/** @class */
function () {
  function Intelligent(coreCube) {
    this.update(coreCube);
  }
  /**
   * Check protocol version of the Core Cube when it is connected.
   *
   * @param {object} coreCube Core Cube instance.
   */


  Intelligent.prototype.update = function (coreCube) {
    this.device = coreCube.checkIfProtocolVersionGreaterThanOrEqual(2, 1, 0) ? new coreCube_1.default(coreCube) : new pc_1.default(coreCube);
  };
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


  Intelligent.prototype.moveTo = function (promise, x, y, speed, allowBackward) {
    if (allowBackward === void 0) {
      allowBackward = false;
    }

    this.device.moveTo(promise, x, y, speed, allowBackward);
  };
  /**
   * Point the Core Cube in the given direction.
   *
   * @param {CancelablePromise} promise Promise to rotate the Core Cube.
   * @param {number} direction Direction to point the Core Cube in.
   * @param {number} speed Speed to point the Core Cube in the direction.
   */


  Intelligent.prototype.pointInDirection = function (promise, direction, speed) {
    this.device.pointInDirection(promise, direction, speed);
  };
  /**
   * Stop the movement.
   */


  Intelligent.prototype.stop = function () {
    this.device.stopLoop();
  };

  return Intelligent;
}();

exports.default = Intelligent;
