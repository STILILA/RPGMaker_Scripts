//=============================================================================
// CG回想 v1.5
// 最後更新：2021/08/15
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================


/*:
 * @plugindesc CG回想 v1.5
 * @author STILILA
 *
 * @param CG Path
 * @desc 設定放CG圖的路徑
 * @default img/pictures/CG/
 *
 * @param Locked Image
 * @desc 該CG格未開啟時所用的預覽圖名稱(若要用jpg，需含附檔名)
 * @default unknown.jpg
 *
 * @param Loading Image
 * @desc 該CG格載入中的圖片名稱(若要用jpg，需含附檔名)
 * @default loading.jpg
 *
 * @param Background
 * @desc 背景圖名稱(若要用jpg，需含附檔名)
 * @default background.jpg
 *
 * @param Fill Screen
 * @desc 圖片填滿畫面(0關、1開)
 * @default 1
 
 * @param BGM
 * @desc 場景BGM名稱(不想要的話保持空白)
 * @default Ship1
 * @require 1
 * @dir audio/bgm/
 * @type file
 *
 * @param CG Help
 * @desc 移到某CG時顯示說明，啟動時需編輯腳本的STILILA.CG.TextSet。1為開、0為關(預設1)
 * @default 1
 *
 * @param Completeness Text
 * @desc 收集率的文字，可以改為完成度、回收率什麼的。
 * @default 收集率：
 *
 * @param Title Command Text
 * @desc 出現在標題畫面時的選項文字
 * @default CG回想
 *
 * @param Row
 * @desc 橫列一次顯示多少CG(預設4)
 * @default 4
 *
 * @param Col
 * @desc 縱列一次顯示多少CG(預設4)
 * @default 4
 *
 * @param X offset
 * @desc CG清單往右偏移量(預設22)
 * @default 22
 *
 * @param Y offset
 * @desc CG清單往下偏移量(預設0)
 * @default 0
 
 * @help
//--------------------------------------------------------------------------
// ● 必須
//--------------------------------------------------------------------------
 * STLLA_ScriptCore v1.2(共通前置)：
 *    https://www.dropbox.com/s/1syi7sk0psybhb7/STLLA_ScriptCore.js?dl=0
 * STLLA_Gallery_setting(設定檔)：
 *    https://www.dropbox.com/s/zq8ceeza48ij65u/STLLA_Gallery_setting.js?dl=0 
//--------------------------------------------------------------------------
// ● 更新履歷
//--------------------------------------------------------------------------
 * v1.5
 * 1.修改檢查CG的功能，讓它可用於遊戲內容
 * 2.修正利用插件參數開／關CG時，省略第二個參數會出現的bug
 
 * v1.4：
 *  1.插件參數追加Fill Screen(填滿畫面)的選項
 
 * v1.3：
 *  1.變數存取方式調整，讓使用者遊戲公開後仍可自由地新增項目
 *  2.插件指令變更，舊版使用者可視需求更新
 
 * v1.2：
 *  1.對應主程式v1.5.0
 *  2.設定檔獨立
 
 * v1.1：
 *  1.對應主程式v1.31
 *  2.追加必要插件
 *  3.插件參數英文化
 *  
 *
//--------------------------------------------------------------------------
// ● 使用法
//--------------------------------------------------------------------------
 *   Gallery open              # 開啟CG畫面
 *           add 5             # 5號CG全開放
 *           add 0 0           # 0號CG的差分0開放
 *           remove 3          # 3號CG全關閉
 *           remove 1 4        # 1號CG的差分4清除
 *           check 5 -1 5      # 檢查5號CG開啟狀態，全部開啟才會通過，並將結果代入5號開關
 *           check 5 -2 5      # 檢查5號CG開啟狀態，只要有一張開啟就會通過，並將結果代入5號開關
 *           check 5 2 5       # 檢查5號CG的差分2開啟狀態，並將結果代入5號開關
 *           complete          # 全開放
 *           clear             # 全關閉
 *           titleOn           # 在標題畫面新增選項進入CG畫面
 *           titleOff          # 移除在標題畫面的選項
 *
 * 起始是從 0 開始
 * 使用開放、關閉指令時，控制台會有提示
 * 請打開腳本檔設定一下CG資料
 * 預覽圖必定是群組第一張

 */
 
// 必要插件檢測： 
if (typeof(STILILA) == 'undefined') {alert('未安裝STLLA_ScriptCore.js') ; window.close();}
STILILA.CG = {};





