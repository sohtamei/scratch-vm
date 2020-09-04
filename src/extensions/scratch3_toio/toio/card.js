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
 * This defines Card-specific constants and useful functionalities.
 */

var Card =
/** @class */
function () {
  function Card() {
    var _this = this;

    this.ids = {};
    Card.IDS.forEach(function (item) {
      if (item.value) {
        _this.ids[item.value] = item;
      }
    });
  }

  Object.defineProperty(Card.prototype, "menus", {
    get: function get() {
      return Card.IDS.map(function (item) {
        return item.key || item.label;
      });
    },
    enumerable: true,
    configurable: true
  });

  Card.prototype.check = function (state, type) {
    var id = this.ids[state.standardId];

    if (!id) {
      return undefined;
    } // if (!id) {
    //   switch (type) {
    //     case 'white cell':
    //     case 'red cell':
    //     case 'green cell':
    //     case 'yellow cell':
    //     case 'blue cell':
    //       return Mat.checkIfMatchColor(state, type)
    //     default:
    //       return undefined
    //   }
    // }


    switch (type) {
      case 'any card':
        return id.group === 'card';

      case 'any sticker':
        return id.group === 'sticker';

      default:
        return id.label === type;
    }
  };

  Card.IDS = [// Rhythm and Go
  {
    label: 'front card',
    key: 'frontCard',
    value: 3670026,
    group: 'card'
  }, {
    label: 'back card',
    key: 'backCard',
    value: 3670064,
    group: 'card'
  }, {
    label: 'left card',
    key: 'leftCard',
    value: 3670024,
    group: 'card'
  }, {
    label: 'right card',
    key: 'rightCard',
    value: 3670062,
    group: 'card'
  }, {
    label: 'go card',
    key: 'goCard',
    value: 3670028,
    group: 'card'
  }, // Craft Fighter
  {
    label: 'typhoon card',
    key: 'typhoonCard',
    value: 3670016,
    group: 'card'
  }, {
    label: 'rush card',
    key: 'rushCard',
    value: 3670054,
    group: 'card'
  }, {
    label: 'auto tackle card',
    key: 'autoTackleCard',
    value: 3670018,
    group: 'card'
  }, {
    label: 'random card',
    key: 'randomCard',
    value: 3670056,
    group: 'card'
  }, {
    label: 'push power up card',
    key: 'pushPowerUpCard',
    value: 3670020,
    group: 'card'
  }, {
    label: 'strut power up card',
    key: 'strutPowerUpCard',
    value: 3670058,
    group: 'card'
  }, {
    label: 'side attack card',
    key: 'sideAttackCard',
    value: 3670022,
    group: 'card'
  }, {
    label: 'easy mode card',
    key: 'easyModeCard',
    value: 3670060,
    group: 'card'
  }, {
    label: 'any card',
    key: 'anyCard'
  }, // Common
  {
    label: 'spin sticker',
    key: 'spinSticker',
    value: 3670070,
    group: 'sticker'
  }, {
    label: 'shock sticker',
    key: 'shockSticker',
    value: 3670034,
    group: 'sticker'
  }, {
    label: 'wobble sticker',
    key: 'wobbleSticker',
    value: 3670068,
    group: 'sticker'
  }, {
    label: 'panic sticker',
    key: 'panicSticker',
    value: 3670032,
    group: 'sticker'
  }, {
    label: 'speed up sticker',
    key: 'speedUpSticker',
    value: 3670066,
    group: 'sticker'
  }, {
    label: 'speed down sticker',
    key: 'speedDownSticker',
    value: 3670030,
    group: 'sticker'
  }, {
    label: 'any sticker',
    key: 'anySticker'
  } // {
  //   label: 'white cell',
  //   key: 'whiteCell'
  // },
  // {
  //   label: 'red cell',
  //   key: 'redCell'
  // },
  // {
  //   label: 'green cell',
  //   key: 'greenCell'
  // },
  // {
  //   label: 'yellow cell',
  //   key: 'yellowCell'
  // },
  // {
  //   label: 'blue cell',
  //   key: 'blueCell'
  // }
  ];
  return Card;
}();

exports.default = new Card();
