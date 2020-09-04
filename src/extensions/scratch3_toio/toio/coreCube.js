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

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Base64Util = require("scratch-vm/src/util/base64-util");

var formatMessage = require("format-message");

var index_1 = __importDefault(require("./index"));

var peripheral_1 = __importDefault(require("../peripheral"));

var mat_1 = __importDefault(require("./mat"));

var intelligent_1 = __importDefault(require("./intelligent/"));

var targetPose_1 = __importDefault(require("./targetPose"));

var cancelablePromise_1 = __importDefault(require("./cancelablePromise"));

var warning_1 = require("../warning");

var util_1 = __importDefault(require("../util"));
/**
 * This controls a Core Cube.
 */


var CoreCube =
/** @class */
function (_super) {
  __extends(CoreCube, _super);

  function CoreCube(runtime, extensionId) {
    var _this = _super.call(this, runtime, extensionId) || this;

    _this.ServiceUuid = index_1.default.uuid('0100');
    _this.configurationIndex = 0; // Cancelable promises for each characteristic.

    _this.cancelablePromises = {};
    _this.previousSpeeds = null;
    _this.targetPose = new targetPose_1.default(_this); // This is called when a Core Cube is connected.

    _this.onConnected = function () {
      return __awaiter(_this, void 0, Promise, function () {
        var _this = this;

        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _super.prototype.onConnected.call(this);

              return [4
              /*yield*/
              , this.checkProtocolVersion()];

            case 1:
              _a.sent();

              this.startNotifications(CoreCube.CharacteristicUuid.ID, this.onNotified); // Start watchdog excepts on Windows because BLE read does not work as expected on Windows.

              if (!util_1.default.isWindows) {
                this.watchdog.start(function () {
                  _this.read(CoreCube.CharacteristicUuid.ID, _this.onNotified);
                }, CoreCube.BLE_WATCHDOG_INTERVAL);
              }

              return [2
              /*return*/
              ];
          }
        });
      });
    }; // This is called when notification is received.


    _this.onNotified = function (base64) {
      _this.watchdog.tick();

      var data = Base64Util.base64ToUint8Array(base64);

      switch (data[0]) {
        case CoreCube.ReceivedId.POSITION_ID:
          {
            /* tslint:disable:no-bitwise */
            var matX = data[1] | data[2] << 8;
            var matY = data[3] | data[4] << 8;
            var matDirection = data[5] | data[6] << 8;
            /* tslint:enable:no-bitwise */

            _this.state = __assign(__assign({
              isTouched: true
            }, mat_1.default.convertFromMatCoordinate(matX, matY)), {
              direction: mat_1.default.convertDirection(matDirection),
              rawX: matX,
              rawY: matY,
              rawDirection: matDirection,
              standardId: null
            });
            break;
          }

        case CoreCube.ReceivedId.STANDARD_ID:
          {
            /* tslint:disable:no-bitwise */
            var standardId = data[1] | data[2] << 8 | data[3] << 16 | data[4] << 24;
            var matDirection = data[5] | data[6] << 8;
            /* tslint:enable:no-bitwise */

            _this.state = {
              isTouched: true,
              direction: mat_1.default.convertDirection(matDirection),
              rawDirection: matDirection,
              standardId: standardId
            };
            break;
          }

        default:
          _this.state.isTouched = false;
          _this.state.standardId = null;
          break;
      }

      if (!_this.state.isTouched) {
        _this.targetPose.reset();
      }
    };

    _this.state = {
      isTouched: false,
      x: 0,
      y: 0,
      direction: 0,
      rawX: 0,
      rawY: 0,
      rawDirection: 0,
      standardId: null,
      matColumn: 0,
      matRow: 0
    };
    _this.intelligent = new intelligent_1.default(_this);
    return _this;
  }
  /**
   * Check protocol version of the connected Core Cube.
   */


  CoreCube.prototype.checkProtocolVersion = function () {
    return __awaiter(this, void 0, Promise, function () {
      var data, protocolVersion;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.getConfiguration(CoreCube.ConfigurationId.REQUEST_BLE_PROTOCOL_VERSION)];

          case 1:
            data = _a.sent();
            this.protocolVersion = {
              major: data[0] - 48,
              minor: data[2] - 48,
              patch: data[4] - 48
            };
            protocolVersion = "v" + this.protocolVersion.major + "." + this.protocolVersion.minor + "." + this.protocolVersion.patch;
            console.info('Protocol version:', protocolVersion);

            if (this.compareVersions(this.protocolVersion, CoreCube.LATEST_PROTOCOL_VERSION) === -1) {
              warning_1.injectWarningButton(formatMessage('toio.requireUpdate'), formatMessage('toio.requireUpdateDetail'), index_1.default.URL_FOR_UPDATE);
            } else {
              warning_1.removeWarningButton();
            }

            this.intelligent.update(this);
            //window.GoogleAnalytics.ga('set', 'dimension1', protocolVersion);
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  CoreCube.prototype.compareVersions = function (version1, version2) {
    if (version1.major > version2.major) {
      return 1;
    } else if (version1.major < version2.major) {
      return -1;
    }

    if (version1.minor > version2.minor) {
      return 1;
    } else if (version1.minor < version2.minor) {
      return -1;
    }

    if (version1.patch > version2.patch) {
      return 1;
    } else if (version1.patch < version2.patch) {
      return -1;
    }

    return 0;
  };

  CoreCube.prototype.updateTexts = function () {
    if (!warning_1.checkIfWarningButtonExist()) {
      return;
    }

    warning_1.removeWarningButton();
    warning_1.injectWarningButton(formatMessage('toio.requireUpdate'), formatMessage('toio.requireUpdateDetail'), index_1.default.URL_FOR_UPDATE);
  };

  CoreCube.prototype.getState = function () {
    return this.state;
  };
  /**
   * Move the Core Cube.
   *
   * @param {Array<number>} speeds Speeds of the left and right motors.
   * @param {?number} duration Duration of the movement.
   * @returns {Promise<void>} Promise to move the Core Cube.
   */


  CoreCube.prototype.move = function (speeds, duration) {
    if (duration === void 0) {
      duration = 0;
    } // Cancel if speeds are the same as the previous one


    if (duration === 0 && this.previousSpeeds && this.previousSpeeds[0] === speeds[0] && this.previousSpeeds[1] === speeds[1]) {
      return;
    }

    this.previousSpeeds = speeds;
    var data = [];
    data.push(duration ? 2 : 1);

    for (var i = 0; i < speeds.length; i++) {
      var speed = Math.max(Math.min(speeds[i], CoreCube.MAX_SPEED), -CoreCube.MAX_SPEED);
      data.push(i + 1, speed >= 0 ? 1 : 2, Math.abs(speed));
    }

    if (duration) {
      data.push(duration * (1000 / 10));
    }

    return this.write(CoreCube.CharacteristicUuid.MOTOR, data);
  };
  /**
   * Move thc Core Cube to the given position.
   *
   * @param {number} x X coordinate.
   * @param {number} y Y coordinate.
   * @param {number} speed Speed of the movement.
   * @param {?boolean} allowBackward Flag if backward movement is allowed if needed.
   * @returns {Promise<void>} Promise to move the Core Cube to the position.
   */


  CoreCube.prototype.moveTo = function (x, y, speed, allowBackward) {
    var _this = this;

    if (allowBackward === void 0) {
      allowBackward = false;
    }

    this.previousSpeeds = null;
    this.cancel('motor');

    if (speed > CoreCube.MAX_SPEED) {
      speed = CoreCube.MAX_SPEED;
    }

    this.cancelablePromises.motor = new cancelablePromise_1.default(function (promise) {
      return _this.intelligent.moveTo(promise, x, y, speed, allowBackward);
    }, function () {
      return _this.stopMotors();
    });
    return this.cancelablePromises.motor.rawPromise;
  };
  /**
   * Point the Core Cube in the given direction.
   *
   * @param {number} direction Direction for the Core Cube to point in.
   * @param {number} speed Speed of the movement.
   * @returns {Promise<void>} Promise to point the Core Cube in the direction.
   */


  CoreCube.prototype.pointInDirection = function (direction, speed) {
    var _this = this;

    this.previousSpeeds = null;
    this.cancel('motor');

    if (speed > CoreCube.MAX_SPEED) {
      speed = CoreCube.MAX_SPEED;
    }

    this.cancelablePromises.motor = new cancelablePromise_1.default(function (promise) {
      return _this.intelligent.pointInDirection(promise, direction, speed);
    }, function () {
      return _this.stopMotors();
    });
    return this.cancelablePromises.motor.rawPromise;
  };
  /**
   * Stop all motors.
   *
   * @returns {Promise<void>} Promise to stop the Core Cube.
   */


  CoreCube.prototype.stopMotors = function () {
    return this.move([0, 0]);
  };
  /**
   * Turn on the light with the given color.
   *
   * @param {Array<number>} color RGB values for the light to be.
   * @param {?duration} duration Duration of turning on the light.
   * @returns {object} Promise to set light color.
   */


  CoreCube.prototype.setLightColor = function (color, duration) {
    var _this = this;

    if (duration === void 0) {
      duration = 0;
    }

    this.cancel('light');

    var data = __spreadArrays([3, 0, 1, 1], color);

    this.write(CoreCube.CharacteristicUuid.LIGHT, data);
    return this.generateCancelablePromise('light', null, function () {
      return _this.turnOffLight();
    }, duration * 1000);
  };
  /**
   * Turn off the light.
   */


  CoreCube.prototype.turnOffLight = function () {
    var data = [1];
    this.write(CoreCube.CharacteristicUuid.LIGHT, data);
  };
  /**
   * Play a sound.
   *
   * @param {number} note Note number to be played.
   * @param {number} loudness Loudness (but does not affect because Core Cube does not support).
   * @param {?number} duration Duration of the sound.
   * @returns {Promise<void>} Promise to play the sound.
   */


  CoreCube.prototype.playSound = function (note, loudness, duration) {
    var _this = this;

    if (duration === void 0) {
      duration = 0;
    }

    this.cancel('sound');
    var data = [3, 0, 1, 255, note, loudness];
    this.write(CoreCube.CharacteristicUuid.SOUND, data);
    return this.generateCancelablePromise('sound', null, function () {
      return _this.stopSound();
    }, duration * 1000);
  };
  /**
   * Stop the sound.
   */


  CoreCube.prototype.stopSound = function () {
    var data = [1];
    this.write(CoreCube.CharacteristicUuid.SOUND, data);
  };
  /**
   * Get configuration of the connected Core Cube.
   *
   * @param {number} id Configuration ID.
   * @returns {object} Promise to get configuration.
   */


  CoreCube.prototype.getConfiguration = function (id) {
    var _this = this;

    return new Promise(function (resolve) {
      var index = _this.configurationIndex;

      _this.startNotifications(CoreCube.CharacteristicUuid.CONFIGURATION, function (base64) {
        var data = Base64Util.base64ToUint8Array(base64);

        if (data[0] === id + 0x80 && data[1] === index) {
          resolve(data.slice(2));
        }
      });

      setTimeout(function () {
        _this.write(CoreCube.CharacteristicUuid.CONFIGURATION, [id, index]);
      }, 500);
      _this.configurationIndex++;
    });
  };
  /**
   * Check if Core Cube's protocol version is greater than or equal to the given
   * version.
   *
   * @param {number} major Major version.
   * @param {number} minor Minor version.
   * @param {number} patch Patch version.
   * @returns {boolean} Flag if protocol version is greater than or equal to the
   * version.
   */


  CoreCube.prototype.checkIfProtocolVersionGreaterThanOrEqual = function (major, minor, patch) {
    if (!this.protocolVersion) {
      return false;
    }

    var COEFFICIENT = 1000; // Convert the version number into a single value to be easily compared.

    var versionValue = (this.protocolVersion.major * COEFFICIENT + this.protocolVersion.minor) * COEFFICIENT + this.protocolVersion.patch;
    var value = (major * COEFFICIENT + minor) * COEFFICIENT + patch;
    return versionValue >= value;
  };
  /**
   * Utility function to generate a cancelable promise.
   *
   * @param {string} label An label to specify a characteristic.
   * @param {?function} callback Callback to be called when this promise is
   * generated.
   * @param {?function} cancelCallback Callback to be called when this promise
   * is canceled.
   * @param {?number} duration Timeout duration if needed.
   * @returns {object} Promise to execute the callback or wait for the given
   * duration.
   */


  CoreCube.prototype.generateCancelablePromise = function (label, callback, cancelCallback, duration) {
    this.cancelablePromises[label] = new cancelablePromise_1.default(callback, cancelCallback, duration);
    return this.cancelablePromises[label].rawPromise;
  };
  /**
   * Cancel a canceled promise.
   *
   * @param {string} label An label to specify a characteristic.
   * @param {?boolean} needsStop Flag if it forces to stop.
   */


  CoreCube.prototype.cancel = function (label, needsStop) {
    if (needsStop === void 0) {
      needsStop = false;
    }

    if (!this.cancelablePromises[label]) {
      return;
    }

    this.cancelablePromises[label].cancel(needsStop);
    this.cancelablePromises[label] = null;
  };

  CoreCube.CharacteristicUuid = {
    ID: index_1.default.uuid('0101'),
    MOTOR: index_1.default.uuid('0102'),
    LIGHT: index_1.default.uuid('0103'),
    SOUND: index_1.default.uuid('0104'),
    SENSOR: index_1.default.uuid('0106'),
    BUTTON: index_1.default.uuid('0107'),
    CONFIGURATION: index_1.default.uuid('01ff')
  };
  CoreCube.ConfigurationId = {
    REQUEST_BLE_PROTOCOL_VERSION: 1
  };
  CoreCube.LATEST_PROTOCOL_VERSION = {
    major: 2,
    minor: 1,
    patch: 0
  };
  CoreCube.ReceivedId = {
    POSITION_ID: 1,
    STANDARD_ID: 2
  };
  CoreCube.MAX_SPEED = 255;
  CoreCube.BLE_WATCHDOG_INTERVAL = 1000;
  return CoreCube;
}(peripheral_1.default);

exports.default = CoreCube;
