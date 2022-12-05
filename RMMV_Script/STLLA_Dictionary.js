/*
==============================================================================
 ■ 用語辭典 v1.2
   最後更新：2021/10/2
  http://home.gamer.com.tw/homeindex.php?owner=qootm2
  https://twitter.com/STILILA  
==============================================================================
*/

/*:
 * @plugindesc 用語字典，說明可階段開放，說明文支援對話控制符 (v1.1)
 * @author STILILA
 
 * @param Menu Switch
 * @desc n 號開關ON時，加入選單中
 * @default 7
 
 * @param Menu Name
 * @desc 在主選單的顯示名稱
 * @default 用語字典

 * @param Unknown Text
 * @desc 未開放時的文字
 * @default ？？？
 
 * @param Left Window Width
 * @desc 左邊選項窗的寬
 * @default 180
 
@help
--------------------------------------------------------------------------
 ● 更新履歷
--------------------------------------------------------------------------
 v1.2
  追加顯示圖片的功能，規格更新、無法與舊版兼容。具體請見設定檔的說明

* v1.1
* 修正和合成腳本(STTLA_Synthesis.js)一起用時只能進入其中一邊的問題
* 修正左邊分頁捲動時游標會跑到最上面的問題
* 變數存取方式調整，讓使用者遊戲公開後仍可自由地新增項目

//--------------------------------------------------------------------------
// ● 必須
//--------------------------------------------------------------------------
自定義設定檔(放在此插件下面)：
https://www.dropbox.com/s/ylym0052j5g46np/STLLA_Dictionary_setting.js?dl=0

//--------------------------------------------------------------------------
// ● 使用法(上插件指令、下腳本指令)
//--------------------------------------------------------------------------

1.呼叫辭典畫面
Dictionary open
SceneManager.push(Scene_Dictionary)
    
2.設置用語開放狀態 (step == 0 為未開放)
Dictionary set tag name step
ConfigManager.setDict(tag, name, step)

ex：
  // 全開放
  Dictionary open
  ConfigManager.setDict()
  
  //「世界觀」內的所有用語全開放
  Dictionary set 世界觀
  ConfigManager.setDict("世界觀")   
  
  //「人物」的「拉爾夫」用語說明開放到最後階段
  Dictionary set 人物 拉爾夫
  ConfigManager.setDict("人物", "拉爾夫") 
  
  //「人物」的「拉爾夫」用語說明開放為階段1
  Dictionary set 人物 拉爾夫 1
  ConfigManager.setDict("人物", "拉爾夫", 1) 
  
  // 全設為未開放
  Dictionary reset
  ConfigManager.setDict(null, null, 0) ／ ConfigManager.resetDict()
      
 
 
*/

var STILILA = STILILA || {};
STILILA.Dict = {};

(function() {
var parameters = PluginManager.parameters('STLLA_Dictionary');
STILILA.Dict.MenuSwitch = Number(parameters['Menu Switch'] || 7);
STILILA.Dict.MenuName = parameters['Menu Name'] || '用語字典';
STILILA.Dict.Unknown = parameters['Unknown Text'] || '？？？';
STILILA.Dict.LeftWindow = Number(parameters['Left Window Width'] || 180);
	
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === 'Dictionary') {
		switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_Dictionary);
                break;
            case 'set':
				ConfigManager.setDict(args[1],args[2],Number(args[3]));
                break;
            case 'reset':
				ConfigManager.resetDict();
                break;
        }
		
	}
};
	
	
// ----------------------------------------------
// ● 製作 Config 內容(存檔用，但這個不是存檔)
// ----------------------------------------------
var _ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
	var config = _ConfigManager_makeData.call(this);
	config.dictionaryList = this.dictionaryList;
	return config;
};
// ----------------------------------------------
// ● 載入 Config 內容(遊戲啟動時調用)
// ----------------------------------------------
var _ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
	_ConfigManager_applyData.call(this, config);
	this.dictionaryList = ConfigManager.loadDictData(config);
	
};
// ----------------------------------------------
// ● 載入用語資料
// config：config存檔內容
// ----------------------------------------------
ConfigManager.loadDictData = function(config) {
	// 有存檔的時候
	if (config.dictionaryList) {
		return config.dictionaryList;
	} else {
	// 沒的時候，做一份新的
		return ConfigManager.resetDict();
	}
}
	
	
  //--------------------------------------------------------------------------
  // ● 重設用語
  //-------------------------------------------------------------------------- 
