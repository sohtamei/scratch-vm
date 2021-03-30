/* copyright (C) 2021 SohtaMei. */

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const StubCodeBin = require('!arraybuffer-loader!./STUB_CODE.bin');

const BootloaderBin = require('!arraybuffer-loader!./bootloader_qio_80m.bin');
const BootApp0Bin = require('!arraybuffer-loader!./boot_app0.bin');

class comlib {
    constructor(extName, SupportCamera) {
		this.extName = extName;
		this.SupportCamera = SupportCamera;

        this.ipadrs = '192.168.1.xx';
        this.ifType = 'UART';
		this._locale = 0;

		this.busy = false;
		this.cueue = [];
        this.ws = null;
		this.wsResolve = null;
		this.wsError = null;

        this.port = null;
		this.espBurnBusy = false;
		this.recvResolve = null;
		this.recvTimeout = null;

		this.statusMessage = document.body.querySelector('#StatusMessage');

		let cookies_get = document.cookie.split(';');
		for(let i=0;i<cookies_get.length;i++) {
			let tmp = cookies_get[i].trim().split('=');
			switch(tmp[0]) {
			case extName+'_ip':
				this.ipadrs=tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			case extName+'_if_type':
				this.ifType=tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			}
		}
    }

	setLocale(locale) {
		this._locale = locale;
	}

    getConfig() {
        return [this.ifType, this.ipadrs];
    }

    setConfig(ifType, ipadrs) {
        this.ifType = ifType;
        this.ipadrs = ipadrs;
        document.cookie = this.extName+'_if_type=' + this.ifType + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
        document.cookie = this.extName+'_ip=' + this.ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
        if(this.SupportCamera)
          document.cookie = 'Camera_ip=' + this.ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';

		if(this.ifType == 'UART') {
          this.statusMessage.innerText = [
            'UART has been saved.',
            'UARTを設定しました',
          ][this._locale];
        } else if(this.SupportCamera) {
          this.statusMessage.innerText = this.ifType + ", " + this.ipadrs + [
            ' has been saved (for Robot & Camera).',
            'を設定しました(ロボット & カメラ)',
          ][this._locale];
        } else {
          this.statusMessage.innerText = this.ifType + ", " + this.ipadrs + [
            ' has been saved.',
            'を設定しました',
          ][this._locale];
        }

		if(this.port) {
			this.port.close();
			this.port = null;
		}
		if(this.ws) {
			this.ws.close();
			this.ws = null;
		}
    }

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
//  {'B','S'},		// 0x90:set_pwm        (port, data)
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
		const _defs = {ARG1:{type2:'b'}};
		const _args = {ARG1:portLevels};
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