// ↓如果有需要且懂腳本，再改以下內容↓ 


 // 為了不讓變量名稱和其他腳本打架，包起來
 (function() {
	 

	 
// 插件管理器的設定項
var parameters = PluginManager.parameters('STLLA_Gallery');  // 取得腳本檔內容 (要填腳本名稱)
var cgPath = String(parameters['CG Path'] || 'img/pictures/CG/');  // 取得插件管理器設定的CG路徑(沒有就用img/pictures/CG/)
var unKnownPic = String(parameters['Locked Image'] || 'unknown');  // 同上
var loadingPic = String(parameters['Loading Image'] || 'loading');  // 同上
var backGroundPic = String(parameters['Background'] || 'background');  // 同上
var fillScreen = Number(parameters['Fill Screen'] || 0);  

var backGroundMusic = String(parameters['BGM'] || ''); // 同上
var collectText = String(parameters['Completeness Text'] || '收集率：');
var titleText = String(parameters['Title Command Text'] || 'CG回想');
var CGHelp = Number(parameters['CG Help'] || 1);
var maxCol = Number(parameters['Row'] || 4);
var maxRow = Number(parameters['Col'] || 4);
var xRevise = Number(parameters['X offset'] || 0);
var yRevise = Number(parameters['Y offset'] || 0);

// =========================================================================================================
// ■ Game_Interpreter
// =========================================================================================================
var _Game_Interpreter_pluginCommand =
		Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === 'Gallery') {
		switch (args[0]) {
		case 'open':
			SceneManager.push(Scene_Gallery);
			break;
		case 'add':
			ConfigManager.openCG(Number(args[1]), args[2]);
			break;
		case 'remove':
			ConfigManager.closeCG(Number(args[1]), args[2]);
			break;
		case 'check':
			result = ConfigManager.checkCG(Number(args[1]), args[2]);
			$gameSwitches.setValue(Number(args[3]), result);
			break;
		case 'complete':
			ConfigManager.completeGallery();
			break;
		case 'clear':
			ConfigManager.clearGallery();
			break;
		case 'titleOn':
			ConfigManager.galleryInTitle = true;
			ConfigManager.save();
			break;
		case 'titleOff':
			ConfigManager.galleryInTitle = false;
			ConfigManager.save();
			break;
		}
	}
};
// =========================================================================================================
// ■ ConfigManager
// =========================================================================================================
// ----------------------------------------------
// ● 從標題畫面進入判定
// ----------------------------------------------
ConfigManager.galleryInTitle = false;
// ----------------------------------------------
// ● 製作 Config 內容(存檔用)
// ----------------------------------------------
var _ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
	var config = _ConfigManager_makeData.call(this);
	config.galleryData = this.galleryData;
	config.galleryInTitle = this.galleryInTitle;
	return config;
};
// ----------------------------------------------
// ● 載入 Config 內容(遊戲啟動時調用)
// ----------------------------------------------
var _ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
	_ConfigManager_applyData.call(this, config);
	this.galleryData = this.loadGalleryData(config);
	this.galleryInTitle = this.readFlag(config, 'galleryInTitle');
};
// ----------------------------------------------
// ● 載入畫廊資料
// config：config存檔內容
// ----------------------------------------------
ConfigManager.loadGalleryData = function(config) {
	// 有存檔的時候
	if (config.galleryData !== undefined) {
		return config.galleryData;
	} else {
	// 沒的時候，做一份新的
		this.galleryData = []
		// for (var index = 0; index < STILILA.CG.DataSet.length; index++){
			// for (var diff = 0; diff < STILILA.CG.DataSet[index].length; diff++) {
				// if (!this.galleryData[index]) {this.galleryData[index] = [];}
				// this.galleryData[index][diff] = false;
			// }
		// }
		return this.galleryData;
	}
}
// ----------------------------------------------
// ● 開啟指定 CG
// index: 第幾格(0開始)、diff: 第幾張差分(0開始)
// ----------------------------------------------
ConfigManager.openCG = function(index, diff) {
	if (!STILILA.CG.DataSet) {alert('STLLA_Gallery_setting.js未安裝！'); return;}
	if (diff === undefined) {diff = -1;}
	if (diff != -1){
		if (diff >= STILILA.CG.DataSet[index].length) {
			alert('欲開啟之CG位置 '+index+' - '+diff+' 不存在');
			return;
		}
		if (!this.galleryData[index]) {this.galleryData[index] = [];}
		this.galleryData[index][diff] = true;
	} else {
		for (var diff = 0; diff < STILILA.CG.DataSet[index].length; diff++) {
			if (!this.galleryData[index]) {this.galleryData[index] = [];}
			this.galleryData[index][diff] = true;
		}
		diff = -1;
	}
	ConfigManager.save();
	if (diff != -1) {
		console.log('CG位置 '+index+' - '+diff+' 已開啟');
	} else {
		console.log('CG位置 '+index+' 已全數開啟');
	}
	
}
// ----------------------------------------------
// ● 關閉指定 CG
// index: 第幾格(0開始)、diff: 第幾張差分(0開始)
// ----------------------------------------------
ConfigManager.closeCG = function(index, diff) {
	if (!STILILA.CG.DataSet) {alert('STLLA_Gallery_setting.js未安裝！'); return;}
	if (diff === undefined) {diff = -1;}
	if (diff != -1){
		if (diff >= STILILA.CG.DataSet[index].length) {
			alert('欲關閉之CG位置 '+index+' - '+diff+' 不存在');
			return;
		}
		if (!this.galleryData[index]) {this.galleryData[index] = [];}
		this.galleryData[index][diff] = false;
	} else {
		for (var diff = 0; diff < STILILA.CG.DataSet[index].length; diff++) {
			if (!this.galleryData[index]) {this.galleryData[index] = [];}
			this.galleryData[index][diff] = false;
		}
		diff = -1;
	}
	ConfigManager.save();
	if (diff != -1) {
		console.log('CG位置 '+index+' - '+diff+' 已關閉');
	} else {
		console.log('CG位置 '+index+' 已全數關閉');
	}
}
// ----------------------------------------------
// ● 檢查指定 CG 有沒被開啟
// index: 第幾格(0開始)、diff: 第幾張差分(0開始)
// ----------------------------------------------
ConfigManager.checkCG = function(index, diff) {
	if (!STILILA.CG.DataSet) {alert('STLLA_Gallery_setting.js未安裝！'); return;}
	if (diff === undefined || diff < -2) {diff = -1;}
	switch (diff) {
		// 檢查整組
		case -1:
			console.log(this.galleryData[index]);
			if (this.galleryData[index].length === 0) {return false} // js，不愧是你，還要多這一行
			//return this.galleryData[index].every((ele)=>{return ele}); // js，真的不愧是你，empty不算進判定
			for (let i=0; i < STILILA.CG.DataSet[index].length; i++) { if (!this.galleryData[index][i]) {return false;} } // 所以只好用for全掃了
			return true;
			break;
		// 檢查部分	
		case -2:
			console.log(this.galleryData[index]);
			return this.galleryData[index].some((ele)=>ele);
			break;
		default:
			if (!this.galleryData[index]) {this.galleryData[index] = [];}
			console.log(this.galleryData[index][diff]);
			return this.galleryData[index][diff]
			break;
	}
}
// ----------------------------------------------
// ● CG 全開
// ----------------------------------------------
ConfigManager.completeGallery = function() {
	if (!STILILA.CG.DataSet) {alert('STLLA_Gallery_setting.js未安裝！'); return;}
	for (var index = 0; index < STILILA.CG.DataSet.length; index++){
		if (!this.galleryData[index]) {this.galleryData[index] = [];}
		for (var diff = 0; diff < STILILA.CG.DataSet[index].length; diff++) {
			this.galleryData[index][diff] = true;
		}
	}
	ConfigManager.save();
	console.log('CG已全開');
}
// ----------------------------------------------
// ● CG 全清
// ----------------------------------------------
ConfigManager.clearGallery = function() {
	if (!STILILA.CG.DataSet) {alert('STLLA_Gallery_setting.js未安裝！'); return;}
	this.galleryData = [];
	// for (var index = 0; index < STILILA.CG.DataSet.length; index++){
		// for (var diff = 0; diff < STILILA.CG.DataSet[index].length; diff++) {
			// if (!this.galleryData[index]) {this.galleryData[index] = [];}
			// this.galleryData[index][diff] = false;
		// }
	// }

	ConfigManager.save();
	console.log('CG收集狀態已重置');
}




