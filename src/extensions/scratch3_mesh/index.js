/**
 * Copyright (c) 2020 Yusaku Nishiwaki
 * Released under the Apache-2.0 license
 * LICENSE: http://www.apache.org/licenses/LICENSE-2.0
 */
var ArgumentType = require("../../extension-support/argument-type");
var BlockType = require("../../extension-support/block-type");
//var log = require("../../util/log");
var formatMessage = require("format-message");
var Cast = require("../../util/cast");
var Mesh = require("./mesh.js");

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
// ブロックの中に表示されるsvg を base64 にして登録


var blockIconURI = 'data:image/png;base64,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';

var menuIconURI = blockIconURI;
// すぐ下のMessage の key に登録した locale と同じにしてください。

var AvailableLocales = ['en', 'ja', 'ja-Hira']; // 多言語化に使用するjsonです。
// setLocale 関数を使って、現在のlocaleを読み込み、現在の言語の文言を取得するようにしています。
// 使用例としては、Message.motor_right[this.setLocale()]

var Message = {
	categoryName: {
		'ja': 'Sony MESH test',
		'ja-Hira': 'Sony MESH test',
		'en': 'Sony MESH test'
	},
	ConState: {
		none: {
			'ja': '左のチェックボックスを押してね',
			'ja-Hira': 'ひだりのしかくをおしてね',
			'en': 'please click the left checkbox'
		},
		not_found: {
			'ja': '接続できませんでした',
			'ja-Hira': 'つなげられませんでした',
			'en': 'could not connect'
		},
		try: {
			'ja': '接続中...',
			'ja-Hira': 'つないでいます...',
			'en': 'connecting...'
		},
		connected: {
			'ja': '接続しました',
			'ja-Hira': 'つなぎました',
			'en': 'connected'
		},
	},
	LedConnect: {
		'ja': '［LED］接続する',
		'ja-Hira': '［LED］つなぐ',
		'en': '［LED］connect'
	},
	LedOn: {
		'ja': '［LED］ R=[R] G=[G] B=[B] にする',
		'ja-Hira': '［LED］ R=[R] G=[G] B=[B] にする',
		'en': '［LED］ set to R=[R] G=[G] B=[B]'
	},
	LedOff: {
		'ja': '［LED］ 消す',
		'ja-Hira': '［LED］ 消す',
		'en': '［LED］ turn off'
	},
	ButtonConnect: {
		'ja': '［ボタン］接続する',
		'ja-Hira': '［ボタン］つなぐ',
		'en': '［Button］connect'
	},
	ButtonPressed: {
		'ja': '［ボタン］ 押されたとき',
		'ja-Hira': '［ボタン］ 押されたとき',
		'en': '［Button］ Pressed'
	},
	MotionConnect: {
		'ja': '［動き］接続する',
		'ja-Hira': '［動き］つなぐ',
		'en': '［Motion］connect'
	},
	MotionDetect: {
		'ja': '［動き］[DIR] の向きのとき',
		'ja-Hira': '［動き］[DIR] の向きのとき',
		'en': '［Motion］Direction'
	},
	GpioConnect: {
		'ja': '［GPIO］接続する',
		'ja-Hira': '［GPIO］つなぐ',
		'en': '［GPIO］connect'
	},
	GpioPowerOut: {
		'ja': '［GPIO］電源出力 [out]',
		'ja-Hira': '［GPIO］電源出力 [out]',
		'en': '［GPIO］Power Drive [out]'
	},
	connection_alert: {
		'ja': '接続に失敗しました。再接続するにはチェックボックスを一度外して、初めから接続をしてください。',
		'ja-Hira': 'つなぐことができませんでした。もういちどつなぎたいばあい、チェックボックスをはずして、はじめからやりなおしてください。',
		'en': 'disconnected. release the checkbox of connect block. then re-connect the device.'
	},
	help: {
		'ja': '[link] についてヘルプを開く',
		'ja-Hira': '[link] についてヘルプをひらく',
		'en': 'open help for [link]'
	},
	help_links: {
		general: {
			'ja': '全般',
			'ja-Hira': 'ぜんぱん',
			'en': 'general'
		},
		connect: {
			'ja': 'つながらないとき',
			'ja-Hira': 'つながらないとき',
			'en': 'cannot connect'
		},
		blocks: {
			'ja': '各ブロック',
			'ja-Hira': 'ブロック',
			'en': 'blocks'
		}
	}
}; // 現在の接続状況を示した enum 

var ConState = {
	NONE : 1,
	ERROR : 2,
	TRY : 3,
	CONNECTED : 4,
};

var tag = {
	LED:0,
	BUTTON:1,
	MOTION:2,
	GPIO:3,
	THERMAL:4,
};

