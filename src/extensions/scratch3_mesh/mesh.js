function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Mesh = /*#__PURE__*/function () {
  function Mesh(device) {
    _classCallCheck(this, Mesh);

    this._device = device;
    this._gatt = null;
    this._service = null;
    this._c12c = {};
    this._notifyCB = null;
    this._state = {
      ButtonTagPressed: false
    };
  }

  _createClass(Mesh, null, [{
    key: "_serviceUUID",
    get: function get() {
      return '72c90001-57a9-4d40-b746-534e22ec9f9e';
    }

  }, {
    key: "_c12cUUIDs",
    get: function get() {
      return {
        writeWoResp: '72c90002-57a9-4d40-b746-534e22ec9f9e',
        notify:      '72c90003-57a9-4d40-b746-534e22ec9f9e',
        write:       '72c90004-57a9-4d40-b746-534e22ec9f9e',
        indicate:    '72c90005-57a9-4d40-b746-534e22ec9f9e',
      };
    }

  }, {
    key: "find",
    value: function find(autoConnect, name, notifyCB, options) {
      if (_typeof(autoConnect) == undefined) {
        autoConnect = true;
      }
      _notifyCB = notifyCB;

      options = options || {
        filters: [{
          namePrefix: name
        }],
//      acceptAllDevices: true,
        optionalServices: [Mesh._serviceUUID]
      };

      return new Promise(function (resolve, reject) {
        navigator.bluetooth.requestDevice(options).then(
          function (d) {
            console.log("0. bluetooth.requestDevice");
            var mesh = new Mesh(d);

            if (autoConnect) {
              mesh.connect().then(resolve, reject);  // connect, gatt, service
            } else {
              resolve(mesh);
            }
          }, function (e) {
            var askedRetrieve = /retrieve services/;

            if (askedRetrieve.test(e)) {
              mesh.connect().then(resolve, reject); // TODO: Research reject activity
            } else {
              reject(e);
            }
          }
        );
      });
    }

//  }, {

  }]);
  _createClass(Mesh, [{

    key: "connect",
    value: function connect() {
      var that = this;
      return new Promise(function (resolve, reject) {
        console.log("1. _device.gatt.connect");
        that._device.gatt.connect().then(
          function (gatt) {
            console.log("2. gatt.getPrimaryService");
            that._gatt = gatt;
            return gatt.getPrimaryService(Mesh._serviceUUID);
          }, function (e) {
            return reject(e);
          }
        ).then(  // 2. gatt.getPrimaryService
          function (service) {
            that._service = service;
            var promises = [], keys = [];

            for (var key in Mesh._c12cUUIDs) {
              keys.push(key);
            }

            keys.forEach(function (label, i) {
              promises.push(that._service.getCharacteristic(Mesh._c12cUUIDs[label]).then(
                function (c) {
                  console.log("3. _service.getCharacteristic"+i);
                  that._c12c[label] = c;
                  Promise.resolve();
                }
              ));
            });
            return Promise.all(promises);  // 3. _service.getCharacteristic
          }, function (e) {
            return reject(e);
          }
        ).then(  // 3. _service.getCharacteristic
          function () {
            console.log("4. indicate.startNotifications");
            return that._c12c.indicate.startNotifications();
          }, function (e) {
            return reject(e);
          }
        ).then(  // 4. indicate.startNotifications
          function (char) {
            var onReceived = function onReceived(event) {
              var buf = event.target.value;
              var value = buf.getUint8(0);
              console.log("indicate "+buf);
            }
            that._c12c.indicate.addEventListener('characteristicvaluechanged', onReceived);

            console.log("5. write.writeValue");
            var data = [0x00,0x02,0x01,0x03];
            var writeData = new Uint8Array(data.length);
            data.forEach(function (v, i) {
              writeData[i] = v;
            });
            return that._c12c.write.writeValue(writeData);
          }, function (e) {
            that._c12c.indicate.removeEventListener('characteristicvaluechanged', onReceived);
            return reject(e);
          }
        ).then(  // 5. write.writeValue
          function () {
            console.log("6. notify.startNotifications");
            return that._c12c.notify.startNotifications();  // 6. notify.startNotifications
          }, function (e) {
            console.log("error");
            return reject(e);
          }
        ).then(  // 6. notify.startNotifications
          function (_) {
            var onReceived = function onReceived(event) {
              var buf = event.target.value;
              //console.log(event);
              console.log(event.srcElement.service.device.name);
              console.log(buf.buffer);
              if(_notifyCB) _notifyCB(event.srcElement.service.device.name, buf);
            }
            that._c12c.notify.addEventListener('characteristicvaluechanged', onReceived);

            console.log("connected!");
            return resolve(that);  // finish
          }, function (e) {
            that._c12c.notify.removeEventListener('characteristicvaluechanged', onReceived);
            return reject(e);
          }
        );
        
      });
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      var connected = false;

      if (this._gatt) {
        connected = this._gatt.connected;
      }
      return connected;
    }
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
    }
  }, {
    key: "writeWoResp",
    value: function writeWoResp(data) {
      var writeData = new Uint8Array(data.length);
      data.forEach(function (v, i) {
        writeData[i] = v;
      });
      return this._c12c.writeWoResp.writeValue(writeData);
    }
  }, {
    key: "write",
    value: function write(data) {
      var writeData = new Uint8Array(data.length);
      data.forEach(function (v, i) {
        writeData[i] = v;
      });
      return this._c12c.write.writeValue(writeData);
    }
/*
  }, {
    key: "getButtonTagPressed",
    value: function getButtonTagPressed() {
      var pressed = this._state.ButtonTagPressed;
      if(pressed) {
        console.log("pressed");
        this._state.ButtonTagPressed = false;
      }
      return pressed;
    }
*/
/*
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
*/
  }, {
    key: "disconnect",
    value: function disconnect() {
      return this._gatt.disconnect();
    }

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

  }, {
    key: "signalStrengthRead",
    value: function signalStrengthRead() {} // Hardware Control }

  }]);

  return Mesh;
}(); // module.exports = Mesh;


exports.funcs = Mesh;
