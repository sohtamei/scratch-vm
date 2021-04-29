const extName = 'M5Series';

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
{name:'M5StickC', type:'esp32', baudrate:750000},
{name:'M5StickCPlus', type:'esp32', baudrate:750000},
{name:'M5Stack', type:'esp32', baudrate:921600},
{name:'M5Atom', type:'esp32', baudrate:1500000},
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

'---',
{blockType: BlockType.COMMAND, opcode: 'setLED', text: 'set LED [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'onoff' },
}},

{blockType: BlockType.REPORTER, opcode: 'getIMU', text: 'get IMU [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'3', menu: 'imu' },
}},

{blockType: BlockType.COMMAND, opcode: 'Buzzer', text: 'play tone on note [ARG1] beat [ARG2]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'262', menu: 'note' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'500', menu: 'beats' },
}},

{blockType: BlockType.COMMAND, opcode: 'Beep', text: 'Beep', arguments: {
}},

{blockType: BlockType.BOOLEAN, opcode: 'getSw', text: '[ARG1] is pressed', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'0', menu: 'button' },
}},

'---',
'---',
'---',
'---',
{blockType: BlockType.COMMAND, opcode: 'setText', text: 'set text [ARG1] size=[ARG2]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'65535', menu: 'color' },
    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:2 },
}},

{blockType: BlockType.COMMAND, opcode: 'setCursor', text: 'set cursor at ([ARG1] ,[ARG2] )', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'printText', text: 'print text [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'test' },
}},

{blockType: BlockType.COMMAND, opcode: 'printlnText', text: 'print text [ARG1] and return', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'test' },
}},

{blockType: BlockType.COMMAND, opcode: 'drawString', text: 'draw text [ARG1] ([ARG2] ,[ARG3] ) font=[ARG4]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'test' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG4: { type: ArgumentType.STRING, type2:'B', defaultValue:'2', menu: 'font' },
}},

{blockType: BlockType.COMMAND, opcode: 'fillScreen', text: 'fill screen with [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'color' },
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
{ text: 'Half', value: '500' },
{ text: 'Quarter', value: '250' },
{ text: 'Eighth', value: '125' },
{ text: 'Whole', value: '1000' },
{ text: 'Double', value: '2000' },
]},

button: { acceptReporters: true, items: [
{ text: 'buttonA', value: '0' },
{ text: 'buttonB', value: '1' },
{ text: 'buttonC', value: '2' },
]},

color: { acceptReporters: true, items: [
{ text: 'BLACK', value: '0' },
{ text: 'NAVY', value: '15' },
{ text: 'DARKGREEN', value: '992' },
{ text: 'DARKCYAN', value: '1007' },
{ text: 'MAROON', value: '30720' },
{ text: 'PURPLE', value: '30735' },
{ text: 'OLIVE', value: '31712' },
{ text: 'LIGHTGREY', value: '50712' },
{ text: 'DARKGREY', value: '31727' },
{ text: 'BLUE', value: '31' },
{ text: 'GREEN', value: '2016' },
{ text: 'CYAN', value: '2047' },
{ text: 'RED', value: '63488' },
{ text: 'MAGENTA', value: '63519' },
{ text: 'YELLOW', value: '65504' },
{ text: 'WHITE', value: '65535' },
{ text: 'ORANGE', value: '64800' },
{ text: 'GREENYELLOW', value: '45029' },
{ text: 'PINK', value: '63519' },
]},

font: { acceptReporters: true, items: [
{ text: 'Ascii8', value: '1' },
{ text: 'Ascii16', value: '2' },
{ text: 'Ascii26', value: '4' },
{ text: 'Num48', value: '6' },
{ text: '7Seg48', value: '7' },
{ text: 'Num75', value: '8' },
]},

imu: { acceptReporters: true, items: [
{ text: 'GyroX', value: '0' },
{ text: 'GyroY', value: '1' },
{ text: 'GyroZ', value: '2' },
{ text: 'AccelX', value: '3' },
{ text: 'AccelY', value: '4' },
{ text: 'AccelZ', value: '5' },
{ text: 'Pitch', value: '6' },
{ text: 'Roll', value: '7' },
{ text: 'Yaw', value: '8' },
{ text: 'Temp', value: '9' },
]},

note: { acceptReporters: true, items: [
{ text: 'C2', value: '65' },
{ text: 'D2', value: '73' },
{ text: 'E2', value: '82' },
{ text: 'F2', value: '87' },
{ text: 'G2', value: '98' },
{ text: 'A2', value: '110' },
{ text: 'B2', value: '123' },
{ text: 'C3', value: '131' },
{ text: 'D3', value: '147' },
{ text: 'E3', value: '165' },
{ text: 'F3', value: '175' },
{ text: 'G3', value: '196' },
{ text: 'A3', value: '220' },
{ text: 'B3', value: '247' },
{ text: 'C4', value: '262' },
{ text: 'D4', value: '294' },
{ text: 'E4', value: '330' },
{ text: 'F4', value: '349' },
{ text: 'G4', value: '392' },
{ text: 'A4', value: '440' },
{ text: 'B4', value: '494' },
{ text: 'C5', value: '523' },
{ text: 'D5', value: '587' },
{ text: 'E5', value: '659' },
{ text: 'F5', value: '698' },
{ text: 'G5', value: '784' },
{ text: 'A5', value: '880' },
{ text: 'B5', value: '988' },
{ text: 'C6', value: '1047' },
{ text: 'D6', value: '1175' },
{ text: 'E6', value: '1319' },
{ text: 'F6', value: '1397' },
{ text: 'G6', value: '1568' },
{ text: 'A6', value: '1760' },
{ text: 'B6', value: '1976' },
{ text: 'C7', value: '2093' },
{ text: 'D7', value: '2349' },
{ text: 'E7', value: '2637' },
{ text: 'F7', value: '2794' },
{ text: 'G7', value: '3136' },
{ text: 'A7', value: '3520' },
{ text: 'B7', value: '3951' },
{ text: 'C8', value: '4186' },
{ text: 'D8', value: '4699' },
]},

onoff: { acceptReporters: true, items: [
{ text: 'On', value: '1' },
{ text: 'Off', value: '0' },
]},

	  };
	}

setLED(args,util) { return this.sendRecv(arguments.callee.name, args); }
getIMU(args,util) { return this.sendRecv(arguments.callee.name, args); }
Buzzer(args,util) { return this.sendRecv(arguments.callee.name, args); }
Beep(args,util) { return this.sendRecv(arguments.callee.name, args); }
getSw(args,util) { return this.sendRecv(arguments.callee.name, args); }
setText(args,util) { return this.sendRecv(arguments.callee.name, args); }
setCursor(args,util) { return this.sendRecv(arguments.callee.name, args); }
printText(args,util) { return this.sendRecv(arguments.callee.name, args); }
printlnText(args,util) { return this.sendRecv(arguments.callee.name, args); }
drawString(args,util) { return this.sendRecv(arguments.callee.name, args); }
fillScreen(args,util) { return this.sendRecv(arguments.callee.name, args); }

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
