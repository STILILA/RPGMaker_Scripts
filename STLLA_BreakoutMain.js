//=============================================================================
// 打磚塊主系統 v1.2
// 最後更新：2017/06/10
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================

/*:
 * @plugindesc 打磚塊遊戲模式 v1.2
 * @author STILILA
 *
 * @param Image Path
 * @desc 此腳本使用的圖片路徑
 * @default img/breakout/
 
 * @param Paddle Image
 * @desc 板子的圖片名稱，不需要時保持空白
 * @default 
 
 * @param Ball Image
 * @desc 球的圖片名稱，不需要時保持空白
 * @default 
 
 * @param EXBall Image
 * @desc 貫通球的圖片名稱，不需要時保持空白
 * @default 
 
 * @param Barrier Image
 * @desc 護罩的圖片名稱，不需要時保持空白
 * @default 
 
 * @param Barrier Y
 * @desc 護罩的Y
 * @default 516
 
 * @param Paddle Rebound SE
 * @desc 撞到板子時的SE名稱,頻率,音量 (中間不能空格，以下皆同)
 * @default Crossbow,120,85
 
 * @param Wall Rebound SE
 * @desc 撞到牆壁時的SE名稱,頻率,音量
 * @default Knock,100,90

 * @param Block HP
 * @desc 磚塊1~5的耐久(-1為無法破壞)
 * @default 1,2,3,4,-1
 
 * @param Block Color
 * @desc 磚塊1~5的顏色(CSS色碼或textColor編號，不需要上色的種類保持空白)
 * @default ,11,17,2,red
 
 * @param Combo Bonus Increase
 * @desc 每多一Combo的追加分數倍率
 * @default 0.2
 
 * @param Block Break Animation
 * @desc 破壞磚塊時的動畫ID
 * @default 1
 
 * @param Block Rebound Animation
 * @desc 被磚塊反彈時的動畫ID
 * @default 2
 
 * @param Count Down SE
 * @desc 倒數最後10秒的SE。檔名,頻率,音量
 * @default Decision2,130,100
 
 * @param TimeUp SE
 * @desc 時間到的SE。檔名,頻率,音量
 * @default Bell3,100,100
 
 * @param TimeUp Switch
 * @desc 時間到時指定開關為on，不需要時保持空白
 * @default 5
 
 * @param Score Value
 * @desc 勝負判定時，得到的分數要記錄到哪個變數，不需要時保持空白
 * @default 5
 
 * @param Time Value
 * @desc 勝負判定時，剩餘的時間(秒)要記錄到哪個變數，不需要時保持空白
 * @default 6
 
 * @param MaxCombo Value
 * @desc 勝負判定時，最大連擊要記錄到哪個變數，不需要時保持空白
 * @default 7
 
 * @param Score Text
 * @desc 用語「分數」的文字
 * @default SCORE：
 
 * @param Combo Text
 * @desc 用語「連擊」的文字
 * @default  COMBO
 
 * @param Time Text
 * @desc 用語「剩餘時間」的文字
 * @default TIME：
 
 * @param Buff0 Icon
 * @desc 「板子寬度變化」的Icon號。(增加,減少)
 * @default 35,51
 
 * @param Buff1 Icon
 * @desc 「板子高度變化」的Icon號。(增加,減少)
 * @default 37,53
 
 * @param Buff2 Icon
 * @desc 「板子橫向速度變化」的Icon號。(增加,減少)
 * @default 38,54
 
 * @param Buff3 Icon
 * @desc 「板子縱向速度變化」的Icon號。(增加,減少)
 * @default 39,55
 
 * @param Buff4 Icon
 * @desc 「球攻擊力變化準備」的Icon號。(增加,減少)
 * @default 42,58
 
 * @param Buff5 Icon
 * @desc 「球速變化準備」的Icon號。(增加,減少)
 * @default 46,62
 
 * @param Buff6 Icon
 * @desc 「球貫通準備」的Icon號。
 * @default 77
 
 * @param Turn Frame
 * @desc 幾Frame做為一回合，回合計算用
 * @default 60
 
 * @param ↓以下為預設值↓
 
 * @param Break Effect
 * @desc 前景圖破壞的計算，0：關、1：消矩形、2：消圓型
 * @default 2
 
 * @param Block Display
 * @desc 是否要顯示磚塊，0關、1開
 * @default 0

 * @param ItemDrop Rate
 * @desc 磚頭破壞時掉落道具的機率，0為不掉道具(※有道具插件才有效)
 * @default 35
 
 * @param Paddle Width
 * @desc 板子的長度
 * @default 120
 
 * @param Paddle Height
 * @desc 板子的高度
 * @default 15

 * @param Paddle SpeedX
 * @desc 板子的X移動速度
 * @default 15
 
 * @param Paddle FrictionX
 * @desc 板子的X摩擦力
 * @default 3
 
 * @param Paddle SpeedY
 * @desc 板子的Y移動速度
 * @default 3

 * @param Paddle FrictionY
 * @desc 板子的Y摩擦力
 * @default 3
 
 * @param Paddle Smash Range
 * @desc 球撞到時追加貫通屬性，以中心往左右各延伸n像素，0為關閉此功能
 * @default 5
 
 * @param Paddle Down Limit
 * @desc 板子往下移動限制，也是板子的起始Y
 * @default 516
 
 * @param Paddle Up Limit
 * @desc 板子上移限制
 * @default 516
 
 * @param Ball Size
 * @desc 球的直徑
 * @default 24
 
 * @param Ball Speed
 * @desc 球的移動速度
 * @default 7
 
 * @param Ball AtkPower
 * @desc 球每次給予磚塊的損傷
 * @default 1

 
 * @help 
 * ＜必要插件＞
 * STLLA_ScriptCore v1.2(共通前置)：
 *    https://www.dropbox.com/s/1syi7sk0psybhb7/STLLA_ScriptCore.js?dl=0    
 * STLLA_BreakoutStage(打磚塊關卡數據)：
 *    https://www.dropbox.com/s/0xt6zk9nptfglpt/STLLA_BreakoutStage.js?dl=0
 * STLLA_BreakoutEdit(關卡編輯，製作時必需，發佈時可移除)：
 *    https://www.dropbox.com/s/fhctn8ozh5b2wz1/STLLA_BreakoutEdit.js?dl=0
 *
 * ＜更新履歷＞
 *  v1.2：
 *    對應主程式v1.5.0
 
 *  v1.1：
 *    1.板子和球設定方式變更 
 *    2.貫通球演出變更
 *    3.插件參數英文化 & 擴充，需要重設
 *    4.對應主程式v1.31
 *    造成不便請多包涵 
 *
 * -------------------------------------------------------------
 *＜基本操作＞
 *  方向鍵：移動板子
 *  ok(Enter、Space、Z)：發射球
 *  escape(Esc、X、Num0、Insert)：暫停
 *
 * ※打磚塊戰鬥是以隊長進行，HP等數據全看隊長。
 *
 *＜插件指令＞
 * 開啟關卡([]內的參數可省略，-1為原設定)：
 *   Breakout start 關卡名 [磚塊可視 破壞計算 道具掉落率]  
 * 調整磚塊可視(0：off、1：on)：
 *   Breakout blockVisible n
 * 破壞計算(0：off、1：矩形、2：圓形)：
 *   Breakout blockVisible n
 *
 *範例：
 *  BreakOut start st1_1        // 開啟關卡 st1_1(讀取STLLA_BreakoutStage.js內容)
 *  BreakOut blockVisible 1     // 磚塊可視
 *  BreakOut breakEffect 0      // 關閉破壞計算
 * ※BreakOut／Breakout 都可(v1.1)
 *  Breakout start st1_1        
 *  Breakout blockVisible 1
 *  Breakout breakEffect 0
 * ※v1.1 新增
 *  Breakout itemRate 50            // 掉落道具率50% (需安裝STLLA_BreakoutItem.js)
 *  Breakout start st50 1 -1 20    // 這場戰鬥磚塊可視、道具掉落機率20%
 *  Breakout start st50 -1 2 -1    // 這場戰鬥破壞計算為圓形	
--------------------------------------------------------------------------
 * v1.1 球和板子的性能一率採用插件預設值，如需有個別設定請把下面參數加到角色註解欄：
 *  <BO_PaddleImage:name>              // 板子圖片名
 *  <BO_BallImage:name>                // 球的圖片名
 *  <BO_BallEXImage:name>              // 貫通球的圖片名
 *  <BO_PaddleWidth:formula(※)>       // 板子寬
 *  <BO_PaddleHeight:formula>         // 板子高
 *  <BO_PaddleSpeedX:formula>         // 板子X速度
 *  <BO_PaddleSpeedY:formula>         // 板子Y速度
 *  <BO_PaddleFricX:formula>          // 板子X摩擦力
 *  <BO_PaddleFricY:formula>          // 板子Y摩擦力
 *  <BO_PaddleSmashRange:formula>     // 板子貫通範圍
 *  <BO_PaddleUpLimit:formula>        // 板子上移限制
 *  <BO_PaddleDownLimit:formula>      // 板子初始Y、下移限制
 *  <BO_BallSize:formula>            // 球大小
 *  <BO_BallSpeed:formula>           // 球速
 *  <BO_BallAtk:formula>             // 球攻擊力
 * ※formula如技能公式，可進行簡單的計算，me為角色、v為事件變數，例：
 *  <BO_BallSize:me.mat>                      // 球的大小為角色mat
 *  <BO_BallSpeed:me.agi/2>                   // 球的速度為角色agi / 2
 *  <BO_PaddleWidth:(me.def+me.mdf)*2+v[5]>   // 板子的寬為角色(def+mdf)*2 + 5號變數值
 * 
 *
 * 進階：如果需要用到條件分歧調整板子和球－－
 *  <BO_commonEV:n>                  // 打磚塊前執行 n 號公共事件，但只有1F，請寫會在1F內完成的事
 *
 * 用腳本指令修改以下的值(在戰鬥中更改無法當場反映，請注意)：
 *   STILILA.BO.paddleImage        // 板子圖片名
 *	 STILILA.BO.ballImage          // 球的圖片名
 *	 STILILA.BO.ballEXImage        // 貫通球的圖片名
 *   STILILA.BO.paddleWidth        // 板子寬
 *   STILILA.BO.paddleHeight       // 板子高
 *   STILILA.BO.paddleSpeedX       // 板子X速度
 *   STILILA.BO.paddleSpeedY       // 板子Y速度
 *   STILILA.BO.paddleFricX        // 板子X摩擦力
 *   STILILA.BO.paddleFricY        // 板子Y摩擦力
 *   STILILA.BO.paddleSmashRange   // 板子貫通範圍
 *   STILILA.BO.paddleUpLimit      // 板子上移限制
 *   STILILA.BO.paddleDownLimit    // 板子初始Y、下移限制
 *   STILILA.BO.ballSize           // 球大小
 *   STILILA.BO.ballSpeed          // 球速
 *   STILILA.BO.ballAtk            // 球攻擊力
 *
 * 使用例：
 *   STILILA.BO.ballAtk = 10;  // 球的攻擊力變為10
 *   STILILA.BO.paddleWidth = $gameParty.leader().def;   // 板子的寬度等於隊長的防禦力
 *   STILILA.BO.paddleSmashRange = Math.round($gameActors.actor(3).dex / 100);    // 板子的貫通範圍是3號角色的dex/100 (小數四捨五入)
 */

// 抓語法錯誤用，不過好像就不能用caller
//'use strict'
 
 
// 共通腳本檢測
if (typeof(STILILA) == 'undefined') {alert('未安裝STLLA_ScriptCore.js') ; window.close();}
STILILA.BO = {};


