const extName = 'maqueen';

const IconURI = require('./tukurutch-small.png');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const _ADDRESS = 0x10;

class Scratch3Blocks {
	constructor (runtime) {
		this.runtime = runtime;
		this.port = [25,21];
		this.initWire = false;
	}

	getInfo () {
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
			digitalPortArg = {type: ArgumentType.NUMBER, defaultValue:this.runtime.dev.digitalPorts[0], menu:'digitalPorts'};
		} else {
			digitalPorts = [];
			digitalPortArg = {type: ArgumentType.NUMBER, defaultValue:1};
		}

		return {
			id: extName,
			name: extName,
			menuIconURI: IconURI,   // Icon png to be displayed in the blocks category menu, encoded as a data URI.

			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'setPort', text: 'I2C port [ARG1] for ESP32', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'25_21', menu: 'i2cPort' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setCar', text: '[ARG1] at speed [ARG2]', arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:'1', menu: 'direction' },
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:255 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'stopCar', text: 'stop', arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setMotor', text: 'set motor L[ARG1] R[ARG2]', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:255 },
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:255 },
				}},

				{blockType: BlockType.REPORTER, opcode: 'enumDirection', text: '[ARG1] .', arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:'1', menu: 'direction' },
				}},
			],

			menus: {
				i2cPort: { acceptReporters: true, items: [
					{ text: 'd25 c21 M5Atom plen', value: '25_21', },
					{ text: 'd4  c13 M5Camera', value: '4_13', },
					{ text: 'd32 c33 M5StickC Grove', value: '32_33', },
					{ text: 'd0  c26 M5StickC Hat', value: '0_26', },
				]},

				direction: { acceptReporters: true, items: [
					{ text: 'stop', value: '0' },
					{ text: 'run forward', value: '1' },
					{ text: 'turn left', value: '2' },
					{ text: 'turn right', value: '3' },
					{ text: 'run backward', value: '4' },
					{ text: 'rotate left', value: '5' },
					{ text: 'rotate right', value: '6' },
				]},
			},
		};
	}
	
	setPort(args, util, blockInfo) {
		this.port = args.ARG1.split('_');
		this.initWire = false;
	}
	
	setMotor(args) {
		let buf = new Uint8Array([0,0,0,0,0]);	// 0, L_dir, L_speed, R_dir, R_speed
		let speed = [args.ARG1*1, args.ARG2*1];
		for(let i = 0; i < 2; i++) {
			if(speed[i] < 0) {
				buf[i*2+1] = 1;
				speed[i] = -speed[i];
			}
			buf[i*2+2] = Math.min(255, speed[i]);
		}

		const _this = this;
		return Promise.resolve().then(() => {
			if(!this.initWire) {
				this.initWire = true;
				return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1]);
			}
		}).then(() => _this.runtime.dev.comlib.wire_write(_ADDRESS, buf));
	}

	setCar(args) {
		let dir = args.ARG1*1;
		let speed = args.ARG2*1;
		const dir_table = [
			{L: 0, R: 0},  // 0:STOP
			{L: 1, R: 1},  // 1:FORWARD
			{L: 0, R: 1},  // 2:LEFT
			{L: 1, R: 0},  // 3:RIGHT
			{L:-1, R:-1},  // 4:BACK
			{L:-1, R: 1},  // 5:ROLL_LEFT
			{L: 1, R:-1},  // 6:ROLL_RIGHT
		];

		if(dir >= dir_table.length) return;
		return this.setMotor({ARG1:speed*dir_table[dir].L, ARG2:speed*dir_table[dir].R});
	}

	stopCar(args) {
		return this.setMotor({ARG1:0, ARG2:0});
	}

	enumDirection(args, util, blockInfo) { return args.ARG1; }
}
module.exports = Scratch3Blocks;
