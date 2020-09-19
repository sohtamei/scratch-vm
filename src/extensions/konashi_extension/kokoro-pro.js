function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Konashi = require("../konashijs/konashi.js");

var log = require("../../util/log");

var _PioPin = function _PioPin(pin) {
  _classCallCheck(this, _PioPin);

  this.number = pin;
  this.pioMode = Konashi.consts.INPUT;
  this.pullup = Konashi.consts.NO_PULLS;
  this.input = Konashi.consts.LOW;
  this.output = Konashi.consts.LOW;
  this.pwmMode = Konashi.consts.KONASHI_PWM_DISABLE;
  this.pwmPeriod = 0;
  this.pwmDuty = 0;
  this.pwmRatio = 0;
};

var _AnalogPin = function _AnalogPin(pin) {
  _classCallCheck(this, _AnalogPin);

  this.number = pin;
  this.input = -1;
};

var BLE_DELAY = {
  NONE: 0,
  NORMAL: 40,
  LONG: 100,
  READ: 200,
  DEBUG: 1000
};
/**
 * TODO: test this function
 */

var Queue = function Queue() {
  _classCallCheck(this, Queue);

  var queue = Promise.resolve(true);

  var add = function add(job, delay) {
    var p = function p() {
      return new Promise(function (resolve) {
        setTimeout(function () {
          job();
          resolve();
        }, delay);
      });
    };

    queue = queue.then(p);
  };

  this.add = add;
};

