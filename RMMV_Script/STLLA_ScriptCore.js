//=============================================================================
// 核心腳本 v1.3
// 增加自製插件的共通前置，必須放在所有STLLA系列插件上方
// 最後更新：2021/08/15
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================
/*:
 * @plugindesc S.T.核心腳本 v1.3
 * @author STILILA
 *
 * @param Follow Mouse
 * @desc 讓選單游標跟隨滑鼠(1：開、0：關)
 * @default 1
 
 * @help 因為是前置，必須放在所有個人自製腳本上方
 *
 * ＜更新履歷＞
 * v1.3：
 *   1.修改錯誤的方法名稱
 * v1.2：
 *   1.對應主程式v1.5.0
 *   2.新增ImageManagerST
 * v1.1：
 *   1.對應主程式v1.31
 *   2.修正跟隨滑鼠功能啟動時，滑鼠在畫面內會死咬著選項的問題
 */


 
var STILILA = STILILA || {};


// ----------------------------------------------
// ● Array對象.remove(值)
//   刪除指定元素
// ----------------------------------------------
Object.defineProperty(Array.prototype, 'remove', {
    value: function(val){
		var index = this.indexOf(val);
		if (index != -1) { 
			this.splice(index, 1); 
			return this;
		} else {
			return null;
		}
	},
	configurable: true
});


// =========================================================================================================
// ■ Graphics
// =========================================================================================================
// ----------------------------------------------
// ● Graphics.resumption() 
//   求方便用的方法，從錯誤狀態中恢復、再開始 (必須先解決問題)
// ----------------------------------------------
Graphics.resumption = function() {
	SceneManager._stopped = false;
	SceneManager.requestUpdate();
    if (this._canvas) {
        this._canvas.style.opacity = 1;
        this._canvas.style.filter = '';
        this._canvas.style.webkitFilter = '';
    }
	if (this._errorPrinter) {
		this._errorPrinter.innerHTML = '';
	}
};


// =========================================================================================================
// ■ ImageManagerST
//   腳釧一直改太蛋疼，只好做個專屬的
// =========================================================================================================

function ImageManagerST() {
    throw new Error('This is a static class');
}
ImageManagerST.cache = new CacheMap(ImageManagerST);
// ----------------------------------------------
// ● ImageManagerST.isReady()
//   載入有問題的圖刪除，配合Graphics.resumption()
// ----------------------------------------------
ImageManagerST.isReady = function() {
    for (var key in this.cache._inner) {
        var bitmap = this.cache._inner[key].item;
        if (bitmap.isError()) {
			delete this.cache._inner[key];  // 刪除有問題的屬性
            throw new Error('Failed to load: ' + bitmap.url);
        }
        if (!bitmap.isReady()) {
            return false;
        }
    }
    return true;
};
// ----------------------------------------------
// ● 讀取Bitmap
//   isJpg：是否為jpg
// ----------------------------------------------
ImageManagerST.loadBitmap = function(folder, filename, hue, smooth, isJpg) {
	if (filename) {
		if (isJpg) {
			var path = folder + encodeURIComponent(filename) + '.jpg';
		} else {
			var path = folder + encodeURIComponent(filename) + '.png';
		}	
		var bitmap = this.loadNormalBitmap(path, hue || 0);
		bitmap.smooth = smooth;
		var hue = hue || 0;
		bitmap.cacheKey = path + ':' + hue; // 記憶快取key
		return bitmap;
	} else {
		return this.loadEmptyBitmap();
	}
};

