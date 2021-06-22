/* copyright (C) 2021 SohtaMei. */

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const Zlib = require('zlib');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

const StubCodeBin = require('!arraybuffer-loader!./STUB_CODE.bin');
const BootloaderBin = require('!arraybuffer-loader!./bootloader_qio_80m.bin');
const BootApp0Bin = require('!arraybuffer-loader!./boot_app0.bin');

//const WlanStatus = ['IDLE_STATUS','NO_SSID_AVAIL','SCAN_COMPLETED','CONNECTED','CONNECT_FAILED','CONNECTION_LOST','DISCONNECTED',],

const BLEUUID = {
	service:'6e400001-b5a3-f393-e0a9-e50e24dcca9e',
	txChar: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',	// BLEWriteWithoutResponse
	rxChar: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',	// BLENotify
};

class comlib {
	constructor(runtime, extName, SupportCamera) {
		this._runtime = runtime;
		this.extName = extName;
		this.SupportCamera = SupportCamera;
		this._runtime.registerPeripheralExtension(extName, this);

		let href = location.href.split(':');
		console.log(href);
		if(href[1] == '//localhost' || href[0] == 'file') {
			this.server = 'local';
		//	this.server = 'https';		// for test
		//	this.server = 'http';		// for test
		} else if(href[0] == 'https') {
			this.server = 'https';
		} else {
			this.server = 'http';
		}

		this.ipadrs = '192.168.1.xx';
		this.ipCamera = '';
		this.ifType = (extName=='microbit') ? 'BLE':'UART';
		let cookies_get = document.cookie.split(';');
		for(let i = 0; i < cookies_get.length; i++) {
			let tmp = cookies_get[i].trim().split('=');
			switch(tmp[0]) {
			case extName+'_if_type':
				this.ifType = tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			case extName+'_ip':
				this.ipadrs = tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			case 'Camera_ip':
				this.ipCamera = tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			}
		}

		if(this.server=='http' && this.ifType=='UART') this.ifType = 'WLAN';
		if(this.server=='https' && this.ifType=='WLAN') this.ifType = 'UART';

		this._locale = 0;
		this.busy = false;
		this.cueue = [];

		// WS
		this.ws = null;
		this.wsResolve = null;
		this.wsError = null;

		this.uart = null;
		this.ble = null;
		this.closeReq = false;

		// flash burn
		this.espBurnBusy = false;
		this.recvResolve = null;
		this.recvTimeout = null;

		this.statusMessage = {innerText:''};	// dummy
    }

	setLocale(locale) {
		this._locale = locale;
		this.statusMessage = document.body.querySelector('#StatusMessage');
	}

	getConfig() {
		return [this.ifType, this.ipadrs];
	}

	setConfig(ifType, ipadrs) {
		this.statusMessage.innerText = '';
		const connected = this.isConnected();

		const _this = this;
		return Promise.resolve().then(() => {
			if(connected) {
				if(_this.SupportCamera) _this.videoToggle('off');
				return _this.disconnect();
			}
		}).then(() => {
			if(_this.server=='http' && ifType=='UART') return ['please access via https://','https:// でアクセスして下さい'][_this._locale];
			if(_this.server=='https' && ifType=='WLAN') return ['please access via http://','http:// でアクセスして下さい'][_this._locale];

			let updated = false;
			if(_this.ifType != ifType) {
				_this.ifType = ifType;
				document.cookie = _this.extName+'_if_type=' + _this.ifType + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
				updated = true;
			}

			if(_this.ifType == 'WLAN' && _this.ipadrs != ipadrs) {
				_this.ipadrs = ipadrs;
				document.cookie = _this.extName+'_ip=' + _this.ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
				updated = true;
			}

			if(_this.ifType == 'WLAN' && _this.SupportCamera && _this.ipCamera != ipadrs) {
				_this.ipCamera = ipadrs;
				document.cookie = 'Camera_ip=' + _this.ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
				updated = true;
			}

			if(updated) return ['Saved !', '保存しました'][_this._locale];

			if(!connected) {
				return _this.open()
				.then(result => {
					if(_this.SupportCamera && _this.ifType=='WLAN') _this.videoToggle('on');
					return result;
				}).catch(result => {
					return result;
				})
			}
		})
	}

	videoToggle(state) {
		if(this.server=='https') return ['please access via http://','http:// でアクセスして下さい'][this._locale];

		const stage = this._runtime.getTargetForStage();
		if(stage) stage.videoState = state;
		switch(state) {
		case 'off':
			this._runtime.ioDevices.video.disableVideo();
			break;
		case 'on':
			this._runtime.ioDevices.video.enableVideo();
			this._runtime.ioDevices.video.mirror = true;
			break;
		case 'on_flipped':
			this._runtime.ioDevices.video.enableVideo();
			this._runtime.ioDevices.video.mirror = false;
			break;
		}
	}

	// for connect menu ---------------------------

	isConnected() {
		let connected = false;
		switch(this.ifType) {
		case 'UART':
			if(this.uart && !this.closeReq) connected = true;
			break;
		case 'BLE':
			if(this.ble) connected = this.ble.isConnected();
			break;
		case 'WLAN':
			if(this.ws) connected = true;
			break;
		}
	//	if(!connected) console.log('disconnected!');
	//	console.log('isconnected='+connected);
		return connected;
	}

	scan() {
		console.log('scan');
		switch(this.ifType) {
		case 'UART':
			this._closeUart();
			return this._openUart();
		case 'BLE':
			if(this.ble) {
				this.ble.disconnect();
				this.ble = null;
			}
			return this._openBle();
		case 'WLAN':
			if(this.ws) {
				this.ws.close();
				this.ws = null;
			}
			return this._openWs();
		}
	}

	connect(id) {
		console.log('connect');
		switch(this.ifType) {
		case 'UART':
			break;
		case 'BLE':
			if(this.ble) this.ble.connectPeripheral(id);
			break;
		case 'WLAN':
			break;
		}
	}

