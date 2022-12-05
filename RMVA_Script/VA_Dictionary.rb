#encoding:utf-8
=begin
#==============================================================================
# ■ 用語辭典 v1.2
#    最後更新：2021/10/2
#--------------------------------------------------------------------------  
#    用語字典，說明可階段開放，說明文支援對話控制符
#==============================================================================
#--------------------------------------------------------------------------
# ● 聯絡方式
#--------------------------------------------------------------------------
  http://home.gamer.com.tw/homeindex.php?owner=qootm2
  https://twitter.com/STILILA
--------------------------------------------------------------------------
 ● 更新履歷
--------------------------------------------------------------------------
 v1.2
  追加顯示圖片的功能，規格更新、無法與舊版兼容。具體請見設定檔的說明

 v1.1
   將自定義設置與本體分開
   修正左邊分頁捲動時游標會跑到最上面的問題
   變數存取方式調整，讓使用者遊戲公開後仍可自由地新增項目
#--------------------------------------------------------------------------
# ● 使用法
#--------------------------------------------------------------------------
※自定義設置部分請另開腳本欄貼上，以免到時更新腳本發生悲劇


  1.呼叫辭典畫面
    SceneManager.call(Scene_Dictionary)
    
  2.設置用語開放狀態 (step == 0 為未開放)
    $stilila_config.set_dict(tag, name, step)
    ex：
      # 全開放
      $stilila_config.set_dict
      #「世界觀」內的所有用語全開放
      $stilila_config.set_dict("世界觀")   
      #「人物」的「拉爾夫」用語說明開放到最後階段
      $stilila_config.set_dict("人物", "拉爾夫") 
      #「人物」的「拉爾夫」用語說明開放為階段1
      $stilila_config.set_dict("人物", "拉爾夫", 1) 
      # 全設為未開放
      $stilila_config.set_dict(nil, nil, 0) 
      $stilila_config.reset_dict
      
=end
#==============================================================================
# ■ Scene_Dictionary
#------------------------------------------------------------------------------
# 　用語介紹畫面。
#==============================================================================
class Scene_Dictionary < Scene_Base
  #--------------------------------------------------------------------------
  # ● 主處理
  #--------------------------------------------------------------------------
  def start
    super
    # 生成用語說明視窗
    @dictionary_window = Window_DictionaryHelp.new
    # 生成上方選項視窗
    @upCommand_window = Window_DictionaryUpCommand.new
    @upCommand_window.set_handler(:ok, method(:active_left_command))
    @upCommand_window.set_handler(:cancel,    method(:return_scene))
    
    # 生成左方選項視窗
    tag = @upCommand_window.now_command_name
    @command_window = Window_DictionaryLeftCommand.new(tag)
    @command_window.set_handler(:ok, method(:active_help))
    @command_window.set_handler(:cancel, method(:active_up_command))
    @command_window.deactivate
    @dictionary_window.refresh(tag, @command_window.now_command_name)
    
    
    # 紀錄目前的游標位置(刷新說明內容判斷)
    @now_index = 0
    @now_tag = tag
    @help_active = false
    
    
  end

  
  #--------------------------------------------------------------------------
  # ● 活化上面視窗
  #--------------------------------------------------------------------------
  def active_up_command
    @upCommand_window.activate
  end
  
  #--------------------------------------------------------------------------
  # ● 活化左邊視窗
  #--------------------------------------------------------------------------
  def active_left_command
    @command_window.activate
    @help_active = false
  end
  
  #--------------------------------------------------------------------------
  # ● 活化說明視窗
  #--------------------------------------------------------------------------
  def active_help
    # 說明未超出視窗
    if @dictionary_window.contents.height <= @dictionary_window.contents_height
      @command_window.activate
      @help_active = false
    else
      @help_active = true
    end
  end
  
  
  #--------------------------------------------------------------------------
  # ● 主處理
  #--------------------------------------------------------------------------
  def update
    
    # 說明視窗運作中
    if @help_active
      # 取消
      if Input.trigger?(:B)
        # 播放取消音效
        Sound.play_cancel
        # 活化左邊視窗
        active_left_command
      end
      # 上捲
      if Input.press?(:UP)
        @dictionary_window.scroll_up
      end
      # 下捲
      if Input.press?(:DOWN)
        @dictionary_window.scroll_down
      end
    end
    # tag不同時，刷新說明視窗
    if @now_tag != @upCommand_window.now_command_name
      @now_tag = @upCommand_window.now_command_name
      @now_index = 0
      @command_window.refresh(@now_tag)
      @dictionary_window.refresh(@now_tag, @command_window.now_command_name)
    end
    # 游標移動時，刷新說明視窗
    if @now_index != @command_window.index
      @now_index = @command_window.index
      @dictionary_window.refresh(@now_tag, @command_window.now_command_name)
    end
    # 原處理 (更新視窗等)
    super
  end
