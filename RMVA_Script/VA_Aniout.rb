#encoding:utf-8
=begin
#==============================================================================
# ■ 動畫輸出 v1.0
#    最後更新：2018/2/6
#--------------------------------------------------------------------------  
#    把動畫輸出成PNG(為了輸出PNG使用到別人的腳本，197行開始)
#==============================================================================
#--------------------------------------------------------------------------
# ● 聯絡方式
#--------------------------------------------------------------------------
  http://home.gamer.com.tw/homeindex.php?owner=qootm2
  https://twitter.com/STILILA
#--------------------------------------------------------------------------
# ● 使用法
#--------------------------------------------------------------------------
  動畫輸出(在定義後任何一處都能用，參數內容見下)
    aniout(w, h, id, bright, sheet_row, numsize, path, filename)
    
    
=end
#--------------------------------------------------------------------------
# ● 處理圖片透明
#   w,h          輸出圖的寬和高
#   id           動畫ID
#   bright       追加亮度(預設：0)(※預覽看不到)
#   sheet_row    輸出成單張圖，sheet_row決定橫排數(預設：nil)
#   numsize      輸出時編號長度(預設：1)
#   path         輸出資料夾(預設："aniout")
#   filename     輸出時的名稱(預設：資料庫的動畫名)

#  ※path 指定單一資料夾就好，複數會出錯
#    filename 請注意會不會造成誤判(ex：動畫名稱為「火/全體」＝＞判定成要「火」資料夾)

#--------------------------------------------------------------------------
def aniout(w, h, id, bright = 0, sheet_row = nil, numsize = 1, path = "aniout", filename = nil)
  # 檢測框(需要時取消註解)
#~   @box_sprite = Sprite.new
#~   @box_sprite.z = 9999
#~   @box_sprite.x = Graphics.width / 2
#~   @box_sprite.y = Graphics.height / 2
#~   @box_sprite.ox = w / 2
#~   @box_sprite.oy = h / 2
#~   @box_sprite.bitmap = Bitmap.new(w,h)
#~   @box_sprite.bitmap.fill_rect(@box_sprite.bitmap.rect, Color.new(255,0,0)) 
#~   @box_sprite.bitmap.clear_rect(1, 1, w-2, h-2)

  # 補建資料夾
  Dir::mkdir(path) unless Dir.exist?(path)
  # 做成黑底去背用
  @bot_sprite = Sprite.new
  @bot_sprite.bitmap = Bitmap.new(640,480)
  @bot_sprite.bitmap.fill_rect(@bot_sprite.bitmap.rect, Color.new(0,0,0)) 

  # 做成畫布
  bitmap = Bitmap.new(w, h)
  # 取得動畫資料
  $data_animations = load_data("Data/Animations.rvdata2")
  anime = $data_animations[id]
  if !anime
   p "ID：#{id} 動畫不存在"
   return
  end
  # 取得動畫用的圖(Bitmap)
  ani_bitmap1 = Cache.animation(anime.animation1_name, anime.animation1_hue) 
  ani_bitmap2 = Cache.animation(anime.animation2_name, anime.animation2_hue) 
  frame_max = anime.frame_max
  anime_position = anime.position
  # 輸出名稱
  filename = filename || anime.name
  # 做成單張圖用的畫布
  if sheet_row
    bitmap_sheet = Bitmap.new(w * sheet_row, h * (frame_max.to_f/sheet_row).ceil)
  end  
    
  
  @ani_sprites = []
  16.times do
    sprite = Sprite.new
    sprite.visible = false
    @ani_sprites.push(sprite)
  end

  
  # 循環每個Frame
  anime.frame_max.times {|frame|
    cell_data = anime.frames[frame].cell_data
    @ani_sprites.each_with_index do |sprite, i|
      next unless sprite
      pattern = cell_data[i, 0]
      if !pattern || pattern < 0
        sprite.visible = false
        next
      end
      sprite.bitmap = pattern < 100 ? ani_bitmap1 : ani_bitmap2
      sprite.visible = true
      sprite.src_rect.set(pattern % 5 * 192, pattern % 100 / 5 * 192, 192, 192)
      sprite.x = Graphics.width/2 + cell_data[i, 1]
      sprite.y = Graphics.height/2 + cell_data[i, 2]
      case anime_position
      when 0 # 上
        sprite.y -= h/4
      when 2 # 下
        sprite.y += h/4
      else   # 中或全畫面
        
      end
      sprite.angle = cell_data[i, 4]
      sprite.mirror = (cell_data[i, 5] == 1)
      sprite.z = 50+i
      sprite.ox = 96
      sprite.oy = 96
      sprite.zoom_x = cell_data[i, 3] / 100.0
      sprite.zoom_y = cell_data[i, 3] / 100.0
      sprite.opacity = cell_data[i, 6]
      sprite.blend_type = cell_data[i, 7]
    end
    # 截圖
    screenshot = Graphics.snap_to_bitmap
    x = screenshot.width / 2 - w / 2
    y = screenshot.height / 2 - h / 2


    # blt到畫布，輸出
    rct = Rect.new(x,y,w,h)
    bitmap.blt(0,0,screenshot,rct)
    if sheet_row
      bitmap.process_alpha(bright)
      bitmap_sheet.blt(w * (frame % sheet_row), h * (frame / sheet_row), bitmap, bitmap.rect)
    else
      bitmap.process_alpha(bright)
      outname = path+"/#{filename}_" + frame.to_s.rjust(numsize,"0")
      bitmap.make_png(outname)
      p "#{outname} 檔案已輸出"
    end
    bitmap.clear
    screenshot.dispose
  }

  # 釋放
  @ani_sprites.each{ |sprite| sprite.dispose}
  @ani_sprites.clear
  if @box_sprite
    @box_sprite.bitmap.dispose
    @box_sprite.dispose 
  end
  @bot_sprite.bitmap.dispose
  @bot_sprite.dispose
  
  if sheet_row
    outname = path+"/#{filename}"
    bitmap_sheet.make_png(outname)
    p "#{outname} 檔案已輸出"
    bitmap_sheet.dispose
  end