// 為了不讓變量名稱和其他腳本打架，包起來
(function() {
	
var parameters = PluginManager.parameters('STLLA_BreakoutMain');
var path = String(parameters['Image Path'] || 'img/breakout/');
var paddleImage = String(parameters['Paddle Image'] || '');
var ballImage = String(parameters['Ball Image'] || '');
var ballEXImage = String(parameters['EXBall Image'] || '');

var itemRate = Number(parameters['ItemDrop Rate'] || 35);
var breakEffect = Number(parameters['Break Effect'] || 2);
var blockVisible = Number(parameters['Block Display'] || 0);

var paddleWidth = Number(parameters['Paddle Width'] || 120);
var paddleHeight = Number(parameters['Paddle Height'] || 15);
var paddleSpeedX = Number(parameters['Paddle SpeedX'] || 15);
var paddleSpeedY = Number(parameters['Paddle SpeedY'] || 3);
var paddleFricX = Number(parameters['Paddle FrictionX'] || 3);
var paddleFricY = Number(parameters['Paddle FrictionY'] || 3);
var smashRange = Number(parameters['Paddle Smash Range'] || 5);
var ballSize = Number(parameters['Ball Size'] || 24);
var ballSpeed = Number(parameters['Ball Speed'] || 7);
var ballAtk = Number(parameters['Ball AtkPower'] || 1);
var blockHP = (parameters['Block HP'].split(',') || [1,2,3,4,-1]);
var blockColor = (parameters['Block Color'].split(',') || [,11,17,2,10]);	
var comboPlus = Number(parameters['Combo Bonus Increase'] || 0.2);		
var breakID = Number(parameters['Block Break Animation'] || 1);
var reboundID = Number(parameters['Block Rebound Animation'] || 2);
var wallSE = (parameters['Wall Rebound SE'].split(',') || ['Knock', 100, 90]);		
var paddleSE = (parameters['Paddle Rebound SE'].split(',') || ['Crossbow', 120, 85]);				
var paddleDownLimit = Number(parameters['Paddle Down Limit'] || 516);
var paddleUpLimit = Number(parameters['Paddle Up Limit'] || 516);
var scoreVar = Number(parameters['Score Value'] || 0);
var timeVar = Number(parameters['Time Value'] || 0);
var comboVar = Number(parameters['MaxCombo Value'] || 0);

var lookTimeSE = (parameters['Count Down SE'].split(',') || ['Decision2',130,100]);
var timeUpSE = (parameters['TimeUp SE'].split(',') || ['Bell3',130,100]);
var timeUpSwitch = Number(parameters['TimeUp Switch'] || 0);

var scoreText = String(parameters['Score Text'] || '分數：');
var comboText = String(parameters['Combo Text'] || ' COMBO');
var timeText = String(parameters['Time Text'] || '剩餘時間：');

STILILA.BO.path = path;
STILILA.BO.paddleImage = paddleImage;
STILILA.BO.ballImage = ballImage;
STILILA.BO.ballEXImage = ballEXImage;
STILILA.BO.barrierImage = String(parameters['Barrier Image'] || '');
STILILA.BO.barrierY = Number(parameters['Barrier Y'] || 516);

STILILA.BO.paddleWidth = paddleWidth;
STILILA.BO.paddleHeight = paddleHeight;
STILILA.BO.paddleSpeedX = paddleSpeedX;
STILILA.BO.paddleSpeedY = paddleSpeedY;
STILILA.BO.paddleFricX = paddleFricX;
STILILA.BO.paddleFricY = paddleFricY;
STILILA.BO.paddleDownLimit = paddleDownLimit;
STILILA.BO.paddleUpLimit = paddleUpLimit;

STILILA.BO.paddleSmashRange = smashRange;
STILILA.BO.ballSize = ballSize;
STILILA.BO.ballSpeed = ballSpeed;
STILILA.BO.ballAtk = ballAtk;

STILILA.BO.blockHP = blockHP;
STILILA.BO.blockColor = blockColor;
STILILA.BO.comboPlus = comboPlus;
STILILA.BO.breakID = breakID;
STILILA.BO.reboundID = reboundID;
STILILA.BO.wallSE = wallSE;
STILILA.BO.paddleSE = paddleSE;

STILILA.BO.scoreVar = scoreVar;
STILILA.BO.timeVar = timeVar;
STILILA.BO.comboVar = comboVar;
STILILA.BO.lookTimeSE = lookTimeSE;
STILILA.BO.timeUpSE = timeUpSE;
STILILA.BO.timeUpSwitch = timeUpSwitch;
STILILA.BO.scoreText = scoreText;
STILILA.BO.comboText = comboText;
STILILA.BO.timeText = timeText;

STILILA.BO.buff = [(parameters['Buff0 Icon'].split(',') || [35,51]),
						(parameters['Buff1 Icon'].split(',') || [37,53]),
						(parameters['Buff2 Icon'].split(',') || [38,54]),
						(parameters['Buff3 Icon'].split(',') || [39,55]),
						(parameters['Buff4 Icon'].split(',') || [42,58]),
						(parameters['Buff5 Icon'].split(',') || [46,62]),
						Number(parameters['Buff6 Icon'] || 77)
						];

STILILA.BO.turnCount = Number(parameters['Turn Frame'] || 60);


// 插件指令
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'BreakOut' || command === 'Breakout') {
        switch (args[0]) {
        case 'start':
			if (SceneManager._scene.constructor == Scene_Breakout) {
				SceneManager._scene.stageData['next'] = args[1];
			} else {
				// 磚塊可視
				var arg2 = Number(args[2]);
				arg2 = (arg2 >= 0 && arg2 <= 1) ? arg2 : $gameSystem.breakout['blockVisible'];
				// 破壞計算
				var arg3 = Number(args[3]);
				arg3 = (arg3 >= 0 && arg3 <= 2) ? arg3 : $gameSystem.breakout['breakEffect'];
				// 道具掉落
				var arg4 = Number(args[4]);
				arg4 = (arg4 >= 0) ? arg4 : $gameSystem.breakout['itemRate'];
				// 設定數據
				$gameTemp.breakoutStage = [args[1], arg2, arg3, arg4];
				
				// 紀錄BGM
				$gameTemp._mapBgm = AudioManager.saveBgm();
				$gameTemp._mapBgs = AudioManager.saveBgs();	
				// 停止Audio
				if (!$gameTemp.breakoutStage[0]['bgm'] || AudioManager._currentBgm.name != $gameTemp.breakoutStage[0]['bgm'][0]) {
					AudioManager.stopBgm();
				}
				AudioManager.stopBgs();
				AudioManager.stopMe();
				AudioManager.stopSe();
				// 初始化戰鬥資料
				STILILA.BO.initBattlerData();
				
				// 進入戰鬥
				SceneManager.push(Scene_Breakout);
			}
            break;
		case 'blockVisible':
			$gameSystem.breakout['blockVisible'] = Number(args[1]);
			break;
		case 'itemRate':
			$gameSystem.breakout['itemRate'] = Number(args[1]);
			break;
		case 'breakEffect':
			$gameSystem.breakout['breakEffect'] = Number(args[1]);
			break;
		}
	}
}

// ----------------------------------------------
// ● 初始化戰鬥資料
// ----------------------------------------------
STILILA.BO.initBattlerData = function() {
	var data = $gameParty.leader().actor().meta;
	var bo = STILILA.BO;
	
	bo.paddleImage = (data['BO_PaddleImage'] ? String(data['BO_PaddleImage']) : paddleImage);
	bo.ballImage = (data['BO_BallImage'] ? String(data['BO_BallImage']) : ballImage);
	bo.ballEXImage = (data['BO_BallEXImage'] ? String(data['BO_BallEXImage']) : ballEXImage);
	
	bo.paddleWidth = (data['BO_PaddleWidth'] ? bo.evalData(data['BO_PaddleWidth']) : paddleWidth);
	bo.paddleHeight = (data['BO_PaddleHeight'] ? bo.evalData(data['BO_PaddleHeight']) : paddleHeight);
	bo.paddleSpeedX = (data['BO_PaddleSpeedX'] ? bo.evalData(data['BO_PaddleSpeedX']) : paddleSpeedX);
	bo.paddleSpeedY = (data['BO_PaddleSpeedY'] ? bo.evalData(data['BO_PaddleSpeedY']) : paddleSpeedY);
	bo.paddleSmashRange = (data['BO_PaddleSmashRange'] ? bo.evalData(data['BO_PaddleSmashRange']) : smashRange);
	bo.paddleUpLimit = (data['BO_PaddleUpLimit'] ? bo.evalData(data['BO_PaddleUpLimit']) : paddleUpLimit);
	bo.paddleDownLimit = (data['BO_PaddleDownLimit'] ? bo.evalData(data['BO_PaddleDownLimit']) : paddleDownLimit);
	bo.paddleFricX = (data['BO_PaddleFricX'] ? bo.evalData(data['BO_PaddleFricX']) : paddleFricX);
	bo.paddleFricY = (data['BO_PaddleFricY'] ? bo.evalData(data['BO_PaddleFricY']) : paddleFricY);
	bo.ballSize = (data['BO_BallSize'] ? bo.evalData(data['BO_BallSize']) : ballSize);
	bo.ballSpeed = (data['BO_BallSpeed'] ? bo.evalData(data['BO_BallSpeed']) : ballSpeed);
	bo.ballAtk = (data['BO_BallAtk'] ? bo.evalData(data['BO_BallAtk']) : ballAtk);

	if (data['BO_commonEV']) {
		$gameTemp.reserveCommonEvent(Number(data['BO_commonEV']));
		$gameTroop._interpreter.setupReservedCommonEvent(); // 不知為什麼用$gameMap會導致之後的公共事件不執行，所以改$gameTroop
		$gameTroop.updateInterpreter();
	}

}
// ----------------------------------------------
// ● 解讀值
// ----------------------------------------------
STILILA.BO.evalData = function(text) {
	var me = $gameParty.leader();
	var v = $gameVariables._data;
	var value = eval(text);
	if (isNaN(value)) {value = 0;}
	value = Math.round(value);
	return value;
}

// =========================================================================================================
// ■ Bitmap
// =========================================================================================================
// ----------------------------------------------
// ● 挖透明塊
//   x,y,w,h：X, Y, 寬, 高
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
// ● 挖透明圈
//   ox, oy：圓心
//   radius：半徑
// ----------------------------------------------
Bitmap.prototype.drawCircleAlpha = function(ox, oy, radius) {
    var context = this._context;
    context.save();
    context.fillStyle = 'green';
    context.beginPath();
	context.globalCompositeOperation = 'destination-out'
    context.arc(ox, oy, radius, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
    this._setDirty();
};

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
// ■ Game_Temp
// =========================================================================================================
var _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	_Game_Temp_initialize.call(this);
	this.timeStopCount = 0;  // 暫停用變數
	this.superStopCount = 0; // 超必殺暫停用變數
	this.pause = false;
}

// =========================================================================================================
// ■ Game_System
//   為了記憶一些變數
// =========================================================================================================
var _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_Game_System_initialize.call(this);
	this.breakout = {'blockVisible':blockVisible, 'breakEffect':breakEffect, 'itemRate':itemRate}
}

	
// =========================================================================================================
// ■ Game_Screen
//   為了上下搖
// =========================================================================================================
Game_Screen.prototype.startShake = function(power, speed, duration, type) {
    this._shakePower = power;
    this._shakeSpeed = speed;
    this._shakeDuration = duration;
	this._shakeType = (type || 0);
};


// =========================================================================================================
// ■ Sprite_Animation
//   加了更新判定
// =========================================================================================================
Sprite_Animation.prototype.updateMain = function() {
    if (this.isPlaying() && this.isReady() && !this._target.timeStopFlag && !$gameTemp.pause) {
        if (this._delay > 0) {
            this._delay--;
        } else {
            this._duration--;
            this.updatePosition();
            if (this._duration % this._rate === 0) {
                this.updateFrame();
            }
        }
    }
};

// =========================================================================================================
// ■ Spriteset_Base
//   為了上下搖
// =========================================================================================================
Spriteset_Base.prototype.updatePosition = function() {
    var screen = $gameScreen;
    var scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));
	if ($gameScreen._shakeType == 1) {
		this.y += Math.round(screen.shake());
	} else {
		this.x += Math.round(screen.shake());
	}
		
};

	
})();



// ↓以下全新定義

// =========================================================================================================
// ■ Game_BreakoutPaddle
//   打磚塊板子的數據
// =========================================================================================================
function Game_BreakoutPaddle() {
	this.initialize.apply(this, arguments);
}
// ----------------------------------------------
// ● 初始化
//   sprite：Sprite_Breakout對象
// ----------------------------------------------
Game_BreakoutPaddle.prototype.initialize = function(sprite) {
	this.sprite = sprite;
	this.reset();
	this.x = 0;
	this.y = 0;
	this.nowSpeedX = 0;
	this.nowSpeedY = 0;

	this.balls = [];    // 板上的球
	this.timeStopFlag = false;
	this.superStopMove = 0;
	this.timeStopMove = 0;
}
// ----------------------------------------------
// ● 性能重置
// ----------------------------------------------
Game_BreakoutPaddle.prototype.reset = function() {
	var bo = STILILA.BO;
	this.upLimit = bo.paddleUpLimit;
	this.downLimit = bo.paddleDownLimit;
	this.speedX = bo.paddleSpeedX;
	this.speedY = bo.paddleSpeedY;
	this.speedXPlusTime = 0;
	this.speedYPlusTime = 0;
	this.fricX = bo.paddleFricX;
	this.fricY = bo.paddleFricY;
	this.smashRange = bo.paddleSmashRange;
	this.width = bo.paddleWidth; 
	this.widthPlusTime = 0;
	this.height = bo.paddleHeight;
	this.heightPlusTime = 0;
	this.ballAtkBuff = null;
	this.ballSpeedBuff = null;
	this.ballSmashBuff = false;
	this.changeSpeedX(0,0);
	this.changeSpeedY(0,0);
	this.changeWidth(1,0);
	this.changeHeight(1,0);

}
// ----------------------------------------------
// ● 改變X速度
// ----------------------------------------------
Game_BreakoutPaddle.prototype.changeSpeedX = function(speed, time) {
	var time = time || 0;
	this.speedX = STILILA.BO.paddleSpeedX + speed;
	this.speedXPlusTime = time;
}
// ----------------------------------------------
// ● 改變Y速度
// ----------------------------------------------
Game_BreakoutPaddle.prototype.changeSpeedY = function(speed, time) {
	var time = time || 0;
	this.speedY = STILILA.BO.paddleSpeedY + speed;
	this.speedYPlusTime = time;
}
// ----------------------------------------------
// ● 改變寬
// ----------------------------------------------
Game_BreakoutPaddle.prototype.changeWidth = function(rate, time) {
	var time = time || 0;
	this.width = STILILA.BO.paddleWidth * rate;
	this.smashRange = STILILA.BO.paddleSmashRange * rate;
	this.widthPlusTime = time;
	// 刷新板子Sprite
	this.sprite.scale.x = rate;
}
// ----------------------------------------------
// ● 改變高
// ----------------------------------------------
Game_BreakoutPaddle.prototype.changeHeight = function(rate, time) {
	var time = time || 0;
	this.height = STILILA.BO.paddleHeight * rate;
	this.heightPlusTime = time;
	// 刷新板子Sprite
	this.sprite.scale.y = rate;
}

// ----------------------------------------------
// ● 被超必殺暫停中
// ----------------------------------------------
Game_BreakoutPaddle.prototype.isSuperStop = function() {
	return ($gameTemp.superStopCount > 0 && this.superStopMove == 0)
}
// ----------------------------------------------
// ● 被時停中
// ----------------------------------------------
Game_BreakoutPaddle.prototype.isTimeStop = function() {
	return ($gameTemp.timeStopCount > 0 && this.timeStopMove == 0)
}

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Game_BreakoutPaddle.prototype.update = function() {
	
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
	
	
	if (this.speedXPlusTime > 0) {
		this.speedXPlusTime--;
		if (this.speedXPlusTime == 0) {
			this.changeSpeedX(0,0);
		}
	}
	if (this.speedYPlusTime > 0) {
		this.speedYPlusTime--;
		if (this.speedYPlusTime == 0) {
			this.changeSpeedY(0,0);
		}
	}
	if (this.widthPlusTime > 0) {
		this.widthPlusTime--;
		if (this.widthPlusTime == 0) {
			this.changeWidth(1,0);
		}
	}
	if (this.heightPlusTime > 0) {
		this.heightPlusTime--;
		if (this.heightPlusTime == 0) {
			this.changeHeight(1,0);
		}
	}
	
}

