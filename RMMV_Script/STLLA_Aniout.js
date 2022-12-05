//=============================================================================
// 動畫輸出
// 最後更新：2018/02/06
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================

/*:
 * @plugindesc 動畫輸出
 * @author STILILA
 *
 
 
 * @help 
 * 把資料庫動畫輸出成png的工具，不使用時須設為Off
 *
 *＜腳本指令＞
 * aniout(w, h, id, previewDelay, bright, sheetRow, numsize, path, filename)
 * 必要參數：
 *  w, h：寬、高
 *  id：動畫ID
 * 選擇參數：
 *  previewDelay：預覽的延遲(秒)，previewDelay > 0時，只會預覽不輸出動畫。(預設：null)
 *  bright：追加亮度，原色強度+bright。(預設：0 )(※預覽看不到)
 *  sheetRow：sheetRow > 0時，輸出成整張，sheetRow決定橫排數。(預設：null)
 *  numsize：編號長度，ex：numsize == 3 → 檔名_001、檔名_002...。(預設：1)
 *  path：輸出資料夾。(預設：'aniout')
 *  filename：輸出名稱。(預設：資料庫的動畫名)
 *
 * ※path 指定單一資料夾就好，複數會出錯 
 *   filename 請注意會不會造成誤判(ex：動畫名稱為「火/全體」＝＞判定成要「火」資料夾)
 
 */
 

//--------------------------------------------------------------------------
// ● 輸出動畫
//--------------------------------------------------------------------------
function aniout(w, h, id, previewDelay, bright, sheetRow, numsize, path, filename) {
  var anime = $dataAnimations[id];
  
  if (!anime) {
   console.log('ID：'+id+'動畫不存在')
   return;
  }
  
  // 取得動畫用的圖(Bitmap)
  var aniBitmap1 = ImageManager.loadAnimation(anime.animation1Name, anime.animation1Hue) 
  var aniBitmap2 = ImageManager.loadAnimation(anime.animation2Name, anime.animation2Hue) 
	// 沒載好循環到載好
	if (!aniBitmap1.isReady() || !aniBitmap2.isReady()) {
		setTimeout(function(){aniout(w, h, id, previewDelay, bright, sheetRow, numsize, path, filename)},50);
		return;
	}
  // 預設參數
  var sheetRow = sheetRow || null;
  var numsize = numsize || 1;
  var path = path || 'aniout';
  var scene = SceneManager._scene

  // 做成黑底去背用
  var botSprite = new Sprite();
  botSprite.bitmap = new Bitmap(Graphics.width,Graphics.height);
  botSprite.bitmap.fillAll('rgba(0,0,0,1)') 
  scene.addChild(botSprite);
  var saveSCR = [[],0];

  // 做成畫布
  var bitmap = new Bitmap(w, h)
  // 取得動畫資料
  var frameMax = anime.frames.length;
  var animePosition = anime.position;
  // 輸出名稱
  var filename = filename || anime.name;
  // 做成單張圖用的畫布
  if (sheetRow) {
    var bitmapSheet = new Bitmap(w * sheetRow, h * Math.ceil(frameMax/sheetRow))
  }  
    
  // 動畫用
  var aniSprites = [];
  for (var i=0; i<16; i++) {
    var sprite = new Sprite();
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.visible = true;
    aniSprites.push(sprite);
	scene.addChild(sprite);
  }

  var previewDelay = previewDelay || null;
  var bright = bright || 0;
  
  // 循環每個Frame
  for (var frame=0; frame<frameMax; frame++) {
    for (var i=0; i<aniSprites.length; i++) {
	  var sprite = aniSprites[i];
      if (!sprite) {continue;}
	  var cell = anime.frames[frame][i];
	  if (!cell) {
		  sprite.visible = false;
		  continue;
	  }
	  
      var pattern = cell[0];
	  
      if (pattern < 0) {
        sprite.visible = false;
        continue;
      }
      sprite.bitmap = (pattern < 100) ? aniBitmap1 : aniBitmap2
      sprite.visible = true;
      sprite.setFrame(pattern % 5 * 192, Math.floor(pattern % 100 / 5) * 192, 192, 192);
      sprite.x = (Graphics.width/2) + cell[1];
      sprite.y = (Graphics.height/2) + cell[2];
      switch (animePosition) {
      case 0: // 上
        sprite.y -= h/4;
		break;
      case 2: // 下
        sprite.y += h/4;
		break;
      //else   // 中或全畫面
        //break;
      }
      
      
      sprite.rotation = cell[4] * Math.PI / 180;
	  if (cell[5]) {sprite.scale.x *= -1;}
      sprite.scale.x = cell[3] / 100;
      sprite.scale.y = cell[3] / 100;
      sprite.opacity = cell[6];
      sprite.blendMode = cell[7];
	}
	
    // 截圖
    var screenshot = Bitmap.snap(scene)//SceneManager.snap();
    var x = (screenshot.width / 2) - (w / 2);
    var y = (screenshot.height / 2) - (h / 2);

	saveSCR[0].push(screenshot);

	// 非預覽模式時
	if (!previewDelay) {
		// blt到畫布
		bitmap.bltEX(screenshot, x, y, w, h, 0, 0);
		// 處理透明、輸出
		if (sheetRow) {
		  bitmap.processAlpha(bright);
		  bitmapSheet.bltEX(bitmap, 0, 0, bitmap.width, bitmap.height, w * (frame % sheetRow), h * Math.floor(frame / sheetRow))
		} else {
		  bitmap.processAlpha(bright);
		  toPNG(bitmap, path, filename + '_' + frame.padZero(numsize));
		}
		bitmap.clear();
	}
  }

  // 釋放
  scene.removeChild(botSprite);
  for (var i=0; i<aniSprites.length; i++) {
	  var sprite = aniSprites[i];
	  scene.removeChild(sprite)
  }
  if (sheetRow) {
    toPNG(bitmapSheet, path, filename);
  }
  
  // 預覽啟動時
  if (previewDelay) {
		// 播放動畫用
		var viewSprite = new Sprite();
		scene.addChild(viewSprite);
		// 檢測超出用
		var boxSprite = new Sprite();
		boxSprite.x = Graphics.width / 2;
		boxSprite.y = Graphics.height / 2;
		boxSprite.anchor.x = 0.5;
		boxSprite.anchor.y = 0.5;
		boxSprite.bitmap = new Bitmap(w,h);
		boxSprite.bitmap.fillAll('rgba(255,0,0,1)');
		boxSprite.bitmap.clearRect(1, 1, w-2, h-2);
		scene.addChild(boxSprite);
		anioutPreview(saveSCR, w, h, previewDelay, viewSprite, boxSprite)
  }
};