// =========================================================================================================
// ■ Scene_Gallery < Scene_Base
//   CG回想場景
// =========================================================================================================
// Class宣告
function Scene_Gallery() {
	this.initialize.apply(this, arguments);
}     
// 繼承Scene_Base
Scene_Gallery.prototype = Object.create(Scene_Base.prototype);
// 設定建構式
Scene_Gallery.prototype.constructor = Scene_Gallery;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Scene_Gallery.prototype.initialize = function() {
	//super
	Scene_Base.prototype.initialize.call(this); 
	// 已載入的CG
	this._loadbitmaps = [];
	// 正在載入的CG
	this._nowLoadPicture = null;
	// 工作階段(0：選擇CG、1：觀看CG)
	this._step = 0;
	// 記錄原本快取
	this._originalCache = {};
	for (var i in ImageManagerST.cache._inner){
		this._originalCache[i] = ImageManagerST.cache._inner[i];
	};
	// 紀錄BGM
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();

	// 目前差分編號
	this._diffNumber = 0;
	// CG漸變用變數
	this._CGfadeDuration = 0;
	this._CGfadeSign = 0;
	// 取得存檔
	this._galleryData = ConfigManager.galleryData;
	// 載入必要檔案
	this._tempData = [unKnownPic, loadingPic, backGroundPic];
};

