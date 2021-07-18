const extName = 'folo';

const IconURI = require('./tukurutch-small.png');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

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
			name: [extName,'フォロ'][this._locale],
			menuIconURI: IconURI,   // Icon png to be displayed in the blocks category menu, encoded as a data URI.

			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'setCar', text: '[ARG1]', arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:'1', menu: 'direction' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'stopCar', text: ['stop','ストップ'][this._locale], arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setLED', text: ['IR LED[ARG1]','赤外線LED[ARG1]'][this._locale], arguments: {
				    ARG1: { type: ArgumentType.STRING, defaultValue:'1', menu: 'onoff' },
				}},
						
				{blockType: BlockType.REPORTER, opcode: 'getSensorL', text: ['sensor Left','左センサ'][this._locale]},
				{blockType: BlockType.REPORTER, opcode: 'getSensorR', text: ['sensor Right','右センサ'][this._locale]},
					
				{blockType: BlockType.REPORTER, opcode: 'getSensorAnalogL', text: ['sensor Left(analog)','左センサ (アナログ)'][this._locale]},
				{blockType: BlockType.REPORTER, opcode: 'getSensorAnalogR', text: ['sensor Right(analog)','右センサ (アナログ)'][this._locale]},
			],

			menus: {
				onoff: { acceptReporters: true, items: [
					{ text: 'On', value: '1' },
					{ text: 'Off', value: '0' },
				]},
				
				direction: { acceptReporters: true, items: [
					{ text: ['stop','ストップ'][this._locale], value: '0' },
					{ text: ['run forward','前'][this._locale], value: '1' },
					{ text: ['turn left','左'][this._locale], value: '2' },
					{ text: ['turn right','右'][this._locale], value: '3' },
					{ text: ['run backward','後'][this._locale], value: '4' },
					{ text: ['rotate left','左旋回'][this._locale], value: '5' },
					{ text: ['rotate right','右旋回'][this._locale], value: '6' },
				]},
			},
		};
	}
	
	setCar(args) {
		let dir = args.ARG1*1;
		const dir_table = [
			[{port:13,level:0}, {port:14,level:0}, {port:15,level:0}, {port:16,level:0},],	// 0:STOP
			[{port:13,level:1}, {port:14,level:0}, {port:15,level:0}, {port:16,level:0},],	// 1:FORWARD
			[{port:13,level:1}, {port:14,level:0}, {port:15,level:1}, {port:16,level:0},],	// 2:LEFT
			[{port:13,level:1}, {port:14,level:0}, {port:15,level:0}, {port:16,level:1},],	// 3:RIGHT
			[{port:13,level:0}, {port:14,level:1}, {port:15,level:0}, {port:16,level:0},],	// 4:BACK
			[{port:13,level:0}, {port:14,level:0}, {port:15,level:1}, {port:16,level:0},],	// 5:ROTATE LEFT
			[{port:13,level:0}, {port:14,level:0}, {port:15,level:0}, {port:16,level:1},],	// 6:ROTATE RIGHT
		];
		if(dir >= dir_table.length) return;
		return this.runtime.dev.comlib.digiWrite(dir_table[dir]);
	}

	stopCar(args) {
		return this.setCar({ARG1:0});
	}

	setLED(args) {
		return this.runtime.dev.comlib.digiWrite([{port:12, level:args.ARG1*1}]);
	}

	getSensorL(args) {
		if(this.runtime.dev.comlib.isConnected())
			return this.runtime.dev.comlib.digiRead(2);
		else
			return;
	}
	getSensorR(args) {
		if(this.runtime.dev.comlib.isConnected())
			return this.runtime.dev.comlib.digiRead(1);
		else
			return;
	}
	getSensorAnalogL(args) {
		if(this.runtime.dev.comlib.isConnected())
			return this.runtime.dev.comlib.anaRead(2,1);
		else
			return;
	}
	getSensorAnalogR(args) {
		if(this.runtime.dev.comlib.isConnected())
			return this.runtime.dev.comlib.anaRead(1,1);
		else
			return;
	}
}
module.exports = Scratch3Blocks;