	disconnect() {
		console.log('disconnect');
		switch(this.ifType) {
		case 'UART':
			this._closeUart();
			break;
		case 'BLE':
			if(this.ble) {
				this.ble.disconnect();
				this.ble = null;
			}
			break;
		case 'WLAN':
			if(this.ws) {
				const _this = this;
				let hTimeout = null;
				this.ws.send(new Uint8Array([0xff,0x55,0x01,0xff]));	// reset
				return new Promise(resolve => setTimeout(resolve, 100))
				.then(() => new Promise((resolve,reject) => {
					hTimeout = setTimeout(reject, 5000);
					_this.wsResolve = resolve;
					_this.ws.close();
				})).then(() => {
					clearTimeout(hTimeout);
				}).catch(() => {
					console.log('timeout !');
					_this.ws = null;
					_this.busy = false;
					_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_DISCONNECTED);
					_this.wsResolve = null;
				})
			}
			break;
		}
		this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);
	}

	// common command --------------------------------------------
/*
  {'B','B'},		// 0x81:wire_begin     (SDA, SCL)
  {'B','b'},		// 0x82:wire_write     (adrs, [DATA])          ret:0-OK
  {'B','b','B'},	// 0x83:wire_writeRead (adrs, [DATA], readNum) ret:[DATA]-OK, NULL-ERROR
  {'B','B'},		// 0x84:wire_read      (adrs, readNum)         ret:[DATA]-OK, NULL-ERROR
  {},				// 0x85:wire_scan      ()                      ret:[LIST]
  
  {'b'},			// 0x86:digiWrite      (LIST[port,data])
  {'B'},			// 0x87:digiRead       (port)                  ret:level
  {'B','S'},		// 0x88:anaRead        (port, count)           ret:level(int16)
  {'B','S','S'},	// 0x89:tone           (port,freq,ms)
  {'b'},			// 0x8a:setPwms        (LIST[port,data])

  {},				// 0xFB:statusWifi     ()                      ret:wlanStatus SSID ip
  {},				// 0xFC:scanWifi       ()                      ret:SSID1 SSID2 SSID3 ..
  {'s','s'},		// 0xFD:connectWifi    (ssid,pass)             ret:wlanStatus

  {},				// 0xFE:getFwName      ()                      ret:FwName
  {},				// 0xFF:reset          ()                      ret:
*/
	wire_begin(sda, scl) {
		const _defs = {ARG1:{type2:'B'},ARG2:{type2:'B'}};
		const _args = {ARG1:sda, ARG2:scl};
		return this.sendRecv(0x81,_defs,_args);
	}

	wire_write(adrs, data) {		// ret:0-OK
		const _defs = {ARG1:{type2:'B'},ARG2:{type2:'b'}};
		const _args = {ARG1:adrs, ARG2:data};
		return this.sendRecv(0x82,_defs,_args);
	}

	wire_writeRead(adrs, data, readNum) {	// ret:[DATA]-OK
		const _defs = {ARG1:{type2:'B'},ARG2:{type2:'b'},ARG3:{type2:'b'}};
		const _args = {ARG1:adrs, ARG2:data, ARG3:readNum};
		return this.sendRecv(0x83,_defs,_args);
	}

	wire_read(adrs, readNum) {			// ret:[DATA]-OK
		const _defs = {ARG1:{type2:'B'},ARG2:{type2:'B'}};
		const _args = {ARG1:adrs, ARG2:readNum};
		return this.sendRecv(0x84,_defs,_args);
	}

	wire_scan() {						// ret:[LIST]
		const _defs = {};
		const _args = {};
		return this.sendRecv(0x85,_defs,_args);
	}

	digiWrite(portLevels) {
		let buf = new Uint8Array(portLevels.length*2);
		for(let i = 0; i < portLevels.length; i++) {
			buf[i*2+0] = portLevels[i].port;
			buf[i*2+1] = portLevels[i].level;
		}

		const _defs = {ARG1:{type2:'b'}};
		const _args = {ARG1:buf};
		return this.sendRecv(0x86,_defs,_args);
	}

	digiRead(port) {
		const _defs = {ARG1:{type2:'B'}};
		const _args = {ARG1:port};
		return this.sendRecv(0x87,_defs,_args);
	}

	anaRead(port,count) {
		const _defs = {ARG1:{type2:'B'},ARG2:{type2:'S'}};
		const _args = {ARG1:port, ARG2:count};
		return this.sendRecv(0x88,_defs,_args);
	}

	tone(port,freq,ms) {
		const _defs = {ARG1:{type2:'B'},ARG2:{type2:'S'},ARG3:{type2:'S'}};
		const _args = {ARG1:port, ARG2:freq, ARG3:ms};
		return this.sendRecv(0x89,_defs,_args);
	}

	setPwms(portLevels) {
		let buf = new Uint8Array(portLevels.length*3);
		for(let i = 0; i < portLevels.length; i++) {
			let level = Math.min(portLevels[i].level, 0xFFF);
			buf[i*3+0] = portLevels[i].port;
			buf[i*3+1] = level&0xFF;
			buf[i*3+2] = level>>8;
		}

		const _defs = {ARG1:{type2:'b'}};
		const _args = {ARG1:buf};
		return this.sendRecv(0x8A,_defs,_args);
	}

	statusWifi() {
		const _this = this;
		return this._statusWifi()
		.then(status => {
			if(status[0] == 3)
				return ['connected','接続中'][_this._locale] + ' ('+status[1]+', '+status[2]+')';
			else if(status[1] == '')
				return ['Not set up','未設定'][_this._locale];
			else
				return ['cannot connect to ', '接続できません '][_this._locale] + status[1];
		})
	}

	scanWifi() {
		const _defs = {};
		const _args = {};
		return this.sendRecv(0xFC,_defs,_args).split('\t');
	}

	connectWifi(ssid, pass) {
		ssid = ssid.trim();
		pass = pass.trim();
		if(ssid=='') return ['enter ssid and password','SSIDとパスワードを入力して下さい'][this._locale];

		const _this = this;
		const _defs = {ARG1:{type2:'s'},ARG2:{type2:'s'}};
		const _args = {ARG1:ssid, ARG2:pass};
		return this.sendRecv(0xFD,_defs,_args)
		.then(result => {
			const status = parseInt(result);
			console.log(status);
			if(status != 3) return ['Failed', '失敗しました'][_this._locale];

			return _this._statusWifi();
		}).then(status => {
			if(status[0] != 3) return ['Failed', '失敗しました'][_this._locale];

			return ['connected','接続しました'][_this._locale] + ' ('+status[2]+')';
		})
	}

	_statusWifi() {
		const _this = this;
		const _defs = {};
		const _args = {};
		return this.sendRecv(0xFB,_defs,_args)
		.then(result => {
			const status = result.split('\t');

			status[0] = parseInt(status[0], 10);
			if(status[0] == 3) {
				_this.ipadrs = status[2];
				document.cookie = _this.extName+'_ip=' + _this.ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
				if(_this.SupportCamera)
				  document.cookie = 'Camera_ip=' + _this.ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
			}
			console.log(status);
			return status;
		})
	}

	// sendRecv --------------------------------------------

	sendRecv(cmd, argsDef, args) {
		this.statusMessage.innerText = '';

		let data = new Uint8Array(256);
		let dv = new DataView(data.buffer);

		data.set([0xff,0x55,0x00,cmd],0);
		let ofs = 4;

		for(let i = 1; ; i++) {
			eval("var param = args.ARG"+i);
			eval("var def = argsDef.ARG"+i);
		//	console.log(i,param, def);
			if(typeof param === 'undefined') break;
			switch(def.type2) {
			case 'B': dv.setUint8(ofs,param);        ofs+=1; break;
			case 'S': dv.setInt16(ofs,param, true);  ofs+=2; break;
			case 'L': dv.setInt32(ofs,param, true);  ofs+=4; break;
			case 'F': dv.setFloat32(ofs,param, true);ofs+=4; break;
			case 'D': dv.setFloat64(ofs,param,true); ofs+=8; break;

			case 's':
				let j = 0;
				if(param !== 'undefined') {
					let charList = param.split('');
					for(j = 0; j < charList.length; j++)
						data[ofs+j] = charList[j].charCodeAt(0);
				}
				data[ofs+j] = 0;
				ofs += j+1;
				break;

			case 'b':
				if(typeof param !== 'object') break;
				data[ofs+0] = param.length;
				data.set(param, ofs+1);
				ofs += param.length+1;
				break;
			}
		}
		data[2] = ofs-3;
		data = data.slice(0,ofs);
		if(this.cueue.length >= 5) return 'error';

		const _this = this;
		return _this.open()
		.then(() => new Promise(resolve => {
			_this.cueue.push({resolve:resolve, data:data});
			_this.checkCueue();
		}))
	}

	checkCueue() {
		const _this = this;
		if(_this.cueue.length == 0) return;
		if(_this.busy) {
			console.log('+Cueue=' + (_this.cueue.length-1) + '->' + _this.cueue.length);
			return;
		}
		_this.busy = true;

		const {resolve, data} = _this.cueue.shift();
		console.log('W:'+_this._dumpBuf(data));	// debug
		switch(_this.ifType) {
		case 'UART':
		case 'BLE':
			return ((_this.ifType=='UART')? _this._sendRecvUart(data): _this._sendRecvBle(data))
			.catch(err => {
				console.log(err);
				return err;
			}).then(tmp => {
				_this.busy = false;
				resolve(tmp);
				if(_this.cueue.length != 0) console.log('-Cueue=' + _this.cueue.length + '->' + (_this.cueue.length-1));
				_this.checkCueue();
			})
			break;
		case 'WLAN':
			_this.wsResolve = resolve;
			return _this.ws.send(data);
		}
	}

	_sendRecvUart(sendBuf) {
		const _this = this;

		if(!_this.uart.writable || !_this.uart.readable) {
			throw 'error';
			return;
		}

		const writer = _this.uart.writable.getWriter();
		const reader = _this.uart.readable.getReader();
		let count = 0;
		let size = 3;
		let buf = new Uint8Array(256);
		
		return writer.write(sendBuf)
		.then(() => new Promise((resolve,reject) => {
			let hTimeout = null;
			loop();
			function loop(){
				new Promise(resolve2 => {
					hTimeout = setTimeout(resolve2, 3000);
				}).then(() => {
					console.log('timeout !');
					if(_this.uart && _this.uart.readable) {
						// for no resp
						reader.cancel();
					} else {
						// for disconnect
						reject('error');
					}
				})

				return reader.read()
				.then(result => {
					clearTimeout(hTimeout);
					if(result.done) {
						writer.releaseLock();
						reader.releaseLock();
						if(_this.closeReq) {
							_this.closeReq = false;
							_this.uart.close();
							_this.uart = null
						}
						reject('timeout');
						return;
					}
				//	console.log(_this._dumpBuf(result.value));	// debug
					for(let i = 0; i < result.value.length; i++) {
						switch(count) {
						case 0:
							if(result.value[i] != 0xFF) continue
							break;
						case 1:
							if(result.value[i] != 0x55) {
								count = 0;
								continue;
							}
							break;
						case 2:
							size = 3 + result.value[i];
							break;
						default:
							break;
						}
						buf[count] = result.value[i];
						count++;
						if(count >= size) {
							buf = buf.slice(0,size);
							console.log('R:'+_this._dumpBuf(buf));	// debug
							let tmp = _this._parseRecv(buf);
							writer.releaseLock();
							reader.releaseLock();
							if(_this.closeReq) {
								_this.closeReq = false;
								_this.uart.close();
								_this.uart = null
							}
							resolve(tmp);
							return;
						}
					}
					loop();
				}).catch(() => {
					// for disconnect. releaseLock -> port.close -> reject
					writer.releaseLock();
					reader.releaseLock();
					if(_this.closeReq) {
						_this.closeReq = false;
						_this.uart.close();
						_this.uart = null
					}
					console.log('error');
				//	reject('error');
				})
			} // loop
		})) // promise
	}

	_sendRecvBle(sendBuf) {
		const _this = this;
		let hTimeout = null;
		return new Promise((resolve,reject) => {
			hTimeout = setTimeout(reject, 3000);

			return _this.ble.startNotifications(BLEUUID.service, BLEUUID.rxChar, resolve)
			.then(() => _this.ble.write(BLEUUID.service, BLEUUID.txChar, Base64Util.uint8ArrayToBase64(sendBuf), 'base64', false/*wResp*/))
		}).then(base64 => {
			clearTimeout(hTimeout);
			const buf = Base64Util.base64ToUint8Array(base64);
			console.log('R:'+_this._dumpBuf(buf));	// debug
			return _this._parseRecv(buf);
		}).catch(() => {
			console.log('timeout !');
			throw 'timeout';
		})
	}

	_parseRecv(buf) {
		if(buf[0] == 0xFF && buf[1] == 0x55 && buf[2]+3 == buf.length && buf.length >= 5) {
			let tmp = null;
			let tmp2 = new DataView(buf.buffer);
			switch(buf[3]) {
			case 1: tmp = tmp2.getUint8(4); break;
			case 2: tmp = tmp2.getInt16(4, true); break;
			case 3: tmp = tmp2.getInt32(4, true); break;
			case 4: tmp = tmp2.getFloat32(4, true); break;
			case 5: tmp = tmp2.getFloat64(4, true); break;
			case 6: tmp = String.fromCharCode.apply(null, buf.slice(4)); break;
			case 7: tmp = buf.slice(5,5+buf[4]); break;
			}
			return tmp;
		}
		return;
	}

	// Open --------------------------------------------

	open() {
		const _this = this;
		return Promise.resolve().then(() => {
			switch(_this.ifType) {
			case 'UART':
				if(_this.uart == null)
					return _this._openUart();
				break;
			case 'BLE':
				if(_this.ble == null)
					return ['press "！"','"！" を押して下さい'][_this._locale];
				break;
			case 'WLAN':
				if(_this.ws == null)
					return _this._openWs();
				break;
			}
			return;
		})
	}

	_closeUart() {
		if(this.uart) {
			const _this = this;
			console.log('disconnected');
			this.closeReq = true;
			return this.uart.close()
			.then(() => {
				_this.closeReq = false;
				_this.uart = null;
			})
		}
	}

	_openUart() {
		if(this.uart) return;

		const _this = this;
		this.busy = false;
		this.cueue = [];
		this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);

		let uart = null;
		navigator.serial.ondisconnect = function() {
			_this._closeUart();
			_this.statusMessage.innerText = ['Disconnected','切断されました'][_this._locale];
			_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_DISCONNECTED);
		}

		return navigator.serial.requestPort({})
		.catch(err => {
			console.log('canceled');
			_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_SCAN_TIMEOUT);
			throw err;
		})
		.then(result => {
			uart = result;
			return uart.open({ baudRate:(_this.extName=='microbit'?19200:115200) });
		}).then(() => {
			const writer = uart.writable.getWriter();
			const reader = uart.readable.getReader();
			let count = 0;
			let buf = new Uint8Array(256);
			
			return writer.write(new Uint8Array([0x00,0xff,0x55,0x01,0xfe]))
			.then(() => new Promise((resolve,reject) => {
				let hTimeout = null;
				loop();
				function loop(){
					new Promise(resolve2 => {
						hTimeout = setTimeout(resolve2, 1000);
					}).then(() => {
						console.log('timeout !');
						reader.cancel();
					})

					return reader.read()
					.then(result => {
						clearTimeout(hTimeout);
						if(result.done) {
							writer.releaseLock();
							reader.releaseLock();
							_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_SCAN_TIMEOUT);
							reject('timeout');
							return;
						}
					//	console.log(_this._dumpBuf(result.value));	// debug
						for(let i = 0; i < result.value.length; i++) {
							buf[count++] = result.value[i];
							if(result.value[i] == 0x0a) {
								writer.releaseLock();
								reader.releaseLock();
								resolve(buf.slice(0,count));
								return;
							}
						}
						loop();
					})
				} // loop
			})).then(recv => {
				_this.uart = uart;
				let tmp = String.fromCharCode.apply(null, recv);
				_this.statusMessage.innerText = tmp;
				console.log(tmp);
				_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_CONNECTED);
				return;
			}).catch(err => {
				if(uart) uart.close();
				_this.uart = null;
				throw err;
			})
		})
	}

	_openBle() {
		this.busy = false;
		this.cueue = [];
		function _bleReset() {
			console.log('reset');
		}

		function _bleOnConnect() {
			console.log('connected!');
		}

		this.ble = new BLE(this._runtime, this.extName,
					{filters: [{services: [BLEUUID.service]}]},
					_bleOnConnect.bind(this),
					_bleReset.bind(this));
		return;
	}

	_openWs() {
		if(this.ws) return;

		const _this = this;
		this.busy = false;
		this.cueue = [];
		this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);

		return new Promise((resolve,reject) => {
			const ws = new WebSocket('ws://'+_this.ipadrs+':54323');
			ws.binaryType = 'arraybuffer';

			ws.onopen = function(e) {
				console.log('connected');
				_this.ws = ws;
				_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_CONNECTED);
				resolve();
			}

			ws.onmessage = function(event) {
				let buf = new Uint8Array(event.data);
				console.log('R:'+_this._dumpBuf(buf));	// debug
				let tmp = _this._parseRecv(buf);
				_this.busy = false;
				_this.wsResolve(tmp);
				_this.wsResolve = null;
				if(_this.cueue.length != 0) console.log('-Cueue=' + _this.cueue.length + '->' + (_this.cueue.length-1));
				_this.checkCueue();
				return;
			}

			ws.onclose = function(event) {
				if (event.wasClean) {
					console.log(`close: Connection closed cleanly, code=${event.code} reason=${event.reason}`);
				} else {
					console.log('close: Connection died');
				}
				_this.ws = null;
				_this.busy = false;
				_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_DISCONNECTED);
				if(_this.wsResolve !== null) {
					_this.wsResolve('error');
					_this.wsResolve = null;
				}
			};

			ws.onerror = function(error) {
				console.log('[error] '+error.message);
				ws.close();
				_this.ws = null;
				_this.busy = false;
				_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_SCAN_TIMEOUT);
				_this.statusMessage.innerText = ['cannot connect to ','接続できませんでした：'][_this._locale] + _this.ipadrs;
				reject(_this.statusMessage.innerText);
				if(_this.wsResolve !== null) {
					_this.wsResolve(_this.statusMessage.innerText);
					_this.wsResolve = null;
				}
			};
		})
	}

	burnWlan(flashBin) {
		switch(flashBin.type) {
		case 'esp32':		return this.burnESP32(flashBin);
		case 'atmega328':	return this.burnAvr(flashBin);
		default: return null;
		}
	}

	// atmega328pアップデート -----------------------------------------------------
	
	// flashBin={name:'TukuBoard1.0', type:'esp32', baudrate:230400, part:_part0, image:_image0},
	burnAvr(flashBin) {
		if(this.espBurnBusy) return;
		this.espBurnBusy = true;
		this.statusMessage.innerText = '';

		const _this = this;
		if(this.uart) {
			this.uart.close();
			this.uart = null;
		}
		let flashBinImage = new Uint8Array(0x10000);
		flashBinImage.fill(0xff);
		let adrsMin = flashBinImage.length;
		let adrsMax = 0;

		return navigator.serial.requestPort({})
		.then(result => {
			_this.uart = result;
			return _this.uart.open({ baudRate:115200 });
		}).then(() => fetch('static/extensions/'+flashBin.name+'.hex'))
		.then(response => response.blob())
		.then(blob => new Promise((resolve,reject) => {
			let _reader = new FileReader();
			_reader.onload = function(e){
				const lines = _reader.result.split('\n');
				//:10 0000 00 0C9463000C948B000C948B000C948B00 6C
				for(let i = 0; i < lines.length; i++) {
					if(lines[i].slice(0,1) != ':') continue;
					let len  = parseInt(lines[i].slice(1,3), 16);
					let adrs = parseInt(lines[i].slice(3,7), 16);
					let mode = parseInt(lines[i].slice(7,9), 16);
					if(mode == 0x00) {
						adrsMin = Math.min(adrsMin, adrs);
						adrsMax = Math.max(adrsMax, adrs+len);
						if(adrsMax > flashBinImage.length) reject('over size');
						for(let j = 0; j < len; j++)
							flashBinImage[adrs+j] = parseInt(lines[i].slice(9+j*2, 11+j*2),16);
					}
				}
				resolve();
			}
			return _reader.readAsText(blob);
		})).then(() => _this._syncAvrBurn())
		.then(() => _this._SendRecvAvrBurn([0x41,0x80], 1))		// HW_VER
		.then(() => _this._SendRecvAvrBurn([0x41,0x81], 1))		// SW_MAJOR
		.then(() => _this._SendRecvAvrBurn([0x41,0x82], 1))		// SW_MINOR
		.then(() => _this._SendRecvAvrBurn([0x41,0x98], 1))		// TOPCARD_DETECT
		.then(() => _this._SendRecvAvrBurn([0x41,0x84], 1))		// VTARGET
		.then(() => _this._SendRecvAvrBurn([0x41,0x85], 1))		// VADJUST
		.then(() => _this._SendRecvAvrBurn([0x41,0x86], 1))		// OSC_PSCALE
		.then(() => _this._SendRecvAvrBurn([0x41,0x87], 1))		// OSC_CMATCH
		.then(() => _this._SendRecvAvrBurn([0x41,0x89], 1))		// SCK_DURATION
																// SET_DEVICE
		.then(() => _this._SendRecvAvrBurn([0x42,0x86,0x00,0x00,0x01,0x01,0x01,0x01,0x03,0xff,0xff,0xff,0xff,0x00,0x80,0x04,0x00,0x00,0x00,0x80,0x00], 0))
		.then(() => _this._SendRecvAvrBurn([0x45,0x05,0x04,0xd7,0xc2,0x00], 0))	// SET_DEVICE_EXT
		.then(() => _this._SendRecvAvrBurn([0x50], 0))			// ENTER_PROGMODE
		.then(() => _this._SendRecvAvrBurn([0x75], 3))			// READ_SIGN
		.then(() => {
			adrsMin = adrsMin & ~0x7F;
			adrsMax = (adrsMax+0x7F) & ~0x7F;
			let adrs = adrsMin;
			return new Promise(resolve => {
				loop();
				function loop() {
					return _this._SendRecvAvrBurn([0x55,(adrs/2)&0xFF, (adrs/2)>>8], 0)  // LOAD_ADDRESS
					.then(() => {
						let data = new Uint8Array(4+0x80);
						data.set([0x64,0x00,0x80,0x46], 0);
						data.set(flashBinImage.slice(adrs, adrs+0x80), 4);
						return _this._SendRecvAvrBurn(data, 0);		// PROG_PAGE
					}).then(() => {
						adrs += 0x80;
						if(adrs >= adrsMax) {
							resolve();
						} else {
							loop();
						}
					})
				} // loop
			})
		}).then(() => _this._SendRecvAvrBurn([0x51], 0))		// LEAVE_PROGMODE
		.then(() => 'OK !')
		.catch(err => {
			console.log(err);
			throw 'error';
		}).finally(result => {
			if(_this.uart) {
				_this.uart.close();
				_this.uart = null;
			}
			_this.espBurnBusy = false;
			return result;
		})
	}

	_syncAvrBurn() {
		const _this = this;
		return new Promise((resolve1, reject1) => {
			let i = 0;
			loop();
			function loop(){
				// DTR=1 -> 0- > 1
				return      _this.uart.setSignals({ dataTerminalReady: false})
				.then(() => new Promise(resolve => setTimeout(resolve, 110)))
				.then(() => _this.uart.setSignals({ dataTerminalReady: true}))
				.then(() => new Promise(resolve => setTimeout(resolve, 100)))
				.then(() => _this.uart.setSignals({ dataTerminalReady: false}))
				.then(() => new Promise(resolve => setTimeout(resolve, 100)))

				.then(() => _this._SendRecvAvrBurn([0x30], 0))	// SYNC
				.then(() => {
					resolve1();
					return;
				}).catch(() => {
					console.log(i);
					i++;
					if(i < 10) {
						return _this.uart.close()
						.then(() => _this.uart.open({ baudRate:115200 }))
						.then(() => loop())
					} else {
						reject1();
						return;
					}
				})
			}
		})
	}

	_SendRecvAvrBurn(sendBuf, recvNum) {
		const _this = this;

		let _send = new Uint8Array(sendBuf.length+1);
		_send.set(sendBuf, 0);
		_send[sendBuf.length] = 0x20;
	//	console.log('W:'+_this._dumpBuf(_send));	// debug

		const writer = _this.uart.writable.getWriter();
		const reader = _this.uart.readable.getReader();
		let count = 0;
		let size = 2+recvNum;
		let buf = new Uint8Array(size);
		
		return writer.write(_send)
		.then(() => new Promise((resolve,reject) => {
			let hTimeout = null;
			loop();
			function loop(){
				new Promise(resolve2 => {
					hTimeout = setTimeout(resolve2, 500);
				}).then(() => {
					console.log('timeout !');
					reader.cancel();
				})

				return reader.read()
				.then(result => {
					clearTimeout(hTimeout);
					if(result.done) {
						writer.releaseLock();
						reader.releaseLock();
						reject('timeout');
						return;
					}
				//	console.log(_this._dumpBuf(result.value));	// debug
					for(let i = 0; i < result.value.length; i++) {
						if(count == 0) {
							if(result.value[i] == 0x15) {
								return writer.write(_send)
								.then(() => loop())
							} else if(result.value[i] != 0x14) {
								continue;
							}
						}
						buf[count] = result.value[i];
						count++;
						if(count >= size) {
							if(result.value[i] != 0x10) {
								count = 0;
								continue;
							}
						//	console.log('R:'+_this._dumpBuf(buf.slice(0,size)));	// debug
							writer.releaseLock();
							reader.releaseLock();
							resolve(buf.slice(1,size-1));
							return;
						}
					}
					loop();
				})
			} // loop
		})).then(tmp => {
			console.log((tmp.length>0) ? _this._dumpBuf(tmp): 'OK');
			return tmp;
		})
	}

	// ESP32アップデート ----------------------------------------------------------------------------

	// flashBin={name:'TukuBoard1.0', type:'esp32', baudrate:230400, part:_part0, image:_image0},
	// esptool.exe --chip esp32 --port COM6 --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 Arduino/portable/packages/esp32/hardware/esp32/1.0.4/tools/partitions/boot_app0.bin 0x1000 Arduino/portable/packages/esp32/hardware/esp32/1.0.4/tools/sdk/bin/bootloader_qio_80m.bin 0x10000 C:\Users\n-tom\fd_work\TuKuRutch\ext\libraries\TukuBoard1.0\robot_pcmode\robot_pcmode.ino.esp32.bin 0x8000 C:\Users\n-tom\fd_work\TuKuRutch\ext\libraries\TukuBoard1.0\robot_pcmode\robot_pcmode.ino.partitions.bin
	burnESP32(flashBin) {
		if(this.espBurnBusy) return;
		this.espBurnBusy = true;

		const PARAM1_START = 0x9000;
		const PARAM_SIZE = 0x6000;
		const StubCode = new Uint8Array(StubCodeBin);
		const BootApp0 = new Uint8Array(BootApp0Bin);
		const Bootloader = new Uint8Array(BootloaderBin);
		const UpdateMsg = ['burning ', '書き込み中 '][this._locale];
		this.statusMessage.innerText = '';

		const _this = this;
		let reader = null;
		if(this.uart) {
			this.uart.close();
			this.uart = null;
		}
		let flashBinPart = null;
		let flashBinImage = null;

		return navigator.serial.requestPort({})
		.then(result => {
			_this.uart = result;

			return _this.uart.open({ baudRate:115200 });
		}).then(() => {
			_this.statusMessage.innerText = UpdateMsg+'0%';

			return fetch('static/extensions/'+flashBin.name+'.part.bin')
			.then(response => response.blob())
			.then(blob => new Promise(resolve => {
				let _reader = new FileReader();
				_reader.onload = function(e){
					flashBinPart = new Uint8Array(_reader.result);
					resolve();
				};
				return _reader.readAsArrayBuffer(blob);
			}))
		}).then(() => {
			return fetch('static/extensions/'+flashBin.name+'.image.bin')
			.then(response => response.blob())
			.then(blob => new Promise(resolve => {
				let _reader = new FileReader();
				_reader.onload = function(e){
					flashBinImage = new Uint8Array(_reader.result);
					resolve();
				};
				return _reader.readAsArrayBuffer(blob);
			}))
		}).then(() => {
			reader = _this.uart.readable.getReader();
			_this._RecvEspBurn(reader);

			return _this._syncEspBurn();
		}).then(() => {
			_this.statusMessage.innerText = UpdateMsg+'5%';
			return new Promise(resolve => setTimeout(resolve, 500));

		// Chip Is ESP32D0WDQ6(revision 0)

		// read_reg             adrs
		//W:c0000a 0400 00000000 6001a018 c0
		//R:c0010a 0400 00000004 00000000 c0
		}).then(() => _this._SendRecvEspBurn(0xA, [0x6001A018], null))

		//  mem_begin            size     blocks   blocksize offset
		//W:c00005 1000 00000000 00000c44 00000001 00001800 4009f000 c0
		//R:c00105 0400 c44627c4 00000000 c0
		.then(rcvParam => _this._SendRecvEspBurn(0x5, [StubCode.length,1,0x1800,0x4009f000], null))

		//  mem_data             data     seq=0
		//W:c00007 540c 00000006 00000c44 00000000 00000000 00000000 f820f4..
		//R:c00107 0400 c44627c4 00000000 c0
		.then(rcvParam => _this._SendRecvEspBurn(0x7, [StubCode.length,0,0,0], StubCode))

		//  mem_begin            size     blocks   blocksize offset
		//W:c00005 1000 00000000 00000004 00000001 00001800 3fffeba4 c0
		//R:c00105 0400 c44627c4 00000000 c0
		.then(rcvParam => _this._SendRecvEspBurn(0x5, [4,1,0x1800,0x3fffeba4], null))

		//  mem_data             data     seq=0
		//W:c00007 1400 000000e6 00000004 00000000 00000000 00000000 3ffec008 c0
		//R:c00107 0400 c44627c4 00000000 c0
		.then(rcvParam => _this._SendRecvEspBurn(0x7, [4,0,0,0], new Uint8Array([0x08,0xc0,0xfe,0x3f])))

		//  mem_end                       entrypoint
		//W:c00006 0800 00000000 00000000 4009f564 c0
		//R:c00106 0400 c44627c4 00000000 c0
		.then(rcvParam => _this._SendRecvEspBurn(0x6, [0,0x4009f564], null))

		//R:C0 4F 48 41 49 C0 - 'OHAI'
		.then(rcvParam => new Promise(resolve => setTimeout(resolve, 1000)))

		//  baudrate             921600   115200
		//W:c0000f 0800 00000000 000e1000 0001c200 c0
		//R:c0010f 0200 00000000 0000 c0
		.then(() => _this._SendRecvEspBurn(0xf, [flashBin.baudrate,115200], null))

		// close/open
		.then(rcvParam => reader.cancel())
		.then(() => _this.uart.close())
	//	.then(() => new Promise(resolve => setTimeout(resolve, 100)))
		.then(() => _this.uart.open({ baudRate:flashBin.baudrate }))
		.then(() => {
			reader = _this.uart.readable.getReader();
			_this._RecvEspBurn(reader);

			// write_reg省略

			//  set_params           fl_id    total_size block_size sector_size page_size status_mask
			//W:c0000b 1800 00000000 00000000 00400000 00010000 00001000 00000100 0000ffff c0
			//R:c0010b 0200 00000000 0000 c0
			return _this._SendRecvEspBurn(0xB, [0,0x400000,0x10000,0x1000,0x100,0xFFFF], null);

		// 0xe000  boot_app0.bin
		}).then(rcvParam => _this._espFlash(BootApp0, 0xe000, 11, 11))

		// 0x1000 bootloader_qio_80m.bin
		//	data[2] = 0x2;
		//	data[3] = 0x20;
		.then(rcvParam => _this._espFlash(Bootloader, 0x1000, 12, 12))

		// 0x8000  partitions.bin
		.then(rcvParam => _this._espFlash(flashBinPart, 0x8000, 13, 13))

		// 0x10000  esp32.bin
		.then(rcvParam => _this._espFlash(flashBinImage, 0x10000, 15, 100))

		// DTR=1 RTS=0 IO0=1 EN=0
		// DTR=1 RTS=1 IO0=1 EN=1
		.then(rcvParam => _this.uart.setSignals({ dataTerminalReady: false, requestToSend: true }))
		.then(() => new Promise(resolve => setTimeout(resolve, 100)))
		.then(() => _this.uart.setSignals({ dataTerminalReady: false, requestToSend: false }))
		.then(() => {
			_this.statusMessage.innerText = ['Finished', '書き込み完了'][_this._locale];
			console.log('OK');
			return 'OK !';
		}).catch(() => {
			_this.statusMessage.innerText = ['Failed', '書き込み失敗'][_this._locale];
			console.log('NG');
			throw 'Error';
		}).finally(result => {
			if(reader) {
				reader.cancel();
				reader.releaseLock();
			}
			if(_this.uart) {
				_this.uart.close();
				_this.uart = null;
			}
			_this.espBurnBusy = false;
			return result;
		})
	}
