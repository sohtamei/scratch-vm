'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CancelError =
/*#__PURE__*/
function (_Error) {
  _inherits(CancelError, _Error);

  function CancelError(reason) {
    var _this;

    _classCallCheck(this, CancelError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CancelError).call(this, reason || 'Promise was canceled'));
    _this.name = 'CancelError';
    return _this;
  }

  _createClass(CancelError, [{
    key: "isCanceled",
    get: function get() {
      return true;
    }
  }]);

  return CancelError;
}(_wrapNativeSuper(Error));

var PCancelable =
/*#__PURE__*/
function () {
  _createClass(PCancelable, null, [{
    key: "fn",
    value: function fn(userFn) {
      return function () {
        for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
          arguments_[_key] = arguments[_key];
        }

        return new PCancelable(function (resolve, reject, onCancel) {
          arguments_.push(onCancel); // eslint-disable-next-line promise/prefer-await-to-then

          userFn.apply(void 0, arguments_).then(resolve, reject);
        });
      };
    }
  }]);

  function PCancelable(executor) {
    var _this2 = this;

    _classCallCheck(this, PCancelable);

    this._cancelHandlers = [];
    this._isPending = true;
    this._isCanceled = false;
    this._rejectOnCancel = true;
    this._promise = new Promise(function (resolve, reject) {
      _this2._reject = reject;

      var onResolve = function onResolve(value) {
        _this2._isPending = false;
        resolve(value);
      };

      var onReject = function onReject(error) {
        _this2._isPending = false;
        reject(error);
      };

      var onCancel = function onCancel(handler) {
        if (!_this2._isPending) {
          throw new Error('The `onCancel` handler was attached after the promise settled.');
        }

        _this2._cancelHandlers.push(handler);
      };

      Object.defineProperties(onCancel, {
        shouldReject: {
          get: function get() {
            return _this2._rejectOnCancel;
          },
          set: function set(boolean) {
            _this2._rejectOnCancel = boolean;
          }
        }
      });
      return executor(onResolve, onReject, onCancel);
    });
  }

  _createClass(PCancelable, [{
    key: "then",
    value: function then(onFulfilled, onRejected) {
      // eslint-disable-next-line promise/prefer-await-to-then
      return this._promise.then(onFulfilled, onRejected);
    }
  }, {
    key: "catch",
    value: function _catch(onRejected) {
      return this._promise.catch(onRejected);
    }
  }, {
    key: "finally",
    value: function _finally(onFinally) {
      return this._promise.finally(onFinally);
    }
  }, {
    key: "cancel",
    value: function cancel(reason) {
      if (!this._isPending || this._isCanceled) {
        return;
      }

      if (this._cancelHandlers.length > 0) {
        try {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this._cancelHandlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var handler = _step.value;
              handler();
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } catch (error) {
          this._reject(error);
        }
      }

      this._isCanceled = true;

      if (this._rejectOnCancel) {
        this._reject(new CancelError(reason));
      }
    }
  }, {
    key: "isCanceled",
    get: function get() {
      return this._isCanceled;
    }
  }]);

  return PCancelable;
}();

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);
module.exports = PCancelable;
module.exports.CancelError = CancelError;

