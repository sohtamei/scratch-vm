var extName = 'genericIO';

const IconURI = 'data:image/png;base64,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';
const Color = require('../../util/color');
//*
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
class Scratch3Blocks {
//*/
/*
var ext = class {
*/
	constructor(runtime) {
		this.runtime = runtime;
		this.humidity = 0;
		this.port = [21,22];

		this.neoPixels = [];
		this.neoPixelPort = -1;
	}

	getInfo() {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}

		let digitalPorts;
		let digitalPortArg;
		if(this.runtime.hasOwnProperty('dev') && this.runtime.dev.hasOwnProperty('digitalPorts')) {
			digitalPorts = this.runtime.dev.digitalPorts;
			digitalPortArg = {type: ArgumentType.STRING, defaultValue:this.runtime.dev.digitalPorts[0], menu:'digitalPorts'};
		} else {
			digitalPorts = [];
			digitalPortArg = {type: ArgumentType.NUMBER, defaultValue:1};
		}

		let analogPorts;
		let analogPortArg;
		if(this.runtime.hasOwnProperty('dev') && this.runtime.dev.hasOwnProperty('analogPorts')) {
			analogPorts = this.runtime.dev.analogPorts;
			analogPortArg = {type: ArgumentType.STRING, defaultValue:this.runtime.dev.analogPorts[0], menu:'analogPorts'};
		} else {
			analogPorts = [];
			analogPortArg = {type: ArgumentType.NUMBER, defaultValue:1};
		}

		return {
			id: extName,
			name: extName,
			menuIconURI: IconURI,

			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'digiWrite', text: '［GPIO］output port[ARG1] level[ARG2]', arguments: {
					ARG1: digitalPortArg,
					ARG2: { type: ArgumentType.STRING, defaultValue:'1', menu: 'onoff' },
				}},

				{blockType: BlockType.REPORTER, opcode: 'digiRead', text: '［GPIO］input port[ARG1]', arguments: {
					ARG1: digitalPortArg,
				}},

				{blockType: BlockType.REPORTER, opcode: 'anaRead', text: '［AD］port[ARG1] average[ARG2]［mV］', arguments: {
					ARG1: analogPortArg,
					ARG2: { type: ArgumentType.NUMBER, defaultValue:10 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'tone', text: '［BEEP］port[ARG1] note[ARG2] [ARG3]', arguments: {
					ARG1: digitalPortArg,
				//	ARG2: { type: ArgumentType.NOTE, defaultValue:24},
				//	ARG3: { type: ArgumentType.NUMBER, defaultValue:500 },
					ARG2: { type: ArgumentType.STRING, defaultValue:'262', menu:'noteJ2'},
					ARG3: { type: ArgumentType.STRING, defaultValue:'500', menu:'beats' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setPwms', text: '［PWM］port[ARG1] level[ARG2]', arguments: {
					ARG1: digitalPortArg,
					ARG2: { type: ArgumentType.NUMBER, defaultValue:2048 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setServo180', text: '［PWM］servo port[ARG1] angle[ARG2]', arguments: {
					ARG1: digitalPortArg,
					ARG2: { type: ArgumentType.NUMBER, defaultValue:90 },
				}},

				'---',
				{blockType: BlockType.COMMAND, opcode: 'wire_write', text: '［I2C］send adrs[ARG1] data[ARG2] (hex)', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'1F' },
					ARG2: { type: ArgumentType.STRING, defaultValue:'1A2B3C' },
				}},

				{blockType: BlockType.REPORTER, opcode: 'wire_read', text: '［I2C］receive adrs[ARG1] [ARG2]bytes', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'1F' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:1 },
				}},