ConfigManager.resetDict = function() {
	this.dictionaryList = {};
/* 	for (var tag in STILILA.Dict.Help) {
	  for (var name in STILILA.Dict.Help[tag]) {
		if (!this.dictionaryList[tag]) {this.dictionaryList[tag] = {}};
		this.dictionaryList[tag][name] = 0;
	  }
	} */
	ConfigManager.save();
	return this.dictionaryList;
}
  //--------------------------------------------------------------------------
  // ● 設置用語狀態(tag、名稱、階段)
  //-------------------------------------------------------------------------- 
ConfigManager.setDict = function(vtag, vname, vstep) {
    var vtag = vtag || undefined;
    var vname = vname || undefined;
    var vstep = vstep || (vstep === 0 ? 0 : undefined);
	var list = STILILA.Dict.Help	
    try {	
      // 沒指定tag 
      if (!vtag) {
        for (var tag in list) {
          for (var name in list[tag]) {
            if (vstep != undefined) {
              if (list[tag][name].length < vstep) {
                console.log('step超出此用語說明範圍。「tag：'+tag+'」、「name：'+name+'」、「step：'+vstep+'」、「用語說明數：'+STILILA.Dict.Help[tag][name].length+'」');
                continue;
              }
              console.log ('tag：'+tag+'、name：'+name+'、step：'+vstep+' 用語設置中…');
			} else {
              console.log('tag：'+tag+'、name：'+name+' 用語設置中…');
            }
			if (!ConfigManager.dictionaryList[tag]) {ConfigManager.dictionaryList[tag] = {};}
            ConfigManager.dictionaryList[tag][name] = (vstep != undefined) ? vstep : list[tag][name].length;
          }
        }
      // 沒指定name 
      } else if (!vname) {
        // ======== 錯誤處理
        if (!list[vtag]) {
          console.log('用語設定不存在「tag：'+vtag+'」')
          return;
        }
        // ======== 正常處理
        for (var name in list[vtag]) {
          if (vstep != undefined) {
            if (list[vtag][name].length < vstep) {
              console.log('step超出此用語說明範圍。「tag：//{vtag}」、「name：//{name}」、「step：//{vstep}」、「用語說明數：//{STILILA.Dict.Help[vtag][name].length}」')
              continue;
            }
            console.log('tag：'+vtag+'、name：'+name+'、step：'+vstep+' 用語設置中…')
		  } else {
            console.log('tag：'+vtag+'、name：'+name+' 用語設置中…')
          }
		  if (!ConfigManager.dictionaryList[vtag]) {ConfigManager.dictionaryList[vtag] = {};}
          ConfigManager.dictionaryList[vtag][name] = (vstep != undefined) ? vstep : list[vtag][name].length;
        }
      // 沒指定step
      } else if (vstep === undefined) {
        // ======== 錯誤處理
        if (!list[vtag]) {
          console.log('用語設定不存在「tag：'+vtag+'」');
          return;
        }
        if (!list[vtag][vname]) {
          console.log('用語設定「tag：'+vtag+'」中不存在「name：'+vname+'」');
          return;
        }
        // ======== 正常處理
        console.log('tag：'+vtag+'、name：'+vname+' 用語設置中…');
		if (!ConfigManager.dictionaryList[vtag]) {ConfigManager.dictionaryList[vtag] = {};}
        ConfigManager.dictionaryList[vtag][vname] = list[vtag][vname].length;
      } else {
        // ======== 錯誤處理
        if (!list[vtag]) {
          console.log('用語設定不存在「tag：'+vtag+'」');
          return;
        }
        if (!list[vtag][vname]) {
          console.log('用語設定「tag：'+vtag+'」中不存在「name：'+vname+'」');
          return;
        }
        if (list[vtag][vname].length < vstep) {
          console.log('step超出此用語說明範圍。「tag：'+vtag+'」、「name：'+vname+'」、「step：'+vstep+'」、「用語說明數：'+list[vtag][vname].length+'」');
          return;
	    }
        // ======== 正常處理
        console.log('tag：'+vtag+'、name：'+vname+'、step：'+vstep+' 用語設置中…');
		if (!ConfigManager.dictionaryList[vtag]) {ConfigManager.dictionaryList[vtag] = {};}
        ConfigManager.dictionaryList[vtag][vname] = vstep;
	  }
    } catch (e) {
      if (!vtag) {vtag = 'null';}
      if (!vname) {vname = 'null';}
      if (!vstep) {vstep = 'null';}
      console.log('設置用語的參數有誤，參數內容－－tag：'+vtag+'、name：'+vname+'、step：'+vstep);
      return;
    }
    ConfigManager.save();
}
	
	


	
//==============================================================================
// ■ Window_MenuCommand
//------------------------------------------------------------------------------
// 　菜单画面中显示指令的窗口
//==============================================================================
  //--------------------------------------------------------------------------
  // ● 添加選項
  //--------------------------------------------------------------------------
