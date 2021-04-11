const extName = 'microbit';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const comlib = require('../scratch3_tukurutch/comlib.js');

const blockIconURI = 'data:image/png;base64,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';

const UARTCommand = {
	CMD_DISPLAY_TEXT: 1,
	CMD_DISPLAY_LED: 2,
	CMD_GET_DATA: 3,
	CMD_GET_TILT: 4,
};

const BLECommand = {
	CMD_DISPLAY_TEXT: 0x81,
	CMD_DISPLAY_LED: 0x82
};

const BLETimeout = 4500;
const BLESendInterval = 100;
const BLEDataStoppedError = 'micro:bit extension stopped receiving data';

const BLEUUID = {
	service: 0xf005,
	rxChar:'5261da01-fa7e-42ab-850b-7c80220097cc',
	txChar:'5261da02-fa7e-42ab-850b-7c80220097cc'
};

const EVENT = {
	PORT0		: (1<<0),
	PORT1		: (1<<1),
	PORT2		: (1<<2),

	BUTTONA		: (1<<3),
	BUTTONB		: (1<<4),
	BUTTONANY	: (0b11<<3),

	MOVED		: (1<<5),
	SHAKEN		: (1<<6),
};

class MicroBit {
	constructor (runtime, extensionId, gotData) {
		this._runtime = runtime;
		this._extensionId = extensionId;
		this._gotData = gotData;
		this.ifType = 'UART';

		this._runtime.registerPeripheralExtension(extensionId, this);

		this._ble = null;
		this._timeoutID = null;
		this._busy = false;
		this._busyTimeoutID = null;

		this.reset = this.reset.bind(this);
		this.onConnect = this.onConnect.bind(this);
		this.onMessage = this.onMessage.bind(this);
	}

	// for runtime
	scan () {
		if (this._ble) this._ble.disconnect();

		this._ble = new BLE(this._runtime, this._extensionId, {
			filters: [{services: [BLEUUID.service]}]
		}, this.onConnect, this.reset);
	}

	connect (id) {
		if (this._ble) this._ble.connectPeripheral(id);
	}

	disconnect () {
		if (this._ble) this._ble.disconnect();
		this.reset();
	}

	isConnected () {
		if (this._ble) return this._ble.isConnected();
		return false;
	}

	// for BLE
	reset () {
		if (this._timeoutID) {
			clearTimeout(this._timeoutID);
			this._timeoutID = null;
		}
	}

	onConnect () {
		this._ble.read(BLEUUID.service, BLEUUID.rxChar, true, this.onMessage);
		this._timeoutID = setTimeout(
			() => this._ble.handleDisconnectError(BLEDataStoppedError),
			BLETimeout
		);
	}

	onMessage (base64) {
		this._gotData(Base64Util.base64ToUint8Array(base64));

		// cancel disconnect timeout and start a new one
		clearTimeout(this._timeoutID);
		this._timeoutID = setTimeout(
			() => this._ble.handleDisconnectError(BLEDataStoppedError),
			BLETimeout
		);
	}

	// public
	send (command, message) {
		if (!this.isConnected()) return;
		if (this._busy) return;

		this._busy = true;
		this._busyTimeoutID = setTimeout(() => {
			this._busy = false;
		}, 5000);

		const output = new Uint8Array(message.length + 1);
		output[0] = command;
		for (let i = 0; i < message.length; i++)
			output[i + 1] = message[i];
		const data = Base64Util.uint8ArrayToBase64(output);

		this._ble.write(BLEUUID.service, BLEUUID.txChar, data, 'base64', true)
		.then(() => {
			this._busy = false;
			clearTimeout(this._busyTimeoutID);
		});
	}
}


const TILT_THRESHOLD = 15.0;

class Scratch3Blocks {

	constructor (runtime) {
		this.digitalPorts = ['0','1','2','3','4','5','6','7','8','9','10','11','13','14','15','16',];
	//	this.digitalPorts = ['2','3','4','5','6','7','8','9','10','11','12','13',{text:'A0',value:14},{text:'A1',value:15},{text:'A2',value:16},{text:'A3',value:17},{text:'A4',value:18},{text:'A5',value:19},];
		this.analogPorts = ['0','1','2','3','4','10',];

		this.runtime = runtime;
		runtime.dev = this;
		this.ifType = 'UART';

		this.gotData = this.gotData.bind(this);
		this._microbit = new MicroBit(this.runtime, extName, this.gotData);
		this.comlib = new comlib(extName, false);

		this.events = 0;
		this.button = 0;
		this.tiltX = 0;
		this.tiltY = 0;
		this.updatedTime = 0;
	}

