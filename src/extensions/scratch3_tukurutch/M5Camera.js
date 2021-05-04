const extName = 'M5Camera';
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
{name:'M5Camera', type:'esp32', baudrate:921600},
{name:'M5TimerCam', type:'esp32', baudrate:1500000},
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

'---',
{blockType: BlockType.COMMAND, opcode: 'setBatteryConnect', text: 'battery connection [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'0', menu: 'onoff' },
}},

{blockType: BlockType.REPORTER, opcode: 'getBatteryVoltage', text: 'battery voltage', arguments: {
}},

'---',
'---',
'---',
{blockType: BlockType.COMMAND, opcode: 'setLED', text: [
    'set LED [ARG1]',
    'LED [ARG1]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'1', menu: 'onoff' },
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

onoff: { acceptReporters: true, items: [
{ text: 'On', value: '1' },
{ text: 'Off', value: '0' },
]},

	  };
	}

setBatteryConnect(args,util) { return this.sendRecv(arguments.callee.name, args); }
getBatteryVoltage(args,util) { return this.sendRecv(arguments.callee.name, args); }
setLED(args,util) { return this.sendRecv(arguments.callee.name, args); }

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
