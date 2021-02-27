const extName = 'test';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const IconURI = require('./tukurutch-small.png');

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
{blockType: BlockType.COMMAND, opcode: 'tagServo', text: '--- ServoCar ---', arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'setCar', text: '[ARG1] at speed [ARG2]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'direction' },
    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:100 },
}},

{blockType: BlockType.COMMAND, opcode: 'setMotor', text: 'set motor [ARG1] speed [ARG2]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0, menu: 'servoch' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:100, menu: 'speed' },
}},

{blockType: BlockType.COMMAND, opcode: 'stopCar', text: 'stop', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'enumDirection', text: '[ARG1] .', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'direction' },
}},

{blockType: BlockType.COMMAND, opcode: 'setServo', text: 'set servo [ARG1] [ARG2]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0, menu: 'servoch' },
    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:90, menu: 'angle' },
}},

'---',

{blockType: BlockType.COMMAND, opcode: 'tagRover', text: '--- RoverC ---', arguments: {
}},

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
angle: { acceptReporters: true, items: ['0','90','180',]},

direction: { acceptReporters: true, items: [
{ text: 'stop', value: 0 },
{ text: 'run forward', value: 1 },
{ text: 'turn left', value: 2 },
{ text: 'turn right', value: 3 },
{ text: 'run backward', value: 4 },
{ text: 'rotate left', value: 5 },
{ text: 'rotate right', value: 6 },
{ text: 'calibration', value: 7 },
]},

onoff: { acceptReporters: true, items: [
{ text: 'On', value: 1 },
{ text: 'Off', value: 0 },
]},

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

servoch: { acceptReporters: true, items: ['0','1',]},

speed: { acceptReporters: true, items: ['100','50','0','-50','-100',]},

	  };
	}

setLED(args,util) { return this.sendRecv(arguments.callee.name, args); }

tagServo(args) { return args.ARG1; }
setCar(args,util) { return this.sendRecv(arguments.callee.name, args); }
setMotor(args,util) { return this.sendRecv(arguments.callee.name, args); }
stopCar(args,util) { return this.sendRecv(arguments.callee.name, args); }
enumDirection(args) { return args.ARG1; }
setServo(args,util) { return this.sendRecv(arguments.callee.name, args); }
tagRover(args) { return args.ARG1; }
setRoverC(args,util) { return this.sendRecv(arguments.callee.name, args); }
setRoverC_XYR(args,util) { return this.sendRecv(arguments.callee.name, args); }
moveRoverC(args,util) { return this.sendRecv(arguments.callee.name, args); }
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
}
module.exports = Scratch3Blocks;
