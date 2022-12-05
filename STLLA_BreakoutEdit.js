//=============================================================================
// 打磚塊－關卡編輯器 v1.2
// 最後更新：2017/06/10
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================
/*:
 * @plugindesc 打磚塊的關卡編輯器(v1.2)，使用完記得設off
 * @author STILILA
 *
 * @param Image Path
 * @desc 此腳本使用的檔案路徑
 * @default img/breakout/
 
 * @param Load Data
 * @desc 如要編輯舊設定，在這輸入BlockGroup已有的關卡名稱。載入時無視這之後所有插件參數
 * @default 

 * @param Stage Name
 * @desc 本關的名稱
 * @default st1_1
 
 * @param Next Stage
 * @desc 下一關的名稱，不需要時保持空白
 * @default 
 
 * @param Front Image
 * @desc 前景圖名稱(可加個.jpg讀取jpg檔)
 * @default 
 
 * @param Back Image
 * @desc 背景圖名稱
 * @default 
 
 * @param Clear Image
 * @desc 過關圖名稱，輸出時用
 * @default 

 * @param Line Color
 * @desc 框線的顏色，可輸入css色碼或textColor的數字
 * @default black

 * @param Stage Width
 * @desc 場地總寬
 * @default 816
 
 * @param Stage Height
 * @desc 場地總高
 * @default 624
 
 * @param Block Row
 * @desc 磚塊橫排的數量
 * @default 24
 
 * @param Block Col
 * @desc 磚塊縱排的數量
 * @default 16
 
 * @param Block Width
 * @desc 磚塊的寬
 * @default 34
 
 * @param Block Height
 * @desc 磚塊的高
 * @default 32
 
 * @param Fall Damage
 * @desc 掉球時受的傷害
 * @default 1
 
 * @param Remain To Clear
 * @desc 磚塊剩餘多少算通過
 * @default 5
 
 * @param Block Score
 * @desc 本關各種類的磚塊基本分
 * @default 10,20,40,80,160
 
 * @param BGM
 * @desc BGM名稱,頻率,音量，不需要時保持空白
 * @default Battle1,100,80
 
 * @param Clear ME
 * @desc 過關時放的ME名稱,頻率,音量，不需要時保持空白
 * @default Victory1,100,90
 
 * @param Lose ME
 * @desc 失敗時放的ME名稱,頻率,音量，不需要時保持空白
 * @default Defeat1,100,90
 
 * @param Start CommonEvent
 * @desc 開始時的公共事件ID，不需要時保持空白
 * @default 

 * @param Clear CommonEvent
 * @desc 過關時的公共事件ID，不需要時保持空白
 * @default 
 
 * @param Lose CommonEvent
 * @desc HP用盡時的公共事件ID，不需要時保持空白
 * @default 
 
 * @param Time Limit
 * @desc 通關時限(秒數)，-1為延用之前剩餘時間。不需要時保持空白
 * @default 
 
 * @param Item Rare
 * @desc 掉落道具的最高稀有度。配合道具插件
 * @default 0

 * @help 設定好參數後，啟動遊戲進入編輯畫面
 
 *
 * ＜更新履歷＞
 * v1.2：
 *  對應主程式v1.5.0
 * v1.1：
 *  新增插件參數 Item Rare(配合道具插件)

 * ＜操作＞
 * 滑鼠左鍵：畫磚塊
 * 滑鼠右鍵：此格磚塊種類-1
 * ←、→：切換磚塊種類
 * Q：切換前景圖的可視狀態
 * W：切換無磚部分的可視狀態
 * ok(Enter、Space、Z)：輸出關卡資訊(位置在專案根目錄)
 * escape(Esc、X、Num0、Insert)：離開&輸出
 *＜注意＞
 * 為了輸出用到Node.js的內容

 */

 

// 共通腳本檢測
if (typeof(STILILA) == 'undefined') {alert('未安裝STLLA_ScriptCore.js') ; window.close();}

