var extName = 'facemesh';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-converter');
require('@tensorflow/tfjs-backend-webgl');
const facemesh = require('@tensorflow-models/facemesh');
const Video = require('../../io/video');

class Scratch3Blocks {
	constructor (runtime) {
		this.runtime = runtime;

		this.firstTraining = true;
		this._whenDetected = false;
		this.faces = [];

		const _this = this;
		facemesh.load()
		.then(model => {
			_this.model = model;
		});
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
			id: extName,
			name: extName,
			//blockIconURI: IconURI,
			//menuIconURI: IconURI,
			blocks: this.get_blocks(),
			menus: this.get_menus(),
		};
	}

	get_blocks() {
		return [
			{blockType: BlockType.COMMAND, opcode: 'startDetection', text: ['Start detection', '検出開始'][this._locale] },
			{blockType: BlockType.COMMAND, opcode: 'stopDetection', text: ['Stop Detection', '検出停止'][this._locale] },

			{blockType: BlockType.BOOLEAN, opcode: 'isDetected', text: ['Is detected', '検出'][this._locale] },
			{blockType: BlockType.HAT, opcode: 'whenDetected', text: ['When detected', '検出したとき'][this._locale] },

			{blockType: BlockType.REPORTER, opcode: 'getPeopleCount', text: ['people count', '人数'][this._locale], },

			{blockType: BlockType.REPORTER, opcode: 'detectX', text: ['x (person[ARG1], no[ARG2])', 'x座標 ([ARG1]人目,[ARG2]番目)'][this._locale],
			arguments: {
				ARG1: {type: ArgumentType.STRING, defaultValue: '1' },
				ARG2: {type: ArgumentType.STRING, defaultValue: '1' }
			}},

			{blockType: BlockType.REPORTER, opcode: 'detectY', text: ['y (person[ARG1], no[ARG2])', 'y座標 ([ARG1]人目,[ARG2]番目)'][this._locale],
			arguments: {
				ARG1: {type: ArgumentType.STRING, defaultValue: '1' },
				ARG2: {type: ArgumentType.STRING, defaultValue: '1' }
			}},

			{blockType: BlockType.REPORTER, opcode: 'getDirection', text: 'direction [ARG1]',
			arguments: {
				ARG1: {type: ArgumentType.STRING, menu: 'directionMenu', defaultValue: 'LR' },
			}},
		];
	}

	get_menus() {
		return {
			directionMenu: {acceptReporters: true, items: [
				{ text:'LR', value:'LR' },
				{ text:'UpDown', value:'UpDown' },
				{ text:'Rotate', value:'Rotate' },
			]},
		};
	}

	startDetection(args, util) {
		const _this = this;

		if(!this.runtime.ioDevices.video.videoReady) {
			this.runtime.ioDevices.video.enableVideo();
			this.runtime.ioDevices.video.mirror = true;
		}
		_this.runtime.ioDevices.video.element.onUpdated = (canvas => {
			if (_this.firstTraining) {
				alert(['Setup takes a while. The browser will get stuck, but please wait.',
					   '準備に時間がかかります。少しの間、操作ができなくなりますがお待ち下さい。'][_this._locale]);
				_this.firstTraining = false;
			}

			return _this.model.estimateFaces(canvas)
			.then(faces => {
				if (faces.length < _this.faces.length) {
					_this.faces.splice(faces.length);
				}
				faces.forEach((face, index) => {
					_this.faces[index] = {keypoints: face.scaledMesh};
				});
				_this._whenDetected = true;
			});
		});
	}

	stopDetection(args) {
		_this.runtime.ioDevices.video.element.onUpdated = null;
	}

	isDetected(args)   {
		const whenDetected = this._whenDetected;
		this._whenDetected = false;
		return whenDetected;
	}
	whenDetected(args) {
		const whenDetected = this._whenDetected;
		this._whenDetected = false;
		return whenDetected;
	}

	getPeopleCount () {
		return this.faces.length;
	}

	detectX (args) {
		let personNumber = parseInt(args.ARG1, 10) - 1;
		let keypoint = parseInt(args.ARG2, 10) - 1;

		if (this.faces[personNumber].keypoints && this.faces[personNumber].keypoints[keypoint]) {
			return this.faces[personNumber].keypoints[keypoint][0] - 240;
		} else {
			return '';
		}
	}

	detectY (args) {
		let personNumber = parseInt(args.ARG1, 10) - 1;
		let keypoint = parseInt(args.ARG2, 10) - 1;

		if (this.faces[personNumber].keypoints && this.faces[personNumber].keypoints[keypoint]) {
			return 180 - this.faces[personNumber].keypoints[keypoint][1];
		} else {
			return '';
		}
	}

    getDirection (args) {
      let kp0 = 10;
      let kp1 = 199;
      let kp2 = 1;

      if(args.ARG1 == 'UpDown') {
        kp0 = 234;
        kp1 = 454;
      }

      const xy0 = this.faces[0].keypoints[kp0];
      const xy1 = this.faces[0].keypoints[kp1];
      const xy2 = this.faces[0].keypoints[kp2];

      const len01 = Math.sqrt(Math.pow(xy1[1]-xy0[1],2) + Math.pow(xy1[0]-xy0[0],2));
      let dir;
      let rotate;
      if(xy1[0] == xy0[0]) {
        dir = xy2[0] - xy0[0];
        rotate = 0;
      } else {
        const a = (xy1[1]-xy0[1]) / (xy1[0]-xy0[0]);
        const b = (xy2[1]-xy0[1]) - a * (xy2[0]-xy0[0]);
        dir = b/Math.abs(a)/Math.sqrt(1+1/(a*a));
        if(xy1[0] < xy0[0])
          dir = -dir;
        rotate = Math.atan(1/a)/Math.PI*180;
      }
      dir = dir / len01 * 100;

      if(args.ARG1 == 'Rotate')
        return rotate;
      else
        return dir;
    }

}
module.exports = Scratch3Blocks;
