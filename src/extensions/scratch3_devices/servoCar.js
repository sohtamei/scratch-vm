const extName = 'servoCar';

const IconURI = require('./tukurutch-small.png');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

class Scratch3Blocks {
	constructor (runtime) {
		this.runtime = runtime;
		this.portL = 0;
		this.portR = 0;

		this.stickX = 0;
		this.stickY = 0;
		this.stickR = 0;
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
				{blockType: BlockType.COMMAND, opcode: 'setServo180', text: 'servo port[ARG1] angle[ARG2]', arguments: {
					ARG1: digitalPortArg,
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:90 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setServo360', text: 'rotate servo port[ARG1] speed[ARG2]', arguments: {
					ARG1: digitalPortArg,
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:100 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setPort', text: ['setup port','ポート設定'][this._locale]+' L[ARG1] R[ARG2]', arguments: {
					ARG1: digitalPortArg,
					ARG2: digitalPortArg,
				}},

				{blockType: BlockType.COMMAND, opcode: 'setCar', text: '[ARG1] at speed [ARG2]', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:1, menu: 'direction' },
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:100 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'stopCar', text: 'stop', arguments: {
				}},

				{blockType: BlockType.REPORTER, opcode: 'enumDirection', text: '[ARG1] .', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:1, menu: 'direction' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setupStick', text: ['setup stick, size[ARG1]','スティック設定 サイズ[ARG1]'][this._locale], arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:50 },
				}},

				{blockType: BlockType.BOOLEAN, opcode: 'updateStick', text: ['finish of stick operation','スティック操作完了'][this._locale], arguments: {
				}},
			],

			menus: {
				digitalPorts: { acceptReporters: true, items: digitalPorts },

				direction: { acceptReporters: true, items: [
					{ text: 'stop', value: 0 },
					{ text: 'run forward', value: 1 },
					{ text: 'turn left', value: 2 },
					{ text: 'turn right', value: 3 },
					{ text: 'run backward', value: 4 },
					{ text: 'rotate left', value: 5 },
					{ text: 'rotate right', value: 6 },
				]},
			},
		};
	}
	
	setPort(args) {
		this.portL = args.ARG1*1;
		this.portR = args.ARG2*1;
	}
	
	setServo180(args) {
		let port = args.ARG1*1;
		let angle = args.ARG2*1;	// 0~180
		angle = Math.min(180, Math.max(0, angle));

		const srvMin = 103;		// 0.5ms/20ms*4096 = 102.4 (-90c)
		const srvMax = 491;		// 2.4ms/20ms*4096 = 491.5 (+90c)
		let level = (angle * (srvMax - srvMin)) / 180 + srvMin;
		return this.runtime.dev.comlib.setPwms([{port:port,level:level}]);
	}

	setServo360(args) {
		let port = args.ARG1*1;
		let speed = args.ARG2*1;	// -100~100
		return this._setServo360([{port:port, level:speed}]);
	}

	_setServo360(portLevels) {
		let i = 0;
		for(i = 0; i < portLevels.length; i++) {
			speed = Math.min(100, Math.max(-100, portLevels[i].level));
			let level = 0;
			if(speed) {
				const srvZero = 307;		// 1.5ms/20ms*4096 = 307.2
				const srvCoef = 163;		// (2.3ms-1.5ms)/20ms*4096 = 163.8
				level = (speed * srvCoef) / 100 + srvZero;
			}
			portLevels[i].level = level;
		}
		return this.runtime.dev.comlib.setPwms(portLevels);
	}

	setCar(args) {
		let dir = args.ARG1*1;
		let speed = args.ARG2*1;
		const dir_table = [
			{L: 0, R: 0},  // 0:STOP
			{L: 1, R:-1},  // 1:FORWARD
			{L: 0, R:-1},  // 2:LEFT
			{L: 1, R: 0},  // 3:RIGHT
			{L:-1, R: 1},  // 4:BACK
			{L:-1, R:-1},  // 5:ROLL_LEFT
			{L: 1, R: 1},  // 6:ROLL_RIGHT
		];

		if(dir >= dir_table.length) return;
		let portLevels = [
			{port:this.portL, level:speed*dir_table[dir].L},
			{port:this.portR, level:speed*dir_table[dir].R},
		];
		return this._setServo360(portLevels);
	}

	stopCar(args) {
		return this._setServo360([{port:this.portL, level:0}, {port:this.portR, level:0}]);
	}

	setupStick(args, util) {
		this.stickX = util.target.x;
		this.stickY = util.target.y;
		this.stickR = args.ARG1*1;
	}

	updateStick(args, util) {
		let mouseX = util.ioQuery('mouse', 'getScratchX');
		let mouseY = util.ioQuery('mouse', 'getScratchY');
		let mouseDown = util.ioQuery('mouse', 'getIsDown');
		let dX = mouseX - this.stickX;
		let dY = mouseY - this.stickY;

		if(!mouseDown) {
			util.target.setXY(this.stickX, this.stickY);
			return this.stopCar(args)
			.then(() => true)
		}

		let a = Math.sqrt(dX*dX + dY*dY);
		if(a > this.stickR) {
			dX = dX * this.stickR/a;
			dY = dY * this.stickR/a;
			util.target.setXY(dX+this.stickX, dY+this.stickY);
		} else {
			util.target.setXY(mouseX, mouseY);
		}

		let portLevels = [
			{port:this.portL, level:(dX+dY)*2},
			{port:this.portR, level:(dX-dY)*2},
		];
		return this._setServo360(portLevels)
		.then(() => false)
	}

	enumDirection(args, util, blockInfo) { return args.ARG1; }
}
module.exports = Scratch3Blocks;
