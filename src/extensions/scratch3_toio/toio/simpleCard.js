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

var SimpleCard =
/** @class */
function () {
  function SimpleCard() {
    var _this = this;

    this.ids = {};
    SimpleCard.IDS.forEach(function (item) {
      if (item.value) {
        _this.ids[item.value] = item;
      }
    });
  }

  Object.defineProperty(SimpleCard.prototype, "menus", {
    get: function get() {
      return SimpleCard.IDS.map(function (item) {
        return item.key || item.label;
      });
    },
    enumerable: true,
    configurable: true
  });

  SimpleCard.prototype.check = function (state, type) {
    var id = this.ids[state.standardId];

    if (!id) {
      return undefined;
    }

    switch (type) {
      case 'any card':
        return true;

      case 'any number':
        return id.group === 'number';

      case 'any alphabet':
        return id.group === 'alphabet';

      case 'any symbol':
        return id.group === 'symbol';

      case 'any simple card':
        return id.group === 'number' || id.group === 'alphabet' || id.group === 'symbol';

      default:
        return id.label === type;
    }
  };

  SimpleCard.prototype.getLabel = function (state) {
    var id = this.ids[state.standardId];

    if (!id) {
      return undefined;
    }

    return id.label;
  };

  SimpleCard.IDS = [// Numbers
  {
    label: '0',
    value: 3670320,
    group: 'number'
  }, {
    label: '1',
    value: 3670321,
    group: 'number'
  }, {
    label: '2',
    value: 3670322,
    group: 'number'
  }, {
    label: '3',
    value: 3670323,
    group: 'number'
  }, {
    label: '4',
    value: 3670324,
    group: 'number'
  }, {
    label: '5',
    value: 3670325,
    group: 'number'
  }, {
    label: '6',
    value: 3670326,
    group: 'number'
  }, {
    label: '7',
    value: 3670327,
    group: 'number'
  }, {
    label: '8',
    value: 3670328,
    group: 'number'
  }, {
    label: '9',
    value: 3670329,
    group: 'number'
  }, {
    label: 'any number',
    key: 'anyNumber'
  }, // Alphabets
  {
    label: 'A',
    value: 3670337,
    group: 'alphabet'
  }, {
    label: 'B',
    value: 3670338,
    group: 'alphabet'
  }, {
    label: 'C',
    value: 3670339,
    group: 'alphabet'
  }, {
    label: 'D',
    value: 3670340,
    group: 'alphabet'
  }, {
    label: 'E',
    value: 3670341,
    group: 'alphabet'
  }, {
    label: 'F',
    value: 3670342,
    group: 'alphabet'
  }, {
    label: 'G',
    value: 3670343,
    group: 'alphabet'
  }, {
    label: 'H',
    value: 3670344,
    group: 'alphabet'
  }, {
    label: 'I',
    value: 3670345,
    group: 'alphabet'
  }, {
    label: 'J',
    value: 3670346,
    group: 'alphabet'
  }, {
    label: 'K',
    value: 3670347,
    group: 'alphabet'
  }, {
    label: 'L',
    value: 3670348,
    group: 'alphabet'
  }, {
    label: 'M',
    value: 3670349,
    group: 'alphabet'
  }, {
    label: 'N',
    value: 3670350,
    group: 'alphabet'
  }, {
    label: 'O',
    value: 3670351,
    group: 'alphabet'
  }, {
    label: 'P',
    value: 3670352,
    group: 'alphabet'
  }, {
    label: 'Q',
    value: 3670353,
    group: 'alphabet'
  }, {
    label: 'R',
    value: 3670354,
    group: 'alphabet'
  }, {
    label: 'S',
    value: 3670355,
    group: 'alphabet'
  }, {
    label: 'T',
    value: 3670356,
    group: 'alphabet'
  }, {
    label: 'U',
    value: 3670357,
    group: 'alphabet'
  }, {
    label: 'V',
    value: 3670358,
    group: 'alphabet'
  }, {
    label: 'W',
    value: 3670359,
    group: 'alphabet'
  }, {
    label: 'X',
    value: 3670360,
    group: 'alphabet'
  }, {
    label: 'Y',
    value: 3670361,
    group: 'alphabet'
  }, {
    label: 'Z',
    value: 3670362,
    group: 'alphabet'
  }, {
    label: 'any alphabet',
    key: 'anyAlphabet'
  }, // Symbols
  {
    label: '!',
    value: 3670305,
    group: 'symbol'
  }, {
    label: '?',
    value: 3670335,
    group: 'symbol'
  }, {
    label: '+',
    value: 3670315,
    group: 'symbol'
  }, {
    label: '-',
    value: 3670317,
    group: 'symbol'
  }, {
    label: '*',
    value: 3670314,
    group: 'symbol'
  }, {
    label: '/',
    value: 3670319,
    group: 'symbol'
  }, {
    label: '=',
    value: 3670333,
    group: 'symbol'
  }, {
    label: '%',
    value: 3670309,
    group: 'symbol'
  }, {
    label: '↑',
    value: 3670366,
    group: 'symbol'
  }, {
    label: '↓',
    value: 3670367,
    group: 'symbol'
  }, {
    label: '←',
    value: 3670332,
    group: 'symbol'
  }, {
    label: '→',
    value: 3670334,
    group: 'symbol'
  }, {
    label: 'any symbol',
    key: 'anySymbol'
  }, {
    label: 'any simple card',
    key: 'anySimpleCard'
  }];
  return SimpleCard;
}();

exports.default = new SimpleCard();