/*
		If checkInit.Checked = True Then
			For i = 0 To PARAM_SIZE - 1
				binBuf(i) = 0xFF
			Next
			_espFlash(binBuf, PARAM1_START, PARAM_SIZE, 100, 100)
		End If
*/

	_SendRecvEspBurn(cmd, header, data) {	// ret:[result, rcvParam]

		let header8 = new Uint8Array(header.length*4);
		let dv = new DataView(header8.buffer);
		for(let i = 0; i < header.length; i++)
			dv.setUint32(i*4, header[i], true);

		const _this = this;
		return new Promise((resolve1, reject1) => {
			_this.recvTimeout = setTimeout(() => {
				console.log('');
				_this.recvTimeout = null;
				_this.recvResolve = null;
				reject1();
			}, 5000);

			_this.recvResolve = rcvParam => {
			//	console.log(rcvParam);	// debug
				clearTimeout(_this.recvTimeout);
				_this.recvTimeout = null;
				_this.recvResolve = null;
				resolve1(rcvParam);
			}

		//	_this._RecvEspBurn();
			if(data) {
				let tmp = new Uint8Array(header8.length + data.length);
				tmp.set(header8, 0);
				tmp.set(data, header8.length);
				return _this._SendEspBurn(cmd, tmp, data.length);
			} else {
				return _this._SendEspBurn(cmd, header8, 0);
			}
		})
	}
	
	_SendEspBurn(cmd, data, sumSize) {	// ret:[result, rcvParam]
		let rcvParam;
		let dataSize = data.length;

		let i;
		let j;
		let sendBuf = new Uint8Array(8 + dataSize);
		let tmp = new DataView(sendBuf.buffer);
		sendBuf[0] = 0;
		sendBuf[1] = cmd;
		tmp.setUint16(2, dataSize, true);
		if(sumSize > 0) {
			let sum = 0xEF;
			for(i = 0; i < sumSize; i++)
				sum ^= data[dataSize - sumSize + i];
			tmp.setUint32(4, sum, true);
		} else {
			tmp.setUint32(4, 0, true);
		}

		for(i = 0; i < dataSize; i++)
			sendBuf[8+i] = data[i];

		let sendBuf2 = new Uint8Array(sendBuf.length * 2);
		j = 0;
		sendBuf2[j++] = 0xC0;
		for(i = 0; i < sendBuf.length; i++) {
			switch(sendBuf[i]) {
			case 0xC0:
				sendBuf2[j++] = 0xDB;
				sendBuf2[j++] = 0xDC;
				break;
			case 0xDB:
				sendBuf2[j++] = 0xDB;
				sendBuf2[j++] = 0xDD;
				break;
			default:
				sendBuf2[j++] = sendBuf[i];
				break;
			}
		}
		sendBuf2[j++] = 0xC0;

		const writer = this.uart.writable.getWriter();
	//	console.log('W:'+this._dumpBuf(sendBuf2.slice(0,j)));	// debug
		writer.write(sendBuf2.slice(0,j));
		writer.releaseLock();
	}

	_syncEspBurn() {
		// ESP_SYNC(08)
		//W:C00008 2400 00000000 20120707 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 C0
		//R:C00108 0200 20120707 0000 C0
		let data = new Uint8Array(0x24);
		let dv = new DataView(data.buffer);
		dv.setUint32(0, 0x20120707, true);
		for(let j = 4; j < 0x24; j++)
			data[j] = 0x55;

		const _this = this;
		return new Promise((resolve1, reject1) => {
			let i = 0;
			loop();
			function loop(){
				// DTR=1 RTS=0 IO0=1 EN=0
				// DTR=0 RTS=1 IO0=0 EN=1(delay)
				// DTR=1 RTS=1 IO0=1 EN=1
				return      _this.uart.setSignals({ dataTerminalReady: false, requestToSend: true })
				.then(() => new Promise(resolve => setTimeout(resolve, (i&1)? 1300: 110)))
				.then(() => _this.uart.setSignals({ dataTerminalReady: true,  requestToSend: false }))
				.then(() => new Promise(resolve => setTimeout(resolve, (i&1)? 460: 60)))
				.then(() => _this.uart.setSignals({ dataTerminalReady: false, requestToSend: false }))
				.then(() => {
					let hTimeout = null;
					let j = 0;
					loop2();
					function loop2(){
						return new Promise((resolve2, reject2) => {
							hTimeout = setTimeout(reject2, 170);
							_this.recvResolve = resolve2;
							_this._SendEspBurn(0x8, data, 0);
						}).then(rcvParam => {
							console.log(rcvParam.toString(16));
							clearTimeout(hTimeout);
							_this.recvResolve = null;
							resolve1();
							return;
						}).catch(() => {
							console.log(i+','+j);
							clearTimeout(hTimeout);
							j++;
							if(j < 5) {
								loop2();
							} else {
								i++;
								if(i < 10) {
									loop();
								} else {
									reject1();
									return;
								}
							}
						})
					}
				})
			}
		})
	}

	_RecvEspBurn(reader) {
	//	const reader = this.uart.readable.getReader();
		let count = 0;
		let rcvBuf = new Uint8Array((8 + 1024) * 2);

		const _this = this;
		return new Promise(resolve => {
			loop();
			function loop(){
				return reader.read()
				.then(result => {
					if(result.done) {
						reader.releaseLock();
						resolve();
						return;
					}
				//	console.log('r:'+_this._dumpBuf(result.value));	// debug
					for(let i = 0; i < result.value.length; i++) {
						if(count == 0 && result.value[i] != 0xC0) {
							continue;

						} else if(count != 0 && result.value[i] == 0xC0) {
							rcvBuf[count] = result.value[i];
							count++;
							for(let i = 0; i < count-1; i++) {
								if(rcvBuf[i] == 0xDB) {
									switch(rcvBuf[i+1]) {
									case 0xDC:
										rcvBuf[i] = 0xC0;
										break;
									case 0xDD:
										rcvBuf[i] = 0xDB;
										break;
									default:
										throw 'Invalid SLIP escape';
									}
									for(let j = i+i; j < count-1; j++)
										rcvBuf[j] = rcvBuf[j+1];
									count--;
								}
							}
							// C00108 0200 20120707 00 00 C0
							// C00108 0000 00000000 ff 00 C0
							// C00108 0400 55552012 00000000 C0
							console.log('R:'+_this._dumpBuf(rcvBuf.slice(0,count)));	// debug
							let tmp = new DataView(rcvBuf.buffer);
							let len = tmp.getUint16(3,true);
							if(rcvBuf[1] == 0x01 && /*rcvBuf[2] == cmd &&*/ (len == 0 || len+10 == count)) {
							//	reader.releaseLock();
								if(_this.recvResolve) _this.recvResolve(tmp.getUint32(5,true));
							//	return;
							}
							count = 0;
						} else {
							rcvBuf[count] = result.value[i];
							count++;
							if(count >= rcvBuf.length) throw 'overflow';
						}
					}
					loop();
				})
			}
		})
	}

	_espFlash(binBuf, adrs, progressStart, progressEnd) {
		const BLOCK_SIZE = 16384;

		let i;
		let j;
		let comp = null;
		let binSize = binBuf.length;

		const _this = this;
		return new Promise(resolve => {
			return Zlib.deflate(binBuf.slice(0,binSize), (err, _comp) => resolve(_comp));
		}).then(result => {
			comp = result;
			let numBlocks = Math.floor((comp.length + BLOCK_SIZE - 1) / BLOCK_SIZE);

			//  flash_defl_begin     write_size num_blocks WRITE_SIZE offset
			//W:c00010 1000 00000000 00002000 00000001 00004000 0000e000 c0
			//R:c00110 0200 00000000 0000 c0
			return _this._SendRecvEspBurn(0x10, [binSize, numBlocks, BLOCK_SIZE, adrs], null);
		}).then(rcvParam => {
console.log(rcvParam);

			//  flash_defl_data      len      seq
			//W:c00011 3f00 0000004d 0000002f 00000000 00000000 00000000 78daedd7c11100101004b0559b87168d664f05fc99a48bb42475b0661f050000003c2f97ff030000007fd81444d79bc0
			//R:c00111 0200 00000000 0000 c0
			i = 0;
			return new Promise(resolve => {
			//	For i = 0 To comp.length - 1 Step BLOCK_SIZE
				loop();
				function loop(){
					let num = Math.min(comp.length - i, BLOCK_SIZE);

					return _this._SendRecvEspBurn(0x11, [num, Math.floor(i/BLOCK_SIZE), 0,0], comp.slice(i,i+num))
					.then(rcvParam => {
						i += num;
						if(i >= comp.length) {
							resolve(rcvParam);
							return;
						}
						_this.statusMessage.innerText = ['burning ', '書き込み中 '][_this._locale]
								+ Math.floor(progressStart + (progressEnd - progressStart) * i / comp.length) + '%';
						loop();
					})
				}
			})
		}).then(rcvParam => {
console.log(rcvParam);

			//  FLASH_MD5            addr     size
			//W:c00013 1000 00000000 0000e000 00002000 00000000 00000000 c0
			//R:c00113 1200 00000000 417532e6 4c39dce2 28b3c3a2 9ff3c00a 0000 c0
			return _this._SendRecvEspBurn(0x13, [adrs,binSize,0,0], null);
		});
	}

	_dumpBuf(data) {
		let str = '';
		for(let i = 0; i < data.length; i++) {
			str += ('0' + data[i].toString(16)).substr(-2) + ' ';
		}
		return str;
	}

}
module.exports = comlib;