// ----------------------------------------------
// ● 建立各種物件
// ----------------------------------------------
Scene_Gallery.prototype.create = function() {
	//super
	Scene_Base.prototype.create.call(this); 
	// 做成背景
	this.createBackground();
	// 做成 Window 物件放置層
	this.createWindowLayer();
	
	// 做成臨時背景層(過渡CG用)
	this._tempback = new Sprite();
	this._tempback.bitmap = new Bitmap();
	this.addChild(this._tempback);
	// 做成 CG 檢視層
	this._cgView = new Sprite();
	this._cgView.opacity = 0;
	this._cgView.bitmap = new Bitmap(Graphics.width, Graphics.height);
	this._cgView.anchor.x = 0.5;
	this._cgView.anchor.y = 0.5;
	this._cgView.x = Graphics.width / 2;
	this._cgView.y = Graphics.height / 2;
	this.addChild(this._cgView);
	
};
// ----------------------------------------------
// ● 建立背景
// ----------------------------------------------
Scene_Gallery.prototype.createBackground = function() {
	this._backgroundSprite = new Sprite();
	this._backgroundSprite.x = Graphics.width/2;
	this._backgroundSprite.y = Graphics.height/2;
	this._backgroundSprite.anchor.x = 0.5;
	this._backgroundSprite.anchor.y = 0.5;
	this._backgroundSprite.bitmap = ImageManagerST.loadCG(backGroundPic);
	this.addChild(this._backgroundSprite);
};
// ----------------------------------------------
// ● 場景準備(true時Loading結束、並執行start()方法)
// ----------------------------------------------
Scene_Gallery.prototype.isReady = function() {
	if (Scene_Base.prototype.isReady.call(this)) {
		return this.isPicturesLoaded();
	} else {
		return false;
	}
};
// ----------------------------------------------
// ● 載入圖片
// ----------------------------------------------
Scene_Gallery.prototype.isPicturesLoaded = function() {
	// 如果有正在讀取的圖片且還沒讀取完，中斷
	if (this._nowLoadPicture && !this._nowLoadPicture.isReady()) {return false;} 
	// 預載資料夾內所有檔案
	while (this._tempData.length > 0) {       
		var name = this._tempData.shift();
		var pic = ImageManagerST.loadCG(name);
		pic._loadListeners = [];
		if (!pic.isReady()) {	
			this._nowLoadPicture = pic;
			return false;
		} else {
			this._loadbitmaps.push(pic);
		} 
	}
	this._nowLoadPicture = null;
	return true;
};
// ----------------------------------------------
// ● 場景開始
// ----------------------------------------------
Scene_Gallery.prototype.start = function() {
	Scene_Base.prototype.start.call(this);
	//淡入場景
	this.startFadeIn(this.fadeSpeed(), false);
	//做成背景
	this._backgroundSprite.bitmap = ImageManagerST.loadCG(backGroundPic);
	// 做成選單
	this.createListWindow();
	// 做成說明視窗
	this.createHelpWindow();
	// 做成蒐集進度窗
	this.createCollectWindow();
	// 播放BGM
	if (backGroundMusic != ''){
		var bgm = {'name':backGroundMusic,'pan':0,'pitch':100,'volume':80};
		AudioManager.playBgm(bgm);
	}
};
// ----------------------------------------------
// ● 建立CG選擇清單
// ----------------------------------------------
Scene_Gallery.prototype.createListWindow = function() {
	this._listWindow = new Window_GalleryList();
	this._listWindow.opacity = 0;
	this.addWindow(this._listWindow);
	// 活化
	this._listWindow.activate();
	// 按下確定時在 Scene_Gallery 觸發的方法
	this._listWindow.setHandler('ok', this.onInputOk.bind(this));
	// 按下取消時在 Scene_Gallery 觸發的方法
	//this._listWindow.setHandler('cancel', this.onInputCancel.bind(this));
}
// ----------------------------------------------
// ● 建立說明視窗
// ----------------------------------------------
Scene_Gallery.prototype.createHelpWindow = function() {
	this._helpWindow = new Window_Help(4);
	this._helpWindow.y = this._listWindow.windowHeight();
	this._helpWindow.height = Graphics.height - this._listWindow.windowHeight();
	this._listWindow.setHelpWindow(this._helpWindow);
	this._helpWindow.opacity = 0;
	this.addWindow(this._helpWindow);
}
// ----------------------------------------------
// ● 建立收集進度視窗
// ----------------------------------------------
Scene_Gallery.prototype.createCollectWindow = function() {
	w = 200;
	h = Graphics.height - this._listWindow.windowHeight();
	x = Graphics.width - w;
	y = this._listWindow.windowHeight();
	this._collectWindow = new Window_Base(x,y,w,h);
	this._collectWindow.opacity = 0;
	this.addWindow(this._collectWindow);
	
	var collect = 0;
	var all = 0;
	for (var index = 0; index < STILILA.CG.DataSet.length; index++){
		if (!this._galleryData[index]) {
			this._galleryData[index] = []
			ConfigManager.save();
		}
		for (var diff = 0; diff < STILILA.CG.DataSet[index].length; diff++){
			if (this._galleryData[index][diff]) {collect++;}
			all++;
		}
	}
	this._collectWindow.contents.drawText(collectText, 0, 0, w, 32);
	var text = collect + '／' + all;
	this._collectWindow.contents.fontSize = 46;
	this._collectWindow.contents.drawText(text, 0, 48, w-50, 48, 'right');
}
// ----------------------------------------------
// ● 忙碌
// ----------------------------------------------
Scene_Gallery.prototype.isBusy = function() {
	return ((SceneManager._scene != this) || this._nowLoadPicture || Scene_Base.prototype.isBusy.call(this));
};
// ----------------------------------------------
// ● 定期處理
// ----------------------------------------------
Scene_Gallery.prototype.update = function() {
	Scene_Base.prototype.update.call(this);
	// 更新過渡效果
	this.updateCGFade();
	
	
	// 按下確定時的處理(只在CG檢視模式中生效)
	if (this._step >= 1 && (Input.isTriggered('ok') || Input.isTriggered('right') || TouchInput.isTriggered())) {
		this.onInputOk();
	}
	// 按下取消時的處理
	if (Input.isTriggered('escape') || TouchInput.isCancelled()) {
		this.onInputCancel();
	}
	// 前一張差分
	if (this._step >= 1 && Input.isTriggered('left')) {
		if (this.isBusy()) {return;}
		this.preCG(this._listWindow.index());
	}

	
};
// ----------------------------------------------
// ● 按下確定時的處理
// ----------------------------------------------
Scene_Gallery.prototype.onInputOk = function() {
	if (this.isBusy()) {return;}
	switch (this._step) {
	case 0:
		// 檢視CG
		this.startViewCG(this._listWindow.index());
		break;
	case 1:
		// 切到下個差分
		this.loadNextCG(this._listWindow.index());
		break;
	}
};
// ----------------------------------------------
// ● 按下取消時的處理
// ----------------------------------------------
Scene_Gallery.prototype.onInputCancel = function() {
	if (this.isBusy()) {return;}
	switch (this._step) {
	case 0:
		this._listWindow.deactivate();
		SceneManager.pop();
		break;
	case 1:
		this.endViewCG();
		break;
	}
};
// ----------------------------------------------
// ● CG淡入
//   index：選項位置
// ----------------------------------------------
Scene_Gallery.prototype.startCGFadein = function(index) {
	this._tempback.opacity = 255;
	this._CGfadeDuration = 18;
	this._CGfadeSign = 1;
}
// ----------------------------------------------
// ● CG漸變處理
// ----------------------------------------------
Scene_Gallery.prototype.updateCGFade = function() {
	if (this._CGfadeDuration > 0) {
		if (this._CGfadeSign > 0) {
			this._cgView.opacity += (255 - this._cgView.opacity) / this._CGfadeDuration;
		} else {
			this._cgView.opacity -= this._cgView.opacity / this._CGfadeDuration;
		}
		this._CGfadeDuration--;
		if (this._CGfadeDuration == 0) {
			this._tempback.bitmap.clear();
			this._tempback.opacity = 0;
		}
	} 
};
// ----------------------------------------------
// ● CG淡出
//   index：選項位置
// ----------------------------------------------
Scene_Gallery.prototype.startCGFadeOut = function(index) {
	this._tempback.opacity = 0;
	this._CGfadeDuration = 18;
	this._CGfadeSign = -1;
}