//--------------------------------------------------------------------------
// ● 把blt的限制拔掉
//--------------------------------------------------------------------------
Bitmap.prototype.bltEX = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;

    this._context.globalCompositeOperation = 'source-over';
    this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
    this._setDirty();
};

//--------------------------------------------------------------------------
// ● 預覽
//--------------------------------------------------------------------------
function anioutPreview(saveSCR, w, h, delay, viewSprite, boxSprite) {
	var scene = SceneManager._scene
	
	if (saveSCR[1] < saveSCR[0].length) {
		viewSprite.bitmap = saveSCR[0][saveSCR[1]];
		Graphics.render(scene);
		saveSCR[1]++;
		// 設置下次要放的截圖
		setTimeout(function(){anioutPreview(saveSCR, w, h, delay, viewSprite, boxSprite)}, 1000/60*delay);
	// 播完釋放	
	} else {
		scene.removeChild(boxSprite);
		boxSprite.bitmap = null;
		boxSprite = null;
		scene.removeChild(viewSprite);
		viewSprite.bitmap = null;
		viewSprite = null;
		saveSCR = null;
	}
};

//--------------------------------------------------------------------------
// ● 處理圖片透明
//    bright：追加亮度
//    keyColor：作為透明色的顏色
//    mainColor：需要不透明漸變時，將以主色系的強度作為透明度
//--------------------------------------------------------------------------
Bitmap.prototype.processAlpha = function(bright, mainColor, keyColor) {
    var bright = bright || 0;
	var mainColor = mainColor || 'n'
    var keyColor = keyColor || [0,0,0];
    
	var bitmapData = this._context.getImageData(0, 0, this.width, this.height);
	var alphaFlag = false;
	
    // 慢慢處理整張圖
	for (var i=0; i < bitmapData.data.length; i+=4) {
		
        var red = bitmapData.data[i] 
        var green = bitmapData.data[i+1] 
        var blue = bitmapData.data[i+2] 
		var newAlpha = bitmapData.data[i+3] = Math.max(Math.max(red, green), blue)
		// 把指定色設為透明 (因為src_color.data不是單純的Array，辣雞js只能這樣比較，fuuuuuuuuuu)
        for (var v=0; v<3; v++) {
			if (bitmapData.data[i+v] != keyColor[v]) { 
				alphaFlag = false;
				break; 
			}
			alphaFlag = true;
		};
		if (alphaFlag) {bitmapData.data[i+3] = 0;}
		// 還原原色
		bitmapData.data[i] = newAlpha > 0 ? (red * 255 / newAlpha) + bright : 0
        bitmapData.data[i+1] = newAlpha > 0 ? (green * 255 / newAlpha) + bright : 0
        bitmapData.data[i+2] = newAlpha > 0 ? (blue * 255 / newAlpha) + bright : 0
	}

	this._context.putImageData(bitmapData,0,0);  // 重處理，要先讓_context.imageData處理好再一次畫
	this._setDirty(); // 不這樣好像不會改變
}


//--------------------------------------------------------------------------
// ● 輸出png
//--------------------------------------------------------------------------
function toPNG(bitmap, path, name) { 
	var fs = require('fs')
    var dirPath = require('path').dirname(process.mainModule.filename) + '/' + path;
	// 補建資料夾
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
	}

	var data = bitmap.canvas.toDataURL();
	var matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
	if (matches.length !== 3) { return new Error('無效的圖片格式'); }
	var imageBuffer = {};
	imageBuffer.type = matches[1];
	imageBuffer.data = new Buffer(matches[2], 'base64');
	var filename = dirPath + '/' + name + '.png';
	
	fs.writeFile(filename, imageBuffer.data, function(err) {
		if(err){
			console.error(err);
		}
		console.log(filename+' 檔案已輸出.')
	});
	
	
}