const BLEUUID = {
	service:     '72c90001-57a9-4d40-b746-534e22ec9f9e',
	writeWoResp: '72c90002-57a9-4d40-b746-534e22ec9f9e',
	notify:      '72c90003-57a9-4d40-b746-534e22ec9f9e',
	write:       '72c90004-57a9-4d40-b746-534e22ec9f9e',
	indicate:    '72c90005-57a9-4d40-b746-534e22ec9f9e',
};

class Mesh {
	constructor () {
		this.ble = null;
		this.charWriteWoResp = null
		this.charNotify= null
		this.charWrite = null
		this.charIndicate= null
		this._notifyCB = null;
	}

	find(name, notifyCB) {
		this._notifyCB = notifyCB;
		let options = {
			filters: [{namePrefix: name}],
		//	acceptAllDevices: true,
			optionalServices: [BLEUUID.service]
		};

		let _this = this;
		let _service = null
		return navigator.bluetooth.requestDevice(options)
		.catch(err => {
			console.log('canceled');
			throw err;
		}).then(device => device.gatt.connect()
		).then(gatt => {
			_this.ble = gatt;
			return gatt.getPrimaryService(BLEUUID.service);
		}).then(service => {
			_service = service;

			return _service.getCharacteristic(BLEUUID.writeWoResp);
		}).then(char => {
			_this.charWriteWoResp = char;

			return _service.getCharacteristic(BLEUUID.notify);
		}).then(char => {
			_this.charNotify = char;

			return _service.getCharacteristic(BLEUUID.write);
		}).then(char => {
			_this.charWrite = char;

			return _service.getCharacteristic(BLEUUID.indicate);
		}).then(char => {
			_this.charIndicate = char;

			return _this.charIndicate.startNotifications();
		}).then(() => {
			const onReceived = function (event) {
				let buf = event.target.value;
				console.log("indicate");
				console.log(buf.buffer);
			}
			return _this.charIndicate.addEventListener('characteristicvaluechanged', onReceived);
		}).then(() => new Promise(resolve => setTimeout(resolve, 50)))
		.then(() => _this.charNotify.startNotifications())
		.then(() => {
			const onReceived = function (event) {
				let buf = event.target.value;
				console.log(event.srcElement.service.device.name);
				console.log(buf.buffer);
				if(_this._notifyCB) _this._notifyCB(event.srcElement.service.device.name, buf);
			}
			return _this.charNotify.addEventListener('characteristicvaluechanged', onReceived);
		}).then(() => new Promise(resolve => setTimeout(resolve, 50)))
		.then(() => {
			const Buf_FeatureDrive = new Uint8Array([0x00, 0x02, 0x01, 0x03]);
			return _this.charWrite.writeValue(Buf_FeatureDrive);
		}).then(() => {
			console.log("connected!");
			return Promise.resolve(_this);	// finish
		}).catch(error => {
			console.log('error:' + error);
			throw error;
		});
	}

	isConnected() {
		let connected = false;

		if (this.ble) {
			connected = this.ble.connected;
		}
		return connected;
	}

	writeWoResp(data) {
		let writeData = new Uint8Array(data.length);
		data.forEach(function (v, i) {
			writeData[i] = v;
		});
		return this.charWriteWoResp.writeValue(writeData);
	}
/*
	write(data) {
		let writeData = new Uint8Array(data.length);
		data.forEach(function (v, i) {
			writeData[i] = v;
		});
		return this.charWrite.writeValue(writeData);
	}
*/
	disconnect() {
		return this.ble.disconnect();
	}
/*
	batteryLevelRead() {
		let _this = this;

		return new Promise(function (resolve, reject) {
			_this._gatt.getPrimaryService('battery_service')
			.then(function (service) {
				return service.getCharacteristic('battery_level');
			}).then(v => {
				resolve(new Uint8Array(v)[0]);
			});
		});
	}

	signalStrengthRead() {} // Hardware Control }
*/
}

module.exports = Mesh;