end

#==============================================================================
# ■ Bitmap
#==============================================================================
class Bitmap
  #--------------------------------------------------------------------------
  # ● 處理圖片透明
  #    bright：追加亮度
  #    key_color：作為透明色的顏色
  #    main_color：需要不透明漸變時，將以主色系的強度作為透明度
  #--------------------------------------------------------------------------
  def process_alpha(bright = 0, main_color = :n, key_color = nil)
    key_color = key_color || Color.new(0,0,0)
    # 慢慢處理整張圖
    for y in 0..self.height
      for x in 0..self.width
        # 取得該像素顏色
        src_color = get_pixel(x, y)
        # 參照主色系設置不透明度(只有RGB，越接近該色越透明)
        red = src_color.red
        green = src_color.green
        blue = src_color.blue 
        new_alpha = [red, green, blue].max
        new_red = new_alpha > 0 ? [(red * 255 / new_alpha) + bright, 0].max : 0
        new_green = new_alpha > 0 ? [(green * 255 / new_alpha) + bright, 0].max : 0
        new_blue = new_alpha > 0 ? [(blue * 255 / new_alpha) + bright, 0].max : 0
        # 把指定色設為透明
        new_alpha = 0 if src_color == key_color
        # 重設像素顏色
        new_color = Color.new(new_red, new_green, new_blue, new_alpha)
        set_pixel(x, y, new_color) 
      end
    end
  end  # def end
end # class end





#==============================================================================
#              ↓ 以下脚本出自www.66rpg.com，转载请注明。↓
#==============================================================================
=begin
==============================================================================
                        Bitmap to PNG By 轮回者
==============================================================================
 对Bitmap对象直接使用
 
 bitmap_obj.make_png(name[, path])
 
 name:保存文件名
 path:保存路径
 感谢66、夏娜、金圭子的提醒和帮助！
   