	sendRecv(cmd, argsDef, args) {
		this.statusMessage.innerText = ' ';

		let data = new Uint8Array(256);
		let dv = new DataView(data.buffer);
		let tmp = new Uint8Array([0xff, 0x55, 0x00, cmd]);
		let ofs = 0;
		for(ofs = 0; ofs < tmp.length; ofs++)
			data[ofs] = tmp[ofs];

		let j = 0;
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
				data[ofs] = param.length; ofs++;
				for(j = 0; j < param.length; j++)
					data[ofs+j] = param[j];
				ofs += j;
				break;
			}
		}
		data[2] = ofs-3;
		data = data.slice(0,ofs);
		if(this.cueue.length >= 5) return 'error';

		const _this = this;
		return Promise.resolve().then(function(){
			if(_this.ifType == 'UART' && _this.port == null)
				return _this._openUart();
			return;
		}).then(function(){
			return new Promise(function(resolve) {
				_this.cueue.push({resolve:resolve, data:data});
				_this.checkCueue(_this);
			})
		})
	}

	checkCueue(_this) {
		if(_this.cueue.length == 0) return;
		if(_this.busy) {
			console.log('+Cueue=' + (_this.cueue.length-1) + '->' + _this.cueue.length);
			return;
		}
		_this.busy = true;

		const {resolve, data} = _this.cueue.pop();
		console.log('W:'+_this._dumpBuf(data));	// debug
		if(_this.ifType == 'WLAN')
			return _this._sendRecvWs(data,resolve);
		else
			return _this._sendRecvUart(data,resolve);
		
	}

	_sendRecvUart(sendBuf,resolve) {
		const _this = this;
		if(_this.port.writable == null) {
			console.warn('unable to find writable port');
			return;
		}

		const writer = _this.port.writable.getWriter();
		writer.write(sendBuf);
		writer.releaseLock();

		const reader = _this.port.readable.getReader();
		let count = 0;
		let size = 3;
		let buf = new Uint8Array(256);
		return new Promise(function(resolve2) {
			loop();
			function loop(){
				return reader.read().then(function(result) {
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
					}
					if(count >= size) {
						reader.releaseLock();
						console.log('R:'+_this._dumpBuf(buf.slice(0,size)));	// debug
						let tmp = 0;
						if(size >= 5) {
							let tmp2 = new DataView(buf.buffer);
							switch(buf[3]) {
							case 1: tmp = tmp2.getUint8(4); break;
							case 2: tmp = tmp2.getInt16(4, true); break;
							case 3: tmp = tmp2.getInt32(4, true); break;
							case 4: tmp = tmp2.getFloat32(4, true); break;
							case 5: tmp = tmp2.getFloat64(4, true); break;
							case 6: tmp = String.fromCharCode.apply(null, buf.subarray(4)); break;
							case 7: tmp = buf.slice(5,5+buf[4]); break;
							}
						}
						resolve2(tmp);
						return;
					}
					loop();
				})
			}
		}).then(function(tmp) {
			_this.busy = false;
			if(_this.cueue.length != 0) console.log('-Cueue=' + _this.cueue.length + '->' + (_this.cueue.length-1));
			_this.checkCueue(_this);
			resolve(tmp);
		}).catch(function(err) {
		//	_this.port = null;
			console.log(err);
			return "error";
		})
	}

	_openUart() {
		if(this.port) return;

		const _this = this;
		let port = null;
		return navigator.serial.requestPort({}).then(function(result) {
			port = result;

			const options = {
				baudRate: 115200,
				dataBits: 8,
				parity: "none",
				stopBits: 1,
				flowControl: "none",

				// Prior to Chrome 86 these names were used.
				baudrate: 115200,
				databits: 8,
				stopbits: 1,
				rtscts: false,
			};
			return port.open(options);
		}).then(function(){
			const writer = port.writable.getWriter();
			let tmp = new Uint8Array([0x00,0xff,0x55,0x01,0xfe]);
			writer.write(tmp);
			writer.releaseLock();

			const reader = port.readable.getReader();
			let count = 0;
			let buf = new Uint8Array(256);
			return new Promise(function(resolve) {
				loop();
				function loop(){
					return reader.read().then(function(result) {
					//	console.log(result.value);	// debug
						for(let i = 0; i < result.value.length; i++) {
							buf[count++] = result.value[i];
							if(result.value[i] == 0x0a) {
								reader.releaseLock();
								resolve();
								return;
							}
						}
						loop();
					})
				}
			}).then(function(){
				let tmp = String.fromCharCode.apply(null, buf.slice(0,count));
				_this.statusMessage.innerText = tmp;
				console.log(tmp);
				_this.port = port;
				return;
			})
		})
	}

	_sendRecvWs(sendBuf,resolve) {
		const _this = this;
		_this.wsResolve = resolve;
	//	_this.wsError = error;

		if(_this.ws !== null) {
			_this.ws.send(sendBuf);
			return;
		}
	/*
		if(_this.ipadrs == '192.168.1.xx') {
			error('');
			return;
		}
	*/
		_this.ws = new WebSocket('ws://'+_this.ipadrs+':54323');
		_this.ws.binaryType = 'arraybuffer';

		_this.ws.onopen = function(e) {
			console.log('open: ' + e);
			_this.ws.send(sendBuf);
		}

		_this.ws.onmessage = function(event) {
			let buf = new Uint8Array(event.data);
			console.log('R:'+_this._dumpBuf(buf));	// debug
			let tmp = 0;
			if(buf[0] == 0xFF && buf[1] == 0x55 && buf[2]+3 == buf.length && buf.length >= 5) {
				let tmp2 = new DataView(buf.buffer);
				switch(buf[3]) {
				case 1: tmp = tmp2.getUint8(4); break;
				case 2: tmp = tmp2.getInt16(4, true); break;
				case 3: tmp = tmp2.getInt32(4, true); break;
				case 4: tmp = tmp2.getFloat32(4, true); break;
				case 5: tmp = tmp2.getFloat64(4, true); break;
				case 6: tmp = String.fromCharCode.apply(null, buf.subarray(4)); break;
				case 7: tmp = buf.slice(5,5+buf[4]); break;
				}
			//	console.log(tmp);	// debug
			}
			_this.busy = false;
			if(_this.cueue.length != 0) console.log('-Cueue=' + _this.cueue.length + '->' + (_this.cueue.length-1));
			_this.checkCueue(_this);
			_this.wsResolve(tmp);
			_this.wsResolve = null;
			_this.wsError = null;
			return tmp;
		}

		_this.ws.onclose = function(event) {
			if (event.wasClean) {
				console.log(`close: Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				console.log('close: Connection died');
			}
			_this.ws = null;
			if(_this.wsError !== null) _this.wsError('');
		};

		_this.ws.onerror = function(error) {
			console.log('[error] '+error.message);
			_this.ws.close();
			_this.ws = null;
			if(_this.wsError !== null) _this.wsError('');
			_this.statusMessage.innerText = ['cannot connect to ','接続できませんでした：'][_this._locale] + _this.ipadrs;
		};
		return;
	}

	// WLANアップデート ----------------------------------------------------------------------------

	//{name:'TukuBoard1.0', type:'esp32', baudrate:230400, part:_part0, image:_image0},
	burnWlan(flashBin) {
		if(this.espBurnBusy) return;
		this.espBurnBusy = true;

		const PARAM1_START = 0x9000;
		const PARAM_SIZE = 0x6000;
		const StubCode = new Uint8Array(StubCodeBin);
		const UpdateMsg = ['burning ', '書き込み中 '][this._locale];
		this.statusMessage.innerText = '';

//		if(this.recvResolve) return;

		const _this = this;
		let reader = null;
		if(this.port) {
			this.port.close();
			this.port = null;
		}
		let flashBinPart = null;
		let flashBinImage = null;

		return navigator.serial.requestPort({}).then(function(result) {
			_this.port = result;

			const options = {
				baudRate: flashBin.baudrate,
				dataBits: 8,
				parity: "none",
				stopBits: 1,
				flowControl: "none",

				// Prior to Chrome 86 these names were used.
				baudRate: flashBin.baudrate,
				databits: 8,
				stopbits: 1,
				rtscts: false,
			};
			return _this.port.open(options);
		}).then(function(){
			_this.statusMessage.innerText = UpdateMsg+'0%';

			return fetch('static/extensions/'+flashBin.name+'.part.bin').then(response => response.blob()).then(blob => {
				return new Promise(function(resolve) {
					let reader = new FileReader();
					reader.onload = function(e){
						flashBinPart = new Uint8Array(reader.result);
						resolve();
					};
					reader.readAsArrayBuffer(blob);
				});
			});
		}).then(function(){
			_this.statusMessage.innerText = UpdateMsg+'1%';

			return fetch('static/extensions/'+flashBin.name+'.image.bin').then(response => response.blob()).then(blob => {
				return new Promise(function(resolve) {
					let reader = new FileReader();
					reader.onload = function(e){
						flashBinImage = new Uint8Array(reader.result);
						resolve();
					};
					reader.readAsArrayBuffer(blob);
				});
			});
		}).then(function(){
			_this.statusMessage.innerText = UpdateMsg+'2%';
			// DTR=1 RTS=0 IO0=1 EN=0
			// DTR=0 RTS=1 IO0=0 EN=1(delay)
			// DTR=1 RTS=1 IO0=1 EN=1
			return _this.port.setSignals({ dataTerminalReady: false, requestToSend: true })
			.then(() => new Promise(resolve => setTimeout(resolve, 100)))
			.then(() => _this.port.setSignals({ dataTerminalReady: true, requestToSend: false }))
			.then(() => new Promise(resolve => setTimeout(resolve, 100)))
			.then(() => _this.port.setSignals({ dataTerminalReady: false, requestToSend: false }));

		}).then(function(){
			reader = _this.port.readable.getReader();
			_this._RecvEspBurn(reader);
			return new Promise(resolve => setTimeout(resolve, 3000));

		}).then(function(){
			_this.statusMessage.innerText = UpdateMsg+'5%';

			// esptool.exe --chip esp32 --port COM6 --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 Arduino/portable/packages/esp32/hardware/esp32/1.0.4/tools/partitions/boot_app0.bin 0x1000 Arduino/portable/packages/esp32/hardware/esp32/1.0.4/tools/sdk/bin/bootloader_qio_80m.bin 0x10000 C:\Users\n-tom\fd_work\TuKuRutch\ext\libraries\TukuBoard1.0\robot_pcmode\robot_pcmode.ino.esp32.bin 0x8000 C:\Users\n-tom\fd_work\TuKuRutch\ext\libraries\TukuBoard1.0\robot_pcmode\robot_pcmode.ino.partitions.bin

			//	0xe000 boot_app0.bin
			//	0x1000 bootloader_qio_80m.bin
			//	0x10000 robot_pcmode.ino.image.bin
			//	0x8000 robot_pcmode.ino.part.bin

			// connecting ###############################

			return _this._syncEspBurn();
		}).then(function(){
//console.log("");
			_this.statusMessage.innerText = UpdateMsg+'10%';
			return new Promise(resolve => setTimeout(resolve, 500));
		}).then(function() {
//console.log("");

			// Chip Is ESP32D0WDQ6(revision 0) ######################

			// ESP_READ_REG(0A)			addr
			//C0 00 0A 04 00	00000000	6001A018	C0
			//C0 01 0A 04 00	00000004	00000000	C0
			let data = new Uint8Array(0x4);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, 0x6001A018, true);
			return _this._SendRecvEspBurn(0xA, data, 0);

		}).then(function(rcvParam) {
			// run_stub ###########################################
//console.log(rcvParam);

			// ESP_MEM_BEGIN(05)			size		blocks		blocksize	offset
			//C0 00 05 10 00	00000000	00000C0C	00000001	00001800	40090000	C0
			//C0 01 05 04 00	00000004	00000000	C0
			let data = new Uint8Array(0x10);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, StubCode.length, true);
			dv.setUint32(4, 0x1, true);
			dv.setUint32(8, 0x1800, true);
			dv.setUint32(12, 0x40090000, true);
			return _this._SendRecvEspBurn(0x5, data, 0);

		}).then(function(rcvParam) {
//console.log(rcvParam);

			// ESP_MEM_DATA(07)				len(data)	seq			0			0			data
			//C0 00 07 1C 0C	00000078	00000C0C	00000000	00000000	00000000	F8 20 F4 3F F8 30 F4 3F 36 41 00 91 FD FF C0 20 00 88 09 80 80 24 56 48 FF 91 FA FF C0 20 00 88 09 80 80 24 56 48 FF 1D F0 00 00 00 10 20 F4 3F 00 20 F4 3F 00 00 00 08 36 41 00 E5 FC FF 81 FB FF 0C 02 C0 20 00 29 08 91 FA FF 21 FA FF C0 20 00 22 69 00 C0 20 00 28 09 56 72 FF C0 20 00 88 08 0C 12 80 80 04 20 28 30 1D F0 00 00 00 00 40 36 41 00 65 FC FF 16 9A FF 81 ED FF 91 FC FF C0 20 00 99 08 C0 20 00 98 08 56 79 FF 1D F0 00 00 00 00 00 01 00 00 80 00 98 00 FD 3F FF FF FF 00 04 20 F4 3F 36 41 00 21 FC FF 32 22 04 16 43 05 65 F8 FF 16 EA 04 A5 FB FF 58 42 0C F8 0C 13 41 F4 FF 57 A8 0B 58 22 80 55 10 CC 35 41 F2 FF 1C 03 88 22 40 58 11 25 F3 FF 81 F0 FF 80 85 10 51 F0 FF C0 20 00 89 05 81 D2 FF C0 20 00 42 68 00 C0 20 00 48 08 56 74 FF 88 42 48 22 30 88 C0 3A 34 89 42 39 22 1D F0 00 08 00 F4 3F 1C 00 F4 3F 00 00 F4 3F 90 00 FD 3F 08 80 FC 3F 80 80 00 00 84 80 00 00 40 40 00 00 48 C0 FC 3F 10 00 F4 3F 94 00 FD 3F 36 41 00 21 F4 FF 31 F7 FF 41 F7 FF C0 20 00 58 02 4A 43 61 F1 FF C0 20 00 28 06 20 20 74 16 E2 09 C6 23 00 61 EE FF B1 EE FF C0 20 00 A2 26 00 A0 A0 74 A5 A4 00 96 CA 04 91 EA FF 81 EB FF B1 EB FF 80 89 80 B0 B9 80 C0 20 00 C8 08 92 1B 00 A0 A0 74 90 80 F4 1B 98 90 90 F4 C0 20 00 92 5B 00 8A 8C C0 20 00 A2 48 00 82 1B 00 91 E1 FF 80 80 F4 97 98 3E C0 20 00 A8 04 81 E0 FF 91 DD FF 37 9A 19 46 02 00 7C E8 87 1A E9 46 09 00 00 00 C0 20 00 39 08 C0 20 00 99 04 46 02 00 C0 20 00 99 08 C0 20 00 39 04 81 D1 FF 0C 09 8A 83 C0 20 00 92 58 00 0B 22 26 02 02 C6 D9 FF C6 D4 FF 00 21 CE FF C0 20 00 59 02 1D F0 00 00 50 2D 06 40 36 41 00 41 A4 FF 58 34 30 35 63 16 E3 03 58 14 5A 53 50 5C 41 86 00 00 65 E8 FF 88 44 A6 18 04 88 24 87 A5 F2 E5 E0 FF 16 9A FF A8 14 30 C3 20 20 B2 20 81 F2 FF E0 08 00 8C 3A 22 A0 C4 29 54 58 14 3A 55 59 14 58 34 30 35 C0 39 34 1D F0 00 08 20 F4 3F 00 00 40 00 70 E2 FA 3F 48 24 06 40 F0 22 06 40 36 61 00 E5 D9 FF AD 01 81 FC FF E0 08 00 3D 0A 0C 12 EC EA 98 01 82 A2 00 80 89 10 89 01 A5 DE FF 91 F2 FF 81 F3 FF C0 20 00 A8 09 80 8A 20 C0 20 00 82 69 00 B2 21 00 A1 EF FF 81 F0 FF E0 08 00 A0 23 83 1D F0 00 00 FF 0F 00 00 36 41 00 A1 78 FF 91 FD FF 82 A0 01 82 4A 00 32 6A 01 30 8C 41 22 6A 03 30 30 B4 9A 22 89 2A 2A 83 80 8C 41 0C 02 89 4A 29 5A A5 F8 FF 2D 0A 32 A0 C5 A0 23 93 1D F0 00 2C 92 00 40 36 41 00 82 A0 C0 AD 02 87 92 0E A2 A0 DB 81 FB FF E0 08 00 A2 A0 DC 86 03 00 82 A0 DB 87 92 08 81 F7 FF E0 08 00 A2 A0 DD 81 F4 FF E0 08 00 1D F0 00 00 00 36 41 00 3A 32 06 02 00 00 A2 02 00 1B 22 E5 FB FF 37 92 F4 1D F0 00 00 00 10 00 00 58 10 00 00 7C DA 05 40 D8 2E 06 40 9C DA 05 40 1C DB 05 40 36 21 21 A2 D1 10 81 FA FF E0 08 00 86 09 00 00 51 F6 FF BD 01 50 43 63 CD 04 AD 02 81 F6 FF E0 08 00 EC FA CD 04 BD 01 A2 D1 10 81 F3 FF E0 08 00 4A 22 40 33 C0 56 63 FD A1 EC FF B2 D1 10 1A AA 81 EE FF E0 08 00 A1 E9 FF 1C 0B 1A AA 25 F8 FF 2D 03 1D F0 22 A0 63 1D F0 00 00 36 41 00 A2 A0 C0 81 CD FF E0 08 00 1D F0 00 00 68 10 00 00 70 10 00 00 74 10 00 00 78 10 00 00 FC 67 00 40 A4 92 00 40 08 68 00 40 36 41 21 61 F9 FF 81 F9 FF 1A 66 1A 88 49 06 72 D1 10 0C 06 2C 0A 59 08 62 67 1A 81 F6 FF E0 08 00 81 CF FF 47 B8 02 46 36 00 AD 07 81 CF FF E0 08 00 4D 06 51 EF FF 61 CB FF 1A 55 6A 81 89 05 06 2D 00 00 81 E9 FF 40 63 C0 1A 88 88 08 BD 01 60 68 63 CD 06 20 A2 20 81 C5 FF E0 08 00 8C EA 91 E1 FF 0C 05 52 67 16 6D 05 9A 51 46 0D 00 00 25 F6 FF 60 B6 20 AD 01 E5 EC FF A5 F5 FF CD 06 10 B1 20 70 A7 20 81 BA FF E0 08 00 6A 22 6A 44 37 B4 CC 81 D6 FF 50 64 C0 1A 88 88 08 87 36 A3 06 EF FF 00 00 81 D4 FF E0 08 00 81 D1 FF 10 88 80 B2 28 00 E5 71 00 F7 EA 0D F6 46 0A 60 B5 80 A2 4B 00 1B 66 06 F7 FF 7C EB B7 9A D7 26 46 27 A1 A5 FF 70 B7 20 1A AA 81 A7 FF E0 08 00 65 EF FF A1 A0 FF 1C 0B 1A AA E5 E5 FF A5 EE FF 2C 0A 81 C3 FF E0 08 00 1D F0 52 27 1A 37 B5 D1 57 B4 8E C6 F2 FF 1D F0 00 00 00 00 FC 3F 4F 48 41 49 A4 2B FD 3F 34 01 09 40 0C 00 F4 3F 38 40 F4 3F FF FF 00 00 00 00 01 00 8C 80 00 00 10 40 00 00 00 40 00 00 00 00 FC 3F 04 00 FC 3F 10 27 00 00 A4 2B FD 3F 08 00 FC 3F B0 00 FD 3F 7C 68 00 40 EC 67 00 40 58 86 00 40 6C 2A 06 40 38 32 06 40 CC 2C 06 40 4C 2C 06 40 34 85 00 40 88 85 00 40 CC 90 00 40 30 EF 05 40 58 92 00 40 4C 82 00 40 14 2C 06 40 36 C1 00 21 E1 FF 0C 0A 22 61 08 42 A0 00 81 EE FF E0 08 00 21 DC FF 31 DD FF 06 01 00 42 62 00 4B 22 37 32 F7 A5 E2 FF 0C 4B A2 C1 20 65 D9 FF E5 E1 FF 41 E1 FE 21 E1 FE B1 D5 FF 0C 0C 2A 24 0C 5A C0 20 00 49 02 81 E1 FF E0 08 00 31 D1 FF 22 A1 01 C0 20 00 58 03 2C 0A 20 25 20 C0 20 00 29 03 81 85 FF E0 08 00 81 DA FF E0 08 00 21 CA FF C0 20 00 38 02 CC BA 1C C2 20 23 10 22 C2 F8 0C 13 20 A3 83 0C 0B 81 D3 FF E0 08 00 F1 C3 FF D1 53 FF C1 C3 FF B1 A6 FE E2 A1 00 0C 0A 81 CE FF E0 08 00 31 A5 FE 52 D3 2B 21 C3 FE 41 BD FF 4A 62 C0 20 00 28 06 16 72 FF C0 20 00 78 06 0C 02 C0 20 00 29 06 0C 16 62 41 10 62 07 01 22 51 09 62 41 11 29 51 66 96 17 22 07 03 62 07 02 80 22 11 60 22 20 66 42 08 28 27 C0 20 00 28 02 29 51 E5 D5 FF 0C 8B A2 C1 10 A5 CC FF 22 07 03 82 07 02 80 22 11 80 82 20 21 A8 FF 87 B2 11 A2 A0 C0 E5 C7 FF A2 A0 EE A5 C7 FF 65 D3 FF 46 E2 FF 62 07 01 0C D2 27 96 02 06 91 00 67 32 4E 66 66 02 C6 B0 00 F6 76 20 66 36 02 C6 65 00 F6 46 08 66 26 02 C6 4B 00 46 AF 00 66 46 02 06 7B 00 66 56 02 86 8F 00 86 AB 00 0C 92 27 96 02 06 86 00 67 32 08 66 76 02 C6 8C 00 86 A6 00 66 96 02 46 84 00 0C B2 27 96 02 46 79 00 46 A2 00 1C 32 27 96 02 C6 39 00 67 32 28 66 B6 02 C6 43 00 1C 02 67 32 0A 0C F2 27 96 02 06 2E 00 06 9A 00 1C 12 27 96 02 86 4B 00 1C 22 27 96 02 46 63 00 46 95 00 22 A0 D1 27 16 2D 67 32 09 22 A0 D0 27 16 18 C6 90 00 00 22 A0 D2 27 96 02 86 25 00 22 A0 D3 27 96 02 46 1D 01 46 8B 00 0C 12 16 18 3C AD 02 2D 0A 86 86 00 26 88 02 86 84 00 C6 F0 00 00 00 65 B1 FF 60 46 20 60 22 80 16 2A 01 86 7F 00 00 A0 AC 41 81 76 FF E0 08 00 56 1A 1F 42 D4 F0 40 A2 C0 CC 24 86 F9 00 00 A0 60 F4 56 16 FE 61 60 FF 86 03 00 A0 A0 F5 81 6E FF E0 08 00 56 DA 1C 60 44 C0 40 A2 C0 47 36 EA 86 03 00 A0 AC 41 81 67 FF E0 08 00 56 5A 1B 42 D4 F0 40 A2 C0 56 A4 FE 46 EA 00 0C 06 22 A0 C0 26 88 02 46 6B 00 86 EA 00 00 00 66 B8 02 86 E8 00 06 47 00 66 B8 02 86 D3 00 C6 61 00 22 A0 01 26 B8 02 06 60 00 92 27 04 81 4A FF 62 A0 00 22 A0 C2 87 19 02 C6 5E 00 B8 57 A8 27 E5 AB FF C6 CB 00 00 00 00 0C 14 66 B8 2C A8 47 81 41 FF 0C 06 22 A0 C2 87 1A 02 46 56 00 88 37 B8 57 A8 27 20 88 11 89 C1 65 A9 FF 21 1D FE 88 C1 69 62 22 D2 2B 89 22 A0 46 83 2D 04 86 4A 00 91 18 FE 0C 06 A2 09 00 22 A0 C6 67 9A 02 86 49 00 68 27 28 59 82 C8 F0 80 66 C0 92 A0 C0 60 29 93 62 C7 18 9D 06 B2 A0 EF C6 01 00 A2 09 00 1B 99 A0 BB 30 60 A9 C0 87 2A F1 82 07 05 A2 07 04 62 07 06 80 88 11 A0 98 20 00 66 11 90 86 20 62 07 07 92 A0 C1 80 66 01 80 66 20 60 8B C0 80 29 93 0C 06 46 34 00 00 81 FF FD 0C 06 92 08 00 22 A0 C6 67 99 02 C6 2F 00 98 38 22 A0 C8 67 19 02 06 2D 00 62 48 00 28 58 06 2B 00 1C 82 27 98 02 46 9B 00 0C 06 0C 12 46 27 00 00 66 48 02 46 9F 00 06 21 00 66 B8 02 06 A1 00 C6 01 00 00 00 66 48 02 86 A0 00 0C 06 22 A0 C0 86 1E 00 00 00 66 B8 02 46 9E 00 06 18 00 C1 04 FF 0C 06 A8 0C 0C 12 82 C8 F0 9D 06 80 92 93 A0 26 93 20 99 10 22 A0 C6 67 99 52 B1 FE FE 6D 09 D8 0B 22 A0 C9 87 3D 45 80 E0 14 0C 06 22 A0 C0 67 9E 3A 62 C7 18 2D 0E C6 02 00 2A 96 98 09 4B 22 99 0A 4B AA 0C 19 20 ED C0 87 32 ED 16 D9 21 A9 0C E9 0B 86 85 00 00 00 66 88 02 86 89 00 0C 12 0C 06 C6 01 00 00 00 62 A0 00 22 A0 FF 20 A0 74 E5 97 FF 60 A0 74 A5 97 FF 65 A3 FF 56 A2 C8 62 07 01 0C F8 87 16 31 67 38 15 66 46 02 46 51 00 66 66 02 46 57 00 26 36 02 46 1B FF 06 17 00 00 1C 22 27 96 02 46 4B 00 22 A0 D2 27 16 3B 1C 12 27 16 02 C6 14 FF C6 16 00 A1 D7 FE 81 E2 FE E0 08 00 68 27 81 E1 FE E0 08 00 C0 AA 11 60 B1 41 AA BB 60 BB C2 AD 02 81 DD FE E0 08 00 A2 A3 E8 81 D9 FE E0 08 00 06 08 FF 00 D2 27 05 C2 27 04 B2 27 03 A8 27 65 9E FF 86 03 FF 00 B2 07 03 22 07 02 80 BB 11 20 BB 20 B2 CB F0 A2 C7 18 65 7F FF 46 FD FE 00 62 07 03 82 07 02 80 66 11 80 66 20 22 C7 18 62 C6 F0 0C 19 06 1E 00 41 BC FE 71 BA FD E2 24 00 62 61 07 E0 77 C0 72 61 06 78 25 0C 39 77 36 01 0C 19 99 D1 E9 C1 A5 65 FF 98 D1 71 B4 FE E8 C1 A1 B3 FE BD 02 99 01 F2 C1 18 DD 07 C2 C1 1C 81 BB FE E0 08 00 9D 0A B8 25 A8 71 A0 BB C0 B9 25 A0 66 C0 B8 04 AA 22 A8 61 AA BB 0B A9 A0 A9 20 B9 04 A0 AF 05 70 BB C0 CC 9A C2 DB 80 0C 1D C0 AD 83 16 AA 00 AD 07 99 D1 65 76 FF 98 D1 79 04 8C B6 78 33 8C 77 90 7F 31 90 77 C0 96 77 F7 D6 89 00 22 A0 C7 29 53 C6 38 00 00 56 F9 0D 28 33 16 12 B4 22 A0 C8 86 00 00 22 A0 C9 29 53 C6 CC FE A8 27 56 EA B2 81 9E FE E0 08 00 A1 8D FE 81 98 FE E0 08 00 81 9B FE E0 08 00 86 C5 FE 00 28 37 16 02 B1 E0 02 00 86 C2 FE 00 89 C1 81 96 FE E0 08 00 88 C1 A0 82 93 AD 08 46 0B FF 28 27 68 37 60 82 20 80 80 B4 16 08 C3 C6 8E FF B2 27 03 A2 27 02 A5 82 FF 22 A0 00 0C 16 A0 26 93 46 8A FF F8 77 E8 67 D8 57 C8 47 B8 37 A8 27 0C 12 81 7D FE E0 08 00 6D 0A 0C 0A 60 2A 83 06 86 FF A8 27 0C 0B 81 77 FE E0 08 00 0C 02 06 7F FF 00 28 27 68 37 C0 20 00 69 02 0C 06 2D 06 06 7E FF 21 67 FE 88 57 68 27 89 02 21 65 FE 69 02 06 F6 FF 91 63 FE 0C 08 68 09 22 A0 C8 60 28 83 6D 02 21 5F FE 89 09 89 02 0C 12 60 28 83 06 6F FF 28 33 16 52 F2 86 97 FE 00 1D F0 00 00 36 41 00 9D 02 82 A0 C0 28 03 87 99 0E CC 32 0C 12 C6 06 00 0C 02 29 03 7C E2 1D F0 26 12 05 26 22 12 06 0C 00 82 A0 DB 80 29 23 87 99 29 0C 22 29 03 06 08 00 22 A0 DC 27 99 08 0C 12 29 03 2D 08 1D F0 00 82 A0 DD 7C F2 87 99 0B 0C 12 29 03 22 A0 DB 1D F0 00 7C F2 1D F0 00 00 C0
			//C0 01 07 04 00	00000004	00000000	C0
			let data = new Uint8Array(0x10 + StubCode.length);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, StubCode.length, true);
			dv.setUint32(4, 0x0, true);
			dv.setUint32(8, 0x0, true);
			dv.setUint32(12, 0x0, true);
			for(let i = 0; i < StubCode.length; i++)
				data[0x10 + i] = StubCode[i];
			return _this._SendRecvEspBurn(0x7, data, StubCode.length);

		}).then(function(rcvParam) {
//console.log(rcvParam);

			// ESP_MEM_BEGIN(05)			size		blocks		blocksize	offset
			//C0 00 05 10 00	00000000	00000004	00000001	00001800	3FFD2BA4	C0
			//C0 01 05 04 00	00000004	00000000	C0
			let data = new Uint8Array(0x10);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, 0x4, true);
			dv.setUint32(4, 0x1, true);
			dv.setUint32(8, 0x1800, true);
			dv.setUint32(12, 0x3FFD2BA4, true);
			return _this._SendRecvEspBurn(0x5, data, 0);

		}).then(function(rcvParam) {
//console.log(rcvParam);

			// ESP_MEM_DATA(07)				len(data)	seq			0			0			data
			//C0 00 07 14 00	00000024	00000004	00000000	00000000	00000000	08 00 FC 3F C0
			//C0 01 07 04 00	00000004	00000000	C0
			let data = new Uint8Array(0x14);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, 0x4, true);
			dv.setUint32(4, 0x0, true);
			dv.setUint32(8, 0x0, true);
			dv.setUint32(12, 0x0, true);
			dv.setUint32(16, 0x3FFC0008, true);
			return _this._SendRecvEspBurn(0x7, data, 4);

		}).then(function(rcvParam) {
//console.log(rcvParam);

			// ESP_MEM_END(06)				int(entrypoint == 0)	entrypoint
			//C0 00 06 08 00	00000000	00000000	40090560	C0
			//C0 01 06 04 00	00000004	00000000	C0
			let data = new Uint8Array(0x8);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, 0x0, true);
			dv.setUint32(4, 0x40090560, true);
			return _this._SendRecvEspBurn(0x6, data, 0);

		}).then(function(rcvParam) {
//console.log(rcvParam);

			//C0 4F 48 41 49 C0 - 'OHAI'
			return new Promise(resolve => setTimeout(resolve, 1000));
		}).then(function(){
//console.log("");

			// flash_set_parameters ##############################

			// ESP_SPI_SET_PARAMS(0b)		fl_id		total_size	block_size	sector_size	page_size	status_mask
			//C0 00 0B 18 00	00000000	00000000	01000000	00010000	00001000	00000100	0000FFFF	C0
			//C0 01 0B 00 00	00000000	00 00 C0
			let data = new Uint8Array(0x18);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, 0x0, true);
			dv.setUint32(4, 0x1000000, true);
			dv.setUint32(8, 0x10000, true);
			dv.setUint32(12, 0x1000, true);
			dv.setUint32(16, 0x100, true);
			dv.setUint32(20, 0xFFFF, true);
			return _this._SendRecvEspBurn(0xB, data, 0);

		}).then(function(rcvParam) {
//console.log(rcvParam);
			// 0xe000  boot_app0.bin
			let data = new Uint8Array(BootApp0Bin);
			return _this._espFlash(data, 0xe000, data.length, 11, 11);
		}).then(function(rcvParam) {
//console.log(rcvParam);
			// 0x1000  bootloader
			let data = new Uint8Array(BootloaderBin);
			//Flash params set to 0x0220
			data[2] = 0x2;
			data[3] = 0x20;
			return _this._espFlash(data, 0x1000, data.length, 12, 12);
		}).then(function(rcvParam) {
			// 0x8000  partitions.bin
			return _this._espFlash(flashBinPart, 0x8000, flashBinPart.length, 13, 13);
		}).then(function(rcvParam) {
			// 0x10000  esp32.bin
			return _this._espFlash(flashBinImage, 0x10000, flashBinImage.length, 15, 100)
		}).then(function(rcvParam) {
			// DTR=1 RTS=0 IO0=1 EN=0
			// DTR=1 RTS=1 IO0=1 EN=1
			return _this.port.setSignals({ dataTerminalReady: false, requestToSend: true })
			.then(() => new Promise(resolve => setTimeout(resolve, 100)))
			.then(() => _this.port.setSignals({ dataTerminalReady: false, requestToSend: false }));

		}).then(function(){
			_this.statusMessage.innerText = ['Finished', '書き込み完了'][_this._locale];
			console.log("OK");
		}).catch(function() {
			_this.statusMessage.innerText = ['Failed', '書き込み失敗'][_this._locale];
			console.log("NG");
		}).finally(function() {
			if(reader) {
				reader.cancel();
				reader.releaseLock();
			}
			if(_this.port) {
				_this.port.close();
				_this.port = null;
			}
			_this.espBurnBusy = false;
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

	_SendEspBurn(cmd, data, sumSize) {	// ret:[result, rcvParam]
		let rcvParam;
		let dataSize = data.length;

		// C0 00 08 24 00	00000000	20120707	55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 C0

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

		const writer = this.port.writable.getWriter();
	//	console.log('W:'+this._dumpBuf(sendBuf2.slice(0,j)));	// debug
		writer.write(sendBuf2.slice(0,j));
		writer.releaseLock();
	}

	_syncEspBurn() {
		// ESP_SYNC(08)
		//W:C0 00 08 24 00	00000000	20120707	55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 C0
		//R:C0 01 08 04 00	55552012	00000000	C0
		//R:c0 01 08 00 00	00000000	ff 00 c0

		const _this = this;
		return new Promise(function(resolve1, reject1) {
			let i = 0;
			let data = new Uint8Array(0x24);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, 0x20120707, true);
			for(let j = 4; j < 0x24; j++)
				data[j] = 0x55;
			let hTimeout = null;

			loop();
			function loop(){
				return new Promise(function(resolve2, reject2) {
					hTimeout = setTimeout(reject2, 2000);
					_this.recvResolve = resolve2;
					_this._SendEspBurn(0x8, data, 0);
				}).then(function(rcvParam) {
					console.log(rcvParam.toString(16));
					clearTimeout(hTimeout);
					_this.recvResolve = null;
					resolve1();
					return;
				}).catch(function() {
					console.log(i);
					clearTimeout(hTimeout);
					i++;
					if(i >= 10) {
						reject1();
						return;
					}
					loop();
				})
			}
		})
	}

	_SendRecvEspBurn(cmd, data, sumSize) {	// ret:[result, rcvParam]
		const _this = this;
		return new Promise(function(resolve1, reject1) {
			_this.recvTimeout = setTimeout(function() {
				console.log("");
				_this.recvTimeout = null;
				_this.recvResolve = null;
				reject1();
			}, 5000);

			_this.recvResolve = function(rcvParam) {
			//	console.log(rcvParam);	// debug
				clearTimeout(_this.recvTimeout);
				_this.recvTimeout = null;
				_this.recvResolve = null;
				resolve1(rcvParam);
			}

		//	_this._RecvEspBurn();
			_this._SendEspBurn(cmd, data, sumSize);
		})
	}
	
	_RecvEspBurn(reader) {
	//	const reader = this.port.readable.getReader();
		let count = 0;
		let rcvBuf = new Uint8Array((8 + 1024) * 2);

		const _this = this;
		return new Promise(function(resolve) {
			loop();
			function loop(){
				return reader.read().then(function(result) {
					if(result.done) {
						reader.releaseLock();
						resolve();
						return;
					}
				//	console.log('R:'+_this._dumpBuf(result.value));	// debug
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
										throw "Invalid SLIP escape";
									}
									for(let j = i+i; j < count-1; j++)
										rcvBuf[j] = rcvBuf[j+1];
									count--;
								}
							}
							// C0 01 08 02 00	20120707	00 00 C0
							// c0 01 08 00 00	00000000	ff 00 C0
							// C0 01 08 04 00	55552012	00000000	C0
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
							if(count >= rcvBuf.length) throw "overflow";
						}
					}
					loop();
				})
			}
		})
	}

	_espFlash(binBuf, adrs, binSize, progressStart, progressEnd) {
		const BLOCK_SIZE = 16384;

		let i;
		let j;

		let numBlocks = Math.floor((binSize + BLOCK_SIZE - 1) / BLOCK_SIZE);
	//	progressBurn = progressStart

		const _this = this;
		return Promise.resolve().then(function(){
			// ESP_FLASH_BEGIN(02)		erase_size	num_blocks	FLASH_WRITE_SIZE	offset
			//C0 00 02 10 00	00000000	00004CC0	00000002	00004000	00001000	C0
			//C0 01 02 00 00	00000000	00 00 C0
			let data = new Uint8Array(0x10);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, binSize, true);
			dv.setUint32(4, numBlocks, true);
			dv.setUint32(8, BLOCK_SIZE, true);
			dv.setUint32(12, adrs, true);
			return _this._SendRecvEspBurn(0x2, data, 0);

		}).then(function(rcvParam) {
console.log(rcvParam);

			// ESP_FLASH_DATA(03)		len(data)	seq			0			0			data
			//C0 00 03 10 40	000000A0	00004000	00000000	00000000	00000000	E9 .. F0 C0
			//C0 01 03 00 00	00000000	00 00 C0
			let data = new Uint8Array(0x10 + BLOCK_SIZE);
			let dv = new DataView(data.buffer);
			i = 0;
			return new Promise(function(resolve) {
			//	For i = 0 To binSize - 1 Step BLOCK_SIZE
				loop();
				function loop(){
					dv.setUint32(0, BLOCK_SIZE, true);
					dv.setUint32(4, Math.floor(i / BLOCK_SIZE), true);
					dv.setUint32(8, 0, true);
					dv.setUint32(12, 0, true);

					for(let j = 0; j < BLOCK_SIZE; j++) {
						if(i+j < binSize)
							data[0x10+j] = binBuf[i+j];
						else
							data[0x10+j] = 0xFF
					}
					return _this._SendRecvEspBurn(0x3, data, BLOCK_SIZE).then(function(rcvParam) {
						i += BLOCK_SIZE;
						if(i > binSize) {
							resolve(rcvParam);
							return;
						}
						_this.statusMessage.innerText = ['burning ', '書き込み中 '][_this._locale]
								+ Math.floor(progressStart + (progressEnd - progressStart) * i / binSize) + '%';
						loop();
					})
				}
			})
		}).then(function(rcvParam) {
console.log(rcvParam);

			// ESP_SPI_FLASH_MD5(13)		addr		size		0			0
			//C0 00 13 10 00	00000000	00001000	00004CC0	00000000	00000000	C0
			//C0 01 13 00 00	00000000	88CDB277	EA45B748	34CAF1E7	A5E22CD9	00 00 C0
			let data = new Uint8Array(0x10);
			let dv = new DataView(data.buffer);
			dv.setUint32(0, adrs, true);
			dv.setUint32(4, binSize, true);
			dv.setUint32(8, 0, true);
			dv.setUint32(12, 0, true);
			return _this._SendRecvEspBurn(0x13, data, 0);
		});
	}

	_dumpBuf(data) {
		let str = "";
		for(let i = 0; i < data.length; i++) {
			str += ('0' + data[i].toString(16)).substr(-2) + ' ';
		}
		return str;
	}

}
module.exports = comlib;
