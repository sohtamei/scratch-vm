const extName = 'QuadCrawlerAI';
const SupportCamera = true;

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
{name:'QuadCrawlerAI', type:'esp32', baudrate:921600},
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

{blockType: BlockType.COMMAND, opcode: 'setWalk', text: [
    'walk [ARG1] [ARG2]',
    '動く [ARG1] [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'walkcmd' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'200', menu: 'speed' },
}},

{blockType: BlockType.COMMAND, opcode: 'setPoseRF', text: [
    'FrontR up/down [ARG1] fw/back [ARG2]',
    '右前脚 上下 [ARG1] 前後 [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'knee' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'crotchF' },
}},

{blockType: BlockType.COMMAND, opcode: 'setPoseLF', text: [
    'FrontL up/down [ARG1] fw/back [ARG2]',
    '左前脚 上下 [ARG1] 前後 [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'knee' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'crotchF' },
}},

{blockType: BlockType.COMMAND, opcode: 'setPoseRR', text: [
    'RearR  up/down [ARG1] fw/back [ARG2]',
    '右後脚 上下 [ARG1] 前後 [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'knee' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'crotchR' },
}},

{blockType: BlockType.COMMAND, opcode: 'setPoseLR', text: [
    'RearL  up/down [ARG1] fw/back [ARG2]',
    '左後脚 上下 [ARG1] 前後 [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'knee' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'crotchR' },
}},

{blockType: BlockType.COMMAND, opcode: 'setStop', text: [
    'stop',
    '停止',
][this._locale], arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'calibKnee', text: [
    'calib up/down [ARG1] [ARG2]',
    '上下微調整 [ARG1] [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'0', menu: 'leg' },
    ARG2: { type: ArgumentType.STRING, type2:'B', defaultValue:'2', menu: 'calibK' },
}},

{blockType: BlockType.REPORTER, opcode: 'calibCrotch', text: [
    'calib fw/back [ARG1] [ARG2]',
    '前後微調整 [ARG1] [ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'0', menu: 'leg' },
    ARG2: { type: ArgumentType.STRING, type2:'B', defaultValue:'2', menu: 'calibC' },
}},

{blockType: BlockType.COMMAND, opcode: 'setColorWipe', text: 'LED [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'color' },
}},

{blockType: BlockType.COMMAND, opcode: 'setRainbow', text: [
    'LED rainbow [ARG1] sec',
    'LEDレインボー [ARG1] 秒',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:5 },
}},

{blockType: BlockType.COMMAND, opcode: 'BuzzerJ2', text: [
    'play tone on note [ARG1] beat [ARG2]',
    '[ARG1] を [ARG2] 鳴らす',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'262', menu: 'noteJ2' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'500', menu: 'beats' },
}},

{blockType: BlockType.REPORTER, opcode: 'getSonner', text: [
    'read Sonner',
    '距離取得',
][this._locale], arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'getVbat', text: 'get VBAT', arguments: {
}},

'---',
'---',
{blockType: BlockType.COMMAND, opcode: 'setPWM', text: 'set PWM ch [ARG1] data [ARG2]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:8 },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:320 },
}},

'---',
{blockType: BlockType.COMMAND, opcode: 'setLED', text: [
    'set LED [ARG1]',
    'LEDを [ARG1]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'onoff' },
}},

{blockType: BlockType.REPORTER, opcode: 'enumColor', text: '[ARG1] .', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'color' },
}},

{blockType: BlockType.REPORTER, opcode: 'enumWalkcmd', text: '[ARG1] .', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'walkcmd' },
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

calibC: { acceptReporters: true, items: [
{ text: ['forward_C','前＋'][this._locale], value: '1' },
{ text: ['back_C','後＋'][this._locale], value: '0' },
{ text: ['get','現在値'][this._locale], value: '2' },
{ text: ['reset','リセット'][this._locale], value: '3' },
{ text: ['reset_all','全リセット'][this._locale], value: '4' },
]},

calibK: { acceptReporters: true, items: [
{ text: ['up_K','上＋'][this._locale], value: '1' },
{ text: ['down_K','下＋'][this._locale], value: '0' },
{ text: ['get','現在値'][this._locale], value: '2' },
{ text: ['reset','リセット'][this._locale], value: '3' },
{ text: ['reset_all','全リセット'][this._locale], value: '4' },
]},

