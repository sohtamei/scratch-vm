const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');


/**
 * Icon png to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,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';

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = menuIconURI;

const SupportCamera = false;

/**
 * How long to wait in ms before timing out requests to server.
 * @type {int}
 */
//const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

let _resolve = null;
let _error = null;
let _sendBuf = null;
let _alertFlag = false;

/**
 * Class for the TukuBoard block in Scratch 3.0.
 * @constructor
 */
class Scratch3TukuBoardBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this._ipadrs = '192.168.1.xx';
        this._ws = null;
		let cookies_get = document.cookie.split(';');
		for(let i=0;i<cookies_get.length;i++) {
			let tmp = cookies_get[i].trim().split('=');
			if(tmp[0]=='TukuBoard_ip') {
				this._ipadrs=tmp[1];
				console.log('TukuBoard_ip='+this._ipadrs);
				break;
			}
		}
    }

	get_blocks() {
		this._blocks = [
{blockType: BlockType.COMMAND, opcode: 'setIotIp', text: {
	'en': 'setup IP address [ARG1]',
	'ja': 'IPアドレス設定 [ARG1]',
}[this._locale], arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: this._ipadrs},
}},

{blockType: BlockType.COMMAND, opcode: 'setLED', text: {
    'en': 'set LED [ARG1] [ARG2]',
    'ja': 'LED [ARG1] を [ARG2]',
}[this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'led' },
    ARG2: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'onoff' },
}},

{blockType: BlockType.COMMAND, opcode: 'BuzzerJ2', text: {
    'en': 'play tone [ARG1] beat [ARG2]',
    'ja': '[ARG1] を [ARG2] 鳴らす',
}[this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:262, menu: 'noteJ2' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:500, menu: 'beats' },
}},

{blockType: BlockType.REPORTER, opcode: 'getAnalogAve', text: {
    'en': 'Sensor [ARG1] average [ARG2] times',
    'ja': 'センサ [ARG1] の [ARG2] 回平均',
}[this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'sensor' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:4 },
}},