end



#==============================================================================
# ■ Window_DictionaryUpCommand
#------------------------------------------------------------------------------
# 　辭典上選擇窗
#==============================================================================

class Window_DictionaryUpCommand < Window_HorzCommand
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize
    super(0, 0)
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    Graphics.width
  end
  #--------------------------------------------------------------------------
  # ● 获取列数
  #--------------------------------------------------------------------------
  def col_max
    return STILILA::Dict_Help.size
  end
  #--------------------------------------------------------------------------
  # ● 生成指令列表
  #--------------------------------------------------------------------------
  def make_command_list
    STILILA::Dict_Help.each_key { |key|
      add_command(key, :ok)
    }
  end
  
  #--------------------------------------------------------------------------
  # ● 獲取目前指令
  #--------------------------------------------------------------------------
  def now_command_name
    @list[@index][:name]
  end
end

#==============================================================================
# ■ Window_DictionaryLeftCommand
#------------------------------------------------------------------------------
# 　辭典左選擇窗
#==============================================================================

class Window_DictionaryLeftCommand < Window_Command
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize(tag)
    @tag = tag
    super(0, 48)
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    160
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_height
    Graphics.height-48
  end
  #--------------------------------------------------------------------------
  # ● 生成指令列表
  #--------------------------------------------------------------------------
  def make_command_list
    # 添加該分頁選項
    STILILA::Dict_Help[@tag].each_key {|name|
      save_list = $stilila_config.dictionary_list
      # 如果該說明欄未初始化
      if (!save_list[@tag] || !save_list[@tag][name])
        add_command(STILILA::Dict_Unknown, :ok)
      # 已初始化   
      else
        step = save_list[@tag][name]
        if step > 0
          add_command(name, :ok)
        else
          add_command(STILILA::Dict_Unknown, :ok)
        end  
      end
    } 
  end
  #--------------------------------------------------------------------------
  # ● 刷新
  #--------------------------------------------------------------------------
  def refresh(tag = nil)
    @tag = tag || @tag
    @index = 0 if tag  # 切換tag才重設index
    update_cursor
    super()
  end
  
  #--------------------------------------------------------------------------
  # ● 獲取目前指令
  #--------------------------------------------------------------------------
  def now_command_name
    @list[@index][:name]
  end
end



#==============================================================================
# ■ Window_DictionaryHelp
#------------------------------------------------------------------------------
# 　用語畫面的說明視窗。
#==============================================================================

