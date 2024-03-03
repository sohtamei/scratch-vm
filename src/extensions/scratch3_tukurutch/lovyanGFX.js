var extName = 'lovyanGFX';
const SupportCamera = false;

const IconURI = 'data:image/png;base64,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';
//*
// update of extension-manager is necessary.
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Base64Util = require('../../util/base64-util');
const formatMessage = require('format-message');
const Zlib = require('zlib');
const comlib = require('./comlib.js');
class Scratch3Blocks {
//*/
/*
var ext = class {
*/
	constructor (runtime) {
		runtime.dev = this;

		this.width = 320;
		this.height = 240;
		this.uiNames = ['lovyanGFX ext.','lovyanGFX拡張'];

		if(typeof SupportCamera === "undefined") SupportCamera = false;
		this.comlib = new comlib(runtime, extName, SupportCamera);
	}

	getInfo () {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}
		this.comlib.setLocale(this._locale);

		return {
			id: extName,
			name: (typeof this.uiNames !=='undefined') ? this.uiNames[this._locale]: extName,
			//blockIconURI: IconURI,
			menuIconURI: IconURI,
			showStatusButton: true,
			color1:'#0FBD8C',color2:'#0DA57A',color3:'#0B8E69',
			blocks: this.get_blocks(),
			menus: this.get_menus(),
		};
	}
	
	get_blocks() {
		this.flashList = [
{name:'lovyanGFX.esp32', type:'esp32', baudrate:921600},
{name:'lovyanGFX.esp32.750000', type:'esp32', baudrate:750000},
{name:'lovyanGFX.esp32s3.uart', type:'esp32s3', baudrate:921600},
{name:'lovyanGFX.esp32s3.usb', type:'esp32s3u', baudrate:921600},
{name:'lovyanGFX.esp32c3.uart', type:'esp32c3', baudrate:921600},
{name:'lovyanGFX.esp32c3.usb', type:'esp32c3u', baudrate:921600},
{name:'lovyanGFX.pico', type:'pico', baudrate:921600},
		];

		this._blocks = [
{blockType: BlockType.COMMAND, opcode: 'setConfig', text: ['con/discon','接続/切断'][this._locale] + '[ARG1] IP=[ARG2]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: this.comlib.ifType, menu: 'ifType' },
	ARG2: { type: ArgumentType.STRING, defaultValue: this.comlib.ipadrs},
}},

{blockType: BlockType.COMMAND, opcode: 'burnFlash', text: [
    'burn [ARG1] [ARG2]',
    '書き込み [ARG1] [ARG2]',
][this._locale], arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue:'0', menu: 'flashList' },
	ARG2: { type: ArgumentType.STRING, defaultValue:'0', menu: 'clearNVS' },
}},

{blockType: BlockType.COMMAND, opcode: 'videoToggle', text: 'turn video [ARG1]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: 'on', menu: 'videoState' },
}, hideFromPalette: (SupportCamera==false)},

{blockType: BlockType.COMMAND, opcode: 'scanWifi', text: 'Scan AP', arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'connectWifi', text: ['connect','接続'][this._locale]+' ssid[ARG1] pass[ARG2]', arguments: {
	ARG1: { type: ArgumentType.STRING, defaultValue: this.comlib.ssid, menu: 'ssids' },
	ARG2: { type: ArgumentType.STRING, defaultValue: ' ' },
}},

{blockType: BlockType.REPORTER, opcode: 'statusWifi', text: ['WiFi status','WiFi接続状態'][this._locale], disableMonitor:true, arguments: {
}},



{blockType: BlockType.COMMAND, opcode: 'getLcdConfig', text: 'get configuration', arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'drawStage', text: 'draw stage', arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'drawStage2', text: 'draw stage=([ARG1],[ARG2]) - ([ARG3],[ARG4]) rotate=[ARG5] video[ARG6]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, defaultValue:-240 },
    ARG2: { type: ArgumentType.NUMBER, defaultValue:-180 },
    ARG3: { type: ArgumentType.NUMBER, defaultValue:240 },
    ARG4: { type: ArgumentType.NUMBER, defaultValue:180 },
    ARG5: { type: ArgumentType.NUMBER, defaultValue:0 },
    ARG6: { type: ArgumentType.STRING, defaultValue:'0', menu: 'onoff' },
}},

