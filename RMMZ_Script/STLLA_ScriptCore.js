//=============================================================================
// 核心腳本MZ v1.0
// 增加自製插件的共通前置，必須放在所有STLLA系列插件上方
// 最後更新：2021/08/09
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================
/*:
 * @plugindesc STLLA共通腳本MZ v1.0
 * @author STILILA
 *
 
 * @help 因為是前置，必須放在所有個人自製腳本上方
 * @target MZ
 */


var STILILA = STILILA || {};

// ----------------------------------------------
// ● Array對象.remove(值)
//   刪除指定元素
//   MV已內建，移除
// ----------------------------------------------


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
//   官方一直改太蛋疼，只好做個專屬的
// =========================================================================================================

function ImageManagerST() {
    throw new Error('This is a static class');
}
ImageManagerST._cache = {};  // 所以MV後來那個CacheMap到底...
ImageManagerST._system = {};
ImageManagerST._emptyBitmap = new Bitmap(1, 1);

// ----------------------------------------------
// ● ImageManagerST.isReady()
//   載入失敗的圖刪除，配合Graphics.resumption()
// ----------------------------------------------
ImageManagerST.isReady = function() {
    for (const cache of [this._cache, this._system]) {
        for (const url in cache) {
            const bitmap = cache[url];
            if (bitmap.isError()) {
                this.throwLoadError(bitmap);
				delete this._cache[url];  // 刪除有問題的圖
            }
            if (!bitmap.isReady()) {
                return false;
            }
        }
    }
    return true;
};
// ----------------------------------------------
// ● (RM系統用)讀取Bitmap
//   isJPG：副檔名是否為jpg
//   註：MZ的改色相變成Sprite負責
// ----------------------------------------------
ImageManagerST.loadBitmap = function(folder, filename, isJPG) {
    if (filename) {
        const url = folder + Utils.encodeURI(filename) + (isJPG ? ".jpg" : ".png");
        return this.loadBitmapFromUrl(url);
    } else {
        return this._emptyBitmap;
    }
};
// ----------------------------------------------
// ● 真正讀取Bitmap的方法
// ----------------------------------------------
ImageManagerST.loadBitmapFromUrl = function(url) {
    const cache = url.includes("/system/") ? this._system : this._cache;
    if (!cache[url]) {
        cache[url] = Bitmap.load(url);
		cache[url].cacheKey = url; // 記憶快取key
    }
    return cache[url];
};
// ----------------------------------------------
// ● 用讀取路徑取得快取的Key(清快取比對用)
// ----------------------------------------------
ImageManagerST.getCacheKey = function(folder, filename) {
	const isJPG = /.jpg/.test(filename);
	// 消去副檔名
    filename = filename.replace(/.png/, '');
	filename = filename.replace(/.jpg/, '');
	const key = folder + Utils.encodeURI(filename) + (isJPG ? ".jpg" : ".png");
	return key;
}
// ----------------------------------------------
// ● 移除指定快取
// ----------------------------------------------
ImageManagerST.cacheRemove = function(key) {
	if (key in this._cache) {
		this._cache[key].destroy();
		delete this._cache[key];
	}
};
// ----------------------------------------------
// ● clear
// ----------------------------------------------
ImageManagerST.clear = function() {
    const cache = this._cache;
    for (const url in cache) {
        cache[url].destroy();
    }
    this._cache = {};
};
// ----------------------------------------------
// ● 拋出讀失敗的Error
// ----------------------------------------------
ImageManagerST.throwLoadError = function(bitmap) {
    const retry = bitmap.retry.bind(bitmap);
    throw ["LoadError", bitmap.url, retry];
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



