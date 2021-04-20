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
		this.x = 240;
		this.y = [0,0,0];

		this._penSkinId = this.runtime.renderer.createPenSkin();
		this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
		this.runtime.renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
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
				{blockType: BlockType.COMMAND, opcode: 'plot1', text: 'plot [ARG1]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:1 },
				}},
				{blockType: BlockType.COMMAND, opcode: 'plot2', text: 'plot [ARG1] [ARG2]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:1 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:1 },
				}},
				{blockType: BlockType.COMMAND, opcode: 'plot3', text: 'plot [ARG1] [ARG2] [ARG3]', arguments: {
					ARG1: { type: ArgumentType.NUMBER, defaultValue:1 },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:1 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:1 },
				}},
			],
			menus: {
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
}
module.exports = Scratch3Blocks;
