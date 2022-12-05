//=============================================================================
// 漸變圖形 v1.2
// 最後更新：2017/06/10
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================
/*:
 * @plugindesc 漸變圖形 v1.2
 * @author STILILA
 *
 * @param Path
 * @desc 設定放漸變圖的路徑
 * @default img/transitions/
 
 * @param Default Fadeout
 * @desc 場所移動時的淡出圖形
 * @default 
 
 * @param Default Fadein
 * @desc 場所移動時的淡入圖形
 * @default 
 
 * @param Default Fade Mode
 * @desc 0：淡出+淡入、0以外：只有淡入。(預設：0)
 * @default 0
 
 * @help 重現舊版(XP~VA)漸變圖形功能，需安裝STLLA_ScriptCore.js

 * ＜必要插件＞
 * STLLA_ScriptCore v1.2(共通前置)
 *  https://www.dropbox.com/s/1syi7sk0psybhb7/STLLA_ScriptCore.js?dl=0    
 *
 * ＜更新履歷＞
 * v1.2：
 *  對應主程式v1.5.0
 * v1.1：
 *  對應主程式v1.31
 *  插件參數英文化

 *  ====================================================
 * ＜地圖淡入＞
 *  插件指令：TransPic mapFadeIn 檔案名稱
 *  腳本：$gameTemp.transMapFadeIn = 檔案名稱
 
 * ＜地圖淡出＞
 *  插件指令：TransPic mapFadeOut 檔案名稱
 *  腳本：$gameTemp.transMapFadeOut = 檔案名稱
 
 * ＜淡入淡出模式＞
 *  插件指令：TransPic mode 數字
 *  腳本：$gameTemp.transMode = n
 
 
 * 使用例：
 *  TransPic mapFadeIn trans1          // 地圖淡入圖形為trans1
 *  TransPic mapFadeIn                 // 不使用地圖淡入圖形
 *  $gameTemp.transMapFadeIn = 'trans1'
 *  $gameTemp.transMapFadeIn = '' 
 *  TransPic mode 1  // 漸變模式變更為只有淡入 
 
 *  ====================================================
 *  ＜畫面凍結＞
 *   腳本：Graphics.freeze()
 *   插件指令：GraphicsFreeze
 
 *  ＜畫面漸變(參數皆可省略)＞
 *   腳本：Graphics.transition(畫格, 檔名)
 *   插件指令：GraphicsTransition 畫格 檔名 
 
 *  使用例：
 *   腳本：Graphics.transition(30, 'trans1')
 *   插件指令：GraphicsTransition 30 trans1 
 *
 */
 
// 檢查
if (typeof(STILILA) === 'undefined') {alert('未安裝STLLA_ScriptCore.js') ; window.close();}

STILILA.transPic = {};
STILILA.transPic.path = (PluginManager.parameters('STLLA_Transition')['Path'] || 'img/transitions/');


(function() {

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === 'TransPic') {
		switch (args[0]) {
		case 'mapFadeIn':
			$gameTemp.transMapFadeIn = args[1];
			break;
		case 'mapFadeOut':
			$gameTemp.transMapFadeOut = args[1];
			break;
		case 'battleFadeIn':
			console.log('未實裝');
			return;
			$gameTemp.transBattleFadein = args[1];
			break;
		case 'battleFadeOut':
			console.log('未實裝');
			return;
			$gameTemp.transBattleFadeOut = args[1];
			break;
		case 'mode':
			$gameTemp.transMode = args[1];
			break;
		}
	}
	if (command === 'GraphicsFreeze') {
		Graphics.freeze();
	}
	if (command === 'GraphicsTransition') {
		Graphics.transition(Number(args[0]), args[1]);
	}
};
	
})();