// ----------------------------------------------
// ● 開始檢視CG
//   index：選項位置
// ----------------------------------------------
Scene_Gallery.prototype.startViewCG = function(index) {
	this._nowLoadPicture = null;
	this._diffNumber = 0;
	for (var i = 0; i < this._galleryData[index].length; i++) {
		if (this._galleryData[index][i]) {
			this._diffNumber = i;
			break;
		}
	}
	var bitmap = ImageManagerST.loadCG(STILILA.CG.DataSet[index][this._diffNumber]);
	if (!bitmap.isReady()){
		bitmap._loadListeners = [];
		this._nowLoadPicture = bitmap;
		bitmap.addLoadListener(this.startViewCG.bind(this, index));
		// 刪快取時用
		this._listWindow._deleteCache.push(bitmap.cacheKey);
		return;
	}
	this._step = 1;
	
	if (fillScreen) {
		this._cgView.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, Graphics.width, Graphics.height);
	} else {
		this._cgView.bitmap = bitmap;
	}
	
	this.startCGFadein();
}
// ----------------------------------------------
// ● 結束檢視CG
//   index：選項位置
// ----------------------------------------------
Scene_Gallery.prototype.endViewCG = function(index) {
	this._animeFlag = false;
	this._listWindow.contentsOpacity = 255;
	this._step = 0;
	this._listWindow.activate();
	this._listWindow.refresh();
	this.startCGFadeOut();
}

