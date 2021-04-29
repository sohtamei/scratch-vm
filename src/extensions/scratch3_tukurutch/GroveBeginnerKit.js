const extName = 'GroveBeginnerKit';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const comlib = require('./comlib.js');

const IconURI = require('./tukurutch-small.png');

/**
 * Class for blocks in Scratch 3.0.
 * @constructor
 */
class Scratch3Blocks {
	constructor (runtime) {
		runtime.dev = this;

		if(typeof SupportCamera === "undefined") SupportCamera = false;
		this.comlib = new comlib(runtime, extName, SupportCamera);
	}

	getInfo () {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}
		this.comlib.setLocale(this._locale);
		[this.ifType, this.ipadrs] = this.comlib.getConfig();

		return {
			id: extName,
			name: extName,
			//blockIconURI: IconURI,
			menuIconURI: IconURI,
			showStatusButton: true,
			blocks: this.get_blocks(),
			menus: this.get_menus(),
		};
	}
	
	get_blocks() {
		this.flashList = [
{name:'GroveBeginnerKit', type:'atmega328', baudrate:115200},
		];

		this.blockOffset = 5;

		this._blocks = [
{blockType: BlockType.COMMAND, opcode: 'burnFlash', text: [
    'burn [ARG1]',
    '[ARG1]書き込み',
][this._locale], arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'flashList' },
}},

{blockType: BlockType.COMMAND, opcode: 'connectWifi', text: ['connect','接続'][this._locale]+' ssid[ARG1] pass[ARG2]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: ' ' },
	ARG2: { type: ArgumentType.STRING, defaultValue: ' ' },
}},

{blockType: BlockType.REPORTER, opcode: 'statusWifi', text: ['WiFi status','WiFi接続状態'][this._locale], disableMonitor:true, arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'setConfig', text: ['I/F type','接続方法'][this._locale]+'[ARG1] IP=[ARG2]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: this.ifType, menu: 'ifType' },
	ARG2: { type: ArgumentType.STRING, defaultValue: this.ipadrs},
}},

'---',

{blockType: BlockType.COMMAND, opcode: 'BuzzerJ2', text: [
    'play tone [ARG1] beat [ARG2]',
    '[ARG1] を [ARG2] 鳴らす',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'262', menu: 'noteJ2' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'500', menu: 'beats' },
}},

{blockType: BlockType.COMMAND, opcode: 'oledSetCursor', text: '［OLED］set cursor [ARG1] [ARG2]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0 },
    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'oledPrint', text: '［OLED］print [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'Hello' },
}},

{blockType: BlockType.COMMAND, opcode: 'oledPrintLine', text: '［OLED］print line [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'Hello' },
}},

{blockType: BlockType.COMMAND, opcode: 'oledClear', text: '［OLED］clear', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'getDhtTemp', text: '［DHT11］get Temperature', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'getDhtHum', text: '［DHT11］get Humidity', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'getBmpTemp', text: '［BMP280］get Temperature', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'getBmpPress', text: '［BMP280］get Pressure', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'getAccel', text: 'get Accel [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'0', menu: 'xyz' },
}},

		];
		return this._blocks;
	}

	get_menus() {
		this.flashItems = [];
		for(let i = 0; i < this.flashList.length; i++)
			this.flashItems[i] = { text:this.flashList[i].name, value:i };

	  return {
ifType: { acceptReporters: true, items: [
	{ text: 'USB', value: 'UART' },
	{ text: 'WiFi', value: 'WLAN' },
]},

flashList: { acceptReporters: true, items: this.flashItems },

beats: { acceptReporters: true, items: [
{ text: ['Half','2分音符'][this._locale], value: '500' },
{ text: ['Quarter','4分音符'][this._locale], value: '250' },
{ text: ['Eighth','8分音符'][this._locale], value: '125' },
{ text: ['Whole','全音符'][this._locale], value: '1000' },
{ text: ['Double','倍全音符'][this._locale], value: '2000' },
]},

noteJ2: { acceptReporters: true, items: [
{ text: ['C4','ド4'][this._locale], value: '262' },
{ text: ['D4','レ4'][this._locale], value: '294' },
{ text: ['E4','ミ4'][this._locale], value: '330' },
{ text: ['F4','ファ4'][this._locale], value: '349' },
{ text: ['G4','ソ4'][this._locale], value: '392' },
{ text: ['A4','ラ4'][this._locale], value: '440' },
{ text: ['B4','シ4'][this._locale], value: '494' },
{ text: ['C5','ド5'][this._locale], value: '523' },
{ text: ['D5','レ5'][this._locale], value: '587' },
{ text: ['E5','ミ5'][this._locale], value: '659' },
{ text: ['F5','ファ5'][this._locale], value: '698' },
{ text: ['G5','ソ5'][this._locale], value: '784' },
{ text: ['A5','ラ5'][this._locale], value: '880' },
{ text: ['B5','シ5'][this._locale], value: '988' },
]},

xyz: { acceptReporters: true, items: [
{ text: 'x', value: '0' },
{ text: 'y', value: '1' },
{ text: 'z', value: '2' },
]},

	  };
	}

BuzzerJ2(args,util) { return this.sendRecv(arguments.callee.name, args); }
oledSetCursor(args,util) { return this.sendRecv(arguments.callee.name, args); }
oledPrint(args,util) { return this.sendRecv(arguments.callee.name, args); }
oledPrintLine(args,util) { return this.sendRecv(arguments.callee.name, args); }
oledClear(args,util) { return this.sendRecv(arguments.callee.name, args); }
getDhtTemp(args,util) { return this.sendRecv(arguments.callee.name, args); }
getDhtHum(args,util) { return this.sendRecv(arguments.callee.name, args); }
getBmpTemp(args,util) { return this.sendRecv(arguments.callee.name, args); }
getBmpPress(args,util) { return this.sendRecv(arguments.callee.name, args); }
getAccel(args,util) { return this.sendRecv(arguments.callee.name, args); }

	burnFlash(args) {
		if(this.comlib.server=='http') return ['please access via https://','https:// でアクセスして下さい'][this._locale];

		let ret = window.confirm(['Burn TuKuRutch firmware to device, sure ?', 'つくるっち用ファームをデバイスに書き込みますか？'][this._locale]);
		console.log(ret);
		if(!ret) return;
		return this.comlib.burnWlan(this.flashList[Number(args.ARG1)]);
	}

	connectWifi(args) {
		if(this.comlib.server=='http') return ['please access via https://','https:// でアクセスして下さい'][this._locale];

		return this.comlib.connectWifi(args.ARG1, args.ARG2);
	}

	statusWifi(args) {
		return this.comlib.statusWifi();
	}

	setConfig(args) {
		if(this.comlib.server=='http' && args.ARG1!='WLAN') return ['please access via https://','https:// でアクセスして下さい'][this._locale];
		if(this.comlib.server=='https' && args.ARG1=='WLAN') return ['please access via http://','http:// でアクセスして下さい'][this._locale];

		return this.comlib.setConfig(args.ARG1, args.ARG2);
	}

	sendRecv(opcode,args) {
		for(index = this.blockOffset; index < this._blocks.length; index++) {
			if(this._blocks[index].opcode == opcode) {
				return this.comlib.sendRecv(index - this.blockOffset + 1, this._blocks[index].arguments, args);
			}
		}
		return 0;
	}
}
module.exports = Scratch3Blocks;