// =========================================================================================================
// ■ Game_BreakoutBall
//   打磚塊球的數據
// =========================================================================================================
function Game_BreakoutBall() {
	this.initialize.apply(this, arguments);
}
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Game_BreakoutBall.prototype.initialize = function() {
	this.reset();
	this.flying = false;
	this.x = 0;
	this.y = 0;
	this.dirX = 0.7;
	this.dirY = -1.3;
	this.dead = false;      // 死亡(落地)判定
	this.sprite = null;
	this.timeStopFlag = false;
	this.superStopMove = 0;
	this.timeStopMove = 0;
	this.afterimageCount = 0;
	//this.angle = Math.randomInt(30) + 30;
}
// ----------------------------------------------
// ● 性能重置
// ----------------------------------------------
Game_BreakoutBall.prototype.reset = function() {
	this.speed = STILILA.BO.ballSpeed;
	this.speedPlusTime = 0;
	this.speedPlusAni = 0;
	this.atk = STILILA.BO.ballAtk;
	this.atkPlusTime = 0;
	this.atkPlusAni = 0;
	this.size = STILILA.BO.ballSize;
	this.smashing = false;
}

// ----------------------------------------------
// ● 改變攻擊力
// ----------------------------------------------
Game_BreakoutBall.prototype.changeAtk = function(atk, time, aniID) {
	var time = time || 0;
	var aniID = aniID || 0;
	this.atk = STILILA.BO.ballAtk + atk;
	this.atkPlusTime = time;
	
	// 移除循環動畫
	if (aniID === 0 && this.atkPlusAni > 0) {
		this.sprite.endLoopAnimation(this.atkPlusAni);
		this.atkPlusAni = 0;
	}
	// 播放循環動畫
	if (aniID > 0) {
		if (this.atkPlusAni > 0) { // 解除原本的
			this.sprite.endLoopAnimation(this.atkPlusAni);
		}
		this.sprite.addLoopAnimation(aniID);
		this.atkPlusAni = aniID;
	}
	
}

// ----------------------------------------------
// ● 改變速度
// ----------------------------------------------
Game_BreakoutBall.prototype.changeSpeed = function(speed, time, aniID) {
	var time = time || 0;
	var aniID = aniID || 0;
	this.speed = STILILA.BO.ballSpeed + speed;
	this.speedPlusTime = time;
	
	// 移除循環動畫
	if (aniID === 0 && this.speedPlusAni > 0) {
		this.sprite.endLoopAnimation(this.speedPlusAni);
		this.speedPlusAni = 0;
	}
	// 播放循環動畫
	if (aniID > 0) {
		if (this.speedPlusAni > 0) { // 解除原本的
			this.sprite.endLoopAnimation(this.speedPlusAni);
		}
		this.sprite.addLoopAnimation(aniID);
		this.speedPlusAni = aniID;
	}
	
}
// ----------------------------------------------
// ● 被超必殺暫停中
// ----------------------------------------------
Game_BreakoutBall.prototype.isSuperStop = function() {
	return ($gameTemp.superStopCount > 0 && this.superStopMove == 0)
}
// ----------------------------------------------
// ● 被時停中
// ----------------------------------------------
Game_BreakoutBall.prototype.isTimeStop = function() {
	return ($gameTemp.timeStopCount > 0 && this.timeStopMove == 0)
}
// ----------------------------------------------
// ● 結束殘影
// ----------------------------------------------
Game_BreakoutBall.prototype.endAfterimages = function() {
	this.sprite.endAfterimages();
	this.afterimageCount = 0;
}

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Game_BreakoutBall.prototype.update = function() {
	
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
	
	if (this.speedPlusTime > 0) {
		this.speedPlusTime--;
		if (this.speedPlusTime == 0) {
			this.changeSpeed(0,0);
		}
	}
	if (this.atkPlusTime > 0) {
		this.atkPlusTime--;
		if (this.atkPlusTime == 0) {
			this.changeAtk(0,0);
		}
	}
	// 貫通時出現殘影
	if (this.smashing) {
		if (this.afterimageCount === 1) {
			this.sprite.createAfterimage();
			this.afterimageCount = 0;
		} else {
			this.afterimageCount++;
		}
	}
}



// =========================================================================================================
// ■ Game_BreakoutBlock
//   磚塊的數據
//   type：類型(1~5)
// =========================================================================================================
function Game_BreakoutBlock() {
	this.initialize.apply(this, arguments);
}
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Game_BreakoutBlock.prototype.initialize = function(type,score,x,y,w,h) {
	this.type = type;
	this.hp = this.maxhp = STILILA.BO.blockHP[this.type-1];
	this.score = score;
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.sprite = null;
	// (0：爆炸、1：重傷、2：輕傷、3：沒事)
	this.health = 3;
}
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Game_BreakoutBlock.prototype.update = function() {
}

// ----------------------------------------------
// ● 受傷
// ----------------------------------------------
Game_BreakoutBlock.prototype.damage = function(val) {
	if (this.maxhp == -1) {return;} // 不會受傷
	this.hp = Math.max(this.hp - val,0);
}

// ----------------------------------------------
// ● 恢復
// ----------------------------------------------
Game_BreakoutBlock.prototype.recover = function(val) {
	this.hp = Math.min(this.hp + val, this.maxhp);
	this.health = 3;
}

// =========================================================================================================
// ■ Sprite_Breakout
//   打磚塊物件(球、板子之類)用的Sprite
// =========================================================================================================
function Sprite_Breakout() {
    this.initialize.apply(this, arguments);
}
Sprite_Breakout.prototype = Object.create(Sprite_Base.prototype);
Sprite_Breakout.prototype.constructor = Sprite_Breakout;

// 鏡像屬性
Object.defineProperty(Sprite_Breakout.prototype, 'mirror', {
    get: function() {
        return this._mirror;
    },
    set: function(value) {
		this._mirror = value
		if (this._mirror === true) {
			this.scale.x *= -1;
		} else {
			this.scale.x = Math.abs(this.scale.x);
		}
    },
    configurable: true
});

// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Sprite_Breakout.prototype.initialize = function(battler) {
    Sprite_Base.prototype.initialize.call(this);
	this.battler = battler || null;
	this._loopAnimationSprites = [];
	this._loopAnimationList = [];
	this.timeStopFlag = false;
	this.afterimages = [];
}

// ----------------------------------------------
// ● 做成殘影
// ----------------------------------------------
Sprite_Breakout.prototype.createAfterimage = function() {
	var time = 9;
	var sprite = new Sprite();
	sprite.bitmap = this.bitmap;
	sprite.x = this.x;
	sprite.y = this.y;
	sprite.anchor.x = this.anchor.x;
	sprite.anchor.y = this.anchor.y;
	this.afterimages.push([sprite, time]);
	this.parent.addChild(sprite);
}

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Sprite_Breakout.prototype.update = function() {
	if (this.timeStopFlag || $gameTemp.pause) {return;}
    Sprite_Base.prototype.update.call(this);
	this.updateAfterimages();
    this.updateLoopAnimationSprites();
};

// ----------------------------------------------
// ● 定期更新殘影
// ----------------------------------------------
Sprite_Breakout.prototype.updateAfterimages = function() {
	for (var i=this.afterimages.length-1; i>=0 ;i--) {
		var imageData = this.afterimages[i];
		imageData[0].opacity = 8 * imageData[1];
		imageData[1]--;
		if (imageData[1] === 0) {
			this.parent.removeChild(imageData[0]);
			this.afterimages.remove(imageData);
		}
	}
}

// ----------------------------------------------
// ● 結束殘影
// ----------------------------------------------
Sprite_Breakout.prototype.endAfterimages = function() {
	for (var i=this.afterimages.length-1; i>=0 ;i--) {
		var imageData = this.afterimages[i];
		this.parent.removeChild(imageData[0]);
	}
	this.afterimages.length = 0;
}

// ----------------------------------------------
// ● 被時停
// ----------------------------------------------
Sprite_Breakout.prototype.startTimeStop = function() {
	this.timeStopFlag = true;
	this.setColorTone([0, 0, 0, 255]);
};

// ----------------------------------------------
// ● 解除時停
// ----------------------------------------------
Sprite_Breakout.prototype.endTimeStop = function() {
	this.timeStopFlag = false;
	this.setColorTone([0, 0, 0, 0]);
};

// ----------------------------------------------
// ● 定期更新動畫
// ----------------------------------------------
Sprite_Base.prototype.updateAnimationSprites = function() {
    if (this._animationSprites.length > 0) {
        var sprites = this._animationSprites.clone();
        this._animationSprites = [];
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.isPlaying()) {
                this._animationSprites.push(sprite);
            } else {
                sprite.remove();
            }
        }
    }
};
// ----------------------------------------------
// ● 停止戰鬥動畫
// ----------------------------------------------
Sprite_Base.prototype.endAnimation = function() {
    for (var i = 0; i < this._animationSprites.length; i++) {
        var sprite = this._animationSprites[i];
        sprite.remove();
    }
	this._animationSprites.length = 0;
};

// ----------------------------------------------
// ● 定期更新循環動畫
// ----------------------------------------------
Sprite_Breakout.prototype.updateLoopAnimationSprites = function() {
    if (this._loopAnimationSprites.length > 0) {
        var sprites = this._loopAnimationSprites.clone();
        this._loopAnimationSprites.length = 0;
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.isPlaying()) {
                this._loopAnimationSprites.push(sprite);
            } else {
                sprite.remove();
            }
        }
    }
	if (this._loopAnimationSprites.length == 0 && this._loopAnimationList.length > 0) {
		// 將首項抽出再加到最尾，用來循環所有動畫
		var animationID = this._loopAnimationList.shift();
		this._loopAnimationList.push(animationID);
		this.startLoopAnimation($dataAnimations[animationID], false, 0);
		
	}
};
// ----------------------------------------------
// ● 追加循環動畫
// ----------------------------------------------
Sprite_Breakout.prototype.addLoopAnimation = function(id) {
	this._loopAnimationList.push(id);
}
// ----------------------------------------------
// ● 開始循環動畫
// ----------------------------------------------
Sprite_Breakout.prototype.startLoopAnimation = function(animation, mirror, delay) {
    var sprite = new Sprite_Animation();
    sprite.setup(this._effectTarget, animation, mirror, delay);
    this.parent.addChild(sprite);
    this._loopAnimationSprites.push(sprite);
};

// ----------------------------------------------
// ● 停止循環動畫
//   id：要停止的循環動畫ID
// ----------------------------------------------
Sprite_Breakout.prototype.endLoopAnimation = function(id) {
	var id = id || 0;
    for (var i = 0; i < this._loopAnimationSprites.length; i++) {
        var sprite = this._loopAnimationSprites[i];
        sprite.remove();
    }
	// Sprite記錄清空
	this._loopAnimationSprites.length = 0;
	
	if (id) { // 如果有指定ID的情況
		this._loopAnimationList.remove(id); // 移除此循環動畫
		// 如果還有循環動畫可以放
		if (this._loopAnimationList.length > 0) {
			// 將首項抽出再加到最尾，用來循環所有動畫
			var animationID = this._loopAnimationList.shift();
			this._loopAnimationList.push(animationID);
			this.startLoopAnimation($dataAnimations[animationID], false, 0);
		}
	} else { // 如果沒有，全解除
		this._loopAnimationList.length = 0;
	} 
	
	

};


// =========================================================================================================
// ■ Sprite_BreakoutBlock
//   磚塊圖像
// =========================================================================================================

function Sprite_BreakoutBlock() {
	this.initialize.apply(this, arguments);
}
Sprite_BreakoutBlock.prototype = Object.create(Sprite_Breakout.prototype);
Sprite_BreakoutBlock.prototype.constructor = Sprite_BreakoutBlock;
// ----------------------------------------------
// ● 初始化
//   bitmap：磚塊樣本圖片
//   blockObj：Game_BreakoutBlock
// ----------------------------------------------
Sprite_BreakoutBlock.prototype.initialize = function(source, blockObj, w, h, color) {	
	Sprite_Breakout.prototype.initialize.call(this);
	this.block = blockObj;
	this.x = this.block.x;
	this.y = this.block.y;
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.updateOpacity();
	this.bitmap = new Bitmap(w,h);
	this.drawBlock(source, w, h, color);
}
// ----------------------------------------------
// ● 描繪項目
// ----------------------------------------------
Sprite_BreakoutBlock.prototype.drawBlock = function(source, w, h, color) {	
	this.bitmap.blt(source, 0,0,w,h,0,0);
	if (color) {
		this.bitmap.fillRect(2,2,w-4,h-4,color);
	}
}
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Sprite_BreakoutBlock.prototype.update = function() {
	Sprite_Breakout.prototype.update.call(this);
	this.x = this.block.x;
	this.y = this.block.y;
	this.updateOpacity();
}
// ----------------------------------------------
// ● 更新透明度
// ----------------------------------------------
Sprite_BreakoutBlock.prototype.updateOpacity = function() {
	if (this.block.hp != 0 && $gameTemp.breakoutStage[1]) {
		this.opacity = 200;
	} else {
		this.opacity = 0;
	}
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
	var x = 0;
	var y = Graphics.height - height;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.opacity = 0;
	this.contents.fontSize = 20;
	this._backSprite = new Sprite();
	this._backSprite.bitmap = new Bitmap(width, height);
	this._backSprite.bitmap.gradientFillRect(0, 16, width, height, 'rgba(0,0,0,0)', 'black', 1);
	this.addChildToBack(this._backSprite);
	this.nowHP = $gameParty.leader().hp;
	this.nowMP = $gameParty.leader().mp;
    this.refresh();
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
    return this.fittingHeight(2);
};
// ----------------------------------------------
// ● 刷新
// ----------------------------------------------
Window_BreakoutState.prototype.refresh = function() {
	this.contents.clear();
	this.drawActorHp($gameParty.leader(), 0, 0, 120);
	this.drawActorMp($gameParty.leader(), 0, 32, 120);
}
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Window_BreakoutState.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	// HP或MP有變動時，刷新狀態
	if ((this.nowHP != $gameParty.leader().hp) || (this.nowMP != $gameParty.leader().mp)) {
		this.refresh();
		this.nowHP = $gameParty.leader().hp;
		this.nowMP = $gameParty.leader().mp;
	}
}

