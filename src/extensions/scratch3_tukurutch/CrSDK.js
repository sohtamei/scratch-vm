var extName = 'CrSDK';

const TIMEOUT = 6000;
const WIDTH = 480;
const HEIGHT = 360;

const IconURI = 'data:image/png;base64,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';
//*
// update of extension-manager is necessary.
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Base64Util = require('../../util/base64-util');
const formatMessage = require('format-message');

const StageLayering = require('../../engine/stage-layering');
class Scratch3Blocks {
//*/
/*
var ext = class {
*/
	constructor (runtime) {

		this._runtime = runtime;
		this._runtime.registerPeripheralExtension(extName, this);

		this.ipadrs = 'localhost';
		this.ipCamera = '';
		this.nameCamera = '';
		let cookies_get = document.cookie.split(';');

		for(let i = 0; i < cookies_get.length; i++) {
			let tmp = cookies_get[i].trim().split('=');
			switch(tmp[0]) {
			case extName+'_ip':
				this.ipadrs = tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			case 'Camera_ip':
				this.ipCamera = tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			case 'Camera_name':
				this.nameCamera = tmp[1];
				console.log(tmp[0]+'='+tmp[1]);
				break;
			}
		}

		this._locale = 0;
		this.busy = false;
		this.cueue = [];

		// WS
		this.ws = null;
		this.wsResolve = null;
		this.wsError = null;

		this.uart = null;
		this.ble = null;
		this.bleTxChar = null;
		this.bleRxChar = null;
		this.bleRxResolve = null;
		this.closeReq = false;

		this.incrementable = {}; //{aperture:'none', };

		this.paramItems_ = ['FNumber'];
    }

	getInfo () {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}
		this.statusMessage = document.body.querySelector('#StatusMessage');

		return {
			id: extName,
			name: 'CameraRemoteSDK',
			//blockIconURI: IconURI,
			menuIconURI: IconURI,
			showStatusButton: true,
			color1:'#0FBD8C',color2:'#0DA57A',color3:'#0B8E69',
			blocks: this.get_blocks(),
			menus: this.get_menus(),
		};
	}

	get_blocks() {

		this._blocks = [
{blockType: BlockType.COMMAND, opcode: 'setConfig', text: ['con/discon','接続/切断'][this._locale] + ' IP=[ARG1][ARG2]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: this.ipadrs},
	ARG2: { type: ArgumentType.STRING, defaultValue: (this.ipadrs == this.ipCamera ? '': this.ipCamera) + ' '},
}},

{blockType: BlockType.COMMAND, opcode: 'videoToggle', text: 'liveview [ARG1]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: 'on', menu: 'videoState' },
}},

{blockType: BlockType.COMMAND, opcode: 'afShutter', text: 'af shutter', arguments: {
}, hideFromPalette:true},

{blockType: BlockType.COMMAND, opcode: 'afShutter2', text: 'af shutter[ARG1]ms', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'500' },
}},

{blockType: BlockType.COMMAND, opcode: 'afHalfShutter', text: 'af half shutter', arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'updateProps', text: 'update Properties', arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'setParam', text: 'set[ARG1]value[ARG2]', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'FNumber', menu: 'paramItems' },
    ARG2: { type: ArgumentType.STRING, defaultValue:' ', menu: 'dummy'},
}},

{blockType: BlockType.REPORTER, opcode: 'operateParam', text: '[ARG1] [ARG2] value[ARG3]', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'get', menu: 'operates' },
    ARG2: { type: ArgumentType.STRING, defaultValue:'FNumber', menu: 'paramItems' },
    ARG3: { type: ArgumentType.STRING, defaultValue:' ' },
}},

{blockType: BlockType.REPORTER, opcode: 'buttonState', text: '[ARG1] [ARG2] is available ', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'inc', menu: 'inc_dec' },
    ARG2: { type: ArgumentType.STRING, defaultValue:'FNumber', menu: 'paramItems' },
}},

{blockType: BlockType.COMMAND, opcode: 'setAperture', text: 'set aperture[ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'400', menu: 'apertures' },
}},

{blockType: BlockType.COMMAND, opcode: 'setShutterSpeed', text: 'set shutter speed[ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'0x00010028', menu: 'shutterSpeeds' },
}},

{blockType: BlockType.COMMAND, opcode: 'setIso', text: 'set ISO[ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'0x00000640', menu: 'isos' },
}},

