/*
==============================================================================
 ■ 新物品提示 v1.0
   最後更新：2020/5/3
  http://home.gamer.com.tw/homeindex.php?owner=qootm2
  https://twitter.com/STILILA  
==============================================================================
*/

/*:
 * @plugindesc 取得新物品時給物品名稱上色，調查物品後恢復原色
 * @author STILILA
 
 * @param Mode
 * @desc 0:自動設提示／1:有設定的才提示
 * @default 0
 
 * @param IgnoreText
 * @desc 註解欄寫入設定值的道具不會提示( ex：<新增時不提示> )
 * @default 新增時不提示
 
 * @param HighLightText
 * @desc 註解欄寫入設定值的道具必定會提示( ex：<新增時提示> )
 * @default 新增時提示
 
@help
//--------------------------------------------------------------------------
// ● 使用法(上插件指令、下腳本指令)
//--------------------------------------------------------------------------
安裝插件即可生效，另可獨立設定該道具是否要提示。

 
*/


var STILILA = STILILA || {};
STILILA.NewItem = {};


(function() {
var parameters = PluginManager.parameters('STLLA_newItem');
STILILA.NewItem.Mode = Number(parameters['Mode'] || 0);
STILILA.NewItem.IgnoreText = parameters['IgnoreText'] || '新增時不提示';
STILILA.NewItem.HighLightText = parameters['HighLightText'] || '新增時提示';

let _Game_Party_prototype_initAllItems = Game_Party.prototype.initAllItems;
Game_Party.prototype.initAllItems = function() {
	_Game_Party_prototype_initAllItems.call(this);
    this._itemNew = {'item' : {}, 'weapon' : {}, 'armor' : {}};
};

Game_Party.prototype.itemNew = function(type) {
	if (!this._itemNew) {this._itemNew = {'item' : {}, 'weapon' : {}, 'armor' : {}};} // 防錯
	return this._itemNew[type];
}

let _Game_Party_prototype_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    if (this.itemContainer(item)) {
		// 新增的物品設置未檢查標記
		if (this.numItems(item) == 0 && amount > 0 && !item.meta[STILILA.NewItem.IgnoreText] && (STILILA.NewItem.Mode == 0 || item.meta[STILILA.NewItem.HighLightText])) { 
			if (DataManager.isItem(item)) {
				this.itemNew('item')[item.id] = true;
			} else if (DataManager.isWeapon(item)) {
				this.itemNew('weapon')[item.id] = true;
			} else if (DataManager.isArmor(item)) {
				this.itemNew('armor')[item.id] = true;
			}
		}
	}	
	_Game_Party_prototype_gainItem.call(this, item, amount, includeEquip);
};
	

// 按下確定時
Window_ItemList.prototype.processOk = function() {
	Window_Selectable.prototype.processOk.call(this);
	let item = this.item();
	if (DataManager.isItem(item)) {
		var type = 'item';
	} else if (DataManager.isWeapon(item)) {
		var type = 'weapon';
	} else if (DataManager.isArmor(item)) {
		var type = 'armor';
	}
	// 如果這個Item是新取得的道具，重新描繪
	if (item && $gameParty.itemNew(type)[item.id]) {
		delete $gameParty.itemNew(type)[item.id];
		this.redrawCurrentItem();
	}
};
	
Window_ItemList.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
		if (DataManager.isItem(item)) {
			var type = 'item';
		} else if (DataManager.isWeapon(item)) {
			var type = 'weapon';
		} else if (DataManager.isArmor(item)) {
			var type = 'armor';
		}
		if ($gameParty.itemNew(type)[item.id]) {
			this.changeTextColor(this.textColor(17));
		} else {
			this.changeTextColor(this.normalColor());
		}
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
		this.resetTextColor();
    }
};
	
}) ();

