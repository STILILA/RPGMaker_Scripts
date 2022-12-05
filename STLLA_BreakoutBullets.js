//=============================================================================
// 打磚塊飛道插件
//=============================================================================

/*:
 * @plugindesc 打磚塊系統的飛道管理(進階者用)
 * @help 
 * 管理自製飛道用，可在此設置多樣化的飛道
 *
 * ＜必要插件＞
 * STLLA_ScriptCore v1.2(共通前置)：
 *    https://www.dropbox.com/s/1syi7sk0psybhb7/STLLA_ScriptCore.js?dl=0    
 * STLLA_BreakoutMain(系統本體)：
 *    https://www.dropbox.com/s/0xt6zk9nptfglpt/STLLA_BreakoutStage.js?dl=0
 * STLLA_BreakoutSkill(技能插件)：
 *    https://www.dropbox.com/s/ygq550fhi1cizmy/STLLA_BreakoutSkill.js?dl=0
 *
 *
 *＜預設變數＞
 * this.bitmapW、this.bitmapH   // 裁切圖片的寬、高
 * this.bitmapRow               // 裁切圖片的橫向格數
 * this.x、this.y               // X、Y座標
 * this.sprite.anchor.x         // 圖片X原點(0.0~1.0)，預設0.5
 * this.sprite.anchor.y         // 圖片Y原點(0.0~1.0)，預設0.5
 * this.speedX、this.speedY     // X、Y移動速度
 * this.dirX、this.dirY         // X、Y移動方向
 * this.atk                     // 攻擊力
 * this.throughBlock            // 貫通磚塊判定
 * this.scene                   // 目前Scene(Scene_Breakout)
 * this.root                    // 根使用者(Game_Battler對象)
 * this.user                    // 使用者(Game_Battler、Game_BreakoutBullet對象)
 *
 * this.frameNumber             // Frame號
 * this.frameTime               // Frame經過時間
 * this.animeName               // 動畫名稱
 * this.animeTime               // 動畫經過時間
 *
 *＜預設是空白，需自行定義內容的方法＞
 * initCustom(user,x,y)                // 自訂義初始化
 * setAnimes()                         // 動畫表設置
 * updateCommonA()                     // 定期更新A(不受暫停系效果影響)
 * updateCommonB()                     // 定期更新B(受暫停系效果影響)
 * collideBall(ball)                   // 撞到球。 ball：球對象(Game_BreakoutBall)
 * collideBlock(block)                 // 撞到磚塊。 block：磚塊對象(Game_BreakoutBlock)
 * collidePaddle(paddle)               // 撞到板子。 paddle：板子對象(Game_BreakoutPaddle)
 * collideWall(pos)                    // 撞到牆 (pos：up(上)、down(下)、left(左)、right(右))
 *
 *＜預設常用方法＞
 * this.loadBitmap(filename)                // 載入圖片
 * this.setPicture(number)                  // 設定圖片編號
 * this.destorySelf()                       // 消除自己
 * this.setAtkRects([[rect1],[rect2],...])  // 設定攻擊判定塊([[x1,y1,w1,h1], [x2,y2,w2,h2],...])，0為消去
 * this.attackBlock(block[, noCombo])       // 攻擊磚塊一次，block為磚塊對象，可額外指定noCombo，noCombo為true的時候不計算Combo。通常在 collideBlock 方法內使用
 * this.changeAnime(name[, frame])          // 跳至名稱為 name 的動畫，可額外指定frame(未指定為0) (※切換動畫時，碰撞判定會重置)
 * this.updateAnime(frame)                  // 跳至指定 frame
 *
 *＜動畫表參數＞
 * pic                 // (必須) 圖片號
 * wait                // (必須) 此Frame的延遲值
 * next                // (必須) Number：下個Frame號／Array：[name[, frame]]，變更為指定動畫／String：執行同名方法(不過不能執行帶參數的方法)
 * atkRect             // 攻擊判定塊([[x1,y1,w1,h1], [x2,y2,w2,h2],...])，0為消去。同this.setAtkRects()
 * atkReset            // 消除已攻擊判定，可用來進行連擊
 * atkPower            // 變更攻擊力
 * se                  // 播放音效 ([name, pitch, volume])
 * animation           // 播放指定ID的動畫
 * speedX、speedY      // 變更X、Y速度
 * dirX、dirY          // 變更X、Y方向
 * throughBlock        // 貫通磚塊判定 (true／false)
 *
 *
 * 詳細說明請至：http://home.gamer.com.tw/creationDetail.php?sn=3299125
 
 */

