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

const BtnEvent = {
	STOP: 0,
	L_UP: 1, L_DOWN:2, L_LEFT:3, L_RIGHT:4,
	R_UP: 5, R_DOWN:6, R_LEFT:7, R_RIGHT:8,
};

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
		this.PadX = 0;
		this.PadY = 0;
		this.BtnStatus = 0;
		this.BtnEvent = 0;

		this.runtime.on('MOUSE', event => this.gotMouse(event));
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
			id: 'uiParts',
			name: ['UI parts','UIパーツ'][this._locale],
			menuIconURI: IconURI,
			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'setVideoTransparency', text: ['video transparency','ビデオ透明度'][this._locale] + '[ARG1]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 20 },
				}},

				'---',

				{blockType: BlockType.COMMAND, opcode: 'plot1', text: 'plot ch[ARG1]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:1 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'plot2', text: 'plot ch[ARG1] [ARG2]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:1 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:2 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'plot3', text: 'plot ch[ARG1] [ARG2] [ARG3]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:1 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:2 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:3 },
				}},

				'---',

				{blockType: BlockType.HAT, opcode:'whenKeyPressed', text: formatMessage({id: 'makeymakey.whenKeyPressed', default: 'when [KEY] key pressed'}),  arguments: {
					KEY: { type: ArgumentType.STRING, defaultValue: 'up arrow', menu: 'keyEvent'}
				}},

				{blockType: BlockType.HAT, opcode:'whenKeyReleased', text: ['when [KEY] key released','[KEY]キーをはなしたとき'][this._locale], arguments: {
					KEY: { type: ArgumentType.STRING, defaultValue: 'up arrow', menu: 'keyEvent'}
				}},

				'---',

				{blockType: BlockType.HAT, opcode: 'eventMouse', text: 'When Mouse[ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: 'down', menu: 'mouseEvent' },
				}},

				{blockType: BlockType.BOOLEAN, opcode: 'isMouseDown', text: 'x is Mouse[ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: 'down', menu: 'mouseEvent' },
				}},

				{blockType: BlockType.BOOLEAN, opcode: 'isMouse', text: 'is Mouse[ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: 'down', menu: 'mouseEvent' },
				}},

				'---',

				{blockType: BlockType.REPORTER, opcode: 'xxx', text: ['↓ use "PAD" stage','↓ "PAD" ステージを使って下さい'][this._locale], disableMonitor: true, arguments: {
				}},

				{blockType: BlockType.HAT, opcode: 'eventButton', text: 'button Event[ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: '1', menu: 'buttonEvent' },
				}},

				{blockType: BlockType.REPORTER, opcode: 'getPadX', text: 'pad X', arguments: {
				}},

				{blockType: BlockType.REPORTER, opcode: 'getPadY', text: 'pad Y', arguments: {
				}},
			],
			menus: {
				mouseEvent: { acceptReporters: true, items: ['down', 'up']},

				buttonEvent: { acceptReporters: true, items: [
				{ text: 'stop', value: '0' },
				{ text: '↑', value: '1' },
				{ text: '←', value: '3' },
				{ text: '→', value: '4' },
				{ text: '↓', value: '2' },
				{ text: 'UP', value: '5' },
				{ text: 'LEFT', value: '7' },
				{ text: 'RIGHT', value: '8' },
				{ text: 'DOWN', value: '6' },
				]},

				keyEvent:{ acceptReporters: true, items: [
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
			if (index > -1) {
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
			if (index > -1) {
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
		let BtnStatus = BtnEvent.STOP;
		if(this.mouseState == 'down') {
			this.mouseX = event.x;
			this.mouseY = event.y;

			let gridX = Math.round((this.mouseX - L_CENTER_X)/GRID_SIZE);
			let gridY = Math.round((this.mouseY - L_CENTER_Y)/GRID_SIZE);
			//console.log(this.mouseX + ',' + this.mouseY + ',' + gridX + ',' + gridY);
			switch(gridY) {
			case -1:
				switch(gridX) {
				case 0: BtnStatus = BtnEvent.L_DOWN; break;
				case 4: BtnStatus = BtnEvent.R_DOWN; break;
				}
				break;
			case 0:
				switch(gridX) {
				case -1: BtnStatus = BtnEvent.L_LEFT; break;
				case 1: BtnStatus = BtnEvent.L_RIGHT; break;
				case 3: BtnStatus = BtnEvent.R_LEFT; break;
				case 5: BtnStatus = BtnEvent.R_RIGHT; break;
				}
				break;
			case 1:
				switch(gridX) {
				case 0: BtnStatus = BtnEvent.L_UP; break;
				case 4: BtnStatus = BtnEvent.R_UP; break;
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
		if(this.BtnStatus != BtnStatus) {
			this.BtnEvent |= (1<<BtnStatus);
			this.BtnStatus = BtnStatus;
		}
		return;
	}

	eventMouse(args) {
		const index = this.mouseEvent.indexOf(args.ARG1);
		if (index > -1) {
			this.mouseEvent.splice(index, 1);
			return true;
		}
		return false;
	}

	isMouse(args) {
		return (this.mouseState == args.ARG1);
	}
	
	eventButton(args) {
		let result = (this.BtnEvent & (1<<args.ARG1*1)) ? true: false;
		this.BtnEvent &= ~(1<<args.ARG1*1);
		return result;
	}

	getPadX(args) { return this.PadX; }
	getPadY(args) { return this.PadY; }
}
module.exports = Scratch3Blocks;
