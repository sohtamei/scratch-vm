function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Consts = {
  HIGH: 1,
  LOW: 0,
  OUTPUT: 1,
  INPUT: 0,
  PULLUP: 1,
  NO_PULLS: 0,
  ENABLE: 1,
  DISABLE: 0,
  TRUE: 1,
  FALSE: 0,
  KONASHI_SUCCESS: 0,
  KONASHI_FAILURE: -1,
  // Konashi I/0 pin
  PIO0: 0,
  PIO1: 1,
  PIO2: 2,
  PIO3: 3,
  PIO4: 4,
  PIO5: 5,
  PIO6: 6,
  PIO7: 7,
  S1: 0,
  LED2: 1,
  LED3: 2,
  LED4: 3,
  LED5: 4,
  AIO0: 0,
  AIO1: 1,
  AIO2: 2,
  I2C_SDA: 6,
  I2C_SCL: 7,
  // Konashi PWM
  KONASHI_PWM_DISABLE: 0,
  KONASHI_PWM_ENABLE: 1,
  KONASHI_PWM_ENABLE_LED_MODE: 2,
  KONASHI_PWM_LED_PERIOD: 10000,
  // 10ms
  KONASHI_PWM_SERVO_PERIOD: 20000,
  // Konashi analog I/O
  KONASHI_ANALOG_REFERENCE: 1300,
  // 1300mV
  // Konashi UART baudrate
  KONASHI_UART_RATE_2K4: 0x000a,
  KONASHI_UART_RATE_9K6: 0x0028,
  // Konashi I2C
  KONASHI_I2C_DATA_MAX_LENGTH: 18,
  KONASHI_I2C_DISABLE: 0,
  KONASHI_I2C_ENABLE: 1,
  KONASHI_I2C_ENABLE_100K: 1,
  KONASHI_I2C_ENABLE_400K: 2,
  KONASHI_I2C_STOP_CONDITION: 0,
  KONASHI_I2C_START_CONDITION: 1,
  KONASHI_I2C_RESTART_CONDITION: 2,
  // Konashi UART
  KONASHI_UART_DATA_MAX_LENGTH: 19,
  KONASHI_UART_DISABLE: 0,
  KONASHI_UART_ENABLE: 1,
  // Konashi SPI
  KOSHIAN_SPI_SPEED_200K: 20,
  KOSHIAN_SPI_SPEED_500K: 50,
  KOSHIAN_SPI_SPEED_1M: 100,
  KOSHIAN_SPI_SPEED_2M: 200,
  KOSHIAN_SPI_SPEED_3M: 300,
  KOSHIAN_SPI_SPEED_6M: 600,
  KOSHIAN_SPI_MODE_CPOL0_CPHA0: 0,
  KOSHIAN_SPI_MODE_CPOL0_CPHA1: 1,
  KOSHIAN_SPI_MODE_CPOL1_CPHA0: 2,
  KOSHIAN_SPI_MODE_CPOL1_CPHA1: 3,
  KOSHIAN_SPI_MODE_DISABLE: -1,
  KOSHIAN_SPI_BIT_ORDER_LSB_FIRST: 0,
  KOSHIAN_SPI_BIT_ORDER_MSB_FIRST: 1
};