class MeshBlocks {
	constructor (runtime) {
		this._runtime = runtime;

		this._conDev = [null,null,null,null,null,null,null];
		this._conState = [ConState.NONE,ConState.NONE,ConState.NONE,ConState.NONE,ConState.NONE,ConState.NONE,ConState.NONE];

		this._alreadyAlert = false; // alertがすでに表示されているかのフラグ
		this._intervalId = window.setInterval(this._updateConState, 200, this); // 接続状況を常に確認する interval 関数

		this._ButtonPressed = false;
		this._MotionDetect = 0;
		this._mesh = new Mesh();
	}

	getInfo() {
		return {
			id: 'mesh',
			name: Message.categoryName[this.setLocale()],
			menuIconURI: menuIconURI,
			blockIconURI: blockIconURI,
			color1: '#BED537',        // ブロックのメイン色
			color2: '#A7BC30',        // ブロックの影の色

			blocks: [
			// LED TAG
			{
				opcode: 'LedConnect',
				blockType: BlockType.REPORTER,
				text: Message.LedConnect[this.setLocale()]
			}, {
				opcode: 'LedOn',
				blockType: BlockType.COMMAND,
				text: Message.LedOn[this.setLocale()],
				arguments: {
					R: { type: ArgumentType.NUMBER, defaultValue: 100 },
					G: { type: ArgumentType.NUMBER, defaultValue: 100 },
					B: { type: ArgumentType.NUMBER, defaultValue: 100 }
				}
			}, {
				opcode: 'LedOff',
				blockType: BlockType.COMMAND,
				text: Message.LedOff[this.setLocale()],

			// Button TAG
			}, '---', {
				opcode: 'ButtonConnect',
				blockType: BlockType.REPORTER,
				text: Message.ButtonConnect[this.setLocale()]
			}, {
				opcode: 'ButtonPressed',
				blockType: BlockType.HAT,
				text: Message.ButtonPressed[this.setLocale()],

			// Motion TAG
			}, '---', {
				opcode: 'MotionConnect',
				blockType: BlockType.REPORTER,
				text: Message.MotionConnect[this.setLocale()]
			}, {
				opcode: 'MotionDetect',
				blockType: BlockType.HAT,
				text: Message.MotionDetect[this.setLocale()],
				arguments: {
					DIR: { type: ArgumentType.NUMBER, defaultValue: 1 }  // 01 右, 02 下, 03 表, 04 裏, 05 上, 06 左
				}

			// GPIO TAG
			}, '---', {
				opcode: 'GpioConnect',
				blockType: BlockType.REPORTER,
				text: Message.GpioConnect[this.setLocale()]
			}, {
				opcode: 'GpioPowerOut',
				blockType: BlockType.COMMAND,
				text: Message.GpioPowerOut[this.setLocale()],
				arguments: {
					out: { type: ArgumentType.NUMBER, defaultValue: 1 }
				}

			}],

			menus: {
			}
		};
	}

	_updateConState(that) {
		var _that = that;

		that.NotifyCB = function (name, buf) {
			switch(name.substr(8, 2)) {
			case 'LE':
				break;
			case 'BU':
				if(buf.getUint8(0) == 0x1) {
					_that._ButtonPressed = buf.getUint8(2);  // 1:短押し、2:長押し、3:2回押し
					console.log("ButtonPressed "+_that._ButtonPressed);
				}
				break;
			case 'AC':
				if(buf.getUint8(0) == 0x1 && buf.getUint8(1) == 0x3) {
					_that._MotionDetect = buf.getUint8(2);  // 01 右, 02 下, 03 表, 04 裏, 05 上, 06 左
					console.log("MotionDetect "+_that._MotionDetect);
				}
				break;
			case 'GP':
				break;
			}
			return 'ERROR';
		}

		var BlockId = ['mesh_LedConnect', 'mesh_ButtonConnect', 'mesh_MotionConnect', 'mesh_GpioConnect', 'mesh_ButtonConnect', 'mesh_ButtonConnect', 'mesh_ButtonConnect'];
		var filter = ['MESH-100LE', 'MESH-100BU', 'MESH-100AC', 'MESH-100GP', 'MESH-100LE', 'MESH-100LE', 'MESH-100LE'];
		//var notifyCB = [null, that.ButtonNotifyCB, null, null, null, null, null];  1つしかcallbackが登録できないらいためcallback側で判別

		var i = 0;
		for(i = 0; i < 4; i++) {
			var targetBlock = Blockly.getMainWorkspace().getBlockById(BlockId[i]);
			if (!targetBlock) continue;

			var clicked = targetBlock.flyoutCheckbox.clicked;

			switch(that._conState[i]) {
			case ConState.NONE:
				that._alreadyAlert = false;
				if(clicked) {
					that._conState[i] = ConState.TRY;

					if (that._conDev[i]) that._conDev[i].disconnect();
					var ii = i;
					that._mesh.find(filter[i], that.NotifyCB).then(
						function (k) {
							if (!k || !k.isConnected()) {
								throw 'connection error';
							} else {
								that._conDev[ii] = k;
								that._conState[ii] = ConState.CONNECTED;
							}
						}
					).catch(function (error) {
						console.log(error);
						if (!that._alreadyAlert) {
							alert(Message.connection_alert[that.setLocale()]);
							that._alreadyAlert = true;
						}
						that._conDev[ii] = null;
						that._conState[ii] = ConState.ERROR;
					});
				}
				break;

			case ConState.CONNECTED:
				if (!clicked) {
					that._conState[i] = ConState.NONE;
					that._conDev[i].disconnect();
					that._conDev[i] = null;

				} else if (!that._conDev[i] || !that._conDev[i].isConnected()) {
					if (!that._alreadyAlert) {
						alert(Message.connection_alert[that.setLocale()]);
						that._alreadyAlert = true;
					}
					that._conState[i] = ConState.ERROR;
				}
				break;

			case ConState.ERROR:
			case ConState.TRY:
				if (!clicked)
					that._conState[i] = ConState.NONE;
				break;
			}
		}
	}

