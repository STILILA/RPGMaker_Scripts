/*
//==============================================================================
 ■ 合成系統 v1.0
    最後更新：2020/09/30
	http://home.gamer.com.tw/homeindex.php?owner=qootm2
	https://twitter.com/STILILA
==============================================================================
*/

/*:
 * @plugindesc 道具合成系統
 * @author STILILA
 * @url http://home.gamer.com.tw/homeindex.php?owner=qootm2
 
@help
--------------------------------------------------------------------------
 ● 更新履歷
--------------------------------------------------------------------------

--------------------------------------------------------------------------
 ● 使用法
--------------------------------------------------------------------------
  打開STTLA_Synthesis_Setting.js
  https://www.dropbox.com/s/5wz0ytwjw8c428k/STTLA_Synthesis_Setting.js?dl=0
  設定好配方內容，使用插件指令增減配方


  ＜操作＞
 * Q、W：切換製作種類
 * tab：切換所需素材、裝備素質
 * (選擇數量時)↑、↓：捲動素材視窗
 * (選擇數量時)←、→：數量-1／+1
 * (選擇數量時)Q、W：數量-10／+10

========================================================   

 

 
 * @param Menu_Switch
 * @desc n 號開關ON時，加入選單中
 * @default 5
 * @type switch
 
 * @param Menu_Name
 * @desc 在主選單的顯示名稱
 * @default 合成

 * @param Defult_Success
 * @desc 預設成功率
 * @default 100
 * @type number
 * @max 100
 * @min 0
  
 * @param Success_Upgrade
 * @desc 預設成功率上升程度
 * @default 2
 * @type number
 
 * @param Defult_Gold
 * @desc 預設合成費用
 * @default 0
 * @min 0
 * @type number
 
 * @param Defult_Garbage
 * @desc 預設失敗產物的ID (物品、武器、防具各一個ID)
 * @default {"item":"25","weapon":"5","armor":"5"}
 * @type struct<SetGarbage>
 
 * @param Unknown_Name
 * @desc 隱藏內容時的文字
 * @default ？？？
 
 * @param Unknown_HelpText
 * @desc 隱藏內容時的說明
 * @default 未知的道具，成功製作前無法確認。
 * @parent Unknown_Name
 
 * @param Mode_HelpTexts
 * @desc 動態說明文字
 * @default ["TAB鍵切換所需素材／道具素質", "Q、W鍵切換製作種類"]
 * @type string[]
 
 * @param Mode_Help_Change
 * @desc 切換說明等待時間
 * @default 120
 * @type number
 * @parent Mode_HelpTexts
 
 * @param SuccessSE
 * @desc 成功SE
 * @default {"name":"Item3","volume":"90","pitch":"100"}
 * @type struct<ProcessSE>
 
 * @param FailedSE
 * @desc 失敗SE
 * @default {"name":"Cow","volume":"90","pitch":"100"}
 * @type struct<ProcessSE>
 
 * @param Vocab
 * @text 用語集
 * @desc 用語集
 * @default {"Text_Result":"合成結果…","Text_Confirm":"確定合成？","Text_NoGold":"金錢不足","Text_NoMaterial":"素材不足","Text_Limit":"超過所持上限","Text_PageItem":"道具合成","Text_PageWeapon":"武器合成","Text_PageArmor":"防具合成","Text_Yes":"確定","Text_No":"取消","Text_Possession":"持有","Text_Demand":"需求","Text_Material":"所需素材","Text_Amount":"數量","Text_Success":"成功率：","Text_Cost":"製作費用","Text_Param":"素質"}
 * @type struct<Vocab>
 

* @command Open
* @text 開啟合成畫面
* @desc 開啟合成畫面
 
* @command Add
* @text 加入配方
* @desc 
*
* @arg type
* @text 道具種類
* @desc 要追加的配方種類
* @default all
* @type select
* @option 物品
* @value item
* @option 武器
* @value weapon
* @option 防具
* @value armor
* @option 全部
* @value all
 
* @arg itemID
* @text 物品ID
* @desc 道具種類(type)必須為item才有效，省略或0表示加入所有物品配方
* @type item
* @parent type
 
* @arg weaponID
* @text 武器ID
* @desc 道具種類(type)必須為weapon才有效，省略或0表示加入所有武器配方
* @type weapon
* @parent type

* @arg armorID
* @text 防具ID
* @desc 道具種類(type)必須為armor才有效，省略或0表示加入所有防具配方
* @type armor
* @parent type
 
* @arg hideFlag
* @text 隱藏判定
* @desc 製作成功前是否隱藏詳細內容
* @default false
* @type boolean

* @command Remove
* @text 移除配方
* @desc 
*
* @arg type
* @text 道具種類
* @desc 要移除的配方種類
* @default all
* @type select
* @option 物品
* @value item
* @option 武器
* @value weapon
* @option 防具
* @value armor
* @option 全部
* @value all

* @arg itemID
* @text 物品ID
* @desc 道具種類(type)必須為item才有效，省略或0表示加入所有物品配方
* @type item
* @parent type
 
* @arg weaponID
* @text 武器ID
* @desc 道具種類(type)必須為weapon才有效，省略或0表示加入所有武器配方
* @type weapon
* @parent type

* @arg armorID
* @text 防具ID
* @desc 道具種類(type)必須為armor才有效，省略或0表示加入所有防具配方
* @type armor
* @parent type

@target MZ
@base STTLA_Synthesis_Setting
@orderBefore STTLA_Synthesis_Setting

*/

/*~struct~ProcessSE:
*
* @param name
* @text 名稱
* @type file
* @dir audio/se

* @param volume
* @text 音量
* @default 90
* @max 100
* @min 0
* @type number

* @param pitch
* @text 音調
* @default 100
* @max 150
* @min 0
* @type number

* @param pan
* @text 方向
* @default 0
* @max 100
* @min -100
* @type number

*/
/*~struct~SetGarbage:
*
* @param item
* @text 物品
* @default 25
* @type item

* @param weapon
* @text 武器
* @default 5
* @type weapon

* @param armor
* @text 防具
* @default 5
* @type armor

*/
/*~struct~Vocab:
*
 * @param Text_Result 
 * @desc 用語：「合成結果」
 * @default 合成結果…
 
 * @param Text_Confirm
 * @desc 用語：「確定合成？」
 * @default 確定合成？
 
 * @param Text_NoGold
 * @desc 用語：「金錢不足」
 * @default 金錢不足
 
 * @param Text_NoMaterial
 * @desc 用語：「素材不足」
 * @default 素材不足
 
 * @param Text_Limit
 * @desc 用語：「超過上限」
 * @default 超過所持上限

 * @param Text_PageItem
 * @desc 用語：「道具合成」
 * @default 道具合成

 * @param Text_PageWeapon
 * @desc 用語：「武器合成」
 * @default 武器合成
 
 * @param Text_PageArmor
 * @desc 用語：「防具合成」
 * @default 防具合成
 
 * @param Text_Yes
 * @desc 用語：「確定合成」
 * @default 確定
 
 * @param Text_No
 * @desc 用語：「取消合成」
 * @default 取消
 
 * @param Text_Possession
 * @desc 用語：「持有數」
 * @default 持有

 * @param Text_Demand
 * @desc 用語：「需求數量」
 * @default 需求

 * @param Text_Material
 * @desc 用語：「所需素材」
 * @default 所需素材
 
 * @param Text_Amount
 * @desc 用語：「製作數量」
 * @default 數量
 
 * @param Text_Success
 * @desc 用語：「成功率」
 * @default 成功率：
 
 * @param Text_Cost
 * @desc 用語：「合成費用」
 * @default 製作費用
 
 * @param Text_Param
 * @desc 用語：「素質」
 * @default 素質

 
*/


