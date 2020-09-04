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
 * Utility class to be commonly used in other classes.
 */

var Util =
/** @class */
function () {
  function Util() {
    this.isWindows = navigator.platform.startsWith('Win');
  }
  /**
   * Get the language setting in a browser.
   *
   * @returns {string} language
   */


  Util.prototype.getBrowserLanguage = function () {
    return window.navigator.languages && window.navigator.languages[0] || window.navigator.language || window.navigator.userLanguage || window.navigator.browserLanguage;
  };
  /**
   * Inject a div as a toio-specific area.
   */


  Util.prototype.injectToioArea = function () {
    var element = this.getToioArea();

    if (element) {
      return;
    }

    var area = document.createElement('div');
    area.id = Util.ID_FOR_TOIO_AREA;
    area.setAttribute('style', 'position: absolute; right: 0px; top: 0px; height: 48px; margin-top: 14px; z-Index: 1000;' + 'font-size: 12px; color: #ffffff;');
    document.body.appendChild(area);
  };
  /**
   * Get the toio-specific area.
   *
   * @returns {HTMLDivElement} HTML element for toio area if exists
   */


  Util.prototype.getToioArea = function () {
    return document.body.querySelector('#' + Util.ID_FOR_TOIO_AREA);
  };

  Util.ID_FOR_TOIO_AREA = 'toio-area';
  return Util;
}();

exports.default = new Util();