// 為了不讓變量名稱和其他腳本打架，包起來
(function() {
	
var parameters = PluginManager.parameters('STLLA_BreakoutEdit')
var path = String(parameters['Image Path'] || 'img/breakout/');
var loadFile = String(parameters['Load Data'] || '');
var frontImage = String(parameters['Front Image'] || '');
var backImage = String(parameters['Back Image'] || '');
var clearImage = String(parameters['Clear Image'] || '');
var stageName = String(parameters['Stage Name'] || 'st1_1');
var nextName = String(parameters['Next Stage'] || '');
var stageWidth = Number(parameters['Stage Width'] || 816);
var stageHeight = Number(parameters['Stage Height'] || 624);
var bRow = Number(parameters['Block Row'] || 24);
var bCol = Number(parameters['Block Col'] || 16);
var bWidth = Number(parameters['Block Width'] || 34);
var bHeight = Number(parameters['Block Height'] || 32);
var fallDamage = Number(parameters['Fall Damage'] || 1);
var remainToClear = Number(parameters['Remain To Clear'] || 5);
var blockScore = (parameters['Block Score'].split(',') || [10,20,40,80,160]);
var stageBGM = (parameters['BGM'].split(',') || 0);
var clearME = (parameters['Clear ME'].split(',') || 0);
var loseME = (parameters['Lose ME'].split(',') || 0);
var startCommon = Number(parameters['Start CommonEvent'] || 0);
var clearCommon = Number(parameters['Clear CommonEvent'] || 0);
var loseCommon = Number(parameters['Lose CommonEvent'] || 0);
var timeLimit = Number(parameters['Time Limit'] || 0);

var lineColor = String(parameters['Line Color'] || 'black');
var itemRare = Number(parameters['Item Rare'] || 0);


// =========================================================================================================
// ■ Bitmap
// =========================================================================================================

// ----------------------------------------------
// ● 挖透明塊
//   x,y,w,h：X, Y, 寬, 高
//SceneManager._scene.frontSprite.bitmap.drawRectAlpha(431,301,80,80)
// ----------------------------------------------
Bitmap.prototype.drawRectAlpha = function(x, y, w, h) {
    var context = this._context;
    context.save();
    context.fillStyle = 'green';
	context.globalCompositeOperation = 'destination-out'
    context.fillRect(x, y, w, h);
    context.restore();
    this._setDirty();
}

// ----------------------------------------------
// ● ImageManagerST.loadBreakout
//   isJpg：是否為jpg
// ----------------------------------------------
ImageManagerST.loadBreakout = function(filename, isJpg) {
	var isJpg = isJpg || false;
	// 沒有指定時，檢查副檔名是否為 jpg
	if (!isJpg) {
		isJpg = /.jpg/.test(filename);
	}
	// 消去副檔名
	var filename = filename.replace(/.png/, '');
	filename = filename.replace(/.jpg/, '');
	return this.loadBitmap(path, filename, 0, true, isJpg);
};



// =========================================================================================================
// ■ Game_BreakoutBlock
//   磚塊的數據
// =========================================================================================================
function Game_BreakoutBlock() {
	this.initialize.apply(this, arguments);
}
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Game_BreakoutBlock.prototype.initialize = function(number, type, x, y) {
	this.number = number;
	this.type = type;
	this.x = x;
	this.y = y;
	this.sprite = null;
}
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Game_BreakoutBlock.prototype.update = function() {
}

// ----------------------------------------------
// ● 設置type
// ----------------------------------------------
Game_BreakoutBlock.prototype.setType = function(type) {
	this.type = type;
}


// =========================================================================================================
// ■ Sprite_BreakoutBlock
//   磚塊圖像
// =========================================================================================================

function Sprite_BreakoutBlock() {
	this.initialize.apply(this, arguments);
}
Sprite_BreakoutBlock.prototype = Object.create(Sprite_Base.prototype);
Sprite_BreakoutBlock.prototype.constructor = Sprite_BreakoutBlock;
// ----------------------------------------------
// ● 初始化
//   bitmap：磚塊樣本圖片
// ----------------------------------------------
Sprite_BreakoutBlock.prototype.initialize = function(bitmap, type, color, x, y, w, h) {	
	Sprite_Base.prototype.initialize.call(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.bitmap = new Bitmap(w,h);
	//this.bitmap.textColor = color;
	this.bitmap.fontSize = 15;
	this.drawType(bitmap, type);

}


Sprite_BreakoutBlock.prototype.drawType = function(bitmap, type) {
	this.bitmap.clear();
	if (type == 0 && !SceneManager._scene.viewAll) {return;}
	this.bitmap.blt(bitmap, 0,0,this.w,this.h,0,0);
	
	switch (type) {
		case 1:
			this.bitmap.textColor = 'dodgerblue'
			break;
		case 2:
			this.bitmap.textColor = 'lawngreen'
			break;
		case 3:
			this.bitmap.textColor = 'yellow'
			break;
		case 4:
			this.bitmap.textColor = 'orange'
			break;
		case 5:
			this.bitmap.textColor = 'orangered'
			break;
		default:
			this.bitmap.textColor = 'white'
			break;
		
	}
	
	this.bitmap.drawText(type,0,this.h/4,this.w,this.h, 'right');
	
}

// =========================================================================================================
// ■ Window_BreakoutState
//   打磚塊場景的狀態窗
// =========================================================================================================
function Window_BreakoutState() {
    this.initialize.apply(this, arguments);
}
Window_BreakoutState.prototype = Object.create(Window_Base.prototype);
Window_BreakoutState.prototype.constructor = Window_BreakoutState;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Window_BreakoutState.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.y = Graphics.height - height;
    this.refresh(1);
};
// ----------------------------------------------
// ● 寬
// ----------------------------------------------
Window_BreakoutState.prototype.windowWidth = function() {
    return Graphics.width;
};
// ----------------------------------------------
// ● 高 
// ----------------------------------------------
Window_BreakoutState.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};
// ----------------------------------------------
// ● 刷新
// ----------------------------------------------
Window_BreakoutState.prototype.refresh = function(blockType) {
	this.contents.clear();
	
	switch (blockType) {
		case 1:
			this.contents.textColor = 'dodgerblue'
			break;
		case 2:
			this.contents.textColor = 'lawngreen'
			break;
		case 3:
			this.contents.textColor = 'yellow'
			break;
		case 4:
			this.contents.textColor = 'orange'
			break;
		case 5:
			this.contents.textColor = 'orangered'
			break;
		default:
			this.contents.textColor = 'white'
			break;
		
	}
	
	this.drawText('磚塊類型：'+blockType, 0, 0, this.windowWidth())
}
// ----------------------------------------------
// ● 刷新
// ----------------------------------------------
Window_BreakoutState.prototype.update = function() {
	if (TouchInput.nowY >= Graphics.height - this.windowHeight()) {
		this.y = 0;
	} else {
		this.y = Graphics.height - this.windowHeight();
	}
}

// =========================================================================================================
// ■ Scene_BreakoutEdit
//   打磚塊場景
// =========================================================================================================
function Scene_BreakoutEdit() {
    this.initialize.apply(this, arguments);
}

Scene_BreakoutEdit.prototype = Object.create(Scene_Base.prototype);
Scene_BreakoutEdit.prototype.constructor = Scene_BreakoutEdit;

// ----------------------------------------------
// ● 初始化 
// ----------------------------------------------
Scene_BreakoutEdit.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
	
	// 目前的磚塊類型
	this.drawBlockType = 1;
	this.firstOpen = false;
	this.viewAll = true;
	
	// 取得關卡資料
	if (loadFile) {
        if (BlockGroup[loadFile]) {
			alert('載入設定內容： '+loadFile)
			this.stageData = BlockGroup[loadFile];
			if (!this.stageData['itemRare'] && this.stageData['itemRare'] !== 0) {this.stageData['itemRare'] = 0;} // v1.1追加變數
			return; 
		} else {
			alert('找不到設定內容： '+loadFile+' ，以插件設定開新檔案')
		}
	} 
	this.stageData = {
		'name':stageName,          // 關卡名稱
		'frontImage':frontImage,   // 前景圖
		'backImage':backImage,    // 背景圖
		'clearImage':clearImage,   // 過關時的圖
		'w':stageWidth,                 // 場地寬
		'h':stageHeight,             // 場地高
		'bRow':bRow,            // 磚塊橫排數量
		'bCol':bCol,           // 磚塊縱排數量
		'bWidth':bWidth,             // 磚塊寬 
		'bHeight':bHeight,            // 磚塊高   
		'fallDamage':fallDamage,         // 掉球時傷害量
		'remainToClear':remainToClear,       // 剩多少塊過關
		'blockScore':blockScore,          // 磚塊基本分
		'bgm':stageBGM,                   // BGM
		'clearME':clearME,             // 通關ME
		'loseME':loseME,               // 失敗ME
		'startCommon':startCommon,         // 開始時啟動幾號公共事件(0為不啟動)
		'clearCommon':clearCommon,        // 贏了啟動幾號公共事件
		'loseCommon':loseCommon,           // 輸了啟動幾號公共事件
		'timeLimit':timeLimit,            // 時限(0為無時限)
		'itemRare':itemRare,              // 道具稀有度(v1.1追加)
		'next':nextName,                  // 過關後進 st1_2 繼續
	}

	
};