	LedConnect() {
		switch(this._conState[tag.LED]) {
		case ConState.NONE:       return Message.ConState.none[this.setLocale()];
		case ConState.ERROR:      return Message.ConState.not_found[this.setLocale()];
		case ConState.TRY:        return Message.ConState.try[this.setLocale()];
		case ConState.CONNECTED:  return Message.ConState.connected[this.setLocale()];
		}
		return 'ERROR';
	}

	LedOn(args) {
		if (!this._conDev[tag.LED] || !this._conDev[tag.LED].isConnected()) return;
		var data = [0x01,0x00,Number(args.R),0x00,Number(args.G),0x00,Number(args.B),0x30,0x75,0x30,0x75,0x00,0x00,0x01,0x97];
		var sum = 0;
		for(i = 0; i < data.length-1; i++)
			sum += data[i];
		data[data.length-1] = sum & 0xFF;
		this._conDev[tag.LED].writeWoResp(data);
	}

	LedOff(args) {
		if (!this._conDev[tag.LED] || !this._conDev[tag.LED].isConnected()) return;
		this._conDev[tag.LED].writeWoResp([0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x02]);
	}

	ButtonConnect() {
		switch(this._conState[tag.BUTTON]) {
		case ConState.NONE:       return Message.ConState.none[this.setLocale()];
		case ConState.ERROR:      return Message.ConState.not_found[this.setLocale()];
		case ConState.TRY:        return Message.ConState.try[this.setLocale()];
		case ConState.CONNECTED:  return Message.ConState.connected[this.setLocale()];
		}
		return 'ERROR';
	}

	ButtonPressed(args) {
		var pressed = this._ButtonPressed;
		this._ButtonPressed = false;
		return pressed;
	}

	MotionConnect() {
		switch(this._conState[tag.MOTION]) {
		case ConState.NONE:       return Message.ConState.none[this.setLocale()];
		case ConState.ERROR:      return Message.ConState.not_found[this.setLocale()];
		case ConState.TRY:        return Message.ConState.try[this.setLocale()];
		case ConState.CONNECTED:  return Message.ConState.connected[this.setLocale()];
		}
		return 'ERROR';
	}

	MotionDetect(args) {
		var ret = false;
		if(this._MotionDetect == Number(args.DIR)) {
			this._MotionDetect = 0;
			ret = true;
		}
		return ret;
	}

	GpioConnect() {
		switch(this._conState[tag.GPIO]) {
		case ConState.NONE:       return Message.ConState.none[this.setLocale()];
		case ConState.ERROR:      return Message.ConState.not_found[this.setLocale()];
		case ConState.TRY:        return Message.ConState.try[this.setLocale()];
		case ConState.CONNECTED:  return Message.ConState.connected[this.setLocale()];
		}
		return 'ERROR';
	}

	GpioPowerOut(args) {
		if (!this._conDev[tag.GPIO] || !this._conDev[tag.GPIO].isConnected()) return;

		var data;
		if(Number(args.out) == 1) {
			data = [0x01,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x03];
		} else {
			data = [0x01,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x04];
		}
		this._conDev[tag.GPIO].writeWoResp(data);
	}

	setLocale() {
		var locale = formatMessage.setup().locale;

		if (AvailableLocales.includes(locale)) {
			return locale;
		} else {
			return 'en';
		}
	}
}
module.exports = MeshBlocks;
