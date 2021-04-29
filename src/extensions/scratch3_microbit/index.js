const extName = 'microbit';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const comlib = require('../scratch3_tukurutch/comlib.js');

const IconURI = require('./microbit.png');

const CMD = {
	DISPLAY_TEXT: 1,
	DISPLAY_LED: 2,
	GET_DATA: 3,
	GET_TILT: 4,
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

const TILT_THRESHOLD = 15.0;

class Scratch3Blocks {

	constructor(runtime) {
		this.digitalPorts = ['0','1','2','3','4','5','6','7','8','9','10','11','13','14','15','16',];
	//	this.digitalPorts = ['2','3','4','5','6','7','8','9','10','11','12','13',{text:'A0',value:14},{text:'A1',value:15},{text:'A2',value:16},{text:'A3',value:17},{text:'A4',value:18},{text:'A5',value:19},];
		this.analogPorts = ['0','1','2','3','4','10',];

		runtime.dev = this;

		this.gotData = this.gotData.bind(this);
		this.comlib = new comlib(runtime, extName, false);

		this.events = 0;
		this.button = 0;
		this.tiltX = 0;
		this.tiltY = 0;
		this.updatedTime = 0;
	}

	getInfo() {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}
		this.comlib.setLocale(this._locale);

	//	this.comlib._openUart();	// debug
		this.intervalFunc = this.intervalFunc.bind(this);
		this._intervalId = setInterval(this.intervalFunc, 100);	// debug

		return {
			id:extName,
			name:'micro:bit',
			menuIconURI: IconURI,
			showStatusButton: true,
			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'setConfig',
				text: ['I/F type','接続方法'][this._locale]+'[ARG1] IP=[ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: this.comlib.ifType, menu: 'ifType' },
					ARG2: { type: ArgumentType.STRING, defaultValue: this.comlib.ipadrs},
				}},
				{blockType: BlockType.COMMAND, opcode:'test',
				text: 'test [ARG1]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 0 },
				}},

				{blockType: BlockType.HAT, opcode:'whenButtonPressed',
				text: formatMessage({id:'microbit.whenButtonPressed', default:'when [BTN] button pressed'}),
				arguments: {
					BTN: {type:ArgumentType.STRING, menu:'buttons', defaultValue:'A'}
				}},
				{blockType: BlockType.BOOLEAN, opcode:'isButtonPressed',
				text: formatMessage({id:'microbit.isButtonPressed', default:'[BTN] button pressed?'}),
				arguments: {
					BTN: {type:ArgumentType.STRING, menu:'buttons', defaultValue:'A'}
				}},
				'---',
				{blockType: BlockType.HAT, opcode:'whenGesture',
				text: formatMessage({id:'microbit.whenGesture', default:'when [GESTURE]'}),
				arguments: {
					GESTURE: { type:ArgumentType.STRING, menu:'gestures', defaultValue:'moved' }
				}},
				'---',
				{blockType: BlockType.COMMAND, opcode:'displaySymbol',
				text: formatMessage({id:'microbit.displaySymbol', default:'display [MATRIX]'}),
				arguments: {
					MATRIX: { type:ArgumentType.MATRIX, defaultValue:'0101010101100010101000100'}
				}},
				{blockType: BlockType.COMMAND, opcode:'displayText',
				text: formatMessage({id:'microbit.displayText', default:'display text [TEXT]'}),
				arguments: {
					TEXT: { type:ArgumentType.STRING, defaultValue:'Hello!'}
				}},
				{blockType: BlockType.COMMAND, opcode:'displayClear',
				text: formatMessage({id:'microbit.clearDisplay', default:'clear display'}),
				},
				'---',
				{blockType: BlockType.HAT, opcode:'whenTilted',
				text: formatMessage({id:'microbit.whenTilted', default:'when tilted [DIRECTION]'}),
				arguments: {
					DIRECTION: {type:ArgumentType.STRING, menu:'tiltDirectionAny', defaultValue:'any' }
				}},
				{blockType: BlockType.BOOLEAN, opcode:'isTilted',
				text: formatMessage({id:'microbit.isTilted', default:'tilted [DIRECTION]?'}),
				arguments: {
					DIRECTION: {type:ArgumentType.STRING, menu:'tiltDirectionAny', defaultValue:'any' }
				}},
				{blockType: BlockType.REPORTER, opcode:'getTiltAngle',
				text: formatMessage({id:'microbit.tiltAngle', default:'tilt angle [DIRECTION]'}),
				arguments: {
					DIRECTION: {type:ArgumentType.STRING, menu:'tiltDirection', defaultValue:'front'}
				}},
				'---',
				{blockType: BlockType.HAT, opcode:'whenPinConnected',
				text: formatMessage({id:'microbit.whenPinConnected', default:'when pin [PIN] connected'}),
				arguments: {
					PIN: {type:ArgumentType.STRING, menu:'touchPins', defaultValue:'0'}
				}},
			],
			menus: {
				ifType: { acceptReporters: true, items: [
					{ text: 'USB', value: 'UART' },
					{ text: 'BLE', value: 'BLE' },
				]},
				buttons: { acceptReporters: true, items: [
					{ text:'A', value:'A' },
					{ text:'B', value:'B' },
					{ text: formatMessage({id:'microbit.buttonsMenu.any', default:'any'}), value:'any' },
				]},
				gestures: { acceptReporters: true, items: [
					{ text: formatMessage({id:'microbit.gesturesMenu.moved', default:'moved'}), value:'moved' },
					{ text: formatMessage({id:'microbit.gesturesMenu.shaken', default:'shaken'}), value:'shaken' },
					{ text: formatMessage({id:'microbit.gesturesMenu.jumped', default:'jumped'}), value:'jumped' },
				]},
				pinState: { acceptReporters: true, items: [
					{ text: formatMessage({id:'microbit.pinStateMenu.on', default:'on'}), value:'on' },
					{ text: formatMessage({id:'microbit.pinStateMenu.off', default:'off'}), value:'off' },
				]},
				tiltDirection: { acceptReporters: true, items: [
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.front', default:'front'}), value:'front' },
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.back', default:'back'}), value:'back' },
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.left', default:'left'}), value:'left' },
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.right', default:'right'}), value:'right'},
				]},
				tiltDirectionAny: { acceptReporters: true, items: [
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.front', default:'front'}), value:'front' },
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.back', default:'back'}), value:'back' },
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.left', default:'left'}), value:'left' },
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.right', default:'right'}), value:'right'},
					{ text: formatMessage({id:'microbit.tiltDirectionMenu.any', default:'any'}), value:'any'},
				]},
				touchPins: { acceptReporters: true, items: ['0', '1', '2']
				}
			}
		};
	}

	test(args) {
		this.comlib.send([0xff,0x55,0x05,0x02,0xff,0xff,0xff,0x01]);
	//	this._microbit.send([args.ARG1*1, 0x00]);
	}

	intervalFunc() {
		if(this.comlib.port && !this.comlib.busy) {
			const _this = this;
			let ret = _this.comlib.sendRecv(CMD.GET_DATA, {}, {});
			if(!(ret instanceof Promise)) return ret;

			return ret.then(data => {
				if(data.length >= 8) _this.gotData(data);
			});
		}
	}

	setConfig(args) {
		if(this.server=='http') return ['please access via https://','https:// でアクセスして下さい'][this._locale];

		return this.comlib.setConfig(args.ARG1, args.ARG2);
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

	whenGesture(args) {
		let ret = 0;
		switch(args.GESTURE) {
		case 'shaken': ret = this.events & EVENT.SHAKEN; this.events &= ~EVENT.SHAKEN; break;
	//	case 'jumped': ret = this.events & EVENT.JUMPED; this.events &= ~EVENT.JUMPED; break;
		case 'moved':  ret = this.events & EVENT.MOVED; this.events &= ~EVENT.MOVED; break;
		}
		return ret;
	}

	displayText(args) {
		const text = args.TEXT.substring(0, 19);
		if(text.length <= 0) return '';

		return this.comlib.sendRecv(CMD.DISPLAY_TEXT, {ARG1:{type2:'s'}}, {ARG1:text});
	}

	displaySymbol(args) {
		// 2進数計算 '0101010101100010101000100' -> 4546AA
		const symbol = args.MATRIX.replace(/\s/g, '');
		const reducer = function(accumulator, c, index) {
			const value = (c === '0') ? accumulator : accumulator + Math.pow(2, index);
			return value;
		};
		const hex = symbol.split('').reduce(reducer, 0);
		if(hex === null) return;

		return this.comlib.sendRecv(CMD.DISPLAY_LED, {ARG1:{type2:'L'}}, {ARG1:hex});
	}

	displayClear() {
		return this.comlib.sendRecv(CMD.DISPLAY_LED, {ARG1:{type2:'L'}}, {ARG1:0x00000000});
	}

	whenTilted(args) {
		return this._isTilted(args.DIRECTION, dontUpdate=true);
	}

	isTilted(args) {
		return this._isTilted(args.DIRECTION);
	}

	_isTilted(direction, dontUpdate=false) {
		switch(direction) {
		case 'any':
			return (Math.abs(this.tiltX/10) >= TILT_THRESHOLD) ||
				   (Math.abs(this.tiltY/10) >= TILT_THRESHOLD);
		default:
			return this._getTiltAngle(direction, dontUpdate) >= TILT_THRESHOLD;
		}
	}

	getTiltAngle(args) {
		return this._getTiltAngle(args.DIRECTION);
	}

	_getTiltAngle(direction, dontUpdate=false) {
		if(!dontUpdate && (performance.now()-this.updatedTime) > 20 && (this.comlib.cueue.length == 0 || !this.comlib.port)) {
			let xy = (direction == 'front' || direction == 'back') ? 1: 0;
			let ret = this.comlib.sendRecv(CMD.GET_TILT, {ARG1:{type2:'B'}}, {ARG1:xy});
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
		switch(direction) {
		case 'front': angle = Math.round(-this.tiltY/10); break;
		case 'back':  angle = Math.round( this.tiltY/10); break;
		case 'left':  angle = Math.round(-this.tiltX/10); break;
		case 'right': angle = Math.round( this.tiltX/10); break;
		default:      console.log(`Unknown tilt direction in _getTiltAngle: ${direction}`); break;
		}
		return angle;
	}

	whenPinConnected(args) {
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
		if(this.tiltX > (1<<15)) this.tiltX -= (1<<16);

		this.tiltY = data[6] | (data[7]<<8);
		if(this.tiltY > (1<<15)) this.tiltY -= (1<<16);
		this.updatedTime = performance.now();
	}
}

module.exports = Scratch3Blocks;