// ----------------------------------------------
// ● 建立各種物件
// ----------------------------------------------
Scene_BreakoutEdit.prototype.create = function() {
	// 做成背景
	//this.createBackground();
	
	//super
	Scene_Base.prototype.create.call(this); 

	// 做成背景圖
	this.backSprite = new Sprite();
	this.addChild(this.backSprite);

	// 做成前景圖
	this.frontSprite = new Sprite();
	this.addChild(this.frontSprite);

	// 磚塊圖
	this.blocksSprite = new Sprite();  //群集，到時磚塊都加進這裡  ( this.blocksSprite.addChild(磚塊Sprite) )
	this.addChild(this.blocksSprite);

	// 做成 Window 物件放置層
	this.createWindowLayer();
	
	// 做成狀態窗
	this.stateWindow = new Window_BreakoutState(0,0);
	this.addWindow(this.stateWindow);

	// 做成樣本磚塊圖片
	this.blockBitmap = new Bitmap(this.stageData['bWidth'],this.stageData['bHeight']);
	// 取得框線色
	if (parseInt(lineColor)) {
		var color = this.stateWindow.textColor(lineColor);
		this.blockBitmap.fillAll(color);
	} else {
		this.blockBitmap.fillAll(lineColor);
	}
	this.blockBitmap.drawRectAlpha(1, 1, this.stageData['bWidth']-2, this.stageData['bHeight']-2);
	
	// 進行關卡準備
	this.prepareStageObject();
	
	
};