// =========================================================================================================
// ■ Graphics
// =========================================================================================================
// ----------------------------------------------
// ● Graphics.freeze() 
//   凍結畫面，實際上就是拍個照放在最前面
// ----------------------------------------------
Graphics.freeze = function() {
	SceneManager._freezeBitmap = SceneManager.snap();
	SceneManager._scene.startFreeze(SceneManager._freezeBitmap);
};
// ----------------------------------------------
// ● Graphics.transition(時間, 檔名) 
//   畫面漸變
// ----------------------------------------------
Graphics.transition = function(time, filename) {
	if (filename) {
		SceneManager._transBitmap = ImageManagerST.loadTransition(filename);
		SceneManager._transBitmap._loadListeners = [];
		SceneManager._transName = filename;
	}
    if (time < 1) {time = 1;}
	SceneManager._freezeCountMax = SceneManager._freezeCount = time || 24;
	SceneManager._scene.addChild(SceneManager._freezeSprite);
};


// =========================================================================================================
// ■ Bitmap
// =========================================================================================================
// ----------------------------------------------
// ● 取得Bitmap資訊
// ----------------------------------------------
Bitmap.prototype.getBitmapData = function() {
    var data = this._context.getImageData(0, 0, this.width, this.height);
    return data;
};

// =========================================================================================================
// ■ ImageManagerST
// =========================================================================================================
// ----------------------------------------------
// ● 讀取漸變圖型路徑
// ----------------------------------------------
ImageManagerST.loadTransition = function(filename) {
	// 檢查副檔名是否為 jpg
	var	isJpg = /.jpg/.test(filename);
	// 消去副檔名
	var filename = filename.replace(/.png/, '');
	filename = filename.replace(/.jpg/, '');
	return this.loadBitmap(STILILA.transPic.path, filename, 0, true, isJpg);
};



// =========================================================================================================
// ■ SceneManager
// =========================================================================================================
STILILA.SceneManager = STILILA.SceneManager || {}
STILILA.SceneManager.init = SceneManager.initialize;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
SceneManager.initialize = function() {
    STILILA.SceneManager.init.call(this); //
	this._freezeBitmap = null;
	this._freezeSprite = null;
	this._transBitmap = null;
	this._transName = null;
	this._freezeCount = 0;
	this._freezeCountMax = 0;
};
// ----------------------------------------------
// ● SceneManager.renderScene() 
// ----------------------------------------------
SceneManager.renderScene = function() {
	if (this._freezeBitmap && this._freezeCountMax > 0) { // 新分歧
		this.updateFreeze();
		Graphics.render(this._scene);
	} else if (this.isCurrentSceneStarted()) {
        Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
};
// ----------------------------------------------
// ● SceneManager.updateScene() 
// ----------------------------------------------
SceneManager.updateScene = function() {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted() && this._freezeCountMax == 0) {
            this._scene.update();
        }
    }
};


// ----------------------------------------------
// ● SceneManager.updateFreeze() 
// ----------------------------------------------
SceneManager.updateFreeze = function() {
	// 有漸變圖的情況
	if (this._transBitmap) {
		if (this._transBitmap.isReady()) {
			this._freezeCount--;
			var transData = this._transBitmap.getBitmapData();
			var freezeData = this._freezeBitmap.getBitmapData();
			for (var i = 0; i < transData.data.length; i += 4) {
				if ((255 - transData.data[i]) >= (255 * this._freezeCount / this._freezeCountMax)) {
					//alpha = (255 - transData.data[i]) //* (this._freezeCount / this._freezeCountMax);
					//alpha = (transData.data[i]) //* (this._freezeCount / this._freezeCountMax);
					freezeData.data[i+3] = 0;
				}
			}	
			this._freezeBitmap._context.putImageData(freezeData,0,0);
			this._freezeBitmap._setDirty();
		}
	// 沒有的情況
	} else {
		this._freezeCount--;
		this._freezeSprite.opacity = 255 * (this._freezeCount / this._freezeCountMax);
	}
	// 處理完畢時消除漸變圖
	if (this._freezeCount == 0) {
		this._freezeSprite.opacity = 0;
		this._freezeCount = this._freezeCountMax = 0;
		//this._freezeBitmap.clear();
		this._freezeBitmap = null;
		this._scene._fadeDuration = 0;
		if (this._transBitmap) {
			ImageManagerST.cacheRemove(this._transBitmap.cacheKey);
			this._transBitmap = null; 
		} 
	}
};

