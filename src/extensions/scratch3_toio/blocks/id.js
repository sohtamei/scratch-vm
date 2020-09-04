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

var BlockType = require("scratch-vm/src/extension-support/block-type");

var formatMessage = require("format-message");

var coreCubeBlock_1 = __importDefault(require("./coreCubeBlock"));
/**
 * ID blocks.
 */


var IdBlocks =
/** @class */
function (_super) {
  __extends(IdBlocks, _super);

  function IdBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  IdBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'getXPosition',
      blockType: BlockType.REPORTER,
      text: formatMessage({
        id: 'toio.stateTypeMenu.x',
        default: 'x position',
        description: 'x position'
      })
    }, {
      opcode: 'getYPosition',
      blockType: BlockType.REPORTER,
      text: formatMessage({
        id: 'toio.stateTypeMenu.y',
        default: 'y position',
        description: 'y position'
      })
    }, {
      opcode: 'getDirection',
      blockType: BlockType.REPORTER,
      text: formatMessage({
        id: 'toio.stateTypeMenu.direction',
        default: 'direction',
        description: 'direction'
      })
    }, '---'];
  };
  /**
   * Get the current x position.
   *
   * @returns {number} X position.
   */


  IdBlocks.prototype.getXPosition = function () {
    return this.coreCube.getState().x;
  };
  /**
   * Get the current y position.
   *
   * @returns {number} Y position.
   */


  IdBlocks.prototype.getYPosition = function () {
    return this.coreCube.getState().y;
  };
  /**
   * Get the current direction.
   *
   * @returns {number} Direction.
   */


  IdBlocks.prototype.getDirection = function () {
    return this.coreCube.getState().direction;
  };

  return IdBlocks;
}(coreCubeBlock_1.default);

exports.default = IdBlocks;
