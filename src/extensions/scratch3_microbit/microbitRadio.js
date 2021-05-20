const extName = 'microbitRadio';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const comlib = require('../scratch3_tukurutch/comlib.js');

const IconURI = require('./microbit.png');

const CMD = {
	displayText: 1,
	displayLed: 2,
	getData: 3,
	getTilt: 4,
	RadioEnable: 5,
	RadioSend: 6,
	RadioRecv: 7,
};

const EvtId = {
	MICROBIT_ID_BUTTON_A			: 1,
	MICROBIT_ID_BUTTON_B			: 2,
	MICROBIT_ID_BUTTON_AB			: 3,
	MICROBIT_ID_RADIO				: 9,
	MICROBIT_ID_GESTURE				: 13,
	MICROBIT_ID_ACCELEROMETER		: 5,
	MICROBIT_ID_IO_P0				: 100,
	MICROBIT_ID_IO_P1				: 101,
	MICROBIT_ID_IO_P2				: 102,
	MICROBIT_ID_IO_P3				: 103,
	MICROBIT_ID_IO_P4				: 104,
	MICROBIT_ID_IO_P5				: 105,
	MICROBIT_ID_IO_P6				: 106,
	MICROBIT_ID_IO_P7				: 107,
	MICROBIT_ID_IO_P8				: 108,
	MICROBIT_ID_IO_P9				: 109,
	MICROBIT_ID_IO_P10				: 110,
	MICROBIT_ID_IO_P11				: 111,
	MICROBIT_ID_IO_P12				: 112,
	MICROBIT_ID_IO_P13				: 113,
	MICROBIT_ID_IO_P14				: 114,
	MICROBIT_ID_IO_P15				: 115,
	MICROBIT_ID_IO_P16				: 116,
	MICROBIT_ID_IO_P17				: 117,
	MICROBIT_ID_IO_P18				: 118,
	MICROBIT_ID_IO_P19				: 119,
	MICROBIT_ID_IO_P20				: 120,
	MES_DEVICE_INFO_ID				: 1103,
	MES_SIGNAL_STRENGTH_ID			: 1101,
	MES_DPAD_CONTROLLER_ID			: 1104,
	MES_BROADCAST_GENERAL_ID			: 2000,
};

