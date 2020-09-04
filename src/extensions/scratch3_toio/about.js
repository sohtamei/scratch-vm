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

var formatMessage = require("format-message");

var toio_1 = __importDefault(require("./toio"));

var util_1 = __importDefault(require("./util"));

var package_json_1 = __importDefault(require("./package.json"));
/**
 * Inject a link to navigate to the 'About Visual Programming' page in the official site.
 */


function injectLink() {
  var toioArea = util_1.default.getToioArea();

  if (!toioArea) {
    return;
  }

  var id = 'toio-link';
  var element = toioArea.querySelector('#' + id);

  if (element) {
    toioArea.removeChild(element);
  }

  var link = document.createElement('a');
  link.id = id;
  link.setAttribute('style', 'padding: 0 0.75rem; float: right;' + 'color: #ffffff; text-decoration: none; font-weight: bold;');
  link.innerHTML = formatMessage('toio.about');
  link.href = toio_1.default.URL;
  link.title = package_json_1.default ? "v" + package_json_1.default.version : 'unknown version';
  toioArea.appendChild(link);
}

exports.injectLink = injectLink;

