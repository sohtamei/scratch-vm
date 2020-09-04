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
 * Motor blocks.
 */


var MotorBlocks =
/** @class */
function (_super) {
  __extends(MotorBlocks, _super);

  function MotorBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MotorBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'moveFor',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.moveFor',
        default: 'move [DIRECTION] at [SPEED] speed for [DURATION] seconds',
        description: 'move forward or backward for the specified duration'
      }),
      arguments: {
        DIRECTION: this.menus.MoveDirections,
        SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 50
        },
        DURATION: {
          type: ArgumentType.NUMBER,
          defaultValue: 1
        }
      }
    }, {
      opcode: 'rotateFor',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.rotateFor',
        default: 'rotate [DIRECTION] at [SPEED] speed for [DURATION] seconds',
        description: 'rotate left or right for the specified duration'
      }),
      arguments: {
        DIRECTION: this.menus.RotateDirections,
        SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 30
        },
        DURATION: {
          type: ArgumentType.NUMBER,
          defaultValue: 1
        }
      }
    }, {
      opcode: 'moveWheelsFor',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.moveWheelsFor',
        default: 'move left wheel forward at [LEFT_SPEED] speed and right wheel forward at [RIGHT_SPEED] speed' + 'for [DURATION] seconds',
        description: 'move left and right wheels for the specified direction'
      }),
      arguments: {
        LEFT_SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 50
        },
        RIGHT_SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 50
        },
        DURATION: {
          type: ArgumentType.NUMBER,
          defaultValue: 1
        }
      }
    }, {
      opcode: 'stopWheels',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.stopWheels',
        default: 'stop wheels',
        description: 'stop wheels'
      })
    }, '---'];
  };

  Object.defineProperty(MotorBlocks.prototype, "menus", {
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
   * Move the Core Cube for the given duration.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to move the Core Cube.
   */

  MotorBlocks.prototype.moveFor = function (args) {
    var _this = this;

    this.coreCube.cancel('motor');
    var duration = Cast.toNumber(args.DURATION);

    if (duration <= 0) {
      return;
    }

    this.coreCube.targetPose.reset();
    var direction = args.DIRECTION === 'forward' ? +1 : -1;
    var speed = Cast.toNumber(args.SPEED) * direction;
    this.coreCube.move([speed, speed]);
    return this.coreCube.generateCancelablePromise('motor', null, function () {
      return _this.stop(true);
    }, duration * 1000);
  };
  /**
   * Rotate the Core Cube for the given duration.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to rotate the Core Cube.
   */


  MotorBlocks.prototype.rotateFor = function (args) {
    var _this = this;

    this.coreCube.cancel('motor');
    var duration = Cast.toNumber(args.DURATION);

    if (duration <= 0) {
      return;
    }

    this.coreCube.targetPose.reset();
    var direction = args.DIRECTION === 'left' ? +1 : -1;
    var speed = Cast.toNumber(args.SPEED) * direction;
    this.coreCube.move([-speed, +speed]);
    return this.coreCube.generateCancelablePromise('motor', null, function () {
      return _this.stop(true);
    }, duration * 1000);
  };
  /**
   * Move the Core Cube by specifying speeds for left and right motors.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to move the Core Cube.
   */


  MotorBlocks.prototype.moveWheelsFor = function (args) {
    var _this = this;

    this.coreCube.cancel('motor');
    var duration = Cast.toNumber(args.DURATION);

    if (duration <= 0) {
      return;
    }

    this.coreCube.targetPose.reset();
    var leftSpeed = Cast.toNumber(args.LEFT_SPEED);
    var rightSpeed = Cast.toNumber(args.RIGHT_SPEED);
    this.coreCube.move([leftSpeed, rightSpeed]);
    return this.coreCube.generateCancelablePromise('motor', null, function () {
      return _this.stop(true);
    }, duration * 1000);
  };
  /**
   * Stop wheels.
   */


  MotorBlocks.prototype.stopWheels = function () {
    this.stop(true);
  };
  /**
   * This is called when the stop button is pressed.
   *
   * @param {boolean} forceToStop Flag if it forces to stop.
   * @returns {boolean} Flag if it stops.
   */


  MotorBlocks.prototype.stop = function (forceToStop) {
    // this.coreCube.cancel('motor', true)
    if (forceToStop === void 0) {
      forceToStop = false;
    }

    if (forceToStop) {
      this.coreCube.move([0, 0]);
    }

    this.coreCube.intelligent.stop();
    return forceToStop;
  };

  return MotorBlocks;
}(coreCubeBlock_1.default);

exports.default = MotorBlocks;
