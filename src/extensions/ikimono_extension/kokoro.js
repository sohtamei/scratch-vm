function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Konashi = require("../konashijs/konashi.js");

var log = require("../../util/log");
/**
 * konashiのピンを表現したクラス
 */


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
/**
 * Web Bluetooth には Bluetooth のコマンド送受信の失敗エラーハンドリングが実装されていないため、
 * Queueとdelayを使って、逐次処理っぽいものをここで実装しています。
 */


var Queue = /*#__PURE__*/function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this.queue = Promise.resolve(true);
    this.stopQueue = false;
  }

  _createClass(Queue, [{
    key: "add",
    value: function add(job, delay) {
      var p = function p() {
        return new Promise(function (resolve) {
          setTimeout(function () {
            job();
            resolve();
          }, delay);
        });
      };

      this.queue = this.queue.then(p);
    }
  }]);

  return Queue;
}(); // 送るコマンドに応じて、送信完了にかかる時間が異なるので、複数の待ち受け時間を用意しています。


var _ble_delays = {
  NONE: 0,
  NORMAL: 50,
  LONG: 100,
  DEBUG: 1000
};

var Kokoro = /*#__PURE__*/function () {
  function Kokoro() {
    _classCallCheck(this, Kokoro);

    this._queue = new Queue();
    this._konashi = null;
    this._name = null;
    this._isSending = 0; // 現在送信QueueにたまっているPromiseの数

    this._pioPins = [new _PioPin(Konashi.consts.PIO0), new _PioPin(Konashi.consts.PIO1), new _PioPin(Konashi.consts.PIO2), new _PioPin(Konashi.consts.PIO3), new _PioPin(Konashi.consts.PIO4), new _PioPin(Konashi.consts.PIO5), new _PioPin(Konashi.consts.PIO6), new _PioPin(Konashi.consts.PIO7)];
  }
  /**
   * 接続を開始する
   * konashi の find, connect をラップしていることに加えて、
   * 初期起動時のPIN mode 書き換えも同時に行っている。
   * 
   * @param {String} prefix 
   */


  _createClass(Kokoro, [{
    key: "connect",
    value: function connect(prefix) {
      var _this = this;

      if (this._konashi) this._konashi.disconnect();
      return Konashi.funcs.find(true, name = prefix) // find で探索開始
      .then(function (k) {
        // 見つかったら、このクラスに実態GATTBluetoothDeviceを登録
        _this._konashi = k;
        _this._name = k.name();
        _this._isSending = 0;
      }).then(function () {
        // その後、初回起動時の関数を実行
        that = _this;

        _this._pioPins.forEach(function (pin) {
          _this._queue.add(function () {
            that._konashi.pwmMode(pin.number, Konashi.consts.KONASHI_PWM_ENABLE_LED_MODE);

            pin.pwmMode = Konashi.consts.KONASHI_PWM_ENABLE_LED_MODE;
          }, _ble_delays.LONG);

          _this._queue.add(function () {
            that._konashi.pwmLedDrive(pin.number, 0);

            pin.pwmRatio = 0;
          }, _ble_delays.LONG);
        });
      });
    } // type: 'all', 'motor', 'led'

  }, {
    key: "reset",
    value: function reset(type) {
      var _this2 = this;

      if (!this._konashi) return;

      if (type === "all") {
        this._pioPins.forEach(function (pin) {
          _this2._queue.add(function () {
            that._konashi.pwmLedDrive(pin.number, 0);

            pin.pwmRatio = 0;
          }, _ble_delays.NORMAL);
        });
      }

      if (type === "motor") {
        this._pioPins.slice(1, 5).forEach(function (pin) {
          _this2._queue.add(function () {
            that._konashi.pwmLedDrive(pin.number, 0);

            pin.pwmRatio = 0;
          }, _ble_delays.NORMAL);
        });
      }

      if (type === "led") {
        this._pioPins.slice(5, 8).forEach(function (pin) {
          _this2._queue.add(function () {
            that._konashi.pwmLedDrive(pin.number, 0);

            pin.pwmRatio = 0;
          }, _ble_delays.NORMAL);
        });
      }
    }
    /**
     * @returns {Boolean} 接続状態
     */

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
     * 現在のPWM値を取得
     * 
     * @param {Number} pid ピン番号
     */

  }, {
    key: "getPwmRatio",
    value: function getPwmRatio(pid) {
      if (pid < 0 || 7 < pid) return;
      return this._pioPins[pid].pwmRatio;
    }
    /**
     * setPwmRatio内でエラーハンドリングをする関数
     * 
     * @param {Error} error 
     */

  }, {
    key: "_errorCallback",
    value: function _errorCallback(error) {
      log.log("cocorokit error: " + error);
      var disconnectError = /disconnected/;

      if (disconnectError.test(error)) {}

      var alreadyUsedError = /already in progress/;

      if (alreadyUsedError.test(error)) {
        this._queue = new Queue();
        this._isSending = 0;

        this._konashi.reset();
      }
    }
    /**
     * ピンのPWM値を変更
     * 
     * @param {Number} pid ピン番号
     * @param {Numebr} ratio 0 - 100
     */

  }, {
    key: "setPwmRatio",
    value: function setPwmRatio(pid, ratio) {
      if (pid < 0 || 7 < pid) return; // ココロキットのPINの範囲内

      if (this._isSending >= 2) return; // 現状送信しているコマンドの数が2以上なら送らない

      if (ratio == this._pioPins[pid].pwmRatio) return; // 現在のPWM値と同じなら、送信しない

      that = this;
      that._isSending++;

      this._queue.add(function () {
        that._konashi.pwmLedDrive(pid, ratio) // 送信
        .then(function () {
          // 送信したらPINが持っている値を変更、
          that._pioPins[pid].pwmRatio = ratio;
          if (that._isSending > 0) that._isSending--; // 送信数を1つ減らす
        }).catch(that._errorCallback);
      }, _ble_delays.NORMAL); // 通常のディレイを挿入

    }
  }]);

  return Kokoro;
}();

module.exports = Kokoro;
