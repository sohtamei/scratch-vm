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
 * Light blocks.
 */


var LightBlocks =
/** @class */
function (_super) {
  __extends(LightBlocks, _super);

  function LightBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  LightBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'setLightColorFor',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.setLightColorFor',
        default: '"set light color to [COLOR] for [DURATION] seconds',
        description: 'set light color'
      }),
      arguments: {
        COLOR: {
          type: ArgumentType.COLOR
        },
        DURATION: {
          type: ArgumentType.NUMBER,
          defaultValue: 1
        }
      }
    }, {
      opcode: 'turnOffLight',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.turnOffLight',
        default: 'turn off light',
        description: 'turn off light'
      })
    }, '---'];
  };
  /**
   * Turn on the light and set its color to the given color.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to set the color.
   */


  LightBlocks.prototype.setLightColorFor = function (args) {
    var duration = Cast.toNumber(args.DURATION);

    if (duration <= 0) {
      return;
    }

    var color = this.convertColorFromStringIntoIntegers(args.COLOR);
    return this.coreCube.setLightColor(color, duration);
  };
  /**
   * Convert a color from a string into an array of number.
   *
   * @param {string} color Color as a string.
   * @returns {Array<number>} RGB values.
   */


  LightBlocks.prototype.convertColorFromStringIntoIntegers = function (color) {
    var presetColor = LightBlocks.LightColors[color];

    if (presetColor) {
      return presetColor;
    }

    if (color[0] === '#') {
      // Hex
      var r = parseInt(color.slice(1, 3), 16);
      var g = parseInt(color.slice(3, 5), 16);
      var b = parseInt(color.slice(5, 7), 16);
      return [r, g, b];
    } else {
      // Array of decimal
      return color.split(' ').map(function (value) {
        return parseInt(value, 10);
      });
    }
  };
  /**
   * Turn off the light.
   */


  LightBlocks.prototype.turnOffLight = function () {
    this.stop(true);
  };
  /**
   * This is called when the stop button is pressed.
   *
   * @param {boolean} forceToStop Flag if it forces to stop.
   * @returns {boolean} Flag if it stops.
   */


  LightBlocks.prototype.stop = function (forceToStop) {
    if (forceToStop === void 0) {
      forceToStop = false;
    }

    if (forceToStop) {
      this.coreCube.turnOffLight();
    }

    return forceToStop;
  };

  LightBlocks.LightColors = {
    white: [255, 255, 255],
    red: [255, 0, 0],
    green: [0, 255, 0],
    yellow: [255, 255, 0],
    blue: [0, 0, 255],
    magenta: [255, 0, 255],
    cyan: [0, 255, 255]
  };
  return LightBlocks;
}(coreCubeBlock_1.default);

exports.default = LightBlocks;