var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
	_Window_MenuCommand_addOriginalCommands.call(this);
    if ($gameSwitches.value(STILILA.Dict.MenuSwitch)) {
      this.addCommand(STILILA.Dict.MenuName, 'dictionary');
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
    this._commandWindow.setHandler('dictionary',    this.callDictionary.bind(this));
};
//--------------------------------------------------------------------------
// ● 呼叫合成畫面
//--------------------------------------------------------------------------
Scene_Menu.prototype.callDictionary = function() {
    SceneManager.push(Scene_Dictionary);
}

})();  // (function() {
	
	
	
//==============================================================================
// ■ Scene_Dictionary
//------------------------------------------------------------------------------
// 　用語介紹畫面。
//==============================================================================
function Scene_Dictionary() {
    this.initialize.apply(this, arguments);
}
Scene_Dictionary.prototype = Object.create(Scene_Base.prototype);
Scene_Dictionary.prototype.constructor = Scene_Dictionary;
  //--------------------------------------------------------------------------
  // ● 主處理
  //--------------------------------------------------------------------------
  Scene_Dictionary.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    // 生成用語說明視窗
    this.dictionary_window = new Window_DictionaryHelp();
    // 生成上方選項視窗
    this.upCommand_window = new Window_DictionaryUpCommand();
    this.upCommand_window.setHandler('ok', this.active_left_command.bind(this));
    this.upCommand_window.setHandler('cancel',    this.popScene.bind(this));
    
    // 生成左方選項視窗
    var tag = this.upCommand_window.nowCommandName();
    this.command_window = new Window_DictionaryLeftCommand(tag);
    this.command_window.setHandler('ok', this.active_help.bind(this));
    this.command_window.setHandler('cancel', this.active_up_command.bind(this))
    this.command_window.deactivate();
    this.dictionary_window.refresh(tag, this.command_window.nowCommandName())
    
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
	
	this.addChild(this.upCommand_window)
	this.addChild(this.command_window)
	this.addChild(this.dictionary_window)
	
    // 紀錄目前的游標位置(刷新說明內容判斷)
    this.now_index = 0;
    this.now_tag = tag;
    this.help_active = false;
    
	this.loadPictures()
    
  }
  //--------------------------------------------------------------------------
  // ● 讀取圖片
  //--------------------------------------------------------------------------
  Scene_Dictionary.prototype.loadPictures = function() {
	this.loadCount = 0
	this.loadCountMax = 0
	for (let tagName in STILILA.Dict.Help){
		if (!ConfigManager.dictionaryList[tagName]) {continue;} // 紀錄不存在就跳過
		let tagItem = STILILA.Dict.Help[tagName]
		for (let name in tagItem){
			if (!ConfigManager.dictionaryList[tagName][name]) {continue;}  // 紀錄不存在就跳過
			let step = ConfigManager.dictionaryList[tagName][name] - 1
			if (step < 0) {continue;} // 沒開啟就跳過
			let helpItems = tagItem[name][step] // 取得說明資料
			if (!helpItems) {continue;}  // 沒資料跳過
			for (let i=0; i<helpItems.length; i++){
				let item = helpItems[i]
				if (item['img']) {
					this.loadCountMax++
					let bitmap = ImageManager.loadPicture(item['img'])
					// 讀取完計數+1
					bitmap.addLoadListener(function(){ this.loadCount++ }.bind(this))
				}
			}
		}
	}
  }
  //--------------------------------------------------------------------------
  // ● 是否能開始了
  //-------------------------------------------------------------------------
	Scene_Dictionary.prototype.isReady = function() {
		return (this.loadCount >= this.loadCountMax) && Scene_Base.prototype.isReady.call(this);
	};
  
  //--------------------------------------------------------------------------
  // ● 活化上面視窗
  //--------------------------------------------------------------------------
  Scene_Dictionary.prototype.active_up_command = function() {
    this.upCommand_window.activate();
  }
  
  //--------------------------------------------------------------------------
  // ● 活化左邊視窗
  //--------------------------------------------------------------------------
  Scene_Dictionary.prototype.active_left_command = function() {
    this.command_window.activate();
    this.help_active = false;
  }
  
  //--------------------------------------------------------------------------
  // ● 活化說明視窗
  //--------------------------------------------------------------------------
  Scene_Dictionary.prototype.active_help = function() {
    // 說明未超出視窗
    if (this.dictionary_window.contents.height <= this.dictionary_window.contentsHeight()) {
      this.command_window.activate();
      this.help_active = false;
    } else {
      this.help_active = true;
    }
  }
  
  
  //--------------------------------------------------------------------------
  // ● 主處理
  //--------------------------------------------------------------------------
  Scene_Dictionary.prototype.update = function() {
    
    // 說明視窗運作中
    if (this.help_active) {
      // 取消
      if (Input.isTriggered('cancel')) {
        // 播放取消音效
        SoundManager.playCancel();
        // 活化左邊視窗
        this.active_left_command();
      }
      // 上捲
      if (Input.isPressed('up')) {
        this.dictionary_window.scroll_up();
	  }
      // 下捲
      if (Input.isPressed('down')) {
        this.dictionary_window.scroll_down();
	  }
	  Input.update();
    }  
    // tag不同時，刷新說明視窗
    if (this.now_tag != this.upCommand_window.nowCommandName()) {
      this.now_tag = this.upCommand_window.nowCommandName()
      this.now_index = 0;
      this.command_window.refresh(this.now_tag);
      this.dictionary_window.refresh(this.now_tag, this.command_window.nowCommandName());
    }
    // 游標移動時，刷新說明視窗
    if (this.now_index != this.command_window.index()) {
      this.now_index = this.command_window.index();
      this.dictionary_window.refresh(this.now_tag, this.command_window.nowCommandName());
    }
    // 原處理 (更新視窗等)
    Scene_Base.prototype.update.call(this);
  }