// ----------------------------------------------
// ● 準備關卡物件
// ----------------------------------------------
Scene_BreakoutEdit.prototype.prepareStageObject = function() {

	// 準備背景圖
	this.backSprite.bitmap = ImageManagerST.loadBreakout(this.stageData['backImage']); 

	// 準備前景圖
	this.frontSprite.bitmap = ImageManagerST.loadBreakout(this.stageData['frontImage']);

	// 做成磚塊物件
	this.gameBlocks = [];
	for (var h=0; h < this.stageData['bCol']; h++) {
		for (var w=0; w < this.stageData['bRow']; w++) {
			var number = w+h*this.stageData['bRow'];
			// 如果是載入的情況
			if (this.stageData['blocks'] && this.stageData['blocks'][number]) {
				var block = new Game_BreakoutBlock(number, this.stageData['blocks'][number], this.stageData['bWidth']*w + this.stageData['bWidth']/2, this.stageData['bHeight']*h + this.stageData['bHeight']/2);
			} else {
				var block = new Game_BreakoutBlock(number, 0, this.stageData['bWidth']*w + this.stageData['bWidth']/2, this.stageData['bHeight']*h + this.stageData['bHeight']/2);
			}
			// 取得框線色
			if (parseInt(lineColor)) {
				var color = this.stateWindow.textColor(lineColor);
			} else {
				var color = lineColor;
			}
		    var sprite = new Sprite_BreakoutBlock(this.blockBitmap, block.type, color, this.stageData['bWidth']*w, this.stageData['bHeight']*h, this.stageData['bWidth'], this.stageData['bHeight']);
			block.sprite = sprite;
			this.gameBlocks.push(block);
			this.blocksSprite.addChild(sprite);
		}
	}
	
	
	// 重新運行Scene_BreakoutEdit.isReady()
	SceneManager._sceneStarted = false;
}

// ----------------------------------------------
// ● 等待物件載入完畢
// ----------------------------------------------
Scene_BreakoutEdit.prototype.isReady = function() {
	if (Scene_Base.prototype.isReady.call(this) && this.backSprite.bitmap.isReady() && this.frontSprite.bitmap.isReady()) {
		return true
	} else {
		return false
	}
}

