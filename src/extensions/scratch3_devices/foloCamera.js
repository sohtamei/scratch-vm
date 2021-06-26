const extName = 'foloCamera';

const IconURI = require('./tukurutch-small.png');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const _ADDRESS = 0x20;

class Scratch3Blocks {
	constructor (runtime) {
		this.runtime = runtime;
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
			menuIconURI: IconURI,   // Icon png to be displayed in the blocks category menu, encoded as a data URI.

			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'setCar', text: '[ARG1]', arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:'1', menu: 'direction' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'stopCar', text: 'stop', arguments: {
				}},
/*
				{blockType: BlockType.COMMAND, opcode: 'setLED', text: 'IR LED[ARG1]', arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:'1', menu: 'onoff' },
				}},
						
				{blockType: BlockType.REPORTER, opcode: 'getSensorL', text: 'sensor Left'},
				{blockType: BlockType.REPORTER, opcode: 'getSensorR', text: 'sensor Right'},
*/
			],

			menus: {
				onoff: { acceptReporters: true, items: [
					{ text: 'On', value: '1' },
					{ text: 'Off', value: '0' },
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
	
	setCar(args) {
		let dir = args.ARG1*1;
		const dir_table = [
			0b0000,	// 0:STOP
			0b0001,	// 1:FORWARD
			0b0101,	// 2:LEFT
			0b1001,	// 3:RIGHT
			0b0010,	// 4:BACK
			0b0100,	// 5:ROTATE LEFT
			0b1000,	// 6:ROTATE RIGHT
		];
		if(dir >= dir_table.length) return;
		return this.write_portB(dir_table[dir]);
	}

	stopCar(args) {
		return this.setCar({ARG1:0});
	}

	setLED(args) {
		return this.runtime.dev.comlib.digiWrite([{port:12, level:args.ARG1*1}]);
	}

	getSensorL(args) { return this.runtime.dev.comlib.digiRead(2); }
	getSensorR(args) { return this.runtime.dev.comlib.digiRead(1); }

	write_portB(data) {
		const _this = this;
		return Promise.resolve().then(() => {
			if(!this.initWire) {
				this.initWire = true;
				return this.runtime.dev.comlib.wire_begin(4,13)
					.then(() => _this.runtime.dev.comlib.wire_write(_ADDRESS, [0x01,0x00]))	// IODIRB
			}
		}).then(() => _this.runtime.dev.comlib.wire_write(_ADDRESS, [0x15,data<<4]))		// OLATB
		.then(result => {
			if(result==0) return;
			_this.initWire = false;
			return 'error';
		});
	}
/*
// registers
#define MCP23017_IODIRA 0x00   //!< I/O direction register A
#define MCP23017_IPOLA 0x02    //!< Input polarity port register A
#define MCP23017_GPINTENA 0x04 //!< Interrupt-on-change pins A
#define MCP23017_DEFVALA 0x06  //!< Default value register A
#define MCP23017_INTCONA 0x08  //!< Interrupt-on-change control register A
#define MCP23017_IOCONA 0x0A   //!< I/O expander configuration register A
#define MCP23017_GPPUA 0x0C    //!< GPIO pull-up resistor register A
#define MCP23017_INTFA 0x0E    //!< Interrupt flag register A
#define MCP23017_INTCAPA 0x10  //!< Interrupt captured value for port register A
#define MCP23017_GPIOA 0x12    //!< General purpose I/O port register A
#define MCP23017_OLATA 0x14    //!< Output latch register 0 A

#define MCP23017_IODIRB 0x01   //!< I/O direction register B
#define MCP23017_IPOLB 0x03    //!< Input polarity port register B
#define MCP23017_GPINTENB 0x05 //!< Interrupt-on-change pins B
#define MCP23017_DEFVALB 0x07  //!< Default value register B
#define MCP23017_INTCONB 0x09  //!< Interrupt-on-change control register B
#define MCP23017_IOCONB 0x0B   //!< I/O expander configuration register B
#define MCP23017_GPPUB 0x0D    //!< GPIO pull-up resistor register B
#define MCP23017_INTFB 0x0F    //!< Interrupt flag register B
#define MCP23017_INTCAPB 0x11  //!< Interrupt captured value for port register B
#define MCP23017_GPIOB 0x13    //!< General purpose I/O port register B
#define MCP23017_OLATB 0x15    //!< Output latch register 0 B
*/
}
module.exports = Scratch3Blocks;