const EvtValue = {
	MICROBIT_EVT_ANY					: 0,
	MICROBIT_BUTTON_EVT_DOWN			: 1,
	MICROBIT_BUTTON_EVT_UP				: 2,
	MICROBIT_BUTTON_EVT_CLICK			: 3,
	MICROBIT_RADIO_EVT_DATAGRAM			: 1,
	MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE	: 1,
	MICROBIT_PIN_EVT_RISE				: 2,
	MICROBIT_PIN_EVT_FALL				: 3,
	MICROBIT_PIN_EVT_PULSE_HI			: 4,
	MICROBIT_PIN_EVT_PULSE_LO			: 5,

	MES_ALERT_EVT_ALARM1				: 6,
	MES_ALERT_EVT_ALARM2				: 7,
	MES_ALERT_EVT_ALARM3				: 8,
	MES_ALERT_EVT_ALARM4				: 9,
	MES_ALERT_EVT_ALARM5				: 10,
	MES_ALERT_EVT_ALARM6				: 11,
	MES_ALERT_EVT_DISPLAY_TOAST			: 1,
	MES_ALERT_EVT_FIND_MY_PHONE			: 5,
	MES_ALERT_EVT_PLAY_RINGTONE			: 4,
	MES_ALERT_EVT_PLAY_SOUND			: 3,
	MES_ALERT_EVT_VIBRATE				: 2,
	MES_CAMERA_EVT_LAUNCH_PHOTO_MODE	: 1,
	MES_CAMERA_EVT_LAUNCH_VIDEO_MODE	: 2,
	MES_CAMERA_EVT_START_VIDEO_CAPTURE	: 4,
	MES_CAMERA_EVT_STOP_PHOTO_MODE		: 6,
	MES_CAMERA_EVT_STOP_VIDEO_CAPTURE	: 5,
	MES_CAMERA_EVT_STOP_VIDEO_MODE		: 7,
	MES_CAMERA_EVT_TAKE_PHOTO			: 3,
	MES_CAMERA_EVT_TOGGLE_FRONT_REAR	: 8,
	MES_DEVICE_DISPLAY_OFF				: 5,
	MES_DEVICE_DISPLAY_ON				: 6,
	MES_DEVICE_GESTURE_DEVICE_SHAKEN	: 4,
//	MES_DEVICE_GESTURE_NONE				: 3	x,
	MES_DEVICE_INCOMING_CALL			: 7,
	MES_DEVICE_INCOMING_MESSAGE			: 8,
	MES_DEVICE_ORIENTATION_LANDSCAPE	: 1,
	MES_DEVICE_ORIENTATION_PORTRAIT		: 2,

	MES_DPAD_BUTTON_1_DOWN				: 9,
	MES_DPAD_BUTTON_1_UP				: 10,
	MES_DPAD_BUTTON_2_DOWN				: 11,
	MES_DPAD_BUTTON_2_UP				: 12,
	MES_DPAD_BUTTON_3_DOWN				: 13,
	MES_DPAD_BUTTON_3_UP				: 14,
	MES_DPAD_BUTTON_4_DOWN				: 15,
	MES_DPAD_BUTTON_4_UP				: 16,
	MES_DPAD_BUTTON_A_DOWN				: 1,
	MES_DPAD_BUTTON_A_UP				: 2,
	MES_DPAD_BUTTON_B_DOWN				: 3,
	MES_DPAD_BUTTON_B_UP				: 4,
	MES_DPAD_BUTTON_C_DOWN				: 5,
	MES_DPAD_BUTTON_C_UP				: 6,
	MES_DPAD_BUTTON_D_DOWN				: 7,
	MES_DPAD_BUTTON_D_UP				: 8,

	MES_REMOTE_CONTROL_EVT_FORWARD		: 6,
	MES_REMOTE_CONTROL_EVT_NEXTTRACK	: 4,
	MES_REMOTE_CONTROL_EVT_PAUSE		: 2,
	MES_REMOTE_CONTROL_EVT_PLAY			: 1,
	MES_REMOTE_CONTROL_EVT_PREVTRACK	: 5,
	MES_REMOTE_CONTROL_EVT_REWIND		: 7,
	MES_REMOTE_CONTROL_EVT_STOP			: 3,
	MES_REMOTE_CONTROL_EVT_VOLUMEDOWN   : 9,
	MES_REMOTE_CONTROL_EVT_VOLUMEUP		: 8,
};

class Scratch3Blocks {

	constructor(runtime) {
		this.runtime = runtime;
		if(typeof this.runtime.dev === 'undefined'
		|| typeof this.runtime.dev.RadioRecvCB === 'undefined') {
			alert('Please load micro:bit extension.');
			throw 'error';
		}
		this.runtime.dev.RadioRecvCB = this.RadioRecv.bind(this);
		this.serial = 0;
		this.startTime = 0;

		this.events = [];
		this.recv = {number:0, string:'', serial:0};
		this.recvSaved = Object.assign({}, this.recv);
	}

	getInfo() {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}

