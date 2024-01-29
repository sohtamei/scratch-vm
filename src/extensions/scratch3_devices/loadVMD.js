/* copyright (C) 2021 SohtaMei. */

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const IconURI = require('./tukurutch-small.png');

class Scratch3Blocks {
	constructor (runtime) {
		this.runtime = runtime;
		this.clairIP = '192.168.137.70';
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
			id: 'loadVMD',
			name: ['loadVMD','loadVMD'][this._locale],
			menuIconURI: IconURI,
			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'loadVMD', text: 'loadVMD', arguments: {
				}},

				{blockType: BlockType.REPORTER, opcode: 'dataVMD', text: 'dataVMD [ARG1][ARG2]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: ' ' },
					ARG2: { type: ArgumentType.STRING, defaultValue: ' ' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'setIP', text: 'set clair IP [ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue: this.clairIP },
				}},

				{blockType: BlockType.COMMAND, opcode: 'sendPlay', text: 'clair play', arguments: {
				}},

				{blockType: BlockType.COMMAND, opcode: 'sendStop', text: 'clair stop', arguments: {
				}},
			],
			menus: {
			}
		};
	}

	loadVMD(args) {
		const _this = this;
		return new Promise((resolve, reject) => {
			let width = 480;
			let height = 100;
			let left = window.innerWidth / 2;
			let top = window.innerHeight / 2;
			let x = left - (width / 2);
			let y = top - (height / 2);
			uploadWindow = window.open('', null, 'top=' + y + ',left=' + x + ',width=' + width + ',height=' + height);
			uploadWindow.document.open();
			uploadWindow.document.write('<html><head><title>Load VMD file</title></head><body>'
										+'<p>Please select VMD file.</p>'
										+'<input type="file" id="upload-files">'
										+'<input type="button" value="load" id="upload-button">'
										+'</body></html>');
			uploadWindow.document.close();
			uploadWindow.document.getElementById("upload-button").onclick = function() {
				let files = uploadWindow.document.getElementById('upload-files').files;
				if (files.length <= 0) {
					alert('Please select VMD file.');
					reject();
				}

				let reader = new FileReader();
				reader.readAsArrayBuffer(files.item(0));
				uploadWindow.close();

				reader.onloadend = function(e) {
					uploadWindow.document.getElementById('upload-files').value = "";
				}

				reader.onload = function(e) {
					const buf = new Uint8Array(e.target.result);
					let dv = new DataView(buf.buffer);
					/*
					https://w.atwiki.jp/kumiho_k/pages/15.html
					30: 'Vocaloid Motion Data 0002'
					20: 'QCAI'
					 4: frameNum
						111*frameNum:
							15:bornName
							4:frameIndex
							4*7:x,y,z,rx,ry,rz,rw
							64:補完データ
					 4:
					*/
					const frameNum = dv.getInt32(50, true);
					let frames = [];
					let i;
					for(i = 0; i < frameNum; i++) {
						const offset = 54+i*111;

						let j;
						for(j = 0; j < 15; j++)
							if(buf[offset+j] == 0x00) break;
						const bornName = String.fromCharCode.apply(null, buf.slice(offset,offset+j));

						const frame = dv.getInt32(offset+15, true);

					//	const x  = dv.getFloat32(offset+19+0, true);
					//	const y  = dv.getFloat32(offset+19+4, true);
					//	const z  = dv.getFloat32(offset+19+8, true);
						const qx = dv.getFloat32(offset+19+12, true);
						const qy = dv.getFloat32(offset+19+16, true);
						const qz = dv.getFloat32(offset+19+20, true);
						const qw = dv.getFloat32(offset+19+24, true);

						const deg = Math.acos(qw);
						const sinDeg = Math.sin(deg);
						if(sinDeg == 0) sinDeg = 1;
						deg = deg / Math.PI * 180 * 2;
						if(deg > 180) deg -= 360;
						const rx = Math.round(deg * qx / sinDeg * 100) / 100;
						const ry = Math.round(deg * qy / sinDeg * 100) / 100;
						const rz = Math.round(deg * qz / sinDeg * 100) / 100;

					//	console.log(bornName + ',' + frame + ', '
					//		+ x + '/' + y + '/' + z + ', '
					//		+ qx + '/' + qy + '/' + qz + '/' + qw + ', '
					//		+ deg + ', '
					//		+ rx + '/' + ry + '/' + rz);

						frames[i] = {bornName:bornName, frame:frame, rx:rx, ry:ry, rz:rz};
					}

					frames.sort((first, second) => {
						if(first.frame < second.frame)		return -1;
						else if(first.frame > second.frame)	return 1;
						else								return 0;
					});

					const INV = 127;
					let poses = [];
					let poseFrame = 0;
					let pose = [INV,INV,INV,INV,INV,INV,INV,INV];
					let poseIndex = 0;
					for(i = 0; i < frameNum; i++) {
						if(poseFrame != frames[i].frame) {
							poses[poseIndex] = {frame:poseFrame, pose:pose};
							poseIndex++;
							poseFrame = frames[i].frame;
							pose = [INV,INV,INV,INV,INV,INV,INV,INV];
						}

						switch(frames[i].bornName) {
						case 'FR.C': pose[1] = +frames[i].ry+45; break;
						case 'RR.C': pose[3] = +frames[i].ry-45; break;
						case 'FL.C': pose[5] = -frames[i].ry+45; break;
						case 'RL.C': pose[7] = -frames[i].ry-45; break;

						case 'FR.K': pose[0] = +frames[i].rz; break;
						case 'RR.K': pose[2] = +frames[i].rz; break;
						case 'FL.K': pose[4] = -frames[i].rz; break;
						case 'RL.K': pose[6] = -frames[i].rz; break;
						}
					}
					poses[poseIndex] = {frame:poseFrame, pose:pose};

					console.log(poses);

					const targetBlock = Blockly.getMainWorkspace().getBlockById('loadVMD_dataVMD');
					if(targetBlock) {
						targetBlock.childBlocks_[0].inputList[0].fieldRow[0].setValue(files.item(0).name.replace('.vmd',''));

						let buf2 = new Uint8Array(poses.length * 10);
						let dv2 = new DataView(buf2.buffer);
						for(i = 0; i < poses.length; i++) {
							offset = i * 10;
							dv2.setInt16(offset+ 0, poses[i].frame, true);
							dv2.setInt8(offset+2, poses[i].pose[0]);
							dv2.setInt8(offset+3, poses[i].pose[1]);
							dv2.setInt8(offset+4, poses[i].pose[2]);
							dv2.setInt8(offset+5, poses[i].pose[3]);
							dv2.setInt8(offset+6, poses[i].pose[4]);
							dv2.setInt8(offset+7, poses[i].pose[5]);
							dv2.setInt8(offset+8, poses[i].pose[6]);
							dv2.setInt8(offset+9, poses[i].pose[7]);
						}

						targetBlock.childBlocks_[1].inputList[0].fieldRow[0].setValue(_this._dumpBuf(buf2));
					}

					resolve();
				}

			}
		}).then(() =>{
			return;
		})
	}

	dataVMD(args) {
		return args.ARG2;
	}

	setIP(args) {
		this.clairIP = args.ARG1;
	}

	sendPlay(args) {
		fetch('http://' + this.clairIP + '/to_board.php?play=20220214094739', {
			method: "GET",
			mode: "cors"
		}).then(response => {
			console.log(response);
			if (!response.ok) {
				throw new Error('Network response was not ok.');
			}
		}).catch(error => {
			console.error(error);
		})
	}

	sendStop(args) {
		fetch('http://' + this.clairIP + '/to_board.php?stop=20220214094739', {
			method: "GET",
			mode: "cors"
		}).then(response => {
			console.log(response);
			if (!response.ok) {
				throw new Error('Network response was not ok.');
			}
		}).catch(error => {
			console.error(error);
		})
	}

	_dumpBuf(data) {
		let str = '';
		for(let i = 0; i < data.length; i++) {
			str += ('0' + data[i].toString(16)).substr(-2);// + ' ';
		}
		return str;
	}
}
module.exports = Scratch3Blocks;