{blockType: BlockType.COMMAND, opcode: 'saveStage', text: '［SD］save stage', arguments: {
}},

{blockType: BlockType.COMMAND, opcode: 'getFilelist', text: '［SD］get file list', arguments: {
}},
'---',
{blockType: BlockType.REPORTER, opcode: '_getLcdConfig', text: 'get config', arguments: {
}, hideFromPalette:true},

{blockType: BlockType.COMMAND, opcode: 'setLcdConfig', text: 'set config [ARG1] port=[ARG2]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'lcdType' },
    ARG2: { type: ArgumentType.STRING, type2:'b', defaultValue:' ' },
}},

{blockType: BlockType.COMMAND, opcode: 'setFont', text: 'set font=[ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'10', menu: 'font' },
}},

{blockType: BlockType.COMMAND, opcode: 'setRotation', text: 'set rotation=[ARG1]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'setText', text: 'set text [ARG1] ,[ARG2] size=[ARG3]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'65535', menu: 'color' },
    ARG2: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'color' },
    ARG3: { type: ArgumentType.NUMBER, type2:'F', defaultValue:2 },
}},

{blockType: BlockType.COMMAND, opcode: 'setCursor', text: 'set cursor at ([ARG1] ,[ARG2] )', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'printText', text: 'print text [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'テスト' },
}},

{blockType: BlockType.COMMAND, opcode: 'printlnText', text: 'print text [ARG1] and return', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'テスト' },
}},

{blockType: BlockType.COMMAND, opcode: 'drawString2', text: 'draw text [ARG1] ([ARG2] ,[ARG3] )', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'テスト' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'drawString', text: 'draw text [ARG1] ([ARG2] ,[ARG3] ) font=[ARG4]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'test' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG4: { type: ArgumentType.STRING, type2:'B', defaultValue:'2', menu: 'font' },
}},

{blockType: BlockType.COMMAND, opcode: 'fillScreen', text: 'fill screen with [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'S', defaultValue:'0', menu: 'color' },
}},

