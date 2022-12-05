//=============================================================================
// 打磚塊技能插件 v1.1
// 最後更新：2017/06/10
// http://home.gamer.com.tw/homeindex.php?owner=qootm2

//=============================================================================

/*
備忘：

 1.戰鬥插件(技能、狀態...)
   我方技能：分身、射擊、地震、重新發球、大爆炸、防護罩、球／板性能變更...
   敵方技能：磚塊修復、磚塊短暫無敵、其他能用的我方技能
   狀態：毒、麻痺
 
*/

/*:
 * @plugindesc 打磚塊系統的技能插件 v1.1
 * @author STILILA
 *
 * @param Default MP Recovery
 * @desc 預設每回合MP恢復量
 * @default 0
 *
 * @param Collider Display
 * @desc 顯示飛道判定塊(0：關、1：開)
 * @default 0
 *
 * @help 
 * ＜必要插件＞
 * STLLA_ScriptCore v1.2(共通前置)：
 *    https://www.dropbox.com/s/1syi7sk0psybhb7/STLLA_ScriptCore.js?dl=0    
 * STLLA_BreakoutMain v1.2(系統本體)：
 *    https://www.dropbox.com/s/di70h5bu0gevte3/STLLA_BreakoutMain.js?dl=0 
 *
 * ＜更新履歷＞
 *  v1.1：
 *    對應主程式v1.5.0
 *
 * ＜使用法＞
 *  在技能的備註欄加入 <Breakout> 與效果參數，此技能就可在打磚塊場景使用
 *  選用插件：STLLA_BreakoutBullets.js (自定義飛道)
 *          ：FullKeyboard2.js (全按鍵，可使用Debug鍵)
 * 
 * ＜操作＞
 *  ok(Enter、Space、Z)：使用技能(球發射後才可用)
 *  Q、W：切換技能
 *  9：顯示飛道判定塊(需安裝FullKeyboard2.js)
 *  0：全恢復(需安裝FullKeyboard2.js)
 *
 * ＜效果參數(寫在註解欄)＞
 *  角色：
 *   <BO_MPRecover:n>        // 角色每回合MP恢復 n      
 *  技能：
 *   <Breakout>                            // 必須加這個才可在打磚塊模式使用
 *   <BO_shootBall:n>                      // 造出 n 個球並射出
 *   <BO_paddleW:n,f>                      // 板子寬變為 n 倍，持續 f 畫格
 *   <BO_paddleH:n,f>                      // 板子高變為 n 倍，持續 f 畫格
 *   <BO_paddleSpeedX:n,f>                 // 板子X速度增加 n(負數為減速)，持續 f 畫格
 *   <BO_paddleSpeedY:n,f>                 // 板子Y速度增加 n，持續 f 畫格
 *   <BO_ballSpeed:n,f,a>	               // 改變下次碰到板子的球速，持續 f 畫格，準備中使用 a 號動畫
 *   <BO_ballAtk:n,f,a>                    // 改變下次碰到板子的球攻擊力，持續 f 畫格，準備中使用 a 號動畫
 *   <BO_ballSmash:a>                      // 下次碰到板子的球貫通化，準備中使用 a 號動畫
 *   <BO_Barrier:f>                        // 出現護罩，維持 f 畫格
 *   <BO_THE WORLD:f>                      // 時間停止吧！！持續 f 畫格！！ (※時停中只能射球)
 *
 *   <BO_bullet:Bullet Class, a, b, c, d>  // 生成對應 Bullet Class 名稱的飛道，預設有BulletBasic可用
 *                                         // a：一次發射數量
 *                                         // b：0－直射、1－扇形發射
 *                                         // c(可省略)：連射次數，預設1次
 *                                         // d(可省略)：連射間隔，單位Frame
 */

 
// 抓語法錯誤用，不過好像就不能用caller
//'use strict'
 
 
// 共通腳本檢測
if (typeof(STILILA) == 'undefined') {alert('未安裝STLLA_ScriptCore.js') ; window.close();}
// 本體檢測
if (!STILILA.BO) {alert('未安裝STLLA_BreakoutMain.js') ; window.close();}


