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

var formatMessage = require("format-message");

var toio_1 = __importDefault(require("./toio"));

var coreCube_1 = __importDefault(require("./toio/coreCube"));

var blocks_1 = __importDefault(require("./blocks"));

//var gui_1 = __importDefault(require("./gui"));

var util_1 = __importDefault(require("./util"));

var about_1 = require("./about");

var translations_1 = __importDefault(require("./translations"));

formatMessage.setup({
  translations: translations_1.default,
  locale: util_1.default.getBrowserLanguage() || 'ja'
});
/**
 * Factory class to build a toio extension.
 *
 * @param {string} id Extension ID which is referred by scratch-vm.
 * @param {string} name Extension name.
 * @param {Array<string>} colors Color table of block.
 * @param {?object} options Options for customizing block configuration.
 * @return {object} An instance of toio extension.
 */

var ToioBlocksFactory = function ToioBlocksFactory(id, name, colors, options) {
  return (
    /** @class */
    function () {
      function ToioBlocks(runtime) {
        this.runtime = runtime;
        util_1.default.injectToioArea();
        about_1.injectLink();
        this.coreCube = new coreCube_1.default(this.runtime, id);
        this.blocks = new blocks_1.default(this.coreCube);

        for (var _i = 0, _a = this.blocks.functions; _i < _a.length; _i++) {
          var blockFunction = _a[_i];
          ToioBlocks.prototype[blockFunction.opcode] = blockFunction.func;
        }

        this.runtime.on('PROJECT_RUN_STOP', this.stop.bind(this));
        this.runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this)); // This sends a page view event to GA when the extension for 2nd toio is used.

        if (id !== 'toio') {
          window.GoogleAnalytics.pageview("/" + id);
        }
      }
/*
      Object.defineProperty(ToioBlocks, "guiInfo", {
        get: function get() {
          return __assign(__assign(__assign({}, gui_1.default.INFO), {
            extensionId: id,
            name: formatMessage(id + '.title'),
            description: formatMessage(id + '.description')
          }), options);
        },
        enumerable: true,
        configurable: true
      });
*/
      /**
       * Return information of toio extension to scratch-vm.
       *
       * @param {string} locale Locale.
       * @returns {object} Information of toio extension.
       */

      ToioBlocks.prototype.getInfo = function (locale) {
        if (!this.info) {
          this.info = {
            id: id,
            name: name,
            blockIconURI: options && options.blockIcon ? options.blockIcon : toio_1.default.Image.CORECUBE_S,
            color1: colors[0],
            color2: colors[1],
            color3: colors[2],
            showStatusButton: true,
            blocks: this.blocks.info,
            menus: this.blocks.menus
          };
        }

        if (this.locale !== locale) {
          formatMessage.setup({
            locale: locale || util_1.default.getBrowserLanguage()
          });
          this.locale = locale;
          about_1.injectLink();
          this.coreCube.updateTexts();
          this.blocks.updateTexts();
          this.info.blocks = this.blocks.info;
          this.info.menus = this.blocks.menus;
        }

        return this.info;
      };
      /**
       * Stop block when the all blocks have been completed.
       */


      ToioBlocks.prototype.stop = function () {
        this.blocks.stop(false);
      };
      /**
       * Stop all blocks when the stop block is executed or the stop button is
       * pressed.
       */


      ToioBlocks.prototype.stopAll = function () {
        this.blocks.stop(true);
      };

      return ToioBlocks;
    }()
  );
};

exports.default = ToioBlocksFactory;