var KokoroPro = /*#__PURE__*/function () {
  function KokoroPro(onReceived) {
    _classCallCheck(this, KokoroPro);

    this._queue = new Queue();
    this._konashi = null;
    this._name = null;
    this._onReceived = onReceived;
    this._pioPins = [new _PioPin(0), new _PioPin(1), new _PioPin(2), new _PioPin(3), new _PioPin(4), new _PioPin(5), new _PioPin(6), new _PioPin(7)];
    this._analogPins = [new _AnalogPin(0), new _AnalogPin(1), new _AnalogPin(2)];
  }

  _createClass(KokoroPro, [{
    key: "getConsts",
    value: function getConsts() {
      return {
        PIO0: Konashi.consts.PIO0,
        PIO1: Konashi.consts.PIO1,
        PIO2: Konashi.consts.PIO2,
        PIO3: Konashi.consts.PIO3,
        PIO4: Konashi.consts.PIO4,
        PIO5: Konashi.consts.PIO5,
        PIO6: Konashi.consts.PIO6,
        PIO7: Konashi.consts.PIO7,
        AIO0: Konashi.consts.AIO0,
        AIO1: Konashi.consts.AIO1,
        AIO2: Konashi.consts.AIO2,
        HIGH: Konashi.consts.HIGH,
        LOW: Konashi.consts.LOW
      };
    }
  }, {
    key: "connect",
    value: function connect(prefix) {
      var _this = this;

      if (this._konashi) this._konashi.disconnect();
      return Konashi.funcs.find(true, name = prefix).then(function (k) {
        _this._konashi = k;
        _this._name = k.name();
        _this._connected = true;
      }).then(function (_) {
        _this._startDigitalRead();
      });
    }
    /**
     * TODO: test this function
     */

  }, {
    key: "reset",
    value: function reset() {
      this._queue.reset();

      this._konashi.reset();
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      var connected = false;

      if (this._konashi) {
        connected = this._konashi.isConnected();
      }

      return connected;
    }
    /**
     * @param {Konashi.consts.PIOX} pid 
     * @param {Konashi.consts.INPUT|OUTPUT} mode 
     */

  }, {
    key: "_setMode",
    value: function _setMode(pid, mode) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;
      if (mode == this._pioPins[pid].pinMode) return;
      that = this;

      this._queue.add(function () {
        that._konashi.pinMode(pid, mode);

        that._pioPins[pid].pinMode = mode;
      }, BLE_DELAY.LONG);
    }
    /**
     * Confirm if the pin mode is Konashi.consts.OUTPUT before call this function.
     * 
     * @param {Konashi.consts.PIOX} pid 
     * @param {Konashi.consts.HIGI|LOW} value 
     */

  }, {
    key: "setOutput",
    value: function setOutput(pid, value) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;
      var isModeChanged = false;

      if (this._pioPins[pid].pwmMode != Konashi.consts.KONASHI_PWM_DISABLE) {
        this._setPwmMode(pid, Konashi.consts.KONASHI_PWM_DISABLE);

        isModeChanged = true;
      }

      if (this._pioPins[pid].pioMode == Konashi.consts.INPUT) {
        this._setMode(pid, Konashi.consts.OUTPUT);

        isModeChanged = true;
      }

      if (!isModeChanged && this._pioPins[pid].output == value) {
        return;
      }

      that = this;

      this._queue.add(function () {
        that._konashi.digitalWrite(pid, value);

        that._pioPins[pid].output = value;
      }, BLE_DELAY.NORMAL);
    }
    /**
     * @param {*} pid 
     * @param {*} mode Konashi.consts.KONASHI_PWM_DISABLE|KONASHI_PWM_ENABLE|KONASHI_PWM_ENABLE_LED_MODE
     */

  }, {
    key: "_setPwmMode",
    value: function _setPwmMode(pid, mode) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;
      if (mode == this._pioPins[pid].pwmMode) return;
      that = this;

      this._queue.add(function () {
        that._konashi.pwmMode(pid, mode);

        that._pioPins[pid].pwmMode = mode;
      }, BLE_DELAY.LONG);
    }
    /**
     * @param {*} pid 
     * @param {Int} ratio 0 - 100
     */

  }, {
    key: "pwmLedDrive",
    value: function pwmLedDrive(pid, ratio) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;
      var isModeChanged = false;

      if (this._pioPins[pid].pioMode == Konashi.consts.INPUT) {
        this._setMode(pid, Konashi.consts.OUTPUT);
      }

      if (this._pioPins[pid].pwmMode != Konashi.consts.KONASHI_PWM_ENABLE_LED_MODE) {
        this._setPwmMode(pid, Konashi.consts.KONASHI_PWM_ENABLE_LED_MODE);

        this._pwmPeriod(pid, Konashi.consts.KONASHI_PWM_LED_PERIOD);

        isModeChanged = true;
      }

      if (!isModeChanged && ratio == this._pioPins[pid].pwmRatio) {
        return;
      }

      that = this;

      this._queue.add(function () {
        that._konashi.pwmLedDrive(pid, ratio);

        that._pioPins[pid].pwmRatio = ratio;
      }, BLE_DELAY.NORMAL);
    }
    /**
     * @param {*} pid 
     * @param {*} period 
     */

  }, {
    key: "_pwmPeriod",
    value: function _pwmPeriod(pid, period) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;
      that = this;

      this._queue.add(function () {
        that._konashi.pwmPeriod(pid, period);

        that._pioPins[pid].pwmPeriod = period;
      }, BLE_DELAY.NORMAL);
    }
    /**
     * @param {*} pid 
     * @param {*} duty 
     */

  }, {
    key: "_pwmDuty",
    value: function _pwmDuty(pid, duty) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;

      if (this._pioPins[pid].pwmMode != Konashi.consts.KONASHI_PWM_ENABLE) {
        this._setPwmMode(pid, Konashi.consts.KONASHI_PWM_ENABLE);
      } else if (duty == this._pioPins[pid].pwmDuty) {
        return;
      }

      that = this;

      this._queue.add(function () {
        that._konashi.pwmDuty(pid, duty);

        that._pioPins[pid].pwmDuty = duty;
      }, BLE_DELAY.NORMAL);
    }
    /**
     * 
     * @param {*} pid 
     * @param {*} duty 
     */

  }, {
    key: "pwmServoDrive",
    value: function pwmServoDrive(pid, duty) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;
      var isModeChanged = false;

      if (this._pioPins[pid].pioMode == Konashi.consts.INPUT) {
        this._setMode(pid, Konashi.consts.OUTPUT);
      }

      if (this._pioPins[pid].pwmMode != Konashi.consts.KONASHI_PWM_ENABLE) {
        this._setPwmMode(pid, Konashi.consts.KONASHI_PWM_ENABLE);

        this._pwmPeriod(pid, Konashi.consts.KONASHI_PWM_SERVO_PERIOD);

        isModeChanged = true;
      }

      if (!isModeChanged && duty == this._pioPins[pid].pwmDuty) {
        return;
      }

      this._pwmDuty(pid, duty);
    }
    /**
     * @param {*} aio Konashi.consts.AIO0|AIO1|AIO2
     */

  }, {
    key: "getAnalogValue",
    value: function getAnalogValue(aio) {
      if (!this._konashi) return -1; // ERROR

      if (aio < 0 || 2 < aio) return -1; // ERROR

      return this._analogPins[aio].input;
    }
    /**
     * @param {*} aio Konashi.consts.AIO0|AIO1|AIO2
     */

  }, {
    key: "analogRead",
    value: function analogRead(aio) {
      if (!this._konashi) return -1; // ERROR

      if (aio < Konashi.consts.AIO0 || Konashi.consts.AIO2 < aio) return -2; // ERROR

      that = this;

      this._konashi.analogRead(aio).then(function (v) {
        var value = v / Konashi.consts.KONASHI_ANALOG_REFERENCE * 1000;
        that._analogPins[aio].input = value;
      });
    }
    /**
     * @param {*} pid 
     */

  }, {
    key: "getDigitalValue",
    value: function getDigitalValue(pid) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;
      return this._pioPins[pid].input;
    }
    /**
     * @param {*} pid 
     */

  }, {
    key: "digitalRead",
    value: function digitalRead(pid) {
      if (!this._konashi) return;
      if (pid < 0 || 7 < pid) return;

      if (this._pioPins[pid].pwmMode != Konashi.consts.KONASHI_PWM_DISABLE) {
        this._setPwmMode(pid, Konashi.consts.KONASHI_PWM_DISABLE);
      }

      if (this._pioPins[pid].pinMode == Konashi.consts.OUTPUT) {
        this._setMode(pid, Konashi.consts.INPUT);
      }

      that = this;

      this._konashi.digitalRead(pid).then(function (v) {
        that._pioPins[pid].input = v; // Konashi.consts.HIGH || Konashi.consts.LOW
      });
    }
  }, {
    key: "_startDigitalRead",
    value: function _startDigitalRead() {
      var that = this;

      this._onNotified = function (data) {
        // data is Number (0bXXXXXXXX)
        that._pioPins.forEach(function (pin) {
          if (pin.pioMode == Konashi.consts.INPUT) {
            var input = data >> pin.number & 0x01; // 0: LOW, 1: HIGH

            if (pin.input != input) {
              pin.input = input;

              that._onReceived(pin.number, input); // argument should be (pin number 0 to 7) and (Konashi.consts.LOW|HIGH)

            }
          }
        });
      };

      if (!this._konashi) return;

      this._konashi.startDigitalInputNotification(this._onNotified);
    } // { miscs and TBD functions

    /**
     * Log wrapper
     * 
     * @param {String} message 
     */

  }, {
    key: "_log",
    value: function _log(message) {
      log.log("kokoro pro: " + message);
    } // miscs and TBD functions}

  }]);

  return KokoroPro;
}();

module.exports = KokoroPro;
