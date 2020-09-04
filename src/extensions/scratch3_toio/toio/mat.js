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
 * This defines Mat-specific constants and useful functionalities.
 */

var Mat =
/** @class */
function () {
  function Mat() {}

  Mat.convertFromMatCoordinate = function (matX, matY) {
    var matColumn = Math.floor(matX / this.Region.X.BOUNDARY);
    var matRow = 0; // Math.floor(matY / this.Region.Y.BOUNDARY)

    var xRange = this.Region.X.Range[matColumn];
    var yRange = this.Region.Y.Range[matRow];
    return {
      x: this.convertFromMatCoordinateRange(matX, xRange.MIN, xRange.MAX),
      y: -this.convertFromMatCoordinateRange(matY, yRange.MIN, yRange.MAX),
      matColumn: matColumn,
      matRow: matRow
    };
  };

  Mat.convertToMatCoordinate = function (x, y, matColumn, matRow) {
    var xRange = this.Region.X.Range[matColumn];
    var yRange = this.Region.Y.Range[matRow];
    return {
      matX: this.convertToMatCoordinateRange(x, xRange.MIN, xRange.MAX),
      matY: this.convertToMatCoordinateRange(-y, yRange.MIN, yRange.MAX)
    };
  };

  Mat.convertFromMatCoordinateRange = function (value, min, max) {
    return ((value - min) / (max - min) * 2 - 1) * Mat.COORDINATE_RANGE;
  };

  Mat.convertToMatCoordinateRange = function (value, min, max) {
    return (value / Mat.COORDINATE_RANGE + 1) / 2 * (max - min) + min;
  };

  Mat.convertDirection = function (direction) {
    var d = direction - 270;
    return d + (d <= -180 ? 360 : 0);
  };

  Mat.convertXToColumn = function (x) {
    var columnIndex = Math.floor((x + 180) / 40) - 4;
    return Math.min(Math.max(columnIndex, -4), 4);
  };

  Mat.convertYToRow = function (y) {
    var rowIndex = Math.floor((y + 180) / 40) - 4;
    return Math.min(Math.max(rowIndex, -4), 4);
  };

  Mat.convertColumnToX = function (column) {
    return column / Mat.Grid.COLUMNS * Mat.COORDINATE_RANGE * 2;
  };

  Mat.convertRowToY = function (row) {
    return row / Mat.Grid.ROWS * Mat.COORDINATE_RANGE * 2;
  };

  Mat.checkIfOnMat = function (state) {
    return state.isTouched && state.standardId === null;
  };

  Mat.checkIfOnColoredMat = function (state) {
    return state.rawX >= Mat.Region.X.BOUNDARY && state.rawY < Mat.Region.Y.BOUNDARY;
  };

  Mat.checkIfMatchColor = function (state, type) {
    if (!state.isTouched || state.standardId !== null) {
      return false;
    }

    var column = this.convertXToColumn(state.x);
    var row = this.convertYToRow(state.y);
    var colorCode = Mat.COLOR_CODES_ON_MAT_GRID[4 - row][column + 4];
    var color = Mat.COLORS[colorCode];
    return type.indexOf(color) !== -1;
  };

  Mat.Region = {
    X: {
      BOUNDARY: 500,
      Range: [{
        MIN: 52,
        MAX: 445
      }, {
        MIN: 554,
        MAX: 947
      }]
    },
    Y: {
      BOUNDARY: 500,
      Range: [{
        MIN: 52,
        MAX: 445
      }, {
        MIN: 569,
        MAX: 953
      }]
    }
  };
  Mat.COORDINATE_RANGE = 180;
  Mat.FROM_SCRATCH_TO_TOIO_COORDINATE = 410 / 360;
  Mat.Grid = {
    Border: {
      LEFT: 555,
      RIGHT: 947,
      TOP: 53,
      BOTTOM: 446
    },
    COLUMNS: 9,
    ROWS: 9
  };
  Mat.COLOR_CODES_ON_MAT_GRID = ['wbwywrwrw', 'gwrwbwbwy', 'wywywgwgw', 'bwgwrwbwr', 'wrwywgwgw', 'ywbwbwywr', 'wgwrwgwbw', 'bwywbwrwy', 'wrwgwywgw'];
  Mat.COLORS = {
    w: 'white',
    b: 'blue',
    g: 'green',
    y: 'yellow',
    r: 'red'
  };
  return Mat;
}();

exports.default = Mat;
