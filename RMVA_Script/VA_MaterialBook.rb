#encoding:utf-8

=begin
#==============================================================================
# ■ 素材圖鑑 v1.0
#    最後更新：2017/2/16
#--------------------------------------------------------------------------
#    提示道具從哪些怪物掉落、可自行增加其他取得方式，供合成類腳本快速查找用
#    也可當普通的道具圖鑑
#==============================================================================
#--------------------------------------------------------------------------
# ● 聯絡方式
#--------------------------------------------------------------------------
  http://home.gamer.com.tw/homeindex.php?owner=qootm2
  https://twitter.com/STILILA
  
#--------------------------------------------------------------------------
# ● 使用法
#--------------------------------------------------------------------------
1.呼叫素材圖鑑畫面：
  SceneManager.call(Scene_MaterialBook)

=======================================================
2.增加取得紀錄：
  $game_party.add_material(種類,id)
  
  <種類> :item－道具、:weapon－武器、:armor－防具，省略時全部視為取得
  <id> 道具id，省略時該種類全部視為取得

  
  ex：
    全取得
      $game_party.add_material
    全道具視為取得
      $game_party.add_material(:item)
    5號武器視為取得
      $game_party.add_material(:weapon, 5)
※只要拿過道具，就會自動紀錄，這功能是給使用者立刻解除隱藏資訊用的
========================================================   
3.移除取得紀錄：
  $game_party.remove_material(種類,id)
  
  ex：
    移除所有取得紀錄
      $game_party.remove_material
    移除全道具取得紀錄
      $game_party.remove_material(:item)  
    移除5號武器取得紀錄
      $game_party.remove_material(:weapon, 5)
========================================================   
4.
  與合成系統併用時：
  https://home.gamer.com.tw/creationDetail.php?sn=3475162
  會追加顯示可合成物

#==============================================================================
=end




module STILILA
#--------------------------------------------------------------------------
# ● n 號開關ON時，加入選單中
#--------------------------------------------------------------------------
Mat_MenuSwitch = 6
#--------------------------------------------------------------------------
# ● 加入選單畫面的顯示名稱
#--------------------------------------------------------------------------
Mat_MenuName = "素材圖鑑"
#--------------------------------------------------------------------------
# ● 左選單的寬度
#--------------------------------------------------------------------------
Mat_LeftWidth = 200
#--------------------------------------------------------------------------
# ● 道具註解欄有此文字時，登錄到圖鑑內
#--------------------------------------------------------------------------
Mat_AddNote = "<素材>"
#--------------------------------------------------------------------------
# ● 道具註解欄有此文字時，不登錄到圖鑑內(配合Mat_AddAll用)
#--------------------------------------------------------------------------
Mat_RemoveNote = "<非素材>"
#--------------------------------------------------------------------------
# ● 將資料庫所有道具登錄到圖鑑(無名稱、非素材的除外)  false關、true開
#--------------------------------------------------------------------------
Mat_AddAll = false
#--------------------------------------------------------------------------
# ● 說明追加額外取得方式。
#    道具註解欄加上 <(設定值)> 方式1(換行)方式2(換行)方式3...</(設定值)>  
#    注意要用半形符號
#--------------------------------------------------------------------------
Mat_ExtraNote = "素材取得"
#--------------------------------------------------------------------------
# ● 掉落率用百分比顯示
#--------------------------------------------------------------------------
Mat_Percent = true
#--------------------------------------------------------------------------
# ● 無視道具說明的換行符，開啟時無視換行   false關、true開
#--------------------------------------------------------------------------
Mat_IgnoreNewline = true
#--------------------------------------------------------------------------
# ● 底部的說明
#--------------------------------------------------------------------------
Mat_BottomHelp = "按D鍵切換取得方式／道具資訊"
#--------------------------------------------------------------------------
# ● 道具未取得過時，顯示的文字   
#--------------------------------------------------------------------------
Mat_TextUnknown = "？？？"
#--------------------------------------------------------------------------
# ● 用語：掉落敵人  
#--------------------------------------------------------------------------
Mat_TextDropEnemy = "掉落敵人："
#--------------------------------------------------------------------------
# ● 用語：額外取得方式 
#--------------------------------------------------------------------------
Mat_TextExtraGet = "其他取得方式："
#--------------------------------------------------------------------------
# ● 用語：製作物(有合成系統才有效)
#--------------------------------------------------------------------------
Mat_TextCompound = "可製作："


end

#==============================================================================
# ■ 自定義設置 完
#==============================================================================







