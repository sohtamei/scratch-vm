const BLEUUID = {
	service:     '72c90001-57a9-4d40-b746-534e22ec9f9e',
	writeWoResp: '72c90002-57a9-4d40-b746-534e22ec9f9e',
	notify:      '72c90003-57a9-4d40-b746-534e22ec9f9e',
	write:       '72c90004-57a9-4d40-b746-534e22ec9f9e',
	indicate:    '72c90005-57a9-4d40-b746-534e22ec9f9e',
};

class comMesh {
	constructor(runtime, onNotify) {
		this.onNotify = onNotify;
		this.ble = null;
		this.charWriteWoResp = null
		this.charNotify= null
		this.charWrite = null
		this.charIndicate= null
	}

	connect(prefix) {
		let options = {
			filters: [{namePrefix: prefix}],
		//	acceptAllDevices: true,
			optionalServices: [BLEUUID.service]
		};

		let _this = this;
		let _service = null;
		return navigator.bluetooth.requestDevice(options)
		.catch(err => {
			console.log('canceled');
			throw err;
		}).then(device => device.gatt.connect())
		.then(gatt => {
			_this.ble = gatt;
			console.log(gatt);
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
				const buf = new Uint8Array(event.target.value.buffer);
				console.log('indicate:'+this._dumpBuf(buf));
			}
			return _this.charIndicate.addEventListener('characteristicvaluechanged', onReceived.bind(_this));
		}).then(() => new Promise(resolve => setTimeout(resolve, 50)))
		.then(() => _this.charNotify.startNotifications())
		.then(() => {
			return _this.charNotify.addEventListener('characteristicvaluechanged', _this.onNotifyReceived.bind(_this));
		}).then(() => new Promise(resolve => setTimeout(resolve, 50)))
		.then(() => {
			const FeatureDrive = new Uint8Array([0x00, 0x02, 0x01, 0x03]);
			return _this.charWrite.writeValue(FeatureDrive);
		}).then(() => {
			console.log("connected!");
			return Promise.resolve(_this);	// finish
		}).catch(error => {
			console.log('error:' + error);
			throw error;
		});
	}

	onNotifyReceived(event) {
		const buf = new Uint8Array(event.target.value.buffer);
		console.log(event.srcElement.service.device.name+':'+this._dumpBuf(buf));
		if(this.onNotify) this.onNotify(event.srcElement.service.device.name, buf);
	}

	isConnected() {
		if(!this.ble) return false;
		return this.ble.connected;
	}

	name() {
		if(!this.ble) return '';
		return this.ble.device.name;
	}

	writeWoResp(data) {
		let buf = new Uint8Array(data);
		let sum = 0;
		for(let i = 0; i < buf.length-1; i++)
			sum += buf[i];
		buf[buf.length-1] = sum & 0xFF;
		console.log('w:'+this._dumpBuf(buf));
		return this.charWriteWoResp.writeValue(buf);
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
	_dumpBuf(data) {
		let str = '';
		for(let i = 0; i < data.length; i++) {
			str += ('0' + data[i].toString(16)).substr(-2) + ' ';
		}
		return str;
	}
}

module.exports = comMesh;