// 必須腳本檢測
if (typeof(STILILA) == 'undefined') {alert('未安裝STLLA_ScriptCore.js') ; window.close();}
if (!STILILA.BO) {alert('未安裝STLLA_BreakoutMain.js') ; window.close();}
if (typeof(Game_BreakoutBullet) == 'undefined') {alert('未安裝STLLA_BreakoutSkill.js') ; window.close();}
 
// =========================================================================================================
// ■ BulletFire
//   火球彈
// =========================================================================================================
STILILA.BO.BulletFire = function BulletFire() {
	this.initialize.apply(this, arguments);
}
STILILA.BO.BulletFire.prototype = Object.create(Game_BreakoutBullet.prototype); // 繼承Game_BreakoutBullet
STILILA.BO.BulletFire.prototype.constructor = STILILA.BO.BulletFire;
// ----------------------------------------------
// ● 自定義初始化
//   user：使用者(Game_BreakoutBullet、Game_Battler)
//   x、y：生成時的x、y(視板子位置而定)
// ----------------------------------------------
STILILA.BO.BulletFire.prototype.initCustom = function(user, x, y) {
	// (必須)載入圖片 & 記錄快取Key
	this.loadBitmap('fireball');
	// (必須)裁切圖片的寬、高、橫向格數
	this.bitmapW = 50;  
	this.bitmapH = 50;
	this.bitmapRow = 3; 
	// 設定初期判定塊
	this.setAtkRects([[-10,-25,21,50]]);
	// 設定運動能力
	this.speedX = 0;
	this.speedY = 7;
	this.atk = 0;
	// 設定圖片
	this.setPicture(0);

}
// ----------------------------------------------
// ● 設置動畫表
// ----------------------------------------------
STILILA.BO.BulletFire.prototype.setAnimes = function() {
	// 飛行
	this.animes['normal'] = [];
	this.animes['normal'][0] = {pic: 0, wait: 6, next: 1};
	this.animes['normal'][1] = {pic: 1, wait: 6, next: 2};
	this.animes['normal'][2] = {pic: 2, wait: 6, next: 0};
	// 爆炸
	this.animes['explosion'] = [];
	this.animes['explosion'][0] = {pic: -1, wait: 4, next:1, atkPower: 2, atkRect:[[-45,-65,90,90]], animation: 14, speedY: 0};
	this.animes['explosion'][1] = {pic: -1, wait: 36, next:'destorySelf', atkRect: 0};
}
// ----------------------------------------------
// ● 撞到磚塊 
//   block：磚塊對象(Game_BreakoutBlock)
// ----------------------------------------------
STILILA.BO.BulletFire.prototype.collideBlock = function(block) {
	// 飛行時，變為爆炸
	if (this.animeName === 'normal') {
		this.changeAnime('explosion');
		return;
	// 爆炸時
	} else {
		// 磚塊破壞
		this.attackBlock(block, true); // 破壞磚塊，但不計算連擊
	}
}