class Window_DictionaryHelp < Window_Base
  #--------------------------------------------------------------------------
  # ● 初始化物件
  #--------------------------------------------------------------------------
  def initialize
    super(160, 48, Graphics.width-160, Graphics.height-48)
  end  
  #--------------------------------------------------------------------------
  # ● 上捲
  #--------------------------------------------------------------------------
  def scroll_up
    self.oy = [self.oy - 4, 0].max
  end
  #--------------------------------------------------------------------------
  # ● 下捲
  #--------------------------------------------------------------------------
  def scroll_down
    self.oy = [self.oy + 4, [contents.height-height+32,0].max].min
  end
  #--------------------------------------------------------------------------
  # ● 刷新(tag名稱, 項目名稱)
  #--------------------------------------------------------------------------
  def refresh(tag, item_name)
    self.contents.clear
    self.oy = 0
    
    # 說明未初始化的時候
    if (!$stilila_config.dictionary_list[tag] || !$stilila_config.dictionary_list[tag][item_name])
      create_contents
      draw_text_ex(0,0,STILILA::Dict_Unknown)
	   	return
    end
    
    begin
      step = $stilila_config.dictionary_list[tag][item_name]
      if item_name != STILILA::Dict_Unknown && step > 0
        help = STILILA::Dict_Help[tag][item_name][step-1] 
        new_height = getNewHeight(help) #self.line_height + help.count("\n") * self.line_height
        self.contents.dispose
        self.contents = Bitmap.new(contents_width, new_height)
        drawHelpItem(help)
        #draw_text_ex(0,0,help)
      else
        create_contents
        draw_text_ex(0,0,STILILA::Dict_Unknown)
      end
    rescue
      create_contents
      draw_text_ex(0,0,"Parameter setting error!!")
    end
 
  end  
  
  #--------------------------------------------------------------------------
  # ● 計算說明總高
  #--------------------------------------------------------------------------
  def getNewHeight(helpItems)
    final_h = 0
    
    helpItems.each do |item|
      new_h = 0
      # 圖片物件
      if (item[:img]) 
        bitmap = Cache.picture(item[:img])
        new_h = (item[:y] ? item[:y] : 0) + (item[:h] ? item[:h] : bitmap.height)
      # 文字物件
      else 
        new_h = self.line_height + (item[:text].count("\n") * self.line_height) + (item[:y] ? item[:y] : 0)
      end
      # 更新最大高
      final_h = new_h if (new_h > final_h)
    end
    return final_h
  end
  
  #--------------------------------------------------------------------------
  # ● 描繪說明內容
  #--------------------------------------------------------------------------
  def drawHelpItem(helpItems)
    helpItems.each do |item|
      # 圖片物件
      if (item[:img]) 
        bitmap = Cache.picture(item[:img])
        dest_rect = Rect.new((item[:x] ? item[:x] : 0), (item[:y] ? item[:y] : 0), (item[:w] ? item[:w] : bitmap.width), (item[:h] ? item[:h] : bitmap.height))
        src_rect = Rect.new(0, 0, bitmap.width, bitmap.height)
        self.contents.stretch_blt(dest_rect, bitmap, src_rect) 
      # 文字物件
      else 
        draw_text_ex(0, (item[:y] ? item[:y] : 0), item[:text])
      end
    end
  end
  
  
end


#==============================================================================
# ■ Window_MenuCommand
#------------------------------------------------------------------------------
# 　菜单画面中显示指令的窗口
#==============================================================================
class Window_MenuCommand < Window_Command
  #--------------------------------------------------------------------------
  # ● 独自添加指令用
  #--------------------------------------------------------------------------
  alias :stdict_add_original_commands :add_original_commands
  def add_original_commands
    stdict_add_original_commands
    if $game_switches[STILILA::Dict_MenuSwitch]
      add_command(STILILA::Dict_MenuName, :dictionary)
    end
  end
end
#==============================================================================
# ■ Scene_Menu
#------------------------------------------------------------------------------
# 　選單畫面
#==============================================================================
class Scene_Menu < Scene_MenuBase
  #--------------------------------------------------------------------------
  # ● 开始处理
  #--------------------------------------------------------------------------
  alias :stdict_start :start
  def start
    stdict_start
    @command_window.set_handler(:dictionary,     method(:call_dictionary))
  end
  #--------------------------------------------------------------------------
  # ● 呼叫合成畫面
  #--------------------------------------------------------------------------
  def call_dictionary
    SceneManager.call(Scene_Dictionary)
  end
end  



#==============================================================================
# ■ STILILA_Config
#------------------------------------------------------------------------------
#    共通存檔用
#==============================================================================
class STILILA_Config
  #--------------------------------------------------------------------------
  # ● 變量公開
  #--------------------------------------------------------------------------
  attr_accessor :dictionary_list             # 用語字典
  #--------------------------------------------------------------------------
  # ● 初始化物件
  #--------------------------------------------------------------------------
  alias :stdict_initialize :initialize
  def initialize
    stdict_initialize # 原處理
    reset_dict
  end
  #--------------------------------------------------------------------------
  # ● 重設用語
  #-------------------------------------------------------------------------- 
  def reset_dict
    @dictionary_list = {}