{blockType: BlockType.COMMAND, opcode: 'drawJpg', text: 'draw jpg [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'b2', defaultValue:'00000000FFD8FFE000104A46494600010101007800780000FFE100224578696600004D4D002A00000008000101120003000000010001000000000000FFDB0043000201010201010202020202020202030503030303030604040305070607070706070708090B0908080A0807070A0D0A0A0B0C0C0C0C07090E0F0D0C0E0B0C0C0CFFDB004301020202030303060303060C0807080C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0CFFC00011080020002003012200021101031101FFC4001F0000010501010101010100000000000000000102030405060708090A0BFFC400B5100002010303020403050504040000017D01020300041105122131410613516107227114328191A1082342B1C11552D1F02433627282090A161718191A25262728292A3435363738393A434445464748494A535455565758595A636465666768696A737475767778797A838485868788898A92939495969798999AA2A3A4A5A6A7A8A9AAB2B3B4B5B6B7B8B9BAC2C3C4C5C6C7C8C9CAD2D3D4D5D6D7D8D9DAE1E2E3E4E5E6E7E8E9EAF1F2F3F4F5F6F7F8F9FAFFC4001F0100030101010101010101010000000000000102030405060708090A0BFFC400B51100020102040403040705040400010277000102031104052131061241510761711322328108144291A1B1C109233352F0156272D10A162434E125F11718191A262728292A35363738393A434445464748494A535455565758595A636465666768696A737475767778797A82838485868788898A92939495969798999AA2A3A4A5A6A7A8A9AAB2B3B4B5B6B7B8B9BAC2C3C4C5C6C7C8C9CAD2D3D4D5D6D7D8D9DAE2E3E4E5E6E7E8E9EAF2F3F4F5F6F7F8F9FAFFDA000C03010002110311003F00FDFCAF896DFF006AFF00137C729F54D5AD6CFC6571E1CBABF9C68834EB95D16DBEC2094827F31A48AE2669957CDDE86488095400ACA6BBAFF828F7C765F0F7862CFC116EB248BAE491BEB4140C4F6193BED413C132E36B8208F2C95618941AE4F4EF1A693E21B0B5BAB7BFF326BAB717F2472ED568609155E391C6E2C8195B3F385C640E4E40F8CCF7882542BFB0C3D9F2EF7D55FB5BCBE7BEDA1E563B387866E9D18A72D1B6F64BE5ADDEFBAB2EF776C7D33E3F788BC1BE3992FEF6F3C75E12B38ACA3CDCEAF72FAD6901C3B3379D89A58E38CA901DCB42C022812A6E6CFD4BFB3AFC7ED27E3FF80A2D4ACEF3499351B79AE2D2FED6CAFA3BA586582E25B77652A73E53BC4CC858025197201C81F2F785FE2CE8DE2CF1AAE8DA5DCC97170D14D2C176ABB2CAE5A0789278E29C90AEF0B4F0F99B72A9E6805B2182F7DF026D6CFE0F7C6BFB42DA471FFC24096FA55DA898C89681B2F6ED0A64AC61DA48D5D630A1C3A3B731F3CF95F12559D78C2B45252766D5D6AF6D355F968FC8787CEA75651A389A7CB276B3D6DAAD347AEBA5B567837ED0F65AA78F3F6C1D5B45F1B5C47E1DB49B51B95B6B9495257FB208643692322B32A3CFE4C30AA8258868DCAAC8CD1AE5FC1CF87BA92EA1F0B347BCF0B697E3CF10F8C350B1B1D7B54D7AC85DE9FA0687A669D6975710C68DE5A34F21BDF2D378259C493F9476154FABBF6D7FD89A3FDA5A28F5BD26F23B3F1469F60D64B0DC13F63D5A1DCCCB04C465A3C6F982BA8383312CB205503E4CD4BF697F895FF04FBF1445A77C41B1B3874EF14DADEDF5CC9AB6A3159A410E9DA74625BAB2B98D6E37CECB1DB2FD9763F99239936C2A9339C2AE4F5A9E63770728C9B6A49736F6767DB67D2FADD743D7CB611A789973413536DDED7D5A564FB24D37BF2BBA56DEDEE9FF000500D47C23E04F85DE0FD22487FB1F576BCB88FC312E9B02C634486CF4FB8BCBC731AE3FD0D6D2D9D2589073BE2DABBD6323CEFF00639D5F5AF889FB43E9BE1FBAD3E4D3E6D1AC6C46A50B4C9335A7F66DD5D2BCC76B1077DD27901B23728593047CAB47C05FB48789BFE0A4DA668B0F84BE1FCD6BA08BC9AC6EBC41ABC399351D324C3CD1ACDE427D96D6F6185509447671B1182329AFB7FE027C27B1F83FF0E2CF4FB7D36CF4ED42F156F757FB372B737EE89E7CA5B8DCCCCBD7BE0576472B962F30551A718D37ADD3576ADEEEBD9DEEFB69AD8BCCA8D0AB561271B4E3BB7D754D5BBA56BDECD3BBB3DEDFFFD9' },
}},

{blockType: BlockType.COMMAND, opcode: 'setBrightness', text: 'set brightness [ARG1]', arguments: {
    ARG1: { type: ArgumentType.NUMBER, type2:'B', defaultValue:128 },
}},

{blockType: BlockType.COMMAND, opcode: 'drawFile', text: '［SD］draw file [ARG1] ([ARG2] ,[ARG3] )', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'xx', menu: 'files' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
    ARG3: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.COMMAND, opcode: 'setAutomode', text: '［SD］auto [ARG1] [ARG2] 00ms', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'s', defaultValue:'off', menu: 'automode' },
    ARG2: { type: ArgumentType.NUMBER, type2:'S', defaultValue:0 },
}},

{blockType: BlockType.REPORTER, opcode: '_getFilelist', text: '［SD］get file list', arguments: {
}, hideFromPalette:true},

{blockType: BlockType.COMMAND, opcode: 'removeFiles', text: '［SD］erase all [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'B', defaultValue:'0', menu: 'yesno' },
}},