var STILILA = STILILA || {};
STILILA.SYN = {};



(() => {
const pluginName = 'STTLA_Synthesis';

let parameters = PluginManager.parameters(pluginName);

STILILA.SYN.MenuSwitch = Number(parameters['Menu_Switch'] || 5);
STILILA.SYN.MenuName = parameters['Menu_Name'] || '合成';
STILILA.SYN.Success = Number(parameters['Defult_Success'] || 100);
STILILA.SYN.Upgrade = Number(parameters['Success_Upgrade'] || 2);
STILILA.SYN.Gold = Number(parameters['Defult_Gold'] || 0);
STILILA.SYN.Garbage = JSON.parse(parameters['Defult_Garbage']);
STILILA.SYN.UnknownText = parameters['Unknown_Name'] || '？？？';
STILILA.SYN.UnknownHelpText = parameters['Unknown_HelpText'] || '未知的道具，成功製作前無法確認。';
STILILA.SYN.ModeHelpTexts = JSON.parse(parameters['Mode_HelpTexts']);
STILILA.SYN.ModeHelpChange = Number(parameters['Mode_Help_Change'] || 120);
STILILA.SYN.SuccessSE = JSON.parse(parameters['SuccessSE']);
STILILA.SYN.FailedSE = JSON.parse(parameters['FailedSE']);

//STILILA.SYN.Vocab = JSON.parse(parameters['Vocab']);
STILILA.SYN.ResultText = parameters['Text_Result'] || '合成結果…';
STILILA.SYN.ConfirmText = parameters['Text_Confirm'] || '確定合成？';
STILILA.SYN.NoGoldText = parameters['Text_NoGold'] || '金錢不足';
STILILA.SYN.NoMaterialText = parameters['Text_NoMaterial'] || '素材不足';
STILILA.SYN.LimitText = parameters['Text_Limit'] || '超過所持上限';
STILILA.SYN.PageItemText = parameters['Text_PageItem'] || '道具合成';
STILILA.SYN.PageWeaponText = parameters['Text_PageWeapon'] || '武器合成';
STILILA.SYN.PageArmorText = parameters['Text_PageArmor'] || '防具合成';
STILILA.SYN.Yes = parameters['Text_Yes'] || '確定';
STILILA.SYN.No = parameters['Text_No'] || '取消';
STILILA.SYN.PossessionText = parameters['Text_Possession'] || '持有';
STILILA.SYN.DemandText = parameters['Text_Demand'] || '需求';
STILILA.SYN.MaterialText = parameters['Text_Material'] || '所需素材';
STILILA.SYN.AmountText = parameters['Text_Amount'] || '數量';
STILILA.SYN.SuccessText = parameters['Text_Success'] || '成功率：';
STILILA.SYN.CostText = parameters['Text_Cost'] || '製作費用';
STILILA.SYN.ParamText = parameters['Text_Param'] || '素質';



// 註冊插件指令處理
PluginManager.registerCommand(pluginName, "Open", args => {

	SceneManager.push(Scene_Synthesis);

})


PluginManager.registerCommand(pluginName, "Add", args => {

	let flag = (args.hideFlag === 'true');

	const type = args.type;
	switch (args.type) {
		case 'all':
			$gameParty.addSynthesis('all', 0, flag);
			break;
		case 'item':
			$gameParty.addSynthesis(args.type, args.itemID, flag);
			break;
		case 'weapon':
			$gameParty.addSynthesis(args.type, args.weaponID, flag);
			break;
		case 'armor':
			$gameParty.addSynthesis(args.type, args.armorID, flag);
			break;
		
	}
	
	
})


PluginManager.registerCommand(pluginName, "Remove", args => {
	
	const type = args.type;
	switch (args.type) {
		case 'all':
			$gameParty.addSynthesis('all', 0);
			break;
		case 'item':
			$gameParty.addSynthesis(args.type, args.itemID);
			break;
		case 'weapon':
			$gameParty.addSynthesis(args.type, args.weaponID);
			break;
		case 'armor':
			$gameParty.addSynthesis(args.type, args.armorID);
			break;
		
	}

})





//==============================================================================
// ■ Window_MenuCommand
//------------------------------------------------------------------------------
// 　菜单画面中显示指令的窗口
//==============================================================================
  //--------------------------------------------------------------------------
  // ● 添加選項
  //--------------------------------------------------------------------------
let _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
	_Window_MenuCommand_addOriginalCommands.call(this);
    if ($gameSwitches.value(STILILA.SYN.MenuSwitch)) {
      this.addCommand(STILILA.SYN.MenuName, 'synthesis');
    }
};

//==============================================================================
// ■ Scene_Menu
//------------------------------------------------------------------------------
// 　選單畫面
//==============================================================================
//--------------------------------------------------------------------------
// ● 添加Handler至選項
//--------------------------------------------------------------------------
let _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
	_Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('synthesis',    this.callSynthesis.bind(this));
};
//--------------------------------------------------------------------------
// ● 呼叫合成畫面
//--------------------------------------------------------------------------
Scene_Menu.prototype.callSynthesis = function() {
    SceneManager.push(Scene_Synthesis);
}
//==============================================================================
// ■ Game_Temp
//==============================================================================
  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
 let _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this.check_syn = false;
}