// ----------------------------------------------
// ● 讀取下一張CG
//   index：選項位置(CG格)
// ----------------------------------------------
Scene_Gallery.prototype.loadNextCG = function(index) {
	// 檢測下一張圖片
	var next = this._diffNumber + 1;
	// 下一張差分未開啟、或是不存在的情況，直接跑endViewCG()
	if (next >= STILILA.CG.DataSet[index].length) {
		this.endViewCG();
		return;
	}
	while (!this._galleryData[index][next]) {
		if (next >= this._galleryData[index].length) {
			this.endViewCG();
			return;
		}
		next++;
	}
	var bitmap = ImageManagerST.loadCG(STILILA.CG.DataSet[index][next]);
	// 如果圖片未載好就中斷，等載好跑 nextCG()
	if (!bitmap.isReady()){
		bitmap._loadListeners = [];
		this._nowLoadPicture = bitmap;
		bitmap.addLoadListener(this.nextCG.bind(this, index, next));
		// 刪快取時用
		this._listWindow._deleteCache.push(bitmap.cacheKey);
		return;
	} else {
		// 加載好就直接跑 nextCG()
		this.nextCG(index, next);
	}
}
// ----------------------------------------------
// ● 下一張CG
//   index：選項位置(CG格)
//   next：下一差分號
// ----------------------------------------------
Scene_Gallery.prototype.nextCG = function(index, next) {
	this._nowLoadPicture = null;
	// 拍照做過渡用
	this._tempback.bitmap = Bitmap.snap(this);
	//var now = this._diffNumber;
	// 設置下次要判斷的差分編號
	this._diffNumber = next;
	var bitmap = ImageManagerST.loadCG(STILILA.CG.DataSet[index][next]);
	if (fillScreen) {
		this._cgView.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, Graphics.width, Graphics.height);
	} else {
		this._cgView.bitmap = bitmap;
	}
	this._cgView.opacity = 0;
	this.startCGFadein();
}

// ----------------------------------------------
// ● 前一張CG
//   index：選項位置(CG格)
// ----------------------------------------------
Scene_Gallery.prototype.preCG = function(index) {
	this._nowLoadPicture = null;
	// 檢測前一張圖片
	var pre = this._diffNumber - 1;
	// 前一張差分未開啟、或是不存在的情況，直接跑endViewCG()
	if (pre < 0) {
		this.endViewCG();
		return;
	}
	while (!this._galleryData[index][pre]) {
		// 沒前一張可放時直接跑endViewCG()
		if (pre < 0) {
			this.endViewCG();
			return;
		}
		pre--;
	}
	// 拍照做過渡用
	this._tempback.bitmap = Bitmap.snap(this);
	//var now = this._diffNumber;
	// 設置下次要判斷的差分編號
	this._diffNumber = pre;
	var bitmap = ImageManagerST.loadCG(STILILA.CG.DataSet[index][pre]);
	if (fillScreen) {
		this._cgView.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, Graphics.width, Graphics.height);
	} else {
		this._cgView.bitmap = bitmap;
	}
	this._cgView.opacity = 0;
	this.startCGFadein();

}

// ----------------------------------------------
// ● 離開場景
// ----------------------------------------------
Scene_Gallery.prototype.stop = function() {
	Scene_Base.prototype.stop.call(this);
	// 恢復成原本的快取
	ImageManagerST.cache._inner = this._originalCache;
	// 淡出場景
	this.startFadeOut(this.fadeSpeed(), false);
	
	// 還原BGM
	if (this._mapBgm) {
        AudioManager.playBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.playBgs(this._mapBgs);
    }
	
}