#==============================================================================
# ■ Game_Party
#------------------------------------------------------------------------------
# 　管理队伍的类。保存有金钱及物品的信息。本类的实例请参考 $game_party 。
#==============================================================================
class Game_Party < Game_Unit
  #--------------------------------------------------------------------------
  # ● 定义实例变量
  #--------------------------------------------------------------------------
  attr_accessor :materials_got
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  alias :material_initialize :initialize
  def initialize
    material_initialize ###
    @materials_got = {:item => {}, :weapon => {}, :armor => {}}    # 已登錄清單
  end
  
  #--------------------------------------------------------------------------
  # ● 增加／减少物品
  #--------------------------------------------------------------------------
  alias :material_gain_item :gain_item
  def gain_item(item, amount, include_equip = false)
    material_gain_item(item, amount, include_equip)
    container = item_container(item.class)
    return unless container 
    return if amount < 1
    
    if item.is_a?(RPG::Item)
      @materials_got[:item][item.id] = true
    elsif item.is_a?(RPG::Weapon)
      @materials_got[:weapon][item.id] = true
    elsif item.is_a?(RPG::Armor)
      @materials_got[:armor][item.id] = true
    end
    
  end
  #--------------------------------------------------------------------------
  # ● 取得過此物品
  #--------------------------------------------------------------------------
  def item_got?(item)
    if item.is_a?(RPG::Item)
      return @materials_got[:item][item.id]
    elsif item.is_a?(RPG::Weapon)
      return @materials_got[:weapon][item.id]
    elsif item.is_a?(RPG::Armor)
      return @materials_got[:armor][item.id]
    end
  end
  
  
  #--------------------------------------------------------------------------
  # ● 追加取得道具紀錄
  #    type：種類(:item、:weapon、:armor)，-1為全部取得
  #    id(可省略)：道具ID， -1為此種類全部取得，省略時為-1
  #--------------------------------------------------------------------------
  def add_material(type = -1, id = -1)
    if type == -1
      ($data_items + $data_weapons + $data_armors).each{ |item|
        next if item == nil  
        if item.is_a?(RPG::Item) 
          @materials_got[:item][item.id] = true
        elsif item.is_a?(RPG::Weapon) 
          @materials_got[:weapon][item.id] = true
        elsif item.is_a?(RPG::Armor) 
          @materials_got[:armor][item.id] = true
        end 
      }
    elsif id == -1
      case type
      when :item
        $data_items.each {|item|
          @materials_got[:item][item.id] = true
        }
      when :weapon
        $data_weapons.each {|item|
          @materials_got[:weapon][item.id] = true
        }
      when :armor
        $data_armors.each {|item|
          @materials_got[:armor][item.id] = true
        }
      end
    else 
      # 登錄
      @materials_got[type][id] = true

      
    end 
 
  end
  #--------------------------------------------------------------------------
  # ● 移除取得道具紀錄
  #    type：種類(:item、:weapon、:armor)，-1為移除所有紀錄
  #    id(可省略)：道具ID， -1為移除此種類所有紀錄，省略時為-1
  #--------------------------------------------------------------------------
  def remove_material(type = -1, id = -1)
    if type == -1
      @materials_got = {:item => {}, :weapon => {}, :armor => {}}
    elsif id == -1
      @materials_got[type] = {}
    else
      @materials_got[type].delete(id)
    end
  end
  
end
#==============================================================================
# ■ Scene_MaterialBook
#------------------------------------------------------------------------------
# 　菜单画面
#==============================================================================
class Scene_MaterialBook < Scene_MenuBase
  #--------------------------------------------------------------------------
  # ● 开始处理
  #--------------------------------------------------------------------------
  def start
    super
    create_left_window
    create_right_window
    create_bottom_window
  end
  #--------------------------------------------------------------------------
  # ● 更新画面（基础）
  #--------------------------------------------------------------------------
  def update_basic
    super
    
    if !@left_window.active
      if Input.trigger?(:B)
        Sound.play_cancel
        @left_window.activate 
        Input.update
      end
      if Input.press?(:UP)
        @right_window.scroll_up
        Input.update
      end
      if Input.press?(:DOWN)
        @right_window.scroll_down
        Input.update
      end
    end
    
    # 按下D鍵，切換模式
    if Input.trigger?(:Z)
      @right_window.change_mode
      Input.update
    end
    
    
  end
  #--------------------------------------------------------------------------
  # ● 生成左視窗
  #--------------------------------------------------------------------------
  def create_left_window
    @left_window = Window_MaterialCommand.new
    @left_window.set_handler(:ok,    method(:active_right_window))
    @left_window.set_handler(:cancel,    method(:return_scene))
  end
  #--------------------------------------------------------------------------
  # ● 生成右視窗
  #--------------------------------------------------------------------------
  def create_right_window
    @right_window = Window_MaterialHelp.new
    @left_window.help_window = @right_window
  end
  #--------------------------------------------------------------------------
  # ● 生成底視窗
  #--------------------------------------------------------------------------
  def create_bottom_window
    @bottom_window = Window_MaterialBottom.new
  end
  #--------------------------------------------------------------------------
  # ● 活化右視窗
  #--------------------------------------------------------------------------
  def active_right_window
    # 不需要捲動時
    if @right_window.contents.height <= @right_window.contents_height
      @left_window.activate 
    end
  end
