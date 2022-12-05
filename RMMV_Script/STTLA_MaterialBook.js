//==============================================================================
// ■ 素材圖鑑 v1.0
//    最後更新：2017/2/16
//--------------------------------------------------------------------------
//    提示道具從哪些怪物掉落、可自行增加其他取得方式，供合成類腳本快速查找用
//    也可當普通的道具圖鑑
//==============================================================================
//--------------------------------------------------------------------------
// ● 聯絡方式
//--------------------------------------------------------------------------
//  http://home.gamer.com.tw/homeindex.php?owner=qootm2
//  https://twitter.com/STILILA
  
/*:
 * @plugindesc 提示道具從哪些怪物掉落，供合成類腳本快速查找用。
 * @author STILILA
  
 * @param Menu Switch
 * @desc n 號開關ON時，加入選單中
 * @default 6
 
 * @param Menu Name
 * @desc 在主選單的顯示名稱
 * @default 素材圖鑑
 
 * @param Command Width
 * @desc 左邊選單的寬度
 * @default 200

 * @param Note AddFlag 
 * @desc 註解有此文字時，登錄到圖鑑內(ex：<(設定值)>)
 * @default 素材
  
 * @param Note RemoveFlag 
 * @desc 註解有此文字時，不登錄到圖鑑內(配合Add All用)
 * @default 非素材
  
 * @param Add All
 * @desc 將資料庫所有道具登錄到圖鑑(無名稱、非素材的除外)(0：關、1：開)
 * @default 0
 
 * @param Note Extra
 * @desc 說明追加額外取得方式。道具註解欄加上 <(設定值)> 方式1(換行)方式2(換行)方式3...</(設定值)> #注意要用半形符號
 * @default 素材取得
 
 * @param Percent Display
 * @desc 掉落率用百分比顯示(0：預設的分數表示、1：百分比表示)
 * @default 1
 
 * @param Ignore Newline
 * @desc 無視道具說明的換行符，開啟時無視換行(0：關、1：開)
 * @default 1
  
 * @param Bottom Help
 * @desc 底部的說明
 * @default 按TAB鍵切換取得方式/道具資訊
  
 * @param Text Unknown
 * @desc 道具未取得過時，顯示的文字 
 * @default ？？？
 
 * @param Text DropEnemy
 * @desc 用語：掉落敵人  
 * @default 掉落敵人：
 
 * @param Text ExtraGet
 * @desc 用語：額外取得方式 
 * @default 其他取得方式：
 
 * @param Text Compound
 * @desc 用語：製作物(需要STTLA_Synthesis.js)
 * @default 可製作：
 
 
 
@help
//--------------------------------------------------------------------------
// ● 使用法(上插件指令、下腳本指令)
//--------------------------------------------------------------------------
1.呼叫素材圖鑑畫面：
 * Material open
 * SceneManager.push(Scene_MaterialBook)

=======================================================
2.增加取得紀錄：
  $gameParty.addMaterial(種類,id)
  
  <種類> 'item'－道具、'weapon'－武器、'armor'－防具，省略時全部視為取得
  <id> 道具id，省略時該種類全部視為取得
  
  ex：
 * 全取得
 * Material add
 * $gameParty.addMaterial()
 * 全道具視為取得
 * Material add item
 * $gameParty.addMaterial('item')
 * 5號武器視為取得
 * Material add weapon 5
 * $gameParty.addMaterial('weapon', 5)
 
※只要拿過道具，就會自動紀錄，這功能是給使用者立刻解除隱藏資訊用的
========================================================   
3.移除取得紀錄：
  $gameParty.removeMaterial(種類,id)
  
  ex：
 * 移除所有取得紀錄
 * Material remove
 * $gameParty.removeMaterial()
 * 移除全道具取得紀錄
 * Material remove item
 * $gameParty.removeMaterial('item')  
 * 移除5號武器取得紀錄
 * Material remove weapon 5
 * $gameParty.removeMaterial('weapon', 5)
========================================================
與合成系統(STTLA_Synthesis.js)使用時：
https://www.dropbox.com/s/eiosrf3g1ddi48e/STTLA_Synthesis.js?dl=0
會追加顯示可製作道具
	  
*/


