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

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

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

var formatMessage = require("format-message");

var coreCubeBlock_1 = __importDefault(require("./coreCubeBlock"));

var mat_1 = __importDefault(require("../toio/mat"));

var card_1 = __importDefault(require("../toio/card"));

var simpleCard_1 = __importDefault(require("../toio/simpleCard"));

var translations_1 = __importDefault(require("../translations"));
/**
 * Mat blocks.
 */


var MatBlocks =
/** @class */
function (_super) {
  __extends(MatBlocks, _super);

  function MatBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MatBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'whenTouched',
      blockType: BlockType.HAT,
      text: formatMessage({
        id: 'toio.whenTouched',
        default: 'when [TYPE] is touched',
        description: 'when mat, card or sticker is touched'
      }),
      arguments: {
        TYPE: this.menus.DetectedTypes
      }
    }, {
      opcode: 'isTouched',
      blockType: BlockType.BOOLEAN,
      text: formatMessage({
        id: 'toio.isTouched',
        default: '[TYPE] is touched',
        description: 'If mat, card or sticker is touched'
      }),
      func: 'whenTouched',
      arguments: {
        TYPE: this.menus.DetectedTypes
      }
    }, {
      opcode: 'getTouchedSimpleCard',
      blockType: BlockType.REPORTER,
      text: formatMessage({
        id: 'toio.getTouchedSimpleCard',
        default: 'get touched simple card',
        description: 'get touched simple card'
      })
    }, '---'];
  };

  Object.defineProperty(MatBlocks.prototype, "menus", {
    get: function get() {
      var values = MatBlocks.MENUS.map(function (menuItem) {
        var id = 'toio.whenTouchedMenu.' + menuItem;
        var value = translations_1.default.en[id];
        return value ? {
          text: formatMessage({
            id: id,
            default: value,
            description: value
          }),
          value: value.message || value
        } : {
          text: menuItem,
          value: menuItem
        };
      });
      return {
        DetectedTypes: {
          type: ArgumentType.STRING,
          menu: 'detectedTypes',
          values: {
            items: values,
            acceptReporters: true
          },
          defaultValue: values[0].value
        }
      };
    },
    enumerable: true,
    configurable: true
  });
  /**
   * This detects when the Core Cube touches with a mat, a card or a sticker.
   *
   * @param {object} args Arguments in the block.
   * @returns {boolean} Flag if the Core Cube touches something.
   */

  MatBlocks.prototype.whenTouched = function (args) {
    var state = this.coreCube.getState();

    if (!state.isTouched) {
      return false;
    }

    switch (args.TYPE) {
      case 'mat':
        return mat_1.default.checkIfOnMat(state);

      case 'white cell':
      case 'red cell':
      case 'green cell':
      case 'yellow cell':
      case 'blue cell':
        return mat_1.default.checkIfMatchColor(state, args.TYPE);
    }

    var resultSimple = simpleCard_1.default.check(state, args.TYPE);

    if (resultSimple !== undefined) {
      return resultSimple;
    }

    var result = card_1.default.check(state, args.TYPE);

    if (result !== undefined) {
      return result;
    }

    return false;
  };

  MatBlocks.prototype.getTouchedSimpleCard = function () {
    var state = this.coreCube.getState();
    var label = simpleCard_1.default.getLabel(state);
    return label ? label : '';
  };

  MatBlocks.MENUS = __spreadArrays(['mat', 'whiteCell', 'redCell', 'greenCell', 'yellowCell', 'blueCell'], card_1.default.menus, simpleCard_1.default.menus);
  return MatBlocks;
}(coreCubeBlock_1.default);

exports.default = MatBlocks;