// =========================================================================================================
// ■ Sprite_BreakoutScore
//   打磚塊場景的分數窗，雖然是分數窗，但因為Window重疊會有異空間所以改用Sprite
// =========================================================================================================
function Sprite_BreakoutScore() {
    this.initialize.apply(this, arguments);
}
Sprite_BreakoutScore.prototype = Object.create(Sprite.prototype);
Sprite_BreakoutScore.prototype.constructor = Sprite_BreakoutScore;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Sprite_BreakoutScore.prototype.initialize = function() {
	Sprite.prototype.initialize.call(this);
	this.x = 560;
	this.y = Graphics.height - 120;
	this.bitmap = new Bitmap(Graphics.width-this.x, Graphics.height-this.y);
	this.bitmap.fontSize = 22;
	this.score = 0;
    this.refresh(0,1);
};
// ----------------------------------------------
// ● 刷新
// ----------------------------------------------
Sprite_BreakoutScore.prototype.refresh = function(scorePlus, comboRate) {
	if (!STILILA.BO.scoreVar) {return;}
	this.bitmap.clear();
	this.score = Math.round(this.score + scorePlus*comboRate);
	this.bitmap.drawText(STILILA.BO.scoreText+this.score, 0, 0, this.bitmap.width, this.bitmap.height);
	
}

// =========================================================================================================
// ■ Sprite_BreakoutTime
//   打磚塊場景的計時窗，問題同上
// =========================================================================================================
function Sprite_BreakoutTime() {
    this.initialize.apply(this, arguments);
}
Sprite_BreakoutTime.prototype = Object.create(Sprite.prototype);
Sprite_BreakoutTime.prototype.constructor = Sprite_BreakoutTime;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Sprite_BreakoutTime.prototype.initialize = function(time) {
	Sprite.prototype.initialize.call(this);
	this.x = 560;
	this.y = Graphics.height-60;
	this.bitmap = new Bitmap(Graphics.width-this.x, Graphics.height-this.y);
	this.bitmap.fontSize = 22;
	this.time = time;
	if (time) {
		this.refresh(time);
	}
	if (STILILA.BO.lookTimeSE) {
		this.lookTimeSE = {'name':STILILA.BO.lookTimeSE[0],'pan':0,'pitch':STILILA.BO.lookTimeSE[1],'volume':STILILA.BO.lookTimeSE[2]};
	}
	
};
// ----------------------------------------------
// ● 刷新
// ----------------------------------------------
Sprite_BreakoutTime.prototype.refresh = function(time) {
	this.bitmap.clear();
	// 不計時的情況中斷
	if (time == -1) { 
		// this.time = 0;
		return;
	} 
	if (time < 10) { // 時間快到的時候時間為黃色
		if (STILILA.BO.lookTimeSE) { AudioManager.playStaticSe(this.lookTimeSE);} // 播放音效
		this.bitmap.textColor = 'yellow';
	} else {
		this.bitmap.textColor = 'white';
	}
	this.time = time;
	this.bitmap.drawText(STILILA.BO.timeText+time, 2, 0, this.bitmap.width, this.bitmap.height);

};

// =========================================================================================================
// ■ Sprite_BreakoutSkill
//   打磚塊場景的技能欄
// =========================================================================================================
function Sprite_BreakoutSkill() {
    this.initialize.apply(this, arguments);
}
Sprite_BreakoutSkill.prototype = Object.create(Sprite.prototype);
Sprite_BreakoutSkill.prototype.constructor = Sprite_BreakoutSkill;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Sprite_BreakoutSkill.prototype.initialize = function(skillList) {
	Sprite.prototype.initialize.call(this);
	this.x = 180;
	this.y = Graphics.height - (Window_Base._iconHeight*2+12);
	this.bitmap = new Bitmap(Graphics.width-this.x, Graphics.height-this.y);
	this.bitmap.fontSize = 22;
	this.selectBitmap = new Bitmap(Window_Base._iconWidth, Window_Base._iconHeight);
	this.selectBitmap.fillAll('yellow');
	this.selectBitmap.drawRectAlpha(3, 3, Window_Base._iconWidth-6, Window_Base._iconHeight-6);
	this.selectBitmap2 = new Bitmap(Window_Base._iconWidth, Window_Base._iconHeight);
	this.selectBitmap2.fillAll('red');
	this.selectBitmap2.drawRectAlpha(3, 3, Window_Base._iconWidth-6, Window_Base._iconHeight-6);
	this.selectBitmap2.context.beginPath();
	this.selectBitmap2.context.lineWidth = '3';
	this.selectBitmap2.context.strokeStyle = 'red';
	this.selectBitmap2.context.moveTo(0,0);
	this.selectBitmap2.context.lineTo(Window_Base._iconWidth,Window_Base._iconHeight);
	this.selectBitmap2.context.stroke();
	
	this.nowHP = $gameParty.leader().hp;
	this.nowMP = $gameParty.leader().mp;
	
	this.skillList = skillList;
	this.index = 0;
};
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Sprite_BreakoutSkill.prototype.update = function() {
	Sprite.prototype.update.call(this);
	// HP或MP有變動時，刷新狀態
	if ((this.nowHP != $gameParty.leader().hp) || (this.nowMP != $gameParty.leader().mp)) {
		this.refresh(this.skillList, this.index);
		this.nowHP = $gameParty.leader().hp;
		this.nowMP = $gameParty.leader().mp;
	}
};
// ----------------------------------------------
// ● 刷新
// ----------------------------------------------
Sprite_BreakoutSkill.prototype.refresh = function(skillList, index) {
	this.bitmap.clear();
	if (skillList.length == 0) {return;}
	
	this.skillList = skillList;
	this.index = index;
	
    var iconBitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
	var startX = 0;
	var startY = 0;

	for (var i=0; i < skillList.length; i++) {
		var skill = skillList[i];
		var sx = skill.iconIndex % 16 * pw;
		var sy = Math.floor(skill.iconIndex / 16) * ph;
		// 不能使用時以半透明描繪
		if (!$gameParty.leader().canPaySkillCost(skill)) {
			this.bitmap.paintOpacity = 120;
		}
		// 描繪技能圖示
		this.bitmap.blt(iconBitmap, sx ,sy ,pw ,ph ,startX ,startY);
		this.bitmap.paintOpacity = 255;
		// 描繪選擇框
		if (index == i) {
			if ($gameParty.leader().canPaySkillCost(skill)) {
				this.bitmap.blt(this.selectBitmap, 0 ,0 ,pw ,ph ,startX ,startY);
			} else {
				this.bitmap.blt(this.selectBitmap2, 0 ,0 ,pw ,ph ,startX ,startY);
			}
			
		}
		startX += pw;
		if (startX >= 320) {
			startX = 0;
			startY += ph;
		} 
	}
};



// =========================================================================================================
// ■ Sprite_BreakoutSkillNote
//   打磚塊場景的技能切換提示
// =========================================================================================================
function Sprite_BreakoutSkillNote() {
    this.initialize.apply(this, arguments);
}
Sprite_BreakoutSkillNote.prototype = Object.create(Sprite.prototype);
Sprite_BreakoutSkillNote.prototype.constructor = Sprite_BreakoutSkillNote;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Sprite_BreakoutSkillNote.prototype.initialize = function() {
	Sprite.prototype.initialize.call(this);
	this.x = 0;
	this.y = 0;
	this.bitmap = new Bitmap(Graphics.width, 48);
	this.bitmap.fontSize = 22;	
	this.appearCount = 0;
	this.visible = false;
	this.anchor.x = 0.5;
};

// ----------------------------------------------
// ● 刷新
//   skill：skill對象
//   paddleY：板子Y
// ----------------------------------------------
Sprite_BreakoutSkillNote.prototype.refresh = function(skill, paddleY) {
	this.bitmap.clear();
	this.y = paddleY;
	// 取得要描繪的技能icon
	var iconBitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
	var sx = skill.iconIndex % 16 * pw;
	var sy = Math.floor(skill.iconIndex / 16) * ph;
	
	// 描繪技能圖示
	var textWidth = this.bitmap.measureTextWidth(skill.name);
	var startX = Graphics.width/2 - textWidth/2 - pw/2;
	
	// 描繪時的透明度
	if ($gameParty.leader().canPaySkillCost(skill)) {
		this.bitmap.paintOpacity = 255;
	}  else {
		this.bitmap.paintOpacity = 120;
	}
	this.bitmap.blt(iconBitmap, sx ,sy ,pw ,ph ,startX ,0);
	this.bitmap.drawText(skill.name, pw/2, 0, Graphics.width, 36, 'center');
	this.appearCount = 90;
	this.visible = true;
};

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Sprite_BreakoutSkillNote.prototype.update = function() {
	Sprite.prototype.update.call(this);
	if (this.appearCount) {
		this.appearCount--;
		if (this.appearCount > 75) { this.y-=3; }
		this.opacity = 225 * this.appearCount/40;
	} else {
		this.visible = false;
	}
}


// =========================================================================================================
// ■ Sprite_BreakoutBuffList
//   打磚塊場景裝Buff圖示的Sprite
// =========================================================================================================
function Sprite_BreakoutBuffList() {
    this.initialize.apply(this, arguments);
}
Sprite_BreakoutBuffList.prototype = Object.create(Sprite.prototype);
Sprite_BreakoutBuffList.prototype.constructor = Sprite_BreakoutBuffList;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Sprite_BreakoutBuffList.prototype.initialize = function() {
	Sprite.prototype.initialize.call(this);
	this.anchor.x = 0.5;
	var startX = -24*(7/2);
	for (var i=0; i<7; i++) {
		this.addChild(new Sprite_BreakoutBuff(i,startX));
		startX += 24;
	}
};


// =========================================================================================================
// ■ Sprite_BreakoutBuff
//   打磚塊場景的Buff圖示
// =========================================================================================================
function Sprite_BreakoutBuff() {
    this.initialize.apply(this, arguments);
}
Sprite_BreakoutBuff.prototype = Object.create(Sprite.prototype);
Sprite_BreakoutBuff.prototype.constructor = Sprite_BreakoutBuff;

// ----------------------------------------------
// ● 初始化
//   buff：buff類型(0：寬度變化、1：高度變化、2：橫向速度變化、3：縱向速度變化、4：球攻擊力變化、5：球速變化、6：球貫通)
// ----------------------------------------------
Sprite_BreakoutBuff.prototype.initialize = function(type, x) {
	Sprite.prototype.initialize.call(this);
	this.x = x;
	this.bitmap = new Bitmap(24, 24);
	//this.anchor.x = 0.5;
	this.type = type;
};

// ----------------------------------------------
// ● 刷新 (是否icon改成對應技能/道具的)
// ----------------------------------------------
Sprite_BreakoutBuff.prototype.refresh = function(val, time, iconIndex) {
	this.bitmap.clear();
	var time = Number(time); 
	var val = Number(val); 
	var iconIndex = iconIndex || 0;
	// 取得要描繪的技能icon
	var iconBitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;

	switch (this.type) {
	case 0: case 1:
		if (val>=1) {
			var iconIndex = STILILA.BO.buff[this.type][0];
		} else {
			var iconIndex = STILILA.BO.buff[this.type][1];
		}	
		break;
	case 2: case 3: case 4: case 5:
		if (val>=0) {
			var iconIndex = STILILA.BO.buff[this.type][0];
		} else {
			var iconIndex = STILILA.BO.buff[this.type][1];
		}	
		break;
	case 6:
		var iconIndex = STILILA.BO.buff[this.type];
		break;
	}
	
	var sx = iconIndex % 16 * pw;
	var sy = Math.floor(iconIndex / 16) * ph;
	
	this.bitmap.blt(iconBitmap,sx ,sy ,pw ,ph ,0 ,0, 24, 24);

	this.maxTime = this.nowTime = time;
	this.visible = true;
}

// ----------------------------------------------
// ● 移除buff圖示
// ----------------------------------------------
Sprite_BreakoutBuff.prototype.removeBuff = function() {
	this.bitmap.clear();
	this.nowTime = this.maxTime = 0;
	this.visible = false;
}

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Sprite_BreakoutBuff.prototype.update = function() {
	Sprite.prototype.update.call(this);
	if (this.maxTime>0) {
		this.nowTime--;
		var rate = this.nowTime/this.maxTime;
		var h = 24 * rate
		this.setFrame(0, 0, 24, h);
		if (this.nowTime == 0) {
			this.maxTime = 0;
			this.visible = false;
		}
	}
}

// =========================================================================================================
// ■ Sprite_Collider
//   顯示物件判定的Sprite
// =========================================================================================================
function Sprite_Collider() {
    this.initialize.apply(this, arguments);
}
Sprite_Collider.prototype = Object.create(Sprite.prototype);
Sprite_Collider.prototype.constructor = Sprite_Collider;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Sprite_Collider.prototype.initialize = function(obj, objColliders) {
	Sprite.prototype.initialize.call(this);
	this.obj = obj;
	this.objColliders = objColliders;
};

// ----------------------------------------------
// ● 判定刷新
//   color：顏色
// ----------------------------------------------
Sprite_Collider.prototype.refresh = function(objColliders, color) {
	this.removeChildren();
	for (var i=0; i<objCollider.length; i++) {
		var rect = objCollider[i];
		var sprite = new Sprite();
		var bitmap = new Bitmap(rect.width, rect.height);
		bitmap.fillRect(0,0,rect.width,rect.height,color);
		sprite.bitmap = bitmap;
		sprite.x = rect.x;
		sprite.y = rect.y;
		this.addChild(sprite);
	}
	this.objColliders = objColliders;
}

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Sprite_Collider.prototype.update = function() {
	Sprite.prototype.update.call(this);
	// 更新判定位置
	for (var i=0; i<this.objCollider.length; i++) {
		this.children[i].x = this.objCollider[i].x;
		this.children[i].y = this.objCollider[i].y;
	}
}

