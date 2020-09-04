"use strict";
/**
 * Copyright (c) Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the BSD-3-Clause license found
 * in the LICENSE file in the root directory of this source tree.
 */

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var toio_1 = __importDefault(require("../toio")); // Strings to distinguish Scratch's trademarks which need to be removed.


var ScratchTrademarks = {
  SPRITES: ['Cat', 'Cat Flying', 'Giga', 'Giga Walking', 'Gobo', 'Nano', 'Pico', 'Pico Walking', 'Tera'],
  COSTUMES: ['Cat Flying-', 'Cat-', 'Giga Walk', 'Giga-', 'Gobo-', 'Nano-', 'Pico Walk', 'Pico-', 'Tera-']
}; // Defines and functions for scratch-gui to refer.

var Gui = {
  INFO: {
    collaborator: toio_1.default.COMPANY,
    iconURL: toio_1.default.Image.LOGO,
    insetIconURL: toio_1.default.Image.CORECUBE_M,
    featured: true,
    disabled: false,
    bluetoothRequired: true,
    internetConnectionRequired: true,
    launchPeripheralConnectionFlow: true,
    useAutoScan: false,
    connectionIconURL: toio_1.default.Image.CORECUBE_L,
    connectionSmallIconURL: toio_1.default.Image.CORECUBE_M,
    connectingMessage: '接続中',
    helpLink: toio_1.default.URL_FOR_SETUP
  },
  URL: toio_1.default.URL,
  //DEFAULT_PROJECT: require('./default-project').default,
  ANALYTICS_ID: 'UA-133660753-4',
  ANALYTICS: {
    debug: false,
    sampleRate: 100
  },
  setGoogleAnalytics: function setGoogleAnalytics(GoogleAnalytics) {
    window.GoogleAnalytics = GoogleAnalytics;
  },
  filter: function filter(assets) {
    switch (assets[0].type) {
      case 'sprite':
        return assets.filter(function (asset) {
          return !ScratchTrademarks.SPRITES.includes(asset.name);
        });

      case 'costume':
        return assets.filter(function (asset) {
          for (var _i = 0, _a = ScratchTrademarks.COSTUMES; _i < _a.length; _i++) {
            var keyword = _a[_i];

            if (asset.name.startsWith(keyword)) {
              return false;
            }
          }

          return true;
        });

      default:
        break;
    }
  }
};
exports.default = Gui;
