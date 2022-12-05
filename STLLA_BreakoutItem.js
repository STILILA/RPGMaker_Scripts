//=============================================================================
// 打磚塊道具插件 v1.0
// 最後更新：2016/08/22
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================


/*:
 * @plugindesc 打磚塊系統的道具插件
 * @author STILILA
 *
 * @param Default Fall Speed
 * @desc 預設道具掉落速度
 * @default 5
 *
 * @param Default Item Rare
 * @desc 預設道具稀有度
 * @default 0
 
 *
 * @param Get Item SE
 * @desc 取得道具時的SE。檔名,頻率,音量
 * @default Item3,100,100
 * 
 * @help 
 * ＜必要插件＞
 * STLLA_ScriptCore(共通前置核心)：
 *    https://www.dropbox.com/s/1syi7sk0psybhb7/STLLA_ScriptCore.js?dl=0    
 * STLLA_BreakoutMain(系統本體)：
 *    https://www.dropbox.com/s/di70h5bu0gevte3/STLLA_BreakoutMain.js?dl=0 
 *
 * ＜效果參數(寫在道具的註解欄)＞
 *  <Breakout>              // 必須加這個才可在打磚塊模式使用
 *  <BO_shootBall:n>        // 造出 n 個球並射出
 *  <BO_paddleW:n,f>        // 板子寬變為 n 倍，持續 f 畫格
 *  <BO_paddleH:n,f>        // 板子高變為 n 倍，持續 f 畫格
 *  <BO_paddleSpeedX:n,f>   // 板子X速度增加 n(負數為減速)，持續 f 畫格
 *  <BO_paddleSpeedY:n,f>   // 板子Y速度增加 n，持續 f 畫格
 *  <BO_ballSpeed:n,f,a>	// 改變下次碰到板子的球速，持續 f 畫格，準備中使用 a 號動畫
 *  <BO_ballAtk:n,f,a>      // 改變下次碰到板子的球攻擊力，持續 f 畫格，準備中使用 a 號動畫
 *  <BO_ballSmash:a>        // 下次碰到板子的球貫通化，準備中使用 a 號動畫
 *  <BO_Barrier:f>          // 出現護罩，維持 f 畫格
 *  <BO_Rare:n>             // 此道具個別稀有度為 n ，如果比關卡的 itemRare 設定還高，道具就不會掉落
 *  <BO_FallSpeed:n>        // 此道具的落下速度為 n
 *  <BO_Bonus:n>            // 分數 + n，可負數(以下同)
 *  <BO_GainGold:n>         // 金錢 + n
 *  <BO_GainTime:n>         // 時間 + n
 *  <BO_GainHP:n>           // HP + n
 *  <BO_GainMP:n>           // MP + n
 *  <BO_GainMHP:n>          // HP + n%MaxHP 
 *  <BO_GainMMP:n>          // MP + n%MaxMP
 *  <BO_GainItem:n>         // 隊伍取得此道具，n為數量


 
 */
 
// 共通腳本檢測
if (typeof(STILILA) == 'undefined') {alert('未安裝STLLA_ScriptCore.js') ; window.close();}
// 本體檢測
if (!STILILA.BO) {alert('未安裝STLLA_BreakoutMain.js') ; window.close();}
 