// ----------------------------------------------
// ● 進入場景
// ----------------------------------------------
Scene_BreakoutEdit.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
	if (!this.firstOpen) {
		this.firstOpen = true;
		this.startFadeIn(this.fadeSpeed(), false);
	}
};

// ----------------------------------------------
// ● 忙碌判定(沒改)
// ----------------------------------------------
Scene_BreakoutEdit.prototype.isBusy = function() {
	return (Scene_Base.prototype.isBusy.call(this));
};

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Scene_BreakoutEdit.prototype.update = function() {
	//super
	Scene_Base.prototype.update.call(this);
	this.updateInput();
};


// ----------------------------------------------
// ● 定期更新－操作
// ----------------------------------------------
Scene_BreakoutEdit.prototype.updateInput = function() {
	
	if (this.isBusy()) {return;} // 場景忙碌時以下中斷
	
	// 切換磚塊
	if (Input.isTriggered('left')) {
		this.drawBlockType--;
		if (this.drawBlockType < 0) {this.drawBlockType = 5;}
		this.stateWindow.refresh(this.drawBlockType);
	}
	if (Input.isTriggered('right')) {
		this.drawBlockType++;
		if (this.drawBlockType > 5) {this.drawBlockType = 0;}
		this.stateWindow.refresh(this.drawBlockType);
	}
	
	// 切換前景／背景
	if (Input.isTriggered('pageup')) {
		this.frontSprite.visible = !this.frontSprite.visible;
	}
	
	// 切換無磚頭可視狀態
	if (Input.isTriggered('pagedown')) {
		this.viewAll = !this.viewAll;
		for (var i=0; i < this.gameBlocks.length; i++) {
			var block = this.gameBlocks[i];
			block.sprite.drawType(this.blockBitmap, block.type);
		}
	}
		
	// 畫磚頭
	if (TouchInput.isPressed()) {
		for (var i=0; i < this.gameBlocks.length; i++) {
			var block = this.gameBlocks[i];
			if (TouchInput.x >= block.x - this.stageData['bWidth']/2 && TouchInput.x <= block.x + this.stageData['bWidth']/2 && 
				TouchInput.y >= block.y - this.stageData['bHeight']/2 && TouchInput.y <= block.y + this.stageData['bHeight']/2) {
					block.type = this.drawBlockType;
					block.sprite.drawType(this.blockBitmap, block.type);
			}
		}
	}
	// 降低1級
	if (TouchInput.isCancelled()) {
		for (var i=0; i < this.gameBlocks.length; i++) {
			var block = this.gameBlocks[i];
			if (TouchInput.x >= block.x - this.stageData['bWidth']/2 && TouchInput.x <= block.x + this.stageData['bWidth']/2 && 
				TouchInput.y >= block.y - this.stageData['bHeight']/2 && TouchInput.y <= block.y + this.stageData['bHeight']/2) {
					block.type = Math.max(block.type - 1,0);
					block.sprite.drawType(this.blockBitmap, block.type);
			}
		}
	}
	
	// 輸出
	if (Input.isTriggered('ok')) {
		this.output();
	}
	
	// 結束
	if (Input.isTriggered('escape')) {
		alert('保險起見，進行保存');
		this.output();
		SceneManager.pop();
	}
}



