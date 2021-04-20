const extName = 'motorCar';

const IconURI = require('./tukurutch-small.png');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

class Scratch3Blocks {
	constructor (runtime) {
		this.runtime = runtime;

		// L293D
		this.port = {
		//	L_in1:13, L_in2:12, L_en :18, R_in1:14, R_in2:15, R_en :19,
			L_in1:2,  L_in2:16, L_en :15, R_in1:12, R_in2:13, R_en :0,
		};

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
				{blockType: BlockType.COMMAND, opcode: 'setPort', text: ['port','ポート'][this._locale]+' L:in1[ARG1]in2[ARG2]en[ARG3] R:in1[ARG4]in2[ARG5]en[ARG6]', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:2 },
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:16 },
				    ARG3: { type: ArgumentType.NUMBER, defaultValue:15 },
				    ARG4: { type: ArgumentType.NUMBER, defaultValue:12 },
				    ARG5: { type: ArgumentType.NUMBER, defaultValue:13 },
				    ARG6: { type: ArgumentType.NUMBER, defaultValue:0 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setCar', text: '[ARG1] at speed [ARG2]', arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:1, menu: 'direction' },
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:100 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'stopCar', text: 'stop', arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setupStick', text: ['setup stick, size[ARG1]','スティック設定 サイズ[ARG1]'][this._locale], arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:50 },
				}},

				{blockType: BlockType.BOOLEAN, opcode: 'updateStick', text: ['finish of stick operation','スティック操作完了'][this._locale], arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setMotor', text: 'set motor L[ARG1] R[ARG2]', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:100 },
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:100 },
				}},

				{blockType: BlockType.REPORTER, opcode: 'enumDirection', text: '[ARG1] .', arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:1, menu: 'direction' },
				}},
			],

			menus: {
				digitalPorts: { acceptReporters: true, items: digitalPorts },

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
	
	setPort(args) {
		this.port.L_in1 = args.ARG1*1;
		this.port.L_in2 = args.ARG2*1;
		this.port.L_en  = args.ARG3*1;
		this.port.R_in1 = args.ARG4*1;
		this.port.R_in2 = args.ARG5*1;
		this.port.R_en  = args.ARG6*1;
	}
	
	setMotor(args) {
		let speedL = args.ARG1*1;
		let speedR = args.ARG2*1;
		speedL = Math.min(100, Math.max(-100, speedL));
		speedR = Math.min(100, Math.max(-100, speedR));

		let gpios = [
			{port:this.port.L_in1, level:((speedL>0) ? 1: 0)},
			{port:this.port.L_in2, level:((speedL<0) ? 1: 0)},
			{port:this.port.R_in1, level:((speedR>0) ? 1: 0)},
			{port:this.port.R_in2, level:((speedR<0) ? 1: 0)},
		];
		let pwms = [
			{port:this.port.L_en, level:speedL*0xFFF/100},
			{port:this.port.R_en, level:speedR*0xFFF/100},
		];

		const _this = this;
		return _this.runtime.dev.comlib.digiWrite(gpios)
		.then(() => _this.runtime.dev.comlib.setPwms(pwms))
	}

	setCar(args) {
		let dir = args.ARG1*1;
		let speed = args.ARG2*1;
		speed = Math.min(100, Math.max(0, speed));
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
		let gpios = [
			{port:this.port.L_in1, level:((dir_table[dir].L>0) ? 1: 0)},
			{port:this.port.L_in2, level:((dir_table[dir].L<0) ? 1: 0)},
			{port:this.port.R_in1, level:((dir_table[dir].R>0) ? 1: 0)},
			{port:this.port.R_in2, level:((dir_table[dir].R<0) ? 1: 0)},
		];
		let pwms = [
			{port:this.port.L_en, level:(dir_table[dir].L ? speed*0xFFF/100: 0)},
			{port:this.port.R_en, level:(dir_table[dir].R ? speed*0xFFF/100: 0)},
		];

		const _this = this;
		return _this.runtime.dev.comlib.digiWrite(gpios)
		.then(() => _this.runtime.dev.comlib.setPwms(pwms))
	}

	stopCar(args) {
		return this.setMotor({ARG1:0, ARG2:0});
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

		return this.setMotor({ARG1:(dX+dY)*2, ARG2:(dY-dX)*2})
		.then(() => false)
	}

	enumDirection(args, util, blockInfo) { return args.ARG1; }
}
module.exports = Scratch3Blocks;
