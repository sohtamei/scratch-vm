/* copyright (C) 2021 SohtaMei. */

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const loadMidLib = require('./loadMidLib');

const IconURI = require('./tukurutch-small.png');

class Scratch3Blocks {
	constructor (runtime) {
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
			id: 'loadMID',
			name: ['loadMID','loadMID'][this._locale],
			menuIconURI: IconURI,
			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'loadMID', text: 'loadMID', arguments: {
				}},

				{blockType: BlockType.REPORTER, opcode: 'dataMID', text: 'dataMID [ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: ' ' },
				}},
			],
			menus: {
			}
		};
	}

	loadMID(args) {
		return loadMidLib.loadMID().then(result => {
			const targetBlock = Blockly.getMainWorkspace().getBlockById('loadMID_dataMID');
			if(targetBlock) {
				targetBlock.childBlocks_[0].inputList[0].fieldRow[0].setValue(result);
			}
		})
	}

	dataMID(args) {
		return args.ARG1;
	}
}
module.exports = Scratch3Blocks;
