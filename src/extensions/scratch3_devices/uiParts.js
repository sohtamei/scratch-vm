/* copyright (C) 2021 SohtaMei. */

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const Color = require('../../util/color');
const StageLayering = require('../../engine/stage-layering');

const IconURI = require('./tukurutch-small.png');

const attributes = [{ color4f: [1,0,0,1], diameter: 1 },	// R
					{ color4f: [0,0,1,1], diameter: 1 },	// B
					{ color4f: [0,1,0,1], diameter: 1 }];	// G

class Scratch3Blocks {
	constructor (runtime) {
		this.runtime = runtime;

		this.plotX = 240;
		this.plotY = [0,0,0];

		this._penSkinId = this.runtime.renderer.createPenSkin();
		this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
		this.runtime.renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
		
        this._keysPressed = [];
        this._keysReleased = [];

		this.runtime.on('KEY_PRESSED', key => {
			console.log('on :'+key);
			const index = this._keysPressed.indexOf(key);
			if(index < 0) this._keysPressed.push(key);
		});

		this.runtime.on('KEY_RELEASED', key => {
			console.log('off :'+key);
			const index = this._keysReleased.indexOf(key);
			if(index < 0) this._keysReleased.push(key);
		});

		this.mouseState = 'up';
		this.mouseEvent = [];
		this.mouseX = 0;
		this.mouseY = 0;

		this.runtime.on('MOUSE', event => this.gotMouse(event));

		this.gamepadTimerMilliSec = 1000/30;
		this.gamepadTimerId = null;
		this.gamepadIndex = -1;

		this.padButton = 0;
		this.gamepadButtons = new Array(12);
		this.gamepadHat = 'center';
		this.buttonEvent = [];

		this.PadX = 0;
		this.PadY = 0;
		this.gamepadAxes = [0,0,0,0];
	}

	getInfo () {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}
		this.initGamepad();