// 為了不讓變量名稱和其他腳本打架，包起來
(function() {
	
var parameters = PluginManager.parameters('STLLA_BreakoutSkill');
var mpRecover = Number(parameters['Default MP Recovery'] || 0);
var colliderDisplay = Number(parameters['Collider Display'] || 0);
// ----------------------------------------------
// ● 準備關卡物件
// ----------------------------------------------
var _Scene_Breakout_prepareStageObject = Scene_Breakout.prototype.prepareStageObject;
Scene_Breakout.prototype.prepareStageObject = function() {
	_Scene_Breakout_prepareStageObject.call(this);
	// 讀取持有技能
	this.skills = $gameParty.leader().skills().filter(function(skill) {
        return this.useableSkill(skill);
    }, this);
	this.skillWindow.refresh(this.skills, this.skillIndex);
	// 飛道預定
	this.bulletPlan = [0,null];
	// 顯示判定
	this.colliderView.visible = colliderDisplay;
	this.needRefreshWindow = false;
	// mp恢復量設定
	var data = $gameParty.leader().actor().meta;
	this.mpRecover = (data['BO_MPRecover'] ? Number(data['BO_MPRecover']) : mpRecover);
	
}

// ----------------------------------------------
// ● 定期更新－測試鍵
// ----------------------------------------------
var _Scene_Breakout_updateDebug = Scene_Breakout.prototype.updateDebug;
Scene_Breakout.prototype.updateDebug = function() {
	if (typeof(InputEX) === 'undefined') {return;}
	_Scene_Breakout_updateDebug.call(this);
	// 判定切換
	if (InputEX.isTriggered(48)) {
		this.colliderView.visible = !this.colliderView.visible;
	}
	// 全恢復
	if (InputEX.isTriggered(57)) {
		$gameParty.leader().recoverAll();
	}
}


// ----------------------------------------------
// ● 切換技能
// ----------------------------------------------
Scene_Breakout.prototype.skillChange = function(v) {
	// 沒技能中斷
	if (this.skills.length == 0) {return;}
	this.skillIndex += v;
	if (this.skillIndex == -1) {this.skillIndex = this.skills.length - 1;}
	if (this.skillIndex == this.skills.length) {this.skillIndex = 0;}
	SoundManager.playEquip();
	this.needRefreshWindow = true;
	this.skillNote.refresh(this.skills[this.skillIndex], this.gamePaddle.y - this.gamePaddle.height - 36);
	
}

// ----------------------------------------------
// ● 技能是否可用
// ----------------------------------------------
Scene_Breakout.prototype.useableSkill = function(skill) {
	return skill.meta['Breakout'];
}

// ----------------------------------------------
// ● 使用技能
// ----------------------------------------------
Scene_Breakout.prototype.useSkill = function(index) {
	// 時停中
	if ($gameTemp.timeStopCount > 0) {
		var balls = this.createBall(1,true);
		for (var i=0; i<balls.length; i++) {
			balls[i].timeStopMove = 5;
		}
		return;
	}
	// 沒技能中斷
	if (this.skills.length == 0) {return;}
	
	var skill = this.skills[index];
	
	// MP、TP不足時中斷
	if (!$gameParty.leader().canPaySkillCost(skill)) {
		SoundManager.playBuzzer();
		return;
	}
	// 消耗MP、TP
	$gameParty.leader().paySkillCost(skill);

	// 發射球
	if (skill.meta['BO_shootBall']) {
		this.createBall(Number(skill.meta['BO_shootBall']),true);
	};
	// 變更板子寬
	if (skill.meta['BO_paddleW']) {
		var effect = skill.meta['BO_paddleW'].split(',')
		this.gamePaddle.changeWidth(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[0].refresh(effect[0],effect[1],skill.iconIndex);
	};
	// 變更板子高
	if (skill.meta['BO_paddleH']) {
		var effect = skill.meta['BO_paddleH'].split(',')
		this.gamePaddle.changeWidth(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[1].refresh(effect[0],effect[1],skill.iconIndex);
	};	
	// 變更板子X速度
	if (skill.meta['BO_paddleSpeedX']) {
		var effect = skill.meta['BO_paddleSpeedX'].split(',')
		this.gamePaddle.changeSpeedX(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[2].refresh(effect[0],effect[1],skill.iconIndex);
	};	
	// 變更板子Y速度
	if (skill.meta['BO_paddleSpeedY']) {
		var effect = skill.meta['BO_paddleSpeedY'].split(',')
		this.gamePaddle.changeSpeedX(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[3].refresh(effect[0],effect[1],skill.iconIndex);
	};	
	
	// 變更球攻準備
	if (skill.meta['BO_ballAtk']) {
		// 如果已有循環動畫時，消除原本的
		if (this.gamePaddle.ballAtkBuff && this.gamePaddle.ballAtkBuff[2] > 0) {
			this.gamePaddle.sprite.endLoopAnimation(this.gamePaddle.ballAtkBuff[2]);
		}
		// 預約效果
		var effect = skill.meta['BO_ballAtk'].split(',')
		effect[2] = Number(effect[2]) || 0;
		this.gamePaddle.ballAtkBuff = [Number(effect[0]),Number(effect[1]), effect[2]];
		this.buffSprites.children[4].refresh(effect[0],0,skill.iconIndex);
		// 套用循環動畫
		if (effect[2] > 0) {
			this.gamePaddle.sprite.addLoopAnimation(effect[2]);
		}
		
	};	
	// 變更球速準備
	if (skill.meta['BO_ballSpeed']) {
		// 如果已有循環動畫時，消除原本的
		if (this.gamePaddle.ballSpeedBuff && this.gamePaddle.ballSpeedBuff[2] > 0) {
			this.gamePaddle.sprite.endLoopAnimation(this.gamePaddle.ballSpeedBuff[2]);
		}
		// 預約效果
		var effect = skill.meta['BO_ballSpeed'].split(',')
		effect[2] = Number(effect[2]) || 0;
		this.gamePaddle.ballSpeedBuff = [Number(effect[0]),Number(effect[1]), effect[2]];
		this.buffSprites.children[5].refresh(effect[0],0,skill.iconIndex);
		// 套用循環動畫
		if (effect[2] > 0) {
			this.gamePaddle.sprite.addLoopAnimation(effect[2]);
		}
	};	

	// 球貫通準備
	if (skill.meta['BO_ballSmash']) {
		this.gamePaddle.ballSmashBuff = true;
		//this.gamePaddle.sprite.endLoopAnimation();
		// 有指定循環動畫時，播放動畫
		if (!isNaN(skill.meta['BO_ballSmash'])) {
			this.gamePaddle.sprite.addLoopAnimation(Number(skill.meta['BO_ballSmash']));
		}
		this.buffSprites.children[6].refresh(true,0,skill.iconIndex);
	};	
	
	// 產生護罩
	if (skill.meta['BO_Barrier']) {
		this.appearBarrier(Number(skill.meta['BO_Barrier']));
	};	
	
	// 世界！！
	if (skill.meta['BO_THE WORLD']) {
		this.startTimeStop(Number(skill.meta['BO_THE WORLD']));
		this.gamePaddle.timeStopMove = Number(skill.meta['BO_THE WORLD']);
	};	
	
	// 放出飛道
	if (skill.meta['BO_bullet']) {
		var arg = skill.meta['BO_bullet'].split(',')
		this.createBullet($gameParty.leader(), String(arg[0]), Number(arg[1]), Number(arg[2]), Number(arg[3]), Number(arg[4]));
	};	
	
	
	// 播放技能動畫
	if (skill.animationId) {
		this.gamePaddle.sprite.startAnimation($dataAnimations[skill.animationId], false, 0);
	}
	
	this.needRefreshWindow = true;
}


// ----------------------------------------------
// ● 定期更新－回合(增加時執行一次)
// ----------------------------------------------
var _Scene_Breakout_updateTurn = Scene_Breakout.prototype.updateTurn;
Scene_Breakout.prototype.updateTurn = function() {
	_Scene_Breakout_updateTurn.call(this);
	// 恢復mp
	if (this.mpRecover) {
		$gameParty.leader().gainMp(this.mpRecover);
	}
	// 刷新視窗
	this.needRefreshWindow = true;
}


// ----------------------------------------------
// ● 定期更新－技能插件相關
// ----------------------------------------------
Scene_Breakout.prototype.updateSkillPlugin = function() {
	// 刷新技能窗
	if (this.needRefreshWindow) {
		this.needRefreshWindow = false;
		this.skillWindow.refresh(this.skills, this.skillIndex);
	}
	
	// 更新飛道預約
	if (this.bulletPlan[1] && this.bulletPlan[0] > 0) {
		this.bulletPlan[0]--;
		if (this.bulletPlan[0] == 0) {
			var arg = this.bulletPlan[1];
			this.createBullet($gameParty.leader(), arg[0], arg[1], arg[2], arg[3], arg[4]);
		}
	}
	
	// 定期更新飛道物件
	for (var b=0; b<this.gameBullets.length; b++) {
		var bullet = this.gameBullets[b];
		bullet.update();
	}

	// 更新技能提示
	this.skillNote.x = this.gamePaddle.x;

	
}

// ----------------------------------------------
// ● 生成飛道
//	 user：使用者(Game_Actor、Game_Enemy、Game_BreakoutBullet)
//	 className：建構式名稱
//	 amount：數量
//	 type：發射類型(0直射、1散射)
//   times：連發次數
//   delay：連發間隔
// ----------------------------------------------
Scene_Breakout.prototype.createBullet = function(user, className, amount, type, times, delay) {
	var bullets = [];
	
	var times = isNaN(times) ? 1 : times;
	var delay = isNaN(delay) ? 0 : delay;
	
	// 預約下次飛道
	if (times > 1) {
		times--;
		this.bulletPlan[0] = delay;
		this.bulletPlan[1] = [className, amount, type, times, delay];
	} else {
		this.bulletPlan[1] = null;
	}
	
	// 決定位置、角度基準
	switch (type) {
	case 1: // 扇形
		if (amount > 1) {
			var dx = 180 / (amount+1);
		} else {
			var dx = 90 + (Math.randomInt(7)*10) * (this.gamePaddle.nowSpeedX < 0 ? 1 : -1);
		}
		break;
	case 0: // 直射
		var dx = this.gamePaddle.width/(amount+1);
		break;
	}

	while (amount > 0) {
		amount--;
		// 錯誤迴避
		if (!STILILA.BO[className]) {
			alert('未定義飛道' + className);
			break;
		}
		var bullet = new STILILA.BO[className](user, this.gamePaddle.x, this.gamePaddle.y); // 用 STILILA.BO[className] 取得建構式
		this.gameBullets.push(bullet);
		this.bulletSprites.addChild(bullet.sprite);
		switch (type) {
		case 1: // 扇形
			// 取得角度
			var radian = dx * (amount+1);
			bullet.dirX = Math.cos((radian * Math.PI / 180));
			bullet.dirY = -(2-Math.abs(bullet.dirX));
			// 速度一致化(不然形狀會怪掉)
			var speed = Math.max(bullet.speedX,bullet.speedY);
			bullet.speedX = bullet.speedY = speed;
			break;
		case 0: // 直射
			bullet.x = (bullet.x - this.gamePaddle.width/2) + dx * (amount+1);
			break;
		}
		bullets.push(bullet);
	}
	return bullets;
}

// ----------------------------------------------
// ● 移除飛道
// ----------------------------------------------
Scene_Breakout.prototype.deleteBullet = function(bulletObj) {
	bulletObj.sprite.endAnimation();
	bulletObj.sprite.endLoopAnimation();
	this.gameBullets.remove(bulletObj);
	this.bulletSprites.removeChild(bulletObj.sprite);
	this.colliderView.removeChild(bulletObj.colliderSprite);
	bulletObj.sprite = null;
	bulletObj.bitmap = null;
	bulletObj.colliderSprite = null;
	
}

// ----------------------------------------------
// ● 掉球處理
// ----------------------------------------------
var _Scene_Breakout_fallBall = Scene_Breakout.prototype.fallBall;
Scene_Breakout.prototype.fallBall = function() {
	// 移除所有飛道
	for (var i=this.gameBullets.length-1; i>=0; i--) {
		this.deleteBullet(this.gameBullets[i]);
	}
	_Scene_Breakout_fallBall.call(this);
	this.bulletPlan = [0,null];
}

// ----------------------------------------------
// ● 時間到處理
// ----------------------------------------------
var _Scene_Breakout_timeUp = Scene_Breakout.prototype.timeUp;
Scene_Breakout.prototype.timeUp = function() {
	_Scene_Breakout_timeUp.call(this);
	this.bulletPlan = [0,null];
}

// ----------------------------------------------
// ● 過關瞬間處理
// ----------------------------------------------
var _Scene_Breakout_toClear = Scene_Breakout.prototype.toClear;
Scene_Breakout.prototype.toClear = function() {
	// 移除所有飛道
	for (var i=this.gameBullets.length-1; i>=0; i--) {
		this.deleteBullet(this.gameBullets[i]);
	}
	_Scene_Breakout_toClear.call(this);
	this.bulletPlan = [0,null];
}

}) ();



// =========================================================================================================
// ■ Game_BreakoutBullet
//   打磚塊飛道物件的super class
// =========================================================================================================
function Game_BreakoutBullet() {
	this.initialize.apply(this, arguments);
}
// ----------------------------------------------
// ● 初始化
//   user：使用者(Game_BreakoutBullet、Game_Battler)
// ----------------------------------------------
Game_BreakoutBullet.prototype.initialize = function(user, x, y) {
	// 確認使用者(root必定是角色，user可以是角色或飛道)
	if (user instanceof (Game_BreakoutBullet)) {
		this.root = user.root;
		this.user = user;
	} else {
		this.root = this.user = user;
	}
	this.atkRectBase = [];
	this.atkRect = [];
	this.x = x;
	this.y = y;

	// 穿磚特性
	this.throughBlock = false;
	// 銷毀判定
	this.dead = false;
	// 時停判定
	this.timeStopFlag = false;
	// SceneManager._scene 簡化
	this.scene = SceneManager._scene;

	// Sprite、Bitmap設定
	this.sprite = new Sprite_Breakout(this);
	this.sprite.anchor = new Point(0.5, 0.5);
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.bitmapRow = 1;  // 圖片橫排數
	this.bitmapW = 0;    // 每格寬
	this.bitmapH = 0;    // 每格高

	// 判定塊Sprite
	this.colliderSprite = new Sprite();
	this.scene.colliderView.addChild(this.colliderSprite);
	
	
	// 運動能力設定
	this.atk = 1;
	this.speedX = 0;
	this.speedY = 5;
	this.dirX = 0;
	this.dirY = -1;

	// 動畫數據
	this.animes = {};            // 所有動畫(狀態機)
	this.animeName = 'normal';   // 動畫名稱
	this.animeTime = 0;          // 動畫經過時間
	this.frameNumber = 0;        // 影格編號
	this.frameDuration = 0;      // 影格剩餘時間
	this.nextFrame = 0;          // 下個影格
	this.frameTime = 0;          // 影格經過時間
	this.hitTargets = [];        // 已攻擊過的對象
	this.timeStopMove = 0;       // 時停可動時間
	this.superStopMove = 0;      // 超必殺可動時間
	
	// 自定義內容初始化
	this.initCustom(user, x, y);           
	// 設置動畫表
	this.setAnimes();
}


// ----------------------------------------------
// ● 飛道在畫面外
// ----------------------------------------------
Game_BreakoutBullet.prototype.isOutOfScreen = function() {
	if (this.x + (this.bitmapW * (1-this.anchorX())) < 0 || this.x - (this.bitmapW * this.anchorX()) > Graphics.width ||
		this.y + (this.bitmapH * (1-this.sprite.anchor.y)) < 0 || this.y - (this.bitmapH * this.sprite.anchor.y) > Graphics.height) {
			return true;
	}
}
// ----------------------------------------------
// ● anchorX
// ----------------------------------------------
Game_BreakoutBullet.prototype.anchorX = function() {
	if (this.sprite.mirror) {
		return this.sprite.anchor.x;
	} else {
		return 1-this.sprite.anchor.x;
	}
}
// ----------------------------------------------
// ● 球在判定內
// ----------------------------------------------
Game_BreakoutBullet.prototype.ballInRect = function(ball) {
	for (var r=0; r<this.atkRect.length; r++) {
		var rect = this.atkRect[r];
		// 左、右、上、下
		if (ball.x+ball.size/2 >= rect.x && ball.x-ball.size/2 <= rect.x+rect.width && 
			ball.y-ball.size/2 <= rect.y+rect.height && ball.y+ball.size/2 >= rect.y) {
			return true;
		}
	}	
}
// ----------------------------------------------
// ● 板子在判定內
// ----------------------------------------------
Game_BreakoutBullet.prototype.paddleInRect = function(paddle) {
	for (var r=0; r<this.atkRect.length; r++) {
		var rect = this.atkRect[r];
		// 左、右、上、下
		if (paddle.x+paddle.width/2 >= rect.x && paddle.x-paddle.width/2 <= rect.x+rect.width && 
			paddle.y-paddle.height <= rect.y+rect.height && paddle.y >= rect.y) {
			return true;
		}
	}
}
// ----------------------------------------------
// ● 磚塊在判定內
// ----------------------------------------------
Game_BreakoutBullet.prototype.blockInRect = function(block) {
	for (var r=0; r<this.atkRect.length; r++) {
		var rect = this.atkRect[r];
		// 左、右、上、下
		if (block.x+block.width/2 >= rect.x && block.x-block.width/2 <= rect.x+rect.width && 
			block.y-block.height/2 <= rect.y+rect.height && block.y+block.height/2 >= rect.y) {
			return true;
		}
	}
}
// ----------------------------------------------
// ● 撞牆判定
// ----------------------------------------------
Game_BreakoutBullet.prototype.checkHitWall = function(stageW, stageH) {
	for (var r=0; r<this.atkRect.length; r++) {
		var rect = this.atkRect[r];
		// 上
		if (rect.y <= 0) {
			this.collideWall('up');
			break;
		}
		var rect = this.atkRect[r];
		// 下
		if (this.scene.barrierAppearing() && rect.y + rect.h >= stageH) {
			this.collideWall('down');
			break;
		}
		// 左
		if (rect.x <= 0) {
			this.collideWall('left');
			break;
		}
		// 右
		if (rect.x+rect.width >= stageW) {
			this.collideWall('right');
			break;
		}
	}
}
// ----------------------------------------------
// ● 被超必殺暫停中
// ----------------------------------------------
Game_BreakoutBullet.prototype.isSuperStop = function() {
	return ($gameTemp.superStopCount > 0 && this.superStopMove == 0)
}
// ----------------------------------------------
// ● 被時停中
// ----------------------------------------------
Game_BreakoutBullet.prototype.isTimeStop = function() {
	return ($gameTemp.timeStopCount > 0 && this.timeStopMove == 0)
}
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Game_BreakoutBullet.prototype.update = function() {

	// 定期更新A
	this.updateCommonA();
	
	// 超必殺暫停判斷
	if (this.superStopMove > 0) {this.superStopMove--;}
	if (this.isSuperStop()) {return};
	// 時停判斷
	if (this.timeStopMove > 0) {this.timeStopMove--;}
	if (this.isTimeStop()) { 
		if (!this.timeStopFlag) { // 套用時停效果
			this.sprite.startTimeStop();
			this.timeStopFlag = true;
		}
		return; // 之後內容中斷
	} else if (this.timeStopFlag) { // 解除時停效果
		this.sprite.endTimeStop(); 
		this.timeStopFlag = false;
	}
	
	this.x += this.speedX * this.dirX;
	this.y += this.speedY * this.dirY;

	// 判定位置更新
	for (var r=0; r<this.atkRect.length; r++) {
		var rect = this.atkRect[r];
		rect.x = this.atkRectBase[r].x + this.x;
		rect.y = this.atkRectBase[r].y + this.y;
		this.colliderSprite.children[r].x = rect.x;
		this.colliderSprite.children[r].y = rect.y;
	}
	if (this.frameDuration > 0) {this.frameDuration--;}
	this.animeTime++;
	this.frameTime++;
	
	// 定期更新B
	this.updateCommonB();
	// 轉換影格
	if (this.frameDuration == 0) {
		this.updateAnime(this.nextFrame);
	}	
}

// ----------------------------------------------
// ● 設定攻擊判定
// ----------------------------------------------
Game_BreakoutBullet.prototype.setAtkRects = function(atkRects) {
	// 清空判定塊
	this.atkRectBase.length = this.atkRect.length = 0;
	// 清空判定Sprite的所有子物件
	this.colliderSprite.removeChildren();
	// 做成新判定塊
	for (var i=0; i<atkRects.length; i++) {
		var rect = atkRects[i];
		this.atkRectBase.push(new Rectangle(rect[0],rect[1],rect[2],rect[3]));
		this.atkRect.push(new Rectangle(rect[0],rect[1],rect[2],rect[3]));
	}

	// 作成判定Sprite
	for (var i=0; i<this.atkRect.length; i++) {
		var rect = this.atkRect[i];
		var sprite = new Sprite();
		rect.x = this.atkRectBase[i].x + this.x;
		rect.y = this.atkRectBase[i].y + this.y;
		sprite.opacity = 150;
		sprite.bitmap = new Bitmap(rect.width, rect.height)
		sprite.bitmap.fillAll('red');
		sprite.x = rect.x;
		sprite.y = rect.y;
		this.colliderSprite.addChild(sprite);
		
	}
}
// ----------------------------------------------
// ● 切換動畫(狀態機)
// ----------------------------------------------
Game_BreakoutBullet.prototype.changeAnime = function(name, startFrame) {
	var startFrame = startFrame || 0;
	this.frameTime = 0;
	this.animeTime = 0;
	this.animeName = name;
	this.frameNumber = startFrame;
	this.hitTargets.length = 0
	this.updateAnime(startFrame);
}
// ----------------------------------------------
// ● 更新動畫
//   frame：this.nextFrame
// ----------------------------------------------
Game_BreakoutBullet.prototype.updateAnime = function(frame) {
	try {
		// frame為Array時，切換狀態機
		if (Array.isArray(frame)) {
			frame[1] = frame[1] || 0;
			this.changeAnime(frame[0], frame[1]);  
			return;
		// frame為字串時，執行同名方法	
		} else if (typeof frame === 'string'){
			this[frame](); 
			return;
		}
		var frameData = this.animes[this.animeName][frame];                     // 取得影格資料
		this.setPicture(frameData['pic']);                                      // 切換圖片
		this.frameDuration = frameData['wait'];                                 // frame停留時間
		this.nextFrame = frameData['next'];                                    // 下個frame
		this.frameNumber = frame;                                              // 記錄目前frame
		// 改變攻擊判定
		if (frameData['atkRect'] || frameData['atkRect'] === 0) {
			if (Array.isArray(frameData['atkRect']) && frameData['atkRect'].length > 0) {
				this.setAtkRects(frameData['atkRect']);
			} else {
				this.atkRectBase.length = this.atkRect.length = 0;
				this.colliderSprite.removeChildren();
			}
		}   
		// 清除已攻擊過對象
		if (frameData['atkReset']) {this.hitTargets.length = 0;}   
		// 設定攻擊力		
		if (frameData['atkPower']) {this.atk = frameData['atkPower'];}     
		// 播放SE
		if (frameData['se']) {
			var se = {'name':frameData['se'][0], 'pan':0, 'pitch':frameData['se'][1], 'volume':frameData['se'][2]};
			AudioManager.playSe(se);
		}
		// 戰鬥動畫
		if (frameData['animation']) {
			this.sprite.startAnimation($dataAnimations[frameData['animation']], false, 0);
		}
		// X 速度
		if (frameData['speedX'] || frameData['speedX'] === 0) { this.speedX = frameData['speedX'];}
		// Y 速度
		if (frameData['speedY'] || frameData['speedY'] === 0) { this.speedY = frameData['speedY'];}
		// X 方向
		if (frameData['dirX'] || frameData['dirX'] === 0) { this.dirX = frameData['dirX'];}
		// Y 方向
		if (frameData['dirY'] || frameData['dirY'] === 0) { this.dirY = frameData['dirY'];}
		
		// 修改貫通特性
		if (frameData['throughBlock'] || frameData['throughBlock'] === false) {this.throughBlock = frameData['throughBlock']}
	
	// 發生錯誤
	} catch (e) {
		if (!(this.animeName in this.animes)) {
			alert (this.constructor.name+' 的「'+this.animeName+'」未定義');
			window.close();
		}
		if (!(frame in this.animes[this.animeName])) {
			alert (this.constructor.name+' 的 '+this.animeName+' 未定義Frame「'+frame+'」')
			window.close();
		}
		console.log(e)
	}
}
// ----------------------------------------------
// ● 載入圖片
// ----------------------------------------------
Game_BreakoutBullet.prototype.loadBitmap = function(name) {
	var bitmap = ImageManagerST.loadBreakout(name);
	this.sprite.bitmap = bitmap;
	this.scene._cacheKey.push(bitmap.cacheKey);
}

// ----------------------------------------------
// ● 切換圖片
// ----------------------------------------------
Game_BreakoutBullet.prototype.setPicture = function(number) {
	this.sprite.setFrame(this.bitmapW * (number % this.bitmapRow), this.bitmapH * Math.floor(number / this.bitmapRow), this.bitmapW, this.bitmapH);
}
// ----------------------------------------------
// ● 攻擊磚塊
//   noCombo：不計算combo
// ----------------------------------------------
Game_BreakoutBullet.prototype.attackBlock = function(block, noCombo) {
	var noCombo = noCombo || false;
	block.damage(this.atk);
	this.scene.breakBlock(block, noCombo); 
}
// ----------------------------------------------
// ● 報銷
// ----------------------------------------------
Game_BreakoutBullet.prototype.destorySelf = function() {
	//this.scene.deleteBullet(this); // <-先移除會有很多問題
	this.dead = true;
}
// ----------------------------------------------
// ● 自定義初始化
//   user：使用者(Game_BreakoutBullet、Game_Battler)
// ----------------------------------------------
Game_BreakoutBullet.prototype.initCustom = function(user, x, y) {
}
// ----------------------------------------------
// ● 設置動畫表
// ----------------------------------------------
Game_BreakoutBullet.prototype.setAnimes = function() {
}
// ----------------------------------------------
// ● 定期更新A(不受暫停系效果影響)
// ----------------------------------------------
Game_BreakoutBullet.prototype.updateCommonA = function() {
}
// ----------------------------------------------
// ● 定期更新B(受暫停系效果影響)
// ----------------------------------------------
Game_BreakoutBullet.prototype.updateCommonB = function() {
}
// ----------------------------------------------
// ● 撞到球 
//   ball：球對象(Game_BreakoutBall)
// ----------------------------------------------
Game_BreakoutBullet.prototype.collideBall = function(ball) {
}
// ----------------------------------------------
// ● 撞到磚塊 
//   block：磚塊對象(Game_BreakoutBlock)
// ----------------------------------------------
Game_BreakoutBullet.prototype.collideBlock = function(block) {
	// 攻擊磚塊
	this.attackBlock(block);
	// 沒有貫通磚塊的屬性時消滅
	if (!this.throughBlock) {
		this.destorySelf();
	}
}
// ----------------------------------------------
// ● 撞到板子  
//   paddle：板子對象(Game_BreakoutPaddle)
// ----------------------------------------------
Game_BreakoutBullet.prototype.collidePaddle = function(paddle) {
}
// ----------------------------------------------
// ● 撞到牆
// pos：up(上)、down(下)、left(左)、right(右)
// ----------------------------------------------
Game_BreakoutBullet.prototype.collideWall = function(pos) {
}




// =========================================================================================================
// ■ BulletBasic
//   打磚塊－泛用飛道的Class
// =========================================================================================================
STILILA.BO.BulletBasic = function BulletBasic() {
	this.initialize.apply(this, arguments);
}
STILILA.BO.BulletBasic.prototype = Object.create(Game_BreakoutBullet.prototype); // 繼承Game_BreakoutBullet
STILILA.BO.BulletBasic.prototype.constructor = STILILA.BO.BulletBasic;

// ----------------------------------------------
// ● 自定義初始化
// ----------------------------------------------
STILILA.BO.BulletBasic.prototype.initCustom = function(user, x, y) {
	var bitmap = new Bitmap(16,16);
	bitmap.drawCircle(8,8,8,'gray');
	bitmap.drawCircle(8,8,7,'white');
	this.bitmapW = 16;
	this.bitmapH = 16;
	this.sprite.bitmap = bitmap;
	// 設定判定塊
	this.setAtkRects([[-8,-8,16,16]]);
	// 設定運動能力
	this.speedX = 0;
	this.speedY = 11;
}

// ----------------------------------------------
// ● 設置動畫表
// ----------------------------------------------
STILILA.BO.BulletBasic.prototype.setAnimes = function() {
	this.animes['normal'] = [];
	this.animes['normal'][0] = {pic: 0, wait: -1, next: 0}; // wait: -1 ＝ 不更新動畫
}