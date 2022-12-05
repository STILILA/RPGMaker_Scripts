//=============================================================================
// Bitmap_Bold.js
//=============================================================================

/*:
 * @plugindesc Can use bold in Bitmap.
 * @author STILILA
 *
 * @help
 *
 * (Bitmap Object).fontBold = true;   //the font is bold.
 */


(function() { 
var _Bitmap_initialize = Bitmap.prototype.initialize;
Bitmap.prototype.initialize = function(width, height) {
	_Bitmap_initialize.call(this, width, height);
    this.fontBold = false;
};
})();


Bitmap.prototype._makeFontNameText = function() {
    return (this.fontItalic ? 'Italic ' : '') +
            (this.fontBold ? 'Bold ' : '') +
            this.fontSize + 'px ' + this.fontFace;
};