	getInfo () {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}
		this.comlib.setLocale(this._locale);
		[this.ifType, this.ipadrs] = this.comlib.getConfig();
		if(this.ifType != 'UART') this.comlib.setConfig('UART', '192.168.1.xx');

		this.comlib._openUart();
		this.intervalFunc = this.intervalFunc.bind(this);
		this._intervalId = setInterval(this.intervalFunc, 100);

		return {
			id:extName,
			name:'micro:bit',
			blockIconURI: blockIconURI,
	//		showStatusButton: true,
			blocks: [
				{
					opcode:'whenButtonPressed',
					text: formatMessage({id:'microbit.whenButtonPressed', default:'when [BTN] button pressed'}),
					blockType: BlockType.HAT,
					arguments: {
						BTN: {type:ArgumentType.STRING, menu:'buttons', defaultValue:'A'}
					}
				},
				{
					opcode:'isButtonPressed',
					text: formatMessage({id:'microbit.isButtonPressed', default:'[BTN] button pressed?'}),
					blockType: BlockType.BOOLEAN,
					arguments: {
						BTN: {type:ArgumentType.STRING, menu:'buttons', defaultValue:'A'}
					}
				},
				'---',
				{
					opcode:'whenGesture',
					text: formatMessage({id:'microbit.whenGesture', default:'when [GESTURE]'}),
					blockType: BlockType.HAT,
					arguments: {
						GESTURE: { type:ArgumentType.STRING, menu:'gestures', defaultValue:'moved' }
					}
				},
				'---',
				{
					opcode:'displaySymbol',
					text: formatMessage({id:'microbit.displaySymbol', default:'display [MATRIX]'}),
					blockType: BlockType.COMMAND,
					arguments: {
						MATRIX: { type:ArgumentType.MATRIX, defaultValue:'0101010101100010101000100'}
					}
				},
				{
					opcode:'displayText',
					text: formatMessage({id:'microbit.displayText', default:'display text [TEXT]'}),
					blockType: BlockType.COMMAND,
					arguments: {
						TEXT: { type:ArgumentType.STRING, defaultValue:'Hello!'}
					}
				},
				{
					opcode:'displayClear',
					text: formatMessage({id:'microbit.clearDisplay', default:'clear display'}),
					blockType: BlockType.COMMAND
				},
				'---',
				{
					opcode:'whenTilted',
					text: formatMessage({id:'microbit.whenTilted', default:'when tilted [DIRECTION]'}),
					blockType: BlockType.HAT,
					arguments: {
						DIRECTION: {type:ArgumentType.STRING, menu:'tiltDirectionAny', defaultValue:'any' }
					}
				},
				{
					opcode:'isTilted',
					text: formatMessage({id:'microbit.isTilted', default:'tilted [DIRECTION]?'}),
					blockType: BlockType.BOOLEAN,
					arguments: {
						DIRECTION: {type:ArgumentType.STRING, menu:'tiltDirectionAny', defaultValue:'any' }
					}
				},
				{
					opcode:'getTiltAngle',
					text: formatMessage({id:'microbit.tiltAngle', default:'tilt angle [DIRECTION]'}),
					blockType: BlockType.REPORTER,
					arguments: {
						DIRECTION: {type:ArgumentType.STRING, menu:'tiltDirection', defaultValue:'front'}
					}
				},
				'---',
				{
					opcode:'whenPinConnected',
					text: formatMessage({id:'microbit.whenPinConnected', default:'when pin [PIN] connected'}),
					blockType: BlockType.HAT,
					arguments: {
						PIN: {type:ArgumentType.STRING, menu:'touchPins', defaultValue:'0'}
					}
				}
			],
			menus: {
				buttons: {
					acceptReporters: true,
					items: [
						{ text:'A', value:'A' },
						{ text:'B', value:'B' },
						{ text: formatMessage({id:'microbit.buttonsMenu.any', default:'any'}), value:'any' },
					]
				},
				gestures: {
					acceptReporters: true,
					items: [
						{ text: formatMessage({id:'microbit.gesturesMenu.moved', default:'moved'}), value:'moved' },
						{ text: formatMessage({id:'microbit.gesturesMenu.shaken', default:'shaken'}), value:'shaken' },
						{ text: formatMessage({id:'microbit.gesturesMenu.jumped', default:'jumped'}), value:'jumped' },
					]
				},
				pinState: {
					acceptReporters: true,
					items: [
						{ text: formatMessage({id:'microbit.pinStateMenu.on', default:'on'}), value:'on' },
						{ text: formatMessage({id:'microbit.pinStateMenu.off', default:'off'}), value:'off' },
					]
				},
				tiltDirection: {
					acceptReporters: true,
					items: [
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.front', default:'front'}), value:'front' },
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.back', default:'back'}), value:'back' },
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.left', default:'left'}), value:'left' },
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.right', default:'right'}), value:'right'},
					]
				},
				tiltDirectionAny: {
					acceptReporters: true,
					items: [
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.front', default:'front'}), value:'front' },
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.back', default:'back'}), value:'back' },
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.left', default:'left'}), value:'left' },
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.right', default:'right'}), value:'right'},
						{ text: formatMessage({id:'microbit.tiltDirectionMenu.any', default:'any'}), value:'any'},
					]
				},
				touchPins: {
					acceptReporters: true,
					items: ['0', '1', '2']
				}
			}
		};
	}

	intervalFunc() {
		if(this.comlib.port && !this.comlib.busy) {
			const _this = this;
			let ret = _this.comlib.sendRecv(UARTCommand.CMD_GET_DATA, {}, {});
			if(!(ret instanceof Promise)) return ret;

			return ret.then(data => {
				if(data.length >= 8) _this.gotData(data);
			});
		}
	}

	whenButtonPressed(args) {
		let ret = 0;
		switch(args.BTN) {
		case 'A':   ret = this.events & EVENT.BUTTONA; this.events &= ~EVENT.BUTTONA; break;
		case 'B':   ret = this.events & EVENT.BUTTONB; this.events &= ~EVENT.BUTTONB; break;
		case 'any': ret = this.events & EVENT.BUTTONANY; this.events &= ~EVENT.BUTTONANY; break;
		}
		return ret ? true:false;
	}

	isButtonPressed(args) {
		let ret = 0;
		switch(args.BTN) {
		case 'A':   ret = this.button &(1<<0); break;
		case 'B':   ret = this.button &(1<<1); break;
		case 'any': ret = this.button; break;
		}
		return ret ? true:false;
	}

	whenGesture (args) {
		let ret = 0;
		switch(args.GESTURE) {
		case 'shaken': ret = this.events & EVENT.SHAKEN; this.events &= ~EVENT.SHAKEN; break;
	//	case 'jumped': ret = this.events & EVENT.JUMPED; this.events &= ~EVENT.JUMPED; break;
		case 'moved':  ret = this.events & EVENT.MOVED; this.events &= ~EVENT.MOVED; break;
		}
		return ret;
	}

	displayText (args) {
		const text = args.TEXT.substring(0, 19);
		if (text.length <= 0) return "";

		if(this.ifType == 'UART') {
			return this.comlib.sendRecv(UARTCommand.CMD_DISPLAY_TEXT, {ARG1:{type2:'s'}}, {ARG1:text});
		} else {
			const output = new Uint8Array(text.length);
			for (let i = 0; i < text.length; i++)
				output[i] = text.charCodeAt(i);

			this._microbit.send(BLECommand.CMD_DISPLAY_TEXT, output);
			return new Promise(resolve => {
				const yieldDelay = 120 * ((6 * text.length) + 6);
				// scroll delay of 120ms, 6px for each character, 1px before the string, and 5px after the string
				setTimeout(() => {
					resolve();
				}, yieldDelay);
			});
		}
	}

	displaySymbol (args) {
		// 2進数計算 '0101010101100010101000100' -> 4546AA
		const symbol = args.MATRIX.replace(/\s/g, '');
		const reducer = function(accumulator, c, index) {
			const value = (c === '0') ? accumulator : accumulator + Math.pow(2, index);
			return value;
		};
		const hex = symbol.split('').reduce(reducer, 0);
		if(hex === null) return;

		if(this.ifType == 'UART') {
			return this.comlib.sendRecv(UARTCommand.CMD_DISPLAY_LED, {ARG1:{type2:'L'}}, {ARG1:hex});
		} else {
			let ledMatrixState = new Uint8Array(5);
			ledMatrixState[0] = hex & 0x1F;
			ledMatrixState[1] = (hex >> 5) & 0x1F;
			ledMatrixState[2] = (hex >> 10) & 0x1F;
			ledMatrixState[3] = (hex >> 15) & 0x1F;
			ledMatrixState[4] = (hex >> 20) & 0x1F;
			this._microbit.send(BLECommand.CMD_DISPLAY_LED, ledMatrixState);
			return new Promise(resolve => {
				setTimeout(() => {
					resolve();
				}, BLESendInterval);
			});
		}
	}

	displayClear () {
		if(this.ifType == 'UART') {
			return this.comlib.sendRecv(UARTCommand.CMD_DISPLAY_LED, {ARG1:{type2:'L'}}, {ARG1:0x00000000});
		} else {
			this._microbit.send(BLECommand.CMD_DISPLAY_LED, new Uint8Array([0,0,0,0,0]));
			return new Promise(resolve => {
				setTimeout(() => {
					resolve();
				}, BLESendInterval);
			});
		}
	}

	whenTilted (args) {
		return this._isTilted(args.DIRECTION, dontUpdate=true);
	}

	isTilted (args) {
		return this._isTilted(args.DIRECTION);
	}

	_isTilted (direction, dontUpdate=false) {
		switch (direction) {
		case 'any':
			return (Math.abs(this.tiltX/10) >= TILT_THRESHOLD) ||
				   (Math.abs(this.tiltY/10) >= TILT_THRESHOLD);
		default:
			return this._getTiltAngle(direction, dontUpdate) >= TILT_THRESHOLD;
		}
	}

	getTiltAngle (args) {
		return this._getTiltAngle(args.DIRECTION);
	}

	_getTiltAngle (direction, dontUpdate=false) {
		if(!dontUpdate && (performance.now()-this.updatedTime) > 20 && this.comlib.cueue.length == 0) {
			let xy = (direction == 'front' || direction == 'back') ? 1: 0;
			let ret = this.comlib.sendRecv(UARTCommand.CMD_GET_TILT, {ARG1:{type2:'B'}}, {ARG1:xy});
			if(!(ret instanceof Promise)) {
				this.updatedTime = performance.now();
				return this._getTiltAngle(direction, true);
			}

			const _this = this;
			return ret.then(data => {
				_this.updatedTime = performance.now();
				if(xy == 1) _this.tiltY = data;
				else        _this.tiltX = data;
				return _this._getTiltAngle(direction, true);
			})
		}

		let angle = 0;
		switch (direction) {
		case 'front': angle = Math.round(-this.tiltY/10); break;
		case 'back':  angle = Math.round( this.tiltY/10); break;
		case 'left':  angle = Math.round(-this.tiltX/10); break;
		case 'right': angle = Math.round( this.tiltX/10); break;
		default:      console.log(`Unknown tilt direction in _getTiltAngle: ${direction}`); break;
		}
		return angle;
	}

	whenPinConnected (args) {
		let ret = 0;
		switch(args.PIN) {
		case '0': ret = this.events & EVENT.PORT0; this.events &= ~EVENT.PORT0; break;
		case '1': ret = this.events & EVENT.PORT1; this.events &= ~EVENT.PORT1; break;
		case '2': ret = this.events & EVENT.PORT2; this.events &= ~EVENT.PORT2; break;
		}
		return ret ? true:false;
	}

	gotData(data) {
		this.events |= data[0] | (data[1]<<8);
		this.button = data[2];

		this.tiltX = data[4] | (data[5]<<8);
		if (this.tiltX > (1<<15)) this.tiltX -= (1<<16);

		this.tiltY = data[6] | (data[7]<<8);
		if (this.tiltY > (1<<15)) this.tiltY -= (1<<16);
		this.updatedTime = performance.now();
	}
}

module.exports = Scratch3Blocks;
