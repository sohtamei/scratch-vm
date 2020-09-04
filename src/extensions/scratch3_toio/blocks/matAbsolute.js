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

var ArgumentType = require("scratch-vm/src/extension-support/argument-type");

var BlockType = require("scratch-vm/src/extension-support/block-type");

var Cast = require("scratch-vm/src/util/cast");

var formatMessage = require("format-message");

var coreCubeBlock_1 = __importDefault(require("./coreCubeBlock"));

var mat_1 = __importDefault(require("../toio/mat"));
/**
 * Mat blocks to move the Core Cube in absolute coordinate system.
 */


var MatAbsoluteBlocks =
/** @class */
function (_super) {
  __extends(MatAbsoluteBlocks, _super);

  function MatAbsoluteBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MatAbsoluteBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'moveTo',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.moveTo',
        default: 'move to x: [X] y: [Y] at [SPEED] speed',
        description: 'move to the specified position'
      }),
      arguments: {
        X: {
          type: ArgumentType.NUMBER,
          defaultValue: 0
        },
        Y: {
          type: ArgumentType.NUMBER,
          defaultValue: 0
        },
        SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 70
        }
      }
    }, {
      opcode: 'pointInDirection',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.pointInDirection',
        default: 'point in direction [DIRECTION] at [SPEED] speed',
        description: 'point in the specified direction'
      }),
      arguments: {
        DIRECTION: {
          type: ArgumentType.ANGLE,
          defaultValue: 0
        },
        SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 40
        }
      }
    }];
  };
  /**
   * Move the Core Cube to the given position.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to move the Core Cube.
   */


  MatAbsoluteBlocks.prototype.moveTo = function (args) {
    this.coreCube.cancel('motor');
    var state = this.coreCube.getState(); // If the CoreCube is not touching any mat, do nothing

    if (!state.isTouched || state.x === undefined || state.y === undefined) {
      return this.coreCube.stopMotors();
    }

    var speed = args.SPEED !== undefined ? Cast.toNumber(args.SPEED) : 70; // If the speed is not enough to drive motors, do nothing.

    if (speed < MatAbsoluteBlocks.MINIMUM_SPEED) {
      return this.coreCube.stopMotors();
    }

    var x = Cast.toNumber(args.X);
    var y = Cast.toNumber(args.Y);
    var allowBackward = args.ALLOW_BACKWARD === true;

    var _a = mat_1.default.convertToMatCoordinate(x, y, state.matColumn, state.matRow),
        matX = _a.matX,
        matY = _a.matY;

    this.coreCube.targetPose.pose = {
      x: matX,
      y: matY
    };
    return this.coreCube.moveTo(matX, matY, speed, allowBackward);
  };
  /**
   * Point the Core Cube in the given direction.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to point the Core Cube in the direction.
   */


  MatAbsoluteBlocks.prototype.pointInDirection = function (args) {
    this.coreCube.cancel('motor'); // If the CoreCube is not touching any mat, do nothing

    if (!this.coreCube.getState().isTouched) {
      return;
    }

    var speed = args.SPEED !== undefined ? Cast.toNumber(args.SPEED) : 40; // If the speed is not enough to drive motors, do nothing.

    if (speed < MatAbsoluteBlocks.MINIMUM_SPEED) {
      return;
    }

    var rawDirection = (Cast.toNumber(args.DIRECTION) + 270) % 360;
    this.coreCube.targetPose.pose = {
      direction: rawDirection
    };
    return this.coreCube.pointInDirection(rawDirection, speed);
  }; // Minimum speed to drive motors.


  MatAbsoluteBlocks.MINIMUM_SPEED = 10;
  return MatAbsoluteBlocks;
}(coreCubeBlock_1.default);

exports.default = MatAbsoluteBlocks;
