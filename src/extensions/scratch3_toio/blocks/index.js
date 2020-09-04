"use strict";
/**
 * Copyright (c) Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the BSD-3-Clause license found
 * in the LICENSE file in the root directory of this source tree.
 */

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var matRelative_1 = __importDefault(require("./matRelative"));

var matAbsolute_1 = __importDefault(require("./matAbsolute"));

var motor_1 = __importDefault(require("./motor"));

var id_1 = __importDefault(require("./id"));

var light_1 = __importDefault(require("./light"));

var sound_1 = __importDefault(require("./sound"));

var matGrid_1 = __importDefault(require("./matGrid"));

var mat_1 = __importDefault(require("./mat"));
/**
 * Core Cube blocks which are aggregated from each functionality.
 */


var Blocks =
/** @class */
function () {
  function Blocks(coreCube) {
    var _this = this; // Create a block instance.


    this.blocks = Blocks.BLOCK_CLASSES.map(function (blockClass) {
      return new blockClass(coreCube);
    });
    this.blocks.forEach(function (block) {
      block.setBlocks(_this.blocks);
    }); // Aggregate block information.

    this.info = this.merge(this.blocks, function (block) {
      return block.getInfo();
    }); // Aggregate block functions.

    this.functions = this.merge(this.blocks, function (block) {
      return block.getFunctions();
    }); // Aggregate block menus.

    var menus = this.merge(this.blocks, function (block) {
      return _this.getMenus(block);
    });
    this.menus = menus.reduce(function (acc, menu) {
      return __assign(__assign({}, acc), menu);
    }, {});
  } // Update texts according to the current locale.


  Blocks.prototype.updateTexts = function () {
    var _this = this;

    this.info = this.merge(this.blocks, function (block) {
      return block.getInfo();
    });
    var menus = this.merge(this.blocks, function (block) {
      return _this.getMenus(block);
    });
    this.menus = menus.reduce(function (acc, menu) {
      return __assign(__assign({}, acc), menu);
    }, {});
  }; // Utility function to aggregate something from blocks.


  Blocks.prototype.merge = function (blocks, func) {
    return blocks.reduce(function (acc, block) {
      var result = func(block);
      return result ? acc.concat(result) : acc;
    }, []);
  }; // Return menus which scratch-gui can read.


  Blocks.prototype.getMenus = function (blocks) {
    if (!blocks.menus) {
      return;
    }

    var result = {};

    for (var _i = 0, _a = Object.keys(blocks.menus); _i < _a.length; _i++) {
      var key = _a[_i];
      var menu = blocks.menus[key];
      result[menu.menu] = menu.values;
    }

    return result;
  };
  /**
   * This is called when the stop button is pressed.
   *
   * @param {boolean} forceToStop Flag if it forces to stop.
   */


  Blocks.prototype.stop = function (forceToStop) {
    this.blocks.forEach(function (block) {
      block.stop(forceToStop);
    });
  };

  Blocks.BLOCK_CLASSES = [matRelative_1.default, matAbsolute_1.default, id_1.default, matGrid_1.default, mat_1.default, motor_1.default, light_1.default, sound_1.default];
  return Blocks;
}();

exports.default = Blocks;