#~     STILILA::Dict_Help.each_key {|tag|
#~       STILILA::Dict_Help[tag].each_key {|name| 
#~         @dictionary_list[tag] = {} if @dictionary_list[tag] == nil
#~         @dictionary_list[tag][name] = 0
#~       }
#~     }
    system_save
  end
  #--------------------------------------------------------------------------
  # ● 設置用語狀態(tag、名稱、階段)
  #-------------------------------------------------------------------------- 
  def set_dict(vtag=nil, vname=nil, vstep=nil)
    list = STILILA::Dict_Help
    begin
      # 沒指定tag 
      if !vtag
        list.each_key {|tag|
          list[tag].each_key {|name|
            if vstep
              if STILILA::Dict_Help[tag][name].size < vstep
                p "step超出此用語說明範圍。「tag：#{tag}」、「name：#{name}」、「step：#{vstep}」、「用語說明數：#{STILILA::Dict_Help[tag][name].size}」"
                next
              end
              p "tag：#{tag}、name：#{name}、step：#{vstep} 用語設置中…"
            else
              p "tag：#{tag}、name：#{name} 用語設置中…"
            end
            @dictionary_list[tag] = {} if !@dictionary_list[tag]
            @dictionary_list[tag][name] = (vstep ? vstep : list[tag][name].size)
          }
        }
      # 沒指定name 
      elsif !vname
        # ======== 錯誤處理
        if !list[vtag]
          p "用語設定不存在「tag：#{vtag}」"
          return
        end
        # ======== 正常處理
        list[vtag].each_key {|name|
          if vstep
            if list[vtag][name].size < vstep
              p "step超出此用語說明範圍。「tag：#{vtag}」、「name：#{name}」、「step：#{vstep}」、「用語說明數：#{list[vtag][name].size}」"
              next
            end
            p "tag：#{vtag}、name：#{name}、step：#{vstep} 用語設置中…"
          else
            p "tag：#{vtag}、name：#{name} 用語設置中…"
          end
          @dictionary_list[vtag] = {} if !@dictionary_list[vtag]
          @dictionary_list[vtag][name] = (vstep ? vstep : list[vtag][name].size)
        }
      # 沒指定step
      elsif !vstep
        # ======== 錯誤處理
        if !list[vtag]
          p "用語設定不存在「tag：#{vtag}」"
          return
        end
        if !list[vtag][vname]
          p "用語設定「tag：#{vtag}」中不存在「name：#{vname}」"
          return
        end
        # ======== 正常處理
        p "tag：#{vtag}、name：#{vname} 用語設置中…"
        @dictionary_list[vtag] = {} if !@dictionary_list[vtag]
        @dictionary_list[vtag][vname] = list[vtag][vname].size
      else
        # ======== 錯誤處理
        if !list[vtag]
          p "用語設定不存在「tag：#{vtag}」"
          return
        end
        if !list[vtag][vname]
          p "用語設定「tag：#{vtag} 」中不存在「name：#{vname}」"
          return
        end
        if list[vtag][vname].size < vstep
          p "step超出此用語說明範圍。「tag：#{vtag}」、「name：#{vname}」、「step：#{vstep}」、「用語說明數：#{list[vtag][vname].size}」"
          return
        end
        # ======== 正常處理
        p "tag：#{vtag}、name：#{vname}、step：#{vstep} 用語設置中…"
        @dictionary_list[vtag] = {} if !@dictionary_list[vtag]
        @dictionary_list[vtag][vname] = vstep
      end
    rescue
      vtag = "nil" if !vtag
      vname = "nil" if !vname
      vstep = "nil" if !vstep
      
      p "設置用語的參數有誤，參數內容－－tag：#{vtag}、name：#{vname}、step：#{vstep}"
      return
    end
    
    system_save
  end

end