// =========================================================================================================
// ■ Window_BreakoutCombo
//   打磚塊場景的連擊窗
// =========================================================================================================
function Window_BreakoutCombo() {
    this.initialize.apply(this, arguments);
}
Window_BreakoutCombo.prototype = Object.create(Window_Base.prototype);
Window_BreakoutCombo.prototype.constructor = Window_BreakoutCombo;
// ----------------------------------------------
// ● 初始化
// ----------------------------------------------
Window_BreakoutCombo.prototype.initialize = function() {
	var x = 0;
	var y = 80;
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.opacity = 0;
	this.contents.fontSize = 22;
	this.appearCount = 0;
	this.contentsOpacity = 0;
    this.refresh(0,1);
};
// ----------------------------------------------
// ● 寬
// ----------------------------------------------
Window_BreakoutCombo.prototype.windowWidth = function() {
    return Graphics.width/2;
};
// ----------------------------------------------
// ● 高 
// ----------------------------------------------
Window_BreakoutCombo.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};
// ----------------------------------------------
// ● 刷新
// ----------------------------------------------
Window_BreakoutCombo.prototype.refresh = function(combo) {
	// 記錄最大連擊
	if (STILILA.BO.comboVar && combo > $gameVariables.value(STILILA.BO.comboVar)) {
		$gameVariables.setValue(STILILA.BO.comboVar, combo);
	}
	if (combo > 1) {
		this.contents.clear();
		this.drawText(combo+STILILA.BO.comboText, 2, 0, this.windowWidth())
		this.appearCount = 121;
	}
}
// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Window_BreakoutCombo.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	if (this.appearCount) {
		this.appearCount--;
		this.contentsOpacity = 255 * (this.appearCount / 20);
	}
};


// =========================================================================================================
// ■ Scene_Breakout
//   打磚塊場景
// =========================================================================================================
function Scene_Breakout() {
    this.initialize.apply(this, arguments);
}

Scene_Breakout.prototype = Object.create(Scene_Base.prototype);
Scene_Breakout.prototype.constructor = Scene_Breakout;

// ----------------------------------------------
// ● 初始化 
// ----------------------------------------------
Scene_Breakout.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
	// 取得關卡資料
	var data = BlockGroup[$gameTemp.breakoutStage[0]];
	this.loadStageData(data);
	
	this.firstOpen = false;
	this.loseWait = 0;
	this.fallWait = 0;
	this.clearWait = 0;
	this.nowCombo = 0;
	this.timeLimit = 0;
	this.judge = false;
	
	this.skillIndex = 0;

	$gameTemp.timeStopCount = 0; 
	$gameTemp.superStopCount = 0;
	$gameTemp.pause = false;
	
	// 設置音效
	if (STILILA.BO.wallSE) {
		this.wallSE = {'name':STILILA.BO.wallSE[0],'pan':0,'pitch':STILILA.BO.wallSE[1],'volume':STILILA.BO.wallSE[2]};
	}
	if (STILILA.BO.paddleSE) {
		this.paddleSE = {'name':STILILA.BO.paddleSE[0],'pan':0,'pitch':STILILA.BO.paddleSE[1],'volume':STILILA.BO.paddleSE[2]};
	}
	// 變數重置
	if (STILILA.BO.timeUpSwitch) {$gameSwitches.setValue(STILILA.BO.timeUpSwitch, false);}
	if (STILILA.BO.scoreVar) {$gameVariables.setValue(STILILA.BO.scoreVar, 0);}
	if (STILILA.BO.timeVar) {$gameVariables.setValue(STILILA.BO.timeVar, 0);}
	if (STILILA.BO.comboVar) {$gameVariables.setValue(STILILA.BO.comboVar, 0);}

};



// ----------------------------------------------
// ● 載入(複製)關卡資料
//   不直接代入是為了以後能修改
// ----------------------------------------------
Scene_Breakout.prototype.loadStageData = function(data) {
	this.stageData = {
		'name':data['name'],                  // 關卡名稱
		'frontImage':data['frontImage'],      // 前景圖
		'backImage':data['backImage'],        // 背景圖
		'clearImage':data['clearImage'],       // 過關時的圖
		'blocks':data['blocks'],               // 磚塊數據
		'blockScore':data['blockScore'],       // 磚塊分數
		'w':data['w'],                         // 場地寬
		'h':data['h'],                         // 場地高
		'bRow':data['bRow'],                   // 磚塊橫排數量
		'bCol':data['bCol'],                   // 磚塊縱排數量
		'bWidth':data['bWidth'],               // 磚塊寬 
		'bHeight':data['bHeight'],             // 磚塊高   
		'fallDamage':data['fallDamage'],         // 掉球時傷害量
		'remainToClear':data['remainToClear'],     // 剩多少塊過關
		'bgm':data['bgm'],                         // BGM
		'clearME':data['clearME'],                // 通關ME
		'loseME':data['loseME'],                  // 失敗ME
		'startCommon':data['startCommon'],       // 開始時啟動幾號公共事件(0為不啟動)
		'clearCommon':data['clearCommon'],        // 贏了啟動幾號公共事件
		'loseCommon':data['loseCommon'],           // 輸了啟動幾號公共事件
		'timeLimit':data['timeLimit'],            // 時限(0為無時限)
		'next':data['next'],                      // 下一關
		'itemRare':(data['itemRare'] || 0),              // 掉落道具的最高稀有度
	}
}

// ----------------------------------------------
// ● 建立各種物件
// ----------------------------------------------
Scene_Breakout.prototype.create = function() {
	// 做成背景
	//this.createBackground();

	//super
	Scene_Base.prototype.create.call(this); 

	this.spriteSet = new Spriteset_Base();
	this.addChild(this.spriteSet);
	
	// 做成背景圖
	this.backSprite = new Sprite();
	this.spriteSet._baseSprite.addChild(this.backSprite);
	
	// 做成過關圖
	this.clearSprite = new Sprite();
	this.spriteSet._baseSprite.addChild(this.clearSprite);
	
	// 做成前景圖
	this.frontSprite = new Sprite();
    this.frontSprite.bitmap = new Bitmap(Graphics.width, Graphics.height) 
	this.spriteSet._baseSprite.addChild(this.frontSprite);


	// 做成板子Sprite、Bitmap
	this.paddleSprite = new Sprite_Breakout();
	if (STILILA.BO.paddleImage) {
		this.paddleSprite.bitmap = ImageManagerST.loadBreakout(STILILA.BO.paddleImage);
		this.paddleSprite.anchor.x = 0.5;
		this.paddleSprite.anchor.y = 1;
	} else {
		this.paddleSprite.bitmap = new Bitmap(STILILA.BO.paddleWidth, STILILA.BO.paddleHeight);
		this.paddleSprite.bitmap.fillRect(0,0,STILILA.BO.paddleWidth,STILILA.BO.paddleHeight,'gray');
		this.paddleSprite.bitmap.fillRect(STILILA.BO.paddleWidth/2 - STILILA.BO.paddleSmashRange, 0, STILILA.BO.paddleSmashRange*2+1, STILILA.BO.paddleHeight, 'red')
		this.paddleSprite.anchor.x = 0.5;
		this.paddleSprite.anchor.y = 1;
	}
	
	// 做成板子物件
	this.gamePaddle = new Game_BreakoutPaddle(this.paddleSprite);
	this.gamePaddle.x = this.paddleSprite.x = this.stageData['w']/2;
	this.gamePaddle.y = this.paddleSprite.y = this.gamePaddle.downLimit;
	this.spriteSet._baseSprite.addChild(this.paddleSprite);
	
	
	// 磚塊的Sprite群組
	this.gameBlocks = []
	this.blocksSprite = new Sprite();  
	this.spriteSet._baseSprite.addChild(this.blocksSprite);

	// 技能切換提示
	this.skillNote = new Sprite_BreakoutSkillNote();
	this.spriteSet._baseSprite.addChild(this.skillNote);
	
	// 狀態圖示
	this.buffSprites = new Sprite_BreakoutBuffList();
	this.buffSprites.x = this.gamePaddle.x;
	this.buffSprites.y = this.gamePaddle.y;
	this.spriteSet._baseSprite.addChild(this.buffSprites);
	
	// 護罩
	this.barrierSprite = new Sprite();
	this.barrierSprite.anchor.y = 0.5;
	if (STILILA.BO.barrierImage) {
		this.barrierSprite.bitmap = ImageManagerST.loadBreakout(STILILA.BO.barrierImage)
	} else {
		this.barrierSprite.bitmap = new Bitmap(Graphics.width, 3);
		this.barrierSprite.bitmap.fillAll('white');
	}
	this.barrierSprite.visible = false;
	this.barrierCount = 0; // 出現時間
	this.barrierY = this.barrierSprite.y = STILILA.BO.barrierY; // 護罩Y
	this.spriteSet._baseSprite.addChild(this.barrierSprite);
	
	// 飛道的Sprite群組
	this.gameBullets = [];
	this.bulletSprites = new Sprite(); 
	this.spriteSet._baseSprite.addChild(this.bulletSprites);
	
	// 道具的Sprite群組
	this.gameItems = [];
	this.itemSprites = new Sprite(); 
	this.spriteSet._baseSprite.addChild(this.itemSprites);
	
	// 球Sprite群組
	this.gameBalls = [];
	this.ballSprites = new Sprite();
	this.spriteSet._baseSprite.addChild(this.ballSprites);
	
	// 做成球的Bitmap
	if (STILILA.BO.ballImage) {
		this.ballBitmap = ImageManagerST.loadBreakout(STILILA.BO.ballImage);
	} else {
		var size = STILILA.BO.ballSize;
		this.ballBitmap = new Bitmap(size, size);
		this.ballBitmap.drawCircle(size/2, size/2, size/2, 'yellow');
	}
	if (STILILA.BO.ballEXImage) {
		this.ballEXBitmap = ImageManagerST.loadBreakout(STILILA.BO.ballEXImage);
	} else {
		var size = STILILA.BO.ballSize;
		this.ballEXBitmap = new Bitmap(size, size);
		this.ballEXBitmap.drawCircle(size/2, size/2, size/2, 'red');
	}
	// 做成球物件
	this.createBall(1);

	// 作成判定塊檢視區
	this.colliderView = new Sprite();
	this.colliderView.visible = false;
	this.spriteSet._baseSprite.addChild(this.colliderView);
	
	
	// 做成 Window 物件放置層
	this.createWindowLayer();
	
	// 做成各種視窗
	this.stateWindow = new Window_BreakoutState();
	this.comboWindow = new Window_BreakoutCombo();
	this.addWindow(this.stateWindow);
	this.addWindow(this.comboWindow);
	
	this.skills = [];
	this.skillWindow = new Sprite_BreakoutSkill(this.skills);
	this.scoreWindow = new Sprite_BreakoutScore();
	this.timeWindow = new Sprite_BreakoutTime(this.stageData['timeLimit'])

	this.addChild(this.skillWindow);
	this.addChild(this.scoreWindow);
	this.addChild(this.timeWindow);
	
	// 做成暫停訊息Sprite
	this.pauseSprite = new Sprite();
	this.pauseSprite.y = Graphics.height/2 - 40;
	this.pauseSprite.bitmap = new Bitmap(Graphics.width, 80);
	this.pauseSprite.visible = false;
	this.pauseSprite.bitmap.fillRect(0, 0, Graphics.width, 80, 'rgba(0,0,0,0.6)');
	this.pauseSprite.bitmap.drawText('PAUSE', 0, 0, Graphics.width, 80, 'center')
	this.addChild(this.pauseSprite);

	
	// 作成對話窗
	this._messageWindow = new Window_Message();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function(window) {this.addWindow(window);}, this);

	// 進行關卡準備
	this.prepareStageObject();
	
	
};

// ----------------------------------------------
// ● 準備關卡物件
// ----------------------------------------------
Scene_Breakout.prototype.prepareStageObject = function() {
	// 經過時間(計算回合用)
	this.timeCount = 0;

	// 準備背景圖
	this.backSprite.bitmap = ImageManagerST.loadBreakout(this.stageData['backImage']); 
	
	// 準備過關圖
	this.clearSprite.opacity = 0;
	this.clearSprite.bitmap = ImageManagerST.loadBreakout(this.stageData['clearImage']);

	// 準備前景圖
	this.frontBitmap = ImageManagerST.loadBreakout(this.stageData['frontImage']);
	this.frontSprite.bitmap.clear();

	// 做成樣本磚塊圖片
	this.blockBitmap = new Bitmap(this.stageData['bWidth'],this.stageData['bHeight']);
	this.blockBitmap.fillAll('black');
	this.blockBitmap.fillRect(1, 1, this.stageData['bWidth']-2, this.stageData['bHeight']-2, 'white');
	this.blockBitmap.drawRectAlpha(2, 2, this.stageData['bWidth']-4, this.stageData['bHeight']-4);

	// 清空磚塊Sprite
	for (var i=0; i < this.gameBlocks.length; i++) {
		this.gameBlocks[i].sprite = null;
	}
	this.blocksSprite.removeChildren();

	// 做成磚塊物件
	this.gameBlocks.length = 0; // 數組清空
	
	for (var h=0; h < this.stageData['bCol']; h++) {
		for (var w=0; w < this.stageData['bRow']; w++) {
			var number = w+h*this.stageData['bRow'];
			var blockType = this.stageData['blocks'][number];
			if (!this.stageData['blocks'][number]) {continue;} // type為0的時候跳過
			var block = new Game_BreakoutBlock(this.stageData['blocks'][number], this.stageData['blockScore'][blockType-1], this.stageData['bWidth']*w + this.stageData['bWidth']/2, this.stageData['bHeight']*h + this.stageData['bHeight']/2, this.stageData['bWidth'], this.stageData['bHeight']);
		    // 取得磚塊色
			var cType = STILILA.BO.blockColor[block.type-1];
			if (cType) {
				if (parseInt(cType)) {
					var color = this.stateWindow.textColor(cType);
				} else {
					var color = cType;
				}
			// 沒設定的情況
			} else {
				var color = null;
			} 
			var sprite = new Sprite_BreakoutBlock(this.blockBitmap, block, this.stageData['bWidth'], this.stageData['bHeight'], color);
			block.sprite = sprite;
			this.gameBlocks.push(block);
			this.blocksSprite.addChild(sprite);
		}
	}

	
	// 勝負判定取消
	this.judge = false;
	
	// 重設計數器
	if (this.stageData['timeLimit'] > 0) {
		this.timeLimit = this.stageData['timeLimit'] * 60
		this.timeWindow.refresh(this.stageData['timeLimit']);
	} else if (this.stageData['timeLimit'] == -1) { // -1時，保持目前計時
	
	} else { // 0時，計數歸零、隱藏計數器
		this.timeLimit = 0;
		this.timeWindow.refresh(-1);
	}
		
		
	// 播放BGM
	if (this.stageData['bgm']){
		var bgm = {'name':this.stageData['bgm'][0],'pan':0,'pitch':this.stageData['bgm'][1],'volume':this.stageData['bgm'][2]};
		AudioManager.playBgm(bgm);
	}
	//記錄快取Key
	this._cacheKey = [ImageManagerST.getCacheKey(STILILA.BO.path, this.stageData['backImage']),
					ImageManagerST.getCacheKey(STILILA.BO.path, this.stageData['clearImage']),
					ImageManagerST.getCacheKey(STILILA.BO.path, this.stageData['frontImage']),
					// 還有球和板子的圖
					]
	
	// 重新運行Scene_Breakout.isReady()
	SceneManager._sceneStarted = false;
}


