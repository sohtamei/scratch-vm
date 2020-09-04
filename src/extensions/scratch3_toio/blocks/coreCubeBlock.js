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
 * Base class for Core Cube blocks.
 */

var CoreCubeBlock =
/** @class */
function () {
  function CoreCubeBlock(coreCube) {
    this.coreCube = coreCube;
  }

  CoreCubeBlock.prototype.setBlocks = function (blocks) {
    this.blocks = blocks;
  };

  CoreCubeBlock.prototype.getInfo = function () {
    return [];
  };

  CoreCubeBlock.prototype.getFunctions = function () {
    var _this = this;

    return this.getInfo().map(function (block) {
      if (!block.opcode) {
        return block;
      }

      var func = _this[block.func || block.opcode];

      if (!func) {
        console.warn("Function \"" + block.opcode + "\" is missing");
        return;
      }

      return {
        opcode: block.opcode,
        func: func.bind(_this)
      };
    });
  };

  CoreCubeBlock.prototype.stop = function (forceToStop) {
    if (forceToStop === void 0) {
      forceToStop = false;
    }

    return forceToStop;
  };

  return CoreCubeBlock;
}();

exports.default = CoreCubeBlock;