{blockType: BlockType.BOOLEAN, opcode: 'getSW', text: {
    'en': 'SW [ARG1]',
    'ja': 'スイッチ [ARG1]',
}[this._locale], arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:1, menu: 'sw' },
}},


		];
		return this._blocks;
	}

	get_menus() {
	  return {
beats: { acceptReporters: true, items: [
{ text: {
    'en': 'Half',
    'ja': '2分音符',
}[this._locale], value: 500 },
{ text: {
    'en': 'Quarter',
    'ja': '4分音符',
}[this._locale], value: 250 },
{ text: {
    'en': 'Eighth',
    'ja': '8分音符',
}[this._locale], value: 125 },
{ text: {
    'en': 'Whole',
    'ja': '全音符',
}[this._locale], value: 1000 },
{ text: {
    'en': 'Double',
    'ja': '倍全音符',
}[this._locale], value: 2000 },
]},

led: { acceptReporters: true, items: ['1','2','3','4','5','6',]},

noteJ1: { acceptReporters: true, items: [
{ text: {
    'en': 'C2',
    'ja': 'ド2',
}[this._locale], value: 65 },
{ text: {
    'en': 'D2',
    'ja': 'レ2',
}[this._locale], value: 73 },
{ text: {
    'en': 'E2',
    'ja': 'ミ2',
}[this._locale], value: 82 },
{ text: {
    'en': 'F2',
    'ja': 'ファ2',
}[this._locale], value: 87 },
{ text: {
    'en': 'G2',
    'ja': 'ソ2',
}[this._locale], value: 98 },
{ text: {
    'en': 'A2',
    'ja': 'ラ2',
}[this._locale], value: 110 },
{ text: {
    'en': 'B2',
    'ja': 'シ2',
}[this._locale], value: 123 },
{ text: {
    'en': 'C3',
    'ja': 'ド3',
}[this._locale], value: 131 },
{ text: {
    'en': 'D3',
    'ja': 'レ3',
}[this._locale], value: 147 },
{ text: {
    'en': 'E3',
    'ja': 'ミ3',
}[this._locale], value: 165 },
{ text: {
    'en': 'F3',
    'ja': 'ファ3',
}[this._locale], value: 175 },
{ text: {
    'en': 'G3',
    'ja': 'ソ3',
}[this._locale], value: 196 },
{ text: {
    'en': 'A3',
    'ja': 'ラ3',
}[this._locale], value: 220 },
{ text: {
    'en': 'B3',
    'ja': 'シ3',
}[this._locale], value: 247 },
]},

noteJ2: { acceptReporters: true, items: [
{ text: {
    'en': 'C4',
    'ja': 'ド4',
}[this._locale], value: 262 },
{ text: {
    'en': 'D4',
    'ja': 'レ4',
}[this._locale], value: 294 },
{ text: {
    'en': 'E4',
    'ja': 'ミ4',
}[this._locale], value: 330 },
{ text: {
    'en': 'F4',
    'ja': 'ファ4',
}[this._locale], value: 349 },
{ text: {
    'en': 'G4',
    'ja': 'ソ4',
}[this._locale], value: 392 },
{ text: {
    'en': 'A4',
    'ja': 'ラ4',
}[this._locale], value: 440 },
{ text: {
    'en': 'B4',
    'ja': 'シ4',
}[this._locale], value: 494 },
{ text: {
    'en': 'C5',
    'ja': 'ド5',
}[this._locale], value: 523 },
{ text: {
    'en': 'D5',
    'ja': 'レ5',
}[this._locale], value: 587 },
{ text: {
    'en': 'E5',
    'ja': 'ミ5',
}[this._locale], value: 659 },
{ text: {
    'en': 'F5',
    'ja': 'ファ5',
}[this._locale], value: 698 },
{ text: {
    'en': 'G5',
    'ja': 'ソ5',
}[this._locale], value: 784 },
{ text: {
    'en': 'A5',
    'ja': 'ラ5',
}[this._locale], value: 880 },
{ text: {
    'en': 'B5',
    'ja': 'シ5',
}[this._locale], value: 988 },
]},

noteJ3: { acceptReporters: true, items: [
{ text: {
    'en': 'C6',
    'ja': 'ド6',
}[this._locale], value: 1047 },
{ text: {
    'en': 'D6',
    'ja': 'レ6',
}[this._locale], value: 1175 },
{ text: {
    'en': 'E6',
    'ja': 'ミ6',
}[this._locale], value: 1319 },
{ text: {
    'en': 'F6',
    'ja': 'ファ6',
}[this._locale], value: 1397 },
{ text: {
    'en': 'G6',
    'ja': 'ソ6',
}[this._locale], value: 1568 },
{ text: {
    'en': 'A6',
    'ja': 'ラ6',
}[this._locale], value: 1760 },
{ text: {
    'en': 'B6',
    'ja': 'シ6',
}[this._locale], value: 1976 },
{ text: {
    'en': 'C7',
    'ja': 'ド7',
}[this._locale], value: 2093 },
{ text: {
    'en': 'D7',
    'ja': 'レ7',
}[this._locale], value: 2349 },
{ text: {
    'en': 'E7',
    'ja': 'ミ7',
}[this._locale], value: 2637 },
{ text: {
    'en': 'F7',
    'ja': 'ファ7',
}[this._locale], value: 2794 },
{ text: {
    'en': 'G7',
    'ja': 'ソ7',
}[this._locale], value: 3136 },
{ text: {
    'en': 'A7',
    'ja': 'ラ7',
}[this._locale], value: 3520 },
{ text: {
    'en': 'B7',
    'ja': 'シ7',
}[this._locale], value: 3951 },
{ text: {
    'en': 'C8',
    'ja': 'ド8',
}[this._locale], value: 4186 },
{ text: {
    'en': 'D8',
    'ja': 'レ8',
}[this._locale], value: 4699 },
]},

onoff: { acceptReporters: true, items: [
{ text: 'On', value: 1 },
{ text: 'Off', value: 0 },
]},

sensor: { acceptReporters: true, items: ['1','2','3','4',]},

sw: { acceptReporters: true, items: ['1','2','3',]},


	  };
	}

