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

var matAbsolute_1 = __importDefault(require("./matAbsolute"));

var mat_1 = __importDefault(require("../toio/mat"));
/**
 * Mat blocks which is used on a colored grid mat.
 */


var GridBlocks =
/** @class */
function (_super) {
  __extends(GridBlocks, _super);

  function GridBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  GridBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'moveToOnGrid',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.moveToOnGrid',
        default: 'move to column: [COLUMN] row: [ROW] at [SPEED] speed',
        description: 'move to the specified column and row'
      }),
      arguments: {
        COLUMN: this.menus.Values,
        ROW: this.menus.Values,
        SPEED: {
          type: ArgumentType.NUMBER,
          defaultValue: 70
        }
      }
    }, {
      opcode: 'getColumnIndex',
      blockType: BlockType.REPORTER,
      text: formatMessage({
        id: 'toio.getColumnIndex',
        default: 'column index on grid"',
        description: 'get column index on grid'
      })
    }, {
      opcode: 'getRowIndex',
      blockType: BlockType.REPORTER,
      text: formatMessage({
        id: 'toio.getRowIndex',
        default: 'row index on grid"',
        description: 'get row index on grid'
      })
    }, {
      opcode: 'whenGridTouched',
      blockType: BlockType.HAT,
      text: formatMessage({
        id: 'toio.whenGridTouched',
        default: 'when column: [COLUMN] row: [ROW] is touched',
        description: 'When specified grid is touched'
      }),
      arguments: {
        COLUMN: this.menus.Values,
        ROW: this.menus.Values
      }
    }, {
      opcode: 'isGridTouched',
      blockType: BlockType.BOOLEAN,
      text: formatMessage({
        id: 'toio.isGridTouched',
        default: 'column: [COLUMN] row: [ROW] is touched',
        description: 'If specified grid is touched'
      }),
      func: 'whenGridTouched',
      arguments: {
        COLUMN: this.menus.Values,
        ROW: this.menus.Values
      }
    }, '---'];
  };

  Object.defineProperty(GridBlocks.prototype, "menus", {
    get: function get() {
      return {
        Values: {
          type: ArgumentType.STRING,
          menu: 'stateTypes',
          values: {
            items: ['4', '3', '2', '1', '0', '-1', '-2', '-3', '-4'],
            acceptReporters: true
          },
          defaultValue: '0'
        },
        MatAxes: {
          type: ArgumentType.STRING,
          menu: 'matAxes',
          values: [{
            text: formatMessage({
              id: 'toio.getColumnOrRowIndexMenu.column',
              default: 'column',
              description: 'column'
            }),
            value: 'column'
          }, {
            text: formatMessage({
              id: 'toio.getColumnOrRowIndexMenu.row',
              default: 'row',
              description: 'row'
            }),
            value: 'row'
          }],
          defaultValue: 'column'
        }
      };
    },
    enumerable: true,
    configurable: true
  });

  GridBlocks.prototype.setBlocks = function (blocks) {
    var _this = this;

    _super.prototype.setBlocks.call(this, blocks);

    this.blocks.forEach(function (block) {
      if (block instanceof matAbsolute_1.default) {
        _this.matAbsoluteBlocks = block;
      }
    });
  };
  /**
   * Move the Core Cube to the given grid.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to move the Core Cube.
   */


  GridBlocks.prototype.moveToOnGrid = function (args) {
    var column = Cast.toNumber(args.COLUMN);
    var row = Cast.toNumber(args.ROW);
    var speed = args.SPEED !== undefined ? Cast.toNumber(args.SPEED) : 70;
    var x = mat_1.default.convertColumnToX(column);
    var y = mat_1.default.convertRowToY(row);
    return this.matAbsoluteBlocks.moveTo({
      X: x,
      Y: y,
      SPEED: speed
    });
  };
  /**
   * Return the current column index.
   *
   * @return {number} Current column index.
   */


  GridBlocks.prototype.getColumnIndex = function () {
    var state = this.coreCube.getState();
    return mat_1.default.convertXToColumn(state.x);
  };
  /**
   * Return the current row index.
   *
   * @return {number} Current row index.
   */


  GridBlocks.prototype.getRowIndex = function () {
    var state = this.coreCube.getState();
    return mat_1.default.convertYToRow(state.y);
  };
  /**
   * This detects when the Core Cube touches with the given grid.
   *
   * @param {object} args Arguments in the block.
   * @returns {boolean} Flag if the Core Cube touches the given grid.
   */


  GridBlocks.prototype.whenGridTouched = function (args) {
    var column = Cast.toNumber(args.COLUMN);
    var row = Cast.toNumber(args.ROW);
    var state = this.coreCube.getState();

    if (!state.isTouched) {
      return false;
    }

    return mat_1.default.convertXToColumn(state.x) === column && mat_1.default.convertYToRow(state.y) === row;
  };

  return GridBlocks;
}(coreCubeBlock_1.default);

exports.default = GridBlocks;
