"use strict";
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const comMesh = require('./comMesh.js');

const menuIconURI = require('./mesh-small.png');
const iconLed = require('./tagLed.png');
const iconGpio = require('./tagGpio.png');
const iconButton = require('./tagButton.png');
const iconMove = require('./tagMove.png');
const iconMotion = require('./tagMotion.png');
const iconTemp = require('./tagTemp.png');
const iconBright = require('./tagBright.png');

const iconLedNG = require('./tagLedNG.png');
const iconGpioNG = require('./tagGpioNG.png');
const iconButtonNG = require('./tagButtonNG.png');
const iconMoveNG = require('./tagMoveNG.png');
const iconMotionNG = require('./tagMotionNG.png');
const iconTempNG = require('./tagTempNG.png');
const iconBrightNG = require('./tagBrightNG.png');

const PROXIMITY_THRESH = 140;
const BRIGHT_THRESH = 9;//16;

const TAG_TIMEOUT = 5000;
const TAG_INTERVAL = 500;

class MeshBlocks {

	constructor (runtime) {
	//	runtime.dev = this;
		this._runtime = runtime;

	//	this._intervalId = setInterval(this._updateConState.bind(this), 200);

		this._blockList = '';

		// tag
		this._events = [];

		this._shakePara = '';
		this._tapPara = '';
		this._moveUpdated = 0;

		this._brightInitialized = false;
		this._brightResolve = null;
		this._bright = 0;
		this._proximityResolve = null;
		this._proximity = 0;	//

		this._tempResolve = null;
		this._temperature = 0;
		this._humidResolve = null;
		this._humid = 0;

		this._motionPara = '';
		this._motionUpdated = 0;
		this._motionState = false;		//

		this._gpioInitialized = false;
		this._gpioEvent = 0x00;
		this._gpioDinResolve = null;
		this._gpioDin = 0;
		this._gpioAinResolve = null;
		this._gpioAin = 0;
		this._gpioConfig = new Uint8Array([1,1,0,0,0,0,0,0,0,0,0]);
		this._gpioReqId = 0;

		const getTag = function(_prefix, _onImg, _offImg) {
			return {
				prefix:_prefix,
				name:'',
				dev:null,
			//	onImg:_onImg,
			//	offImg:_offImg,
				status:false,
				battery:0, };
		}

		this._tags = {
			button: getTag('BU', iconButton, iconButtonNG),
			led:    getTag('LE', iconLed, iconLedNG),
			move:   getTag('AC', iconMove, iconMoveNG),
			bright: getTag('PA', iconBright, iconBrightNG),
			temp:   getTag('TH', iconTemp, iconTempNG),
			motion: getTag('MD', iconMotion, iconMotionNG),
			gpio:   getTag('GP', iconGpio, iconGpioNG)
		};
	}

	getInfo() {
		this.statusMessage = document.body.querySelector('#StatusMessage');

		let localeStr = formatMessage.setup().locale;
		let locale = (localeStr == 'ja' || localeStr == 'ja-Hira') ? 1: 0;
		this._locale = locale;
	/*
		this._icons = [];
		for(let i = 0; i < 7; i++) {
			this._icons.push({icon:document.body.querySelector('#tagIcon'+i),
							label:document.body.querySelector('#tagName'+i),
							bat:document.body.querySelector('#tagBat'+i)});
		}
	*/
		this._tags.button.name	= ['Button ',	'ボタン　'][locale];
		this._tags.led.name		= ['LED　',		'LED 　　'][locale];
		this._tags.move.name	= ['Move ',		'動き　　'][locale];
		this._tags.bright.name	= ['Bright ',	'明るさ　'][locale];
		this._tags.temp.name	= ['Temp ',		'温度湿度'][locale];
		this._tags.motion.name	= ['Motion ',	'人感　　'][locale];
		this._tags.gpio.name	= ['GPIO　',	'GPIO　　'][locale];

		return {
			id: 'mesh',
			name: ['MESH','MESH'][locale],
			menuIconURI: menuIconURI,
		//	showStatusButton: true,
			color1: '#B0B0B0',
			color2: '#909090',

			blocks: [
			{
				opcode: 'meshStatus',
				blockType: BlockType.REPORTER,
				text: [
					'status',
					'状態',
				][locale],

			// Button TAG
			}, {
				opcode: 'ButtonConnect',
				blockType: BlockType.COMMAND,
				text: '[IMG]'+['connect','接続'][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconButton},
				}
			}, {
				opcode: 'eventButton',
				blockType: BlockType.HAT,
				text: [
					'[IMG] [ARG1]',
					'[IMG] [ARG1]',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconButton},
					ARG1: { type: ArgumentType.STRING, defaultValue: 'ButtonPressed', menu: 'buttonEvents' },
				}

			// LED TAG
			}, '---', {
				opcode: 'LedConnect',
				blockType: BlockType.COMMAND,
				text: '[IMG]'+['connect','接続'][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconLed},
				},
			}, {
				opcode: 'setLED',
				blockType: BlockType.COMMAND,
				text: [
					'[IMG] [ARG1] Color[ARG2] Brightness[ARG3] for[ARG4]s, Cycle[ARG5]s',
					'[IMG] [ARG1] 色[ARG2] 明るさ[ARG3] [ARG4]秒間 [ARG5]秒周期',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconLed},
					ARG1: { type: ArgumentType.STRING, defaultValue: 'LightUp', menu: 'ledReqs' },
					ARG2: { type: ArgumentType.STRING, defaultValue: '#FFFFFF', menu: 'ledColors' },
					ARG3: { type: ArgumentType.STRING, defaultValue: '1', menu: 'ledBrightnesses' },
					ARG4: { type: ArgumentType.NUMBER, defaultValue: 3 },
					ARG5: { type: ArgumentType.NUMBER, defaultValue: 1 },
				}