==============================================================================
=end
module Zlib
  class Png_File < GzipWriter
    #--------------------------------------------------------------------------
    # ● 主处理
    #-------------------------------------------------------------------------- 
    def make_png(bitmap_Fx,mode)
      @mode = mode
      @bitmap_Fx = bitmap_Fx
      self.write(make_header)
      self.write(make_ihdr)
      self.write(make_idat)
      self.write(make_iend)
    end
    #--------------------------------------------------------------------------
    # ● PNG文件头数据块
    #--------------------------------------------------------------------------
    def make_header
      return [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].pack("C*")
    end
    #--------------------------------------------------------------------------
    # ● PNG文件情报头数据块(IHDR)
    #-------------------------------------------------------------------------- 
    def make_ihdr
      ih_size = [13].pack("N")
      ih_sign = "IHDR"
      ih_width = [@bitmap_Fx.width].pack("N")
      ih_height = [@bitmap_Fx.height].pack("N")
      ih_bit_depth = [8].pack("C")
      ih_color_type = [6].pack("C")
      ih_compression_method = [0].pack("C")
      ih_filter_method = [0].pack("C")
      ih_interlace_method = [0].pack("C")
      string = ih_sign + ih_width + ih_height + ih_bit_depth + ih_color_type +
               ih_compression_method + ih_filter_method + ih_interlace_method
      ih_crc = [Zlib.crc32(string)].pack("N")
      return ih_size + string + ih_crc
    end
    #--------------------------------------------------------------------------
    # ● 生成图像数据(IDAT)
    #-------------------------------------------------------------------------- 
    def make_idat
      header = "\x49\x44\x41\x54"
      case @mode # 请54~
      when 1
        data = make_bitmap_data#1
      else
        data = make_bitmap_data
      end
      data = Zlib::Deflate.deflate(data, 8)
      crc = [Zlib.crc32(header + data)].pack("N")
      size = [data.length].pack("N")
      return size + header + data + crc
    end
    #--------------------------------------------------------------------------
    # ● 从Bitmap对象中生成图像数据 mode 1(请54~)
    #-------------------------------------------------------------------------- 
    def make_bitmap_data1
      w = @bitmap_Fx.width
      h = @bitmap_Fx.height
      data = []
      for y in 0...h
        data.push(0)
        for x in 0...w
          color = @bitmap_Fx.get_pixel(x, y)
          red = color.red
          green = color.green
          blue = color.blue
          alpha = color.alpha
          data.push(red)
          data.push(green)
          data.push(blue)
          data.push(alpha)
        end
      end
      return data.pack("C*")
    end
    #--------------------------------------------------------------------------
    # ● 从Bitmap对象中生成图像数据 mode 0
    #-------------------------------------------------------------------------- 
    def make_bitmap_data
      gz = Zlib::GzipWriter.open('hoge.gz')
      t_Fx = 0
      w = @bitmap_Fx.width
      h = @bitmap_Fx.height
      data = []
      for y in 0...h
        data.push(0)
        for x in 0...w
          t_Fx += 1
          if t_Fx % 10000 == 0
            Graphics.update
          end
          if t_Fx % 100000 == 0
            s = data.pack("C*")
            gz.write(s)
            data.clear
            #GC.start
          end
          color = @bitmap_Fx.get_pixel(x, y)
          red = color.red
          green = color.green
          blue = color.blue
          alpha = color.alpha
          data.push(red)
          data.push(green)
          data.push(blue)
          data.push(alpha)
        end
      end
      s = data.pack("C*")
      gz.write(s)
      gz.close    
      data.clear
      gz = Zlib::GzipReader.open('hoge.gz')
      data = gz.read
      gz.close
      File.delete('hoge.gz') 
      return data
    end
    #--------------------------------------------------------------------------
    # ● PNG文件尾数据块(IEND)
    #-------------------------------------------------------------------------- 
    def make_iend
      ie_size = [0].pack("N")
      ie_sign = "IEND"
      ie_crc = [Zlib.crc32(ie_sign)].pack("N")
      return ie_size + ie_sign + ie_crc
    end
  end
end
#==============================================================================
# ■ Bitmap
#------------------------------------------------------------------------------
# 　关联到Bitmap。
#==============================================================================
class Bitmap
  #--------------------------------------------------------------------------
  # ● 关联
  #-------------------------------------------------------------------------- 
  def make_png(name="like", path="",mode=0)
    make_dir(path) if path != ""
    Zlib::Png_File.open("temp.gz") {|gz|
      gz.make_png(self,mode)
    }
    Zlib::GzipReader.open("temp.gz") {|gz|
      $read = gz.read
    }
    f = File.open(path + name + ".png","wb")
    f.write($read)
    f.close
    File.delete('temp.gz') 
    end
  #--------------------------------------------------------------------------
  # ● 生成保存路径
  #-------------------------------------------------------------------------- 
  def make_dir(path)
    dir = path.split("/")
    for i in 0...dir.size
      unless dir == "."
        add_dir = dir[0..i].join("/")
        begin
          Dir.mkdir(add_dir)
        rescue
        end
      end
    end
  end
end