// ----------------------------------------------
// ● 等待物件載入完畢
// ----------------------------------------------
Scene_Breakout.prototype.isReady = function() {
	if (Scene_Base.prototype.isReady.call(this) && this.clearSprite.bitmap.isReady() && this.backSprite.bitmap.isReady() && this.frontBitmap.isReady()) {
		this.frontSprite.bitmap.blt(this.frontBitmap, 0, 0, this.frontBitmap.width, this.frontBitmap.height, 0, 0);
		return true
	} else {
		return false
	}
}

// ----------------------------------------------
// ● 進入場景
// ----------------------------------------------
Scene_Breakout.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    //this.playTitleMusic();
	if (!this.firstOpen) { // 如果第一次進入，執行淡入
		this.firstOpen = true;
		this.startFadeIn(this.fadeSpeed(), false);
	}
	// 執行開始事件
	if (this.stageData['startCommon']) {
		$gameTemp.reserveCommonEvent(this.stageData['startCommon']);
		$gameTroop._interpreter.setupReservedCommonEvent();
		// 隱藏視窗
		this.hideWindow();
	}
};

// ----------------------------------------------
// ● 忙碌判定(沒改)
// ----------------------------------------------
Scene_Breakout.prototype.isBusy = function() {
	return (Scene_Base.prototype.isBusy.call(this));
};

// ----------------------------------------------
// ● 隱藏視窗
// ----------------------------------------------
Scene_Breakout.prototype.hideWindow = function() {
	this.stateWindow.visible = false;
	this.comboWindow.visible = false;
	this.scoreWindow.visible = false;
	this.timeWindow.visible = false;
	this.skillWindow.visible = false;
	this.skillNote.visible = false;
}
// ----------------------------------------------
// ● 顯示視窗
// ----------------------------------------------
Scene_Breakout.prototype.showWindow = function() {
	this.stateWindow.visible = true;
	this.comboWindow.visible = true;
	this.scoreWindow.visible = true;
	this.timeWindow.visible = true;
	this.skillWindow.visible = true;
	this.skillNote.visible = true;
}

// ----------------------------------------------
// ● 隱藏物件(通關瞬間用)
// ----------------------------------------------
Scene_Breakout.prototype.hideObject = function() {
	// 球
	this.ballSprites.visible = false;
	// 板子
	this.resetPaddle();
	this.paddleSprite.hide();
}
// ----------------------------------------------
// ● 顯示物件(遊戲再開始用)
// ----------------------------------------------
Scene_Breakout.prototype.showObject = function() {
	// 球
	this.ballSprites.visible = true;
	// 板子
	this.paddleSprite.show();
}

// ----------------------------------------------
// ● 定期更新
// ----------------------------------------------
Scene_Breakout.prototype.update = function() {
	//super
	Scene_Base.prototype.update.call(this);
	
	// 更新Screen
	$gameScreen.update();
	
	// 事件中
	if ($gameTroop.isEventRunning() && !this.isBusy()) {
		$gameTroop.updateInterpreter();
		return;
	}

	// 輸的話進入輸掉的處理
	if (this.loseWait > 0) {
		this.loseWait--;
		this.updateLose();
		return;
	}
	
	// 過關的話進入過關處理
	if (this.clearWait > 0) {
		this.clearWait--;
		this.updateClear();
		return;
	} 

	// 落球時等球回來
	if (this.fallWait > 0) {
		this.fallWait--;
		if (this.fallWait == 0) { this.ballReturn(); }
		return;
	}
	
	// 暫停
	if (Input.isTriggered('escape') && !(this.judge)) {
		SoundManager.playCancel();
		$gameTemp.pause = !$gameTemp.pause;
		this.pauseSprite.visible = $gameTemp.pause;
		if ($gameTemp.pause) {
			this.hideWindow();
		} else {
			this.showWindow();
		}
	}
	if ($gameTemp.pause) {return;}
	
	
	// 計時
	if (this.timeLimit > 0 && !(this.judge) && $gameTemp.timeStopCount <= 0) {
		this.timeLimit--;
		if (this.timeLimit % 60 == 0) {
			this.timeWindow.refresh(this.timeLimit/60);
		}
		// 時間到爆炸
		if (this.timeLimit == 0) {
			$gameTemp.breakoutTimeUp = true;
			this.timeUp();
			this.updateSprite();
			return;
		}
	}
	
	// 時停計數
	if ($gameTemp.timeStopCount > 0) {
		$gameTemp.timeStopCount--;
		if ($gameTemp.timeStopCount == 0) {
			this.endTimeStop();
		}
	}
	
	// 回合計算
	if ($gameTemp.timeStopCount <= 0) {
		this.timeCount++;
		if (this.timeCount % STILILA.BO.turnCount == 0) {
			this.updateTurn();
			this.timeCount = 0;
		}
	}
	
	// 護罩判定
	if (this.barrierAppearing()) {
		this.barrierCount--;
		if (this.barrierCount === 0) {
			this.disappearBarrier();
		} else {
			if (this.barrierCount < 60) { // 快結束時閃爍
				this.barrierSprite.opacity = (this.barrierCount % 2 === 0) ? 255 : 0;
			}
		}
	}

	this.updateDebug();
	this.updateInput();
	this.updateEnemyPlugin();
	this.updateSkillPlugin();
	this.updateItemPlugin();
	this.updateObject();
	this.updateSprite();

};

// ----------------------------------------------
// ● 定期更新－測試鍵
// ----------------------------------------------
Scene_Breakout.prototype.updateDebug = function() {
	
	if (typeof(InputEX) === 'undefined') {return;}
	
	// 造球
	if (InputEX.isTriggered(49)) {
		this.createBall(5,true);
	}
	// 世界！！
	if (InputEX.isTriggered(50)) {
		this.startTimeStop(300);
		this.gamePaddle.timeStopMove = 300;
	}
}

// ----------------------------------------------
// ● 定期更新－回合(增加時執行一次)
// ----------------------------------------------
Scene_Breakout.prototype.updateTurn = function() {
}

// ----------------------------------------------
// ● 定期更新－操作
// ----------------------------------------------
Scene_Breakout.prototype.updateInput = function() {
	
	if (this.isBusy() || this.judge) {return;} // 場景忙碌時、分勝負時以下中斷

	// 如果狀態窗沒顯示，顯示視窗
	if (!this.stateWindow.visible) {
		this.showWindow();
	}
	
	if (Input.isPressed('left')) {
		this.gamePaddle.nowSpeedX = -this.gamePaddle.speedX;
	}
	if (Input.isPressed('right')) {
		this.gamePaddle.nowSpeedX = this.gamePaddle.speedX;
	}
	
	if (Input.isPressed('up')) {
		this.gamePaddle.nowSpeedY = -this.gamePaddle.speedY;
	}
	
	if (Input.isPressed('down')) {
		this.gamePaddle.nowSpeedY = this.gamePaddle.speedY;
	}
	// 切換技能
	if (Input.isTriggered('pageup')) {
		this.skillChange(-1);
	}
	if (Input.isTriggered('pagedown')) {
		this.skillChange(1);
	}
	
	// 確定鍵的情況
	if (Input.isTriggered('ok')) {
		// 板子上有球，發射球
		if (this.gamePaddle.balls.length > 0) {
			// 因為要移除元素所以倒過來計算
			for (var i=this.gamePaddle.balls.length-1; i>=0; i--) {
				this.gamePaddle.balls[i].flying = true;
				this.gamePaddle.balls[i].dirX = (0.3 + Math.randomInt(5)*0.1) * (this.gamePaddle.nowSpeedX < 0 ? -1 : 1);
				this.gamePaddle.balls[i].dirY = -(2-Math.abs(this.gamePaddle.balls[i].dirX));
				this.gamePaddle.balls.remove(this.gamePaddle.balls[i]);
			}
		}
		// 板子上沒球時，放招
		else
		{
			this.useSkill(this.skillIndex);// 放招
		}
	}
}