//==============================================================================
// ■ Game_Party
//==============================================================================
  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
  let _Game_Party_initialize = Game_Party.prototype.initialize;
  Game_Party.prototype.initialize = function() {
	_Game_Party_initialize.call(this); 
    this.synthesis_data = {'item' : {}, 'weapon': {}, 'armor': {}}    // 已登錄清單
    this.synthesis_success = {'item' : {}, 'weapon': {}, 'armor': {}} // 成功率 
  }
  //--------------------------------------------------------------------------
  // ● 追加配方
  //    type：種類('item'、'weapon'、'armor'、'all')，all為加入所有配方，省略時為all
  //    id(可省略)：道具ID，0為加入此種類所有配方，預設為0
  //    unknown(可省略)：以「未知」狀態加入，省略時以一般方式，重新加入時會重置狀態
  //--------------------------------------------------------------------------
  Game_Party.prototype.addSynthesis = function(type = 'all', id = 0, unknown = false) {
	//let type = type || 'all';
	//let id = id || -1; 
	//let unknown = unknown || false;  
    if (type === 'all') {
      for (let stype in STILILA.SYN.List) {
        for (let sid in STILILA.SYN.List[stype]) {
          // 登錄
          this.synthesis_data[stype][sid] = (unknown ? 1 : 2);
          // 成功率登錄
          this.synthesis_success[stype][sid] = this.synthesis_success[stype][sid] || (STILILA.SYN.List[stype][sid]['success'] || STILILA.SYN.Success);
        } 
		// 以ID排序
		let new_hash = {};
		Object.keys(this.synthesis_data[stype]).sort().forEach(function(key) {
			new_hash[key] = $gameParty.synthesis_data[stype][key];  // <= 作用域問題，這裡的this會變成全域的Window
		});
		this.synthesis_data[stype] = new_hash;
       // this.synthesis_data[stype] = Hash[this.synthesis_data[stype].sort];
      }
    }else if (id === 0) {
      for (let sid in STILILA.SYN.List[type]) {
        // 登錄
        this.synthesis_data[type][sid] = (unknown ? 1 : 2);
        // 成功率登錄
        this.synthesis_success[type][sid] = this.synthesis_success[type][sid] || (STILILA.SYN.List[type][sid]['success'] || STILILA.SYN.Success);
      }
      // 以ID排序
		let new_hash = {};
		Object.keys(this.synthesis_data[type]).sort().forEach(function(key) {
			new_hash[key] = $gameParty.synthesis_data[type][key];
		});
		this.synthesis_data[type] = new_hash;
	  
     // this.synthesis_data[type] = Hash[this.synthesis_data[type].sort];
    }else{
      
      if (STILILA.SYN.List[type][id]){
        // 登錄
        this.synthesis_data[type][id] = (unknown ? 1 : 2);
        // 成功率登錄
        this.synthesis_success[type][id] = this.synthesis_success[type][id] || (STILILA.SYN.List[type][id]['success'] || STILILA.SYN.Success);
        // 以ID排序
		let new_hash = {};
		Object.keys(this.synthesis_data[type]).sort().forEach(function(key) {
			new_hash[key] = $gameParty.synthesis_data[type][key];
		});
		this.synthesis_data[type] = new_hash;
       // this.synthesis_data[type] = Hash[this.synthesis_data[type].sort];
      }else{
         alert('合成種類「' +type+ '」不存在 ' +id+ ' 號配方，請檢查設定');
      }
      
	}
    
    
    
  }
  //--------------------------------------------------------------------------
  // ● 移除配方
  //    type：種類('item'、'weapon'、'armor'、'all')，all為移除所有配方，預設為'all'
  //    id(可省略)：道具ID，0為移除此種類所有配方，預設為0
  //--------------------------------------------------------------------------
  Game_Party.prototype.removeSynthesis = function(type = 'all', id = 0) {
//	let type = type || -1;
//	let id = id || -1;	
    if (type === 'all'){
      this.synthesis_data = {'item': {}, 'weapon': {}, 'armor': {}};
	}else if (id === 0){
      this.synthesis_data[type] = {};
    }else{
      delete this.synthesis_data[type][id];
    }
  }

  
})();  // (function() {


//==============================================================================
// ■ Scene_Synthesis
//------------------------------------------------------------------------------
// 　選單畫面
//==============================================================================

