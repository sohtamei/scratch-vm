/* copyright (C) 2021 SohtaMei. */
var extName = 'tracking';

const IconURI = 'data:image/png;base64,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';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const StageLayering = require('../../engine/stage-layering');

require('./tracking.js');

const WIDTH = 480;
const HEIGHT = 360;

const colorRed   = [1,0,0,1];
const colorGreen = [0,1,0,1];
const colorBlue  = [0,0,1,1];

class Scratch3Blocks {
	constructor (runtime) {
		runtime.tracking = this;
		this.runtime = runtime;

		this._penSkinId = this.runtime.renderer.createPenSkin();
		this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
		this.runtime.renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);

		this.tracker = null;
		this.areaX = [-240,240];
		this.areaY = [-180,180];

	//	this._targetRGB = [{r:0, g:0, b:0},{r:0, g:0, b:0},{r:0, g:0, b:0}];
		this._targetHsv = [{h:0, s:0, v:0},{h:0, s:0, v:0},{h:0, s:0, v:0}];
		this._tolerance = [100,100,100];

		this._isDetected = false;
		this._whenDetected = false;
		this._detect = [];
		for(let i=0; i<8; i++) this._detect[i] = {x:0, y:0, width:0, height:0};
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
			name: 'tracking.js',
			//blockIconURI: IconURI,
			menuIconURI: IconURI,
			blocks: this.get_blocks(),
			menus: this.get_menus(),
		};
	}

	get_blocks() {
		return [
			{blockType: BlockType.COMMAND, opcode: 'startDetection2', text: [
					'Start detection color[ARG1] hue-delta[ARG2] saturation-min[ARG3] brightness-min[ARG4]',
					'検出開始 色[ARG1] 色相誤差[ARG2] 彩度min[ARG3] 明度min[ARG4]'][this._locale],
			arguments: {
				ARG1: {type:ArgumentType.COLOR, defaultValue:'#ff0000'},
				ARG2: {type:ArgumentType.NUMBER, defaultValue:5 },
				ARG3: {type:ArgumentType.NUMBER, defaultValue:30 },
				ARG4: {type:ArgumentType.NUMBER, defaultValue:50 },
			}},

			{blockType: BlockType.COMMAND, opcode: 'stopDetection', text: ['Stop Detection', '検出停止'][this._locale] },

			{blockType: BlockType.COMMAND, opcode: 'setArea', text: [
					'Area ([ARG1],[ARG3]) - ([ARG2],[ARG4])',
					'領域指定 ([ARG1],[ARG3]) - ([ARG2],[ARG4])'][this._locale],
			arguments: {
				ARG1: {type:ArgumentType.NUMBER, defaultValue:-240 },
				ARG2: {type:ArgumentType.NUMBER, defaultValue: 240 },
				ARG3: {type:ArgumentType.NUMBER, defaultValue:-180 },
				ARG4: {type:ArgumentType.NUMBER, defaultValue: 180 },
			}},

			{blockType: BlockType.BOOLEAN, opcode: 'isDetected', text: ['Is detected', '検出'][this._locale] },
			{blockType: BlockType.HAT, opcode: 'whenDetected', text: ['When detected', '検出したとき'][this._locale] },

			{blockType: BlockType.REPORTER, opcode: 'detectX', text: ['X axis', 'x座標'][this._locale]+'[ARG1]',
			arguments: {
				ARG1: {type:ArgumentType.NUMBER, defaultValue:1 },
			}},

			{blockType: BlockType.REPORTER, opcode: 'detectY', text: ['Y axis', 'y座標'][this._locale]+'[ARG1]',
			arguments: {
				ARG1: {type:ArgumentType.NUMBER, defaultValue:1 },
			}},

			{blockType: BlockType.REPORTER, opcode: 'detectWidth', text: ['Width', '幅'][this._locale]+'[ARG1]',
			arguments: {
				ARG1: {type:ArgumentType.NUMBER, defaultValue:1 },
			}},

			{blockType: BlockType.REPORTER, opcode: 'detectHeight', text: ['Height', '高さ'][this._locale]+'[ARG1]',
			arguments: {
				ARG1: {type:ArgumentType.NUMBER, defaultValue:1 },
			}},

			{blockType: BlockType.COMMAND, opcode: 'startDetectionMulti', text: [
					'Start detection[ARG1] [ARG2] [ARG3] hue-delta[ARG4] saturation-min[ARG5] brightness-min[ARG6]',
					'検出開始 色[ARG1] [ARG2] [ARG3] 色相誤差[ARG4] 彩度min[ARG5] 明度min[ARG6]'][this._locale],
			arguments: {
				ARG1: {type:ArgumentType.COLOR, defaultValue:'#ff0000'},
				ARG2: {type:ArgumentType.COLOR, defaultValue:'#0000ff'},
				ARG3: {type:ArgumentType.COLOR, defaultValue:'#00ff00'},
				ARG4: {type:ArgumentType.NUMBER, defaultValue:5 },
				ARG5: {type:ArgumentType.NUMBER, defaultValue:30 },
				ARG6: {type:ArgumentType.NUMBER, defaultValue:50 },
			}},
		];
	}

	get_menus() {
		return {
			cameraMode: { acceptReporters: true, items: [
				{ text: ['normal','通常'][this._locale], value: '0' },
				{ text: ['color detect','色検出'][this._locale], value: '1' },
			]},
		};
	}

	startDetection2(args, util) {
		const hsv = this.rgb2hsv(Cast.toRgbColorObject(args.ARG1));
		this._targetHsv[0] = {h:hsv.h, s:args.ARG3*1, v:args.ARG4*1};
		this._tolerance[0] = args.ARG2*1;

		const _this = this;

		if(this.tracker) this.stopDetection(null);

		if(!this.runtime.ioDevices.video.videoReady) {
			this.runtime.ioDevices.video.enableVideo();
			this.runtime.ioDevices.video.mirror = true;
		}
		return new Promise(resolve => setTimeout(resolve, 1000))
		.then(() => {
			window.tracking.ColorTracker.registerColor('color1', function (r, g, b) {return _this._checkDistance2(0, r, g, b);});
			_this.tracker = new window.tracking.ColorTracker(['color1']);
			_this.tracker.minDimension = 5;
			_this.tracker.on('track', _this._detected.bind(_this));
			_this.runtime.ioDevices.video.element.onUpdated = function(canvas) {
				window.tracking.track(canvas, _this.tracker);
			};
		})
	}

	startDetectionMulti(args, util) {
		let hsv;
		hsv = this.rgb2hsv(Cast.toRgbColorObject(args.ARG1)); this._targetHsv[0] = {h:hsv.h, s:args.ARG5*1, v:args.ARG6*1};
		hsv = this.rgb2hsv(Cast.toRgbColorObject(args.ARG2)); this._targetHsv[1] = {h:hsv.h, s:args.ARG5*1, v:args.ARG6*1};
		hsv = this.rgb2hsv(Cast.toRgbColorObject(args.ARG3)); this._targetHsv[2] = {h:hsv.h, s:args.ARG5*1, v:args.ARG6*1};
		this._tolerance[0] = args.ARG4*1;

		const _this = this;

		if(this.tracker) this.stopDetection(null);

		if(!this.runtime.ioDevices.video.videoReady) {
			this.runtime.ioDevices.video.enableVideo();
			this.runtime.ioDevices.video.mirror = true;
		}
		return new Promise(resolve => setTimeout(resolve, 1000))
		.then(() => {
			window.tracking.ColorTracker.registerColor('color1', function (r, g, b) {return _this._checkDistance2(0, r, g, b);});
			window.tracking.ColorTracker.registerColor('color2', function (r, g, b) {return _this._checkDistance2(1, r, g, b);});
			window.tracking.ColorTracker.registerColor('color3', function (r, g, b) {return _this._checkDistance2(2, r, g, b);});
			_this.tracker = new window.tracking.ColorTracker(['color1','color2','color3']);
			_this.tracker.minDimension = 5;
			_this.tracker.on('track', _this._detected.bind(_this));
			_this.runtime.ioDevices.video.element.onUpdated = function(canvas) {
				window.tracking.track(canvas, _this.tracker);
			};
		})
	}

	_checkDistance2(index, r, g, b) {
		let rgb = {r:r, g:g, b:b};
		const hsv = this.rgb2hsv(rgb);
		if(hsv.s < this._targetHsv[index].s) return false;
		if(hsv.v < this._targetHsv[index].v) return false;

		let hue = hsv.h - this._targetHsv[index].h;
		if(hue < -180) hue += 360;
		if(hue >  180) hue -= 360;
		if(Math.abs(hue) > this._tolerance[0]) return false;
//console.log(rgb.r + " " + rgb.g + " " + rgb.b + " " + Math.round(hsv.h) + " " + Math.round(this._targetHsv[0].h) + " " + Math.round(hue));
		return true;
	}

	stopDetection(args) {
		this.runtime.ioDevices.video.element.onUpdated = null;

		if(!this.tracker) return;
		this._clearArea();
		this.tracker.removeAllListeners();
		delete this.tracker;
	}

	rgb2hsv(rgb) {
		let hsv = {h:0.0, s:0.0, v:0.0};
		let Max = 0;
		let Min = 0;
		
		if(rgb.r >= rgb.g) {
			Max = (rgb.r >= rgb.b) ? rgb.r: rgb.b;
			Min = (rgb.g <  rgb.b) ? rgb.g: rgb.b;
		} else {
			Max = (rgb.b >= rgb.g) ? rgb.b: rgb.g;
			Min = (rgb.r <  rgb.b) ? rgb.r: rgb.b;
		}
		
		if(Max != Min) {
			if(Max == rgb.r) {
				hsv.h = ((rgb.g - rgb.b) * 60.0 / (Max - Min));
			} else if (Max == rgb.g) {
				hsv.h = ((rgb.b - rgb.r) * 60.0 / (Max - Min)) + 120;
			} else {
				hsv.h = ((rgb.r - rgb.g) * 60.0 / (Max - Min)) + 240;
			}
			hsv.s = (Max - Min) * 100.0 / Max;
		} else {
			hsv.h = 0;
			hsv.s = 0;
		}
		hsv.v = Max * 100.0 / 255.0;
		hsv.h = hsv.h * 100.0 / 360.0;
		return hsv;
	}

	_detected(event) {
		if(event.data.length == 0 || !this.tracker) {
			this._clearArea();
			this._isDetected = false;
			this._whenDetected = false;
			return;
		}

		this._clearArea();
		this._isDetected = true;
		this._whenDetected = true;

		if(this.runtime.tracking.detected !== undefined) {
	//	if(this.runtime.tracking.detected) {
			let ret = this.runtime.tracking.detected(event.data);
			if(ret == false) return;
		}

		let rect;
		let maxSizeList = [];
		for(let i = 0; i < event.data.length; i++) {
			rect = event.data[i];
			const x = -240 + (rect.x + rect.width/2);
			const y =  180 - (rect.y + rect.height/2);

			if(this.areaEnabled()
			&& (x < this.areaX[0] || x > this.areaX[1] || y < this.areaY[0] || y > this.areaY[1])) {
				;
			} else {
			//	console.log(this.areaX[0], ',', this.areaX[1], ',', x, ',', this.areaY[0], ',', this.areaY[1], ',', y);
				maxSizeList.push({index:i, size:rect.width+rect.height});
			}
		}

		if(maxSizeList.length == 0) return;

		maxSizeList.sort((a, b) => (a.size > b.size ? -1 : 1));

		for(let i = 0; i < Math.min(maxSizeList.length, 8); i++) {
			rect = event.data[maxSizeList[i].index];
			const xs = [-240 + rect.x, -240 + (rect.x + rect.width)];
			const ys = [ 180 - rect.y,  180 - (rect.y + rect.height)];
			this.drawRect(xs, ys, (i == 0) ? colorRed: colorGreen);

			this._detect[i] = {x:(xs[0] + xs[1]) / 2,
							   y:(ys[0] + ys[1]) / 2,
							   width:rect.width, height:rect.height};
		}
	}

	setArea(args) {
		this.areaX[0] = Math.min(args.ARG1*1, args.ARG2*1);
		this.areaX[1] = Math.max(args.ARG1*1, args.ARG2*1);
		this.areaY[0] = Math.min(args.ARG3*1, args.ARG4*1);
		this.areaY[1] = Math.max(args.ARG3*1, args.ARG4*1);

		this._clearArea();
	}
	isDetected(args)   {
		const whenDetected = this._whenDetected;
		this._whenDetected = false;
		return whenDetected;
//		return this._isDetected;
	}
	whenDetected(args) {
		const whenDetected = this._whenDetected;
		this._whenDetected = false;
		return whenDetected;
	}
	detectX(args)      { return this._detectArgs(args).x; }
	detectY(args)      { return this._detectArgs(args).y; }
	detectWidth(args)  { return this._detectArgs(args).width; }
	detectHeight(args) { return this._detectArgs(args).height; }

	_detectArgs(args) {
		let index = (args.ARG1 === undefined)? 1: args.ARG1*1;
		if(index < 1 || index > 8) index = 1;
		return this._detect[index-1];
	}

	areaEnabled() {
		if( this.areaX[0] == -240 && this.areaX[1] == 240
		 && this.areaY[0] == -180 && this.areaY[1] == 180 )
		    return false;

		if( this.areaX[0] == this.areaX[1]
		 || this.areaY[0] == this.areaY[1] )
		    return false;

		return true;
	}

	_clearArea() {
		this.runtime.renderer.penClear(this._penSkinId);
		if(this.areaEnabled())
			this.drawRect(this.areaX, this.areaY, colorBlue);
	}

	drawRect(xs, ys, color) {
		const attr = { color4f: color, diameter: 1 };
		const x0 = Math.max(xs[0], -240);
		const x1 = Math.min(xs[1],  239);
		const y0 = Math.max(ys[0], -180);
		const y1 = Math.min(ys[1],  179);

		this.runtime.renderer.penLine(this._penSkinId, attr, x0, y0, x1, y0);
		this.runtime.renderer.penLine(this._penSkinId, attr, x0, y0, x0, y1);
		this.runtime.renderer.penLine(this._penSkinId, attr, x0, y1, x1, y1);
		this.runtime.renderer.penLine(this._penSkinId, attr, x1, y0, x1, y1);
	}

	drawLine(xs, ys, color) {
		const attr = { color4f: color, diameter: 1 };
		const x0 = Math.max(xs[0], -240);
		const x1 = Math.min(xs[1],  239);
		const y0 = Math.max(ys[0], -180);
		const y1 = Math.min(ys[1],  179);

		this.runtime.renderer.penLine(this._penSkinId, attr, x0, y0, x1, y1);
	}
}
module.exports = Scratch3Blocks;