// ----------------------------------------------
// ● 輸出設定
// ----------------------------------------------
Scene_BreakoutEdit.prototype.output = function() {
	
	var blocks = []
	for (var i=0; i<this.gameBlocks.length;i++) {
		blocks.push(this.gameBlocks[i].type);
	}
	// 加入磚塊資料
	this.stageData['blocks'] = blocks;
	
	
	//需要fs.js，反正要這行
    var fs = require('fs');
	//找到專案目錄
	var dirPath = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/');
	if (dirPath.match(/^\/([A-Z]\:)/)) {
        dirPath = dirPath.slice(1);
    }
	// %20轉空白
	dirPath = decodeURIComponent(dirPath);
    //設定檔名
	var filename = this.stageData['name'];
    var count = 0;
    //計數
	while (fs.existsSync(dirPath + filename + '_' + count + '.txt')) {
		count++;
	}
	//決定檔名
    fin = dirPath + filename + '_' + count + '.txt';
	
	
	
	
	
	// 內容
	var str = "'"+this.stageData['name']+"'" + ":{\r\n" +
			"'name':" + "'" + this.stageData['name'] + "'" + ",\r\n" +        
			"'frontImage':" + "'" + this.stageData['frontImage'] + "'" + ",\r\n" +  
			"'backImage':" + "'" + this.stageData['backImage'] + "'" + ",\r\n" +    
			"'clearImage':" + "'" + this.stageData['clearImage'] + "'" + ",\r\n" + 
			"'blocks':[";// + "\r\n";
			for (var b = 0; b < this.stageData['blocks'].length; b++) {
				str += this.stageData['blocks'][b] + ",";
				// if (b%this.stageData['bRow'] == this.stageData['bRow']-1) {
					// str += "\r\n";
				// }
			}
			str += "],\r\n" + 
			"'blockScore':[" + this.stageData['blockScore'][0]+"," + this.stageData['blockScore'][1]+"," + this.stageData['blockScore'][2]+"," +
								this.stageData['blockScore'][3]+"," + this.stageData['blockScore'][4] + "],\r\n" +
			"'w':" + this.stageData['w'] + ",\r\n" +            
			"'h':" + this.stageData['h'] + ",\r\n" +           
			"'bRow':" + this.stageData['bRow'] + ",\r\n" +          
			"'bCol':" + this.stageData['bCol'] + ",\r\n" +          
			"'bWidth':" + this.stageData['bWidth'] + ",\r\n" +             
			"'bHeight':" + this.stageData['bHeight'] + ",\r\n" +          
			"'fallDamage':" + this.stageData['fallDamage'] + ",\r\n" +     
			"'remainToClear':" + this.stageData['remainToClear'] + ",\r\n" +  
			"'bgm':";
			if (this.stageData['bgm'][0]) {
				str += "['"+this.stageData['bgm'][0]+"'"+"," + this.stageData['bgm'][1]+"," + this.stageData['bgm'][2] + "],\r\n";
			} else {
				str += 0 + ",\r\n";
			} 
			str += "'clearME':";
			if (this.stageData['clearME'][0]) {
				str += "['"+this.stageData['clearME'][0]+"'"+"," + this.stageData['clearME'][1]+"," + this.stageData['clearME'][2] + "],\r\n";
			} else {
				str += 0 + ",\r\n";
			}
			str += "'loseME':";
			if (this.stageData['loseME'][0]) {
			  str += "['"+this.stageData['loseME'][0]+"'"+"," + this.stageData['loseME'][1]+"," + this.stageData['loseME'][2] + "],\r\n";
			} else {
			  str += 0 + ",\r\n";
			}   
			str += "'startCommon':" + this.stageData['startCommon'] + ",\r\n" +    
			"'clearCommon':" + this.stageData['clearCommon'] + ",\r\n" +            
			"'loseCommon':" + this.stageData['loseCommon'] + ",\r\n" +   
			"'timeLimit':" + this.stageData['timeLimit'] + ",\r\n" + 	
			"'itemRare':" + this.stageData['itemRare'] + ",\r\n" + 			
			"'next':";
			if (this.stageData['next'] && this.stageData['next'] != 0) {
				str += "'" + this.stageData['next'] + "'" + ",\r\n},"
			} else {
				str += 0 + ",\r\n},"
			}
			
			             
	
	
	
	//var str = "'"+this.stageData['name']+"'"+":"+JSON.stringify(this.stageData)+","
	
	//寫入
    fs.writeFileSync(fin, str);
	
	alert('設定檔已輸出在專案根目錄，名稱：'+filename + '_' + count);
	
}

// ----------------------------------------------
// ● 離開場景
// ----------------------------------------------
Scene_BreakoutEdit.prototype.stop = function() {
	Scene_Base.prototype.stop.call(this);

	// 淡出場景
	this.startFadeOut(this.fadeSpeed(), false);

}




// ----------------------------------------------
// ● 強制進入編輯畫面
// ----------------------------------------------
Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_BreakoutEdit); ///
    }
    this.updateDocumentTitle();
};




})();