				{blockType: BlockType.REPORTER, opcode: 'wire_writeRead', text: '［I2C］send&receive adrs[ARG1] data[ARG2] [ARG3]bytes', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'1F' },
					ARG2: { type: ArgumentType.STRING, defaultValue:'1A2B3C' },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:1 },
				}},

				{blockType: BlockType.REPORTER, opcode: 'wire_scan', text: '［I2C］scan devices', disableMonitor: true, arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'wire_port', text: '［I2C］port [ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'21_22', menu: 'i2cPort' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'wire_port2', text: '［I2C］port [ARG1] [ARG2]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:15 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:12 },
				}},

				'---',
				{blockType: BlockType.COMMAND, opcode: 'setNeoPixel', text: '［neopixel］port[ARG1] num[ARG2] color[ARG3]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:1 },
					ARG3: { type: ArgumentType.COLOR, defaultValue:'#ff0000' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setNeoPixel8', text: '［neopixel］port[ARG1] num[ARG2] color[ARG3] [ARG4] [ARG5] [ARG6] [ARG7] [ARG8] [ARG9] [ARG10]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:8 },
					ARG3: { type: ArgumentType.COLOR, defaultValue:'#ff0000' },
					ARG4: { type: ArgumentType.COLOR, defaultValue:'#ffff00' },
					ARG5: { type: ArgumentType.COLOR, defaultValue:'#00ff00' },
					ARG6: { type: ArgumentType.COLOR, defaultValue:'#00ffff' },
					ARG7: { type: ArgumentType.COLOR, defaultValue:'#0000ff' },
					ARG8: { type: ArgumentType.COLOR, defaultValue:'#ff00ff' },
					ARG9: { type: ArgumentType.COLOR, defaultValue:'#ffffff' },
					ARG10: { type: ArgumentType.COLOR, defaultValue:'#000000' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'shiftNeoPixel', text: '［neopixel］shift[ARG1] color[ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'forward', menu: 'neoPixelDir' },
					ARG2: { type: ArgumentType.COLOR, defaultValue:'#ff0000' },
				}},

				{blockType: BlockType.REPORTER, opcode: 'colorRGB', text: 'R[ARG1] G[ARG2] B[ARG3]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:255 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:255 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:255 },
				}},

				{blockType: BlockType.REPORTER, opcode: 'colorHSV', text: 'hue[ARG1] sat[ARG2] val[ARG3]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:100 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:100 },
				}},

				'---',
				{blockType: BlockType.REPORTER, opcode: 'hex2dec', text: '［UTIL］hex[ARG1] (up[ARG2] low[ARG3]) to number', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'FF0001' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:2 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:1 },
				}},
			],

			menus: {
				onoff: { acceptReporters: true, items: ['1','0'] },

				i2cPort: { acceptReporters: true, items: [
				{ text: 'dA4 cA5 uno', value: '18_19', },
				{ text: 'd20 c19 microbit', value: '20_19', },
				{ text: 'd0 c1 microbit', value: '0_1', },
				{ text: 'd21 c22 ESP32 default', value: '21_22', },
				{ text: 'd8 c9 ESP32S3 default', value: '8_9', },
				{ text: 'd32 c33 M5StickC', value: '32_33', },
				{ text: 'd26 c32 M5Atom', value: '26_32', },
				{ text: 'd4 c13 M5Camera', value: '4_13', },
				{ text: 'd0 c26 M5StickC Hat', value: '0_26', },
				{ text: 'd26 c27 QuadCrawlerAI', value: '26_27', },
				{ text: 'd4 c5 RPi pico', value: '4_5', },
				]},
				digitalPorts: { acceptReporters: true, items: digitalPorts },
				analogPorts: { acceptReporters: true, items: analogPorts },

				beats: { acceptReporters: true, items: [
				{ text: ['Half','2分音符'][this._locale], value: '500' },
				{ text: ['Quarter','4分音符'][this._locale], value: '250' },
				{ text: ['Eighth','8分音符'][this._locale], value: '125' },
				{ text: ['Whole','全音符'][this._locale], value: '1000' },
				{ text: ['Double','倍全音符'][this._locale], value: '2000' },
				]},

				noteJ2: { acceptReporters: true, items: [
				{ text: ['C4','ド4'][this._locale], value: '262' },
				{ text: ['D4','レ4'][this._locale], value: '294' },
				{ text: ['E4','ミ4'][this._locale], value: '330' },
				{ text: ['F4','ファ4'][this._locale], value: '349' },
				{ text: ['G4','ソ4'][this._locale], value: '392' },
				{ text: ['A4','ラ4'][this._locale], value: '440' },
				{ text: ['B4','シ4'][this._locale], value: '494' },
				{ text: ['C5','ド5'][this._locale], value: '523' },
				{ text: ['D5','レ5'][this._locale], value: '587' },
				{ text: ['E5','ミ5'][this._locale], value: '659' },
				{ text: ['F5','ファ5'][this._locale], value: '698' },
				{ text: ['G5','ソ5'][this._locale], value: '784' },
				{ text: ['A5','ラ5'][this._locale], value: '880' },
				{ text: ['B5','シ5'][this._locale], value: '988' },
				]},

				neoPixelDir: { acceptReporters: true, items: ['forward','reverse'] },
			},
		};
	}

	wire_port(args) {
		this.port = args.ARG1.split('_');
	}

	wire_port2(args) {
		this.port = [Number(args.ARG1),Number(args.ARG2)];
	}

	wire_write(args) {
		let adrs = parseInt(args.ARG1, 16);

		if(args.ARG2.length & 1) args.ARG2 = '0'+args.ARG2;
		let size = args.ARG2.length/2;
		let buf = new Uint8Array(size);
		for(let i = 0; i < size; i++)
			buf[i] = parseInt(args.ARG2.slice(i*2,i*2+2),16);

		const _this = this;
		return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
			.then(() => _this.runtime.dev.comlib.wire_write(adrs, buf))
			.then(data => {
				if(data==0) return;
				else return 'error';
			});
	}

	wire_read(args) {
		let adrs = parseInt(args.ARG1, 16);
		let size = Number(args.ARG2);

		const _this = this;
		return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
			.then(() => _this.runtime.dev.comlib.wire_read(adrs, size))
			.then(function(data) {
				let str = '';
				for(let i = 0; i < data.length; i++)
					str += ('0' + data[i].toString(16)).substr(-2);
				return str;
			});
	}

	wire_writeRead(args) {
		let adrs = parseInt(args.ARG1, 16);
		let sizeR = Number(args.ARG3);

		if(args.ARG2.length & 1) args.ARG2 = '0'+args.ARG2;
		let size = args.ARG2.length/2;
		let buf = new Uint8Array(size);
		for(let i = 0; i < size; i++)
			buf[i] = parseInt(args.ARG2.slice(i*2,i*2+2),16);

		const _this = this;
		return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
			.then(() => _this.runtime.dev.comlib.wire_writeRead(adrs, buf, sizeR))
			.then(function(data) {
				let str = '';
				for(let i = 0; i < data.length; i++)
					str += ('0' + data[i].toString(16)).substr(-2);
				return str;
			});
	}

	wire_scan(args) {
		const _this = this;
		return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
			.then(() => _this.runtime.dev.comlib.wire_scan())
			.then(function(data) {
				let str = '';
				for(let i = 0; i < data.length; i++)
					str += ('0' + data[i].toString(16)).substr(-2) + ' ';
				return str;
			});
	}

	digiWrite(args) {
		let port = Number(args.ARG1);
		let level = Number(args.ARG2);
		return this.runtime.dev.comlib.digiWrite([{port:port, level:level}]);
	}

	digiRead(args) {
		let port = Number(args.ARG1);
		return this.runtime.dev.comlib.digiRead(port);
	}

	anaRead(args) {
		let port = Number(args.ARG1);
		let count = Number(args.ARG2);
		return this.runtime.dev.comlib.anaRead(port,count);
	}

	tone(args) {
		let port = Number(args.ARG1);
		let freq = Number(args.ARG2);
		let ms = Number(args.ARG3);
		return this.runtime.dev.comlib.tone(port,freq,ms);
	}

	setPwms(args) {
		let port = Number(args.ARG1);
		let level = Math.min(Number(args.ARG2), 0xFFF);
		return this.runtime.dev.comlib.setPwms([{port:port,level:level}], 0/*duration*/, 0/*mode*/);
	}

	setServo180(args) {
		let port = Number(args.ARG1);
		let angle = Number(args.ARG2);	// 0~180
		angle = Math.min(180, Math.max(0, angle));

		const srvMin = 103;		// 0.5ms/20ms*4096 = 102.4 (-90c)
		const srvMax = 491;		// 2.4ms/20ms*4096 = 491.5 (+90c)
		let level = (angle * (srvMax - srvMin)) / 180 + srvMin;
		return this.runtime.dev.comlib.setPwms([{port:port,level:level}], 0/*duration*/, 0/*mode*/);
	}

	setNeoPixel(args) {
		let port = Number(args.ARG1);
		let num = Number(args.ARG2);
		this.neoPixelPort = port;
		this.neoPixels = [];
		let rgb = parseInt(args.ARG3.slice(1), 16);
		for(let i = 0; i < num; i++)
			this.neoPixels.push(rgb);
		return this.runtime.dev.comlib.neoPixels(port, this.neoPixels);
	}

	setNeoPixel8(args) {
		let port = Number(args.ARG1);
		let num = Number(args.ARG2);
		this.neoPixelPort = port;
		this.neoPixels = [];
		const argsTable = [args.ARG3, args.ARG4, args.ARG5, args.ARG6, args.ARG7, args.ARG8, args.ARG9, args.ARG10];
		for(let i = 0; i < num; i++)
			this.neoPixels.push(parseInt(argsTable[i&7].slice(1), 16));
		return this.runtime.dev.comlib.neoPixels(port, this.neoPixels);
	}

	shiftNeoPixel(args) {
		if(this.neoPixelPort < 0) return;
		let rgb = parseInt(args.ARG2.slice(1), 16);
		if(args.ARG1 == 'forward') {
			this.neoPixels.unshift(rgb);
			this.neoPixels.pop();
		} else {
			this.neoPixels.shift();
			this.neoPixels.push(rgb);
		}
		return this.runtime.dev.comlib.neoPixels(this.neoPixelPort, this.neoPixels);
	}

	colorRGB(args) {
		let rgb = (Number(args.ARG1)<<16) + (Number(args.ARG2)<<8) + (Number(args.ARG3)<<0);
		return '#' + ('00000' + rgb.toString(16)).substr(-6);
	}

	colorHSV(args) {
		const rgb = Color.hsvToRgb({
			h: Number(args.ARG1)*3.6,
			s: Number(args.ARG2)/100.0,
			v: Number(args.ARG3)/100.0
		});
		return this.colorRGB({ARG1:rgb.r,ARG2:rgb.g,ARG3:rgb.b});
	}

	hex2dec(args) {
		let upper = Number(args.ARG2);
		let lower = Number(args.ARG3);
		console.log(args.ARG1);
		if(args.ARG1.length & 1) args.ARG1 = '0'+args.ARG1;
		if(args.ARG1.length < upper || args.ARG1.length < lower) return 'error';

		let ret = 0;
		if(upper <= lower) {
			for(let i = upper; i <= lower; i++)
				ret = (ret<<8) | parseInt(args.ARG1.slice(i*2,i*2+2),16);
		} else {
			for(let i = upper; i >= lower; i--)
				ret = (ret<<8) | parseInt(args.ARG1.slice(i*2,i*2+2),16);
		}
		return ret;
	}
}
//*
module.exports = Scratch3Blocks;
//*/