			// Move TAG
			}, '---', {
				opcode: 'MoveConnect',
				blockType: BlockType.COMMAND,
				text: '[IMG]'+['connect','接続'][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconMove},
				}
			}, {
				opcode: 'eventMove',
				blockType: BlockType.HAT,
				text: [
					'[IMG][ARG1] sense[ARG2]',// [ARG3]sec',
					'[IMG][ARG1] 感度[ARG2]',// [ARG3]秒',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconMove},
					ARG1: { type: ArgumentType.STRING, defaultValue: 'MoveShake', menu: 'moveEvents' },
					ARG2: { type: ArgumentType.STRING, defaultValue: '20', menu: 'moveSense' },
				//	ARG3: { type: ArgumentType.NUMBER, defaultValue: 0.1 },
				}
			}, {
				opcode: 'eventOrient',
				blockType: BlockType.HAT,
				text: [
					'[IMG][ARG1]Orientation ',
					'[IMG][ARG1]向きのとき',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconMove},
					ARG1: { type: ArgumentType.STRING, defaultValue: 'OrientFront', menu: 'moveOrientations' },
				}

			// Brightness TAG
			}, '---', {
				opcode: 'BrightConnect',
				blockType: BlockType.COMMAND,
				text: '[IMG]'+['connect','接続'][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconBright},
				}
			}, {
				opcode: 'getBrightness',
				blockType: BlockType.REPORTER,
				text: [
					'[IMG]Brightness',
					'[IMG]明るさ',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconBright},
				}
			}, {
				opcode: 'getProximity',
				blockType: BlockType.REPORTER,
				text: [
					'[IMG]Proximity',
					'[IMG]近接状態',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconBright},
				}
			}, {
				opcode: 'eventBright',
				blockType: BlockType.HAT,
				text: [
					'[IMG][ARG1]',
					'[IMG][ARG1]',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconBright},
					ARG1: { type: ArgumentType.STRING, defaultValue: 'brightGetDark', menu: 'brightEvents' },
				}

			// Temperature Humid TAG
			}, '---', {
				opcode: 'TempConnect',
				blockType: BlockType.COMMAND,
				text: '[IMG]'+['connect','接続'][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconTemp},
				}
			}, {
				opcode: 'getTemp',
				blockType: BlockType.REPORTER,
				text: [
					'[IMG]Temperature(℃)',
					'[IMG]温度(℃)',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconTemp},
				}
			}, {
				opcode: 'getHumid',
				blockType: BlockType.REPORTER,
				text: [
					'[IMG]Humidity(%)',
					'[IMG]湿度(%)',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconTemp},
				}

			// Motion TAG
			}, '---', {
				opcode: 'MotionConnect',
				blockType: BlockType.COMMAND,
				text: '[IMG]'+['connect','接続'][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconMotion},
				}
			}, {
				opcode: 'getMotion',
				blockType: BlockType.BOOLEAN,
				text: [
					'[IMG]Detecting state [ARG1]sec',
					'[IMG]感知状態 [ARG1]秒',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconMotion},
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 3 },
				}
			}, {
				opcode: 'eventMotion',
				blockType: BlockType.HAT,
				text: [
					'[IMG][ARG1] [ARG2]sec',
					'[IMG][ARG1] [ARG2]秒',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconMotion},
					ARG1: { type: ArgumentType.STRING, defaultValue: 'motionDetected', menu: 'motionEvents' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue: 3 },
				}

			// GPIO TAG
			}, '---', {
				opcode: 'GpioConnect',
				blockType: BlockType.COMMAND,
				text: '[IMG]'+['connect','接続'][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconGpio},
				}
			}, {
				opcode: 'setGpioVout',
				blockType: BlockType.COMMAND,
				text: [
					'[IMG]VOut Supply [ARG1]',
					'[IMG]電源出力 [ARG1]',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconGpio},
					ARG1: { type: ArgumentType.STRING, defaultValue: '0', menu: 'onoff' },
				}
			}, {
				opcode: 'setGpioDout',
				blockType: BlockType.COMMAND,
				text: [
					'[IMG]Digital Output [ARG1] [ARG2]',
					'[IMG]デジタル出力 [ARG1] [ARG2]',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconGpio},
					ARG1: { type: ArgumentType.STRING, defaultValue: '0', menu: 'dout' },
					ARG2: { type: ArgumentType.STRING, defaultValue: '1', menu: 'highlow' },
				}
			}, {
				opcode: 'setGpioPwm',
				blockType: BlockType.COMMAND,
				text: [
					'[IMG]Analog Output  Duty Ratio[ARG1]%',
					'[IMG]アナログ出力  デューティ比[ARG1]%',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconGpio},
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 50 },
				}
			}, {
				opcode: 'getGpioDin',
				blockType: BlockType.REPORTER,
				text: [
					'[IMG]Digital In [ARG1]',
					'[IMG]デジタル入力 [ARG1]',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconGpio},
					ARG1: { type: ArgumentType.STRING, defaultValue: '0', menu: 'din' },
				}
			}, {
				opcode: 'getGpioAin',
				blockType: BlockType.REPORTER,
				text: [
					'[IMG]Analog In',
					'[IMG]アナログ入力',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconGpio},
				}
			}, {
				opcode: 'eventGpioDin',
				blockType: BlockType.HAT,
				text: [
					'[IMG]Digital In [ARG1] [ARG2]',
					'[IMG]デジタル入力 [ARG1] [ARG2]',
				][locale],
				arguments: {
					IMG: { type: ArgumentType.IMAGE, dataURI: iconGpio},
					ARG1: { type: ArgumentType.STRING, defaultValue: '0', menu: 'din' },
					ARG2: { type: ArgumentType.STRING, defaultValue: '0', menu: 'trigger' },
				}

			}],

			menus: {
			// value - number禁止

				buttonEvents: { acceptReporters: true, items: [
					{ text: [
						'Press',
						'1回押されたら',
					][locale], value: 'ButtonPressed' },
					{ text: [
						'Hold',
						'長押しされたら',
					][locale], value: 'ButtonLongPressed' },
					{ text: [
						'Double',
						'2連続で押されたら',
					][locale], value: 'ButtonDoublePressed' },
				]},

				ledReqs: { acceptReporters: true, items: [
					{ text: [
						'Light Up',
						'点灯する',
					][locale], value: 'LightUp' },
					{ text: [
						'Firefly',
						'ふわっと光る',
					][locale], value: 'FireFly' },
					{ text: [
						'Blink',
						'点滅する',
					][locale], value: 'Blink' },
					{ text: [
						'Off',
						'消灯する',
					][locale], value: 'Off' },
				]},

				ledColors: { acceptReporters: true, items: [
					{ text: ['White',		'白色',		][locale], value: '#FFFFFF' },
					{ text: ['Yellow',		'黄色',		][locale], value: '#FFFF00' },
					{ text: ['Yellow Green','黄緑色',	][locale], value: '#80FF00' },
					{ text: ['Green',		'緑色',		][locale], value: '#00FF00' },
					{ text: ['Mint Green',	'ミント',	][locale], value: '#00FF80' },
					{ text: ['Cyan',		'水色',		][locale], value: '#00FFFF' },
					{ text: ['Blue',		'青色',		][locale], value: '#0080FF' },
					{ text: ['Indigo',		'紺色',		][locale], value: '#0000FF' },
					{ text: ['Purple',		'紫色',		][locale], value: '#8000FF' },
					{ text: ['Magenta',		'マゼンタ',	][locale], value: '#FF00FF' },
					{ text: ['Pink',		'ピンク',	][locale], value: '#FF0080' },
					{ text: ['Red',			'赤色',		][locale], value: '#FF0000' },
					{ text: ['Orange',		'オレンジ',	][locale], value: '#FF8000' },
				]},

				ledBrightnesses: { acceptReporters: true, items: ['1','2','3','4','5']},

				motionEvents: { acceptReporters: true, items: [
					{ text: [
						'Detected',
						'感知したら',
					][locale], value: 'motionDetected' },
					{ text: [
						'Undetected',
						'感知しなくなったら',
					][locale], value: 'motionUndetected' },
				]},

				moveEvents: { acceptReporters: true, items: [
					{ text: [
						'Shake',
						'シェイク',
					][locale], value: 'MoveShake' },
					{ text: [
						'Tap',
						'タップ',
					][locale], value: 'MoveTap' },
					{ text: [
						'Flip',
						'ひっくり返されたら',
					][locale], value: 'MoveFlip' },
				]},

				moveSense: { acceptReporters: true, items: ['1','5','10','20','30','40','50','60','70','80','90',]},

				moveOrientations: { acceptReporters: true, items: [
					{ text: ['Front',	'表',][locale], value: 'OrientFront' },
					{ text: ['Left',	'左',][locale], value: 'OrientLeft' },
					{ text: ['Top',		'上',][locale], value: 'OrientTop' },
					{ text: ['Back',	'裏',][locale], value: 'OrientBack' },
					{ text: ['Right',	'右',][locale], value: 'OrientRight' },
					{ text: ['Bottom',	'下',][locale], value: 'OrientBottom' },
				]},

				brightEvents: { acceptReporters: true, items: [
					{ text: [
						'Get Dark',
						'暗くなったら',
					][locale], value: 'brightGetDark' },
					{ text: [
						'Get  Bright',
						'明るくなったら',
					][locale], value: 'brightGetBright' },
					{ text: [
						'Detect Closeness',
						'ふさがれたら',
					][locale], value: 'brightGetNear' },
					{ text: [
						'Detect Openness',
						'ふさぐものが無くなったら',
					][locale], value: 'brightGetNotNear' },
				]},

				onoff: { acceptReporters: true, items: [
					{ text: ['On','オン',][locale], value: '1' },
					{ text: ['Off','オフ',][locale], value: '0' },
				]},

				dout: { acceptReporters: true, items: [
					{ text: 'DOUT1', value: '0' },
					{ text: 'DOUT2', value: '1' },
					{ text: 'DOUT3', value: '2' },
				]},

				highlow: { acceptReporters: true, items: [
					{ text: 'High', value: '1' },
					{ text: 'Low', value: '0' },
				]},

				din: { acceptReporters: true, items: [
					{ text: 'DIN1', value: '0' },
					{ text: 'DIN2', value: '1' },
					{ text: 'DIN3', value: '2' },
				]},

				trigger: { acceptReporters: true, items: [
					{ text: 'High→Low', value: '0' },
					{ text: 'Low→High', value: '1' },
				]},
			}
		};
	}

	// common --------------

	meshStatus(args) {
		return this._blockList;
	}

	_updateTagStatus() {
		let idx = 0;
		let msg = '';
		for(let key in this._tags) {
			const tag = this._tags[key];
			if(tag.dev !== null) {
			//	let icon = this._icons[idx];
				idx++;
				if(tag.status) {
					msg += tag.name + '〇 ' + ['Bat','電池'][this._locale] + tag.battery + '0%\n' ;
				} else {
					msg += tag.name + '―\n' ;
				}
/*
				if(tag.status) {
					icon.label.innerText = tag.name;
					icon.icon.src = tag.onImg;
					if(tag.battery >= 8)      icon.bat.src = iconBat100;
					else if(tag.battery >= 3) icon.bat.src = iconBat70;
					else                      icon.bat.src = iconBat30;
				} else {
					icon.label.innerText = tag.name;
					icon.icon.src = tag.offImg;
					icon.bat.src = iconBatNone;
				}
*/
			}
		}
		console.log(msg);
		this._blockList = msg;
/*
		for(;idx < 7; idx++) {
			this._icons[idx].icon.src = '';
			this._icons[idx].bat.src = '';
			this._icons[idx].label.innerText = '';
		}
*/
	}

	connect(tag, onNotify) {
		if(tag.status) return;

		const _this = this;
		const _tag = tag;
		const dev = new comMesh(this._runtime, onNotify);
		return dev.connect('MESH-100'+_tag.prefix)
		.then(result => {
			if(!dev.isConnected()) {
				throw 'connection error';
			}
			_tag.dev = dev;
			_tag.battery = 0;
			_tag.status = true;
			_this._updateTagStatus();
			return ['connected','接続しました'][_this._locale];
		}).catch(error => {
			console.log(error);

			_tag.dev = null;
			_tag.status = false;
			return ['failed in connection.','接続できませんでした'][_this._locale];
		});
	}

	checkNotify(tag, data) {
		if(data[0] == 0) {
			if(data[1] == 0) {
				if(tag.battery != data[2]) {
					tag.battery = data[2];
					this._updateTagStatus();
				}
			}
		} else if(data[0] == 1) {
			return true;
		}
		return false;
	}

	checkEvent(event) {
		const index = this._events.indexOf(event);
		if (index > -1) {
			this._events.splice(index, 1);
			return true;
		}
		return false;
	}

	setEvent(event) {
		console.log('event:'+event);
		const index = this._events.indexOf(event);
		if(index < 0) this._events.push(event);
	}

	// Button TAG
	ButtonConnect() {
		return this.connect(this._tags.button, this.cbButton.bind(this));
	}

	cbButton(name, buf) {
		if(this.checkNotify(this._tags.button, buf) && buf[1] == 0) {
			const events = ['dummy', 'ButtonPressed', 'ButtonLongPressed', 'ButtonDoublePressed'];	// 1:短押し、2:長押し、3:2回押し
			if(buf[2] < events.length)
				this.setEvent(events[buf[2]]);
		}
	}

	eventButton(args) {
		if(!this._tags.button.status) return;
		return this.checkEvent(args.ARG1);
	}

	// LED TAG
	LedConnect() {
		return this.connect(this._tags.led, this.cbLED.bind(this));
	}

	cbLED(name, buf) {
		if(this.checkNotify(this._tags.led, buf)) {
			;
		}
	}

	setLED(args) {
		if(!this._tags.led.status) return ['not connected', '未接続',][this._locale];

		let red   = 0;
		let green = 0;
		let blue  = 0;
		let duration = 0;
		let onPeriod = 0;
		let offPeriod = 0;
		let lightingPattern = 1;
		let color = parseInt(args.ARG2.slice(1),16);

		switch(args.ARG1) {
		case 'LightUp':
		case 'FireFly':
		case 'Blink':
			let brightness = [0.1, 0.2, 0.3, 0.65, 1.0][args.ARG3-1];
			red   = ((color>>16)&0xFF) * brightness / 2;
			green = ((color>>8 )&0xFF) * brightness / 2;
			blue  = ((color>>0 )&0xFF) * brightness / 2;
			duration = args.ARG4 * 1000;
			if(duration == 0 || duration > 0xFFFF) duration = 0xFFFF;

			switch(args.ARG1) {
			case 'LightUp':
				onPeriod = 100;
				offPeriod = 0;
				lightingPattern = 1;
				break;
			case 'FireFly':
				onPeriod = 0.9 * args.ARG5 * 1000;
				offPeriod = 0.1 * args.ARG5 * 1000;
				lightingPattern = 2;
				break;
			case 'Blink':
				onPeriod = 0.5 * args.ARG5 * 1000;
				offPeriod = 0.5 * args.ARG5 * 1000;
				lightingPattern = 1;
				break;
			}
			break;

		case 'Off':
		default :
			break;
		}

		return this._tags.led.dev.writeWoResp(
										[1,0,
										red,0,
										green,0,
										blue,
										duration&0xFF,  duration>>8,
										onPeriod&0xFF,  onPeriod>>8,
										offPeriod&0xFF, offPeriod>>8,
										lightingPattern,
										0])
		.then(result => new Promise(resolve => setTimeout(() => {resolve(result);}, TAG_INTERVAL)));
	}

	// Move TAG
	MoveConnect() {
		return this.connect(this._tags.move, this.cbMove.bind(this));
	}

	cbMove(name, buf) {
		if(this.checkNotify(this._tags.move, buf)) {
			if(buf[1] == 3) {
				let events = ['dummy', 'OrientRight', 'OrientBottom', 'OrientFront', 'OrientBack', 'OrientTop', 'OrientLeft'];
				if(buf[2] < events.length)
					this.setEvent(events[buf[2]]);
			} else {
				let events = ['MoveTap', 'MoveShake', 'MoveFlip'];
				if(buf[1] < events.length)
					this.setEvent(events[buf[1]]);
			}
		}
	}

	eventMove(args) {
		if(!this._tags.move.status) return;

		const _this = this;
		if(args.ARG1 == 'MoveShake' && this._shakePara != args.ARG2 && (performance.now()-this._moveUpdated)>2000) {
			this._shakePara = args.ARG2;
			this._moveUpdated = performance.now();
			let data  = new Uint8Array([1,0,1,1,			// shake閾値
										0,0,0,0,
										0,]);
			let dv = new DataView(data.buffer);
			dv.setFloat32(4, ((args.ARG2 - 1) / 99) * 2.2 + 1.1, true);
			this._tags.move.dev.writeWoResp(data);
		}

		if(args.ARG1 == 'MoveTap' && this._tapPara != args.ARG2 && (performance.now()-this._moveUpdated)>2000) {
			this._tapPara = args.ARG2;
			this._moveUpdated = performance.now();
			let data  = new Uint8Array([1,0,0,1,			// tap閾値
										0,0,0,0,
										0,]);
			let dv = new DataView(data.buffer);
			dv.setFloat32(4, ((args.ARG2 - 1) / 99) * 2 + 2.5, true);
			this._tags.move.dev.writeWoResp(data);
		}
		return this.checkEvent(args.ARG1);
	}

	eventOrient(args) {
		if(!this._tags.move.status) return;
		return this.checkEvent(args.ARG1);
	}

	// Brightness TAG
	BrightConnect() {
		return this.connect(this._tags.bright, this.cbBright.bind(this));
	}

	cbBright(name, buf) {
		if(this.checkNotify(this._tags.bright, buf) && buf[1] == 0) {
			let _proximity	= buf[4]|(buf[5]<<8);
			let _brightness	= buf[6]|(buf[7]<<8);
			console.log('eventBright='+buf[3].toString(16)
					 + ' proximity='+_proximity
					 + ' brightness='+_brightness);
			// bit2:proximity変化
			// bit3:brightness変化
			// bit4:単発通知

			     if(_proximity >= PROXIMITY_THRESH && this._proximity < PROXIMITY_THRESH)  this.setEvent('brightGetNear');		// ふさがれたら
			else if(_proximity < PROXIMITY_THRESH && this._proximity >= PROXIMITY_THRESH)  this.setEvent('brightGetNotNear');	// ふさぐものが無くなったら
			this._proximity = _proximity;

			     if(_brightness >= BRIGHT_THRESH && this._bright < BRIGHT_THRESH)  this.setEvent('brightGetBright');	// 明るくなったら
			else if(_brightness < BRIGHT_THRESH && this._bright >= BRIGHT_THRESH)  this.setEvent('brightGetDark');		// 暗くなったら
			this._bright = _brightness;

			if(this._brightResolve) {
				this._brightResolve(this._bright);
				this._brightResolve = null;
			}
			if(this._proximityResolve) {
				this._proximityResolve(this._proximity);
				this._proximityResolve = null;
			}
		}
	}

	eventBright(args) {
		if(!this._tags.bright.status) return;
		if(!this._brightInitialized) {
			this._brightInitialized = true;
			let data  = new Uint8Array([1,0,0,			// モード設定
										PROXIMITY_THRESH&0xFF,PROXIMITY_THRESH>>8,	// 近接max
										PROXIMITY_THRESH&0xFF,PROXIMITY_THRESH>>8,	// 近接min
										0&0xFF,0>>8,		// 照度max
										0&0xFF,0>>8,		// 照度min
										0,					// 近接条件
										0,					// 照度条件
										2,2,2,				// 近接センサ,ALS0,ALS1
										(1<<2)|(1<<3),		// 近接&照度変化 通知
										0,]);
			this._tags.bright.dev.writeWoResp(data);
		}
		return this.checkEvent(args.ARG1);
	}

	getBrightness(args) {
		if(this._brightResolve) return this._bright;
		return this._getBrightProximity(args, 0);
	}

	getProximity(args) {
		if(this._proximityResolve) return this._proximity;
		return this._getBrightProximity(args, 1);
	}

	_getBrightProximity(args, mode) {
		if(!this._tags.bright.status) return ['not connected', '未接続',][this._locale];

		const _this = this;
		let hTimeout = null;
		return new Promise((resolve,reject) => {
			hTimeout = setTimeout(reject, TAG_TIMEOUT);
			if(mode) {
				_this._proximityResolve = resolve;
				if(_this._brightResolve) return;
			} else {
				_this._brightResolve = resolve;
				if(_this._proximityResolve) return;
			}

			return _this._tags.bright.dev.writeWoResp(
												[1,0,0,
												PROXIMITY_THRESH&0xFF,PROXIMITY_THRESH>>8,	// 近接max
												PROXIMITY_THRESH&0xFF,PROXIMITY_THRESH>>8,	// 近接min
												0&0xFF,0>>8,		// 照度max
												0&0xFF,0>>8,		// 照度min
												0,					// 近接条件
												0,					// 照度条件
												2,2,2,				// 近接センサ,ALS0,ALS1
												(1<<4),				// 通知
												0]);
		}).then(result => {
			clearTimeout(hTimeout);
			return result;
		}).catch(() => {
			if(mode) _this._proximityResolve = null;
			else     _this._brightResolve = null;
			console.log('timeout');
			return 'timeout';
		})
	}

	// Temperature Humid TAG
	TempConnect() {
		return this.connect(this._tags.temp, this.cbTemp.bind(this));
	}

	cbTemp(name, buf) {
		if(this.checkNotify(this._tags.temp, buf) && buf[1] == 0) {
			let dv = new DataView(buf.buffer);
		//	this._tempEvent		|= (buf[3] & ~0x10);
			this._temperature	= dv.getInt16(4,true)/10;
			this._humid			= dv.getUint16(6,true);
			if(this._humid > 100) this._humid = 100;
			if(this._humid < 0) this._humid = 0;
			console.log('temp='+this._temperature + ' humid='+this._humid);

			/*if(buf[3]&(1<<4))*/ {
				if(this._tempResolve) {
					this._tempResolve(this._temperature);
					this._tempResolve = null;
				}
				if(this._humidResolve) {
					this._humidResolve(this._humid);
					this._humidResolve = null;
				}
				this._error = null;
			}
		}
	}

	getTemp(args) {
		if(this._tempResolve) return this._temperature;
		return this._getTempHumid(args, 0);
	}

	getHumid(args) {
		if(this._HumidResolve) return this._humid;
		return this._getTempHumid(args, 1);
	}

	_getTempHumid(args, mode) {
		if(!this._tags.temp.status) return ['not connected', '未接続',][this._locale];

		const _this = this;
		let hTimeout = null;
		return new Promise((resolve,reject) => {
			hTimeout = setTimeout(reject, TAG_TIMEOUT);
			if(mode) {
				_this._humidResolve = resolve;
				if(_this._tempResolve) return;
			} else {
				_this._tempResolve = resolve;
				if(_this._humidResolve) return;
			}

			return _this._tags.temp.dev.writeWoResp(
												[1,0,0,
												0,0,		// 温度max
												0,0,		// 温度min
												0,0,		// 湿度max
												0,0,		// 湿度min
												0,			// 温度条件
												0,			// 湿度条件
												0x10,		// 通知
												0]);
		}).then(result => {
			clearTimeout(hTimeout);
			return result;
		}).catch(() => {
			if(mode) _this._humidResolve = null;
			else     _this._tempResolve = null;
			console.log('timeout');
			return 'timeout';
		})
	}

	// Motion TAG
	MotionConnect() {
		return this.connect(this._tags.motion, this.cbMotion.bind(this));
	}

	cbMotion(name, buf) {
		if(this.checkNotify(this._tags.motion, buf) && buf[1] == 0) {
			let state = (buf[3] == 1) ? true: false;
			console.log('motion:'+this._motionState*1+'=>'+state*1);
			     if(!this._motionState && state)	this.setEvent('motionDetected');	// 感知したら
			else if(this._motionState && !state)	this.setEvent('motionUndetected');	// 感知しなくなったら
			this._motionState = state;
		}
	}

	getMotion(args) {
		if(!this._tags.motion.status) return ['not connected', '未接続',][this._locale];

		this._initMotion(args.ARG1);
		return this._motionState;
	}

	eventMotion(args) {
		if(!this._tags.motion.status) return;
		if(args.ARG1 == 'motionDetected')
			this._initMotion(args.ARG2);
		return this.checkEvent(args.ARG1);
	}

	_initMotion(para) {
		if(this._motionPara != para && (performance.now()-this._motionUpdated)>2000) {
			this._motionPara = para;
			this._motionUpdated = performance.now();
			let mask = para*1000;
			return this._tags.motion.dev.writeWoResp(
												[1,0,0,
												3,
												mask&0xFF,mask>>8,
												mask&0xFF,mask>>8,
												0]);
		}
	}

	// Gpio TAG
	GpioConnect() {
		return this.connect(this._tags.gpio, this.cbGpio.bind(this));
	}

	cbGpio(name, buf) {
		if(this.checkNotify(this._tags.gpio, buf)) {
			switch(buf[1]) {
			case 0:						// din event
				this._gpioEvent |= (1<<buf[2])<<(buf[3] ? 4: 0);
				break;
			case 1:						// ain event
				break;
			case 2:
				this._gpioDin = buf[4] ^ 1;
				if(this._gpioDinResolve) {
					this._gpioDinResolve(this._gpioDin);
					this._gpioDinResolve = null;
				}
				break;
			case 3:
				this._gpioAin = buf[4]*300/255;
				if(this._gpioAinResolve) {
					this._gpioAinResolve(this._gpioAin);
					this._gpioAinResolve = null;
				}
				break;
			}
		}
	}

	setGpioVout(args) {
		if(!this._tags.gpio.status) return ['not connected', '未接続',][this._locale];
		this._gpioConfig[6] = (args.ARG1*1) ? 1: 2;
		return this._tags.gpio.dev.writeWoResp(this._gpioConfig)
		.then(result => new Promise(resolve => setTimeout(() => {resolve(result);}, TAG_INTERVAL)));
	}

	setGpioDout(args) {
		if(!this._tags.gpio.status) return ['not connected', '未接続',][this._locale];
		let flag = 1<<args.ARG1;
		if(args.ARG2*1)
			this._gpioConfig[4] |= flag;
		else
			this._gpioConfig[4] &= ~flag;
		return this._tags.gpio.dev.writeWoResp(this._gpioConfig)
		.then(result => new Promise(resolve => setTimeout(() => {resolve(result);}, TAG_INTERVAL)));
	}

	setGpioPwm(args) {
		if(!this._tags.gpio.status) return ['not connected', '未接続',][this._locale];
		this._gpioConfig[5] = args.ARG1*1;
		return this._tags.gpio.dev.writeWoResp(this._gpioConfig)
		.then(result => new Promise(resolve => setTimeout(() => {resolve(result);}, TAG_INTERVAL)));
	}

	getGpioDin(args) {
		if(!this._tags.gpio.status) return ['not connected', '未接続',][this._locale];
		if(this._gpioDinResolve) return this._gpioDin;

		const _this = this;
		let hTimeout = null;
		return new Promise((resolve,reject) => {
			_this._gpioDinResolve = resolve;
			hTimeout = setTimeout(reject, TAG_TIMEOUT);

			return _this._tags.gpio.dev.writeWoResp(
												[1,2,
												_this._gpioReqId++ & 0xFF,
												args.ARG1*1,
												0]);
		}).then(result => {
			clearTimeout(hTimeout);
			return result;
		}).catch(() => {
			_this._gpioDinResolve = null;
			console.log('timeout');
			return 'timeout';
		})
	}

	getGpioAin(args) {
		if(!this._tags.gpio.status) return ['not connected', '未接続',][this._locale];
		if(this._gpioAinResolve) return this._gpioAin;

		const _this = this;
		let hTimeout = null;
		return new Promise((resolve,reject) => {
			_this._gpioAinResolve = resolve;
			hTimeout = setTimeout(reject, TAG_TIMEOUT);

			return _this._tags.gpio.dev.writeWoResp(
												[1,3,
												_this._gpioReqId++ & 0xFF,
												1,		// 0-50ms cycle, 1-once, 2-50ms & updated
												0]);
		}).then(result => {
			clearTimeout(hTimeout);
			return result;
		}).catch(() => {
			_this._gpioAinResolve = null;
			console.log('timeout');
			return 'timeout';
		})
	}

	eventGpioDin(args) {
		if(!this._tags.gpio.status) return;
		if(!this._gpioInitialized) {
			this._gpioInitialized = true;
			this._gpioConfig[2] = 7;	// DIN1~3, L->H
			this._gpioConfig[3] = 7;	// DIN1~3, H->L
			this._tags.gpio.dev.writeWoResp(this._gpioConfig);
		}

		let flag = (1<<args.ARG1)<<(args.ARG2*1 ? 0: 4);
		let event = false;
		if(this._gpioEvent & flag) {
			this._gpioEvent &= ~flag;
			event = true;
		}
		return event;
	}
}
module.exports = MeshBlocks;
