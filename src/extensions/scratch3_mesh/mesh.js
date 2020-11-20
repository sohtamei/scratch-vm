class Mesh {
	constructor () {
		this._device = null;
		this._gatt = null;
		this._service = null;
		this._c12c = {};
		this._notifyCB = null;
	}

	get _serviceUUID() {
		return '72c90001-57a9-4d40-b746-534e22ec9f9e';
	}

	get _c12cUUIDs() {
		return {
			writeWoResp: '72c90002-57a9-4d40-b746-534e22ec9f9e',
			notify:      '72c90003-57a9-4d40-b746-534e22ec9f9e',
			write:       '72c90004-57a9-4d40-b746-534e22ec9f9e',
			indicate:    '72c90005-57a9-4d40-b746-534e22ec9f9e',
		};
	}

	find(name, notifyCB) {
		this._notifyCB = notifyCB;

		var options = {
			filters: [{namePrefix: name}],
//      acceptAllDevices: true,
			optionalServices: [this._serviceUUID]
		};

		var that = this;
		return new Promise(function (resolve, reject) {
			console.log("0. bluetooth.requestDevice");
			navigator.bluetooth.requestDevice(options).then(
				function (device) {
					console.log("1. _device.gatt.connect");
					that._device = device;
					return device.gatt.connect()
				}, function (e) {
					return reject(e);
				/*
					var askedRetrieve = /retrieve services/;
					if (askedRetrieve.test(e)) {
						that.connect().then(resolve, reject); // TODO: Research reject activity
					} else {
						reject(e);
					}
				*/
				}
			).then(
				function (gatt) {
					console.log("2. gatt.getPrimaryService");
					that._gatt = gatt;
					return gatt.getPrimaryService(that._serviceUUID);
				}, function (e) {
					return reject(e);
				}
			).then(  // 2. gatt.getPrimaryService
				function (service) {
					that._service = service;
					var promises = [], keys = [];

					for (var key in that._c12cUUIDs) {
						keys.push(key);
					}

					keys.forEach(function (label, i) {
						promises.push(that._service.getCharacteristic(that._c12cUUIDs[label]).then(
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
					var onReceived = function (event) {
						var buf = event.target.value;
						//console.log(event);
						console.log(event.srcElement.service.device.name);
						console.log(buf.buffer);
						if(that._notifyCB) that._notifyCB(event.srcElement.service.device.name, buf);
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

	isConnected() {
		var connected = false;

		if (this._gatt) {
			connected = this._gatt.connected;
		}
		return connected;
	}

	name() {
		return this._device.name;
	}

	delay(ms) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, ms);
		});
	}

	writeWoResp(data) {
		var writeData = new Uint8Array(data.length);
		data.forEach(function (v, i) {
			writeData[i] = v;
		});
		return this._c12c.writeWoResp.writeValue(writeData);
	}

	write(data) {
		var writeData = new Uint8Array(data.length);
		data.forEach(function (v, i) {
			writeData[i] = v;
		});
		return this._c12c.write.writeValue(writeData);
	}

	disconnect() {
		return this._gatt.disconnect();
	}

	batteryLevelRead() {
		var _this3 = this;

		return new Promise(function (resolve, reject) {
			_this3._gatt.getPrimaryService('battery_service').then(function (service) {
				return service.getCharacteristic('battery_level');
			}).then(function (v) {
				resolve(new Uint8Array(v)[0]);
			});
		});
	}

	signalStrengthRead() {} // Hardware Control }
}

module.exports = Mesh;
