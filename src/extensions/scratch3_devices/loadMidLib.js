/* copyright (C) 2021 SohtaMei. */

const MidiParser = require('midi-parser-js');

const noteTable = [
	8,9,9,10,10,11,12,12,13,14,15,15,								// -1
	16,17,18,19,21,22,23,24,26,28,29,31,							// 0
	33,35,37,39,41,44,46,49,52,55,58,62,							// 1
	65,69,73,78,82,87,92,98,104,110,117,123,						// 2
	131,139,147,156,165,175,185,196,208,220,233,247,				// 3
	262,277,294,311,330,349,370,392,415,440,466,494,				// 4
	523,554,587,622,659,698,740,784,831,880,932,988,				// 5
	1047,1109,1175,1245,1319,1397,1480,1568,1661,1760,1865,1976,	// 6
	2093,2217,2349,2489,2637,2794,2960,3136,3322,3520,3729,3951,	// 7
	4186,4435,4699,4978,5274,5588,5920,6272,6645,7040,7459,7902,	// 8
	8372,8870,9397,9956,10548,11175,11840,12544,					// 9
];

const setL16 = function(buf, data) {
	buf.push(data&0xFF);
	buf.push((data>>8)&0xFF);
}

class loadMidLib {
	static loadMID() {
		return new Promise((resolve, reject) => {
			let width = 480;
			let height = 100;
			let left = window.innerWidth / 2;
			let top = window.innerHeight / 2;
			let x = left - (width / 2);
			let y = top - (height / 2);
			const uploadWindow = window.open('', null, 'top=' + y + ',left=' + x + ',width=' + width + ',height=' + height);
			uploadWindow.document.open();
			uploadWindow.document.write('<html><head><title>Load MID file</title></head><body>'
										+'<p>Please select MID file.</p>'
										+'<input type="file" id="upload-files" accept=".mid, .midi" style="width: 400px;">'
										+'<input type="button" value="OK" id="upload-button">'
										+'</body></html>');
			uploadWindow.document.close();

			const _checkInterval = setInterval(() => {
				if(uploadWindow.closed) {
					clearInterval(_checkInterval);
					reject();
				}
			}, 1000);

			uploadWindow.document.getElementById("upload-button").onclick = () => {
				clearInterval(_checkInterval);
				let files = uploadWindow.document.getElementById('upload-files').files;
				if (files.length <= 0) {
				//	alert('Please select MID file.');
					uploadWindow.close();
					reject();
					return;
				}

				let reader = new FileReader();
				reader.readAsArrayBuffer(files.item(0));
				uploadWindow.close();

				reader.onloadend = (e) => {
					uploadWindow.document.getElementById('upload-files').value = "";
				}

				reader.onload = (e) => {
					const midiBuf = new Uint8Array(e.target.result);
					const midiData = MidiParser.parse(midiBuf, null);
					console.log(midiData);

					let tempoMS = 500;
					let notes = [];
					for(let track = 0; track < midiData.tracks; track++) {
						let lapTime = 0;
						for(let i = 0; i < midiData.track[track].event.length; i++) {
							let event = midiData.track[track].event[i];
							lapTime += event.deltaTime;
							if(event.type == 255 && event.metaType == 81) {
							// set tempo [us]
								if(lapTime == 0) tempoMS = event.data / 1000;
							} else if(event.type == 9 && event.channel == 0) {
								notes.push({lap:event.data[1] ? lapTime: lapTime+1,
											freq:noteTable[event.data[0]],
											vel:event.data[1],
											track:track
											});
							}
						}
					}
					notes.sort((first, second) => first.lap - second.lap);
					console.log(notes);

					const NOTE_NUM = 2;
					let outbuf = [];
					let freqs = Array(NOTE_NUM);
					freqs.fill(0);
					let debug = [];
					for(let i = 0; i < notes.length;) {
						let currentLap = notes[i].lap;
						let updates = Array(NOTE_NUM);
						updates.fill(false);
						let j = 0;
						for(j = 0; ; j++) {
							if(i+j >= notes.length) break;
							if(currentLap != notes[i+j].lap) break;

							let track = notes[i+j].track;
							if(!notes[i+j].vel) {
								if(freqs[track] == notes[i+j].freq) {
								// note off & 再生中freqのとき
									freqs[track] = 0;
									updates[track] = true;
								}
							} else {
								if(!updates[track] || freqs[track] == 0 || track == 0) {
								// note on で未更新 or 無音 or track0のとき
									freqs[track] = notes[i+j].freq;
									updates[track] = true;
								// track1は低音、track0は高音優先
								}
							}
						}
						if(i+j < notes.length) {
							setL16(outbuf, ((notes[i+j].lap - currentLap) * tempoMS) / midiData.timeDivision);
							for(let track = 0; track < NOTE_NUM; track++) {
								if(freqs[track] == 0) {
									setL16(outbuf, 0);
								} else if(updates[track] == false) {
									setL16(outbuf, 0xFFFF);
								} else {
									setL16(outbuf, freqs[track]);
								}
							}
							debug.push([currentLap].concat(freqs).concat(updates));
						}
						i += j;
					}
				//	console.log(debug);

					const outbuf16 = new Uint8Array(outbuf/*.slice(0,3072-2)*/);
				//	console.log(outbuf16);

					resolve(loadMidLib._dumpBuf(outbuf16));
				}
			}
		});
	}

	static _dumpBuf(data) {
		let str = '';
		for(let i = 0; i < data.length; i++) {
			str += ('0' + data[i].toString(16)).substr(-2);// + ' ';
		}
		return str;
	}
}
module.exports = loadMidLib;
