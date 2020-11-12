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

var blocksFactory_1 = __importDefault(require("./blocksFactory"));

var toio_1 = __importDefault(require("./toio"));

var gui_1 = __importDefault(require("./gui"));
/**
 * This is an array of toio extension's information which will be used for
 * building extensions to be integrated with scratch-gui and -vm.
 */


var EXTENSIONS_INFO = [{
  id: 'toio',
  name: 'toio',
  colors: ['#00a3bc', '#0094ab', '#0189a0'],
  preload: true
}, {
  id: 'toio2',
  name: 'toio #2',
  colors: ['#f6624c', '#d15340', '#c54835'],
  preload: false,
  options: {
    iconURL: toio_1.default.Image.LOGO2,
    insetIconURL: toio_1.default.Image.CORECUBE2_M,
    connectionIconURL: toio_1.default.Image.CORECUBE2_L,
    connectionSmallIconURL: toio_1.default.Image.CORECUBE2_M
  }
}];
/**
 * This is extensions with a ToioBlocks instance which is created by its
 * factory.
 */

var extensions = EXTENSIONS_INFO.map(function (ext) {
  return __assign(__assign({}, ext), {
    blocks: blocksFactory_1.default(ext.id, ext.name, ext.colors, ext.options)
  });
});
/**
 * This exports an object which is imported from scratch-gui and -vm.
 */

module.exports = {
  extensions: extensions.reduce(function (acc, ext) {
    var _a;

    return Object.assign(acc, (_a = {}, _a[ext.id] = function () {
      return ext.blocks;
    }, _a));
  }, {}),
  extensionsGuiInfo: [extensions.map(function (ext) {
    return ext.blocks.guiInfo;
  })[0]],
  preloadedExtensionsId: extensions.filter(function (ext) {
    return ext.preload;
  }).map(function (ext) {
    return ext.id;
  }),
  Gui: gui_1.default
};