// =========================================================================================================
// ■ Window_GalleryList < Window_Selectable
//   CG選擇清單
// =========================================================================================================
function Window_GalleryList() {
	this.initialize.apply(this, arguments);
}
Window_GalleryList.prototype = Object.create(Window_Selectable.prototype);
Window_GalleryList.prototype.constructor = Window_GalleryList;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Window_GalleryList.prototype.initialize = function() {
	var width = this.windowWidth();
	var height = this.windowHeight();
	this._unKnownPic = ImageManagerST.loadCG(unKnownPic);
	this._loadingPic = ImageManagerST.loadCG(loadingPic);
	this._galleryData = SceneManager._scene._galleryData; 
	
	
	// 要刪除的快取
	this._deleteCache = [];
	Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
	this._index = 0;
	this.refresh();
};

// ----------------------------------------------
// ● 窗口寬
// ----------------------------------------------
Window_GalleryList.prototype.windowWidth = function() {
	return Graphics.boxWidth;
};
// ----------------------------------------------
// ● 窗口高
// ----------------------------------------------
Window_GalleryList.prototype.windowHeight = function() {
	return Graphics.boxHeight - 160;
};
// ----------------------------------------------
// ● 取得一次描繪橫向的數量
// ----------------------------------------------
Window_GalleryList.prototype.maxCols = function() {
	return maxCol;
};
// ----------------------------------------------
// ● 取得橫向間格
// ----------------------------------------------
Window_GalleryList.prototype.spacing = function() {
	return 16;
};
// ----------------------------------------------
// ● 項目寬
// ----------------------------------------------
Window_GalleryList.prototype.itemWidth = function() {
	return Math.ceil(this.windowWidth() / this.maxCols() - this.spacing() * 2);
};
// ----------------------------------------------
// ● 項目高
// ----------------------------------------------
Window_GalleryList.prototype.itemHeight = function() {
	return (this.windowHeight() - this.padding * 2)/maxRow; 
};

// ----------------------------------------------
// ● 項目總數
// ----------------------------------------------
Window_GalleryList.prototype.maxItems = function() {
	return STILILA.CG.DataSet.length;
};

// ----------------------------------------------
// ● (頁面移動時) 描繪所有項目
// ----------------------------------------------
Window_GalleryList.prototype.drawAllItems = function() {
	var topIndex = this.topIndex();

	// 檢測還會用到的圖片，從刪除清單除外
	for (var i=0; i < this.maxPageItems(); i++) {
		var index = topIndex + i;
		var now_index = this.index();
		if (index >= STILILA.CG.DataSet.length) {break;} 
		if (!this._galleryData[now_index]) {
			this._galleryData[now_index] = []
			ConfigManager.save();
		}
		var isOpened = this._galleryData[now_index].some(function(value){return value == true});
		if (!isOpened) {continue;}
		var cacheKey = ImageManagerST.getCacheKey(cgPath, STILILA.CG.DataSet[index][0]);
		if (this._deleteCache.contains(cacheKey)) {
			this._deleteCache.remove(cacheKey);
		}
	}
	// 清除快取
	while (this._deleteCache.length > 0) {
		var key = this._deleteCache.shift();
		ImageManagerST.cacheRemove(key);
	}

	// 原處理
	for (var i = 0; i < this.maxPageItems(); i++) {
		var index = topIndex + i;
		if (index < this.maxItems()) {
			this.drawItem(index);
		}
	}
};

// ----------------------------------------------
// ● 描繪項目(refresh() → drawAllitem() → drawItem())
// ----------------------------------------------
Window_GalleryList.prototype.drawItem = function(index) {
	
	if (!this._galleryData[index]) {
		this._galleryData[index] = [];
		ConfigManager.save();
	}
	
	// 檢測是否開啟
	var isOpened = this._galleryData[index].some(function(value){return value == true});
	// 計錄取得數
	var collect = 0;
	for (var diff = 0; diff < this._galleryData[index].length; diff++){
		if (this._galleryData[index][diff]) {collect++;}
	}
    // 此CG格已開啟
	if (isOpened) {
		var bitmap = ImageManagerST.loadCG(STILILA.CG.DataSet[index][0]);
		// 加載中就先中斷
		if (!bitmap.isReady()) {
			var rect = this.itemRect(index);
			this.contents.blt(this._loadingPic, 0, 0, this._loadingPic.width, this._loadingPic.height, rect.x + 4, rect.y + 8, this.itemWidth()-8, this.itemHeight()-16);
			bitmap.addLoadListener(this.redrawItem.bind(this, index));
			return;
		}
		// 刪快取時用
		this._deleteCache.push(bitmap.cacheKey);
		var rect = this.itemRect(index);
		this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x + 4, rect.y + 8, this.itemWidth()-8, this.itemHeight()-16);
	} else {
		// 未開啟的處理
		var rect = this.itemRect(index);
		this.contents.blt(this._unKnownPic, 0, 0, this._unKnownPic.width, this._unKnownPic.height, rect.x + 4, rect.y + 8, this.itemWidth()-8, this.itemHeight()-16);
	}
	var text = collect + '／' + STILILA.CG.DataSet[index].length;
	this.contents.fontSize = 20;
    this.contents.drawText(text, rect.x - 4, rect.y + rect.height - 32 - 2, rect.width, 32, 'right');
};
// ----------------------------------------------
// ● 清除項目
// ----------------------------------------------
Window_GalleryList.prototype.clearItem = function(index) {
	var rect = this.itemRect(index);
	this.contents.clearRect(rect.x+4, rect.y+8, this.itemWidth()-8, this.itemHeight()-16);
};
// ----------------------------------------------
// ● 是否能選
// ----------------------------------------------
Window_GalleryList.prototype.isCurrentItemEnabled = function() {
	var isOpened = this._galleryData[this.index()].some(function(value){return value == true});
	if (!isOpened) {return false;}
	var bitmap = ImageManagerST.loadCG(STILILA.CG.DataSet[this.index()][0]);
	return bitmap.isReady();
};