// ----------------------------------------------
// ● 定期更新－物件
// ----------------------------------------------
Scene_Breakout.prototype.updateObject = function() {
	
	if (this.judge) {return;}
	
	this.gamePaddle.update();
	
	// 更新板子移動
	if (!this.gamePaddle.isSuperStop() && !this.gamePaddle.isTimeStop()) {
		if (this.gamePaddle.nowSpeedX) {
			var paddleMoveX = this.gamePaddle.x;
			this.gamePaddle.x += this.gamePaddle.nowSpeedX;
			if (this.gamePaddle.x < 0) {this.gamePaddle.x = 0;}
			if (this.gamePaddle.x > this.stageData['w']) {this.gamePaddle.x = this.stageData['w'];}
			// 板子上的球跟著移動
			for (var i=0; i<this.gamePaddle.balls.length; i++) {
				this.gamePaddle.balls[i].x += this.gamePaddle.x - paddleMoveX
			}
		}
		if (this.gamePaddle.nowSpeedY) {
			var paddleMoveY = this.gamePaddle.y;
			this.gamePaddle.y += this.gamePaddle.nowSpeedY;
			var upLimit = this.gamePaddle.upLimit;
			if (this.gamePaddle.y < upLimit) {this.gamePaddle.y = upLimit;}
			if (this.gamePaddle.y > this.gamePaddle.downLimit) {this.gamePaddle.y = this.gamePaddle.downLimit;}
			// 板子上的球跟著移動
			for (var i=0; i<this.gamePaddle.balls.length; i++) {
				this.gamePaddle.balls[i].y += this.gamePaddle.y - paddleMoveY;
			}
		}
	}
	// 更新球
	var deadBalls = [];
	for (var b=0; b < this.gameBalls.length; b++) {
		var ball = this.gameBalls[b];
		ball.update();
		
		if (ball.flying && !ball.dead && !ball.isSuperStop() && !ball.isTimeStop()) {
			ball.x += ball.speed * ball.dirX;
			ball.y += ball.speed * ball.dirY;
			
			// 撞到牆左
			if (ball.x < ball.size/2) {
				ball.x = ball.size/2;
				ball.dirX *= -1;
				AudioManager.playSe(this.wallSE);
			}
			// 撞到牆右
			if (ball.x > this.stageData['w'] - ball.size/2) {
				ball.x = this.stageData['w'] - ball.size/2;
				ball.dirX *= -1;
				AudioManager.playSe(this.wallSE);
			}
			// 撞到天花板
			if (ball.y < 0 + ball.size/2) {
				ball.y = 0 + ball.size/2;
				ball.dirY *= -1;
				AudioManager.playSe(this.wallSE);
			}
			// 撞到護罩
			if (this.barrierAppearing() && ball.y + ball.size/2 > this.barrierY) {
				ball.y = this.barrierY - ball.size/2;
				ball.dirY = -1;
				// 音效
				AudioManager.playSe(this.paddleSE);
			}
			
			
			// 撞到板子
			if ((ball.dirY > 0) && (ball.y <= this.gamePaddle.y) && (ball.y+ball.size/2 >= this.gamePaddle.y-this.gamePaddle.height)) { // Y軸判斷
				if (ball.x+ball.size/2 >= this.gamePaddle.x-this.gamePaddle.width/2 && ball.x-ball.size/2 <= this.gamePaddle.x+this.gamePaddle.width/2) { // X軸判斷
					
					// 貫通化取消
					this.ballSmashCancel(ball);
					
					// 反彈
					ball.dirY = -1;
					
					if (Math.abs(this.gamePaddle.nowSpeedX) > 0) {
						// 板往左
						if (this.gamePaddle.nowSpeedX < 0) {
							var rate = Math.max(-this.gamePaddle.nowSpeedX / this.gamePaddle.speedX, 0.1);
							if (ball.dirX > 0) { // 球往右，減速
								ball.dirX = Math.max(ball.dirX - rate, 0.6);
								ball.dirY = -(2 - ball.dirX);
							} else { // 球往左，加速
								ball.dirX = Math.max(ball.dirX - rate, -1.4);
								ball.dirY = -(2 + ball.dirX);
							}
							
						} else if (this.gamePaddle.nowSpeedX > 0) { // 板往右
							var rate = Math.max(this.gamePaddle.nowSpeedX / this.gamePaddle.speedX, 0.1);
							if (ball.dirX > 0) { // 球往右，加速
								ball.dirX = Math.min(ball.dirX + rate, 1.4);
								ball.dirY = -(2 - ball.dirX);
							} else { // 球往左，減速
								ball.dirX = Math.min(ball.dirX + rate, -0.6);
								ball.dirY = -(2 + ball.dirX);
							}
						}
					} else {
						// 板子靜止時
						if (ball.dirX > 0) {
							ball.dirX = 1;
						} else {
							ball.dirX = -1;
						}
					}

					if (ball.x+ball.size/2 <= this.gamePaddle.x-this.gamePaddle.width/2/5*3 && ball.dirX == 1) { // 20%位置
						ball.dirX *= -1;
						ball.dirY = -1;
					}
					
					if (ball.x-ball.size/2 >= this.gamePaddle.x+this.gamePaddle.width/2/5*3 && ball.dirX == -1) { // 80%位置
						ball.dirX *= -1;
						ball.dirY = -1;
					}
					// 連擊歸零
					this.nowCombo = 0;
					// 音效
					AudioManager.playSe(this.paddleSE);
					// 貫通化
					if (this.gamePaddle.smashRange && !this.gamePaddle.ballSmashBuff && ball.x >= this.gamePaddle.x-this.gamePaddle.smashRange && ball.x <= this.gamePaddle.x+this.gamePaddle.smashRange) {
						this.ballSmash(ball);
					}
					// 套用能力提升效果
					if (this.gamePaddle.ballAtkBuff) {
						var buff = this.gamePaddle.ballAtkBuff;
						ball.changeAtk(buff[0], buff[1], buff[2]);
						this.gamePaddle.ballAtkBuff = null;
					}
					if (this.gamePaddle.ballSpeedBuff) {
						var buff = this.gamePaddle.ballSpeedBuff;
						ball.changeSpeed(buff[0], buff[1], buff[2]);
						this.gamePaddle.ballSpeedBuff = null;
					}
					if (this.gamePaddle.ballSmashBuff) {
						this.ballSmash(ball);
						this.gamePaddle.ballSmashBuff = false;
					}
					this.buffSprites.children[4].removeBuff();
					this.buffSprites.children[5].removeBuff();
					this.buffSprites.children[6].removeBuff();
					this.gamePaddle.sprite.endLoopAnimation();
					
				}
			}
			
			// 掉球
			if (ball.y > this.stageData['h']+20) {
				ball.dead = true;
			}
			
			// 球撞到飛道
			for (var gb=0; gb < this.gameBullets.length; gb++) {
				var bullet = this.gameBullets[gb];
				if (bullet.ballInRect(ball)) {
					bullet.collideBall(ball);
				}
			}
			
			// 更新磚塊
			var blockCount = 0 // 計算剩餘磚塊數
			for (var i=0; i < this.gameBlocks.length; i++) {
				var block = this.gameBlocks[i];
				if (block.hp == 0) {continue;} // 磚塊HP == 0 的時候跳過
				var reachUp = 2                // 球心加點判定，避免穿透 
				var blockHit = false;         // 命中判定
				
				// 上判定
				if (ball.x+reachUp >= block.x - block.width/2 && ball.x-reachUp <= block.x + block.width/2 && 
					ball.y+reachUp >= block.y - block.height/2 && ball.y-reachUp <= block.y) {
					blockHit = true;
					if (!ball.smashing) {
						//ball.dirY *= -1;
						ball.dirY = -Math.abs(ball.dirY);
					}
				}
				
				// 下判定
				 if (ball.x+reachUp >= block.x - block.width/2 && ball.x-reachUp <= block.x + block.width/2 && 
					ball.y+reachUp >= block.y && ball.y-reachUp <= block.y + block.height/2) {
					blockHit = true;
					if (!ball.smashing) {
						//ball.dirY *= -1;
						ball.dirY = Math.abs(ball.dirY);
					}
				}
				
				// 左判定
				 if (ball.x+reachUp >= block.x - block.width/2 && ball.x-reachUp <= block.x && 
					ball.y+reachUp >= block.y - block.height/2 && ball.y-reachUp <= block.y + block.height/2) {
					blockHit = true;
					if (!ball.smashing) {
						//ball.dirX *= -1;
						ball.dirX = -Math.abs(ball.dirX);
					}
				}
				
				// 右判定
				 if (ball.x+reachUp >= block.x && ball.x-reachUp <= block.x + block.width/2 && 
					ball.y+reachUp >= block.y - block.height/2 && ball.y-reachUp <= block.y + block.height/2) {
					blockHit = true;
					if (!ball.smashing) {
						//ball.dirX *= -1;
						ball.dirX = Math.abs(ball.dirX);
					}
				}
				
				// 破壞物件
				if (blockHit) {
					if (ball.smashing) {
						block.damage(block.hp);
					} else {
						block.damage(ball.atk);
					}
					// 破壞運算
					this.breakBlock(block);
				}

				// 現有磚塊計數+1
				blockCount++;
			}
			
		} else { // 球還沒發射或是掉下去
			//ball.x += paddleMoveX;
			//ball.y += paddleMoveY;
			
		}	
		
		// 已經掉下去的球加進數組
		if (ball.dead) {
			deadBalls.push(ball);
		}
		
	}  // for (var b=0; b < this.gameBalls.length; b++) {
	
	
	// 更新飛道
	var deadBullets = []; // 記錄銷毀的飛道
	for (var gb=0; gb < this.gameBullets.length; gb++) {
		var bullet = this.gameBullets[gb];
		// 板子在範圍中
		if (bullet.paddleInRect(this.gamePaddle)) {
			bullet.collidePaddle(this.gamePaddle);
		}
		// 磚在範圍中
		for (var b=0; b <this.gameBlocks.length; b++) {
			var block = this.gameBlocks[b];
			if (block.hp == 0) {continue;} // 磚塊HP == 0 的時候跳過
			if (bullet.hitTargets.contains(block)) {continue;} // 已攻擊過跳過
			if (bullet.blockInRect(block)) {
				bullet.hitTargets.push(block); // 已攻擊記憶
				bullet.collideBlock(block); // 撞磚塊
				
			}
		}
		// 飛道撞牆檢測
		bullet.checkHitWall(this.stageData['w'], this.barrierY);
		
		// 離開螢幕的飛道加入移除判定
		if (bullet.isOutOfScreen()) { bullet.dead = true;}
		
		// 準備銷毀的飛道加進數組
		if (bullet.dead) {
			deadBullets.push(bullet);
		}
	}

	// 更新道具
	var deadItems = []; // 記錄銷毀的道具
	for (var i=0; i < this.gameItems.length; i++) {
		var item = this.gameItems[i];
		// 板子在範圍中
		if (item.paddleInRect(this.gamePaddle)) {
			this.getItem(item);
			item.dead = true;
		}
		// 離開畫面
		if (item.isOutOfScreen()) {item.dead = true;}
		// 準備銷毀的道具加進數組
		if (item.dead) {
			deadItems.push(item);
		}
	}
	
	
	// 移除已經掉落的球
	for (var i=0; i < deadBalls.length; i++) {
		this.deleteBall(deadBalls[i]);
	}
	
	// 銷毀飛道
	for (var i=0; i < deadBullets.length; i++) {
		this.deleteBullet(deadBullets[i]);
	}
	
	// 銷毀道具
	for (var i=0; i < deadItems.length; i++) {
		this.deleteItem(deadItems[i]);
	}

	// 掉球判斷
	if (this.gameBalls.length == 0) {
		this.fallBall();
	}

	// 摩擦力計算
	if (this.gamePaddle.nowSpeedX > 0) {
		this.gamePaddle.nowSpeedX = Math.max(this.gamePaddle.nowSpeedX - this.gamePaddle.fricX, 0);
	} else if (this.gamePaddle.nowSpeedX < 0) {
		this.gamePaddle.nowSpeedX = Math.min(this.gamePaddle.nowSpeedX + this.gamePaddle.fricX, 0);
	}
	
	if (this.gamePaddle.nowSpeedY > 0) {
		this.gamePaddle.nowSpeedY = Math.max(this.gamePaddle.nowSpeedY - this.gamePaddle.fricY, 0);
	} else if (this.gamePaddle.nowSpeedY < 0){
		this.gamePaddle.nowSpeedY = Math.min(this.gamePaddle.nowSpeedY + this.gamePaddle.fricY, 0);
	}

	// 過關判斷 (※未擊出球時，因為blockCount未定義無法比較，所以也是false)
	if (blockCount <= this.stageData['remainToClear'] && $gameTemp.timeStopCount <= 0) {
		this.toClear();
	}
	
	
}

// ----------------------------------------------
// ● 定期更新－圖像
// ----------------------------------------------
Scene_Breakout.prototype.updateSprite = function() {
	
	if (this.judge) {return;}
	
	// 更新板子位置
	this.paddleSprite.x = this.buffSprites.x = this.gamePaddle.x;
	this.paddleSprite.y = this.buffSprites.y = this.gamePaddle.y;
	//this.paddleSprite.update();
	
	// 更新球位置
	for (var i=0; i < this.gameBalls.length; i++) {
		var ball = this.gameBalls[i]
		ball.sprite.x = ball.x;
		ball.sprite.y = ball.y;
		//this.gameBalls[i].sprite.update();
	}

	// 更新飛道位置
	for (var i=0; i<this.gameBullets.length; i++) {
		var bullet = this.gameBullets[i];
		bullet.sprite.x = bullet.x;
		bullet.sprite.y = bullet.y;
	}
	
	// 更新道具位置
	for (var i=0; i < this.gameItems.length; i++) {
		var item = this.gameItems[i];
		item.sprite.x = item.x;
		item.sprite.y = item.y;
	}
	
}


// ----------------------------------------------
// ● 記錄分數、時間到變數
// ----------------------------------------------
Scene_Breakout.prototype.gameVarSet = function() {
	if (STILILA.BO.scoreVar) {$gameVariables.setValue(STILILA.BO.scoreVar, this.scoreWindow.score);}
	if (STILILA.BO.timeVar) {$gameVariables.setValue(STILILA.BO.timeVar, this.timeWindow.time);}
}

// ----------------------------------------------
// ● 掉球處理
// ----------------------------------------------
Scene_Breakout.prototype.fallBall = function() {
	// HP減少處理
	$gameParty.leader().setHp($gameParty.leader().hp - this.stageData['fallDamage']);
	$gameScreen.startShake(4, 14, 12, 1);
	SoundManager.playActorDamage();
	// 消去護罩
	this.disappearBarrier();
	// 輸了
	if ($gameParty.leader().hp <= 0) {
		this.loseWait = 90;
		AudioManager.fadeOutBgm(0.8);
		// 記錄分數、時間到變數
		this.gameVarSet();
		this.judge = true;
	} else {
		this.fallWait = 30;
	} 
}

// ----------------------------------------------
// ● 球回到板子上
// ----------------------------------------------
Scene_Breakout.prototype.ballReturn = function() {
	this.nowCombo = 0;
	// 板子數據重設
	this.resetPaddle();
	this.gamePaddle.nowSpeedX = 0;
	this.gamePaddle.nowSpeedY = 0;
	this.createBall(1);
	// 顯示球和板子
	this.showObject();
}

// ----------------------------------------------
// ● 時間到處理
// ----------------------------------------------
Scene_Breakout.prototype.timeUp = function() {
	// 固定球
	for (var i=0; i < this.gameBalls.length; i++) {
		this.gameBalls[i].flying = false;
	}
	// 播放SE
	AudioManager.playSe({'name':STILILA.BO.timeUpSE[0],'pan':0,'pitch':STILILA.BO.timeUpSE[1],'volume':STILILA.BO.timeUpSE[2]});
	if (STILILA.BO.timeUpSwitch) {$gameSwitches.setValue(STILILA.BO.timeUpSwitch, true);}
	// 輸了
	this.loseWait = 120;
	AudioManager.fadeOutBgm(0.8);
	// 記錄分數、時間到變數
	this.gameVarSet();
	this.judge = true;
}

// ----------------------------------------------
// ● 輸掉處理
// ----------------------------------------------
Scene_Breakout.prototype.updateLose = function() {
	switch (this.loseWait) {
	case 1:
		// 播放失敗ME
		if (this.stageData['loseME']) {
			AudioManager.playMe({'name':this.stageData['loseME'][0],'pan':0,'pitch':this.stageData['loseME'][1],'volume':this.stageData['loseME'][2]});
		}
		// 執行輸掉事件
		if (this.stageData['loseCommon']) {
			$gameTemp.reserveCommonEvent(this.stageData['loseCommon']);
			$gameTroop._interpreter.setupReservedCommonEvent();
		}
		// 隱藏視窗
		this.hideWindow();
		break;
	case 0:
		// 清除快取
		while (this._cacheKey.length > 0) {
			var key = this._cacheKey.shift();
			ImageManagerST.cacheRemove(key);
			
		}
		$gameParty.leader().setHp(1); // 補點血避免出去就GameOver
		SceneManager.pop();
		break;
	}
}