		return {
			id: 'uiParts',
			name: ['UI parts','UIパーツ'][this._locale],
			menuIconURI: IconURI,
			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'setVideoTransparency', text: ['video transparency','ビデオ透明度'][this._locale]+'[ARG1]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 20 },
				}},

				'---',

				{blockType: BlockType.COMMAND, opcode: 'plot1', text: ['graph ch','グラフ チャンネル'][this._locale]+'[ARG1]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 1 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'plot2', text: ['graph ch','グラフ チャンネル'][this._locale]+'[ARG1] [ARG2]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 1 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue: 2 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'plot3', text: ['graph ch','グラフ チャンネル'][this._locale]+'[ARG1] [ARG2] [ARG3]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 1 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue: 2 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue: 3 },
				}},

				'---',

				{blockType: BlockType.HAT, opcode:'whenKeyPressed', text: formatMessage({id: 'makeymakey.whenKeyPressed', default: 'when [KEY] key pressed'}),  arguments: {
					KEY: { type: ArgumentType.STRING, defaultValue: 'up arrow', menu: 'keyEvent'}
				}},

				{blockType: BlockType.HAT, opcode:'whenKeyReleased', text: ['when [KEY] key released','[KEY]キーをはなしたとき'][this._locale], arguments: {
					KEY: { type: ArgumentType.STRING, defaultValue: 'up arrow', menu: 'keyEvent'}
				}},

				'---',

				{blockType: BlockType.HAT, opcode: 'eventMouse', text: ['When Mouse[ARG1]','マウス[ARG1]たとき'][this._locale], arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: 'down', menu: 'mouseEvent' },
				}},

				{blockType: BlockType.BOOLEAN, opcode: 'isMouse', text: ['is Mouse[ARG1]','マウス[ARG1]ている'][this._locale], arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: 'down', menu: 'mouseEvent' },
				}},

				'---',

				{blockType: BlockType.REPORTER, opcode: 'getGamepadAxes', text: ['gamepad stick','ゲームパッドスティック'][this._locale]+'[ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: '1', menu: 'gamepadAxes' },
				}},

				'---',

				{blockType: BlockType.REPORTER, opcode: 'xxx', text: ['↓ use "PAD" stage','↓ "PAD" ステージを使って下さい'][this._locale], disableMonitor: true, arguments: {
				}},

				{blockType: BlockType.HAT, opcode: 'eventButton', text: ['button Event[ARG1]','[ARG1]が押されたとき'][this._locale], arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: 'button1', menu: 'buttonEvent' },
				}},

				{blockType: BlockType.REPORTER, opcode: 'getPadX', text: ['pad X','パッドX'][this._locale], arguments: {
				}},

				{blockType: BlockType.REPORTER, opcode: 'getPadY', text: ['pad Y','パッドY'][this._locale], arguments: {
				}},
			],
			menus: {
				mouseEvent: { acceptReporters: true, items: [
				{ text: ['down','下げ'][this._locale], value: 'down'},
				{ text: ['up','上げ'][this._locale], value: 'up'},
				]},

				keyEvent: { acceptReporters: true, items: [
				{ text: formatMessage({id: 'makeymakey.spaceKey'}), value: 'space' },
				{ text: formatMessage({id: 'makeymakey.upArrow'}), value: 'up arrow' },
				{ text: formatMessage({id: 'makeymakey.downArrow'}), value: 'down arrow' },
				{ text: formatMessage({id: 'makeymakey.rightArrow'}), value: 'right arrow' },
				{ text: formatMessage({id: 'makeymakey.leftArrow'}), value: 'left arrow' },
				{ text: formatMessage({id: 'microbit.buttonsMenu.any'}), value: 'any' },
				{ text: 'a', value: 'A' },
				{ text: 'b', value: 'B' },
				{ text: 'c', value: 'C' },
				{ text: 'd', value: 'D' },
				{ text: 'e', value: 'E' },
				{ text: 'f', value: 'F' },
				{ text: 'g', value: 'G' },
				{ text: 'h', value: 'H' },
				{ text: 'i', value: 'I' },
				{ text: 'j', value: 'J' },
				{ text: 'k', value: 'K' },
				{ text: 'l', value: 'L' },
				{ text: 'm', value: 'M' },
				{ text: 'n', value: 'N' },
				{ text: 'o', value: 'O' },
				{ text: 'p', value: 'P' },
				{ text: 'q', value: 'Q' },
				{ text: 'r', value: 'R' },
				{ text: 's', value: 'S' },
				{ text: 't', value: 'T' },
				{ text: 'u', value: 'U' },
				{ text: 'v', value: 'V' },
				{ text: 'w', value: 'W' },
				{ text: 'x', value: 'X' },
				{ text: 'y', value: 'Y' },
				{ text: 'z', value: 'Z' },
				{ text: '0', value: '0' },
				{ text: '1', value: '1' },
				{ text: '2', value: '2' },
				{ text: '3', value: '3' },
				{ text: '4', value: '4' },
				{ text: '5', value: '5' },
				{ text: '6', value: '6' },
				{ text: '7', value: '7' },
				{ text: '8', value: '8' },
				{ text: '9', value: '9' },
				]},
					
				buttonEvent: { acceptReporters: true, items: [
				{ text: ['center','センター'][this._locale],	value: 'center' },
				{ text: ['up left','左上'][this._locale],		value: 'UL' },
				{ text: ['up','上'][this._locale],				value: 'U' },
				{ text: ['up right','右上'][this._locale],		value: 'UR' },
				{ text: ['left','左'][this._locale],			value: 'L' },
				{ text: ['right','右'][this._locale],			value: 'R' },
				{ text: ['down left','左下'][this._locale],		value: 'DL' },
				{ text: ['down','下'][this._locale],			value: 'D' },
				{ text: ['down right','右下'][this._locale],	value: 'DR' },
				{ text: ['noButton','なし'][this._locale],		value: 'noButton' },
				{ text: ['button1','ボタン1'][this._locale],	value: 'button1' },
				{ text: ['button2','ボタン2'][this._locale],	value: 'button2' },
				{ text: ['button3','ボタン3'][this._locale],	value: 'button3' },
				{ text: ['button4','ボタン4'][this._locale],	value: 'button4' },
				{ text: ['button5','ボタン5'][this._locale],	value: 'button5' },
				{ text: ['button6','ボタン6'][this._locale],	value: 'button6' },
				{ text: ['button7','ボタン7'][this._locale],	value: 'button7' },
				{ text: ['button8','ボタン8'][this._locale],	value: 'button8' },
				{ text: ['button9','ボタン9'][this._locale],	value: 'button9' },
				{ text: ['button10','ボタン10'][this._locale],	value: 'button10' },
				{ text: ['button11','ボタン11'][this._locale],	value: 'button11' },
				{ text: ['button12','ボタン12'][this._locale],	value: 'button12' },
				]},

				gamepadAxes: { acceptReporters: true, items: ['1','2','3','4']},
			}
		};
	}

	setVideoTransparency(args) {
		this.runtime.ioDevices.video.setPreviewGhost(args.ARG1*1);
	}

	plot1(args, util) { return this.plot(args, util, 1); }
	plot2(args, util) { return this.plot(args, util, 2); }
	plot3(args, util) { return this.plot(args, util, 3); }

	plot(args, util, num) {
		let y = [0,0,0];
		let offset = null;

		let i;
		for(i = 0; i < num; i++) {
			switch(i) {
			case 0: y[0] = parseInt(args.ARG1,10); offset = [0]; break;
			case 1: y[1] = parseInt(args.ARG2,10); offset = [100,-100]; break;
			case 2: y[2] = parseInt(args.ARG3,10); offset = [100,0,-100]; break;
			}
		}

		let x = this.plotX + 1;
		if(x > 240) {
			x = -240;
			this.runtime.renderer.penClear(this._penSkinId);
		} else {
			for(i = 0; i < num; i++)
				this.runtime.renderer.penLine(this._penSkinId, attributes[i], this.plotX, this.plotY[i]+offset[i], x, y[i]+offset[i]);
		}
		//this.runtime.requestRedraw();
		this.plotX = x;
		for(i = 0; i < num; i++) this.plotY[i] = y[i];
	}

	whenKeyPressed(args) {
		if(args.KEY == 'any') {
			if(this._keysPressed.length > 0) {
				this._keysPressed = [];
				return true;
			}
		} else {
			const index = this._keysPressed.indexOf(args.KEY);
			if(index > -1) {
				this._keysPressed.splice(index, 1);
				return true;
			}
		}
		return false;
	}

	whenKeyReleased(args) {
		if(args.KEY == 'any') {
			if(this._keysReleased.length > 0) {
				this._keysReleased = [];
				return true;
			}
		} else {
			const index = this._keysReleased.indexOf(args.KEY);
			if(index > -1) {
				this._keysReleased.splice(index, 1);
				return true;
			}
		}
		return false;
	}
	
	gotMouse(event) {
	//	console.log(event);
		if(event.event != '') {
			const index = this.mouseEvent.indexOf(event.event);
			if(index < 0) this.mouseEvent.push(event.event);
			this.mouseState = event.event;
		}

		const L_CENTER_X = -120;
		const L_CENTER_Y = -60;
		const GRID_SIZE = 60;
		let padButton = 'center';
		if(this.mouseState == 'down') {
			this.mouseX = event.x;
			this.mouseY = event.y;

			let gridX = Math.round((this.mouseX - L_CENTER_X)/GRID_SIZE);
			let gridY = Math.round((this.mouseY - L_CENTER_Y)/GRID_SIZE);
			//console.log(this.mouseX + ',' + this.mouseY + ',' + gridX + ',' + gridY);
			switch(gridY) {
			case -1:
				switch(gridX) {
				case -1: padButton = 'DL'; break;
				case  0: padButton = 'D'; break;
				case  1: padButton = 'DR'; break;
				case  4: padButton = 'button1'; break;
				}
				break;
			case 0:
				switch(gridX) {
				case -1: padButton = 'L'; break;
				case  1: padButton = 'R'; break;
				case  3: padButton = 'button3'; break;
				case  5: padButton = 'button2'; break;
				}
				break;
			case 1:
				switch(gridX) {
				case -1: padButton = 'UL'; break;
				case  0: padButton = 'U'; break;
				case  1: padButton = 'UR'; break;
				case  4: padButton = 'button4'; break;
				}
				break;
			}
			if(gridX>=-1 && gridX<=1 && gridY>=-1 && gridY<=1) {
				this.PadX = Math.round((this.mouseX - L_CENTER_X) * 100 / GRID_SIZE);
				this.PadY = Math.round((this.mouseY - L_CENTER_Y) * 100 / GRID_SIZE);
			} else {
				this.PadX = 0;
				this.PadY = 0;
			}
		}
		if(this.padButton != padButton) {
			this.padButton = padButton;
			console.log(padButton);
			const index = this.buttonEvent.indexOf(padButton);
			if(index < 0) this.buttonEvent.push(padButton);
		}
		return;
	}

	eventMouse(args) {
		const index = this.mouseEvent.indexOf(args.ARG1);
		if(index > -1) {
			this.mouseEvent.splice(index, 1);
			return true;
		}
		return false;
	}

	isMouse(args) {
		return (this.mouseState == args.ARG1);
	}
	
	eventButton(args) {
		const index = this.buttonEvent.indexOf(args.ARG1);
		if(index > -1) {
			this.buttonEvent.splice(index, 1);
			return true;
		}
		return false;
	}

	getPadX(args) { return this.PadX; }
	getPadY(args) { return this.PadY; }