var Konashi = /*#__PURE__*/function () {
  _createClass(Konashi, null, [{
    key: "_createUUID",

    /**
     * Create konashi UUID
     *
     * @param {String} part 4 characters hex
     * @returns {String}
     */
    value: function _createUUID(part) {
      return '229b' + part + '-03fb-40da-98a7-b0def65c2d4b';
    }
    /**
     * Returns konashi's service UUID
     *
     * @returns {String}
     */

  }, {
    key: "find",

    /**
     * Find konasih2 device
     *
     * @param {Boolean} [autoConnect]
     * @param {Object} [options] defaul: `{filters: [{namePrefix: 'konashi2'}], optionalServices: ['229bff00-03fb-40da-98a7-b0def65c2d4b']}`
     * @returns {Promise<Konashi>}
     */
    value: function find(autoConnect, name, options) {
      if (_typeof(autoConnect) == undefined) {
        autoConnect = true;
      }

      options = options || {
        filters: [{
          namePrefix: name
        }],
        optionalServices: [Konashi._serviceUUID]
      };
      return new Promise(function (resolve, reject) {
        navigator.bluetooth.requestDevice(options).then(function (d) {
          var konashi = new Konashi(d);

          if (autoConnect) {
            konashi.connect().then(resolve, reject);
          } else {
            resolve(konashi);
          }
        }, function (e) {
          var askedRetrieve = /retrieve services/;

          if (askedRetrieve.test(e)) {
            konashi.connect().then(resolve, reject); // TODO: Research reject activity
          } else {
            reject(e);
          }
        });
      });
    }
    /**
     * constructor
     * TODO: Set Handlers?
     *
     * @param {BluetoothDevice} device
     */

  }, {
    key: "_serviceUUID",
    get: function get() {
      return Konashi._createUUID('ff00');
    }
    /**
     * Returns konashi's UUID with label
     *
     * @returns {Object<String, String>} key: label, value: UUID
     */

  }, {
    key: "_c12cUUIDs",
    get: function get() {
      return {
        analogInput: Konashi._createUUID('3008'),
        pioSetting: Konashi._createUUID('3000'),
        pioOutput: Konashi._createUUID('3002'),
        pioPullUp: Konashi._createUUID('3001'),
        pioInputNotification: Konashi._createUUID('3003'),
        pwmConfig: Konashi._createUUID('3004'),
        pwmParameter: Konashi._createUUID('3005'),
        pwmDuty: Konashi._createUUID('3006'),
        analogDrive: Konashi._createUUID('3007'),
        analogRead0: Konashi._createUUID('3008'),
        analogRead1: Konashi._createUUID('3009'),
        analogRead2: Konashi._createUUID('300a'),
        i2cConfig: Konashi._createUUID('300b'),
        i2cStartStop: Konashi._createUUID('300c'),
        i2cWrite: Konashi._createUUID('300d'),
        i2cReadParameter: Konashi._createUUID('300e'),
        i2cRead: Konashi._createUUID('300f'),
        uartConfig: Konashi._createUUID('3010'),
        uartBaudRate: Konashi._createUUID('3011'),
        uartTx: Konashi._createUUID('3012'),
        uartRxNotification: Konashi._createUUID('3013'),
        hardwareReset: Konashi._createUUID('3014'),
        hardwareLowBatteryNotification: Konashi._createUUID('3015')
      };
    }
  }]);

  function Konashi(device) {
    _classCallCheck(this, Konashi);

    /** BluetoothDevice */
    this._device = device;
    /** BluetoothGATTRemoteServer */

    this._gatt = null;
    /** BluetoothGATTService */

    this._service = null;
    /** Object<String, BluetoothGATTCharacteristic> */

    this._c12c = {};
    /** Object<String, Number> */

    this._state = {
      pioOutputs: 0,
      pwmModes: 0
    };

    for (var key in Consts) {
      this[key] = Consts[key];
    }
  }
  /**
   * Connect to konashi
   *
   * Assign `_gatt` and `_service` properties when
   * the connection has been made.
   *
   * @returns {Promise<Konashi>}
   */


  _createClass(Konashi, [{
    key: "connect",
    value: function connect() {
      var that = this;
      return new Promise(function (resolve, reject) {
        that._device.gatt.connect().then(function (gatt) {
          that._gatt = gatt;
          return gatt.getPrimaryService(Konashi._serviceUUID);
        }, function (e) {
          return reject(e);
        }).then(function (service) {
          that._service = service;
          var promises = [],
              keys = [];

          for (var key in Konashi._c12cUUIDs) {
            keys.push(key);
          }

          keys.forEach(function (label, i) {
            promises.push(that._service.getCharacteristic(Konashi._c12cUUIDs[label]).then(function (c) {
              // TODO: Watch changes of all characteristics
              // https://github.com/WebBluetoothCG/web-bluetooth/issues/176
              that._c12c[label] = c;
              Promise.resolve();
            }));
          });
          return Promise.all(promises);
        }, function (e) {
          return reject(e);
        }).then(function () {
          return resolve(that);
        }, function (e) {
          return reject(e);
        });
      });
    }
    /**
     * Return connection condition
     * 
     * @returns {Boolean}
     */

  }, {
    key: "isConnected",
    value: function isConnected() {
      var connected = false;

      if (this._gatt) {
        connected = this._gatt.connected;
      }

      return connected;
    }
    /**
     * Returns peripheral name
     *
     * @returns {String}
     */

  }, {
    key: "name",
    value: function name() {
      return this._device.name;
    }
  }, {
    key: "delay",
    value: function delay(ms) {
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
      });
    } // { Digital I/O

    /**
     * Set konashi's pin mode
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @param {Number} flag Consts.(INPUT|OUTPUT)
     * @returns {Promise<void>}
     */

  }, {
    key: "pinMode",
    value: function pinMode(pin, flag) {
      var _this = this;

      var that = this;
      return new Promise(function (resolve, reject) {
        that._c12c.pioSetting.readValue().then(function (v) {
          var data = v.getUint8(0);

          if (flag == Consts.OUTPUT) {
            data |= 0x01 << pin;
          } else {
            data &= ~(0x01 << pin) & 0xff;
          }

          _this._c12c.pioSetting.writeValue(new Uint8Array([data])).then(resolve, reject);
        });
      });
    }
    /**
     * Set konashi's pins mode
     *
     * @param {String} flags "0x29", 0: INPUT, 1 = OUTPUT, e.g. 00101001(pio0:OUT, pio4:OUT, pio5:OUT)
     * @returns {Promise<void>}
     */

  }, {
    key: "pinModeAll",
    value: function pinModeAll(flags) {
      var that = this;
      return new Promise(function (resolve, reject) {
        if (flags >= 0x00 && flags <= 0xFF) {
          that._c12c.pioSetting.writeValue(new Uint8Array([flags])).then(resolve, reject);
        }
      });
    }
    /**
     * Set pullup mode
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @param {Number} mode Consts.(PULLUP|NO_PULLS)
     * @returns {Promise<Void>}
     */

  }, {
    key: "pinPullup",
    value: function pinPullup(pin, mode) {
      var _this2 = this;

      var that = this;
      return new Promise(function (resolve, reject) {
        that._c12c.pioPullUp.readValue().then(function (v) {
          var data = v.getUint8(0);

          if (mode == Consts.PULLUP) {
            data |= 0x01 << pin;
          } else {
            data &= ~(0x01 << pin);
          }

          _this2._c12c.pioPullUp.writeValue(new Uint8Array([data])).then(resolve, reject);
        });
      });
    }
    /**
     * Read a value of digital pin
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @returns {Promise<Number>} Consts.(LOW|HIGH)
     */

  }, {
    key: "digitalRead",
    value: function digitalRead(pin) {
      return this._c12c.pioInputNotification.readValue().then(function (buf) {
        return buf.getUint8(0) >> pin & 0x01;
      });
    }
    /**
     * Set callback to Digital Input Notification.
     * 
     * @param {Function<Number>} callback arguments should be 0bXXXXXXXX.
     */

  }, {
    key: "startDigitalInputNotification",
    value: function startDigitalInputNotification(callback) {
      var onReceived = function onReceived(event) {
        var buf = event.target.value;
        var value = buf.getUint8(0);
        callback(value);
      };

      var that = this;

      this._c12c.pioInputNotification.startNotifications().then(function (_) {
        that._c12c.pioInputNotification.addEventListener('characteristicvaluechanged', onReceived);
      }).catch(function (error) {
        // Remove Event
        that._c12c.pioInputNotification.removeEventListener('characteristicvaluechanged', onReceived);

        console.error(error);
      });
    }
    /**
     * Write value to a digital pin
     *
     * https://github.com/YUKAI/konashi-android-sdk/blob/master/konashi-android-sdk/src/main/java/com/uxxu/konashi/lib/dispatcher/PioStoreUpdater.java
     * https://github.com/YUKAI/konashi-android-sdk/blob/master/konashi-android-sdk/src/main/java/com/uxxu/konashi/lib/store/PioStore.java#L19 
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @param {Number} value Consts.(LOW|HIGH)
     * @returns {Promise<Void>} 
     */

  }, {
    key: "digitalWrite",
    value: function digitalWrite(pin, value) {
      if (value == Consts.HIGH) {
        this._state.pioOutputs |= 0x01 << pin;
      } else {
        this._state.pioOutputs &= ~(0x01 << pin) & 0xff;
      }

      return this._c12c.pioOutput.writeValue(new Uint8Array([this._state.pioOutputs]));
    }
    /**
     * Write value to digital pins
     *
     * @param {String} flags "0x29", 0: LOW, 1 = HIGH, e.g. 00101001(pio0:LOW, pio4:HIGH, pio5:HIGH)
     * @returns {Promise<void>}
     */

  }, {
    key: "digitalWriteAll",
    value: function digitalWriteAll(flags) {
      var that = this;
      return new Promise(function (resolve, reject) {
        if (flags >= 0x00 && flags <= 0xFF) {
          that._state.pioOutputs = flags;

          that._c12c.pioOutput.writeValue(new Uint8Array([flags])).then(resolve, reject);
        }
      });
    } // Digital I/O }
    // { Analog Input

    /**
     * Read an analog pin
     *
     * @param {Number} pin Consts.AIO[1-3]
     * @returns {Promise<Number>}
     */

  }, {
    key: "analogRead",
    value: function analogRead(pin) {
      var c;

      switch (pin) {
        case Consts.AIO0:
          c = this._c12c.analogRead0;
          break;

        case Consts.AIO1:
          c = this._c12c.analogRead1;
          break;

        case Consts.AIO2:
          c = this._c12c.analogRead2;
          break;
      }

      return c.readValue().then(function (buf) {
        return buf.getUint8(0) << 8 | buf.getUint8(1);
      });
    } // Analog Input }
    // { PWM

    /**
     * Set PWM mode
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @param {Number} mode Consts.(KONASHI_PWM_ENABL|KONASHI_PWM_ENABLE_LED_MODE)
     * @returns {Promise<Void>}
     */

  }, {
    key: "pwmMode",
    value: function pwmMode(pin, mode) {
      // console.log('pwmMode: ' + pin + ' ' + mode);
      if (mode == Consts.KONASHI_PWM_ENABLE || mode == Consts.KONASHI_PWM_ENABLE_LED_MODE) {
        this._state.pwmModes |= 0x01 << pin;
      } else {
        this._state.pwmModes &= ~(0x01 << pin) & 0xff;
      }

      var that = this,
          data = new Uint8Array([this._state.pwmModes]);

      if (mode == Consts.KONASHI_PWM_ENABLE_LED_MODE) {
        return this._c12c.pwmConfig.writeValue(data).then(function () {
          return that.pwmPeriod(pin, Consts.KONASHI_PWM_LED_PERIOD);
        }); // .then(() => that.pwmDuty(pin, 0));
      }

      return this._c12c.pwmConfig.writeValue(data);
    }
    /**
     * Set the PWM cycle
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @param {Number} period
     * @returns {Promise<Void>}
     */

  }, {
    key: "pwmPeriod",
    value: function pwmPeriod(pin, period) {
      var data = new Uint8Array([pin, period >> 24 & 0xff, period >> 16 & 0xff, period >> 8 & 0xff, period >> 0 & 0xff]);
      return this._c12c.pwmParameter.writeValue(data);
    }
    /**
     * Set the duty cycle
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @param {Number} duty Please specify the units as microseconds (us) in 32bits.
     * @returns {Promise<Void>}
     */

  }, {
    key: "pwmDuty",
    value: function pwmDuty(pin, duty) {
      duty = parseInt(duty);
      var data = new Uint8Array([pin, duty >> 24 & 0xff, duty >> 16 & 0xff, duty >> 8 & 0xff, duty >> 0 & 0xff]); // console.log('pwmDuty: ' + pin + ' ' + duty);

      return this._c12c.pwmDuty.writeValue(data);
    }
  }, {
    key: "pwmLedDrive",
    value: function pwmLedDrive(pin, ratio) {
      ratio = Math.min(100.0, Math.max(0.0, ratio));
      var duty = Consts.KONASHI_PWM_LED_PERIOD * ratio / 100;
      return this.pwmDuty(pin, duty);
    }
    /**
     * Write PWM ratio
     *
     * @param {Number} pin Consts.PIO[0-7]
     * @param {Number} ratio (0-100)
     * @returns {Promise<Void>}
     */

  }, {
    key: "pwmWrite",
    value: function pwmWrite(pin, ratio) {
      ratio = Math.min(100, Math.max(0, ratio));
      var duty = Consts.KONASHI_PWM_LED_PERIOD * ratio / 100;
      return this.pwmDuty(pin, duty);
    } // PWM }
    // { UART

    /**
     * Set UART mode
     *
     * @param {Number} mode Consts.KONASHI_UART_(DISABLE|ENABLE)
     * @returns {Promise<Void>}
     */

  }, {
    key: "uartMode",
    value: function uartMode(mode) {
      if (mode != Consts.KONASHI_UART_DISABLE && mode != Consts.KONASHI_UART_ENABLE) {
        return Promise.reject(new Error('Invalid UART mode.'));
      }

      return this._c12c.uartConfig.writeValue(new Uint8Array([mode]));
    }
    /**
     * Set the bauda rate of UART
     *
     * @param {Number} rate Consts.KONASHI_UART_RATE_(2K4|9K6)
     * @returns {Promise<Void>}
     */

  }, {
    key: "uartBaudRate",
    value: function uartBaudRate(rate) {
      var that = this;

      if (rate != Consts.KONASHI_UART_RATE_2K4 && rate != Consts.KONASHI_UART_RATE_9K6) {
        return Promise.reject(new Error('Invalid UART baud rate.'));
      }

      var data = new Uint8Array([rate >> 8 & 0xff, rate & 0xff]);
      return this._c12c.uartBaudRate.writeValue(data);
    }
    /**
     * Write UART data
     *
     * @param {Uint8Array} data
     * @returns {Promise<Void>}
     */

  }, {
    key: "uartWrite",
    value: function uartWrite(data) {
      var chunkSize = Consts.KONASHI_UART_DATA_MAX_LENGTH;

      if (data.length <= chunkSize) {
        return this._uartWrite(data);
      }

      var chunks = [];

      for (var i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }

      return this._uartWriteChunks(chunks, 0);
    }
  }, {
    key: "_uartWriteChunks",
    value: function _uartWriteChunks(chunks, index) {
      if (chunks.length <= index) {
        return Promise.resolve();
      }

      var that = this;
      return this._uartWrite(chunks[index]).then(function () {
        return that._uartWriteChunks(chunks, index + 1);
      });
    }
  }, {
    key: "_uartWrite",
    value: function _uartWrite(data) {
      if (Consts.KONASHI_UART_DATA_MAX_LENGTH < data.length) {
        return Promise.reject(new Error('The data size has to be less then ' + Consts.KONASHI_UART_DATA_MAX_LENGTH + '.'));
      }

      var writeData = new Uint8Array(data.length + 1);
      writeData[0] = data.length;
      data.forEach(function (v, i) {
        writeData[i + 1] = v;
      });
      return this._c12c.uartTx.writeValue(writeData);
    } // UART }
    // { I2C

    /**
     * Set I2C mode
     *
     * @param {Number} mode Consts.KONASHI_I2C_(DISABLE|ENABLE|ENABLE_100K|ENABLE_400K)
     * @returns {Promise<Void>}
     */

  }, {
    key: "i2cMode",
    value: function i2cMode(mode) {
      if (mode != Consts.KONASHI_I2C_DISABLE && mode != Consts.KONASHI_I2C_ENABLE && mode != Consts.KONASHI_I2C_ENABLE_100K && mode != Consts.KONASHI_I2C_ENABLE_400K) {
        return Promise.reject(new Error('Invalid I2C mode'));
      }

      return this._c12c.i2cConfig.writeValue(new Uint8Array([mode]));
    }
  }, {
    key: "i2cStopCondition",
    value: function i2cStopCondition() {
      return this._i2cSendCondition(Consts.KONASHI_I2C_STOP_CONDITION);
    }
  }, {
    key: "i2cStartCondition",
    value: function i2cStartCondition() {
      return this._i2cSendCondition(Consts.KONASHI_I2C_STOP_CONDITION);
    }
  }, {
    key: "i2cRestartCondition",
    value: function i2cRestartCondition() {
      return this._i2cSendCondition(Consts.KONASHI_I2C_RESTART_CONDITION);
    }
    /**
     * @param {Number} condition Konashi.KONASHI_I2C_(STOP|START|RESTART)_CONDITION
     * @returns {Promise<Void>}
     */

  }, {
    key: "_i2cSendCondition",
    value: function _i2cSendCondition(condition) {
      if (condition != Consts.KONASHI_I2C_STOP_CONDITION && condition != Consts.KONASHI_I2C_START_CONDITION && condition != Consts.KONASHI_I2C_RESTART_CONDITION) {
        return Promise.reject(new Error('Invalid I2C condition.'));
      }

      return this._c12c.i2cStartStop.writeValue(new Uint8Array([condition]));
    }
    /**
     * Write I2C data
     *
     * @param {Number} address
     * @param {Uint8Array}
     * @returns {Promise<Void>}
     */

  }, {
    key: "i2cWrite",
    value: function i2cWrite(address, data) {
      var chunkSize = Consts.KONASHI_I2C_DATA_MAX_LENGTH;

      if (data.length <= chunkSize) {
        return this._i2cWrite(data);
      }

      var chunks = [];

      for (var i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }

      return this._i2cWriteChunks(address, chunks, 0);
    }
  }, {
    key: "_i2cWriteChunks",
    value: function _i2cWriteChunks(address, chunks, index) {
      if (chunks.length <= index) {
        return Promise.resolve();
      }

      var that = this;
      return this._i2cWrite(chunks[index]).then(function () {
        return that._i2cWriteChunks(chunks, index + 1);
      });
    }
  }, {
    key: "_i2cWrite",
    value: function _i2cWrite(address, data) {
      if (Consts.KONASHI_I2C_DATA_MAX_LENGTH < data.length) {
        return Promise.reject(new Error('The data size has to be less than ' + Consts.KONASHI_I2C_DATA_MAX_LENGTH + '.'));
      }

      var writeData = new Uint8Array(Consts.KONASHI_I2C_DATA_MAX_LENGTH + 2);
      writeData[0] = data.length + 1;
      writeData[1] = address << 1 & 254;
      data.forEach(function (v, i) {
        writeData[i + 2] = v;
      });
      return this._c12c.i2cWrite.writeValue(writeData);
    } // TODO

  }, {
    key: "i2cRead",
    value: function i2cRead(address, length) {} // I2C }
    // { SPI
    // TODO

  }, {
    key: "spiMode",
    value: function spiMode(mode, speed, bitOrder) {}
  }, {
    key: "spiWrite",
    value: function spiWrite(data) {}
  }, {
    key: "spiRead",
    value: function spiRead() {} // SPI }
    // { Hardware Control

    /**
     * Disconnect
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      return this._gatt.disconnect();
    }
    /**
     * Reset hardware
     */

  }, {
    key: "reset",
    value: function reset() {
      return this._c12c.hardwareReset.writeValue(new Uint8Array([1]));
    }
    /**
     * Read battery level
     *
     * @returns {Promise<Number>}
     */

  }, {
    key: "batteryLevelRead",
    value: function batteryLevelRead() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3._gatt.getPrimaryService('battery_service').then(function (service) {
          return service.getCharacteristic('battery_level');
        }).then(function (v) {
          resolve(new Uint8Array(v)[0]);
        });
      });
    }
    /**
     * TODO: Read deivce's RSSI
     *
     * @returns {Number} RSSI
     */

  }, {
    key: "signalStrengthRead",
    value: function signalStrengthRead() {} // Hardware Control }

  }]);

  return Konashi;
}(); // module.exports = Konashi;


exports.funcs = Konashi;
exports.consts = Consts;
