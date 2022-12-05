//=============================================================================
// FPS 控制器 v1.1
// 最後更新：2016/3/5
// 有問題請至：http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================
/*:
 * @plugindesc FPS控制器，可任意調整畫面更新速度
 * @author STILILA

 * @param 預設FPS
 * @desc 設定平時維持的FPS
 * @default 60
 
 * @help 
 *腳本：
 *     STILILA.FPS.changeFps(FPS[, 變更持續時間(單位0.1秒)])
 *變更FPS，持續時間結束後會慢慢恢復至之前的FPS
 *持續時間如果不輸入，視為永久變化(v1.1)
 *永久變化後，使用有時限的fps變更結束時，會回到變化後的fps
 *
 * 例1：STILILA.FPS.changeFps(80,50)
 * 　　 fps變為80、持續5秒
 * 例2：STILILA.FPS.changeFps(30)
 * 　　 fps變為30、永久持續
 *
 *腳本：
 *     STILILA.FPS.clear()
 *立即恢復插件預設值
 *
 *
 *其實因為效能較不好，比較適合短時間變化，比方說慢動作效果
 *因MV 1.1.0寫法的關係，這版本的fps最小值為5
 *
 */
 
// 全域變量宣告
var STILILA = STILILA || {};

// 插件管理器的設定項
fps_parameters = PluginManager.parameters('FPScontroller');
	
STILILA.FPS = {};
STILILA.FPS.plugin_default = Number(fps_parameters['預設FPS'] || 60);
STILILA.FPS['defaultFps'] = STILILA.FPS.plugin_default; // 常時維持的FPS
STILILA.FPS['nowFps'] = STILILA.FPS.plugin_default;     // 目前的FPS
STILILA.FPS._nowFps = STILILA.FPS.plugin_default;     // 目前的FPS(對應主程式1.1.0用)
STILILA.FPS['lockTime'] = 0;                          // 變更持續時間 (單位0.1秒，過後會恢復成常時)
STILILA.FPS['lockStart'] = 0;  

delete fps_parameters;
 
 

 
// 修改畫面更新方式
SceneManager.requestUpdate = function() {
	
    if (!this._stopped) {
		// 如果預設fps60且目前也是60，就用原方法
		if (STILILA.FPS['defaultFps'] === 60 && STILILA.FPS['nowFps'] === 60) {
			requestAnimationFrame(this.update.bind(this));
		} else {
			this._timeoutID = setTimeout(this.update.bind(this), 1000/STILILA.FPS['nowFps']);
		}
		
		// FPS調整
		if (STILILA.FPS['nowFps'] !== STILILA.FPS['defaultFps'] && STILILA.FPS['lockTime'] > 0){
			if (STILILA.FPS['lockTime'] < (Date.now() - STILILA.FPS['lockStart'])) {
				// 目前 > 預設
				if (STILILA.FPS['nowFps'] > STILILA.FPS['defaultFps']) {
					STILILA.FPS['nowFps']--;
					return;
				}
				// 目前 < 預設
				if (STILILA.FPS['nowFps'] < STILILA.FPS['defaultFps']) {
					STILILA.FPS['nowFps']++;
				}	
		    }
		
		}
		//setInterval(this.update.bind(this), 1000/60);
    }
};


// 改變fps(lockTime = 持續時間(單位0.1秒))
STILILA.FPS.changeFps = function(fps, locktime){
	var fps = (fps > 5) ? fps : 5;
	var locktime = locktime || 0;
	STILILA.FPS['nowFps'] = fps;
	if (locktime > 0) {
		STILILA.FPS['lockTime'] = locktime*100;
		STILILA.FPS['lockStart'] = Date.now();
	} else {
		STILILA.FPS['defaultFps'] = fps;
		STILILA.FPS['lockTime'] = 0;
	}
};

STILILA.FPS.clear = function(){
	STILILA.FPS['lockTime'] = 0;
	STILILA.FPS['lockStart'] = 0; 
	STILILA.FPS['defaultFps'] = STILILA.FPS['nowFps'] = STILILA.FPS.plugin_default;
};



Object.defineProperty(STILILA.FPS, 'nowFps', {
    get: function() {
        return this._nowFps;
    },
    set: function(value) {
        if (this._nowFps !== value) {
            this._nowFps = value;
            SceneManager._deltaTime = 1.0 / value; // 對應主程式1.1.0用
        }
    },
    configurable: true,
	enumerable: true
});


Scene_Base.prototype.fadeOutAll = function() {
    var time = this.slowFadeSpeed() / STILILA.FPS['nowFps'];
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
};

Scene_Map.prototype.encounterEffectSpeed = function() {
    return STILILA.FPS['nowFps'];
};

Game_System.prototype.playtime = function() {
    return Math.floor(Graphics.frameCount / STILILA.FPS['nowFps']);
};

Game_Timer.prototype.seconds = function() {
    return Math.floor(this._frames / STILILA.FPS['nowFps']);
};