{blockType: BlockType.COMMAND, opcode: 'saveJpg', text: '［SD］save jpg [ARG1]', arguments: {
    ARG1: { type: ArgumentType.STRING, type2:'b2', defaultValue:'00000000FFD8FFE000104A46494600010101007800780000FFE100224578696600004D4D002A00000008000101120003000000010001000000000000FFDB0043000201010201010202020202020202030503030303030604040305070607070706070708090B0908080A0807070A0D0A0A0B0C0C0C0C07090E0F0D0C0E0B0C0C0CFFDB004301020202030303060303060C0807080C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0C0CFFC00011080020002003012200021101031101FFC4001F0000010501010101010100000000000000000102030405060708090A0BFFC400B5100002010303020403050504040000017D01020300041105122131410613516107227114328191A1082342B1C11552D1F02433627282090A161718191A25262728292A3435363738393A434445464748494A535455565758595A636465666768696A737475767778797A838485868788898A92939495969798999AA2A3A4A5A6A7A8A9AAB2B3B4B5B6B7B8B9BAC2C3C4C5C6C7C8C9CAD2D3D4D5D6D7D8D9DAE1E2E3E4E5E6E7E8E9EAF1F2F3F4F5F6F7F8F9FAFFC4001F0100030101010101010101010000000000000102030405060708090A0BFFC400B51100020102040403040705040400010277000102031104052131061241510761711322328108144291A1B1C109233352F0156272D10A162434E125F11718191A262728292A35363738393A434445464748494A535455565758595A636465666768696A737475767778797A82838485868788898A92939495969798999AA2A3A4A5A6A7A8A9AAB2B3B4B5B6B7B8B9BAC2C3C4C5C6C7C8C9CAD2D3D4D5D6D7D8D9DAE2E3E4E5E6E7E8E9EAF2F3F4F5F6F7F8F9FAFFDA000C03010002110311003F00FDFCAF896DFF006AFF00137C729F54D5AD6CFC6571E1CBABF9C68834EB95D16DBEC2094827F31A48AE2669957CDDE86488095400ACA6BBAFF828F7C765F0F7862CFC116EB248BAE491BEB4140C4F6193BED413C132E36B8208F2C95618941AE4F4EF1A693E21B0B5BAB7BFF326BAB717F2472ED568609155E391C6E2C8195B3F385C640E4E40F8CCF7882542BFB0C3D9F2EF7D55FB5BCBE7BEDA1E563B387866E9D18A72D1B6F64BE5ADDEFBAB2EF776C7D33E3F788BC1BE3992FEF6F3C75E12B38ACA3CDCEAF72FAD6901C3B3379D89A58E38CA901DCB42C022812A6E6CFD4BFB3AFC7ED27E3FF80A2D4ACEF3499351B79AE2D2FED6CAFA3BA586582E25B77652A73E53BC4CC858025197201C81F2F785FE2CE8DE2CF1AAE8DA5DCC97170D14D2C176ABB2CAE5A0789278E29C90AEF0B4F0F99B72A9E6805B2182F7DF026D6CFE0F7C6BFB42DA471FFC24096FA55DA898C89681B2F6ED0A64AC61DA48D5D630A1C3A3B731F3CF95F12559D78C2B45252766D5D6AF6D355F968FC8787CEA75651A389A7CB276B3D6DAAD347AEBA5B567837ED0F65AA78F3F6C1D5B45F1B5C47E1DB49B51B95B6B9495257FB208643692322B32A3CFE4C30AA8258868DCAAC8CD1AE5FC1CF87BA92EA1F0B347BCF0B697E3CF10F8C350B1B1D7B54D7AC85DE9FA0687A669D6975710C68DE5A34F21BDF2D378259C493F9476154FABBF6D7FD89A3FDA5A28F5BD26F23B3F1469F60D64B0DC13F63D5A1DCCCB04C465A3C6F982BA8383312CB205503E4CD4BF697F895FF04FBF1445A77C41B1B3874EF14DADEDF5CC9AB6A3159A410E9DA74625BAB2B98D6E37CECB1DB2FD9763F99239936C2A9339C2AE4F5A9E63770728C9B6A49736F6767DB67D2FADD743D7CB611A789973413536DDED7D5A564FB24D37BF2BBA56DEDEE9FF000500D47C23E04F85DE0FD22487FB1F576BCB88FC312E9B02C634486CF4FB8BCBC731AE3FD0D6D2D9D2589073BE2DABBD6323CEFF00639D5F5AF889FB43E9BE1FBAD3E4D3E6D1AC6C46A50B4C9335A7F66DD5D2BCC76B1077DD27901B23728593047CAB47C05FB48789BFE0A4DA668B0F84BE1FCD6BA08BC9AC6EBC41ABC399351D324C3CD1ACDE427D96D6F6185509447671B1182329AFB7FE027C27B1F83FF0E2CF4FB7D36CF4ED42F156F757FB372B737EE89E7CA5B8DCCCCBD7BE0576472B962F30551A718D37ADD3576ADEEEBD9DEEFB69AD8BCCA8D0AB561271B4E3BB7D754D5BBA56BDECD3BBB3DEDFFFD9' },
}, hideFromPalette:true},

		];
		this.blockOffset = 7;
		for(let i = 0; i < this._blocks.length; i++) {
			if(this._blocks[i] == '---') {
				this.blockOffset = i+1;
				break;
			}
		}
		return this._blocks;
	}

	get_menus() {
		this.flashItems = [];
		for(let i = 0; i < this.flashList.length; i++)
			this.flashItems[i] = { text:this.flashList[i].name, value:i.toString(10) };

	  return {
ifType: { acceptReporters: true, items: [
	{ text: 'USB', value: 'UART' },
	{ text: 'WiFi', value: 'WLAN' },
	{ text: 'MIDI', value: 'MIDI' },
]},

clearNVS: { items: [
{ text: '--', value: '0' },
{ text: ['init NVS','NVS初期化'][this._locale], value: '1' },
]},

videoState: { acceptReporters: true, items: ['off','on','on-flipped']},

flashList: { acceptReporters: true, items: this.flashItems },

automode: { acceptReporters: true, items: ['off','slideshow','push <get file list>',]},

color: { acceptReporters: true, items: [
{ text: 'BLACK', value: '0' },
{ text: 'WHITE', value: '65535' },
{ text: 'NAVY', value: '15' },
{ text: 'DARKGREEN', value: '992' },
{ text: 'DARKCYAN', value: '1007' },
{ text: 'MAROON', value: '30720' },
{ text: 'PURPLE', value: '30735' },
{ text: 'OLIVE', value: '31712' },
{ text: 'LIGHTGREY', value: '54938' },
{ text: 'DARKGREY', value: '31727' },
{ text: 'BLUE', value: '31' },
{ text: 'GREEN', value: '2016' },
{ text: 'CYAN', value: '2047' },
{ text: 'RED', value: '63488' },
{ text: 'MAGENTA', value: '63519' },
{ text: 'YELLOW', value: '65504' },
{ text: 'ORANGE', value: '64928' },
{ text: 'GREENYELLOW', value: '47072' },
{ text: 'PINK', value: '65049' },
{ text: 'TRANSPARENT', value: '288' },
]},

files: { acceptReporters: true, items: ['push <get file list>',]},

font: { acceptReporters: true, items: [
{ text: 'ascii8', value: '1' },
{ text: 'ascii16', value: '2' },
{ text: 'ascii26', value: '4' },
{ text: 'num48', value: '6' },
{ text: '7seg48', value: '7' },
{ text: 'num75', value: '8' },
{ text: 'monospace12', value: '10' },
{ text: 'proportional12', value: '11' },
{ text: 'monospace16', value: '12' },
{ text: 'proportional16', value: '13' },
]},

lcdType: { acceptReporters: true, items: [
{ text: 'no-LCD', value: '0' },
{ text: 'AUTO', value: '1' },
{ text: 'AUTO-ROT1', value: '2' },
{ text: 'SSD1306', value: '3' },
{ text: 'SSD1306_32', value: '4' },
{ text: 'SSD1306_6432', value: '32' },
{ text: 'SH110X', value: '28' },
{ text: '085TFT_SPI', value: '31' },
{ text: 'QT095B', value: '5' },
{ text: 'MSP0961', value: '10' },
{ text: 'MSP1141', value: '11' },
{ text: 'MSP1308_GMT130', value: '12' },
{ text: 'MSP1541', value: '13' },
{ text: 'GMT177', value: '14' },
{ text: 'MSP2008', value: '15' },
{ text: '128TFT', value: '26' },
{ text: 'MSP1443', value: '16' },
{ text: 'MSP1803', value: '17' },
{ text: 'MSP2202', value: '18' },
{ text: 'MSP2401_2402', value: '19' },
{ text: 'MSP2806_2807', value: '8' },
{ text: 'MSP3217_3218', value: '20' },
{ text: 'MSP3520_3521', value: '21' },
{ text: 'MSP4020_4021', value: '22' },
{ text: 'MSP4022_4023', value: '23' },
{ text: 'ROUNDXIAO', value: '24' },
{ text: 'SQUAREXIAO', value: '25' },
{ text: 'RoundTouchXIAO', value: '34' },
{ text: 'ROUNDLCD', value: '7' },
{ text: 'SQUARELCD', value: '33' },
{ text: '3248S035', value: '6' },
{ text: 'TTGO_TDISP', value: '27' },
{ text: '1732S019', value: '29' },
{ text: 'RP2040LCD128', value: '30' },
{ text: 'RP2040GEEK', value: '35' },
{ text: 'ESP32C3_144', value: '36' },
{ text: 'ESP32S3GEEK', value: '37' },
{ text: 'PICO_CAMA', value: '38' },
]},

onoff: { acceptReporters: true, items: [
{ text: 'On', value: '1' },
{ text: 'Off', value: '0' },
]},

yesno: { acceptReporters: true, items: [
{ text: 'no', value: '0' },
{ text: 'yes', value: '1' },
]},


ssids: { acceptReporters: true, items: ["push 'Scan AP'"]},
	  };
	}

