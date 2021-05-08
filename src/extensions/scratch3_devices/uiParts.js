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
		this.x = 240;
		this.y = [0,0,0];

		this._penSkinId = this.runtime.renderer.createPenSkin();
		this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
		this.runtime.renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
		
		this.BtnStatus = 0;
		this.BtnEvent = 0;
		this.PadX = 0;
		this.PadY = 0;
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
						
				{blockType: BlockType.BOOLEAN, opcode: 'checkButton', text: ['finish of operation','操作完了'][this._locale], arguments: {
				}},

				{blockType: BlockType.HAT, opcode: 'eventButton', text: 'button Event[ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: '1', menu: 'buttonEvent' },
				}},

				{blockType: BlockType.REPORTER, opcode: 'getPadX', text: 'pad X', arguments: {
				}},

				{blockType: BlockType.REPORTER, opcode: 'getPadY', text: 'pad Y', arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'setVideoTransparency', text: ['video transparency','ビデオ透明度'][this._locale] + '[ARG1]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue: 20 },
				}}
			],
			menus: {
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
			}
		};
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

		let x = this.x + 1;
		if(x > 240) {
			x = -240;
			this.runtime.renderer.penClear(this._penSkinId);
		} else {
			for(i = 0; i < num; i++)
				this.runtime.renderer.penLine(this._penSkinId, attributes[i], this.x, this.y[i]+offset[i], x, y[i]+offset[i]);
		}
		//this.runtime.requestRedraw();
		this.x = x;
		for(i = 0; i < num; i++) this.y[i] = y[i];
	}

	checkButton(args, util) {
		const L_CENTER_X = -120;
		const L_CENTER_Y = -60;
		const GRID_SIZE = 60;
		let BtnStatus = BtnEvent.STOP;
		let mouseDown = util.ioQuery('mouse', 'getIsDown');
		if(mouseDown) {
			let mouseX = util.ioQuery('mouse', 'getScratchX');
			let mouseY = util.ioQuery('mouse', 'getScratchY');
			let gridX = Math.round((mouseX - L_CENTER_X)/GRID_SIZE);
			let gridY = Math.round((mouseY - L_CENTER_Y)/GRID_SIZE);
			//console.log(mouseX + ',' + mouseY + ',' + gridX + ',' + gridY);
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
				this.PadX = Math.round((mouseX - L_CENTER_X) * 100 / GRID_SIZE);
				this.PadY = Math.round((mouseY - L_CENTER_Y) * 100 / GRID_SIZE);
			} else {
				this.PadX = 0;
				this.PadY = 0;
			}
		}
		if(this.BtnStatus != BtnStatus) {
			this.BtnEvent |= (1<<BtnStatus);
			this.BtnStatus = BtnStatus;
		}
		return !mouseDown;
	}

	eventButton(args) {
		let result = (this.BtnEvent & (1<<args.ARG1*1)) ? true: false;
		this.BtnEvent &= ~(1<<args.ARG1*1);
		return result;
	}

	getPadX(args) { return this.PadX; }
	getPadY(args) { return this.PadY; }

	setVideoTransparency(args) {
		this.runtime.ioDevices.video.setPreviewGhost(args.ARG1*1);
	}
}
module.exports = Scratch3Blocks;
