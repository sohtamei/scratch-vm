const extName = 'M5RoverC';

const IconURI = require('./tukurutch-small.png');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const ROVER_ADDRESS = 0X38;

class Scratch3Blocks {
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
				    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:2, menu: 'roverDir' },
				    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:100 },
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
				    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
				    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
				    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setRoverC', text: 'FL [ARG1] FR [ARG2] RL [ARG3] RR [ARG4]', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
				    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
				    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
				    ARG4: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
				}},

				{blockType: BlockType.REPORTER, opcode: 'enumRoverDir', text: '[ARG1] .', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:2, menu: 'roverDir' },
				}},
			],

			menus: {
				roverDir: { acceptReporters: true, items: [
					{ text: 'STOP', value: 0 },
					{ text: 'UP_R', value: 1 },
					{ text: 'UP', value: 2 },
					{ text: 'UP_L', value: 3 },
					{ text: 'RIGHT', value: 4 },
					{ text: 'LEFT', value: 5 },
					{ text: 'DOWN_R', value: 6 },
					{ text: 'DOWN', value: 7 },
					{ text: 'DOWN_L', value: 8 },
					{ text: 'ROLL_R', value: 9 },
					{ text: 'ROLL_L', value: 10 },
				]},

				i2cPort: { acceptReporters: true, items: [
					{ text: 'd0  c26 M5StickC Hat', value: '0_26', },
					{ text: 'd21 c22 default', value: '21_22', },
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

	setRoverC(args)
	{
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

	setRoverC_XYR(args)
	{
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

	moveRoverC(args)
	{
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
module.exports = Scratch3Blocks;
