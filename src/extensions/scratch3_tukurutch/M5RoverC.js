const extName = 'M5RoverC';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const IconURI = require('./tukurutch-small.png');

const ROVER_ADDRESS = 0X38;

/**
 * Class for blocks in Scratch 3.0.
 * @constructor
 */
class Scratch3Blocks {
    constructor (runtime) {
    	this.runtime = runtime;
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
            blockIconURI: IconURI,  // Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
            menuIconURI: IconURI,   // Icon png to be displayed in the blocks category menu, encoded as a data URI.
            blocks: this.get_blocks(),
            menus: this.get_menus(),
	        targetTypes: [
	            'wedo2', // automatically transformed to 'someBlocks.wedo2'
	            'speech' // automatically transformed to 'someBlocks.speech'
	        ]
        };
    }
    
	get_blocks() {
		this._blocks = [

{blockType: BlockType.COMMAND, opcode: 'setRoverC', text: 'FL [ARG1] FR [ARG2] RL [ARG3] RR [ARG4]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG4: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'setRoverC_XYR', text: 'x [ARG1] y [ARG2] role [ARG3]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'moveRoverC', text: 'dir [ARG1] speed [ARG2]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:2, menu: 'roverDir' },
    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:100 },
}},

{blockType: BlockType.REPORTER, opcode: 'enumRoverDir', text: '[ARG1] .', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:2, menu: 'roverDir' },
}},

		];
		return this._blocks;
	}

	get_menus() {

	  return {
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

	  };
	}

	tagRover(args) { return args.ARG1; }
	enumRoverDir(args) { return args.ARG1; }

	setConfig(args) {
		return this.comlib.setConfig(args.ARG1, args.ARG2);
	}

	sendRecv(opcode,args) {
		for(let index = 0; index < this.runtime.dev._blocks.length; index++) {
			if(this.runtime.dev._blocks[index].opcode == opcode) {
				return this.runtime.dev.comlib.sendRecv(index-1, this.runtime.dev._blocks[index].arguments, args);
			}
		}
		return 0;
	}

	Send_iic(Register, Speed)
	{
		if(Speed >  100) Speed =  100;
		if(Speed < -100) Speed = -100;

		//Wire.begin(0,26,100);		//sda 0, scl 26

		const _this = this;
		return _this.runtime.dev.comlib.wire_begin(0, 26)
			.then(() => _this.runtime.dev.comlib.wire_write(ROVER_ADDRESS, new Uint8Array([Register,Speed])));
	}

	setRoverC(args)
	{
		let F_L = Number(args.ARG1);
		let F_R = Number(args.ARG2);
		let R_L = Number(args.ARG3);
		let R_R = Number(args.ARG4);
		console.log(F_L,F_R,R_L,R_R);
		const _this = this;
		return this.Send_iic(0x00, F_L)
			.then(() => _this.Send_iic(0x01, F_R))
			.then(() => _this.Send_iic(0x02, R_L))
			.then(() => _this.Send_iic(0x03, R_R));
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
