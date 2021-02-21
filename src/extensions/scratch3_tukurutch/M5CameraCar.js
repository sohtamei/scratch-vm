const extName = 'M5CameraCar';
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
        if(typeof SupportCamera === "undefined") SupportCamera = false;
        this.comlib = new comlib(extName, SupportCamera);
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
            blockIconURI: IconURI,  // Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
            menuIconURI: IconURI,   // Icon png to be displayed in the blocks category menu, encoded as a data URI.
            blocks: this.get_blocks(),
            menus: this.get_menus(),
        };
    }
    
	get_blocks() {
		this.flashList = [
{name:'M5CameraCar', type:'esp32', baudrate:230400},
{name:'M5TimerCam', type:'esp32', baudrate:230400},
		];

		this._blocks = [
{blockType: BlockType.COMMAND, opcode: 'setConfig', text: '[ARG1] IP=[ARG2]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: this.ifType, menu: 'ifType' },
	ARG2: { type: ArgumentType.STRING, defaultValue: this.ipadrs},
}},

{blockType: BlockType.COMMAND, opcode: 'burnFlash', text: [
    'burn [ARG1]',
    '[ARG1]書き込み',
][this._locale], arguments: {
	ARG1: { type: ArgumentType.NUMBER, defaultValue: 0, menu: 'flashList' },
}},

{blockType: BlockType.COMMAND, opcode: 'setCar', text: [
    '[ARG1] at speed [ARG2] calib [ARG3] duration [ARG4]',
    '[ARG1] 向きに [ARG2] の速さで動かす(補正 [ARG3] , [ARG4] ms)',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'direction' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:4, menu: 'speed' },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG4: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'setMotor', text: [
    'set motor left [ARG1] right [ARG2] calib [ARG3] duration [ARG4]',
    '左 [ARG1] 右 [ARG2] で動かす(補正 [ARG3] , [ARG4] ms)',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:4, menu: 'speed' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:4, menu: 'speed' },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG4: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'setServo', text: [
    'set servo [ARG1] [ARG2]',
    'サーボ [ARG1] の角度を [ARG2] にする',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0, menu: 'servoch' },
    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:90 },
}},

{blockType: BlockType.COMMAND, opcode: 'setPwm', text: [
    'set motor [ARG1] pwm [ARG2]',
    'サーボ [ARG1] にPWM [ARG2] を設定',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0, menu: 'servoch' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:307 },
}},

{blockType: BlockType.COMMAND, opcode: 'stopCar', text: [
    'stop',
    'ストップ',
][this._locale], arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'enumDirection', text: '[ARG1] .', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'direction' },
}},

{blockType: BlockType.COMMAND, opcode: 'setLED', text: [
    'set LED [ARG1]',
    'LED [ARG1]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'onoff' },
}},

{blockType: BlockType.REPORTER, opcode: 'downloadCal', text: [
    'download calibration [ARG1] [ARG2]',
    '補正データダウンロード ID=[ARG1] データ[ARG2]',
][this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:1 },
    ARG2: { type: ArgumentType.STRING, type2:'s', defaultValue:'' },
}},

{blockType: BlockType.REPORTER, opcode: 'getCal', text: [
    'get cal',
    '補正データ表示',
][this._locale], arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'setBatteryConnect', text: 'battery connection [ARG1]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0, menu: 'onoff' },
}},

{blockType: BlockType.REPORTER, opcode: 'getBatteryVoltage', text: 'battery voltage', arguments: {
}},

'---',
{blockType: BlockType.REPORTER, opcode: 'statusWifi', text: 'status WIFI', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'scanWifi', text: 'scan WIFI', arguments: {
}},

{blockType: BlockType.REPORTER, opcode: 'connectWifi', text: 'connect WIFI [ARG1] [ARG2]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'ssid' },
    ARG2: { type: ArgumentType.STRING, type2:'s', defaultValue:'pass' },
}},

		];
		return this._blocks;
	}

	get_menus() {
		this.flashItems = [];
		for(let i = 0; i < this.flashList.length; i++)
			this.flashItems[i] = { text:this.flashList[i].name, value:i };

	  return {
ifType: { acceptReporters: true, items: ['WLAN','UART',]},

flashList: { acceptReporters: true, items: this.flashItems },

direction: { acceptReporters: true, items: [
{ text: ['stop','ストップ'][this._locale], value: 0 },
{ text: ['run forward','前'][this._locale], value: 1 },
{ text: ['turn left','左'][this._locale], value: 2 },
{ text: ['turn right','右'][this._locale], value: 3 },
{ text: ['run backward','後'][this._locale], value: 4 },
{ text: ['rotate left','左旋回'][this._locale], value: 5 },
{ text: ['rotate right','右旋回'][this._locale], value: 6 },
{ text: ['calibration','原点調整'][this._locale], value: 7 },
]},

onoff: { acceptReporters: true, items: [
{ text: 'On', value: 1 },
{ text: 'Off', value: 0 },
]},

servoch: { acceptReporters: true, items: ['0','1',]},

speed: { acceptReporters: true, items: ['4','2','1','0','-1','-2','-4',]},

	  };
	}

setCar(args,util) { return this.sendRecv(arguments.callee.name, args); }
setMotor(args,util) { return this.sendRecv(arguments.callee.name, args); }
setServo(args,util) { return this.sendRecv(arguments.callee.name, args); }
setPwm(args,util) { return this.sendRecv(arguments.callee.name, args); }
stopCar(args,util) { return this.sendRecv(arguments.callee.name, args); }
enumDirection(args) { return args.ARG1; }
setLED(args,util) { return this.sendRecv(arguments.callee.name, args); }
downloadCal(args,util) { return this.sendRecv(arguments.callee.name, args); }
getCal(args,util) { return this.sendRecv(arguments.callee.name, args); }
setBatteryConnect(args,util) { return this.sendRecv(arguments.callee.name, args); }
getBatteryVoltage(args,util) { return this.sendRecv(arguments.callee.name, args); }
statusWifi(args,util) { return this.sendRecv(arguments.callee.name, args); }
scanWifi(args,util) { return this.sendRecv(arguments.callee.name, args); }
connectWifi(args,util) { return this.sendRecv(arguments.callee.name, args); }

	setConfig(args) {
		return this.comlib.setConfig(args.ARG1, args.ARG2);
	}

	burnFlash(args) {
		return this.comlib.burnWlan(this.flashList[Number(args.ARG1)]);
	}

	sendRecv(opcode,args) {
		for(index = 0; index < this._blocks.length; index++) {
			if(this._blocks[index].opcode == opcode) {
				return this.comlib.sendRecv(index-1, this._blocks[index].arguments, args);
			}
		}
		return 0;
	}
}
module.exports = Scratch3Blocks;
