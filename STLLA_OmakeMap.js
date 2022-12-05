//=============================================================================
// 特典地圖
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================

/*:
 * @plugindesc 特典地圖
 * @author STILILA
 *
 
 * @help 
 * 用於特定條件後可於標題畫面進入特殊地圖
 *
 *＜腳本指令(※注意不是插件指令)＞
	ConfigManager.openOmake()   // 使用後，標題畫面的"特典"文字變為可使用
*/ 



(function() {
// 標題追加特典地圖選項	
var _Window_TitleCommand_prototype_makeCommandList = Window_TitleCommand.prototype.makeCommandList
Window_TitleCommand.prototype.makeCommandList = function() {
	_Window_TitleCommand_prototype_makeCommandList.call(this)
	this.addCommand('特典', 'omake', !!ConfigManager.omake);    // 可以把'特典'改成想要的文字
};
var _Scene_Title_prototype_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
	_Scene_Title_prototype_createCommandWindow.call(this)
	this._commandWindow.setHandler('omake',  this.commandOmake.bind(this));
}
Scene_Title.prototype.commandOmake = function() {
    DataManager.createGameObjects();
    DataManager.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer(2, 8, 8);  // 移到特典地圖(地圖id, x, y)
    Graphics.frameCount = 0;
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};
	
// 共用存檔追加omake變數	
ConfigManager.omake = false;
var _ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
	var config = _ConfigManager_makeData.call(this);
	config.omake = this.omake;
    return config;
};
var _ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
	_ConfigManager_applyData.call(this, config)
	this.omake = this.readFlag(config, 'omake');
};



// 允許進入特典地圖
ConfigManager.openOmake = function() {
	this.omake = true;
    this.save();
};


})();