// =========================================================================================================
// ■ TimeBomb
//   定時炸彈
// =========================================================================================================
STILILA.BO.TimeBomb = function TimeBomb() {
	this.initialize.apply(this, arguments);
}
STILILA.BO.TimeBomb.prototype = Object.create(Game_BreakoutBullet.prototype); // 繼承Game_BreakoutBullet
STILILA.BO.TimeBomb.prototype.constructor = STILILA.BO.TimeBomb;
// ----------------------------------------------
// ● 自定義初始化
//   user：使用者(Game_BreakoutBullet、Game_Battler)
// ----------------------------------------------
STILILA.BO.TimeBomb.prototype.initCustom = function(user, x, y) {
	// (必須)載入圖片 & 記錄快取Key
	this.loadBitmap('timebomb');
	// (必須)裁切圖片的寬、高、橫向格數
	this.bitmapW = 30;
	this.bitmapH = 30;
	this.bitmapRow = 3;
	// 設定初期判定塊
	this.setAtkRects([[-13,-13,26,26]]);
	// 設定運動能力
	this.speedX = 0;
	this.speedY = 6;
	this.atk = 0;
	// 設定目前圖片
	this.setPicture(0);
	// 專用變數：記憶黏著的目標
	this.target = null; 
}
// ----------------------------------------------
// ● 設置動畫表
// ----------------------------------------------
STILILA.BO.TimeBomb.prototype.setAnimes = function() {
	// 飛行
	this.animes['normal'] = [];
	this.animes['normal'][0] = {pic: 0, wait: -1, next: 0};
	
	// 黏著&倒數
	this.animes['countdown'] = [];
	this.animes['countdown'][0] = {pic: 0, wait: 60, next: 1, se: ['Computer', 110, 95], speedY: 0}; // 倒數3
	this.animes['countdown'][1] = {pic: 1, wait: 60, next: 2, se: ['Computer', 110, 95]}; // 倒數2
	this.animes['countdown'][2] = {pic: 2, wait: 60, next: ['explosion'], se: ['Computer', 110, 95]}; // 倒數1
	
	// 爆破
	this.animes['explosion'] = [];
	this.animes['explosion'][0] = {pic: -1, wait: 4, next:1, atkPower: 5, atkRect:[[-80,-60,160,100], [-60,-90,120,150]], animation: 15};
	this.animes['explosion'][1] = {pic: -1, wait: 36, next:'destorySelf', atkRect: 0};
}

// ----------------------------------------------
// ● 撞到球 
//   ball：球對象(Game_BreakoutBall)
// ----------------------------------------------
STILILA.BO.TimeBomb.prototype.collideBall = function(ball) {
	// 倒數快進
	if (this.animeName === 'countdown') {
		// 球反彈
		if (!ball.smashing) {
			ball.dirX *= -1;
			ball.dirY *= -1;
		}
		switch (this.frameNumber) {
		case 0:
			this.updateAnime(1);
			break;
		case 1:
			this.updateAnime(2);
			break;
		case 2:
			this.changeAnime('explosion');
			break;
		}
	}
}
// ----------------------------------------------
// ● 撞到磚塊 
//   block：磚塊對象(Game_BreakoutBlock)
// ----------------------------------------------
STILILA.BO.TimeBomb.prototype.collideBlock = function(block) {
	// 黏著
	if (this.animeName === 'normal') {
		this.changeAnime('countdown');
		this.target = block;
		return;
	// 引爆	
	} else if (this.animeName === 'explosion') {
		// 磚塊破壞
		this.attackBlock(block, true); // 攻擊磚塊，但不計算連擊
		this.target = null;
	}
}
// ----------------------------------------------
// ● 定期更新B(受暫停系效果影響)
// ----------------------------------------------
STILILA.BO.TimeBomb.prototype.updateCommonB = function() {
	if (this.target && this.target.hp === 0) { // 目標HP為0就馬上爆炸
		this.changeAnime('explosion');
		this.target = null;
	}
}
// ----------------------------------------------
// ● 報銷
// ----------------------------------------------
STILILA.BO.TimeBomb.prototype.destorySelf = function() {
	this.target = null;
	Game_BreakoutBullet.prototype.destorySelf.call(this); // super
}