"use strict";
/**
 * Copyright (c) Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the BSD-3-Clause license found
 * in the LICENSE file in the root directory of this source tree.
 */

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ArgumentType = require("scratch-vm/src/extension-support/argument-type");

var BlockType = require("scratch-vm/src/extension-support/block-type");

var Cast = require("scratch-vm/src/util/cast");

var formatMessage = require("format-message");

var coreCubeBlock_1 = __importDefault(require("./coreCubeBlock"));

var SoundBlocks =
/** @class */
function (_super) {
  __extends(SoundBlocks, _super);

  function SoundBlocks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SoundBlocks.prototype.getInfo = function () {
    return [{
      opcode: 'playNoteFor',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.playNoteFor',
        default: 'play note [NOTE] for [DURATION] seconds',
        description: 'play note for the specified duration'
      }),
      arguments: {
        NOTE: {
          type: ArgumentType.NOTE,
          defaultValue: 60
        },
        DURATION: {
          type: ArgumentType.NUMBER,
          defaultValue: 1
        }
      }
    }, {
      opcode: 'stopNote',
      blockType: BlockType.COMMAND,
      text: formatMessage({
        id: 'toio.stopNote',
        default: 'stop note',
        description: 'stop note'
      })
    }, '---'];
  };
  /**
   * Play a note for a given duration.
   *
   * @param {object} args Arguments in the block.
   * @returns {object} Promise to play the note.
   */


  SoundBlocks.prototype.playNoteFor = function (args) {
    var duration = Cast.toNumber(args.DURATION);

    if (duration <= 0) {
      return;
    }

    var note = Cast.toNumber(args.NOTE);
    return this.coreCube.playSound(note, 127, duration);
  };
  /**
   * Stop the note.
   */


  SoundBlocks.prototype.stopNote = function () {
    this.stop(true);
  };
  /**
   * This is called when the stop button is pressed.
   *
   * @param {boolean} forceToStop Flag if it forces to stop.
   * @returns {boolean} Flag if it stops.
   */


  SoundBlocks.prototype.stop = function (forceToStop) {
    if (forceToStop === void 0) {
      forceToStop = false;
    }

    if (forceToStop) {
      this.coreCube.stopSound();
    }

    return forceToStop;
  };

  return SoundBlocks;
}(coreCubeBlock_1.default);

exports.default = SoundBlocks;