var STILILA = STILILA || {};
STILILA.MAT = {};

(function() {
var parameters = PluginManager.parameters('STTLA_MaterialBook');

STILILA.MAT.MenuSwitch = Number(parameters['Menu Switch'] || 6);
STILILA.MAT.MenuName = parameters['Menu Name'] || '素材圖鑑';
STILILA.MAT.LeftWidth = Number(parameters['Command Width'] || 200);
STILILA.MAT.AddAll = Number(parameters['Add All'] || 0);
STILILA.MAT.addNote = parameters['Note AddFlag'] || '素材';
STILILA.MAT.removeNote = parameters['Note RemoveFlag'] || '非素材';
STILILA.MAT.ExtraNote = parameters['Note Extra'] || '素材取得';
STILILA.MAT.Percent = Number(parameters['Percent Display'] || 1);
STILILA.MAT.TextUnknown = parameters['Text Unknown'] || '？？？';
STILILA.MAT.TextDropEnemy = parameters['Text DropEnemy'] || '掉落敵人：';
STILILA.MAT.TextExtraGet = parameters['Text ExtraGet'] || '其他取得方式：';
STILILA.MAT.TextCompound = parameters['Text Compound'] || '可製作：';
STILILA.MAT.BottomHelp = parameters['Bottom Help'] || '按TAB鍵切換取得方式/道具資訊';
STILILA.MAT.IgnoreNewline = Number(parameters['Ignore Newline'] || 1);

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === 'Material') {
		switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_MaterialBook);
                break;
            case 'add':
				$gameParty.addMaterial(args[1],Number(args[2]));
                break;
            case 'remove':
				$gameParty.removeMaterial(args[1],Number(args[2]));
                break;
        }
		
	}
};



//==============================================================================
// ■ Game_Party
//------------------------------------------------------------------------------
// 　管理队伍的类。保存有金钱及物品的信息。本类的实例请参考 $gameParty 。
//==============================================================================
  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
  var _Game_Party_initialize = Game_Party.prototype.initialize;
  Game_Party.prototype.initialize = function() {
	_Game_Party_initialize.call(this); 
    this.materials_got = {'item' : {}, 'weapon' : {}, 'armor' : {}};  // 已登錄清單
  }
  
  //--------------------------------------------------------------------------
  // ● 增加／减少物品
  //--------------------------------------------------------------------------
  var _Game_Party_gainItem = Game_Party.prototype.gainItem;
  Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    _Game_Party_gainItem.call(this, item, amount, includeEquip)
    var container = this.itemContainer(item);
    if (!container) {return;}
    if (amount < 1) {return;}
    
    if (DataManager.isItem(item)) {
      this.materials_got['item'][item.id] = true;
    } else if (DataManager.isWeapon(item)) {
      this.materials_got['weapon'][item.id] = true;
    } else if (DataManager.isArmor(item)) {
      this.materials_got['armor'][item.id] = true;
    }
    
  }
  //--------------------------------------------------------------------------
  // ● 取得過此物品
  //--------------------------------------------------------------------------
  Game_Party.prototype.isItemGot = function(item) {
    if (DataManager.isItem(item)) {
      return this.materials_got['item'][item.id]
    } else if (DataManager.isWeapon(item)) {
      return this.materials_got['weapon'][item.id]
    } else if (DataManager.isArmor(item)) {
      return this.materials_got['armor'][item.id]
    }
  };
  
  
  //--------------------------------------------------------------------------
  // ● 追加取得道具紀錄
  //    type：種類('item'、'weapon'、'armor')，-1為全部取得
  //    id(可省略)：道具ID， -1為此種類全部取得，省略時為-1
  //--------------------------------------------------------------------------
  Game_Party.prototype.addMaterial = function(type, id) {
	var type = type || -1;
	var id = id || -1; 
	var item = null;
    if (type === -1) {
	  var allItems = $dataItems.concat($dataWeapons).concat($dataArmors);
	  
		
      for (var i=0; i<allItems.length; i++) { 
		item = allItems[i];
        if (item) {
			if (DataManager.isItem(item)) {
			  this.materials_got['item'][item.id] = true;
			} else if (DataManager.isWeapon(item)) {
			  this.materials_got['weapon'][item.id] = true;
			} else if (DataManager.isArmor(item)) {
			  this.materials_got['armor'][item.id] = true;
			}
		}
      }
	} else if (id === -1) {
      switch (type) {
      case 'item':
        for (var i=0; i<$dataItems.length; i++) {
			item = $dataItems[i];
			if (item) {this.materials_got['item'][item.id] = true;}
        }
		break;
      case 'weapon':
        for (var i=0; i<$dataWeapons.length; i++) {
			item = $dataWeapons[i];
			if (item) {this.materials_got['weapon'][item.id] = true;}
        }
		break;
      case 'armor':
        for (var i=0; i<$dataArmors.length; i++) {
			item = $dataArmors[i];
			if (item) {this.materials_got['armor'][item.id] = true;}
        }
		break;
      }
    } else {
      // 登錄
      this.materials_got[type][id] = true;
    }
 
  };
  //--------------------------------------------------------------------------
  // ● 移除取得道具紀錄
  //    type：種類('item'、'weapon'、'armor')，-1為移除所有紀錄
  //    id(可省略)：道具ID， -1為移除此種類所有紀錄，省略時為-1
  //--------------------------------------------------------------------------
  Game_Party.prototype.removeMaterial = function(type, id) {
	var type = type || -1;
	var id = id || -1;	
    if (type === -1) {
		this.materials_got = {'item' : {}, 'weapon' : {}, 'armor' : {}};
    } else if (id === -1) {
		this.materials_got[type] = {};
    } else {
		delete this.materials_got[type][id];
    }
  };
  

