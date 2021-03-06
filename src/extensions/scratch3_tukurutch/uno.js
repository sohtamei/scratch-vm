const extName = 'uno';

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
{name:'uno', type:'atmega328', baudrate:115200},
{name:'generic_ESP32', type:'esp32', baudrate:921600},
		];

		this.blockOffset = 6;

		this._blocks = [
{blockType: BlockType.COMMAND, opcode: 'setConfig', text: ['con/discon','接続/切断'][this._locale] + '[ARG1] IP=[ARG2]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: this.comlib.ifType, menu: 'ifType' },
	ARG2: { type: ArgumentType.STRING, defaultValue: this.comlib.ipadrs},
}},

{blockType: BlockType.COMMAND, opcode: 'videoToggle', text: 'turn video [ARG1]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: 'on', menu: 'videoState' },
}, hideFromPalette: (SupportCamera==false)},

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

'---',

{blockType: BlockType.COMMAND, opcode: 'setLED', text: [
    'set LED [ARG1] [ARG2]',
    'LED [ARG1] を [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'led' },
    ARG2: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'onoff' },
}},

{blockType: BlockType.COMMAND, opcode: 'BuzzerJ2', text: [
    'play tone [ARG1] beat [ARG2]',
    '[ARG1] を [ARG2] 鳴らす',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'262', menu: 'noteJ2' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'500', menu: 'beats' },
}},

{blockType: BlockType.REPORTER, opcode: 'getAnalogAve', text: [
    'Sensor [ARG1] average [ARG2] times',
    'センサ [ARG1] の [ARG2] 回平均',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'sensor' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:4 },
}},

{blockType: BlockType.BOOLEAN, opcode: 'getSW', text: [
    'SW [ARG1]',
    'スイッチ [ARG1]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'sw' },
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

videoState: { acceptReporters: true, items: ['off','on','on_flipped']},

flashList: { acceptReporters: true, items: this.flashItems },

beats: { acceptReporters: true, items: [
{ text: ['Half','2分音符'][this._locale], value: '500' },
{ text: ['Quarter','4分音符'][this._locale], value: '250' },
{ text: ['Eighth','8分音符'][this._locale], value: '125' },
{ text: ['Whole','全音符'][this._locale], value: '1000' },
{ text: ['Double','倍全音符'][this._locale], value: '2000' },
]},

led: { acceptReporters: true, items: ['1','2','3','4','5','6',]},

noteJ1: { acceptReporters: true, items: [
{ text: ['C2','ド2'][this._locale], value: '65' },
{ text: ['D2','レ2'][this._locale], value: '73' },
{ text: ['E2','ミ2'][this._locale], value: '82' },
{ text: ['F2','ファ2'][this._locale], value: '87' },
{ text: ['G2','ソ2'][this._locale], value: '98' },
{ text: ['A2','ラ2'][this._locale], value: '110' },
{ text: ['B2','シ2'][this._locale], value: '123' },
{ text: ['C3','ド3'][this._locale], value: '131' },
{ text: ['D3','レ3'][this._locale], value: '147' },
{ text: ['E3','ミ3'][this._locale], value: '165' },
{ text: ['F3','ファ3'][this._locale], value: '175' },
{ text: ['G3','ソ3'][this._locale], value: '196' },
{ text: ['A3','ラ3'][this._locale], value: '220' },
{ text: ['B3','シ3'][this._locale], value: '247' },
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

noteJ3: { acceptReporters: true, items: [
{ text: ['C6','ド6'][this._locale], value: '1047' },
{ text: ['D6','レ6'][this._locale], value: '1175' },
{ text: ['E6','ミ6'][this._locale], value: '1319' },
{ text: ['F6','ファ6'][this._locale], value: '1397' },
{ text: ['G6','ソ6'][this._locale], value: '1568' },
{ text: ['A6','ラ6'][this._locale], value: '1760' },
{ text: ['B6','シ6'][this._locale], value: '1976' },
{ text: ['C7','ド7'][this._locale], value: '2093' },
{ text: ['D7','レ7'][this._locale], value: '2349' },
{ text: ['E7','ミ7'][this._locale], value: '2637' },
{ text: ['F7','ファ7'][this._locale], value: '2794' },
{ text: ['G7','ソ7'][this._locale], value: '3136' },
{ text: ['A7','ラ7'][this._locale], value: '3520' },
{ text: ['B7','シ7'][this._locale], value: '3951' },
{ text: ['C8','ド8'][this._locale], value: '4186' },
{ text: ['D8','レ8'][this._locale], value: '4699' },
]},

onoff: { acceptReporters: true, items: [
{ text: 'On', value: '1' },
{ text: 'Off', value: '0' },
]},

sensor: { acceptReporters: true, items: ['1','2','3','4',]},

sw: { acceptReporters: true, items: ['1','2','3',]},

	  };
	}

setLED(args,util) { return this.sendRecv(arguments.callee.name, args); }
BuzzerJ2(args,util) { return this.sendRecv(arguments.callee.name, args); }
getAnalogAve(args,util) { return this.sendRecv(arguments.callee.name, args); }
getSW(args,util) { return this.sendRecv(arguments.callee.name, args); }

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
		return this.comlib.setConfig(args.ARG1, args.ARG2);
	}

	videoToggle(args) {
		return this.comlib.videoToggle(args.ARG1);
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
