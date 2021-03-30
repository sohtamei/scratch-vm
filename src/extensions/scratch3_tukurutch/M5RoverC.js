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
		//	blockIconURI: IconURI,  // Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
			menuIconURI: IconURI,   // Icon png to be displayed in the blocks category menu, encoded as a data URI.

			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'moveRoverC', text: 'dir [ARG1] speed [ARG2]', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:2, menu: 'roverDir' },
				    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:100 },
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

				{blockType: BlockType.COMMAND, opcode: 'setPort', text: 'I2C port [ARG1] for ESP32', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0_26', menu: 'i2cPort' },
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
		let F_L = Number(args.ARG1);
		let F_R = Number(args.ARG2);
		let R_L = Number(args.ARG3);
		let R_R = Number(args.ARG4);
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
		let x = Number(args.ARG1);
		let y = Number(args.ARG2);
		let role = Number(args.ARG3);

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
		let dir = Number(args.ARG1);
		let speed = Number(args.ARG2);
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
}
module.exports = Scratch3Blocks;
