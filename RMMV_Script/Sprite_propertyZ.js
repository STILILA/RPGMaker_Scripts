//=============================================================================
// 調整Sprite優先度 v1.4
// 最後更新：2018/06/10
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================

/*:
 * @plugindesc (v1.3)讓Sprite有z屬性、使其可調整Sprite優先度
 * @author STILILA
 
 * @help 
 * ＜使用法＞
 * Sprite對象.z = n 
 * ScreenSprite對象.z = n
 * TilingSprite對象.z = n
 *
 * ＜更新履歷＞
 * v1.4
 * 結構調整

 * v1.3
 * 因為問題一大堆，addChild()不再自動排序
 
 * v1.2
 * 修正進戰鬥畫面的問題，同時讓ScreenSprite和TilingSprite也有z屬性
 *
 * v1.1
 * addChild()時能馬上反映優先度，並修正和非Sprite對象比較無法正確排序的問題
 
 
*/

(function() {
// Sprite
var _Sprite_initialize = Sprite.prototype.initialize;
Sprite.prototype.initialize = function(bitmap) {
    _Sprite_initialize.call(this, bitmap);
	this._z = 0;
	this.haveZ = true;
	this.needRefreshZ = false;
}
var _Sprite_update = Sprite.prototype.update;
Sprite.prototype.update = function() {
	if (this.needRefreshZ) {
		this.children.sort(this._compareChildOrder.bind(this));
		this.needRefreshZ = false;
	}
    _Sprite_update.call(this);
};
// ScreenSprite
var _ScreenSprite_initialize = ScreenSprite.prototype.initialize;
ScreenSprite.prototype.initialize = function () {
    _ScreenSprite_initialize.call(this);
	this._z = 0;
	this.haveZ = true;
	this.spriteId = Sprite._counter++;
	this.needRefreshZ = false;
}

// TilingSprite
var _TilingSprite_initialize = TilingSprite.prototype.initialize;
TilingSprite.prototype.initialize = function(bitmap) {
	_TilingSprite_initialize.call(this, bitmap)
    this._z = 0
	this.haveZ = true;
	this.needRefreshZ = false;
}
var _TilingSprite_update = TilingSprite.prototype.update;
TilingSprite.prototype.update = function() {
	if (this.needRefreshZ) {
		this.children.sort(this._compareChildOrder.bind(this));
		this.needRefreshZ = false;
	}
    _TilingSprite_update.call(this);
};


// Scene_Base
var _Scene_Base_initialize = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
    _Scene_Base_initialize.call(this);
    this.needRefreshZ = false;
};

var _Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
	if (this.needRefreshZ) {
		this.children.sort(this._compareChildOrder.bind(this));
		this.needRefreshZ = false;
	}
    _Scene_Base_update.call(this);
};

Scene_Base.prototype._compareChildOrder = function(a, b) {
	var a_isSprite = a.haveZ
	var b_isSprite = b.haveZ
	if (a_isSprite && b_isSprite) {
		if (a.z != b.z) {
			return a.z - b.z;
		} else {
			return a.spriteId - b.spriteId;
		}
	} else if (a_isSprite) {
		return -1 // a < b
	} else if (b_isSprite) {
		return 1 // a > b
	} else {
		return 0	
	}
};

})();


// TilingSprite
Object.defineProperty(TilingSprite.prototype, 'z', {
    get: function() {
        return this._z;
    },
    set: function(value) {
		if (this._z != value) {
			this._z = value;
			if (this.parent) {
				this.parent.needRefreshZ = true;
			}
			//this._refresh();
		}
    },
    configurable: true
});

TilingSprite.prototype._compareChildOrder = function(a, b) {
	var a_isSprite = a.haveZ
	var b_isSprite = b.haveZ
	if (a_isSprite && b_isSprite) {
		if (a.z != b.z) {
			return a.z - b.z;
		} else {
			return a.spriteId - b.spriteId;
		}
	} else if (a_isSprite) {
		return -1 // a < b
	} else if (b_isSprite) {
		return 1 // a > b
	} else {
		return 0	
	}
};



// ScreenSprite
Object.defineProperty(ScreenSprite.prototype, 'z', {
    get: function() {
        return this._z;
    },
    set: function(value) {
		if (this._z != value) {
			this._z = value;
			if (this.parent) {
				this.parent.needRefreshZ = true;
			}
			//this._refresh();
		}
    },
    configurable: true
});





// Sprite
Object.defineProperty(Sprite.prototype, 'z', {
    get: function() {
        return this._z;
    },
    set: function(value) {
		if (this._z != value) {
			this._z = value;
			if (this.parent) {
				this.parent.needRefreshZ = true;
			}
			//this._refresh();
		}
    },
    configurable: true
});


Sprite.prototype._compareChildOrder = function(a, b) {
	var a_isSprite = a.haveZ
	var b_isSprite = b.haveZ
	if (a_isSprite && b_isSprite) {
		if (a.z != b.z) {
			return a.z - b.z;
		} else {
			return a.spriteId - b.spriteId;
		}
	} else if (a_isSprite) {
		return -1 // a < b
	} else if (b_isSprite) {
		return 1 // a > b
	} else {
		return 0	
	}
};




// Stage
// Stage.prototype._sortChildren = function() {
	// this.children.sort(this._compareChildOrder.bind(this));
// }
// Stage.prototype._compareChildOrder = function(a, b) {
	// var a_isSprite = a.haveZ
	// var b_isSprite = b.haveZ
	// if (a_isSprite && b_isSprite) {
		// if (a.z != b.z) {
			// return a.z - b.z;
		// } else {
			// return a.spriteId - b.spriteId;
		// }
	// } else if (a_isSprite) {
		// return -1 // a < b
	// } else if (b_isSprite) {
		// return 1 // a > b
	// } else {
		// return 0	
	// }
// };

// Stage.prototype.addChild = function(child) {
	// PIXI.Container.prototype.addChild.call(this, child); //super
	// this._sortChildren();
	// return child;
// }