//==============================================================================
// ■ Window_DictionaryUpCommand
//------------------------------------------------------------------------------
// 　辭典上選擇窗
//==============================================================================
function Window_DictionaryUpCommand() {
    this.initialize.apply(this, arguments);
}
Window_DictionaryUpCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_DictionaryUpCommand.prototype.constructor = Window_DictionaryUpCommand;

  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_DictionaryUpCommand.prototype.initialize = function() {
	Window_HorzCommand.prototype.initialize.call(this, 0, 0);
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_DictionaryUpCommand.prototype.windowWidth = function() {
    return Graphics.width;
}
  //--------------------------------------------------------------------------
  // ● 获取列数
  //--------------------------------------------------------------------------
Window_DictionaryUpCommand.prototype.maxCols = function() {
    return Object.keys(STILILA.Dict.Help).length;
}
  //--------------------------------------------------------------------------
  // ● 生成指令列表
  //--------------------------------------------------------------------------
Window_DictionaryUpCommand.prototype.makeCommandList = function() {
    for (var key in STILILA.Dict.Help) { 
      this.addCommand(key, 'ok');
    }
}
  
  //--------------------------------------------------------------------------
  // ● 獲取目前指令
  //--------------------------------------------------------------------------
Window_DictionaryUpCommand.prototype.nowCommandName = function() {
    return this._list[this._index].name
}


//==============================================================================
// ■ Window_DictionaryLeftCommand
//------------------------------------------------------------------------------
// 　辭典左選擇窗
//==============================================================================
function Window_DictionaryLeftCommand() {
    this.initialize.apply(this, arguments);
}
Window_DictionaryLeftCommand.prototype = Object.create(Window_Command.prototype);
Window_DictionaryLeftCommand.prototype.constructor = Window_DictionaryLeftCommand;
  //--------------------------------------------------------------------------
  // ● 初始化对象
  //--------------------------------------------------------------------------
Window_DictionaryLeftCommand.prototype.initialize = function(tag) {
    this.tag = tag;
	Window_Command.prototype.initialize.call(this, 0, 72);
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_DictionaryLeftCommand.prototype.windowWidth = function() {
    return STILILA.Dict.LeftWindow;
}
  //--------------------------------------------------------------------------
  // ● 获取窗口的宽度
  //--------------------------------------------------------------------------
Window_DictionaryLeftCommand.prototype.windowHeight = function() {
    return Graphics.height-72;
}
  //--------------------------------------------------------------------------
  // ● 生成指令列表
  //--------------------------------------------------------------------------
Window_DictionaryLeftCommand.prototype.makeCommandList = function() {
    // 添加該分頁選項
    for (var name in STILILA.Dict.Help[this.tag]) {
		var saveList = ConfigManager.dictionaryList
		// 如果該說明欄未初始化
		if (!saveList[this.tag] || !saveList[this.tag][name]) {
			this.addCommand(STILILA.Dict.Unknown, 'ok');
		// 已初始化
		} else {
		    var step = saveList[this.tag][name];
			if (step > 0) {
				this.addCommand(name, 'ok');
			} else {
				this.addCommand(STILILA.Dict.Unknown, 'ok');
			}  
		}
    } 
}
  //--------------------------------------------------------------------------
  // ● 刷新
  //--------------------------------------------------------------------------
Window_DictionaryLeftCommand.prototype.refresh = function(tag) {
    this.tag = tag || this.tag;
    if (tag) {this._index = 0;}
    this.updateCursor();
    Window_Command.prototype.refresh.call(this);
}
  
  //--------------------------------------------------------------------------
  // ● 獲取目前指令
  //--------------------------------------------------------------------------
Window_DictionaryLeftCommand.prototype.nowCommandName = function() {
    return this._list[this._index].name;
};


//==============================================================================
// ■ Window_DictionaryHelp
//------------------------------------------------------------------------------
// 　用語畫面的說明視窗。
//==============================================================================
function Window_DictionaryHelp() {
    this.initialize.apply(this, arguments);
}
Window_DictionaryHelp.prototype = Object.create(Window_Base.prototype);
Window_DictionaryHelp.prototype.constructor = Window_DictionaryHelp;
  //--------------------------------------------------------------------------
  // ● 初始化物件
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.initialize = function() {
	Window_Base.prototype.initialize.call(this, STILILA.Dict.LeftWindow, 72, Graphics.width-STILILA.Dict.LeftWindow, Graphics.height-72);
	this.oy = 0;
}
  //--------------------------------------------------------------------------
  // ● 上捲
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.scroll_up = function() {
	this.oy = Math.max(this.oy - 4, 0);
	this.origin.y = this.oy;
}
  //--------------------------------------------------------------------------
  // ● 下捲
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.scroll_down = function() {
	this.oy = Math.min(this.oy + 4, Math.max(this.contents.height-this.height+36, 0))
	this.origin.y = this.oy;
}
  //--------------------------------------------------------------------------
  // ● 更新捲動箭頭
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.updateArrows = function() {
    this.downArrowVisible = this.origin.y < this.contents.height-this.height+36;
    this.upArrowVisible = this.origin.y > 0;
};
  //--------------------------------------------------------------------------
  // ● 定期更新
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	this.updateArrows();
};
  //--------------------------------------------------------------------------
  // ● 刷新(tag名稱, 項目名稱)
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.refresh = function(tag, item_name) {
    this.contents.clear()
    this.origin.y = this.oy = 0;
	// 說明未初始化的時候
	if (!ConfigManager.dictionaryList[tag] || !ConfigManager.dictionaryList[tag][item_name]) {
        this.createContents();
        this.drawTextEx(STILILA.Dict.Unknown,0,0);
		return;
	} 
    try {
		var step = ConfigManager.dictionaryList[tag][item_name];
		if (item_name != STILILA.Dict.Unknown && step > 0) {
			var help = STILILA.Dict.Help[tag][item_name][step-1];
			var new_height = this.getNewHeight(help) //this.lineHeight() + (help.split('\n').length-1) * this.lineHeight();
			this.contents = new Bitmap(this.contentsWidth(), new_height);
			this.drawHelpItem(help)
			//this.drawTextEx(help, 0, 0);
        } else {
			this.createContents();
			this.drawTextEx(STILILA.Dict.Unknown,0,0);
	    }
    } catch(e) {
		this.createContents();
		this.drawTextEx('Parameter setting error!!',0,0);
    }
 
};


  //--------------------------------------------------------------------------
  // ● 取得說明的總高
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.getNewHeight = function(helpItems){
	let final_h = 0
	for (let i=0; i<helpItems.length; i++){
		let item = helpItems[i]
		let new_h = 0
		// 圖片物件
		if (item['img']) {
			let bitmap = ImageManager.loadPicture(item['img'])
			new_h = (item['y'] ? item['y'] : 0) + (item['h'] ? item['h'] : bitmap.height)
		// 文字物件
		} else {
			new_h = this.lineHeight() + (item['text'].split('\n').length-1) * this.lineHeight() + (item['y'] ? item['y'] : 0)
		}
		// 更新最大高
		if (new_h > final_h) {final_h = new_h}
		
	}
	return final_h
}

  //--------------------------------------------------------------------------
  // ● 描繪說明內容
  //--------------------------------------------------------------------------
Window_DictionaryHelp.prototype.drawHelpItem = function(helpItems){
	for (let i=0; i<helpItems.length; i++){
		let item = helpItems[i]
		// 圖片物件
		if (item['img']) {
			let bitmap = ImageManager.loadPicture(item['img'])
			this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, (item['x'] ? item['x'] : 0), (item['y'] ? item['y'] : 0), (item['w'] ? item['w'] : bitmap.width), (item['h'] ? item['h'] : bitmap.height))
		// 文字物件
		} else {
			this.drawTextEx(item['text'], 0, (item['y'] ? item['y'] : 0));
		}
	}
}