// =========================================================================================================
// ■ Game_Temp
// =========================================================================================================
STILILA.Game_Temp = STILILA.Game_Temp || {};

STILILA.Game_Temp.initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	STILILA.Game_Temp.initialize.call(this);
	this.transMapFadeIn = (PluginManager.parameters('STLLA_Transition')['Default Fadein'] || '');
	this.transMapFadeOut = (PluginManager.parameters('STLLA_Transition')['Default Fadeout'] || '');
	this.transMode = (Number(PluginManager.parameters('STLLA_Transition')['Default Fade Mode']) || 0);
	this.transBattleFadeIn = null;
	this.transBattleFadeOut = null;
};

// =========================================================================================================
// ■ Scene_Base
// =========================================================================================================
// ----------------------------------------------
// ● Scene_Base.startFreeze() 
// ----------------------------------------------
Scene_Base.prototype.startFreeze = function(bitmap) {
	if (!SceneManager._freezeSprite) {
		SceneManager._freezeSprite = new Sprite();	
	}
	this.addChild(SceneManager._freezeSprite);

	SceneManager._freezeSprite.bitmap = SceneManager._freezeBitmap;
	SceneManager._freezeSprite.opacity = 255;
};


// =========================================================================================================
// ■ Scene_Map
// =========================================================================================================
STILILA.Scene_Map = STILILA.Scene_Map || {};

// ----------------------------------------------
// ● 離開地圖畫面 
// ----------------------------------------------
Scene_Map.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    if (!SceneManager.isNextScene(Scene_Battle)) {
        this._spriteset.update();
        this._mapNameWindow.hide();
        SceneManager.snapForBackground();
		Graphics.freeze(); // 追加部分
    }
    $gameScreen.clearZoom();
};

// ----------------------------------------------
// ● 開始淡入 (needsFadeIn()條件成立(預設讀檔結束、戰鬥結束)／場所移動時才執行)
// ----------------------------------------------
Scene_Map.prototype.startFadeIn = function(duration, white) {
	// 場所移動的情況
	if (this._transfer) {
		this._fadeDuration = duration || 30;
		
		this.updateChildren(); // 先update一次各Sprite讓行走圖正常

		if ($gameTemp.transMapFadeIn) {
			Graphics.transition(this._fadeDuration*1.5, $gameTemp.transMapFadeIn);
		} else {
			Graphics.transition(this._fadeDuration);
		}
	// 符合needsFadeIn()條件的情況
	} else if (this.needsFadeIn()) {
		// 調用父類原方法
		Scene_Base.prototype.startFadeIn.call(this, duration, white);
	}
};
// ----------------------------------------------
// ● 開始淡出
// ----------------------------------------------
STILILA.Scene_Map.startFadeOut = Scene_Map.prototype.startFadeOut;
Scene_Map.prototype.startFadeOut = function(duration, white) {
	if (SceneManager.isNextScene(Scene_Map)) {
		// 淡入淡出模式為0的情況
		if ($gameTemp.transMode == 0) {
			STILILA.Scene_Map.startFadeOut.call(this);
			Graphics.freeze();
			this._fadeSprite.opacity = 255;
			count = this._fadeDuration;
			if ($gameTemp.transMapFadeOut) {
				Graphics.transition(count*1.5, $gameTemp.transMapFadeOut);
			} else {
				Graphics.transition(count);
			}
		}
	} else {
		STILILA.Scene_Map.startFadeOut.call(this);
	}
};
// ----------------------------------------------
// ● 更新漸變
// ----------------------------------------------
Scene_Map.prototype.updateFade = function() {
    if (this._fadeDuration > 0) {
        var d = this._fadeDuration;
        if (this._fadeSign > 0) {
           if (this._fadeSprite) {this._fadeSprite.opacity -= this._fadeSprite.opacity / d;} // 追加 this._fadeSprite 存在條件
        } else {
			if (this._fadeSprite) {this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;} // 追加 this._fadeSprite 存在條件
        }
        this._fadeDuration--;
    }
};

