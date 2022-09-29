var extName = 'M5RoverC';

const ROVER_ADDRESS = 0X38;

const IconURI = 'data:image/png;base64,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';
//*
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
class Scratch3Blocks {
//*/
/*
var ext = class {
*/
	constructor (runtime) {
		this.runtime = runtime;
		this.port = [0,26];
		this.initWire = false;

		this.stick1X = 0;
		this.stick1Y = 0;
		this.stick1R = 0;
		this.stick2X = 0;
		this.stick2Y = 0;
		this.stick2R = 0;
	}

	getInfo () {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}

		return {
			id: extName,
			name: extName,
			menuIconURI: IconURI,   // Icon png to be displayed in the blocks category menu, encoded as a data URI.

			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'setPort', text: 'I2C port [ARG1] for ESP32', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0_26', menu: 'i2cPort' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'moveRoverC', text: 'dir [ARG1] speed [ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'2', menu: 'roverDir' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:100 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'stopCar', text: 'stop', arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setupStickXY', text: ['setup XY-stick, size[ARG1]','XYスティック設定 サイズ[ARG1]'][this._locale], arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:50 },
				}},

				{blockType: BlockType.BOOLEAN, opcode: 'updateStickXY', text: ['finish of XY-stick operation','XYスティック操作完了'][this._locale], arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setupStickR', text: ['setup Role-stick, size[ARG1]','Roleスティック設定 サイズ[ARG1]'][this._locale], arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:50 },
				}},

				{blockType: BlockType.BOOLEAN, opcode: 'updateStickR', text: ['finish of Role-stick operation','Roleスティック操作完了'][this._locale], arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setRoverC_XYR', text: 'x [ARG1] y [ARG2] role [ARG3]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:0 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setRoverC', text: 'FL [ARG1] FR [ARG2] RL [ARG3] RR [ARG4]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG4: { type: ArgumentType.NUMBER, defaultValue:0 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setMotor', text: '[ARG1] speed[ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'ch' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:255 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setMotorLR', text: '[ARG1] L[ARG2] R[ARG3]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'chLR' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:255 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:255 },
				}},

				{blockType: BlockType.REPORTER, opcode: 'enumRoverDir', text: '[ARG1] .', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'2', menu: 'roverDir' },
				}},
			],

			menus: {
				ch: { acceptReporters: true, items: [
					{ text: 'F_L', value: '0' },
					{ text: 'F_R', value: '1' },
					{ text: 'R_L', value: '2' },
					{ text: 'R_R', value: '3' },
				]},

				chLR: { acceptReporters: true, items: [
					{ text: 'F', value: '0' },
					{ text: 'R', value: '2' },
				]},

				roverDir: { acceptReporters: true, items: [
					{ text: 'STOP', value: '0' },
					{ text: 'UP_R', value: '1' },
					{ text: 'UP', value: '2' },
					{ text: 'UP_L', value: '3' },
					{ text: 'RIGHT', value: '4' },
					{ text: 'LEFT', value: '5' },
					{ text: 'DOWN_R', value: '6' },
					{ text: 'DOWN', value: '7' },
					{ text: 'DOWN_L', value: '8' },
					{ text: 'ROLL_R', value: '9' },
					{ text: 'ROLL_L', value: '10' },
				]},

				i2cPort: { acceptReporters: true, items: [
					{ text: 'd0  c26 M5StickC Hat', value: '0_26', },
					{ text: 'd21 c22 ESP32 default', value: '21_22', },
					{ text: 'd8  c9 ESP32S3 default', value: '8_9', },
					{ text: 'd26 c32 M5Atom', value: '26_32', },
					{ text: 'd4  c13 M5Camera', value: '4_13', },
					{ text: 'd32 c33 M5StickC Grove', value: '32_33', },
				]},
			},
		};
	}
	
	setPort(args, util, blockInfo) {
		this.port = args.ARG1.split('_');
		this.initWire = false;
	}
	
	enumRoverDir(args) { return args.ARG1; }

	setRoverC(args) {
		let F_L = args.ARG1*1;
		let F_R = args.ARG2*1;
		let R_L = args.ARG3*1;
		let R_R = args.ARG4*1;
		console.log(F_L,F_R,R_L,R_R);

		F_L = Math.min(100, Math.max(-100, F_L));
		F_R = Math.min(100, Math.max(-100, F_R));
		R_L = Math.min(100, Math.max(-100, R_L));
		R_R = Math.min(100, Math.max(-100, R_R));

		const _this = this;
		if(!this.initWire) {
			this.initWire = true;
			return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
			.then(() => _this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([0x00,F_L,F_R,R_L,R_R])));
		} else {
			return _this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([0x00,F_L,F_R,R_L,R_R]));
		}
	}

	setRoverC_XYR(args) {
		let x = args.ARG1*1;
		let y = args.ARG2*1;
		let role = args.ARG3*1;

		let left = y+x;
		let right = y-x;
		let invK = 100;

		     if(Math.abs(left) > 100) invK = Math.abs(left);
		else if(Math.abs(right) > 100) invK = Math.abs(right);

		if(invK != 100) {
			left  = (left*100)/invK;
			right = (right*100)/invK;
		}
		console.log(left+role, right-role, right+role, left-role);
		return this.setRoverC({ARG1:left+role, ARG2:right-role, ARG3:right+role, ARG4:left-role});
	}

	moveRoverC(args) {
		let dir = args.ARG1*1;
		let speed = args.ARG2*1;
		const rdir_table = [
			{x: 0,y: 0,r: 0},  // STOP
			{x: 1,y: 1,r: 0},  // UP_R
			{x: 0,y: 1,r: 0},  // UP
			{x:-1,y: 1,r: 0},  // UP_L
			{x: 1,y: 0,r: 0},  // RIGHT
			{x:-1,y: 0,r: 0},  // LEFT
			{x: 1,y:-1,r: 0},  // DOWN_R
			{x: 0,y:-1,r: 0},  // DOWN
			{x:-1,y:-1,r: 0},  // DOWN_L
			{x: 0,y: 0,r: 1},  // ROLL_R
			{x: 0,y: 0,r:-1},  // ROLL_L
		];

		if(dir >= rdir_table.length) return;
		this.setRoverC_XYR({ARG1:speed*rdir_table[dir].x, ARG2:speed*rdir_table[dir].y, ARG3:speed*rdir_table[dir].r});
	}

	stopCar(args) {
		return this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([0x00,0,0,0,0]));
	}

	setMotor(args) {
		let speed = args.ARG2*1;
		speed = Math.min(100, Math.max(-100, speed));
		const _this = this;
		if(!this.initWire) {
			this.initWire = true;
			return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
			.then(() => _this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([args.ARG1*1, speed])));
		} else {
			return _this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([args.ARG1*1, speed]));
		}
	}

	setMotorLR(args) {
		let L = args.ARG2*1;
		let R = args.ARG3*1;
		L = Math.min(100, Math.max(-100, L));
		R = Math.min(100, Math.max(-100, R));
		const _this = this;
		if(!this.initWire) {
			this.initWire = true;
			return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
			.then(() => _this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([args.ARG1*1, L, R])));
		} else {
			return _this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([args.ARG1*1, L, R]));
		}
	}

	setupStickXY(args, util) {
		this.stick1X = util.target.x;
		this.stick1Y = util.target.y;
		this.stick1R = args.ARG1*1;
	}

	updateStickXY(args, util) {
		let mouseX = util.ioQuery('mouse', 'getScratchX');
		let mouseY = util.ioQuery('mouse', 'getScratchY');
		let mouseDown = util.ioQuery('mouse', 'getIsDown');
		let dX = mouseX - this.stick1X;
		let dY = mouseY - this.stick1Y;

		if(!mouseDown) {
			util.target.setXY(this.stick1X, this.stick1Y);
			return this.stopCar(args)
			.then(() => true)
		}

		let a = Math.sqrt(dX*dX + dY*dY);
		if(a > this.stick1R) {
			dX = dX * this.stick1R/a;
			dY = dY * this.stick1R/a;
			util.target.setXY(dX+this.stick1X, dY+this.stick1Y);
		} else {
			util.target.setXY(mouseX, mouseY);
		}

		return this.setRoverC_XYR({ARG1:dX,ARG2:dY,ARG3:0})
		.then(() => false)
	}

	setupStickR(args, util) {
		this.stick2X = util.target.x;
		this.stick2Y = util.target.y;
		this.stick2R = args.ARG1*1;
	}

	updateStickR(args, util) {
		let mouseX = util.ioQuery('mouse', 'getScratchX');
		let mouseDown = util.ioQuery('mouse', 'getIsDown');
		let dX = mouseX - this.stick2X;

		if(!mouseDown) {
			util.target.setXY(this.stick2X, this.stick2Y);
			return this.stopCar(args)
			.then(() => true)
		}

		let a = dX;
		if(a > this.stick2R) {
			dX = dX * this.stick2R/a;
			util.target.setXY(dX+this.stick2X, this.stick2Y);
		} else {
			util.target.setXY(mouseX, this.stick2Y);
		}

		return this.setRoverC_XYR({ARG1:0,ARG2:0,ARG3:dX})
		.then(() => false)
	}
}
//*
module.exports = Scratch3Blocks;
//*/