// 為了不讓變量名稱和其他腳本打架，包起來
(function() {
	
var parameters = PluginManager.parameters('STLLA_BreakoutItem');
STILILA.BO.itemFallSpeed = Number(parameters['Default Fall Speed'] || 5);
var getItemSE = (parameters['Get Item SE'].split(',') || ['Item3',100,100]);
var itemRare = Number(parameters['Default Item Rare'] || 0);

// ----------------------------------------------
// ● 初始化 
// ----------------------------------------------
var _Scene_Breakout_initialize = Scene_Breakout.prototype.initialize;
Scene_Breakout.prototype.initialize = function() {
	this.getItemSE = {'name':getItemSE[0], 'pan':0, 'pitch':getItemSE[1], 'volume':getItemSE[2]};
	_Scene_Breakout_initialize.call(this);
}


// ----------------------------------------------
// ● 準備關卡物件
// ----------------------------------------------
var _Scene_Breakout_prepareStageObject = Scene_Breakout.prototype.prepareStageObject;
Scene_Breakout.prototype.prepareStageObject = function() {
	_Scene_Breakout_prepareStageObject.call(this);
	// 讀取可掉落的道具
	this.dropItems = $dataItems.filter(function(item) {
        return this.useableItem(item);
    }, this);
}
// ----------------------------------------------
// ● 可掉落的道具
// ----------------------------------------------
Scene_Breakout.prototype.useableItem = function(item) {
	// 迴避null
	if (!item) {return;}
	// 稀有度在關卡允許值以下才加入
	if (item && item.meta['Breakout']) {
		var rare = item.meta['BO_Rare'] || (item.meta['BO_Rare'] == 0 ? item.meta['BO_Rare'] : itemRare);
		if (rare <= Number(this.stageData['itemRare'])) {return true;}
	}
}


// ----------------------------------------------
// ● 取得道具
// ----------------------------------------------
Scene_Breakout.prototype.getItem = function(item) {
	var itemData = item.itemobj
	
	// 造球
	if (itemData.meta['BO_shootBall']) {
		this.createBall(Number(itemData.meta['BO_shootBall']),true);
	};
	// 變更板子寬
	if (itemData.meta['BO_paddleW']) {
		var effect = itemData.meta['BO_paddleW'].split(',')
		this.gamePaddle.changeWidth(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[0].refresh(effect[0],effect[1],itemData.iconIndex);
	};
	// 變更板子高
	if (itemData.meta['BO_paddleH']) {
		var effect = itemData.meta['BO_paddleH'].split(',')
		this.gamePaddle.changeWidth(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[1].refresh(effect[0],effect[1],itemData.iconIndex);
	};	
	// 變更板子X速度
	if (itemData.meta['BO_paddleSpeedX']) {
		var effect = itemData.meta['BO_paddleSpeedX'].split(',')
		this.gamePaddle.changeSpeedX(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[2].refresh(effect[0],effect[1],itemData.iconIndex);
	};	
	// 變更板子Y速度
	if (itemData.meta['BO_paddleSpeedY']) {
		var effect = itemData.meta['BO_paddleSpeedY'].split(',')
		this.gamePaddle.changeSpeedX(Number(effect[0]),Number(effect[1]));
		this.buffSprites.children[3].refresh(effect[0],effect[1],itemData.iconIndex);
	};	
	
	// 變更球攻準備
	if (itemData.meta['BO_ballAtk']) {
		// 如果已有循環動畫時，消除原本的
		if (this.gamePaddle.ballAtkBuff && this.gamePaddle.ballAtkBuff[2] > 0) {
			this.gamePaddle.sprite.endLoopAnimation(this.gamePaddle.ballAtkBuff[2]);
		}
		// 預約效果
		var effect = itemData.meta['BO_ballAtk'].split(',')
		effect[2] = Number(effect[2]) || 0;
		this.gamePaddle.ballAtkBuff = [Number(effect[0]),Number(effect[1]), effect[2]];
		this.buffSprites.children[4].refresh(effect[0],0,itemData.iconIndex);
		// 套用循環動畫
		if (effect[2] > 0) {
			this.gamePaddle.sprite.addLoopAnimation(effect[2]);
		}
		
	};	
	
	// 變更球速準備
	if (itemData.meta['BO_ballSpeed']) {
		// 如果已有循環動畫時，消除原本的
		if (this.gamePaddle.ballSpeedBuff && this.gamePaddle.ballSpeedBuff[2] > 0) {
			this.gamePaddle.sprite.endLoopAnimation(this.gamePaddle.ballSpeedBuff[2]);
		}
		// 預約效果
		var effect = itemData.meta['BO_ballSpeed'].split(',')
		effect[2] = Number(effect[2]) || 0;
		this.gamePaddle.ballSpeedBuff = [Number(effect[0]),Number(effect[1]), effect[2]];
		this.buffSprites.children[5].refresh(effect[0],0,itemData.iconIndex);
		// 套用循環動畫
		if (effect[2] > 0) {
			this.gamePaddle.sprite.addLoopAnimation(effect[2]);
		}
	};	

	// 球貫通準備
	if (itemData.meta['BO_ballSmash']) {
		this.gamePaddle.ballSmashBuff = true;
		//this.gamePaddle.sprite.endLoopAnimation();
		// 有指定循環動畫時，播放動畫
		if (!isNaN(itemData.meta['BO_ballSmash'])) {
			this.gamePaddle.sprite.addLoopAnimation(Number(itemData.meta['BO_ballSmash']));
		}
		this.buffSprites.children[6].refresh(true,0,itemData.iconIndex);
	};	

	// 產生護罩
	if (itemData.meta['BO_Barrier']) {
		this.appearBarrier(Number(itemData.meta['BO_Barrier']));
	};	
	
	// 加分
	if (itemData.meta['BO_Bonus']) {
		this.scoreWindow.refresh(Number(itemData.meta['BO_Bonus']), 1);
	};	

	// 加錢
	if (itemData.meta['BO_GainGold']) {
		$gameParty.gainGold(Number(itemData.meta['BO_GainGold']));
	};	
	
	// 加時間
	if (itemData.meta['BO_GainTime'] && this.timeLimit > 0) {
		this.timeLimit = Math.max(this.timeLimit + itemData.meta['BO_GainTime']*60, 1);
		this.timeWindow.refresh(Math.round(this.timeLimit/60));
	}
	
	// HP 增減
	if (itemData.meta['BO_GainHP']) {
		var battler = $gameParty.leader();
		battler.setHp(battler.hp + Number(itemData.meta['BO_GainHP']));
		// 陣亡判定
		if (battler.hp <= 0) {
			this.loseWait = 90;
			AudioManager.fadeOutBgm(0.8);
			// 記錄分數、時間到變數
			this.gameVarSet();
			this.judge = true;
		}
	};	
	
	// HP 增減(%數)
	if (itemData.meta['BO_GainMHP']) {
		var battler = $gameParty.leader();
		var val = Math.round(battler.mhp * itemData.meta['BO_GainMHP'] * 0.01);
		battler.setHp(battler.hp + val);
		// 陣亡判定
		if (battler.hp <= 0) {
			this.loseWait = 90;
			AudioManager.fadeOutBgm(0.8);
			// 記錄分數、時間到變數
			this.gameVarSet();
			this.judge = true;
		}
	};	
	
	// MP 增減
	if (itemData.meta['BO_GainMP']) {
		var battler = $gameParty.leader();
		battler.setMp(battler.mp + Number(itemData.meta['BO_GainMP']));
	};	
	
	// MP 增減(%數)
	if (itemData.meta['BO_GainMMP']) {
		var battler = $gameParty.leader();
		var val = Math.round(battler.mmp * itemData.meta['BO_GainMMP'] * 0.01);
		battler.setMp(battler.mp + val);
	};	
	
	// 取得此道具
	if (itemData.meta['BO_GainItem']) {
		$gameParty.gainItem($dataItems[itemData.id], Number(itemData.meta['BO_GainItem']));
	};	
	
	// 播放道具動畫
	if (itemData.animationId) {
		this.gamePaddle.sprite.startAnimation($dataAnimations[itemData.animationId], false, 0);
	}
	// 播放取得道具音效
	if (getItemSE) {
		AudioManager.playSe(this.getItemSE);
	}
	
}

// ----------------------------------------------
// ● 定期更新－道具插件相關
// ----------------------------------------------
Scene_Breakout.prototype.updateItemPlugin = function() {
	for (var i=0; i<this.gameItems.length; i++) {
		this.gameItems[i].update();
	}
}
// ----------------------------------------------
// ● 掉落(生成)道具
// ----------------------------------------------
Scene_Breakout.prototype.blockDropItem = function(block) {
	if (this.dropItems.length === 0) {return;} // 沒有道具可掉就中斷
	// 建立圖片
	var sprite = new Sprite();
	sprite.bitmap = new Bitmap(32,32);
	var item = this.dropItems[Math.randomInt(this.dropItems.length)]; // 隨機取得道具
	var iconBitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
	var iconIndex = item.iconIndex;
	var sx = iconIndex % 16 * pw;
	var sy = Math.floor(iconIndex / 16) * ph;
	sprite.bitmap.blt(iconBitmap, sx ,sy ,pw ,ph ,0 ,0);
	sprite.x = block.x;
	sprite.y = block.y;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	this.itemSprites.addChild(sprite);
	// 建立物件
	this.gameItems.push(new Game_BreakoutItem(block.x, block.y, item, sprite));

}
	
// ----------------------------------------------
// ● 消除道具
// ----------------------------------------------
Scene_Breakout.prototype.deleteItem = function(item) {
	this.gameItems.remove(item);
	this.itemSprites.removeChild(item.sprite);
	item.sprite = null;
}
	
// ----------------------------------------------
// ● 掉球處理
// ----------------------------------------------
var _Scene_Breakout_fallBall = Scene_Breakout.prototype.fallBall;
Scene_Breakout.prototype.fallBall = function() {
	// 移除所有道具
	for (var i=this.gameItems.length-1; i>=0; i--) {
		this.deleteItem(this.gameItems[i]);
	}
	_Scene_Breakout_fallBall.call(this);
}

// ----------------------------------------------
// ● 過關瞬間處理
// ----------------------------------------------
var _Scene_Breakout_toClear = Scene_Breakout.prototype.toClear;
Scene_Breakout.prototype.toClear = function() {
	// 移除所有道具
	for (var i=this.gameItems.length-1; i>=0; i--) {
		this.deleteItem(this.gameItems[i]);
	}
	_Scene_Breakout_toClear.call(this);
}

	
})();


// =========================================================================================================
// ■ Game_BreakoutItem
//   打磚塊道具的數據
// =========================================================================================================
function Game_BreakoutItem() {
	this.initialize.apply(this, arguments);
}

// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Game_BreakoutItem.prototype.initialize = function(x, y, item, sprite) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.itemobj = item;
	this.fallSpeed = (Number(item.meta['BO_FallSpeed']) || STILILA.BO.itemFallSpeed);
	this.dead = false;
	this.sprite = sprite;
	this.superStopMove = 0;
	this.timeStopMove = 0;
	
	this.timeStopFlag = false;
}
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Game_BreakoutItem.prototype.update = function() {
	// 超必殺暫停判斷
	if (this.superStopMove > 0) {this.superStopMove--;}
	if (this.isSuperStop()) {return};
	
	// 時停判斷
	if (this.timeStopMove > 0) {this.timeStopMove--;}
	if (this.isTimeStop()) { 
		if (!this.timeStopFlag) { // 套用時停效果
			this.sprite.setColorTone([0, 0, 0, 255]);
			this.timeStopFlag = true;
		}
		return; // 之後內容中斷
	} else if (this.timeStopFlag) { // 解除時停效果
		this.sprite.setColorTone([0, 0, 0, 0]); 
		this.timeStopFlag = false;
	}
	
	this.y += this.fallSpeed;
}
// ----------------------------------------------
// ● 板子在判定內
// ----------------------------------------------
Game_BreakoutItem.prototype.paddleInRect = function(paddle) {
	// 左、右、上、下
	if (paddle.x+paddle.width/2 >= this.x-this.width/2 && paddle.x-paddle.width/2 <= this.x+this.width/2 && 
		paddle.y >= this.y-this.height/2 && paddle.y-paddle.height <= this.y+this.height/2) {
		return true;
	}
}
// ----------------------------------------------
// ● 離開畫面
// ----------------------------------------------
Game_BreakoutItem.prototype.isOutOfScreen = function() {
	if (this.x + this.width/2 < 0 || this.x - this.width/2 > Graphics.width ||
		this.y + this.height/2 < 0 || this.y - this.height/2 > Graphics.height) {
			return true;
	}
}
// ----------------------------------------------
// ● 被超必殺暫停中
// ----------------------------------------------
Game_BreakoutItem.prototype.isSuperStop = function() {
	return ($gameTemp.superStopCount > 0 && this.superStopMove == 0)
}
// ----------------------------------------------
// ● 被時停中
// ----------------------------------------------
Game_BreakoutItem.prototype.isTimeStop = function() {
	return ($gameTemp.timeStopCount > 0 && this.timeStopMove == 0)
}