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
/**
 * Mat blocks to move the Core Cube in relative coordinate system.
 */


var MatRelativeBlocks =
/** @class */
function (_super) {
  __extends(MatRelativeBlocks, _super);

  function MatRelativeBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MatRelativeBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'moveSteps',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.moveSteps',
        default: 'move [DIRECTION] at [SPEED] speed [STEPS] steps',
        description: 'move forward or backward with the specified steps'
      }),
      arguments: {
        DIRECTION: this.menus.MoveDirections,
        SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 70
        },
        STEPS: {
          type: ArgumentType.NUMBER,
          defaultValue: 100
        }
      }
    }, {
      opcode: 'rotateBy',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.rotateBy',
        default: 'rotate [DIRECTION] at [SPEED] speed by [ANGLE]',
        description: 'rotate left or right by the specified angle'
      }),
      arguments: {
        DIRECTION: this.menus.RotateDirections,
        SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 30
        },
        ANGLE: {
          type: ArgumentType.NUMBER,
          defaultValue: 90
        }
      }
    }, '---'];
  };

  Object.defineProperty(MatRelativeBlocks.prototype, "menus", {
    get: function get() {
      return {
        MoveDirections: {
          type: ArgumentType.STRING,
          menu: 'moveDirections',
          values: {
            items: [{
              text: formatMessage({
                id: 'toio.moveForMenu.forward',
                default: 'forward',
                description: 'forward'
              }),
              value: 'forward'
            }, {
              text: formatMessage({
                id: 'toio.moveForMenu.backward',
                default: 'backward',
                description: 'backward'
              }),
              value: 'backward'
            }],
            acceptReporters: true
          },
          defaultValue: 'forward'
        },
        RotateDirections: {
          type: ArgumentType.STRING,
          menu: 'rotateDirections',
          values: {
            items: [{
              text: formatMessage({
                id: 'toio.rotateForMenu.left',
                default: 'left',
                description: 'left'
              }),
              value: 'left'
            }, {
              text: formatMessage({
                id: 'toio.rotateForMenu.right',
                default: 'right',
                description: 'right'
              }),
              value: 'right'
            }],
            acceptReporters: true
          },
          defaultValue: 'left'
        }
      };
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Move the Core Cube by the given steps.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to move the Core Cube.
   */

  MatRelativeBlocks.prototype.moveSteps = function (args) {
    this.coreCube.cancel('motor');
    var state = this.coreCube.getState(); // If the CoreCube is not touching any mat, do nothing

    if (!state.isTouched || state.x === undefined || state.y === undefined) {
      return this.coreCube.stopMotors();
    }

    var steps = Cast.toNumber(args.STEPS);

    if (steps === 0) {
      return this.coreCube.stopMotors();
    }

    var speed = args.SPEED !== undefined ? Cast.toNumber(args.SPEED) : 70;

    if (speed < MatRelativeBlocks.MIN_SPEED) {
      return this.coreCube.stopMotors();
    }

    var distance = steps * (args.DIRECTION === 'forward' ? +1 : -1);
    var target = this.coreCube.targetPose.move(distance); // console.info('moveSteps', target.x, target.y)

    return this.coreCube.moveTo(target.x, target.y, speed, true);
  };
  /**
   * Rotate the Core Cube by the given direction.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to rotate the Core Cube.
   */


  MatRelativeBlocks.prototype.rotateBy = function (args) {
    this.coreCube.cancel('motor'); // If the CoreCube is not touching any mat, do nothing

    if (!this.coreCube.getState().isTouched) {
      return;
    }

    var angle = Cast.toNumber(args.ANGLE);

    if (angle === 0) {
      return;
    }

    var speed = args.SPEED !== undefined ? Cast.toNumber(args.SPEED) : 40;

    if (speed < MatRelativeBlocks.MIN_SPEED) {
      return;
    }

    var direction = args.DIRECTION === 'left' ? -1 : +1;
    var target = this.coreCube.targetPose.rotate(angle * direction); // console.info('rotateBy', target.direction)

    return this.coreCube.pointInDirection(target.direction, speed);
  };

  MatRelativeBlocks.MIN_SPEED = 10;
  return MatRelativeBlocks;
}(coreCubeBlock_1.default);

exports.default = MatRelativeBlocks;