end



#==============================================================================
# ■ Window_MaterialCommand
#------------------------------------------------------------------------------
# 　
#==============================================================================
class Window_MaterialCommand < Window_Command
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize
    super(0, 0)
    self.active = true
    @help_window = nil
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    return STILILA::Mat_LeftWidth
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的高度
  #--------------------------------------------------------------------------
  def window_height
    Graphics.height-fitting_height(1)
  end
  #--------------------------------------------------------------------------
  # ● 作成選項
  #--------------------------------------------------------------------------
  def make_command_list
    materials = ($data_items + $data_weapons + $data_armors).select{ |item|
      next if item == nil  
      (item.note.include?(STILILA::Mat_AddNote) || (STILILA::Mat_AddAll && !item.name.empty?)) && !item.note.include?(STILILA::Mat_RemoveNote)
    }
    materials.each { |item|
      if $game_party.item_got?(item)
        add_command(item.name, :ok, true, item)
      else
        add_command(STILILA::Mat_TextUnknown, :ok, true, item)
      end
    }
  end
  
  #--------------------------------------------------------------------------
  # ● 獲取此道具
  #--------------------------------------------------------------------------
  def item 
    current_ext
  end
  #--------------------------------------------------------------------------
  # ● 更新帮助内容
  #--------------------------------------------------------------------------
  def update_help
    case @help_window.mode
    when 0
      @help_window.set_item(item)
    when 1
      @help_window.set_info(item)
    end
  end
end



#==============================================================================
# ■ Window_MaterialHelp
#------------------------------------------------------------------------------
# 　
#==============================================================================

