//=============================================================================
// MV全按鍵  版本2
// 最終更新：2016/4/15
//=============================================================================
/*:
 * @plugindesc 全按鍵，解決您按鍵不夠的煩惱
 * @author STILILA
 *
 *
 * @help 說明
 * ＜使用方法＞在事件腳本或條件分歧的腳本欄使用以下語句：
 *  判斷按著(Press)：InputEX.isPressed(鍵碼)
 *  判斷按下(Trigger)：InputEX.isTriggered(鍵碼)
 *  判斷長按(Repeat)：InputEX.isRepeated(鍵碼)
 *  判斷長按2(LongPress)：InputEX.isLongPressed(鍵碼) 
 *
 * ＜使用例＞
 *  InputEX.isPressed(13)   // 按著Enter
 *  InputEX.isTriggered(71)   // 按下G鍵
 *
 * ＜其他＞
 *  1.長按2在預設用來做快轉事件用
 *  2.腳本中附的鍵碼表供對照用
 *  3.JS中ctrl、alt、shift沒分左右
 *  4.判斷數字以外的字會改用預設方法
 *  5.print screen(截圖鍵)無效，所以別用
 *  6.Num Lock會重置按鍵判定，最好也別用
 *  7.MV版本1.1.0後改成和Input關連
 
 */
 
 
 
// 舊方法擴充
(function() {   
//
var _Input_initialize = Input.initialize;
Input.initialize = function() {
    _Input_initialize.call(this);
    InputEX.initialize();
};	 
//
var _Input_update = Input.update;
Input.update = function() {
	_Input_update.call(this);
	InputEX.update();
};
//



})();
 
 
 
 
 
 
 
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @class Input
 */
function InputEX() {
    throw new Error('This is a static class');
}

/**
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */
InputEX.initialize = function() {
    this.clear();
    this._wrapNwjsAlert();
    this._setupEventHandlers();
};


// 對照表
InputEX.keyMapper = {
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


/**
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
InputEX.keyRepeatWait = 24;

/**
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
InputEX.keyRepeatInterval = 6;


/**
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
InputEX.clear = function() {
    this._currentState = {};
    this._previousState = {};
    this._latestButton = null;
    this._pressedTime = 0;
    this._dir4 = 0;
    this._dir8 = 0;
    this._preferredAxis = '';
    this._date = 0;
};

/**
 * Updates the input data.
 *
 * @static
 * @method update
 */
InputEX.update = function() {
    if (this._currentState[this._latestButton]) {
        this._pressedTime++;
    } else {
        this._latestButton = null;
    }
    for (var name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
			// 轉成數字記錄
            this._latestButton = parseInt(name);
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
		
    }
    this._updateDirection();
};

/**
 * Checks whether a key is currently pressed down.
 *
 * @static
 * @method isPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is pressed
 */
InputEX.isPressed = function(keyName) {
    return !!this._currentState[keyName];
};

/**
 * Checks whether a key is just pressed.
 *
 * @static
 * @method isTriggered
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is triggered
 */
InputEX.isTriggered = function(keyName) {
    return this._latestButton === keyName && this._pressedTime === 0;
};

/**
 * Checks whether a key is just pressed or a key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is repeated
 */
InputEX.isRepeated = function(keyName) {
    return (this._latestButton === keyName &&
        (this._pressedTime === 0 ||
            (this._pressedTime >= this.keyRepeatWait &&
                this._pressedTime % this.keyRepeatInterval === 0)));
};

/**
 * Checks whether a key is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is long-pressed
 */
InputEX.isLongPressed = function(keyName) {
    return (this._latestButton === keyName &&
         this._pressedTime >= this.keyRepeatWait);
};

/**
 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir4
 * @type Number
 */
Object.defineProperty(InputEX, 'dir4', {
    get: function() {
        return this._dir4;
    },
    configurable: true
});

/**
 * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir8
 * @type Number
 */
Object.defineProperty(InputEX, 'dir8', {
    get: function() {
        return this._dir8;
    },
    configurable: true
});

/**
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */
Object.defineProperty(InputEX, 'date', {
    get: function() {
        return this._date;
    },
    configurable: true
});

/**
 * @static
 * @method _wrapNwjsAlert
 * @private
 */
InputEX._wrapNwjsAlert = function() {
    if (Utils.isNwjs()) {
        var _alert = window.alert;
        window.alert = function() {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            _alert.apply(this, arguments);
            win.focus();
            InputEX.clear();
        };
    }
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
InputEX._setupEventHandlers = function() {
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('keyup', this._onKeyUp.bind(this));
    window.addEventListener('blur', this._onLostFocus.bind(this));
};

/**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
InputEX._onKeyDown = function(event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        event.preventDefault();
    }
    if (event.keyCode === 144) {    // Numlock
        this.clear();
    }
    this._currentState[event.keyCode] = true;
	
};

/**
 * @static
 * @method _shouldPreventDefault
 * @param {Number} keyCode
 * @private
 */
InputEX._shouldPreventDefault = function(keyCode) {
    switch (keyCode) {
    case 8:     // backspace
    case 33:    // pageup
    case 34:    // pagedown
    case 37:    // left arrow
    case 38:    // up arrow
    case 39:    // right arrow
    case 40:    // down arrow
        return true;
    }
    return false;
};

/**
 * @static
 * @method _onKeyUp
 * @param {KeyboardEvent} event
 * @private
 */
InputEX._onKeyUp = function(event) {
    this._currentState[event.keyCode] = false;
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
        this.clear();
    }
};

/**
 * @static
 * @method _onLostFocus
 * @private
 */
InputEX._onLostFocus = function() {
    this.clear();
};



/**
 * @static
 * @method _updateDirection
 * @private
 */
InputEX._updateDirection = function() {
    var x = this._signX();
    var y = this._signY();

    this._dir8 = this._makeNumpadDirection(x, y);

    if (x !== 0 && y !== 0) {
        if (this._preferredAxis === 'x') {
            y = 0;
        } else {
            x = 0;
        }
    } else if (x !== 0) {
        this._preferredAxis = 'y';
    } else if (y !== 0) {
        this._preferredAxis = 'x';
    }

    this._dir4 = this._makeNumpadDirection(x, y);
};

/**
 * @static
 * @method _signX
 * @private
 */
InputEX._signX = function() {
    var x = 0;

    if (this.isPressed('left')) {
        x--;
    }
    if (this.isPressed('right')) {
        x++;
    }
    return x;
};

/**
 * @static
 * @method _signY
 * @private
 */
InputEX._signY = function() {
    var y = 0;

    if (this.isPressed('up')) {
        y--;
    }
    if (this.isPressed('down')) {
        y++;
    }
    return y;
};

/**
 * @static
 * @method _makeNumpadDirection
 * @param {Number} x
 * @param {Number} y
 * @return {Number}
 * @private
 */
InputEX._makeNumpadDirection = function(x, y) {
    if (x !== 0 || y !== 0) {
        return  5 - y * 3 + x;
    }
    return 0;
};



