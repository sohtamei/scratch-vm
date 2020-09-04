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

var util_1 = __importDefault(require("./util"));
/**
 * Show a warning message.
 *
 * @param {string} message Message to be shown.
 * @param {string} url URL for an website where it goes to.
 */


function showWarning(message, url) {
  if (window.confirm(message)) {
    window.open(url);
  }
}

exports.showWarning = showWarning;
/**
 * Inject an warning button to the header.
 *
 * @param {string} buttonMessage Message to be shown on the button.
 * @param {string} dialogMessage Message to be shown on the dialog.
 * @param {string} url URL for an website where it goes to.
 */

function injectWarningButton(buttonMessage, dialogMessage, url) {
  var toioArea = util_1.default.getToioArea();

  if (!toioArea) {
    return;
  }

  var id = 'toio-warn';

  if (toioArea.querySelector('#' + id)) {
    return;
  }

  var warn = document.createElement('a');
  warn.id = id;
  warn.setAttribute('style', 'padding: 6px 0.6rem; color: #ffffff; background-color: #f6624c; cursor: pointer;' + 'border-radius: 4px; text-decoration: underline;');
  warn.innerHTML = buttonMessage;

  warn.onclick = function () {
    showWarning(dialogMessage, url);
  };

  toioArea.appendChild(warn);
}

exports.injectWarningButton = injectWarningButton;
/**
 * Remove the warning button from the header.
 */

function removeWarningButton() {
  var toioArea = util_1.default.getToioArea();

  if (!toioArea) {
    return;
  }

  var warn = toioArea.querySelector('#toio-warn');

  if (!warn) {
    return;
  }

  toioArea.removeChild(warn);
}

exports.removeWarningButton = removeWarningButton;

function checkIfWarningButtonExist() {
  var toioArea = util_1.default.getToioArea();

  if (!toioArea) {
    return false;
  }

  var id = 'toio-warn';
  return toioArea.querySelector('#' + id) !== null;
}

exports.checkIfWarningButtonExist = checkIfWarningButtonExist;