		return {
			id:extName,
			name:'micro:bit Radio',
			menuIconURI: IconURI,
			blocks: [
			{blockType: BlockType.COMMAND, opcode:'enableRadio', text: 'enable Radio  group[ARG1] frequency[ARG2] power[ARG3] serial[ARG4]', arguments: {
					ARG1: {type:ArgumentType.NUMBER, defaultValue: 1},
					ARG2: {type:ArgumentType.NUMBER, defaultValue: 7},
					ARG3: {type:ArgumentType.NUMBER, defaultValue: 6},
					ARG4: {type:ArgumentType.NUMBER, defaultValue: 0},
				}},
				{blockType: BlockType.COMMAND, opcode:'sendNum', text: 'send number[ARG1]', arguments: {
					ARG1: {type:ArgumentType.NUMBER, defaultValue: 1},
				}},
				{blockType: BlockType.COMMAND, opcode:'sendStrNum', text: 'send string[ARG1] number[ARG2]', arguments: {
					ARG1: {type:ArgumentType.STRING, defaultValue: 'name'},
					ARG2: {type:ArgumentType.NUMBER, defaultValue: 1},
				}},
				{blockType: BlockType.COMMAND, opcode:'sendStr', text: 'send string[ARG1]', arguments: {
					ARG1: {type:ArgumentType.STRING, defaultValue: 'name'},
				}},
				{blockType: BlockType.HAT, opcode:'whenRecv', text: 'receive[ARG1]', arguments: {
					ARG1: {type:ArgumentType.STRING, menu:'radioRecv', defaultValue:'number'}
				}},
				{blockType: BlockType.REPORTER, opcode:'getNumber', text: 'number' },
				{blockType: BlockType.REPORTER, opcode:'getString', text: 'string' },
				{blockType: BlockType.REPORTER, opcode:'getSerial', text: 'serial' },

				{blockType: BlockType.COMMAND, opcode: 'sendEvent', text: 'send event[ARG1] [ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: 'MICROBIT_ID_BUTTON_A', menu: 'EvtId' },
					ARG2: { type: ArgumentType.STRING, defaultValue: 'MICROBIT_BUTTON_EVT_CLICK', menu: 'EvtValue' },
				}},
			],
			menus: {
				radioRecv: { acceptReporters: true, items: ['number', 'string', {text:'string & number', value:'stringNumber'} ]},

				EvtId: { acceptReporters: true, items: [
				'MICROBIT_ID_BUTTON_A',
				'MICROBIT_ID_BUTTON_B',
				'MICROBIT_ID_BUTTON_AB',
				'MICROBIT_ID_RADIO',
				'MICROBIT_ID_GESTURE',
				'MICROBIT_ID_ACCELEROMETER',
				'MICROBIT_ID_IO_P0',
				'MICROBIT_ID_IO_P1',
				'MICROBIT_ID_IO_P2',
				'MICROBIT_ID_IO_P3',
				'MICROBIT_ID_IO_P4',
				'MICROBIT_ID_IO_P5',
				'MICROBIT_ID_IO_P6',
				'MICROBIT_ID_IO_P7',
				'MICROBIT_ID_IO_P8',
				'MICROBIT_ID_IO_P9',
				'MICROBIT_ID_IO_P10',
				'MICROBIT_ID_IO_P11',
				'MICROBIT_ID_IO_P12',
				'MICROBIT_ID_IO_P13',
				'MICROBIT_ID_IO_P14',
				'MICROBIT_ID_IO_P15',
				'MICROBIT_ID_IO_P16',
				'MICROBIT_ID_IO_P17',
				'MICROBIT_ID_IO_P18',
				'MICROBIT_ID_IO_P19',
				'MICROBIT_ID_IO_P20',
				'MES_DEVICE_INFO_ID',
				'MES_SIGNAL_STRENGTH_ID',
				'MES_DPAD_CONTROLLER_ID',
				'MES_BROADCAST_GENERAL_ID',
				]},

				EvtValue: { acceptReporters: true, items: [
				'MICROBIT_EVT_ANY',
				'MICROBIT_BUTTON_EVT_DOWN',
				'MICROBIT_BUTTON_EVT_UP',
				'MICROBIT_BUTTON_EVT_CLICK',				// ★
				'MICROBIT_RADIO_EVT_DATAGRAM',
				'MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE',
				'MICROBIT_PIN_EVT_RISE',
				'MICROBIT_PIN_EVT_FALL',
				'MICROBIT_PIN_EVT_PULSE_HI',
				'MICROBIT_PIN_EVT_PULSE_LO',

				'MES_ALERT_EVT_ALARM1',
				'MES_ALERT_EVT_ALARM2',
				'MES_ALERT_EVT_ALARM3',
				'MES_ALERT_EVT_ALARM4',
				'MES_ALERT_EVT_ALARM5',
				'MES_ALERT_EVT_ALARM6',
				'MES_ALERT_EVT_DISPLAY_TOAST',
				'MES_ALERT_EVT_FIND_MY_PHONE',
				'MES_ALERT_EVT_PLAY_RINGTONE',
				'MES_ALERT_EVT_PLAY_SOUND',
				'MES_ALERT_EVT_VIBRATE',
				'MES_CAMERA_EVT_LAUNCH_PHOTO_MODE',
				'MES_CAMERA_EVT_LAUNCH_VIDEO_MODE',
				'MES_CAMERA_EVT_START_VIDEO_CAPTURE',
				'MES_CAMERA_EVT_STOP_PHOTO_MODE',
				'MES_CAMERA_EVT_STOP_VIDEO_CAPTURE',
				'MES_CAMERA_EVT_STOP_VIDEO_MODE',
				'MES_CAMERA_EVT_TAKE_PHOTO',
				'MES_CAMERA_EVT_TOGGLE_FRONT_REAR',
				'MES_DEVICE_DISPLAY_OFF',
				'MES_DEVICE_DISPLAY_ON',
				'MES_DEVICE_GESTURE_DEVICE_SHAKEN',
				//	MES_DEVICE_GESTURE_NONE				: 3	x,
				'MES_DEVICE_INCOMING_CALL',
				'MES_DEVICE_INCOMING_MESSAGE',
				'MES_DEVICE_ORIENTATION_LANDSCAPE',
				'MES_DEVICE_ORIENTATION_PORTRAIT',

				'MES_DPAD_BUTTON_1_DOWN',
				'MES_DPAD_BUTTON_1_UP',
				'MES_DPAD_BUTTON_2_DOWN',
				'MES_DPAD_BUTTON_2_UP',
				'MES_DPAD_BUTTON_3_DOWN',
				'MES_DPAD_BUTTON_3_UP',
				'MES_DPAD_BUTTON_4_DOWN',
				'MES_DPAD_BUTTON_4_UP',
				'MES_DPAD_BUTTON_A_DOWN',
				'MES_DPAD_BUTTON_A_UP',
				'MES_DPAD_BUTTON_B_DOWN',
				'MES_DPAD_BUTTON_B_UP',
				'MES_DPAD_BUTTON_C_DOWN',
				'MES_DPAD_BUTTON_C_UP',
				'MES_DPAD_BUTTON_D_DOWN',
				'MES_DPAD_BUTTON_D_UP',

				'MES_REMOTE_CONTROL_EVT_FORWARD',
				'MES_REMOTE_CONTROL_EVT_NEXTTRACK',
				'MES_REMOTE_CONTROL_EVT_PAUSE',
				'MES_REMOTE_CONTROL_EVT_PLAY',
				'MES_REMOTE_CONTROL_EVT_PREVTRACK',
				'MES_REMOTE_CONTROL_EVT_REWIND',
				'MES_REMOTE_CONTROL_EVT_STOP',
				'MES_REMOTE_CONTROL_EVT_VOLUMEDOWN',
				'MES_REMOTE_CONTROL_EVT_VOLUMEUP',
				]},
			}
		};
	}

	RadioRecv(data) {
		let dv = new DataView(data.buffer);
		let event = ''
		if(data[3] == 1) {
			let strOfs = 0;
			this.recv.serial = dv.getUint32(9, true);
			switch(data[4]) {
			case 0:
				this.recv.number = dv.getInt32(13, true);
				event = 'number';
				break;
			case 4:
				this.recv.number = dv.getFloat64(13, true);
				event = 'number';
				break;
			case 1:
				strOfs = 13;
				event = 'string';
				break;
			case 2:
				this.recv.number = dv.getInt32(13, true);
				strOfs = 13+4;
				event = 'stringNumber';
				break;
			case 5:
				this.recv.number = dv.getFloat64(13, true);
				strOfs = 13+8;
				event = 'stringNumber';
				break;
			}
			if(strOfs) {
				console.log(data.slice(strOfs+1, data[strOfs]));
				this.recv.string = String.fromCharCode.apply(null, data.slice(strOfs+1, data[strOfs]));
			}
			console.log(event + ':' + this.recv.string + ',' + this.recv.number);

			const index = this.events.indexOf(event);
			if(index < 0) this.events.push(event);
		} else {
			let id = dv.getUint16(4, true);
			let value = dv.getUint16(6, true);

			switch(id) {
			case EvtId.MICROBIT_ID_BUTTON_A:	event = 'A'; break;
			case EvtId.MICROBIT_ID_BUTTON_B:	event = 'B'; break;
			case EvtId.MICROBIT_ID_GESTURE:
			//	if(EvtValue.
				event = 'shaken'; break;
			case MICROBIT_ID_IO_P0:				event = '0'; break;
			case MICROBIT_ID_IO_P1:				event = '1'; break;
			case MICROBIT_ID_IO_P2:				event = '2'; break;
			}

			console.log(event);
			const index = this.runtime.dev.events.indexOf(event);
			if(index < 0) this.runtime.dev.events.push(event);
		}
	}

	whenRecv(args) {
		this.runtime.dev.dataFlag = true;
		const index = this.events.indexOf(args.ARG1);
		if (index > -1) {
			this.events.splice(index, 1);
			this.recvSaved = Object.assign({}, this.recv);
			return true;
		}
		return false;
	}

	enableRadio(args) {
		if(this.runtime.dev.comlib.ifType != 'UART')
			return ['Please connect with USB','USBで接続して下さい'][this._locale];

		this.serial = args.ARG4*1;
		let date = new Date();
		this.startTime = date.getTime();

		return this.runtime.dev.comlib.sendRecv(CMD.RadioEnable, 
												{ARG1:{type2:'B'},ARG2:{type2:'B'},ARG3:{type2:'B'}},
												{ARG1:args.ARG1, ARG2:args.ARG2, ARG3:args.ARG3});
	}

	sendStr(args) {
		let data = new Uint8Array(4+1+4+4+1+18);
		let dv = new DataView(data.buffer);

		data.set([data.length-1,1,0,1,2], 0);
		let date = new Date();
		dv.setUint32(5, (date.getTime()-this.startTime)&0xFFFFFFFF, true);
		dv.setUint32(9, this.serial, true);

		let str = args.ARG1.slice(0,18);
		data[13] = str.length;
		let charList = str.split('');
		for(let j = 0; j < charList.length; j++)
			data[14+j] = charList[j].charCodeAt(0);

		return this.runtime.dev.comlib.sendRecv(CMD.RadioSend, {ARG1:{type2:'b'}}, {ARG1:data});
	}

	sendNum(args) {
		let num = args.ARG1*1;
		let data;
		let dv;
		if(Number.isInteger(num)) {
			data = new Uint8Array(4+1+4+4+4);
			dv = new DataView(data.buffer);
			data.set([data.length-1,1,0,1,0], 0);
			dv.setUint32(13, num, true);
		} else {
			data = new Uint8Array(4+1+4+4+8);
			dv = new DataView(data.buffer);
			data.set([data.length-1,1,0,1,4], 0);
			dv.setFloat64(13, num, true);
		}
		let date = new Date();
		dv.setUint32(5, (date.getTime()-this.startTime)&0xFFFFFFFF, true);
		dv.setUint32(9, this.serial, true);

		return this.runtime.dev.comlib.sendRecv(CMD.RadioSend, {ARG1:{type2:'b'}}, {ARG1:data});
	}

	sendStrNum(args) {
		let num = args.ARG2*1;
		let data;
		let dv;
		let ofs;
		if(Number.isInteger(num)) {
			data = new Uint8Array(4+1+4+4+4+1+8);
			dv = new DataView(data.buffer);
			data.set([data.length-1,1,0,1,1], 0);
			dv.setUint32(13, num, true);
			ofs = 13+4;
		} else {
			data = new Uint8Array(4+1+4+4+8+1+8);
			dv = new DataView(data.buffer);
			data.set([data.length-1,1,0,1,5], 0);
			dv.setFloat64(13, num, true);
			ofs = 13+8;
		}
		let date = new Date();
		dv.setUint32(5, (date.getTime()-this.startTime)&0xFFFFFFFF, true);
		dv.setUint32(9, this.serial, true);

		let str = args.ARG1.slice(0,8);
		data[ofs+0] = str.length;
		let charList = str.split('');
		for(let j = 0; j < charList.length; j++)
			data[ofs+1+j] = charList[j].charCodeAt(0);

		return this.runtime.dev.comlib.sendRecv(CMD.RadioSend, {ARG1:{type2:'b'}}, {ARG1:data});
	}

	getNumber() { return this.recvSaved.number; }
	getString() { return this.recvSaved.string; }
	getSerial() { return this.recvSaved.serial; }

	sendEvent(args) {
		if(!EvtId.hasOwnProperty(args.ARG1)) return 'error';
		let id = EvtId[args.ARG1];

		if(!EvtValue.hasOwnProperty(args.ARG2)) return 'error';
		let value = EvtValue[args.ARG2];
		console.log(id + ',' + value);

		let data = new Uint8Array(4+16);
		let dv = new DataView(data.buffer);

		//0100 0000 00000000 bfe50c00 00000000
		data.set([data.length-1,1,0,2], 0);
		dv.setUint16(4, id, true);
		dv.setUint16(6, value, true);
		dv.setUint32(8, this.serial, true);
		let date = new Date();
		dv.setUint32(12, ((date.getTime()-this.startTime)*1000)&0xFFFFFFFF, true);

		return this.runtime.dev.comlib.sendRecv(CMD.RadioSend, {ARG1:{type2:'b'}}, {ARG1:data});
	}
}

module.exports = Scratch3Blocks;
