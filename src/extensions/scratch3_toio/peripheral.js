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

var BLE = require("scratch-vm/src/io/ble");

var Base64Util = require("scratch-vm/src/util/base64-util");

var watchdog_1 = __importDefault(require("./watchdog"));

var util_1 = __importDefault(require("./util"));
/**
 * This is a glue class for a BLE peripheral to be controlled by scratch-vm.
 */


var Peripheral =
/** @class */
function () {
  function Peripheral(runtime, extensionId) {
    this.ServiceUuid = 'Service UUID is not defined';
    this.watchdog = new watchdog_1.default();
    this.busy = false;
    this.writeBuffer = [];
    this.runtime = runtime;
    this.extensionId = extensionId;
    this.runtime.registerPeripheralExtension(extensionId, this);
  }
  /**
   * Check if any peripheral is connected.
   *
   * @returns {boolean} Flag if any peripheral is connected.
   */


  Peripheral.prototype.isConnected = function () {
    return this.ble && this.ble.isConnected();
  };
  /**
   * Scan peripherals.
   */


  Peripheral.prototype.scan = function () {
    if (this.ble) {
      this.ble.disconnect();
    }

    this.ble = new BLE(this.runtime, this.extensionId, {
      filters: [{
        services: [this.ServiceUuid]
      }]
    }, this.onConnected);
  };
  /**
   * Connect to a peripheral.
   *
   * @param {String} id Peripheral's ID.
   */


  Peripheral.prototype.connect = function (id) {
    this.ble.connectPeripheral(id);
  };
  /**
   * Callback is called when the peripheral is connected.
   */


  Peripheral.prototype.onConnected = function () {
    var _this = this;

    this.watchdog.onDisconnected = function () {
      _this.ble.handleDisconnectError('the extension stopped receiving data from BLE');
    };
  };
  /**
   * Disconnet from the peripheral.
   */


  Peripheral.prototype.disconnect = function () {
    this.watchdog.stop();
    this.ble.disconnect();
  };
  /**
   * Read data from the given characteristic.
   *
   * @param {string} characteristicUuid UUid of the characteristic to be read.
   * @param {function} onRead Callback is called when data is read.
   * @returns {object} Promise to read data.
   */


  Peripheral.prototype.read = function (characteristicUuid, onRead) {
    if (!this.isConnected()) {
      return;
    }

    return this.ble.read(this.ServiceUuid, characteristicUuid, false, onRead);
  };
  /**
   * Intend to write data to the given characteristic.
   *
   * This writes data if the output (an WebSocket session in this case) is
   * ready to be written. If it is not ready, the writing data is stacked to the
   * write buffer until ready.
   *
   * @param {string} characteristicUuid UUid of the characteristic to be
   * written.
   * @param {Array<number>} data Array of number to be written to the given
   * characteristic.
   * @param {boolean} withResponse Flag if this is writing with response.
   * Default is false.
   * @returns {object} Promise to write data.
   */


  Peripheral.prototype.write = function (characteristicUuid, data, withResponse) {
    if (withResponse === void 0) {
      withResponse = false;
    } // Do nothing if any Core Cube is not connected.


    if (!this.isConnected()) {
      return;
    } // Immediately write the given data if the write buffer is empty.


    if (this.writeBuffer.length === 0) {
      var result = this.doWrite(characteristicUuid, data, withResponse);

      if (result !== null) {
        return result;
      }
    } // To prevent the buffer from overflowing, remove old data if needed.


    if (this.writeBuffer.length >= Peripheral.WRITE_BUFFER_LENGTH) {
      this.writeBuffer = this.writeBuffer.slice(-(Peripheral.WRITE_BUFFER_LENGTH - 1));
    } // Add the given data to the buffer for lazy write.


    this.writeBuffer.push({
      characteristicUuid: characteristicUuid,
      data: data,
      withResponse: withResponse
    }); // Initiate lazy write.

    this.lazyWrite();
  };
  /**
   * Write data in the buffer when the output is ready.
   */


  Peripheral.prototype.lazyWrite = function () {
    var _this = this;

    var tick = function tick() {
      // If the Core Cube is no longer connected, cancel all writes in the buffer.
      if (!_this.isConnected()) {
        _this.writeBuffer = [];
        return;
      } // Leave this loop if the write buffer is empty.


      if (_this.writeBuffer.length === 0) {
        return;
      } // Get the first data in the write buffer.


      var _a = _this.writeBuffer[0],
          characteristicUuid = _a.characteristicUuid,
          data = _a.data,
          withResponse = _a.withResponse; // Attempt to write the data

      var result = _this.doWrite(characteristicUuid, data, withResponse);

      if (result !== null) {
        // Remove the data from the buffer if it could be written.
        _this.writeBuffer.shift();
      } // Initiate a next task to be executed when it is ready.


      setTimeout(tick, 1);
    };

    setTimeout(tick, 1);
  };
  /**
   * Write data to the given characteristic.
   *
   * @param {string} characteristicUuid UUid of the characteristic to be written.
   * @param {Array<number>} data Array of number to be written to the given characteristic.
   * @param {boolean} withResponse Flag if this is writing with response. Default is false.
   * @returns {object} Promise to write data.
   */


  Peripheral.prototype.doWrite = function (characteristicUuid, data, withResponse) {
    var _this = this;

    if (withResponse === void 0) {
      withResponse = false;
    }

    if (!util_1.default.isWindows && this.busy) {
      return null;
    }

    this.busy = true;
    var base64 = Base64Util.uint8ArrayToBase64(Uint8Array.from(data)); // console.log('write:', characteristicUuid, data)

    return this.ble.write(this.ServiceUuid, characteristicUuid, base64, 'base64', withResponse).then(function () {
      _this.busy = false;
    });
  };
  /**
   * Start receiving notifications from the given characteristic.
   *
   * @param {string} characteristicUuid UUid of the characteristic to be notified.
   * @param {function} onNotified Callback is called when data is notified.
   */


  Peripheral.prototype.startNotifications = function (characteristicUuid, onNotified) {
    if (!this.isConnected()) {
      return;
    }

    this.ble.startNotifications(this.ServiceUuid, characteristicUuid, onNotified);
  };

  Peripheral.WRITE_BUFFER_LENGTH = 8;
  return Peripheral;
}();

exports.default = Peripheral;