// ----------------------------------------------
// ● 過關瞬間處理
// ----------------------------------------------
Scene_Breakout.prototype.toClear = function() {
	// 固定球
	for (var i=0; i < this.gameBalls.length; i++) {
		this.gameBalls[i].y = this.stageData['h']+19;
		this.gameBalls[i].flying = false;
	}
	// 板子數據重設
	this.resetPaddle();
	// 消去護罩
	this.disappearBarrier();
	// 前景圖清除
    this.frontSprite.bitmap.clear();
	// 隱藏磚塊Sprite(磚塊物件HP = 0)
	for (var i=0; i < this.gameBlocks.length; i++) {
		this.gameBlocks[i].hp = 0;
	}
	// 隱藏球和板子
	this.hideObject();
	// 隱藏視窗
	this.hideWindow();
	
	// 記錄分數、時間到變數
	this.gameVarSet();
	
	// 如果還有下一關
	if (this.stageData['next']){ 
	
		// 關卡檢測
	    if (!BlockGroup[this.stageData['next']]) {
			alert('關卡名：'+this.stageData['next']+' 不存在於BlockGroup，請檢查設定')
			this.stageData['next'] = 0;
			// 閃光爆炸
			$gameScreen.startFlash([255,255,255,188], 80);
			AudioManager.playSe({'name':'Explosion2','pan':0,'pitch':90,'volume':90});
			$gameScreen.startShake(4, 14, 30, 1);
			// 淡出BGM
			AudioManager.fadeOutBgm(0.8);
			// 設置下階段的倒數
			this.clearWait = 150;
			// 顯示過關圖
			this.clearSprite.opacity = 255; 
			this.updateSprite();
			this.judge = true;
			return;
		}
			
		// 下一首BGM名稱不同時，淡出
		if ((BlockGroup[this.stageData['next']]['bgm'][0] != this.stageData['bgm'][0]) || (BlockGroup[this.stageData['next']]['bgm'][1] != this.stageData['bgm'][1])) {
			AudioManager.fadeOutBgm(0.8);
		}
		// 閃光爆炸
		$gameScreen.startFlash([255,255,255,108], 30);
		AudioManager.playSe({'name':'Explosion2','pan':0,'pitch':90,'volume':90});
		$gameScreen.startShake(3, 12, 5, 1);
		// 設置下階段的倒數
		this.clearWait = 90;
	// 接下來沒關卡	
	} else { 	
		// 閃光爆炸
		$gameScreen.startFlash([255,255,255,188], 80);
		AudioManager.playSe({'name':'Explosion2','pan':0,'pitch':90,'volume':90});
		$gameScreen.startShake(4, 14, 30, 1);
		// 淡出BGM
		AudioManager.fadeOutBgm(0.8);
		// 設置下階段的倒數
		this.clearWait = 150;
	}
	
	// 顯示過關圖
	this.clearSprite.opacity = 255; 
	this.updateSprite();
	this.judge = true;
}
// ----------------------------------------------
// ● 過關處理
// ----------------------------------------------
Scene_Breakout.prototype.updateClear = function() {
	switch (this.clearWait) {
	case 1: 
		// 播放過關ME
		if (this.stageData['clearME']) {
			AudioManager.playMe({'name':this.stageData['clearME'][0],'pan':0,'pitch':this.stageData['clearME'][1],'volume':this.stageData['clearME'][2]});
		}
		// 執行過關事件
		if (this.stageData['clearCommon']) {
			$gameTemp.reserveCommonEvent(this.stageData['clearCommon']);
			$gameTroop._interpreter.setupReservedCommonEvent();
		}
		break;
	case 0:
		// 清除快取
		while (this._cacheKey.length > 0) {
			var key = this._cacheKey.shift();
			ImageManagerST.cacheRemove(key);
		}
		// 有下一關時，進下一關
		if (this.stageData['next']) {
			// 取得關卡資料
			var data = BlockGroup[this.stageData['next']];
			this.loadStageData(data);
			// 重新準備
			this.prepareStageObject();
			// 釋放球物件和Sprite
			for (var i=this.gameBalls.length-1; i>=0; i--) {
				this.deleteBall(this.gameBalls[i]);
			}
			this.gameBalls.length = 0;
			this.ballSprites.removeChildren();
			
			// 球恢復位置
			this.ballReturn();
			// 刷新狀態窗
			//this.stateWindow.refresh();
			// 顯示視窗
			this.showWindow();
		// 不然回地圖畫面	
		} else {
			SceneManager.pop();
		}
		break;
	}
}

// ----------------------------------------------
// ● 重設板子
// ----------------------------------------------
Scene_Breakout.prototype.resetPaddle = function() {
	this.gamePaddle.reset();
	this.gamePaddle.sprite.endAnimation();
	this.gamePaddle.sprite.endLoopAnimation();
	// 移除buff圖示
	for (var i=0; i<this.buffSprites.children.length; i++) {
		this.buffSprites.children[i].removeBuff();
	}
}
// ----------------------------------------------
// ● 生成球
//   amount：生成數
//   shoot：生成後直接發射
// ----------------------------------------------
Scene_Breakout.prototype.createBall = function(amount, shoot) {
	var shoot = shoot || false;
	var balls = [];
	if (amount > 1) {
		var dx = 180 / (amount+1);
	} else {
		var dx = 90 + (Math.randomInt(7)*10) * (this.gamePaddle.nowSpeedX < 0 ? 1 : -1);
	}
	while (amount > 0) {
		amount--;
		var ball = new Game_BreakoutBall();
		ball.x = this.gamePaddle.x;
		ball.y = this.gamePaddle.y-this.gamePaddle.height-ball.size/2;
		this.gameBalls.push(ball);
		this.ballSprites.addChild(this.createBallSprite(ball));
		if (shoot) {
			ball.flying = true;
			var radian = dx * (amount+1);
			ball.dirX = Math.cos((radian * Math.PI / 180));
			ball.dirY = -(2-Math.abs(ball.dirX));
		} else {
			ball.flying = false;
			this.gamePaddle.balls.push(ball);
		}
		balls.push(ball);
	}
	return balls;
}
// ----------------------------------------------
// ● 生成球的Sprite
//   ballObj：Game_BreakoutBall 對象
// ----------------------------------------------
Scene_Breakout.prototype.createBallSprite = function(ballObj) {
	var sprite = new Sprite_Breakout();
	
	sprite.bitmap = this.ballBitmap;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	sprite.x = ballObj.x;
	sprite.y = ballObj.y;
	ballObj.sprite = sprite;
	
	if ($gameTemp.timeStopCount > 0) {
		ballObj.timeStopMove = 5;
	}
	return sprite;
}
// ----------------------------------------------
// ● 消除球
// ----------------------------------------------
Scene_Breakout.prototype.deleteBall = function(ball) {
	ball.sprite.endAnimation();
	ball.sprite.endLoopAnimation();
	ball.endAfterimages();
	this.gameBalls.remove(ball);
	this.ballSprites.removeChild(ball.sprite);
	ball.sprite = null;
}

// ----------------------------------------------
// ● 球貫通化
// ----------------------------------------------
Scene_Breakout.prototype.ballSmash = function(ball) {
	ball.smashing = true;
	ball.sprite.bitmap = this.ballEXBitmap;
}

// ----------------------------------------------
// ● 貫通化取消
// ----------------------------------------------
Scene_Breakout.prototype.ballSmashCancel = function(ball) {
	ball.smashing = false;
	ball.sprite.bitmap = this.ballBitmap;
}

// ----------------------------------------------
// ● 護罩出現
// ----------------------------------------------
Scene_Breakout.prototype.appearBarrier = function(time) {
	this.barrierCount = time;
	this.barrierSprite.visible = true;
	this.barrierSprite.opacity = 255;
}
// ----------------------------------------------
// ● 護罩出現中
// ----------------------------------------------
Scene_Breakout.prototype.barrierAppearing = function() {
	return (this.barrierCount > 0);
}
// ----------------------------------------------
// ● 護罩消失
// ----------------------------------------------
Scene_Breakout.prototype.disappearBarrier = function() {
	this.barrierCount = 0;
	this.barrierSprite.visible = false;
	this.barrierSprite.opacity = 0;
}
// ----------------------------------------------
// ● 破壞指定區域的前景圖
//   noCount：不算連擊
// ----------------------------------------------
Scene_Breakout.prototype.breakBlock = function(block, noCount) {
	var noCount = noCount || false;
	// 連擊數+1
	if (!noCount) {this.nowCombo += 1;}
	// 破碎運算－爆衣型
	if ($gameTemp.breakoutStage[2] === 2) {
		var hpRate = block.hp/block.maxhp;
		// 全毀
		if (block.hp == 0) {
			var x = block.x - block.width/2;
			var y = block.y - block.height/2;
			this.frontSprite.bitmap.drawRectAlpha(x, y, block.width, block.height);
			var r = Math.min(block.width*0.9, block.height*0.9)
			this.frontSprite.bitmap.drawCircleAlpha(block.x, block.y, r+Math.randomInt(2)-4)
			block.health = 0;
			
		} else if (hpRate < 0.5 && block.health > 1) { // 毀一半
			var x = Math.randomInt(Math.min(block.width,5)) - Math.min(block.width,10);
			var y = Math.randomInt(Math.min(block.height,5)) - Math.min(block.height,10);
			var r = Math.min(Math.abs(x), Math.abs(y)); // 避免炸到別的地方
			x += block.x;
			y += block.y;
			this.frontSprite.bitmap.drawCircleAlpha(x, y, r)
			block.health = 1;
		
		} else if (hpRate < 0.8) {// && block.health > 2) { // 輕損	
			var x = Math.randomInt(Math.min(block.width,2)) - Math.min(block.width,4);
			var y = Math.randomInt(Math.min(block.height,2)) - Math.min(block.height,4);
			var r = Math.min(Math.abs(x), Math.abs(y)); // 避免炸到別的地方
			x += block.x;
			y += block.y;
			this.frontSprite.bitmap.drawCircleAlpha(x, y, r);
			block.health = 2;
		}
	// 破碎運算－消矩形
	} else if ($gameTemp.breakoutStage[2] === 1) {
		if (block.hp == 0) {
			var x = block.x - block.width/2;
			var y = block.y - block.height/2;
			this.frontSprite.bitmap.drawRectAlpha(x, y, block.width, block.height);
		}
	}

	
	// 磚塊動畫
	if (block.hp === 0) {
		if (STILILA.BO.breakID) {
			block.sprite.startAnimation($dataAnimations[STILILA.BO.breakID], false, 0);
		}
		// 更新分數
		var comboRate = (1 + (this.nowCombo-1)*STILILA.BO.comboPlus);
		this.scoreWindow.refresh(block.score, comboRate);
		// 掉落道具
		if ($gameTemp.breakoutStage[3] > Math.randomInt(100)) {this.blockDropItem(block);}
		
	} else {
		if (STILILA.BO.reboundID) {
			block.sprite.startAnimation($dataAnimations[STILILA.BO.reboundID], false, 0);
		}
	}

	// 刷新連擊窗
	this.comboWindow.refresh(this.nowCombo);
}

// ----------------------------------------------
// ● 修補指定區域的磚塊(前景圖)
//SceneManager._scene.repairBlock(431,301,80,80)
// ----------------------------------------------
Scene_Breakout.prototype.repairBlock = function(block) {
	var x = block.x - block.width/2;
	var y = block.y - block.height/2;
	// 圖像修復(用做修復的圖(原圖), x, y, w, h, 目標圖x, 目標y)
	this.frontSprite.bitmap.blt(this.frontBitmap, x, y, block.width, block.height, x, y);
	// 磚塊血量修復(未完成)
	block.health = 3;
	block.hp = block.maxhp;
}




// ----------------------------------------------
// ● 定期更新－敵人插件
// ----------------------------------------------
Scene_Breakout.prototype.updateEnemyPlugin = function() {
}
// ----------------------------------------------
// ● 定期更新－技能插件
// ----------------------------------------------
Scene_Breakout.prototype.updateSkillPlugin = function() {
}
// ----------------------------------------------
// ● 使用技能
// ----------------------------------------------
Scene_Breakout.prototype.useSkill = function(index) {
}
// ----------------------------------------------
// ● 切換技能
// ----------------------------------------------
Scene_Breakout.prototype.skillChange = function(index) {
}
// ----------------------------------------------
// ● 定期更新－道具插件
// ----------------------------------------------
Scene_Breakout.prototype.updateItemPlugin = function() {
}
// ----------------------------------------------
// ● 取得道具
// ----------------------------------------------
Scene_Breakout.prototype.getItem = function() {
}
// ----------------------------------------------
// ● 掉落道具
// ----------------------------------------------
Scene_Breakout.prototype.blockDropItem = function(block) {
}

// ----------------------------------------------
// ● 時停開始
//   time：停止時間(frame)
// ----------------------------------------------
Scene_Breakout.prototype.startTimeStop = function(time) {
	$gameTemp.timeStopCount = time;
	this.frontSprite.setColorTone([0,0,0,255]);
	this.backSprite.setColorTone([0,0,0,255]);
	AudioManager.pauseBGM();
}

// ----------------------------------------------
// ● 時停結束
// ----------------------------------------------
Scene_Breakout.prototype.endTimeStop = function() {
	this.frontSprite.setColorTone([0,0,0,0]);
	this.backSprite.setColorTone([0,0,0,0]);
	AudioManager.reopenBGM();
}


// ----------------------------------------------
// ● 離開場景
// ----------------------------------------------
Scene_Breakout.prototype.stop = function() {
	
	// 關連取消
	for (var i=0; i < this.gameBlocks.length; i++) {
		this.gameBlocks[i].sprite = null;
	}
	for (var i=this.gameBalls.length-1; i>=0; i--) {
		this.deleteBall(this.gameBalls[i]);
	}
	this.gamePaddle.sprite = null;

	
	// 移除所有飛道
	for (var i=this.gameBullets.length-1; i>=0; i--) {
		this.deleteBullet(this.gameBullets[i]);
	}
	// 移除所有道具
	for (var i=this.gameItems.length-1; i>=0; i--) {
		this.deleteItem(this.gameItems[i]);
	}

	Scene_Base.prototype.stop.call(this);
	
	// 清除快取
	while (this._cacheKey.length > 0) {
		var key = this._cacheKey.shift();
		ImageManagerST.cacheRemove(key);
	}
	if (STILILA.BO.ballImage) {
		var key = ImageManagerST.getCacheKey(STILILA.BO.path, STILILA.BO.ballImage);
		ImageManagerST.cacheRemove(key);
	}
	if (STILILA.BO.ballEXImage) {
		var key = ImageManagerST.getCacheKey(STILILA.BO.path, STILILA.BO.ballEXImage);
		ImageManagerST.cacheRemove(key);
	}
	if (STILILA.BO.paddleImage) {
		var key = ImageManagerST.getCacheKey(STILILA.BO.path, STILILA.BO.paddleImage);
		ImageManagerST.cacheRemove(key);
	}
	if (STILILA.BO.barrierImage) { 
		var key = ImageManagerST.getCacheKey(STILILA.BO.path, STILILA.BO.barrierImage);
		ImageManagerST.cacheRemove(key);
	}
	
	
	// 淡出場景
	this.startFadeOut(this.slowFadeSpeed(), false);
	
	// 還原BGM
	if ($gameTemp._mapBgm) {
        AudioManager.playBgm($gameTemp._mapBgm);
    } else {
        AudioManager.fadeOutBgm(0.8);
    }
    if ($gameTemp._mapBgs) {
        AudioManager.playBgs($gameTemp._mapBgs);
    }
	
	$gameTemp.timeStopCount = 0; 
	$gameTemp.superStopCount = 0;
	$gameTemp.pause = false;
}