class Window_MaterialHelp < Window_Base
  #--------------------------------------------------------------------------
  # ● 定义实例变量
  #--------------------------------------------------------------------------
  attr_reader   :mode
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize
    super(Graphics.width-window_width, 0, window_width, window_height)
    @mode = 0
    @item = nil
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    return Graphics.width - STILILA::Mat_LeftWidth
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的高度
  #--------------------------------------------------------------------------
  def window_height
    return Graphics.height - fitting_height(1)
  end
  #--------------------------------------------------------------------------
  # ● 清除
  #--------------------------------------------------------------------------
  def clear
    contents.clear
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
  # ● 轉換模式
  #--------------------------------------------------------------------------
  def change_mode
    case @mode
    when 0
      @mode = 1
      set_info(@item)
    when 1
      @mode = 0
      set_item(@item)
    end
  end
  
  #--------------------------------------------------------------------------
  # ● 取得內容高
  #--------------------------------------------------------------------------
  def get_contents_height(item)
    y = line_height
    y_plus = line_height
    
    $data_enemies.each {|enemy|
      next if !enemy
      flag = nil
      enemy.drop_items.each { |drop|
        if item.is_a?(RPG::Item) && drop.kind == 1 && drop.data_id == item.id
          flag = true
          break
        elsif item.is_a?(RPG::Weapon) && drop.kind == 2 && drop.data_id == item.id
          flag = true
          break
        elsif item.is_a?(RPG::Armor) && drop.kind == 3 && drop.data_id == item.id
          flag = true
          break
        end
      }
      if flag
        y += y_plus
      end
    }  

    # 有設定其他取得途徑的情況
    if item.note.include?("<#{STILILA::Mat_ExtraNote}>")
      y += y_plus
      extra = false
      item.note.each_line {|line|
        if line =~ /<#{STILILA::Mat_ExtraNote}>/
          extra = true
        elsif line =~ /<\/#{STILILA::Mat_ExtraNote}>/
          extra = false
        else
          if extra
            y += y_plus
          end
        end
      }
    end
    
    # 可製作(需配合合成腳本)
    if STILILA.const_defined?(:Syn_List) 
      y += y_plus
      STILILA::Syn_List.each_key { |stype|
        STILILA::Syn_List[stype].each_key { |sid| 
          if item.is_a?(RPG::Item) 
            if STILILA::Syn_List[stype][sid][:mi].include?(item.id) 
              y += y_plus
            end
          elsif item.is_a?(RPG::Weapon)
            if STILILA::Syn_List[stype][sid][:mw].include?(item.id) 
              y += y_plus
            end
          elsif item.is_a?(RPG::Armor)
            if STILILA::Syn_List[stype][sid][:ma].include?(item.id) 
              y += y_plus
            end
          end
        }
      }
    end

    
    return [y, contents_height].max
    
  end
  
  #--------------------------------------------------------------------------
  # ● 设置物品
  #     item : 技能、物品等
  #--------------------------------------------------------------------------
  def set_item(item)
    contents.clear
    @item = item
    return if !item 
    
    # 重新製作contents大小
    contents.dispose
    self.contents = Bitmap.new(contents_width, get_contents_height(item))
    self.oy = 0
    
    change_color(system_color)
    draw_text(0, 0, 240, line_height, STILILA::Mat_TextDropEnemy)
    change_color(normal_color)
    y = line_height
    y_plus = line_height
    
    $data_enemies.each {|enemy|
      next if !enemy
      enemy_name = nil
      max_denominator = 99
      enemy.drop_items.each { |drop|
        if item.is_a?(RPG::Item) && drop.kind == 1 && drop.data_id == item.id
          # 記憶名稱
          enemy_name = enemy.name
          # 記憶最高掉落率
          max_denominator = drop.denominator if max_denominator > drop.denominator
        elsif item.is_a?(RPG::Weapon) && drop.kind == 2 && drop.data_id == item.id
          enemy_name = enemy.name
          max_denominator = drop.denominator if max_denominator > drop.denominator
        elsif item.is_a?(RPG::Armor) && drop.kind == 3 && drop.data_id == item.id
          enemy_name = enemy.name
          max_denominator = drop.denominator if max_denominator > drop.denominator
        end
      }
      # 如果有掉落
      if enemy_name
        set_text(y, enemy_name, max_denominator)
        y += y_plus
      end
    }  
    
    # 有設定其他取得途徑的情況
    if item.note.include?("<#{STILILA::Mat_ExtraNote}>")
      change_color(system_color)
      draw_text(0, y, 240, line_height, STILILA::Mat_TextExtraGet)
      y += y_plus
      change_color(normal_color)
      extra = false
      item.note.each_line {|line|
        if line =~ /<#{STILILA::Mat_ExtraNote}>/
          extra = true
        elsif line =~ /<\/#{STILILA::Mat_ExtraNote}>/
          extra = false
        else
          if extra
            draw_text(0, y, 240, line_height, "  "+line)
            y += y_plus
          end
        end
      }
    end
    
    # 可製作(需配合合成腳本)
    if STILILA.const_defined?(:Syn_List) 
      change_color(system_color)
      draw_text(0, y, 240, line_height, STILILA::Mat_TextCompound)
      change_color(normal_color)
      y += y_plus
      w = contents_width
      STILILA::Syn_List.each_key { |stype|
        STILILA::Syn_List[stype].each_key { |sid| 
          if item.is_a?(RPG::Item) 
            text_width = text_size("  ").width
            if STILILA::Syn_List[stype][sid][:mi].include?(item.id) 
              resultItem = get_result_item(stype, sid)
              draw_icon(resultItem.icon_index, text_width, y)
              draw_text(24+4, y, w, line_height,"  "+resultItem.name)
              y += y_plus
            end
          elsif item.is_a?(RPG::Weapon)
            text_width = text_size("  ").width
            if STILILA::Syn_List[stype][sid][:mw].include?(item.id) 
              resultItem = get_result_item(stype, sid)
              draw_icon(resultItem.icon_index, text_width, y)
              draw_text(24+4, y, w, line_height,"  "+resultItem.name)
              y += y_plus
            end
          elsif item.is_a?(RPG::Armor)
            text_width = text_size("  ").width
            if STILILA::Syn_List[stype][sid][:ma].include?(item.id) 
              resultItem = get_result_item(stype, sid)
              draw_icon(resultItem.icon_index, text_width, y)
              draw_text(24+4, y, w, line_height,"  "+resultItem.name)
              y += y_plus
            end
          end
        }
      }
    end
  end
  #--------------------------------------------------------------------------
  # ● 取得合成物
  #--------------------------------------------------------------------------
  def get_result_item(type, id)
    case type
    when :item ;$data_items[id]
    when :weapon ;$data_weapons[id]
    when :armor ;$data_armors[id]
    end
  end
  
  #--------------------------------------------------------------------------
  # ● 處理普通文字
  #--------------------------------------------------------------------------
  def process_normal_character(c, pos)
    text_width = text_size(c).width
    if pos[:x] + text_width > contents_width
      pos[:x] = pos[:new_x]
      pos[:y] += pos[:height]
    end
    draw_text(pos[:x], pos[:y], text_width * 2, pos[:height], c)
    pos[:x] += text_width
  end
  #--------------------------------------------------------------------------
  # ● 设置道具資訊
  #--------------------------------------------------------------------------
  def set_info(item)
    create_contents # 重新製作contents
    self.oy = 0
    @item = item
    if (!$game_party.item_got?(item))
      draw_text(0, 0, contents.width, line_height, STILILA::Mat_TextUnknown)
      return
    end
    y = 0
    y_plus = line_height
    # 描繪名稱
    draw_icon(item.icon_index, 0, 0)
    draw_text(24+4, 0, contents.width, line_height, item.name)
    # 描繪價格
    draw_text(0, 0, contents.width, line_height, item.price.to_s+" "*(Vocab::currency_unit.size+1), 2)
    change_color(system_color)
    draw_text(0, 0, contents.width, line_height, Vocab::currency_unit, 2)
    change_color(normal_color)
    y += y_plus
    # 描繪說明
    description = item.description.clone
    if STILILA::Mat_IgnoreNewline
      description.gsub!(/\r/){""}
      description.gsub!(/\n/){""}
    end
    draw_text_ex(4, y, description) 

    y += y_plus
    y += y_plus
    y += y_plus
    y += y_plus
    
    if (item.is_a?(RPG::Weapon) || item.is_a?(RPG::Armor))
      # 描繪裝備資訊
      half_w = contents_width/2
      
      change_color(system_color)
      draw_text(4, y, half_w, line_height, Vocab::param(2))
      draw_text(4, y+y_plus, half_w, line_height, Vocab::param(3))
      draw_text(4, y+y_plus*2, half_w, line_height, Vocab::param(4))
      draw_text(4, y+y_plus*3, half_w, line_height, Vocab::param(5))
      draw_text(half_w+4, y, half_w, line_height, Vocab::param(6))
      draw_text(half_w+4, y+y_plus, half_w, line_height, Vocab::param(7))
      draw_text(half_w+4, y+y_plus*2, half_w, line_height, Vocab::param(0))
      draw_text(half_w+4, y+y_plus*3, half_w, line_height, Vocab::param(1))

      change_color(normal_color)
      half_w -= 12
      draw_text(0, y, half_w, line_height, item.params[2], 2)
      draw_text(0, y+y_plus, half_w, line_height, item.params[3], 2)
      draw_text(0, y+y_plus*2, half_w, line_height, item.params[4], 2)
      draw_text(0, y+y_plus*3, half_w, line_height, item.params[5], 2)
      draw_text(half_w, y, half_w, line_height, item.params[6], 2)
      draw_text(half_w, y+y_plus, half_w, line_height, item.params[7], 2)
      draw_text(half_w, y+y_plus*2, half_w, line_height, item.params[0], 2)
      draw_text(half_w, y+y_plus*3, half_w, line_height, item.params[1], 2)
    end
  end
  

  #--------------------------------------------------------------------------
  # ● 设置内容
  #--------------------------------------------------------------------------
  def set_text(y, enemy_name, denominator)
    draw_text(0, y, 240, line_height, "  "+enemy_name)
    if STILILA::Mat_Percent
      denominator = (100.0/denominator).round
      draw_text(0, y, window_width-32, line_height, denominator.to_s+"%", 2)
    else
      draw_text(0, y, window_width-32, line_height, "1/"+denominator.to_s, 2)
    end
  end
  
end



#==============================================================================
# ■ Window_MaterialBottom
#------------------------------------------------------------------------------
# 　素材圖鑑的底部視窗
#==============================================================================

class Window_MaterialBottom < Window_Base
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize
    super(0, Graphics.height-fitting_height(1), Graphics.width, fitting_height(1))
    draw_text(0, 0, contents.width, contents.height, STILILA::Mat_BottomHelp, 1)
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
  alias :stmat_add_original_commands :add_original_commands
  def add_original_commands
    stmat_add_original_commands
    if $game_switches[STILILA::Mat_MenuSwitch]
      add_command(STILILA::Mat_MenuName, :material)
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
  alias :stmat_start :start
  def start
    stmat_start
    @command_window.set_handler(:material,     method(:call_material))
  end
  #--------------------------------------------------------------------------
  # ● 呼叫素材圖鑑畫面
  #--------------------------------------------------------------------------
  def call_material
    SceneManager.call(Scene_MaterialBook)
  end
end  