color: { acceptReporters: true, items: [
{ text: ['off','消す'][this._locale], value: '0' },
{ text: ['red','赤色'][this._locale], value: '1' },
{ text: ['green','緑色'][this._locale], value: '2' },
{ text: ['blue','青色'][this._locale], value: '3' },
{ text: ['yellow','黄色'][this._locale], value: '4' },
{ text: ['purple','紫色'][this._locale], value: '5' },
{ text: ['lightblue','水色'][this._locale], value: '6' },
]},

crotchF: { acceptReporters: true, items: ['-70','0','60',]},

crotchR: { acceptReporters: true, items: ['-90','0','45',]},

digital: { acceptReporters: true, items: [
{ text: 'HIGH', value: '1' },
{ text: 'LOW', value: '0' },
]},

knee: { acceptReporters: true, items: ['-25','0','60','100',]},

leg: { acceptReporters: true, items: [
{ text: ['FrontR','右前脚'][this._locale], value: '0' },
{ text: ['FrontL','左前脚'][this._locale], value: '2' },
{ text: ['RearR','右後脚'][this._locale], value: '1' },
{ text: ['RearL','左後脚'][this._locale], value: '3' },
]},

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

speed: { acceptReporters: true, items: [
{ text: ['sslow','超低速'][this._locale], value: '2000' },
{ text: ['slow','低速'][this._locale], value: '1000' },
{ text: ['typical','普通'][this._locale], value: '500' },
{ text: ['fast','高速'][this._locale], value: '200' },
{ text: ['high','超高速'][this._locale], value: '100' },
]},

walkcmd: { acceptReporters: true, items: [
{ text: ['stop','停止'][this._locale], value: '0' },
{ text: ['fw','前進'][this._locale], value: '1' },
{ text: ['cw','右旋回'][this._locale], value: '2' },
{ text: ['ccw','左旋回'][this._locale], value: '3' },
{ text: ['rw','後進'][this._locale], value: '4' },
{ text: ['right','右移動'][this._locale], value: '5' },
{ text: ['left','左移動'][this._locale], value: '6' },
{ text: ['all_up','しゃがむ'][this._locale], value: '7' },
{ text: ['all_down','伸び'][this._locale], value: '8' },
{ text: ['t_down','後傾斜'][this._locale], value: '9' },
{ text: ['h_down','前傾斜'][this._locale], value: '10' },
{ text: ['l_down','左傾斜'][this._locale], value: '11' },
{ text: ['r_down','右傾斜'][this._locale], value: '12' },
{ text: ['t_up_down','背伸び'][this._locale], value: '13' },
{ text: ['l_r_up','左右傾斜'][this._locale], value: '14' },
{ text: ['all_up_down','スクワット'][this._locale], value: '15' },
{ text: ['neutral','原点調整'][this._locale], value: '16' },
]},

	  };
	}

setWalk(args,util) { return this.sendRecv(arguments.callee.name, args); }
setPoseRF(args,util) { return this.sendRecv(arguments.callee.name, args); }
setPoseLF(args,util) { return this.sendRecv(arguments.callee.name, args); }
setPoseRR(args,util) { return this.sendRecv(arguments.callee.name, args); }
setPoseLR(args,util) { return this.sendRecv(arguments.callee.name, args); }
setStop(args,util) { return this.sendRecv(arguments.callee.name, args); }
calibKnee(args,util) { return this.sendRecv(arguments.callee.name, args); }
calibCrotch(args,util) { return this.sendRecv(arguments.callee.name, args); }
setColorWipe(args,util) { return this.sendRecv(arguments.callee.name, args); }
setRainbow(args,util) { return this.sendRecv(arguments.callee.name, args); }
BuzzerJ2(args,util) { return this.sendRecv(arguments.callee.name, args); }
getSonner(args,util) { return this.sendRecv(arguments.callee.name, args); }
getVbat(args,util) { return this.sendRecv(arguments.callee.name, args); }
setPWM(args,util) { return this.sendRecv(arguments.callee.name, args); }
setLED(args,util) { return this.sendRecv(arguments.callee.name, args); }
enumColor(args) { return args.ARG1; }
enumWalkcmd(args) { return args.ARG1; }

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