{blockType: BlockType.COMMAND, opcode: 'setSaveInfo', text: 'set save info[ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, defaultValue:'prefix' },
}},

		];
		return this._blocks;
	}

	get_menus() {

	  return {

videoState: { acceptReporters: true, items: ['off', 'on', 'on-flipped']},
operates: { acceptReporters: true, items: ['get', 'info', 'inc', 'dec', 'set']},
inc_dec: { acceptReporters: true, items: ['inc', 'dec']},
dummy: { acceptReporters: true, items: ['']},

apertures: { acceptReporters: true, items: [
	{ text:'F4', value:'400' },
	{ text:'F4.5', value:'450' },
	{ text:'F5', value:'500' },
	{ text:'F5.6', value:'560' },
	{ text:'F6.3', value:'630' },
	{ text:'F7.1', value:'710' },
	{ text:'F8', value:'800' },
	{ text:'F9', value:'900' },
	{ text:'F10', value:'1000' },
	{ text:'F11', value:'1100' },
	{ text:'F13', value:'1300' },
	{ text:'F14', value:'1400' },
	{ text:'F16', value:'1600' },
	{ text:'F18', value:'1800' },
	{ text:'F20', value:'2000' },
	{ text:'F22', value:'2200' },
]},

shutterSpeeds: { acceptReporters: true, items: [
	{ text:'Bulb', value:'0x00000000' },
	{ text:'30"', value:'0x012C000A' },
	{ text:'25"', value:'0x00FA000A' },
	{ text:'20"', value:'0x00C8000A' },
	{ text:'15"', value:'0x0096000A' },
	{ text:'13"', value:'0x0082000A' },
	{ text:'10"', value:'0x0064000A' },
	{ text:'8"', value:'0x0050000A' },
	{ text:'6"', value:'0x003C000A' },
	{ text:'5"', value:'0x0032000A' },
	{ text:'4"', value:'0x0028000A' },
	{ text:'3.2"', value:'0x0020000A' },
	{ text:'2.5"', value:'0x0019000A' },
	{ text:'2"', value:'0x0014000A' },
	{ text:'1.6"', value:'0x0010000A' },
	{ text:'1.3"', value:'0x000D000A' },
	{ text:'1"', value:'0x000A000A' },
	{ text:'0.8"', value:'0x0008000A' },
	{ text:'0.6"', value:'0x0006000A' },
	{ text:'0.5"', value:'0x0005000A' },
	{ text:'0.4"', value:'0x0004000A' },
	{ text:'1/3', value:'0x00010003' },
	{ text:'1/4', value:'0x00010004' },
	{ text:'1/5', value:'0x00010005' },
	{ text:'1/6', value:'0x00010006' },
	{ text:'1/8', value:'0x00010008' },
	{ text:'1/10', value:'0x0001000A' },
	{ text:'1/13', value:'0x0001000D' },
	{ text:'1/15', value:'0x0001000F' },
	{ text:'1/20', value:'0x00010014' },
	{ text:'1/25', value:'0x00010019' },
	{ text:'1/30', value:'0x0001001E' },
	{ text:'1/40', value:'0x00010028' },
	{ text:'1/50', value:'0x00010032' },
	{ text:'1/60', value:'0x0001003C' },
	{ text:'1/80', value:'0x00010050' },
	{ text:'1/100', value:'0x00010064' },
	{ text:'1/125', value:'0x0001007D' },
	{ text:'1/160', value:'0x000100A0' },
	{ text:'1/200', value:'0x000100C8' },
	{ text:'1/250', value:'0x000100FA' },
	{ text:'1/320', value:'0x00010140' },
	{ text:'1/400', value:'0x00010190' },
	{ text:'1/500', value:'0x000101F4' },
	{ text:'1/640', value:'0x00010280' },
	{ text:'1/800', value:'0x00010320' },
	{ text:'1/1000', value:'0x000103E8' },
	{ text:'1/1250', value:'0x000104E2' },
	{ text:'1/1600', value:'0x00010640' },
	{ text:'1/2000', value:'0x000107D0' },
	{ text:'1/2500', value:'0x000109C4' },
	{ text:'1/3200', value:'0x00010C80' },
	{ text:'1/4000', value:'0x00010FA0' },
	{ text:'1/5000', value:'0x00011388' },
	{ text:'1/6400', value:'0x00011900' },
	{ text:'1/8000', value:'0x00011F40' },
]},

isos: { acceptReporters: true, items: [
	{ text:'ISO_AUTO', value:'0x00FFFFFF' },
	{ text:'ISO_40', value:'0x10000028' },
	{ text:'ISO_50', value:'0x10000032' },
	{ text:'ISO_64', value:'0x10000040' },
	{ text:'ISO_80', value:'0x00000050' },
	{ text:'ISO_100', value:'0x00000064' },
	{ text:'ISO_125', value:'0x0000007D' },
	{ text:'ISO_160', value:'0x000000A0' },
	{ text:'ISO_200', value:'0x000000C8' },
	{ text:'ISO_250', value:'0x000000FA' },
	{ text:'ISO_320', value:'0x00000140' },
	{ text:'ISO_400', value:'0x00000190' },
	{ text:'ISO_500', value:'0x000001F4' },
	{ text:'ISO_640', value:'0x00000280' },
	{ text:'ISO_800', value:'0x00000320' },
	{ text:'ISO_1000', value:'0x000003E8' },
	{ text:'ISO_1250', value:'0x000004E2' },
	{ text:'ISO_1600', value:'0x00000640' },
	{ text:'ISO_2000', value:'0x000007D0' },
	{ text:'ISO_2500', value:'0x000009C4' },
	{ text:'ISO_3200', value:'0x00000C80' },
	{ text:'ISO_4000', value:'0x00000FA0' },
	{ text:'ISO_5000', value:'0x00001388' },
	{ text:'ISO_6400', value:'0x00001900' },
	{ text:'ISO_8000', value:'0x00001F40' },
	{ text:'ISO_10000', value:'0x00002710' },
	{ text:'ISO_12800', value:'0x00003200' },
	{ text:'ISO_16000', value:'0x00003E80' },
	{ text:'ISO_20000', value:'0x00004E20' },
	{ text:'ISO_25600', value:'0x00006400' },
	{ text:'ISO_32000', value:'0x00007D00' },
	{ text:'ISO_40000', value:'0x00009C40' },
	{ text:'ISO_51200', value:'0x0000C800' },
	{ text:'ISO_64000', value:'0x0000FA00' },
	{ text:'ISO_80000', value:'0x00013880' },
	{ text:'ISO_102400', value:'0x00019000' },
	{ text:'ISO_128000', value:'0x1001F400' },
	{ text:'ISO_160000', value:'0x10027100' },
	{ text:'ISO_204800', value:'0x10032000' },
	{ text:'ISO_256000', value:'0x1003E800' },
	{ text:'ISO_320000', value:'0x1004E200' },
	{ text:'ISO_409600', value:'0x10064000' },
]},

paramItems: { acceptReporters: true, items: '_getParamItems'},
	  };
	}

	_getParamItems() { return this.paramItems_; }

	setConfig(args) {
		const ipadrs = args.ARG1.trim();
		let ipCamera = args.ARG2.trim();
		if(ipCamera == '') ipCamera = ipadrs;

		this.statusMessage.innerText = '';
		const connected = this.isConnected();

		const _this = this;
		return Promise.resolve().then(() => {
			_this.videoToggle({ARG1:'off'});
			return _this.disconnect();
		}).then(() => {

			if (_this.ipadrs != ipadrs || _this.ipCamera != ipCamera || _this.nameCamera != 'esp32camera') {

				_this.ipadrs = ipadrs;
				document.cookie = extName+'_ip=' + _this.ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';

				_this.ipCamera = ipCamera;
				document.cookie = 'Camera_ip=' + _this.ipCamera + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';

				_this.nameCamera = 'esp32camera';
				document.cookie = 'Camera_name=' + 'esp32camera' + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';

				if(_this.isConnected())
					_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_CONNECTED);
				else
					_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_DISCONNECTED);
				return ['Saved !', '保存しました'][_this._locale];
			}

			if(!connected) {
				return _this.open()
				.then(result => {
					//_this.videoToggle({ARG1:'on'});
					return result;
				}).catch(result => {
					return result;
				})
			}
		})
	}

	open() {
		const _this = this;
		return Promise.resolve().then(() => {
			if(_this.ws == null)
				return _this._openWs();
			return;
		})
	}

	videoToggle(args) {
		const state = args.ARG1;

		const stage = this._runtime.getTargetForStage();
		if(stage) stage.videoState = state;
		switch(state) {
		case 'off':
			this._runtime.ioDevices.video.disableVideo();
			break;
		case 'on':
			this._runtime.ioDevices.video.enableVideo();
			this._runtime.ioDevices.video.mirror = false;
			break;
		case 'on-flipped':
			this._runtime.ioDevices.video.enableVideo();
			this._runtime.ioDevices.video.mirror = true;
			break;
		}
	}

	afShutter(args) {
		this.afShutter2({ARG1:'500'});
	}

	afShutter2(args) {
		const delay = args.ARG1*1;
		this._runtime.ioDevices.video._renderPreviewFrame = null
	//	this.videoToggle({ARG1:'off'});

		let _skinId = this._runtime.ioDevices.video._skinId;
		let _drawable = this._runtime.ioDevices.video._drawable;
		if (_skinId === -1 && _drawable === -1) {
			_skinId = this._runtime.renderer.createBitmapSkin(new ImageData(WIDTH, HEIGHT), 1);
			_drawable = this._runtime.renderer.createDrawable(StageLayering.VIDEO_LAYER);
			this._runtime.renderer.updateDrawableSkinId(_drawable, _skinId);
			this._runtime.ioDevices.video._skinId = _skinId;
			this._runtime.ioDevices.video._drawable = _drawable;
		}
		this._runtime.renderer.updateDrawableEffect(_drawable, 'ghost', 0);
		this._runtime.renderer.updateDrawableVisible(_drawable, true);

		const _this = this;
		const sendObj = {cmd:'afShutter', delay:delay};
		return this.sendRecv(sendObj)
	//	.then(result => new Promise(resolve => setTimeout(() => {resolve(result);}, 30)))
		.then(result => {
			const canvas = _this._runtime.renderer._tempCanvas;
			const ctx = canvas.getContext('2d');

			const img = new Image();
			img.src = URL.createObjectURL(new Blob([result], {type: 'image/jpeg'}));
			img.onload = () => {
				canvas.width = WIDTH;
				canvas.height = HEIGHT;
				ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
				const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
				_this._runtime.renderer.updateBitmapSkin(_skinId, imageData, 1);
				_this._runtime.requestRedraw();
			};
		});
	}

	afHalfShutter(args) {
		const _this = this;
		const sendObj = {cmd:'afHalfShutter'};
		return this.sendRecv(sendObj)
		.then(result => {
			return result;
		})
	}

	updateProps() {
		const _this = this;
		let sendObj = {cmd:'getPropList'};
		return this.sendRecv(sendObj)
		.then(result => {
			_this.paramItems_ = [];
			Object.keys(result).forEach((key) => _this.paramItems_.push(key));
			_this.paramItems_.sort();

			let menus = [];
			_this.paramItems_.forEach((key) => menus.push([key,key]));

			let targetBlock = Blockly.getMainWorkspace().getBlockById(extName+'_operateParam');
			if(targetBlock) {
				targetBlock.childBlocks_[1].inputList[0].fieldRow[0].menuGenerator_ = menus;
			}

			targetBlock = Blockly.getMainWorkspace().getBlockById(extName+'_buttonState');
			if(targetBlock) {
				targetBlock.childBlocks_[1].inputList[0].fieldRow[0].menuGenerator_ = menus;
			}

			targetBlock = Blockly.getMainWorkspace().getBlockById(extName+'_setParam');
			if(targetBlock) {
				const paramCode = targetBlock.childBlocks_[0].inputList[0].fieldRow[0].getValue();
				let sendObj = {cmd:paramCode, ope:'info'};
				return this.sendRecv(sendObj)
				.then(result => {
					if(result.hasOwnProperty('list')) {
						menus = [];
						Object.keys(result.list).forEach((key) => {
							menus.push([result.list[key].text, result.list[key].text]);
						});
						targetBlock.childBlocks_[1].inputList[0].fieldRow[0].menuGenerator_ = menus;
						targetBlock.childBlocks_[1].inputList[0].fieldRow[0].setValue(menus[0][0]);
						return '"set ' + paramCode + '" has been updated.';
					} else if(result.hasOwnProperty('range')) {
						return paramCode + ':min=' + result.range.min + ' max=' + result.range.max + ' step=' + result.range.step;
					}
				})
			}
		//	return result;
		})
	}

	setParam(args) {
		const _this = this;
		const sendObj = {cmd:args.ARG1, ope:'set', text:args.ARG2};
		return this.sendRecv(sendObj)
		.then(result => {
			return result.current.text;
		})
	}

	operateParam(args) {
		const _this = this;
		let sendObj = {cmd:args.ARG2, ope:args.ARG1};
		if(sendObj.ope == 'set') {
			if(isNaN(args.ARG3))
				sendObj['text'] = args.ARG3.trim();
			else
				sendObj['value'] = Number(args.ARG3);
		}
		return this.sendRecv(sendObj)
		.then(result => {
			_this.incrementable[args.ARG2] = result.incrementable;
			if(sendObj.ope == 'info')
				return JSON.stringify(result);

			return result.current.text;
		})
	}

	buttonState(args) {
		const state = this.incrementable[args.ARG2];
		if(state == 'incdec') return true;
		if(state == 'inc' && args.ARG1 == 'inc') return true;
		if(state == 'dec' && args.ARG1 == 'dec') return true;
		return false;
	}

	setAperture(args) {
		const _this = this;
		const sendObj = {cmd:'setAperture', value:args.ARG1*1};
		return this.sendRecv(sendObj)
		.then(result => {
			return result;
		})
	}

	setShutterSpeed(args) {
		const _this = this;
		const sendObj = {cmd:'setShutterSpeed', value:args.ARG1*1};
		return this.sendRecv(sendObj)
		.then(result => {
			return result;
		})
	}

	setIso(args) {
		const _this = this;
		const sendObj = {cmd:'setIso', value:args.ARG1*1};
		return this.sendRecv(sendObj)
		.then(result => {
			return result;
		})
	}

	setSaveInfo(args) {
		const _this = this;
		const sendObj = {cmd:'setSaveInfo', prefix:args.ARG1};
		return this.sendRecv(sendObj)
		.then(result => {
			return result;
		})
	}

	// for connect menu ---------------------------

	isConnected() {
		let connected = false;
		if(this.ws) connected = true;
		return connected;
	}

	scan() {
		console.log('scan');
		if(this.ws) {
			this.ws.close();
			this.ws = null;
		}
		return this._openWs();
	}

	connect(id) {
		console.log('connect');
	}

	disconnect() {
		console.log('disconnect');
		const _this = this;
		if(this.ws) {
			this.ws.close();
			this.ws = null;
			this.wsResolve = null;
			this.busy = false;
		}
		this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);
	}

	// sendRecv --------------------------------------------

	sendRecv(sendObj) {
		this.statusMessage.innerText = '';

		const _this = this;
		return _this.open()
		.then(() => {
			return new Promise((resolve,reject) => {
				_this.wsResolve = resolve;
				const sendJson = JSON.stringify(sendObj);
				console.log('W:'+sendJson);	// debug
				_this.ws.send(sendJson);
			}).catch(() => {
				console.log('timeout');
				reject2();
			})
		})
	}

	// websocket --------------------------------------------

	_openWs() {
		if(this.ws) return;

		const _this = this;
		this.busy = false;
		this.cueue = [];
		this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);

		return new Promise((resolve,reject) => {
			let path = _this.ipadrs;
			if(path.indexOf(':') === -1) path += ':8080';

			const ws = new WebSocket('ws://'+path);
			ws.binaryType = 'arraybuffer';

			ws.onopen = function(e) {
				console.log('connected');
				_this.ws = ws;
				_this._runtime.emit(_this._runtime.constructor.PERIPHERAL_CONNECTED);
				resolve();
			}

			ws.onmessage = function(event) {
				let buf;
			//	console.log(event.data);
				if(typeof(event.data) == 'object') {
					buf = new Uint8Array(event.data);
				} else if(typeof(event.data) == 'string') {
					buf = JSON.parse(event.data);
					console.log('R:'+event.data);	// debug
				}
				_this.busy = false;
				if(_this.wsResolve) {
					_this.wsResolve(buf);
					_this.wsResolve = null;
				}
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

	_dumpBuf(data) {
		let str = '';
		for(let i = 0; i < data.length; i++) {
			str += ('0' + data[i].toString(16)).substr(-2) + ' ';
		}
		return str;
	}

}
//*
module.exports = Scratch3Blocks;
//*/


