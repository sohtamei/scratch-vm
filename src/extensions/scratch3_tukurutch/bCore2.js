"use strict";
var extName = 'bCore2';			// _ などの記号厳禁

const IconURI = 'data:image/png;base64,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';

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

const BLEUUID = {
/*
	GenericAccessService:		0x1800,
	DeviceName:					0x2A00,		// bCore_BA8B07EA3590

	DeviceInformationService:	0x180A,
	ModelNumberString:			0x2A24,		// bCore
	SerialNumberString:			0x2A25,		// BA8B07EA3590
	FirmwareRevisionString:		0x2A26,		// F4.00
	HardwareRevisionString:		0x2A27,		// H4.00
	ManufacturerNameString:		0x2A29,		// Vagabond Works
*/
	bCoreService:			'389caaf0-843f-4d3b-959d-c954cce14655',
	GetBatteryVoltage:		'389caaf1-843f-4d3b-959d-c954cce14655',		// (R)1E 0E
	SetMotorPWM:			'389caaf2-843f-4d3b-959d-c954cce14655',		// (W)
	SetPortOut:				'389caaf3-843f-4d3b-959d-c954cce14655',		// (W)
	SetServoPosition:		'389caaf4-843f-4d3b-959d-c954cce14655',		// (W)
	BurstCommand:			'389caaf5-843f-4d3b-959d-c954cce14655',		// (W)
	GetFunctions:			'389caaff-843f-4d3b-959d-c954cce14655',		// (R)
};

class Scratch3Blocks {

	constructor (runtime) {
		this._runtime = runtime;

		this.ble = null;

		this.burstBuf = new Uint8Array([0x80,0x80,0x00,0x80,0x80,0x80,0x80]);
		// 0：モーターCh0
		// 1：モーターCh1
		// 2：ポート出力のOn/Offの切り替え
		// 3：サーボCh0
		// 4：サーボCh1
		// 5：サーボCh2
		// 6：サーボCh3

		this._runtime.registerPeripheralExtension(extName, this);
	}

	getInfo() {
		let localeStr = formatMessage.setup().locale;
		let locale = (localeStr == 'ja' || localeStr == 'ja-Hira') ? 1: 0;
		this._locale = locale;

		return {
			id: extName,
			name: 'bCore for Scrub',
			menuIconURI: IconURI,
			showStatusButton: true,

			blocks: [
			//	{blockType: BlockType.COMMAND, opcode: 'setConfig', text: ['connect/disconnect','接続/切断'][locale], arguments: {
			//	}},

				{blockType: BlockType.COMMAND, opcode: 'setCar', text: [
				    '[ARG1] at speed [ARG2] [ARG3]',
				    '[ARG1] 向きに [ARG2] の速さ[ARG3]',
				    
				][this._locale], arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'direction' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:100 },
					ARG3: { type: ArgumentType.STRING, defaultValue:'0', menu: 'motorType' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'stopCar', text: [
				    'stop',
				    'ストップ',
				][this._locale], arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'SetMotorPWM', text: 'Set Motor PWM ch[ARG1] level[ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'motorch' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:127 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'SetServoPosition', text: 'Set Servo Position ch[ARG1] level[ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'servoch' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:255 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'SetPortOut', text: 'Set Port Out ch0[ARG1] ch1[ARG2] ch2[ARG3] ch3[ARG4]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'onoff' },
					ARG2: { type: ArgumentType.STRING, defaultValue:'0', menu: 'onoff' },
					ARG3: { type: ArgumentType.STRING, defaultValue:'0', menu: 'onoff' },
					ARG4: { type: ArgumentType.STRING, defaultValue:'0', menu: 'onoff' },
				}},

			//	{blockType: BlockType.REPORTER, opcode: 'GetBatteryVoltage', text: 'Get Battery Voltage［mV］', disableMonitor:true, arguments: {
			//	}},
			],

			menus: {
			// value - number禁止
				onoff: { acceptReporters: true, items: ['1','0'] },
				motorch: { acceptReporters: true, items: ['0','1'] },
				servoch: { acceptReporters: true, items: ['0','1','2','3'] },

				direction: { acceptReporters: true, items: [
					{ text: ['run forward','前'][this._locale], value: '0' },
					{ text: ['turn left','左'][this._locale], value: '1' },
					{ text: ['turn right','右'][this._locale], value: '2' },
					{ text: ['run backward','後'][this._locale], value: '3' },
					{ text: ['rotate left','左旋回'][this._locale], value: '4' },
					{ text: ['rotate right','右旋回'][this._locale], value: '5' },
					{ text: ['stop','ストップ'][this._locale], value: '6' },
				]},

				motorType: { acceptReporters: true, items: [
					{ text: 'dc motor', value: '0' },
					{ text: '360 servo', value: '3' },
				]},
			}
		};
	}

	// for connect menu ---------------------------

	isConnected() {
		let connected = false;
		if(this.ble) {
			connected = this.ble.isConnected();
		}
		console.log('isconnected='+connected);
		return connected;
	}

	scan() {
		console.log('scan');
		if(this.ble) {
			this.ble.disconnect();
			this.ble = null;
		}
		this.ble = new BLE(this._runtime, extName,
			{filters: [
				{services: [BLEUUID.bCoreService]}
			]},
			() => {
				console.log('onConnect');
			},
			this.onDisconnect.bind(this)
		);
	}