// ----------------------------------------------
// ● 取得項目大小
// ----------------------------------------------
Window_GalleryList.prototype.itemRect = function(index) {
	var rect = new Rectangle();
	var maxCols = this.maxCols();
	rect.width = this.itemWidth();
	rect.height = this.itemHeight();
	rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX + xRevise;  //
	rect.y = Math.floor(index / maxCols) * (rect.height) - this._scrollY + yRevise;  //
	return rect;
};


// ----------------------------------------------
// ● 更新說明視窗
// ----------------------------------------------
Window_GalleryList.prototype.updateHelp = function() {
	if (CGHelp == 0) {return};
	try {	
		this._helpWindow.contents.clear();
		var isOpened = this._galleryData[this.index()].some(function(value){return value == true});
		if (isOpened) {
			for (var i=0; i < STILILA.CG.TextSet[this.index()][1].length; i++) {
				text = STILILA.CG.TextSet[this.index()][1][i];
				this._helpWindow.contents.drawText(text, 0, 28*i, this._helpWindow.width, 28);	
			}
		} else {
			for (var i=0; i < STILILA.CG.TextSet[this.index()][0].length; i++) {
				text = STILILA.CG.TextSet[this.index()][0][i];
				this._helpWindow.contents.drawText(text, 0, 28*i, this._helpWindow.width, 28);	
			}
		}
	} catch (e) {
		// 處理有問題時，什麼都不做
	}
};

// ----------------------------------------------
// ● 追加讀取路徑
//   isJpg：是否為jpg
// ----------------------------------------------
ImageManagerST.loadCG = function(filename, isJpg) {
	var isJpg = isJpg || false;
	// 沒有指定時，檢查副檔名是否為 jpg
	if (!isJpg) {
		isJpg = /.jpg/.test(filename);
	}
	// 消去副檔名
	var filename = filename.replace(/.png/, '');
	filename = filename.replace(/.jpg/, '');
	return this.loadBitmap(cgPath, filename, 0, true, isJpg);
};



// =========================================================================================================
// ■ Scene_Map < Scene_Base
// =========================================================================================================
// 淡入地圖畫面判定
var _Scene_Map_needsFadeIn = Scene_Map.prototype.needsFadeIn;
Scene_Map.prototype.needsFadeIn = function() {
	return (_Scene_Map_needsFadeIn.call(this) || 
	    // 離開CG回想場景時，執行淡入效果
		SceneManager.isPreviousScene(Scene_Gallery));
};

// 離開地圖
var _Scene_Map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
	_Scene_Map_stop.call(this);
	// 進入CG回想場景時，執行淡出效果
	if (SceneManager.isNextScene(Scene_Gallery)) {
		if (backGroundMusic) {
			this.fadeOutAll();
		} else {
			this.startFadeOut(this.fadeSpeed(), false);
		}
	}
};
	
// =========================================================================================================
// ■ Window_TitleCommand   &   Scene_Title
// =========================================================================================================
var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
	_Window_TitleCommand_makeCommandList.call(this);
	if (ConfigManager.galleryInTitle) {
		this.addCommand(titleText, 'CG');
	}
};


var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
	_Scene_Title_createCommandWindow.call(this);
	if (ConfigManager.galleryInTitle) {
		this._commandWindow.setHandler('CG',  this.commandGallery.bind(this));
	}
	
};

Scene_Title.prototype.commandGallery = function() {
    this._commandWindow.close();
    if (backGroundMusic) {
		this.fadeOutAll();
	} else {
		this.startFadeOut(this.fadeSpeed(), false);
	}
    SceneManager.push(Scene_Gallery);
};

	
	
	
})();