//=============================================================================
// MV全按鍵
//=============================================================================
/*:
 * @plugindesc 全按鍵，解決您按鍵不夠的煩惱
 * @author STILILA
 *
 *
 * @help 說明
 * ＜使用方法＞在事件腳本或條件分歧的腳本欄使用以下語句：
 *  判斷按著(Press)：Input.isPressedEX(鍵碼)
 *  判斷按下(Trigger)：Input.isTriggeredEX(鍵碼)
 *  判斷長按(Repeat)：Input.isRepeatedEX(鍵碼)
 *  判斷長按2(LongPress)：Input.isLongPressedEX(鍵碼) 
 *
 * ＜使用例＞
 *  Input.isPressedEX(13)   // 按著Enter
 *  Input.isTriggeredEX(71)   // 按下G鍵
 *
 * ＜其他＞
 *  1.長按2在預設用來做快轉事件用
 *  2.腳本中附的鍵碼表供對照用
 *  3.JS中ctrl、alt、shift沒分左右
 *  4.判斷數字以外的字會改用預設方法
 *  5.print screen(截圖鍵)無效，所以別用
 *  6.Num Lock會重置按鍵判定，最好也別用
 *  7.整合進Input中
 */



(function() {
	

// 對照表
Input.keyMapperEX = {
	8: 'backspace',      // 倒回
    9: 'tab',        
    12: 'clear',         // 關Num Lock + 數字鍵5    
    13: 'enter',         
    16: 'shift',         
    17: 'control',       
    18: 'alt',           
	19: 'pause',
	20: 'caps lock', 
    27: 'esc',           
    32: 'space',         
    33: 'pageup',        
    34: 'pagedown',      
	35: 'end',
	36: 'home',
    37: 'left',           
    38: 'up',             
    39: 'right',          
    40: 'down',           
	44: 'print screen',   // 截圖，這個鍵無效
    45: 'insert',         
	46: 'del',
	48: 'num 0',
	49: 'num 1',
	50: 'num 2',
	51: 'num 3',
	52: 'num 4',
	53: 'num 5',
	54: 'num 6',
	55: 'num 7',
	56: 'num 8',
	57: 'num 9',
	65: 'A',
	66: 'B',
	67: 'C',
	68: 'D',
	69: 'E',
	70: 'F',
	71: 'G',
	72: 'H',
	73: 'I',
	74: 'J',
	75: 'K',
	76: 'L',
	77: 'M',
	78: 'N',
	79: 'O',
	80: 'P',
    81: 'Q',       
	82: 'R',
	83: 'S',
	84: 'T',
	85: 'U',
	86: 'V',
    87: 'W',       
    88: 'X',       
	89: 'Y',
    90: 'Z',       
	91: 'L Win',         // 左Win(會叫出開始選單，慎用)
	92: 'R Win',         // 右Win(會叫出開始選單，慎用)
	93: 'select',       // 選單
    96: 'numpad 0',     
	97: 'numpad 1',     
    98: 'numpad 2',     
	99: 'numpad 3',     
    100: 'numpad 4',    
	101: 'numpad 5',     
    102: 'numpad 6',     
	103: 'numpad 7',     
    104: 'numpad 8',      
	105: 'numpad 9',     
	106: 'numpad *',
	107: 'numpad +',
	109: 'numpad -',
	110: 'numpad .',
	111: 'numpad /',
	112: 'F1',
	113: 'F2',           // 被拿去呼叫FPS視窗，慎用
	114: 'F3',           // 被拿去切換平鋪模式，慎用
	115: 'F4',           // 被拿去視窗縮放，慎用
	116: 'F5',           // 被拿去重新啟動，慎用
	117: 'F6',
	118: 'F7',
	119: 'F8',          // F8
    120: 'F9',          // F9
	121: 'F10',
	122: 'F11',
	123: 'F12',
	144: 'num lock',    // 會重置判定，慎用
	145: 'scroll lock',
	186: ';',
	187: '=',
	188: ',',
    189: '-',
	190: '.',
	191: '/',
	192: '`',
	219: '[',
    220: '\\',        // \鍵，寫兩個是因為會被解讀成正則
	221: ']',
	222: "'",        //  三個'會被誤判，改用""來包 
};


//==========================
// (核心) 按下按鍵事件
//==========================
var _Input_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function(event) {
	// 直接判定鍵碼 (
	if (event.keyCode && event.keyCode !== 0){
		this._currentState[event.keyCode] = true
	}
	// 呼叫原方法
	_Input_onKeyDown.call(this, event);
	
};
//==========================
// (核心) 放開按鍵事件
//==========================
var _Input_onKeyUp = Input._onKeyUp;
Input._onKeyUp = function(event) {
	// 直接判定鍵碼
	if (event.keyCode && event.keyCode !== 0){
		this._currentState[event.keyCode] = false
	}
	// 呼叫原方法
	_Input_onKeyUp.call(this, event);
};
 
//==========================
// (核心) 清除判定
//==========================
var _Input_clear = Input.clear;
Input.clear = function() {
	// 呼叫原方法
	_Input_clear.call(this);
	// 紀錄全按鍵最後按的鍵 (特別多設是因為會和已有的打架)
	this._latestButtonEX = null;
};
//==========================
// (核心) 定期更新
//==========================
Input.update = function() {
    this._pollGamepads();
    if (this._currentState[this._latestButton]) {
        this._pressedTime++;
    } else {
        this._latestButton = null;
    }
	// 判斷全按鍵系
    if (this._currentState[this._latestButtonEX]) {
		// 此鍵沒被預設腳本使用時累計時間
		if (!this._currentState[Input.keyMapper[this._latestButtonEX]]) {this._pressedTime++;}
    } else {
		this._latestButtonEX = null;
    } 
    for (var name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
			// 非數字的情況
			if (isNaN(name)) {
				this._latestButton = name;
			// 數字的情況(因為屬性名絕對是字串，要再轉成數字)
			} else {
				this._latestButtonEX = parseInt(name);
			}
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
    }
    this._updateDirection();
};
 
 
//==========================
// 按著
//==========================
Input.isPressedEX = function(keyCode) {
	// 如果不是數字就用預設方法
	if (isNaN(keyCode)) {return Input.isPressed(keyCode);}
    return !!this._currentState[keyCode];
};
//==========================
// 按一下
//==========================
Input.isTriggeredEX = function(keyCode) {
    // 如果不是數字就用預設方法
	if (isNaN(keyCode)) {return Input.isTriggered(keyCode);}
	//
    return this._latestButtonEX === keyCode && this._pressedTime === 0;
};

//==========================
// 長按(連跳會頓)
//==========================
Input.isRepeatedEX = function(keyCode) {
    // 如果不是數字就用預設方法
	if (isNaN(keyCode)) {return Input.isRepeated(keyCode);}
	//
    return (this._latestButtonEX === keyCode &&
            (this._pressedTime === 0 ||
              (this._pressedTime >= this.keyRepeatWait &&
                 this._pressedTime % this.keyRepeatInterval === 0)));
    
};
//==========================
// 長按2(連跳不會頓)
//==========================
Input.isLongPressedEX = function(keyCode) {
    // 如果不是數字就用預設方法
	if (isNaN(keyCode)) {return Input.isLongPressed(keyCode);}
	//
    return (this._latestButtonEX === keyCode &&
            this._pressedTime >= this.keyRepeatWait);
};

})();