	connect(id) {
		console.log('connect');
		if (this.ble) {
			this.ble.connectPeripheral(id);
		}
	}

	disconnect() {
		console.log('disconnect');
		if(this.ble) {
			this.ble.disconnect();
			this.ble = null;
		}
		this.onDisconnect();
		this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);
	}

	onDisconnect() {
		console.log('onDisconnect');
		this.ble = null;
	}

	_openBle() {
		return;
	}

	// common --------------

	onMessage(base64) {
		console.log(base64);
	}

	// read動作せず
	GetBatteryVoltage(args) {
		console.log('GetBatteryVoltage');
		if(!this.ble) return this._openBle();
		this.ble.read(BLEUUID.bCoreService, BLEUUID.GetBatteryVoltage, false, this.onMessage.bind(this));
/*
		return new Promise(resolve => {
			this.ble.read(BLEUUID.bCoreService, BLEUUID.GetBatteryVoltage, true, data => {
				resolve(data);
			});
		})
	//	return this.charGetBatteryVoltage.readValue()
		.then(data => {
			console.log(data);
			let tmp2 = new DataView(data.buffer);
			return tmp2.getUint16(0, true);
		});
*/
	}

	SetMotorPWM(args) {
		if(!this.ble) return this._openBle();
		let ch = Number(args.ARG1);
		let level = Number(args.ARG2) + 128;
		level = Math.min(255, Math.max(0, level));

		if(ch < 2) this.burstBuf[0+ch] = level;

		let buf = new Uint8Array([ch, level]);
		console.log('w:'+this._dumpBuf(buf));
	//	return this.charSetMotorPWM.writeValue(buf);
		const data = Base64Util.uint8ArrayToBase64(buf);
		return this.ble.write(BLEUUID.bCoreService, BLEUUID.SetMotorPWM, data, 'base64')
		.then(() => {return;});
	}

	SetPortOut(args) {
		if(!this.ble) return this._openBle();
		let buf = new Uint8Array([Number(args.ARG1)*1 + Number(args.ARG2)*2 + Number(args.ARG3)*4 + Number(args.ARG4)*8]);
		this.burstBuf[2] = buf[0];
		console.log('w:'+this._dumpBuf(buf));
	//	return this.charSetPortOut.writeValue(buf);
		const data = Base64Util.uint8ArrayToBase64(buf);
		return this.ble.write(BLEUUID.bCoreService, BLEUUID.SetPortOut, data, 'base64')
		.then(() => {return;});
	}

	SetServoPosition(args) {
		if(!this.ble) return this._openBle();
		let ch = Number(args.ARG1);
		let level = Number(args.ARG2);

		if(ch < 4) this.burstBuf[3+ch] = level;

		let buf = new Uint8Array([ch, level]);
		console.log('w:'+this._dumpBuf(buf));
	//	return this.charSetServoPosition.writeValue(buf);
		const data = Base64Util.uint8ArrayToBase64(buf);
		return this.ble.write(BLEUUID.bCoreService, BLEUUID.SetServoPosition, data, 'base64')
		.then(() => {return;});
	}

	setCar(args) {
		if(!this.ble) return this._openBle();
		let dir = Number(args.ARG1);
		let speed = Number(args.ARG2);
		let motorType = Number(args.ARG3);
		const dir_table = [
			{L: 1, R:-1},  // 0:FORWARD
			{L: 0, R:-1},  // 1:LEFT
			{L: 1, R: 0},  // 2:RIGHT
			{L:-1, R: 1},  // 3:BACK
			{L:-1, R:-1},  // 4:ROLL_LEFT
			{L: 1, R: 1},  // 5:ROLL_RIGHT
			{L: 0, R: 0},  // 6:STOP
		];

		if(dir >= dir_table.length) return;

		let left  = speed * dir_table[dir].L * 128/100 + 128;
		let right = speed * dir_table[dir].R * 128/100 + 128;
		left  = Math.min(255, Math.max(0, Math.trunc(left)));
		right = Math.min(255, Math.max(0, Math.trunc(right)));

		this.burstBuf[motorType+0] = left;
		this.burstBuf[motorType+1] = right;
		console.log('w:'+this._dumpBuf(this.burstBuf));
	//	return this.charBurstCommand.writeValue(this.burstBuf);
		const data = Base64Util.uint8ArrayToBase64(this.burstBuf);
		return this.ble.write(BLEUUID.bCoreService, BLEUUID.BurstCommand, data, 'base64')
		.then(() => {return;});
	}

	stopCar(args) {
		if(!this.ble) return this._openBle();
		this.burstBuf[0] = 0x80;
		this.burstBuf[1] = 0x80;
		this.burstBuf[3] = 0x80;
		this.burstBuf[4] = 0x80;
		console.log('w:'+this._dumpBuf(this.burstBuf));
	//	return this.charBurstCommand.writeValue(this.burstBuf);
		const data = Base64Util.uint8ArrayToBase64(this.burstBuf);
		return this.ble.write(BLEUUID.bCoreService, BLEUUID.BurstCommand, data, 'base64')
		.then(() => {return;});
	}

	_dumpBuf(data) {
		let str = '';
		for(let i = 0; i < data.length; i++) {
			str += ('0' + data[i].toString(16)).substr(-2) + ' ';
		}
		return str;
	}
}
module.exports = Scratch3Blocks;