setLED(args,util) { return this.getTest(arguments.callee.name, args); }
BuzzerJ2(args,util) { return this.getTest(arguments.callee.name, args); }
getAnalogAve(args,util) { return this.getTest(arguments.callee.name, args); }
getSW(args,util) { return this.getTest(arguments.callee.name, args); }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        switch(formatMessage.setup().locale) {
          case 'ja':
          case 'ja-Hira':
            this._locale = 'ja';
            break;
          default:
            this._locale = 'en';
            break;
        }

	//	blocks[0].arguments.ARG1.defaultValue = this._ipadrs;
        return {
            id: 'TukuBoard',
            name: 'TukuBoard',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: this.get_blocks(),
            menus: this.get_menus(),
        };
    }
    
    setIotIp (args) {
        this._ipadrs = Cast.toString(args.ARG1);
        document.cookie = 'TukuBoard_ip=' + this._ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
        if(SupportCamera) {
          document.cookie = 'Camera_ip=' + this._ipadrs + '; samesite=lax; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
          alert(this._ipadrs + {
            'en': ' has been saved (for Robot & Camera).',
            'ja': 'を保存しました(ロボット & カメラ)',
          }[this._locale]);
        } else {
          alert(this._ipadrs + {
            'en': ' has been saved.',
            'ja': 'を保存しました',
          }[this._locale]);
        }
        console.log(this._ipadrs);
    }

	onmessage(event) {
		var respUint8 = new Uint8Array(event.data);
		//for(i=0;i<respUint8.length;i++) console.log(respUint8[i].toString(16));	// debug
		var tmp = 0;
		if(respUint8[0] == 0xFF && respUint8[1] == 0x55 && respUint8[2] == respUint8.length-3 && respUint8.length >= 5) {
			var tmp2 = new DataView(respUint8.buffer);
			switch(respUint8[3]) {
			case 1: tmp = tmp2.getUint8(4); break;
			case 2: tmp = tmp2.getInt16(4, true); break;
			case 3: tmp = tmp2.getInt32(4, true); break;
			case 4: tmp = tmp2.getFloat32(4, true); break;
			case 5: tmp = tmp2.getFloat64(4, true); break;
			case 6: tmp = String.fromCharCode.apply(null, respUint8.subarray(4)); break;
		//	case 7: break;		// bytes
			}
			console.log(tmp);
		}
		const resp = tmp;
		_resolve(resp);
		_resolve = null; _error = null;
		_alertFlag = false;
		return resp;
	}

	getTest(opcode,args) {
		for(index = 0; index < this._blocks.length; index++) {
			if(this._blocks[index].opcode == opcode) break;
		}
		if(index === this._blocks.length) return 0;

		var cmdUint8 = new Uint8Array(256);
		var cmd = new DataView(cmdUint8.buffer);
		var tmp = new Uint8Array([0xff, 0x55, 0x00, index]);
		for(ofs = 0; ofs < tmp.length; ofs++)
			cmd.setUint8(ofs,tmp[ofs]);

		var param = [args.ARG1, args.ARG2, args.ARG3, args.ARG4];
		for(i = 1; ; i++) {
			eval("var param = args.ARG"+i);
			eval("var def = this._blocks[index].arguments.ARG"+i);
		//	console.log(i,param, def);
			if(typeof param === "undefined") break;
			switch(def.type2) {
			case "B": cmd.setUint8(ofs,param);        ofs+=1; break;
			case "S": cmd.setInt16(ofs,param, true);  ofs+=2; break;
			case "L": cmd.setInt32(ofs,param, true);  ofs+=4; break;
			case "F": cmd.setFloat32(ofs,param, true);ofs+=4; break;
			case "D": cmd.setFloat64(ofs,param,true); ofs+=8; break;

			case "s":
				var charList = param.split('');
				for (var j = 0; j < charList.length; j++)
					cmdUint8[ofs+j] = charList[j].charCodeAt(0);
				cmdUint8[ofs+j] = 0;
				ofs += charList.length+1;
				break;
/*
			case "b":
				var n = param.length/2;
				cmd.writeByte(n);
				for(var j:int = 0; j < n; j++)
					cmd.writeByte(parseInt(param.substr(j*2, 2),16));
				break;
*/
			}
		}
		cmd.setUint8(2, ofs-3);
	//	for(i=0;i<ofs;i++) console.log(cmd.getUint8(i).toString(16));

		const _this = this;
		return new Promise(function(resolve, error) {
			_resolve = resolve;
			_error = error;
			//console.log('send: ' + cmdUint8.slice(0,ofs));	// debug

			if(_this._ws !== null) {
				_this._ws.send(cmdUint8.slice(0,ofs));
				return;
			}
		/*
			if(_this._ipadrs == '192.168.1.xx') {
				error('');
				return;
			}
		*/
			_sendBuf = cmdUint8.slice(0,ofs);

			_this._ws = new WebSocket('ws://'+_this._ipadrs+':54323');
			_this._ws.binaryType = 'arraybuffer';

			_this._ws.onopen = function(e) {
				console.log('open: ' + e);
				_this._ws.send(_sendBuf);
			}

			_this._ws.onmessage = _this.onmessage;

			_this._ws.onclose = function(event) {
				if (event.wasClean) {
					console.log(`close: Connection closed cleanly, code=${event.code} reason=${event.reason}`);
				} else {
					console.log('close: Connection died');
				}
				_this._ws = null;
				if(_error !== null) _error('');
			};

			_this._ws.onerror = function(error) {
				console.log('[error] '+error.message);
				_this._ws.close();
				_this._ws = null;
				if(_error !== null) _error('');
				if(!_alertFlag) alert('cannot connect to ' + _this._ipadrs);
				_alertFlag = true;
			};
			return;
		});
	}

}
module.exports = Scratch3TukuBoardBlocks;
