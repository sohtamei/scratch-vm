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
var Toio = {
  COMPANY: 'Sony Interactive Entertainment Inc.',
  URL: 'https://toio.io/programming/visual-programming.html',
  URL_FOR_UPDATE: 'https://toio.io/update/app.html',
  URL_FOR_SETUP: 'https://toio.io/programming/visual-programming.html/#preparation',
  Image: {
    LOGO: require('../images/extension_hero.png'),
    CORECUBE_L: require('../images/cube_l.svg'),
    CORECUBE_M: require('../images/cube_m.svg'),
    CORECUBE_S: require('../images/cube_s.svg'),
    LOGO2: require('../images/extension_hero2.png'),
    CORECUBE2_L: require('../images/cube2_l.svg'),
    CORECUBE2_M: require('../images/cube2_m.svg'),
    CORECUBE2_S: require('../images/cube2_s.svg')
  },
  uuid: function uuid(id) {
    return "10b2" + id + "-5b3b-4571-9508-cf3efcd7bbae";
  }
};
exports.default = Toio;