function Scene_Synthesis() {
    this.initialize.apply(this, arguments);
}
Scene_Synthesis.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Synthesis.prototype.constructor = Scene_Synthesis;
  //--------------------------------------------------------------------------
  // ● 开始处理
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.type = 0; 			// 0：道具、1：武器、2：防具
    this.create_help_window();
    this.create_gold_window();
    this.create_command_window();
    this.create_dummy_window();
    this.create_iteminfo_window();  // 道具資訊視窗(素材需求 or 素質)
    this.create_basic_window();
    this.create_amount_window();  // 製作數量視窗
    this.create_confirm_window(); 
    this.create_result_window();
    this.create_msg_window();
    this.hide_right_window();
    this.msg_window_showing = false;
    this.now_index = -1; // 紀錄目前選項，刷新用 
	
    this.help_window2_wait = 0;
    this.help_window2_help = 0;
	
  }
  
  //--------------------------------------------------------------------------
  // ● 更新画面（基础）
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    
	this.update_help_window2();
	
	
    // 顯示訊息中
    if (this.msg_window_showing && (Input.isTriggered('ok') || Input.isTriggered('cancel'))) {
      if (this.result_window.visible) {
        SoundManager.playCancel();
        this.command_active_select();
        this.result_window.visible = false;
      }else{
        SoundManager.playCancel();
        this.command_active_synthesis();
      }
      this.msg_window_showing = false;
    }
    
    // 按下tab鍵，切換模式
    if (Input.isTriggered('tab')) {
      this.basic_window.change_mode();
      this.command_window.select(this.command_window.index(), this.amount_window.amount)
    }

    // 數量調整視窗活化時，可捲動配方清單
    if (this.amount_window.active){
      if (Input.isPressed('up')){
        this.info_window.scrollUp();
      }
      
      if (Input.isPressed('down')){
        this.info_window.scrollDown();
      }
    }
  }
  

  
  //--------------------------------------------------------------------------
  // ● 生成說明視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_help_window = function() {
    this.help_window = new Window_Selectable(new Rectangle(0, 0, Graphics.width, this.calcWindowHeight(1,true))); // calcWindowHeight(n,true)時會比較高，用Window_Selectable宣告才能用itemLineRect對齊文字
	this.addChild(this.help_window);
    this.refresh_help_window();
  }
  //--------------------------------------------------------------------------
  // ● 刷新說明視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.refresh_help_window = function() {
    let contents = this.help_window.contents;
	let text = ''
    contents.clear();
	switch (this.type)	{
    case 0: 
		text = STILILA.SYN.PageItemText;
		break;
    case 1: 
		text = STILILA.SYN.PageWeaponText;
		break;
    case 2: 
		text = STILILA.SYN.PageArmorText;
		break;
    }
	let rect = this.help_window.itemLineRect(0);
    this.help_window.drawText(text,0,rect.y,contents.width,'center')
  }

  //--------------------------------------------------------------------------
  // ● 生成金钱窗口
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_gold_window = function() {
	let gh = this.calcWindowHeight(1,true);
    this.gold_window = new Window_Gold(new Rectangle (Graphics.width - 240, Graphics.height - gh, 240, gh));
	// 生成動態說明窗
    this.help_window2 = new Window_Selectable(new Rectangle(0, this.gold_window.y, Graphics.width - this.gold_window.width, gh));
	let rect = this.help_window2.itemLineRect(0);
    this.help_window2.drawText(STILILA.SYN.ModeHelpTexts[0],0,rect.y,this.help_window2.contentsWidth(),'center');
	this.help_window2.contentsOpacity = 0;
	this.addChild(this.gold_window);
	this.addChild(this.help_window2);
  }
  //--------------------------------------------------------------------------
  // ● 生成配方選擇窗口
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_command_window = function() {
    this.command_window = new Window_SynthesisCommand(this.help_window.height, this.gold_window.height)
    this.command_window.setHandler('ok',    this.command_active_synthesis.bind(this)) // 確定
    this.command_window.setHandler('pageup',  this.pre_type.bind(this)) // 切換種類Q
    this.command_window.setHandler('pagedown',  this.next_type.bind(this)) // 切換種類W
    this.command_window.setHandler('cancel',    this.popScene.bind(this)) // 取消
	this.addChild(this.command_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成作為背景的空窗口
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_dummy_window = function() {
	let h = this.calcWindowHeight(1,true);
    this.dummy_window = new Window_Base(new Rectangle(160,h,Graphics.width-160,Graphics.height - h * 2));
	this.addChild(this.dummy_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成合成物基本內容窗口
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_basic_window = function() {
    this.basic_window = new Window_SynthesisItem(this.command_window.width, this.help_window.height);
    this.basic_window.info_window = this.info_window;
    this.command_window.main_window = this.basic_window;
	this.addChild(this.basic_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成合成物資訊內容窗口
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_iteminfo_window = function() {
    // 120是 Window_SynthesisItem 的高度
    this.info_window = new Window_SynthesisInfo(this.command_window.width, this.help_window.height+160);
	this.addChild(this.info_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成數量選擇視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_amount_window = function() {
    this.amount_window = new Window_SynthesisAmount();
    this.amount_window.setHandler('ok',    this.ready_synthesize.bind(this));        // 準備合成
    this.amount_window.setHandler('cancel',    this.command_active_select.bind(this)); // 取消
    this.amount_window.main_window = this.basic_window;
    this.command_window.amount_window = this.amount_window;
    this.command_window.select(0);
	this.addChild(this.amount_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成確認視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_confirm_window = function() {
    this.confirm_window = new Window_SynthesisConfirm()
    this.confirm_window.setHandler('ok',    this.start_synthesize.bind(this));          // 開始合成
    this.confirm_window.setHandler('cancel',    this.command_active_synthesis.bind(this)); // 取消
    this.confirm_window.visible = false;
	this.addChild(this.confirm_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成製作結果視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_result_window = function() {
    this.result_window = new Window_SynthesisResult();
    this.result_window.visible = false;
	this.addChild(this.result_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成訊息視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.create_msg_window = function() {
    this.msg_window = new Window_Base(new Rectangle(Graphics.width/2-180, Graphics.height/2 - this.calcWindowHeight(1), 360, this.calcWindowHeight(1)))
    let contents = this.msg_window.contents;
    this.msg_window.backOpacity = 255;
    this.msg_window.drawText('', 0, 0, contents.width, 'center');
    this.msg_window.visible = false;
	this.addChild(this.msg_window);
  }
  
  //--------------------------------------------------------------------------
  // ● 更新底部說明視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.update_help_window2 = function() {
    if (this.help_window2_wait > STILILA.SYN.ModeHelpChange) {
      this.help_window2.contentsOpacity -= 26;
      if (this.help_window2.contentsOpacity === 0) {
		this.help_window2.contents.clear();
	    this.help_window2_wait = 0;
		this.help_window2_help += 1;
		if (this.help_window2_help >= STILILA.SYN.ModeHelpTexts.length){ this.help_window2_help = 0;} 
		let rect = this.help_window2.itemLineRect(0);
		this.help_window2.drawText(STILILA.SYN.ModeHelpTexts[this.help_window2_help],0,rect.y,this.help_window2.contentsWidth(),'center');
	  }
    } else {
      if (this.help_window2.contentsOpacity < 255) {
        this.help_window2.contentsOpacity += 26;
      }
	}
    this.help_window2_wait += 1;
  }
  
  //--------------------------------------------------------------------------
  // ● 隱藏右邊視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.hide_right_window = function() {
    this.dummy_window.opacity = 190
  }
  //--------------------------------------------------------------------------
  // ● 顯示右邊視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.show_right_window = function() {
    this.dummy_window.opacity = 255
  }
  
  //--------------------------------------------------------------------------
  // ● 刷新提示視窗
  //    msg：0－合成確認、1－素材不足、2－金錢不足、3-超過上限
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.refresh_msg_window = function(msg) {
    let contents = this.msg_window.contents;
    contents.clear();
    switch (msg){
    case 0:
      this.msg_window.drawText(STILILA.SYN.ConfirmText, 0, 0, contents.width, 'center');
	  break;
    case 1:
      this.msg_window.drawText(STILILA.SYN.NoMaterialText, 0, 0, contents.width, 'center');
	  break;
    case 2:
      this.msg_window.drawText(STILILA.SYN.NoGoldText, 0, 0, contents.width, 'center');
	  break;
    case 3:
      this.msg_window.drawText(STILILA.SYN.LimitText, 0, 0, contents.width, 'center');
	  break;
    }
  }
  
  //--------------------------------------------------------------------------
  // ● 切換種類Q
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.pre_type = function() {
    this.type -= 1
    if (this.type < 0) {this.type = 2;}
    switch (this.type) {
	case 0: 
		this.command_window.changeType('item');
		break;
	case 1: 
		this.command_window.changeType('weapon');
		break;
	case 2:	
		this.command_window.changeType('armor');
		break;
    }
    this.refresh_help_window();
    this.command_window.active = true;
  }
  //--------------------------------------------------------------------------
  // ● 切換種類W
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.next_type = function() {
    this.type += 1
    if (this.type > 2) {this.type = 0;}
    switch (this.type) {
	case 0: 
		this.command_window.changeType('item');
		break;
	case 1: 
		this.command_window.changeType('weapon');
		break;
	case 2:	
		this.command_window.changeType('armor');
		break;
    }
    this.refresh_help_window();
    this.command_window.active = true;
  }
  //--------------------------------------------------------------------------
  // ● 活化選擇視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.command_active_select = function() {
    this.command_window.active = true;
    this.confirm_window.active = false;
    this.amount_window.active = false;
    this.hide_right_window();
  }
  //--------------------------------------------------------------------------
  // ● 活化狀態視窗
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.command_active_synthesis = function() {
    this.command_window.active = false;
    this.confirm_window.active = false;
    this.amount_window.active = true;
    this.msg_window.visible = false;
    this.confirm_window.visible = false;
    this.show_right_window();
  }
  
  //--------------------------------------------------------------------------
  // ● 準備合成
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.ready_synthesize = function() {
    this.command_window.active = false;
    this.amount_window.active = false;
    this.msg_window.visible = true;
    
    // 超過上限
    let type = this.command_window.type;
    let id = this.command_window.currentSymbol();
    switch (type) {
    case 'item':   
		var item = $dataItems[id]; 
		break;
    case 'weapon':  
		var item = $dataWeapons[id]; 
		break;
    case 'armor':   
		var item = $dataArmors[id];
		break;
    }
    if ($gameParty.hasMaxItems(item) || $gameParty.numItems(item) + this.amount_window.amount > $gameParty.maxItems(item)) {
      this.refresh_msg_window(3);
      this.msg_window_showing = true;
      SoundManager.playBuzzer();
      return;
    }
    
    // 錢不夠
    if (!this.check_gold()){
      this.refresh_msg_window(2);
      this.msg_window_showing = true;
      SoundManager.playBuzzer();
      return;
    }
    
    // 素材不夠
    if (!this.check_material()){
      this.refresh_msg_window(1);
      this.msg_window_showing = true;
      SoundManager.playBuzzer();
      return;
    }

    this.refresh_msg_window(0);
    this.confirm_window.active = true;
    this.confirm_window.visible = true;
  }
  //--------------------------------------------------------------------------
  // ● 檢查錢
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.check_gold = function() {
    let gold = (STILILA.SYN.List[this.command_window.type][this.command_window.currentSymbol()]['gold'] || STILILA.SYN.Gold)
    gold *= this.amount_window.amount
    return $gameParty.gold() >= gold;
  }
  //--------------------------------------------------------------------------
  // ● 檢查素材
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.check_material = function() {
    
    let data = STILILA.SYN.List[this.command_window.type][this.command_window.currentSymbol()];
    let amount = this.amount_window.amount;
    
    for (let id in data['mi']) {
      let item = $dataItems[id];
      let need = data['mi'][id] * amount;
      let now = $gameParty.numItems(item);
      if (now < need) {return;} // 數量不足就中斷
    }
    for (let id in data['mw']) {
      let item = $dataWeapons[id];
      let need = data['mw'][id] * amount;
      let now = $gameParty.numItems(item);
      if (now < need) {return;} // 數量不足就中斷
	}
    for (let id in data['ma']) {
      let item = $dataArmors[id];
      let need = data['ma'][id] * amount;
      let now = $gameParty.numItems(item);
      if (now < need) {return;} // 數量不足就中斷
	}
    // 通過檢查
    return true;
  }
  
  //--------------------------------------------------------------------------
  // ● 開始合成
  //--------------------------------------------------------------------------
  Scene_Synthesis.prototype.start_synthesize = function() {
    this.msg_window.visible = false;
    this.confirm_window.visible = false;
    
    let type = this.command_window.type;
    let id = this.command_window.currentSymbol();
    
    let amount = this.amount_window.amount; // 獲得製作數量
    let data = STILILA.SYN.List[type][id]; // 獲得素材資料
    let success = $gameParty.synthesis_success[type][id]; // 獲得成功率
    
    
    // 取得製作物／失敗物
    switch (type){
    case 'item':
      var target_item = $dataItems[id];
      var garbage_item = (data['garbage'] ? $dataItems[data['garbage']] : $dataItems[STILILA.SYN.Garbage['item']]);
	  break;
    case 'weapon':
      var target_item = $dataWeapons[id];
      var garbage_item = (data['garbage'] ? $dataWeapons[data['garbage']] : $dataWeapons[STILILA.SYN.Garbage['weapon']]);
	  break;
    case 'armor':
      var target_item = $dataArmors[id];
      var garbage_item = (data['garbage'] ? $dataArmors[data['garbage']] : $dataArmors[STILILA.SYN.Garbage['armor']]);
	  break;
    }
    // 紀錄成果
    let result_list = {'success':[target_item, 0], 'fail':[garbage_item, 0]} 
    
    // 消耗素材和錢
    for (let mid in data['mi']){
      let item = $dataItems[mid];
      let need = data['mi'][mid] * amount;
      $gameParty.loseItem(item, need);
    }
    for (let mid in data['mw']){
      let item = $dataWeapons[mid];
      let need = data['mw'][mid] * amount;
      $gameParty.loseItem(item, need);
    }
    for (let mid in data['ma']){
      let item = $dataArmors[mid];
      let need = data['ma'][mid] * amount;
      $gameParty.loseItem(item, need);
	}
    $gameParty.loseGold((data['gold'] || STILILA.SYN.Gold) * amount);
    this.gold_window.refresh()
    
    // 製作
    for (let n=0; n < amount ; n++)  { 
      if (success > Math.randomInt(100)){ // === 成功
        $gameParty.gainItem(target_item, 1);
        result_list['success'][1] += 1;
        // 未知flag消除
        if ($gameParty.synthesis_data[type][id] === 1) {
          $gameParty.synthesis_data[type][id] = 2;
        }
		// 播放完成音效
		let se = STILILA.SYN.SuccessSE
		AudioManager.playSe(se);
      }else{ // === 失敗
        $gameParty.gainItem(garbage_item, 1)
        result_list['fail'][1] += 1;
		// 播放失敗音效
		let se = STILILA.SYN.FailedSE
		AudioManager.playSe(se);
      }
      // 提升熟練度
      if (success < 100){
        $gameParty.synthesis_success[type][id] = Math.min($gameParty.synthesis_success[type][id] + (data['upgrade'] || STILILA.SYN.Upgrade), 100);
        success = $gameParty.synthesis_success[type][id]; // 更新成功率
      }
    }


    
    this.command_window.refresh();
    this.command_window.select(this.command_window.index());
    // 出現成果視窗
    this.result_window.refresh(result_list)
    this.result_window.visible = true;
    this.msg_window_showing = true; // 等待Enter
    this.hide_right_window();
  }
  




//==============================================================================
// ■ Window_SynthesisConfirm
//------------------------------------------------------------------------------
// 　確認選項視窗
//==============================================================================

function Window_SynthesisConfirm() {
	this.initialize.apply(this, arguments);
}
Window_SynthesisConfirm.prototype = Object.create(Window_Command.prototype);
Window_SynthesisConfirm.prototype.constructor = Window_SynthesisConfirm;
//--------------------------------------------------------------------------
// ● 初始化
//--------------------------------------------------------------------------
Window_SynthesisConfirm.prototype.initialize = function() {
	Window_Command.prototype.initialize.call(this, new Rectangle(Graphics.width/2-this.windowWidth()/2, Graphics.height/2, this.windowWidth(), this.fittingHeight(2)));
	this.backOpacity = 255;
	this.active = false;
};
//--------------------------------------------------------------------------
// ● 获取窗口的宽度
//--------------------------------------------------------------------------
Window_SynthesisConfirm.prototype.windowWidth = function() {
	return 96;
};
// //--------------------------------------------------------------------------
// // ● 获取显示行数
// //--------------------------------------------------------------------------
// Window_SynthesisConfirm.prototype.numVisibleRows = function() {
	// return 2;
// };
//--------------------------------------------------------------------------
// ● 作成選項
//--------------------------------------------------------------------------
Window_SynthesisConfirm.prototype.makeCommandList = function() {
	this.addCommand(STILILA.SYN.Yes, 'ok', true)
	this.addCommand(STILILA.SYN.No, 'cancel', true)
};





//==============================================================================
// ■ Window_SynthesisCommand
//------------------------------------------------------------------------------
// 　選擇要合成的道具(配方)
//==============================================================================
function Window_SynthesisCommand() {
	this.initialize.apply(this, arguments);
}
Window_SynthesisCommand.prototype = Object.create(Window_Command.prototype);
Window_SynthesisCommand.prototype.constructor = Window_SynthesisCommand;


  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_SynthesisCommand.prototype.initialize = function(help_h, gold_h) {
	var help_h = help_h || 0;
	var gold_h = gold_h || 0;
    this.type = 'item';
    this.main_window = null;
    this.amount_window = null;
	Window_Command.prototype.initialize.call(this, new Rectangle(0, help_h, this.windowWidth(), Graphics.height - help_h - gold_h));
  //  this.height = Graphics.height - help_h - gold_h ;
};

  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_SynthesisCommand.prototype.windowWidth = function() {
	return 160;
};
  // //--------------------------------------------------------------------------
  // // ● 获取显示行数
  // //--------------------------------------------------------------------------
// Window_SynthesisCommand.prototype.numVisibleRows = function() {
    // return this.maxItems();
// };

  //--------------------------------------------------------------------------
  // ● 生成指令列表
  //--------------------------------------------------------------------------
Window_SynthesisCommand.prototype.makeCommandList = function() {
    let list = $gameParty.synthesis_data[this.type];
    let o_list = STILILA.SYN.List[this.type];
    for (let id in list) {
		switch (this.type) {
		case 'item':
			this.addCommand(list[id] === 1 ? STILILA.SYN.UnknownText : (o_list[id]['name'] || $dataItems[id].name), id, true, list[id] === 1);
			break;
		case 'weapon':
			this.addCommand(list[id] === 1 ? STILILA.SYN.UnknownText : (o_list[id]['name'] || $dataWeapons[id].name), id, true, list[id] === 1);
			break;
		case 'armor':
			this.addCommand(list[id] === 1 ? STILILA.SYN.UnknownText : (o_list[id]['name'] || $dataArmors[id].name), id, true, list[id] === 1);
			break;
		}
    } 
};

  //--------------------------------------------------------------------------
  // ● 列表添加配方名稱
  //--------------------------------------------------------------------------
Window_SynthesisCommand.prototype.changeType = function(type) {
	this.type = type;
    this.refresh();
    this.select(0);
}
  //--------------------------------------------------------------------------
  // ● 选择项目
  //--------------------------------------------------------------------------
Window_SynthesisCommand.prototype.select = function(index, amount) {
	var amount = amount || 1;
	Window_Selectable.prototype.select.call(this, index);
    if (!this.main_window) {return;}
    this.main_window.refresh(this.type, this.currentSymbol(), this.currentExt(), this.currentData(), amount)
    this.amount_window.refresh(this.type, this.currentSymbol(), this.currentData(), (amount === 1))
	this.ensureCursorVisible(false);
}



  //--------------------------------------------------------------------------
  // ● 生成窗口内容
  //--------------------------------------------------------------------------
// Window_SynthesisCommand.prototype.createContents = function() {
	////this.contents.dispose 
    // if (this.contentsWidth() > 0 && this.contentsHeight() > 0) {
      // this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
      // this.contents.fontSize = 18;
    // } else {
      // this.contents = new Bitmap(1, 1);
    // }
// };

  


//==============================================================================
// ■ Window_SynthesisItem
//------------------------------------------------------------------------------
//    顯示道具基本資訊
//==============================================================================
function Window_SynthesisItem() {
	this.initialize.apply(this, arguments);
}
Window_SynthesisItem.prototype = Object.create(Window_Base.prototype);
Window_SynthesisItem.prototype.constructor = Window_SynthesisItem;


  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.initialize = function(x, y) {
	Window_Base.prototype.initialize.call(this, new Rectangle(x, y, this.windowWidth(), this.windowHeight()));
	this.mode = 0;
    this.contents.fontSize = 18;
    this.opacity = 0;
    this.item = null;
    this.info_window = null;
};

  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.windowWidth = function() {
    return (Graphics.width - 160);
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的高度
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.windowHeight = function() {
    return this.fittingHeight(6);
}
  //--------------------------------------------------------------------------
  // ● 绘制带有控制符的文本内容
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.drawTextEx = function(text, x, y) {
	// this.resetFontSettings();
    const textState = this.createTextState(text, x, y, this.contents.width);
    this.processAllText(textState);
    return textState.outputWidth;
}
  //--------------------------------------------------------------------------
  // ● 绘制持有数
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.drawPossession = function(x, y, item) {
    this.changeTextColor(this.systemColor());
    // 所持數量
    let number = $gameParty.numItems(item);
    // 空白數
    let spacing = String(number).length;
    this.drawText(TextManager.possession + '　'+' '.repeat(spacing), x, y, this.contents.width, 'right');
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(String(number), x, y, this.contents.width, 'right');
}
  //--------------------------------------------------------------------------
  // ● 刷新
  //    type－'item'、'weapon'、'armor'
  //    id－對象道具ID
  //    unknown－未知狀態
  //    exist－選項是否有東西(對應空清單)
  //    amount－製作數目
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.refresh = function(type, id, unknown, exist, amount) {
	var amount = amount || 1;
    this.contents.clear();
    // 有選項才描繪項目
    if (exist) {
	  this.contents.fontSize = 18;
      this.drawItem(type, id, unknown, amount);
    } else {
      this.info_window.clearContents();
    }
}
  //--------------------------------------------------------------------------
  // ● 改變模式
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.change_mode = function() {
    if (this.mode === 1){
      this.mode = 0;
	} else {
      this.mode = 1;
    }
}
  //--------------------------------------------------------------------------
  // ● 绘制项目
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.drawItem = function(type, id, unknown, amount) {
    if (unknown) {
      this.drawUnknownInfo();
    }else{
      switch (type) {
      case 'item':   
		var item = $dataItems[id];
		break;
      case 'weapon': 
		var item = $dataWeapons[id];
		break;
      case 'armor':  
		var item = $dataArmors[id];
		break;
	  }	
      this.item = item // 紀錄
      this.drawItemBasic(item);
    }
	
	this.drawCost(type, id, amount);
	
    // 繪製素材 / 素質
    switch (this.mode) {
    case 0: 
		this.info_window.drawMatarial(type, id, amount);
		break;
    case 1: 
		this.info_window.drawInfo(item, unknown);
		break;
    }
    

}

  //--------------------------------------------------------------------------
  // ● 繪製未知道具資訊
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.drawUnknownInfo = function() {
    this.drawTextEx(STILILA.SYN.UnknownHelpText, 4, 0);
}
  //--------------------------------------------------------------------------
  // ● 繪製所有項目基本資訊
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.drawItemBasic = function(item) {
    this.drawIcon(item.iconIndex, 0, 0);
    this.drawText(item.name, ImageManager.iconWidth+4, 0, this.contents.width, 'left');
    this.drawPossession(0, 0, item);
    this.drawTextEx(item.description, 4, ImageManager.iconWidth);
}
  
  //--------------------------------------------------------------------------
  // ● 繪製消耗資訊
  //--------------------------------------------------------------------------
Window_SynthesisItem.prototype.drawCost = function(type, id, amount) {
    // 獲取資料
    let data = STILILA.SYN.List[type][id];
    
    let y = 72;
    let y_plus = ImageManager.iconHeight;
    let w = this.contents.width;
    let h = this.lineHeight();
    
    // 合成費用
    this.changeTextColor(this.systemColor());
    let gold = (data['gold'] || STILILA.SYN.Gold) * amount;
    //this.drawText(STILILA.SYN.CostText+'　　　　', 0, y, w, 'right');
	this.drawText(STILILA.SYN.CostText+'                ', 0, y, w, 'right');  // 最大值位數的2倍(空格似乎寬度比較小)
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(gold, 0, y, w, 'right');
    y += y_plus;
    
    // 分隔線
    let color = ColorManager.normalColor();
    color.alpha = 128;
    this.contents.fillRect(0, y+y_plus/4, this.contentsWidth(), 2, color)
    y += y_plus/2;

    // 素材、需求量、現有量文字
    if (this.mode === 0) {
      this.changeTextColor(this.systemColor());
      this.drawText(STILILA.SYN.MaterialText, 4, y, w, 'left');
      this.drawText(STILILA.SYN.DemandText+'　'+STILILA.SYN.PossessionText, 0, y, w, 'right')
      this.changeTextColor(ColorManager.normalColor());
//~       y += y_plus
    }else{
      this.changeTextColor(this.systemColor());
      this.contents.fontSize = 20;
      this.drawText(STILILA.SYN.ParamText, 0, y, w, 'left');
      this.changeTextColor(ColorManager.normalColor());
    }
    
}


//==============================================================================
// ■ Window_SynthesisInfo
//------------------------------------------------------------------------------
//    道具資訊(素材量、資訊)
//==============================================================================
function Window_SynthesisInfo() {
	this.initialize.apply(this, arguments);
}
Window_SynthesisInfo.prototype = Object.create(Window_Base.prototype);
Window_SynthesisInfo.prototype.constructor = Window_SynthesisInfo;

  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.initialize = function(x, y) {
	Window_Base.prototype.initialize.call(this, new Rectangle(x, y, this.windowWidth(), this.windowHeight(y)));
    this.contents.fontSize = 18;
    this.opacity = 0;
    this.item = null;
    this.mode = 0;
	this.oy = 0;
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.windowWidth = function() {
    return (Graphics.width - 160);
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的高度
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.windowHeight = function(y) {
    // 96 = help_window.h + gold_window.h
    return (Graphics.height - y - 114);
}
  //--------------------------------------------------------------------------
  // ● 清除內容(切換種類時使用)
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.clearContents = function() {
    if (this.mode === 0) {
      this.createContents();
      this.item = null;
	}
    
}
  //--------------------------------------------------------------------------
  // ● 繪製所需素材
  //    type－'item'、'weapon'、'armor'
  //    id－對象道具ID
  //    amount－製作數量
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.drawMatarial = function(type, id, amount) {
    // 清除之前的內容
    
    this.contents.clear();
    
    // 獲取資料
    let data = STILILA.SYN.List[type][id];

    // 重新做成 contents 大小
    switch (type){
    case 'item': 
		var item = $dataItems[id];
		break;
    case 'weapon':
		var item = $dataWeapons[id];
		break;
    case 'armor':  
		var item = $dataArmors[id];
		break;
    }

    if (this.item != item) {
      //this.contents.dispose
	  this.origin.y = this.oy = 0;
      let h = ((data['mi'] ? Object.keys(data['mi']).length : 0)+(data['mw'] ? Object.keys(data['mw']).length : 0)+(data['ma'] ? Object.keys(data['ma']).length : 0))*ImageManager.iconHeight
      this.contents = new Bitmap(this.contentsWidth(), h)
      this.contents.fontSize = 18;
      this.item = item;
    }
    
    let y = 0;
    let y_plus = ImageManager.iconHeight;
    let w = this.contentsWidth();
    let h = this.lineHeight();
	
    
	
	
    // 所需道具
    for (let id in data['mi']) {
      let item = $dataItems[id];
      let need = data['mi'][id] * amount;
      let now = $gameParty.numItems(item);
      let useable = (now >= need) // 材料不足時半透明
	  this.changePaintOpacity(useable);
      this.drawIcon(item.iconIndex, 0, y);
      this.drawText(item.name, ImageManager.iconWidth+4, y, w, 'left');
      this.drawText(String(need)+'　'.repeat(STILILA.SYN.PossessionText.length+1), 0, y, w, 'right');
      this.drawText(now, 0, y, w, 'right');
      y += y_plus;
    }
    // 所需武器
    for (let id in data['mw']) {
      let item = $dataWeapons[id];
      let need = data['mw'][id] * amount;
      let now = $gameParty.numItems(item);
      let useable = (now >= need) // 材料不足時半透明
	  this.changePaintOpacity(useable);
      this.drawIcon(item.iconIndex, 0, y);
      this.drawText(item.name, ImageManager.iconWidth+4, y, w, 'left');
      this.drawText(String(need)+'　'.repeat(STILILA.SYN.PossessionText.length+1), 0, y, w, 'right');
      this.drawText(now, 0, y, w, 'right');
      y += y_plus;
	}
    // 所需防具
    for (let id in data['ma']) {
      let item = $dataArmors[id];
      let need = data['ma'][id] * amount;
      let now = $gameParty.numItems(item);
      let useable = (now >= need) // 材料不足時半透明
	  this.changePaintOpacity(useable);
      this.drawIcon(item.iconIndex, 0, y);
      this.drawText(item.name, ImageManager.iconWidth+4, y, w, 'left');
      this.drawText(String(need)+'　'.repeat(STILILA.SYN.PossessionText.length+1), 0, y, w, 'right');
      this.drawText(now, 0, y, w, 'right');
      y += y_plus;
    }

    this.changeTextColor(ColorManager.normalColor());
    
}


  //--------------------------------------------------------------------------
  // ● 定期更新
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	this.updateArrows();
}

  //--------------------------------------------------------------------------
  // ● 更新捲動箭頭
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.updateArrows = function() {
    this.downArrowVisible = this.origin.y < this.contents.height-this.windowHeight(this.y)+ImageManager.iconHeight+4;
    this.upArrowVisible = this.origin.y > 0;
};
  //--------------------------------------------------------------------------
  // ● 上捲
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.scrollUp = function() {
	this.oy = Math.max(this.oy - 4, 0);
	this.origin.y = this.oy;
}
  //--------------------------------------------------------------------------
  // ● 下捲
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.scrollDown = function() {
	this.oy = Math.min(this.oy + 4, Math.max(this.contents.height-this.windowHeight(this.y)+ImageManager.iconHeight+4, 0))
	this.origin.y = this.oy;
}
  
  //--------------------------------------------------------------------------
  // ● 繪製基本資訊(分歧用)
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.drawInfo = function(item, unknown) {
    // 清除之前的內容
    //this.oy = 0
   // this.contents.dispose;
    this.contents = new Bitmap(this.contentsWidth(), this.lineHeight()*4)
    this.contents.fontSize = 22;
    this.item = null;
    
    if (unknown) {return;}
    
    if (DataManager.isItem(item)) {
      this.drawItemInfo(item);
    } else if (DataManager.isWeapon(item)) {
      this.drawWeaponInfo(item);
    } else if (DataManager.isArmor(item)) {
      this.drawArmorInfo(item);
    }
}
  
  //--------------------------------------------------------------------------
  // ● 繪製道具基本資訊
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.drawItemInfo = function(item) {
}
  //--------------------------------------------------------------------------
  // ● 繪製武器資訊
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.drawWeaponInfo = function(item) {
    let half_w = this.contentsWidth()/2;
    let lineHeight = this.lineHeight();
	
    this.changeTextColor(this.systemColor())
    this.drawText(TextManager.param(2), 4, 0, half_w)
    this.drawText(TextManager.param(3), 4, lineHeight, half_w)
    this.drawText(TextManager.param(4), 4, lineHeight*2, half_w)
    this.drawText(TextManager.param(5), 4, lineHeight*3, half_w)
    this.drawText(TextManager.param(6), half_w+4, 0, half_w)
    this.drawText(TextManager.param(7), half_w+4, lineHeight, half_w)
    this.drawText(TextManager.param(0), half_w+4, lineHeight*2, half_w)
    this.drawText(TextManager.param(1), half_w+4, lineHeight*3, half_w)

    this.changeTextColor(ColorManager.normalColor());
    half_w -= 12;
    this.drawText(item.params[2], 0, 0, half_w, 'right')
    this.drawText(item.params[3], 0, lineHeight, half_w, 'right')
    this.drawText(item.params[4], 0, lineHeight*2, half_w, 'right')
    this.drawText(item.params[5], 0, lineHeight*3, half_w, 'right')
    this.drawText(item.params[6], half_w, 0, half_w, 'right')
    this.drawText(item.params[7], half_w, lineHeight, half_w, 'right')
    this.drawText(item.params[0], half_w, lineHeight*2, half_w, 'right')
    this.drawText(item.params[1], half_w, lineHeight*3, half_w, 'right')
}
  //--------------------------------------------------------------------------
  // ● 繪製防具資訊
  //--------------------------------------------------------------------------
Window_SynthesisInfo.prototype.drawArmorInfo = function(item) {
    let half_w = this.contentsWidth()/2;
	let lineHeight = this.lineHeight();
    
    this.changeTextColor(this.systemColor())
    this.drawText(TextManager.param(2), 4, 0, half_w)
    this.drawText(TextManager.param(3), 4, lineHeight, half_w)
    this.drawText(TextManager.param(4), 4, lineHeight*2, half_w)
    this.drawText(TextManager.param(5), 4, lineHeight*3, half_w)
    this.drawText(TextManager.param(6), half_w+4, 0, half_w)
    this.drawText(TextManager.param(7), half_w+4, lineHeight, half_w)
    this.drawText(TextManager.param(0), half_w+4, lineHeight*2, half_w)
    this.drawText(TextManager.param(1), half_w+4, lineHeight*3, half_w)

    this.changeTextColor(ColorManager.normalColor());
    half_w -= 12;
    this.drawText(item.params[2], 0, 0, half_w, 'right')
    this.drawText(item.params[3], 0, lineHeight, half_w, 'right')
    this.drawText(item.params[4], 0, lineHeight*2, half_w, 'right')
    this.drawText(item.params[5], 0, lineHeight*3, half_w, 'right')
    this.drawText(item.params[6], half_w, 0, half_w, 'right')
    this.drawText(item.params[7], half_w, lineHeight, half_w, 'right')
    this.drawText(item.params[0], half_w, lineHeight*2, half_w, 'right')
    this.drawText(item.params[1], half_w, lineHeight*3, half_w, 'right')

}





//==============================================================================
// ■ Window_SynthesisAmount
//------------------------------------------------------------------------------
// 　數量輸入視窗
//==============================================================================
function Window_SynthesisAmount() {
	this.initialize.apply(this, arguments);
}
Window_SynthesisAmount.prototype = Object.create(Window_Selectable.prototype);
Window_SynthesisAmount.prototype.constructor = Window_SynthesisAmount;
  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.initialize = function() {
	Window_Selectable.prototype.initialize.call(this, new Rectangle(160, Graphics.height-72*2, Graphics.width-160, 72));
    this.active = false;
    this._index = 0;
    this.opacity = 0;
    this.amount = 1;
    this.main_window = null;
    this.item = null;
    this.item_type = 'item';
}


Window_SynthesisAmount.prototype.update = function() {
	Window_Selectable.prototype.update.call(this)
	this.updateCursor();
}
  //--------------------------------------------------------------------------
  // ● 更新游標
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.updateCursor = function() {
    if (this.item && this.active) {
		
	  let w = this.textWidth('　　');
	  let minusW = w + this.textWidth('》');
      this.setCursorRect(this.contents.width-minusW-2, 0, w+4, Window_Base.prototype.itemHeight.call(this));
    }else{
      this.setCursorRect(0, 0, 0, 0);
    }
}
  //--------------------------------------------------------------------------
  // ● 获取项目数
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.maxItems = function() {
    return 1;
}
  //--------------------------------------------------------------------------
  // ● 刷新
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.refresh = function(type, id, exist, amount_reset) {
    this.contents.clear();

    if (!exist) {
      this.item = null;
      this.updateCursor();
      return;
    }

    if (amount_reset) {this.amount = 1};
	
    // 紀錄道具
    this.item_type = type;
    switch (type){
    case 'item': 
		this.item = $dataItems[id];
		break;
    case 'weapon':
		this.item = $dataWeapons[id];
		break;
    case 'armor':  
		this.item = $dataArmors[id];
		break;
    }
	
	
    // 描繪成功率
    this.changeTextColor(this.systemColor())
    this.drawText(STILILA.SYN.SuccessText, 0, 0, this.contents.width)
    this.changeTextColor(ColorManager.normalColor())
    this.drawText('　'.repeat(STILILA.SYN.SuccessText.length) + String($gameParty.synthesis_success[type][id]) + '%', 0, 0, this.contents.width)
    
    // 描繪製作數量
    this.changeTextColor(this.systemColor())
    this.drawText(STILILA.SYN.AmountText+'《　　》', 0, 0, this.contents.width, 'right')
    this.changeTextColor(ColorManager.normalColor())
    this.drawText(this.amount+'　', 0, 0, this.contents.width, 'right')
}
  
  
  //--------------------------------------------------------------------------
  // ● 數量 +1
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.cursorRight = function(wrap) {
	var warp = warp || false;
    if (!this.item) {return;}
    this.amount = Math.min(this.amount+1, Math.max($gameParty.maxItems(this.item) - $gameParty.numItems(this.item),1))
    this.refresh(this.item_type, this.item.id, true)
    
    let unknown = $gameParty.synthesis_data[this.item_type][this.item.id] == 1 
    this.main_window.refresh(this.item_type, this.item.id, unknown, true, this.amount)
}
  //--------------------------------------------------------------------------
  // ● 數量 -1
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.cursorLeft = function(wrap) {
	var warp = warp || false;
    if (!this.item) {return;}
    this.amount = Math.max(this.amount-1,1)
    this.refresh(this.item_type, this.item.id, true)
    
    let unknown = $gameParty.synthesis_data[this.item_type][this.item.id] == 1 
    this.main_window.refresh(this.item_type, this.item.id, unknown, true, this.amount)
}
  //--------------------------------------------------------------------------
  // ● 數量 +10
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.cursorPagedown = function() {
    if (!this.item) {return;}
    this.amount = Math.min(this.amount+10, Math.max($gameParty.maxItems(this.item) - $gameParty.numItems(this.item),1))
    this.refresh(this.item_type, this.item.id, true)
    
    let unknown = $gameParty.synthesis_data[this.item_type][this.item.id] == 1 
    this.main_window.refresh(this.item_type, this.item.id, unknown, true, this.amount)
}
  //--------------------------------------------------------------------------
  // ● 數量 -10
  //--------------------------------------------------------------------------
Window_SynthesisAmount.prototype.cursorPageup = function() {
    if (!this.item) {return;}
    this.amount = Math.max(this.amount-10,1)
    this.refresh(this.item_type, this.item.id, true)
    
    let unknown = $gameParty.synthesis_data[this.item_type][this.item.id] == 1
    this.main_window.refresh(this.item_type, this.item.id, unknown, true, this.amount)
}


//==============================================================================
// ■ Window_SynthesisResult
//------------------------------------------------------------------------------
//    製作結果視窗
//==============================================================================
function Window_SynthesisResult() {
	this.initialize.apply(this, arguments);
}
Window_SynthesisResult.prototype = Object.create(Window_Base.prototype);
Window_SynthesisResult.prototype.constructor = Window_SynthesisResult;


  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_SynthesisResult.prototype.initialize = function() {
	Window_Base.prototype.initialize.call(this, new Rectangle(Graphics.width/2 - this.windowWidth()/2, Graphics.height/2 - this.windowHeight()/2, this.windowWidth(), this.windowHeight()));
	this.backOpacity = 255;
}
  
  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_SynthesisResult.prototype.windowWidth = function() {
    return 320;
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的高度
  //--------------------------------------------------------------------------
Window_SynthesisResult.prototype.windowHeight = function() {
    return this.fittingHeight(4);
}
  //--------------------------------------------------------------------------
  // ● 刷新
  //    list：製作結果
  //--------------------------------------------------------------------------
Window_SynthesisResult.prototype.refresh = function(list) {
    // 清除原內容
    this.contents.clear();
    
    let w = this.contents.width;
    let h = this.lineHeight();
    
    // 「合成結果」文字
    this.drawText(STILILA.SYN.ResultText, 0, 0, w);
    
    // 分隔線
    let color = ColorManager.normalColor();
    color.alpha = 128
    this.contents.fillRect(0, this.fittingHeight(0)+this.lineHeight()/2, this.contentsWidth(), 2, color);
    
    // 成功和失敗道具取得數
    let target = list['success'][0];
    let garbage = list['fail'][0];
    
    let line = 1;
    if (list['success'][1] > 0) {
      this.drawIcon(target.iconIndex, 0, this.fittingHeight(line))
      this.drawText(target.name, ImageManager.iconWidth+4, this.fittingHeight(line), w)
      this.drawText('× '+String(list['success'][1]), 0, this.fittingHeight(line), w, 'right')
      line += 1
    }
    
	
	
    if (list['fail'][1] > 0) {
      this.drawIcon(garbage.iconIndex, 0, this.fittingHeight(line))
      this.drawText(garbage.name, ImageManager.iconWidth+4, this.fittingHeight(line), w)
      this.drawText('× '+String(list['fail'][1]), 0, this.fittingHeight(line), w, 'right')
	}
    
}