// ----------------------------------------------
// ● 一般讀取Bitmap
// ----------------------------------------------
ImageManagerST.loadNormalBitmap = function(path, hue) {
    var key = path + ':' + hue;
    var bitmap = this.cache.getItem(key);
    if (!bitmap) {
        bitmap = Bitmap.load(path);
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
        this.cache.setItem(key, bitmap);
    }
    return bitmap;
};
// ----------------------------------------------
// ● 讀取空Bitmap
// ----------------------------------------------
ImageManagerST.loadEmptyBitmap = function() {
    var empty = this.cache.getItem('empty');
    if (!empty) {
        empty = new Bitmap();
        this.cache.setItem('empty', empty);
    }
    return empty;
};
// ----------------------------------------------
// ● 取得快取的Key(清快取比對用)
// ----------------------------------------------
ImageManagerST.getCacheKey = function(folder, filename, hue) {
	var hue = hue || 0;
	var	isJpg = /.jpg/.test(filename);
	// 消去副檔名
	var filename = filename.replace(/.png/, '');
	filename = filename.replace(/.jpg/, '');
	if (isJpg) {
		var path = folder + encodeURIComponent(filename) + '.jpg';
	} else {
		var path = folder + encodeURIComponent(filename) + '.png';
	}
	path = path + ':' + hue;
	return path;
}
// ----------------------------------------------
// ● 移除指定快取
// ----------------------------------------------
ImageManagerST.cacheRemove = function(key) {
	if (key in this.cache._inner) {delete this.cache._inner[key];}
};
// ----------------------------------------------
// ● clear
// ----------------------------------------------
ImageManagerST.clear = function() {
    this.cache.clear();
};


// =========================================================================================================
// ■ AudioManager
// =========================================================================================================
// ----------------------------------------------
// ● 暫停BGM
// ----------------------------------------------
AudioManager.pauseBGM = function() {
    if (this._bgmBuffer && this._currentBgm) {
        this._currentBgm.pos = this._bgmBuffer.seek();
        this._bgmBuffer.stop();
    }
};
// ----------------------------------------------
// ● 重開BGM
// ----------------------------------------------
AudioManager.reopenBGM = function() {
	if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
		this._bgmBuffer.play(true, this._currentBgm.pos);
	}
};


if (Number(PluginManager.parameters('STLLA_ScriptCore')['Follow Mouse'])) {
	
	(function() {	
		// =========================================================================================================
		// ■ TouchInput   觸控、滑鼠的類
		// =========================================================================================================
		// ----------------------------------------------
		// ● 數據清除
		// ----------------------------------------------
		var _TouchInput_clear = TouchInput.clear;
		TouchInput.clear = function() {
			_TouchInput_clear.call(this);
			this.nowX = 0;
			this.nowY = 0;
		}

		// ----------------------------------------------
		// ● 滑鼠移動
		// ----------------------------------------------
		var _TouchInput_onMouseMove = TouchInput._onMouseMove;
		TouchInput._onMouseMove = function(event) {
			_TouchInput_onMouseMove.call(this, event);
			this.nowX = Graphics.pageToCanvasX(event.pageX);
			this.nowY = Graphics.pageToCanvasY(event.pageY);
		};

		// =========================================================================================================
		// ■ Window_Selectable
		// =========================================================================================================
		// ----------------------------------------------
		// ● 初始化
		// ----------------------------------------------
		var _Window_Selectable_initialize = Window_Selectable.prototype.initialize;
		Window_Selectable.prototype.initialize = function(x, y, width, height) {
			_Window_Selectable_initialize.call(this, x, y, width, height);
			this.mouseNowX = this.canvasToLocalX(TouchInput.nowX);
			this.mouseNowY = this.canvasToLocalY(TouchInput.nowY);	
		};
		// ----------------------------------------------
		// ● 定期更新觸控／滑鼠
		// ----------------------------------------------
		var _Window_Selectable_prototype_processTouch = Window_Selectable.prototype.processTouch;
		Window_Selectable.prototype.processTouch = function() {
			// 更新滑鼠
			if (this.isOpenAndActive()) {
				var lastIndex = this.index();
				var x = this.canvasToLocalX(TouchInput.nowX);
				var y = this.canvasToLocalY(TouchInput.nowY);
				var hitIndex = this.hitTest(x, y);
				if (hitIndex >= 0 && this.isCursorMovable() && (this.mouseNowX != x || this.mouseNowY != y)) {
					this.select(hitIndex);
					this.mouseNowX = x;
					this.mouseNowY = y;
					// 播放游標移動音效
					//if (this.index() !== lastIndex) {
						//SoundManager.playCursor();
					//}
				}
			}
			_Window_Selectable_prototype_processTouch.call(this);
		};
	})();
	
};