_getLcdConfig(args,util) { return this.sendRecv('_getLcdConfig', args); }
setLcdConfig(args,util) { return this.sendRecv('setLcdConfig', args); }
setFont(args,util) { return this.sendRecv('setFont', args); }
setRotation(args,util) { return this.sendRecv('setRotation', args); }
setText(args,util) { return this.sendRecv('setText', args); }
setCursor(args,util) { return this.sendRecv('setCursor', args); }
printText(args,util) { return this.sendRecv('printText', args); }
printlnText(args,util) { return this.sendRecv('printlnText', args); }
drawString2(args,util) { return this.sendRecv('drawString2', args); }
drawString(args,util) { return this.sendRecv('drawString', args); }
fillScreen(args,util) { return this.sendRecv('fillScreen', args); }
drawJpg(args,util) { return this.sendRecv('drawJpg', args); }
setBrightness(args,util) { return this.sendRecv('setBrightness', args); }
drawFile(args,util) { return this.sendRecv('drawFile', args); }
setAutomode(args,util) { return this.sendRecv('setAutomode', args); }
_getFilelist(args,util) { return this.sendRecv('_getFilelist', args); }
removeFiles(args,util) { return this.sendRecv('removeFiles', args); }
saveJpg(args,util) { return this.sendRecv('saveJpg', args); }

	getLcdConfig(args, util) {
		const _this = this;
		return this.sendRecv('_getLcdConfig', args)
		.then(result => {
			if(typeof result !== 'object') return result;
			_this.width = result[0] + (result[1]<<8);
			_this.height = result[2] + (result[3]<<8);
			_this.comlib._runtime.renderer.setDevSize(_this.width, _this.height);

			const id = result[4] + (result[5]<<8);

			const items = _this.get_menus().lcdType.items;
			let lcdType = id;
			for(let i = 0; i < items.length; i++) {
				if(Number(items[i].value) == id) {
					lcdType = items[i].text;
					break;
				}
			}

			let targetBlock;
			targetBlock = Blockly.getMainWorkspace().getBlockById(extName+'_setLcdConfig');
			if(targetBlock)
				targetBlock.childBlocks_[0].inputList[0].fieldRow[0].setValue(id);

			let str = 'width=' + _this.width + ' height=' + _this.height + ' type=' + lcdType;

			let portsName;
			switch(result.length) {
			default:
			case 6:
				return str;
			case 6+2:
				portsName = ['sda', 'scl'];
				break;
			case 6+8:
				portsName = ['sclk', 'mosi', 'miso', 'dc', 'cs', 'rst', 'busy', 'bl'];
				break;
			}

			for(let i = 6; i < result.length; i++)
				str += ' ' + portsName[i-6] + '=' + ((result[i]==255) ? '' : result[i].toString(10));
			return str;
		})
	}

	drawStage(args,util) {
		const tmpData = this.comlib._runtime.renderer.drawWithMask(util.sequencer.runtime.ioDevices.video._skinId,
								[-240,240], [-180,180], 0);
		if(typeof tmpData === 'undefined') return;
		const tmpData2 = Base64Util.base64ToUint8Array(tmpData.base64);
		args.ARG1 = new Uint8Array(4+tmpData2.length);
		args.ARG1.set([tmpData.x, tmpData.x>>8, tmpData.y, tmpData.y>>8], 0)
		args.ARG1.set(tmpData2, 4);
		console.log('size='+args.ARG1.length);

		return this.sendRecv('drawJpg', args);
	}

	drawStage2(args,util) {
		const maskSkinId = (args.ARG6 == '1') ? -1 : util.sequencer.runtime.ioDevices.video._skinId;
		const tmpData = this.comlib._runtime.renderer.drawWithMask(maskSkinId,
								[Number(args.ARG1),Number(args.ARG3)], 
								[Number(args.ARG2),Number(args.ARG4)], 
								Number(args.ARG5));
		if(typeof tmpData === 'undefined') return;
		const tmpData2 = Base64Util.base64ToUint8Array(tmpData.base64);
		const args2 = {ARG1:new Uint8Array(4+tmpData2.length)};
		args2.ARG1.set([tmpData.x, tmpData.x>>8, tmpData.y, tmpData.y>>8], 0)
		args2.ARG1.set(tmpData2, 4);
	//	const args2 = {ARG1:Base64Util.base64ToUint8Array(tmpData)}
		console.log('size='+args2.ARG1.length);

		return this.sendRecv('drawJpg', args2);
	}

	saveStage(args,util) {
		const tmpData = this.comlib._runtime.renderer.drawWithMask(util.sequencer.runtime.ioDevices.video._skinId,
								[-240,240], [-180,180], 0);
		if(typeof tmpData === 'undefined') return;
		const tmpData2 = Base64Util.base64ToUint8Array(tmpData.base64);
		args.ARG1 = new Uint8Array(4+tmpData2.length);
		args.ARG1.set([tmpData.x, tmpData.x>>8, tmpData.y, tmpData.y>>8], 0)
		args.ARG1.set(tmpData2, 4);
		console.log('size='+args.ARG1.length);

		return this.sendRecv('saveJpg', args);
	}

	getFilelist(args,utiil) {
		const _this = this;
		return this.sendRecv('_getFilelist', args)
		.then(result => {
			if(typeof result !== 'string') return result;

			const filelist = result.split('\t');
			const targetBlock = Blockly.getMainWorkspace().getBlockById(extName+'_drawFile');
			const targetBlock2 = Blockly.getMainWorkspace().getBlockById(extName+'_setAutomode');
			if(targetBlock && targetBlock2) {
				let menus = [];
				for(let i = 0; i < filelist.length; i++) {
					menus.push(['/'+filelist[i], '/'+filelist[i]]);
				}
				targetBlock.childBlocks_[0].inputList[0].fieldRow[0].menuGenerator_ = menus;
				targetBlock.childBlocks_[0].inputList[0].fieldRow[0].setValue('/'+filelist[0]);
				const menus2 = [['off','off'], ['slideshow','slideshow']].concat(menus);
				targetBlock2.childBlocks_[0].inputList[0].fieldRow[0].menuGenerator_ = menus2;
				targetBlock2.childBlocks_[0].inputList[0].fieldRow[0].setValue('/'+filelist[0]);
				return 'list has been updated.';
			}
			return 'failed';
		});
	}

	burnFlash(args) {
	//	if(this.comlib.server=='http') return ['please access via https://','https:// でアクセスして下さい'][this._locale];

		let ret = window.confirm(['Burn TuKuRutch firmware to device, sure ?', 'つくるっち用ファームをデバイスに書き込みますか？'][this._locale]);
		console.log(ret);
		if(!ret) return;
		return this.comlib.burnWlan(this.flashList[Number(args.ARG1)], Number(args.ARG2));
	}

	scanWifi(args) {
		return this.comlib.scanWifi();
	}

	connectWifi(args) {
	//	if(this.comlib.server=='http') return ['please access via https://','https:// でアクセスして下さい'][this._locale];

		return this.comlib.connectWifi(args.ARG1, args.ARG2);
	}

	statusWifi(args) {
		return this.comlib.statusWifi();
	}

	setConfig(args) {
		return this.comlib.setConfig(args.ARG1, args.ARG2);
	}

	videoToggle(args) {
		return this.comlib.videoToggle(args.ARG1);
	}

	sendRecv(opcode,args) {
		for(let index = this.blockOffset; index < this._blocks.length; index++) {
			if(this._blocks[index].opcode == opcode) {
				return this.comlib.sendRecv(index - this.blockOffset + 1, this._blocks[index].arguments, args);
			}
		}
		return 0;
	}
}
//*
module.exports = Scratch3Blocks;
//*/
