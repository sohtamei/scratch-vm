var extName = 'exeScript';  // デバイス拡張名　_や.などの記号禁止

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
class Scratch3Blocks {
    constructor (runtime) {
        this.runtime = runtime;
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
            name: ['execute script','スクリプト実行'][this._locale],
            blocks: [     // ブロック定義
                {blockType: BlockType.COMMAND, opcode: 'exeScriptCom', text: 'funcMain([ARG1],[ARG2],[ARG3])', arguments: {
                    ARG1: { type: ArgumentType.STRING, defaultValue:'1' },
                    ARG2: { type: ArgumentType.STRING, defaultValue:'2' },
                    ARG3: { type: ArgumentType.STRING, defaultValue:'3' },
                }},
                {blockType: BlockType.REPORTER, opcode: 'exeScriptRep', text: 'funcMain([ARG1],[ARG2],[ARG3])', arguments: {
                    ARG1: { type: ArgumentType.STRING, defaultValue:'1' },
                    ARG2: { type: ArgumentType.STRING, defaultValue:'2' },
                    ARG3: { type: ArgumentType.STRING, defaultValue:'3' },
                }},
            ],
//          menus: [],    // メニュー定義
        };
    }

    _exeScript(args, util, blockInfo) {
        const comment = util.thread.target.blocks._blocks[args.blockid].comment;
        if(typeof comment === 'undefined') return 'no comment';
        console.log(util.thread.target.comments[comment].text);
        eval(util.thread.target.comments[comment].text);
        if(typeof funcMain !== 'function') return 'no funcMain function';
        funcMain = funcMain.bind(this);
        return funcMain(args.ARG1,args.ARG2,args.ARG3);
    }

    exeScriptCom(args, util, blockInfo) { return this._exeScript(args, util, blockInfo); }
    exeScriptRep(args, util, blockInfo) { return this._exeScript(args, util, blockInfo); }
}
module.exports = Scratch3Blocks;
