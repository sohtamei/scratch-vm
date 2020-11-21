const log = require('../../util/log');
const cast = require('../../util/cast');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

const BLECommand = {
	CMD_PIN_CONFIG: 0x80,
	CMD_DISPLAY_TEXT: 0x81,
};


/**
 * A time interval to wait (in milliseconds) before reporting to the BLE socket
 * that data has stopped coming from the peripheral.
 */
const BLETimeout = 4500;

/**
 * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
 * @type {number}
 */
const BLESendInterval = 100;

/**
 * A string to report to the BLE socket when the micro:bit has stopped receiving data.
 * @type {string}
 */
const BLEDataStoppedError = 'micro:bit extension stopped receiving data';

const BLEUUID = {
	service:     '72c90001-57a9-4d40-b746-534e22ec9f9e',
	writeWoResp: '72c90002-57a9-4d40-b746-534e22ec9f9e',
	notify:      '72c90003-57a9-4d40-b746-534e22ec9f9e',
	write:       '72c90004-57a9-4d40-b746-534e22ec9f9e',
	indicate:    '72c90005-57a9-4d40-b746-534e22ec9f9e',
};

/**
 * Manage communication with a MeshScratchLink peripheral over a Scrath Link client socket.
 */
class MeshScratchLink {

	constructor (runtime, extensionId, name, notifyCB) {

		this._runtime = runtime;
		this._extensionId = extensionId;
		this._name = name;
		this._notifyCB = notifyCB;

		this._ble = null;
		this._runtime.registerPeripheralExtension(extensionId, this);
		this._timeoutID = null;

		/**
		 * A flag that is true while we are busy sending data to the BLE socket.
		 * @type {boolean}
		 * @private
		 */
		this._busy = false;

		/**
		 * ID for a timeout which is used to clear the busy flag if it has been
		 * true for a long time.
		 */
		this._busyTimeoutID = null;

		this.reset = this.reset.bind(this);
		this._onConnect = this._onConnect.bind(this);
		this._onMessage = this._onMessage.bind(this);
	}

	displayText (text) {
		const output = new Uint8Array(text.length);
		for (let i = 0; i < text.length; i++) {
			output[i] = text.charCodeAt(i);
		}
		return this.send(BLECommand.CMD_DISPLAY_TEXT, output);
	}

	scan () {
		if (this._ble) {
			this._ble.disconnect();
		}
		var options = {
			filters: [
				{namePrefix:this._name},
				{services: [BLEUUID.service]}
			]
		};
		this._ble = new BLE(this._runtime, this._extensionId, options, this._onConnect, this.reset);
	}

	connect (id) {
		if (this._ble) {
			this._ble.connectPeripheral(id);
		}
	}

	disconnect () {
		if (this._ble) {
			this._ble.disconnect();
		}
		this.reset();
	}

	reset () {
		if (this._timeoutID) {
			window.clearTimeout(this._timeoutID);
			this._timeoutID = null;
		}
	}

	isConnected () {
		let connected = false;
		if (this._ble) {
			connected = this._ble.isConnected();
		}
		return connected;
	}

	send (command, message) {
		if (!this.isConnected()) return;
		if (this._busy) return;

		// Set a busy flag so that while we are sending a message and waiting for
		// the response, additional messages are ignored.
		this._busy = true;

		// Set a timeout after which to reset the busy flag. This is used in case
		// a BLE message was sent for which we never received a response, because
		// e.g. the peripheral was turned off after the message was sent. We reset
		// the busy flag after a while so that it is possible to try again later.
		this._busyTimeoutID = window.setTimeout(() => {
			this._busy = false;
		}, 5000);

		const output = new Uint8Array(message.length + 1);
		output[0] = command; // attach command to beginning of message
		for (let i = 0; i < message.length; i++) {
			output[i + 1] = message[i];
		}
		const data = Base64Util.uint8ArrayToBase64(output);

		this._ble.write(BLEUUID.service, BLEUUID.txChar, data, 'base64', true).then( () => {
			this._busy = false;
			window.clearTimeout(this._busyTimeoutID);
		});
	}

	_onConnect () {
		var _this = this;
//		this._ble.read(BLEUUID.service, BLEUUID.indicate, true, this._onMessage);
		console.log("1.indicate");
		this._ble.startNotifications(BLEUUID.service, BLEUUID.indicate, this._onMessage, 2).then( function () {
			console.log("2.write");
			var output = new Uint8Array([0x00,0x02,0x01,0x03]);
			const data = Base64Util.uint8ArrayToBase64(output);
			_this._ble.write(BLEUUID.service, BLEUUID.write, data, 'base64', true).then( function () {
				console.log("3.notify");
				_this._ble.startNotifications(BLEUUID.service, BLEUUID.notify, _this._onMessage, 1);
			});
		});
/*
		this._timeoutID = window.setTimeout(
			() => this._ble.handleDisconnectError(BLEDataStoppedError),
			BLETimeout
		);
*/
	}

	_onMessage (base64) {
		const data = Base64Util.base64ToUint8Array(base64);
		//console.log(data);

		if(this._notifyCB) this._notifyCB(data);

		// cancel disconnect timeout and start a new one
		window.clearTimeout(this._timeoutID);
/*
		this._timeoutID = window.setTimeout(
			() => this._ble.handleDisconnectError(BLEDataStoppedError),
			BLETimeout
		);
*/
	}
}

module.exports = MeshScratchLink;
