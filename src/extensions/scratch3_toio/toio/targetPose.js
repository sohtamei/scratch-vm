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

var mat_1 = __importDefault(require("./mat"));
/**
 * This class manages an ideal Core Cube's position and direction.
 *
 * Since accuracy of an actual Core Cube behavior is not 100% perfect,
 * sequential behaviors accumulate errors which makes different result
 * from intention.
 * To avoid this, this calculates a target pose which is 100% accurate
 * and used for the Core Cube to move to or to point in.
 */


var TargetPose =
/** @class */
function () {
  function TargetPose(cube) {
    this.needUpdate = true;
    this.x = 0;
    this.y = 0;
    this.direction = 0;
    this.cube = cube;
  }

  Object.defineProperty(TargetPose.prototype, "pose", {
    /**
     * Return the current target pose.
     */
    get: function get() {
      var pose = {
        x: this.x,
        y: this.y,
        direction: this.direction
      };
      return pose;
    },

    /**
     * Update the target pose.
     *
     * @param {object} pose Pose to be updated.
     */
    set: function set(pose) {
      if (typeof pose.x === 'number') {
        this.x = pose.x;
      }

      if (typeof pose.y === 'number') {
        this.y = pose.y;
      }

      if (typeof pose.direction === 'number') {
        this.direction = pose.direction;
      }

      this.needUpdate = false;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Update the target pose if needed.
   */

  TargetPose.prototype.updatePoseIfNeeded = function () {
    var state = this.cube.getState();
    var newPose = null;

    if (this.needUpdate || this.checkIfActualPositionDifferFromTarget(TargetPose.DISTANCE_THRESHOLD)) {
      newPose = {
        x: state.rawX,
        y: state.rawY,
        direction: state.rawDirection
      };
    } else {
      if (this.checkIfActualDirectionDifferFromTarget(TargetPose.DIRECTION_THRESHOLD)) {
        newPose = {
          direction: state.rawDirection
        };
      }
    }

    if (newPose === null) {
      return;
    }

    this.pose = newPose;
    this.needUpdate = false;
  };
  /**
   * Check if the actual position is differ from the target position.
   *
   * @param {number} threshold Threshold to distinguish if it is differ.
   * @returns {boolean} Flag if the position is differ from the target.
   */


  TargetPose.prototype.checkIfActualPositionDifferFromTarget = function (threshold) {
    var actualPose = this.cube.getState();
    var dx = this.x - actualPose.rawX;
    var dy = this.y - actualPose.rawY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance > threshold;
  };
  /**
   * Check if the actual direction is differ from the target direction.
   *
   * @param {number} threshold Threshold to distinguish if it is differ.
   * @returns {boolean} Flag if the position is differ from the target.
   */


  TargetPose.prototype.checkIfActualDirectionDifferFromTarget = function (threshold) {
    var actualPose = this.cube.getState();
    var angle = (this.direction - actualPose.rawDirection) % 360;

    if (angle > 180) {
      angle -= 360;
    } else if (angle < -180) {
      angle += 360;
    }

    return Math.abs(angle) > threshold;
  };
  /**
   * Calculate 100% accurate position after the Core Cube moves.
   *
   * @param {number} distance Distance of the movement.
   * @returns {object} Calculated pose.a
   */


  TargetPose.prototype.move = function (distance) {
    this.updatePoseIfNeeded();
    this.x += Math.cos(this.direction * TargetPose.DEGREE_TO_RADIAN) * (distance * mat_1.default.FROM_SCRATCH_TO_TOIO_COORDINATE);
    this.y += Math.sin(this.direction * TargetPose.DEGREE_TO_RADIAN) * (distance * mat_1.default.FROM_SCRATCH_TO_TOIO_COORDINATE);
    this.x = Math.round(this.x * 100) / 100;
    this.y = Math.round(this.y * 100) / 100;
    return this.pose;
  };
  /**
   * Calculate 100% accurate direction after the Core Cube rotates.
   *
   * @param {number} angle Angle of the rotation.
   * @returns {object} Calculated pose.a
   */


  TargetPose.prototype.rotate = function (angle) {
    this.updatePoseIfNeeded();
    this.direction += angle;
    this.direction = Math.round(this.direction * 100) / 100; // Round the direction to [0, 360)

    if (this.direction > 360) {
      this.direction %= 360;
    } else if (this.direction < 0) {
      this.direction = 360 + this.direction % 360;
    }

    return this.pose;
  };
  /**
   * Mark the target pose as update needed.
   *
   * This is called when the target pose can no longer be accurately managed in some cases
   * such as the Core Cube is released from a mat.
   */


  TargetPose.prototype.reset = function () {
    this.needUpdate = true;
  };

  TargetPose.DEGREE_TO_RADIAN = Math.PI / 180;
  TargetPose.DISTANCE_THRESHOLD = 20 * 360 / 410;
  TargetPose.DIRECTION_THRESHOLD = 30;
  return TargetPose;
}();

exports.default = TargetPose;