/*
	axes: (10)
		0: 0.003921627998352051		// stickL-R
		1: 0.003921627998352051		// stickL-D
		2: 0.13725495338439941		// stickR-R
		3: 0
		4: 0
		5: 0.003921627998352051		// stickR-D
		6: 0
		7: 0
		8: 0
		9: 3.2857141494750977		// hat
	buttons: (12)
		0: GamepadButton {pressed: false, touched: false, value: 0}
		1: GamepadButton {pressed: false, touched: false, value: 0}
		2: GamepadButton {pressed: false, touched: false, value: 0}
		3: GamepadButton {pressed: false, touched: false, value: 0}
		4: GamepadButton {pressed: false, touched: false, value: 0}
		5: GamepadButton {pressed: false, touched: false, value: 0}
		6: GamepadButton {pressed: false, touched: false, value: 0}
		7: GamepadButton {pressed: false, touched: false, value: 0}
		8: GamepadButton {pressed: false, touched: false, value: 0}
		9: GamepadButton {pressed: false, touched: false, value: 0}
		10: GamepadButton {pressed: false, touched: false, value: 0}
		11: GamepadButton {pressed: false, touched: false, value: 0}
	connected: true
	id: 'PC Game Controller        (Vendor: 11ff Product: 3331)'
	index: 0
	mapping: ''
	timestamp: 650764.1150000272
	vibrationActuator: null
*/

	getGamepadAxes(args) {
		return this.gamepadAxes[args.ARG1*1-1];
	}

	gamepadTimerCallback(){
		this.gamepadTimerId = setTimeout(this.gamepadTimerCallback.bind(this), this.gamepadTimerMilliSec);
		if(!this.gamepadIndex < 0 || !navigator.getGamepads) return;
		const gamepad = navigator.getGamepads()[this.gamepadIndex];
		let i;
		if(gamepad.buttons.length >= 12) {
			let noButton = true;
			for(i = 0; i < 12; i++) {
				let pressed = gamepad.buttons[i].pressed;
				if(!this.gamepadButtons[i] && pressed) {
					console.log('button'+(i+1));
					const index = this.buttonEvent.indexOf('button'+(i+1));
					if(index < 0) this.buttonEvent.push('button'+(i+1));
				}
				this.gamepadButtons[i] = pressed;
				if(pressed) noButton = false;
			}
			if(!this.noButton && noButton) {
				console.log('noButton');
				const index = this.buttonEvent.indexOf('noButton');
				if(index < 0) this.buttonEvent.push('noButton');
			}
			this.noButton = noButton;
		}

		if(gamepad.axes.length >= 4) {
			this.gamepadAxes = [gamepad.axes[0]*100,gamepad.axes[1]*100,gamepad.axes[2]*100,gamepad.axes[3]*100];
		}

		let hat = 'center';
		let tmp = 0;
		if(gamepad.buttons.length >= 16) {
			for(i = 0; i < 4; i++)
				tmp |= (gamepad.buttons[i+12].pressed<<i);
			const hats1 = ['center',	// 0000
							'U',		// 0001
							'D',		// 0010
							'center',	// 0011
							'L',		// 0100
							'UL',		// 0101
							'DL',		// 0110
							'center',	// 0111
							'R',		// 1000
							'UR',		// 1001
							'DR',		// 1010
							];
			if(tmp < hats1.length)
				hat = hats1[tmp];
		} else if(gamepad.axes.length >= 10) {
			if(gamepad.axes[3] == 0 && gamepad.axes[5])
				this.gamepadAxes[3] = gamepad.axes[5]*100;
			tmp = Math.round((gamepad.axes[9]+1)*3.5);	// 単位1/8回転、-1～1が0～7/8回転になる。centerのとき15/8回転

			const hats2 = ['U','UR','R','DR','D','DL','L','UL'];
			if(tmp >= 0 && tmp < hats2.length)
				hat = hats2[tmp];
		}
		if(this.gamepadHat != hat) {
			console.log(hat);
			const index = this.buttonEvent.indexOf(hat);
			if(index < 0) this.buttonEvent.push(hat);
		}
		this.gamepadHat = hat;
	}

	initGamepad(){
		if(!navigator.getGamepads) return;

		window.addEventListener('gamepadconnected',function(e){
			let gamepad = e.gamepad;
			if(!gamepad) return;
			console.log('connected:('+gamepad.index+')'+gamepad.id);
			console.log(gamepad);
			this.gamepadIndex = gamepad.index;
			clearTimeout(this.gamepadTimerId);
			this.gamepadTimerId = null;
			this.gamepadTimerCallback();
		}.bind(this));

		window.addEventListener('gamepaddisconnected',function(e){
			let gamepad = e.gamepad;
			if(!gamepad) return;
			console.log('disconnected:('+gamepad.index+')'+gamepad.id);
			if(this.gamepadIndex == gamepad.index) {
				this.gamepadIndex = -1;
				clearTimeout(this.gamepadTimerId);
				this.gamepadTimerId = null;
			}
		}.bind(this));
	}

}
module.exports = Scratch3Blocks;