//==============================================================================
// ■ Window_MenuCommand
//------------------------------------------------------------------------------
// 　菜单画面中显示指令的窗口
//==============================================================================
var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
	_Window_MenuCommand_addOriginalCommands.call(this);
    if ($gameSwitches.value(STILILA.MAT.MenuSwitch)) {
      this.addCommand(STILILA.MAT.MenuName, 'material');
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
var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
	_Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('material',    this.callMaterial.bind(this));
};
  
//--------------------------------------------------------------------------
// ● 呼叫素材圖鑑畫面
//--------------------------------------------------------------------------
Scene_Menu.prototype.callMaterial = function() {
    SceneManager.push(Scene_MaterialBook);
}
  

})();  // (function() {






//==============================================================================
// ■ Scene_MaterialBook
//------------------------------------------------------------------------------
// 　菜单画面
//==============================================================================

function Scene_MaterialBook() {
    this.initialize.apply(this, arguments);
}
Scene_MaterialBook.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MaterialBook.prototype.constructor = Scene_MaterialBook;

  //--------------------------------------------------------------------------
  // ● 开始处理
  //--------------------------------------------------------------------------
  Scene_MaterialBook.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.create_left_window();
    this.create_right_window();
	this.create_bottom_window();
  }
  //--------------------------------------------------------------------------
  // ● 更新画面（基础）
  //--------------------------------------------------------------------------
  Scene_MaterialBook.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (!this.left_window.active) {
      if (Input.isTriggered('cancel')) {
        SoundManager.playCancel();
        this.left_window.activate();
      }
      if (Input.isPressed('up')) {
        this.right_window.scroll_up();
      }
      if (Input.isPressed('down')) {
        this.right_window.scroll_down();
      }
	}
    
    // 按下tab鍵，切換模式
    if (Input.isTriggered('tab')) {
      this.right_window.change_mode();
    }
  }
  //--------------------------------------------------------------------------
  // ● 生成左視窗
  //--------------------------------------------------------------------------
  Scene_MaterialBook.prototype.create_left_window = function() {
    this.left_window = new Window_MaterialCommand();
    this.left_window.setHandler('ok',    this.active_right_window.bind(this));
    this.left_window.setHandler('cancel',    this.popScene.bind(this));
	this.addChild(this.left_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成右視窗
  //--------------------------------------------------------------------------
  Scene_MaterialBook.prototype.create_right_window = function() {
    this.right_window = new Window_MaterialHelp();
    this.left_window._helpWindow = this.right_window;
	this.left_window.updateHelp();
	this.addChild(this.right_window);
  }
  //--------------------------------------------------------------------------
  // ● 生成底視窗
  //--------------------------------------------------------------------------
  Scene_MaterialBook.prototype.create_bottom_window = function() {
    this.bottom_window = new Window_MaterialBottom();
	this.addChild(this.bottom_window);
  }
  //--------------------------------------------------------------------------
  // ● 活化右視窗
  //--------------------------------------------------------------------------
  Scene_MaterialBook.prototype.active_right_window = function() {
    // 不需要捲動時
    if (this.right_window.contents.height <= this.right_window.contentsHeight()) {
      this.left_window.activate();
    }
  }




//==============================================================================
// ■ Window_MaterialCommand
//------------------------------------------------------------------------------
// 　
//==============================================================================
function Window_MaterialCommand() {
	this.initialize.apply(this, arguments);
}
Window_MaterialCommand.prototype = Object.create(Window_Command.prototype);
Window_MaterialCommand.prototype.constructor = Window_MaterialCommand;

  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_MaterialCommand.prototype.initialize = function() {
	Window_Command.prototype.initialize.call(this, 0, 0);
    this.active = true;
    this._helpWindow = null;
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_MaterialCommand.prototype.windowWidth = function() {
    return STILILA.MAT.LeftWidth;
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的高度
  //--------------------------------------------------------------------------
Window_MaterialCommand.prototype.windowHeight = function() {
    return Graphics.height - this.fittingHeight(1);
}
  //--------------------------------------------------------------------------
  // ● 作成選項
  //--------------------------------------------------------------------------
Window_MaterialCommand.prototype.makeCommandList = function() {
	var allItems = $dataItems.concat($dataWeapons).concat($dataArmors);
    var materials = allItems.filter(function(item) {
		if (item) {
			return ((item.meta[STILILA.MAT.addNote] || (STILILA.MAT.AddAll && item.name != '')) && !item.meta[STILILA.MAT.removeNote]);
		}
	}, this);
	var item = null;
    for (var i=0; i<materials.length; i++) {
		item = materials[i];
		if ($gameParty.isItemGot(item)) {
			this.addCommand(item.name, 'ok', true, item);
		} else {
			this.addCommand(STILILA.MAT.TextUnknown, 'ok', true, item);
		}
    }
}
  
  //--------------------------------------------------------------------------
  // ● 獲取此道具
  //--------------------------------------------------------------------------
Window_MaterialCommand.prototype.item = function() {
    return this.currentExt();
}
  //--------------------------------------------------------------------------
  // ● 更新帮助内容
  //--------------------------------------------------------------------------
Window_MaterialCommand.prototype.updateHelp = function() {
    switch (this._helpWindow.mode) {
    case 0:
      this._helpWindow.setItem(this.item());
	  break;
    case 1:
      this._helpWindow.setInfo(this.item());
	  break;
	}
}




//==============================================================================
// ■ Window_MaterialHelp
//------------------------------------------------------------------------------
// 　
//==============================================================================
function Window_MaterialHelp() {
	this.initialize.apply(this, arguments);
}
Window_MaterialHelp.prototype = Object.create(Window_Base.prototype);
Window_MaterialHelp.prototype.constructor = Window_MaterialHelp;

  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, Graphics.width-this.windowWidth(), 0, this.windowWidth(), this.windowHeight());
	this.regStart = new RegExp('<'+STILILA.MAT.ExtraNote+'>');
	this.regEnd = new RegExp('</'+STILILA.MAT.ExtraNote+'>');
	this.oy = 0;
	this.mode = 0;
    this.item = null;
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.windowWidth = function() {
    return Graphics.width - STILILA.MAT.LeftWidth;
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的高度
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.windowHeight = function() {
    return Graphics.height - this.fittingHeight(1);
}
  //--------------------------------------------------------------------------
  // ● 清除
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.clear = function() {
    this.contents.clear();
}
  //--------------------------------------------------------------------------
  // ● 上捲
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.scroll_up = function() {
	this.oy = Math.max(this.oy - 4, 0);
	this.origin.y = this.oy;
}
  //--------------------------------------------------------------------------
  // ● 下捲
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.scroll_down = function() {
	this.oy = Math.min(this.oy + 4, Math.max(this.contents.height-this.height+36, 0))
	this.origin.y = this.oy;
}

  //--------------------------------------------------------------------------
  // ● 定期更新
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	this.updateArrows();
}
  //--------------------------------------------------------------------------
  // ● 更新捲動箭頭
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.updateArrows = function() {
    this.downArrowVisible = this.origin.y < this.contents.height-this.height+36;
    this.upArrowVisible = this.origin.y > 0;
};

  //--------------------------------------------------------------------------
  // ● 轉換模式
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.change_mode = function() {
    switch (this.mode) {
    case 0:
      this.mode = 1;
      this.setInfo(this.item);
	  break;
    case 1:
      this.mode = 0;
      this.setItem(this.item);
	  break;
	}
}

  //--------------------------------------------------------------------------
  // ● 取得內容高
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.get_contents_height = function(item) {
    var y = this.lineHeight();
    var y_plus = this.lineHeight();
    var enemy = null;
    for (var i=1; i<$dataEnemies.length; i++) {
	  enemy = $dataEnemies[i];
	  if (enemy) {
		  var flag = null;
		  var drop = null;
		  for (var b=0; b<enemy.dropItems.length; b++) {
			drop = enemy.dropItems[b];
			if (DataManager.isItem(item) && drop.kind === 1 && drop.dataId === item.id) {
			  flag = true;
			  break;
			} else if (DataManager.isWeapon(item) && drop.kind === 2 && drop.dataId === item.id) {
			  flag = true;
			  break;
			} else if (DataManager.isArmor(item) && drop.kind === 3 && drop.dataId === item.id) {
			  flag = true;
			  break;
			}
		 }
	  }
      if (flag) {
        y += y_plus;
      }
    }  

    // 有設定其他取得途徑的情況
    if (item.meta[STILILA.MAT.ExtraNote]) {
      y += y_plus
      var extra = false
	  
	  var notes = item.note.split(/\n/);
	  var line = null;
      for (var i=0; i<notes.length; i++) {
		line = notes[i];
        if (this.regStart.test(line)) {
          extra = true;
        } else if (this.regEnd.test(line)) {
          extra = false;
        } else {
          if (extra) {
            y += y_plus;
          }
		}
      }
    }
	// 有合成腳本的情況
	if (STILILA.SYN) {
		y += y_plus;
		for (var stype in STILILA.SYN.List) {
			for (var sid in STILILA.SYN.List[stype]) {
				if (DataManager.isItem(item)) {
					if (Object.keys(STILILA.SYN.List[stype][sid]['mi']).contains(String(item.id))) {
						y += y_plus;
					}
				} else if (DataManager.isWeapon(item)) {
					if (Object.keys(STILILA.SYN.List[stype][sid]['mw']).contains(String(item.id))) {
						y += y_plus;
					}
				} else if (DataManager.isArmor(item)) {
					if (Object.keys(STILILA.SYN.List[stype][sid]['ma']).contains(String(item.id))) {
						y += y_plus;
					}
				}
			}
		}
	};
	
	
    return Math.max(y, this.contentsHeight())
    
}
  
  //--------------------------------------------------------------------------
  // ● 设置物品
  //     item : 技能、物品等
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.setItem = function(item) {
    this.contents.clear();
	this.item = item;
    if (!item) {return;}
    
    // 重新製作contents大小
    //this.contents.dispose
    this.contents = new Bitmap(this.contentsWidth(), this.get_contents_height(item));
    this.origin.y = this.oy = 0;
    
    this.changeTextColor(this.systemColor());
    this.drawText(STILILA.MAT.TextDropEnemy, 0, 0, 240);
    this.changeTextColor(this.normalColor());
    var y = this.lineHeight();
    var y_plus = this.lineHeight();
    
    var enemy = null;
    for (var i=1; i<$dataEnemies.length; i++) {
	  enemy = $dataEnemies[i];
      if (enemy) {
		  var enemy_name = null;
		  var max_denominator = 99;
		  var drop = null;
		  for (var b=0; b<enemy.dropItems.length; b++) {
			drop = enemy.dropItems[b];
			if (DataManager.isItem(item) && drop.kind === 1 && drop.dataId === item.id) {
			  // 記憶名稱
			  enemy_name = enemy.name
			  // 記憶最高掉落率
			  if (max_denominator > drop.denominator) {max_denominator = drop.denominator;}
			} else if (DataManager.isWeapon(item) && drop.kind === 2 && drop.dataId === item.id) {
			  enemy_name = enemy.name
			  if (max_denominator > drop.denominator) {max_denominator = drop.denominator;}
			} else if (DataManager.isArmor(item) && drop.kind === 3 && drop.dataId === item.id) {
			  enemy_name = enemy.name
			  if (max_denominator > drop.denominator) {max_denominator = drop.denominator;}
			}
		  }
	  }
	  // 如果有掉落
	  if (enemy_name) {
		this.setText(y, enemy_name, max_denominator);
		y += y_plus
	  }
    }  
    
    // 有設定其他取得途徑的情況
    if (item.meta[STILILA.MAT.ExtraNote]) {
      this.changeTextColor(this.systemColor())
      this.drawText(STILILA.MAT.TextExtraGet, 0, y, 240)
      y += y_plus
      this.changeTextColor(this.normalColor())
      var extra = false;
	  var notes = item.note.split(/\n/);
	  var line = null;
      for (var i=0; i<notes.length; i++) {
		line = notes[i];
        if (this.regStart.test(line)) {
          extra = true;
        } else if (this.regEnd.test(line)) {
          extra = false;
        } else {
          if (extra) {
            this.drawText('  '+line, 0, y, 240)
            y += y_plus;
          }
        }
      }
    }
    

	
	// 可製作(需STTLA_Synthesis.js)
	if (STILILA.SYN) {
		this.changeTextColor(this.systemColor());
		this.drawText('可製作：', 0, y, 240);
		this.changeTextColor(this.normalColor());
		y += y_plus;
		var w = this.contentsWidth();
		for (var stype in STILILA.SYN.List) {
			for (var sid in STILILA.SYN.List[stype]) {
				if (DataManager.isItem(item)) {
					var textWidth = this.textWidth('  ');
					if (Object.keys(STILILA.SYN.List[stype][sid]['mi']).contains(String(item.id))) {
						var resultItem = this.getResultItem(stype, sid);
						this.drawIcon(resultItem.iconIndex, textWidth, y);
						this.drawText('  '+resultItem.name, Window_Base._iconWidth+4, y, w, 'left');
						y += y_plus;
					}
				} else if (DataManager.isWeapon(item)) {
					var textWidth = this.textWidth('  ');
					if (Object.keys(STILILA.SYN.List[stype][sid]['mw']).contains(String(item.id))) {
						var resultItem = this.getResultItem(stype, sid);
						this.drawIcon(resultItem.iconIndex, textWidth, y);
						this.drawText('  '+resultItem.name, Window_Base._iconWidth+4, y, w, 'left');
						y += y_plus;
					}

				} else if (DataManager.isArmor(item)) {
					var textWidth = this.textWidth('  ');
					if (Object.keys(STILILA.SYN.List[stype][sid]['ma']).contains(String(item.id))) {
						var resultItem = this.getResultItem(stype, sid);
						this.drawIcon(resultItem.iconIndex, textWidth, y);
						this.drawText('  '+resultItem.name, Window_Base._iconWidth+4, y, w, 'left');
						y += y_plus;
					}
				}
			}
		}
	}
	
    
}
  //--------------------------------------------------------------------------
  // ● 取得合成物
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.getResultItem = function(type, id) {
	switch (type) {
	case 'item':   
		return $dataItems[id]; 
		break;
	case 'weapon':  
		return $dataWeapons[id]; 
		break;
	case 'armor':   
		return $dataArmors[id];
		break;
	}

	
}
  //--------------------------------------------------------------------------
  // ● 處理普通文字
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
	if (textState.x + w > this.contentsWidth()) {
		textState.x = textState.left;
		textState.y += textState.height;
		//textState.index++;
	}		
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
    textState.x += w;
};

  //--------------------------------------------------------------------------
  // ● 设置道具資訊
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.setInfo = function(item) {
    this.createContents(); // 重新製作contents
    this.oy = 0;
    this.item = item;
    if (!$gameParty.isItemGot(item)) {
      this.drawText(STILILA.MAT.TextUnknown, 0, 0, this.contents.width);
      return;
    }
    var y = 0;
    var y_plus = this.lineHeight();
    // 描繪名稱
    this.drawIcon(item.iconIndex, 0, 0);
    this.drawText(item.name, Window_Base._iconWidth+4, 0, this.contents.width)
    // 描繪價格
    this.drawText(String(item.price)+' '.repeat(TextManager.currencyUnit.length+1), 0, 0, this.contents.width, 'right')
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.currencyUnit, 0, 0, this.contents.width, 'right');
    this.changeTextColor(this.normalColor());
    y += y_plus;
    // 描繪說明
	var description = item.description;
	if (STILILA.MAT.IgnoreNewline) {
		description = description.replace(/\n/, '');
	}
    this.drawTextEx(description, 4, y);
    y += y_plus;
    y += y_plus;
    y += y_plus;
    y += y_plus;
    
    if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
      // 描繪裝備資訊
      var half_w = this.contentsWidth()/2;
	
      this.changeTextColor(this.systemColor())
      this.drawText(TextManager.param(2), 4, y, half_w)
      this.drawText(TextManager.param(3), 4, y+y_plus, half_w)
      this.drawText(TextManager.param(4), 4, y+y_plus*2, half_w)
      this.drawText(TextManager.param(5), 4, y+y_plus*3, half_w)
      this.drawText(TextManager.param(6), half_w+4, y, half_w)
      this.drawText(TextManager.param(7), half_w+4, y+y_plus, half_w)
      this.drawText(TextManager.param(0), half_w+4, y+y_plus*2, half_w)
      this.drawText(TextManager.param(1), half_w+4, y+y_plus*3, half_w)

      this.changeTextColor(this.normalColor());
      half_w -= 12;
      this.drawText(item.params[2], 0, y, half_w, 'right')
      this.drawText(item.params[3], 0, y+y_plus, half_w, 'right')
      this.drawText(item.params[4], 0, y+y_plus*2, half_w, 'right')
      this.drawText(item.params[5], 0, y+y_plus*3, half_w, 'right')
      this.drawText(item.params[6], half_w, y, half_w, 'right')
      this.drawText(item.params[7], half_w, y+y_plus, half_w, 'right')
      this.drawText(item.params[0], half_w, y+y_plus*2, half_w, 'right')
      this.drawText(item.params[1], half_w, y+y_plus*3, half_w, 'right')
	  
    }
}
  //--------------------------------------------------------------------------
  // ● 设置内容
  //--------------------------------------------------------------------------
Window_MaterialHelp.prototype.setText = function(y, enemy_name, denominator) {
    this.drawText('  '+enemy_name, 0, y, 240)
    if (STILILA.MAT.Percent) {
      denominator = Math.round(100/denominator);
      this.drawText(String(denominator)+'%', 0, y, this.windowWidth()-36, 'right')
    } else {
      this.drawText('1/'+String(denominator), 0, y, this.windowWidth()-36, 'right')
    }
    
};

//==============================================================================
// ■ Window_MaterialBottom
//------------------------------------------------------------------------------
// 　素材圖鑑的底部視窗
//==============================================================================
function Window_MaterialBottom() {
	this.initialize.apply(this, arguments);
}
Window_MaterialBottom.prototype = Object.create(Window_Base.prototype);
Window_MaterialBottom.prototype.constructor = Window_MaterialBottom;

  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_MaterialBottom.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0, Graphics.height-this.fittingHeight(1), Graphics.width, this.fittingHeight(1));
	this.drawText(STILILA.MAT.BottomHelp, 0, 0, this.contents.width, 'center');
}


