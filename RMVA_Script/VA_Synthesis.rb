#encoding:utf-8

=begin
#==============================================================================
# ■ 合成系統 v1.1
#    最後更新：2017/2/16
#--------------------------------------------------------------------------
#    常見的合成腳本，具備成功率、製作金額、配方名稱、批量製作等功能
#==============================================================================
#--------------------------------------------------------------------------
# ● 聯絡方式
#--------------------------------------------------------------------------
  http://home.gamer.com.tw/homeindex.php?owner=qootm2
  https://twitter.com/STILILA

--------------------------------------------------------------------------
 ● 更新履歷
--------------------------------------------------------------------------
 v1.1
  底部的說明視窗追加新說明，會定期切換
  增加2項設定值：Syn_ModeHelpText2、Syn_ModeHelpChange，先前版本的使用者記得追加，
  ※更新前記得備份自定義設置內容※
#--------------------------------------------------------------------------
# ● 使用法
#--------------------------------------------------------------------------
1.呼叫合成畫面：
  SceneManager.call(Scene_Synthesis)
  
  ＜操作＞
  Q、W：切換製作種類
  D：切換所需素材、裝備素質
  (選擇數量時)↑、↓：捲動素材視窗
  (選擇數量時)←、→：數量-1／+1
  (選擇數量時)Q、W：數量-10／+10
=======================================================
2.增加配方：
  $game_party.add_synthesis(種類,id,隱藏)
  
  <種類> :item－道具、:weapon－武器、:armor－防具，省略時增加所有配方
  <id> 道具id，省略時加入該種類所有配方
  <隱藏> 製作成功前，隱藏道具訊息
  
  ex：
    增加所有配方
      $game_party.add_synthesis
    增加所有道具配方
      $game_party.add_synthesis(:item)
    增加 5 號武器配方
      $game_party.add_synthesis(:weapon, 5)
    增加 3 號防具配方，並隱藏道具訊息
      $game_party.add_synthesis(:armor, 3, true)
========================================================   
3.移除配方：
  $game_party.remove_synthesis(種類,id)
  
  ex：
    移除所有配方
      $game_party.remove_synthesis   
    移除所有道具配方
      $game_party.remove_synthesis(:item)  
    移除 5 號武器配方
      $game_party.remove_synthesis(:weapon, 5)
      
#==============================================================================
=end





#==============================================================================
# ■ 自定義設置
#==============================================================================
module STILILA
#--------------------------------------------------------------------------
# ● 配方 
#--------------------------------------------------------------------------
#  種類 => 配方內容
#
# ＜配方參數＞
#   # === 必須參數 ===
#   :mi — 道具素材  {A素材ID=>數量, B素材ID=>數量...}
#   :mw — 武器素材
#   :ma — 防具素材
#
#   # === 可省略參數 ===
#   :success — 成功率
#   :upgrade — 每次合成後，成功率增加程度
#   :garbage — 失敗時的產物 (所屬種類的ID)
#   :gold — 消耗金錢
#   :name — 配方名稱
#--------------------------------------------------------------------------
Syn_List = {
  # ==== 道具
  :item => {
    # 全恢復劑： 恢復劑x2、強恢復劑x1
    3 => {:mi=>{1=>2, 2=>1}, :mw=>{}, :ma=>{}, :name=>"頭好壯壯配方"},
    # 萬能藥： 解毒劑x3
    7 => {:mi=>{6=>3}, :mw=>{}, :ma=>{}},
    # 金之藥
    9 => {:mi=>{1=>1, 2=>1, 3=>1, 4=>1, 5=>1, 6=>1, 7=>1, 8=>1, 20=>3}, :mw=>{}, :ma=>{}, :success=>30, :upgrade=>5, :gold=>500},
  },
  # ==== 武器
  :weapon => {
    # 月牙戰斧： 輔助劑x3、手斧x2
    3 => {:mi=>{20=>3}, :mw=>{1=>2}, :ma=>{}, :success=>70, :gold=>300},
  },
  # ==== 防具
  :armor => {
    # 冒險者之服： 輔助劑x3、布衣x2
    3 => {:mi=>{20=>3}, :mw=>{}, :ma=>{1=>2}, :success=>70, :gold=>300},
  }
}

#--------------------------------------------------------------------------
# ● n 號開關ON時，加入選單中
#--------------------------------------------------------------------------
Syn_MenuSwitch = 5
#--------------------------------------------------------------------------
# ● 加入選單畫面的顯示名稱
#--------------------------------------------------------------------------
Syn_MenuName = "合成"
#--------------------------------------------------------------------------
# ● 預設成功率
#--------------------------------------------------------------------------
Syn_Success = 100
#--------------------------------------------------------------------------
# ● 預設成功率上升程度
#--------------------------------------------------------------------------
Syn_Upgrade = 2
#--------------------------------------------------------------------------
# ● 預設合成費用
#--------------------------------------------------------------------------
Syn_Gold = 0
#--------------------------------------------------------------------------
# ● 預設垃圾ID [道具, 武器, 防具]
#--------------------------------------------------------------------------
Syn_Garbage = [25,5,5]
#--------------------------------------------------------------------------
# ● 隱藏內容時的文字
#--------------------------------------------------------------------------
Syn_UnknownName = "？？？"
#--------------------------------------------------------------------------
# ● 隱藏內容時的說明
#--------------------------------------------------------------------------
Syn_UnknownHelpText = "未知的道具，成功製作前無法確認。"
#--------------------------------------------------------------------------
# ● 切換模式說明
#--------------------------------------------------------------------------
Syn_ModeHelpText = "D鍵切換所需素材／道具素質"
#--------------------------------------------------------------------------
# ● 切換模式說明2
#--------------------------------------------------------------------------
Syn_ModeHelpText2 = "Q、W鍵切換製作種類"
#--------------------------------------------------------------------------
# ● 切換說明等待時間
#--------------------------------------------------------------------------
Syn_ModeHelpChange = 120
#--------------------------------------------------------------------------
# ● 合成SE [名稱, 音量, 頻率]
#--------------------------------------------------------------------------
Syn_SE = ["Item3", 90, 100]
#--------------------------------------------------------------------------
# ● 用語：「合成結果」
#--------------------------------------------------------------------------
Syn_ResultText = "合成結果…"
#--------------------------------------------------------------------------
# ● 用語：「確定合成？」
#--------------------------------------------------------------------------
Syn_ConfirmText = "確定合成？"
#--------------------------------------------------------------------------
# ● 用語：「金錢不足」
#--------------------------------------------------------------------------
Syn_NoGoldText = "金錢不足"
#--------------------------------------------------------------------------
# ● 用語：「素材不足」
#--------------------------------------------------------------------------
Syn_NoMaterialText = "素材不足"
#--------------------------------------------------------------------------
# ● 用語：「超過上限」
#--------------------------------------------------------------------------
Syn_LimitText = "超過所持上限"
#--------------------------------------------------------------------------
# ● 用語：「道具合成」
#--------------------------------------------------------------------------
Syn_PageItemText = "道具合成"
#--------------------------------------------------------------------------
# ● 用語：「武器合成」
#--------------------------------------------------------------------------
Syn_PageWeaponText = "武器合成"
#--------------------------------------------------------------------------
# ● 用語：「防具合成」
#--------------------------------------------------------------------------
Syn_PageArmorText = "防具合成"
#--------------------------------------------------------------------------
# ● 用語：「確定合成」
#--------------------------------------------------------------------------
Syn_Yes = "確定"
#--------------------------------------------------------------------------
# ● 用語：「取消合成」
#--------------------------------------------------------------------------
Syn_No = "取消"
#--------------------------------------------------------------------------
# ● 用語：「持有數」
#--------------------------------------------------------------------------
Syn_PossessionText = "持有"
#--------------------------------------------------------------------------
# ● 用語：「需求數量」
#--------------------------------------------------------------------------
Syn_DemandText = "需求"
#--------------------------------------------------------------------------
# ● 用語：「所需素材」
#--------------------------------------------------------------------------
Syn_MaterialText = "所需素材"
#--------------------------------------------------------------------------
# ● 用語：「製作數量」
#--------------------------------------------------------------------------
Syn_AmountText = "數量"
#--------------------------------------------------------------------------
# ● 用語：「成功率」
#--------------------------------------------------------------------------
Syn_SuccessText = "成功率："
#--------------------------------------------------------------------------
# ● 用語：「合成費用」
#--------------------------------------------------------------------------
Syn_CostText = "製作費用"
#--------------------------------------------------------------------------
# ● 用語：「素質」
#--------------------------------------------------------------------------
Syn_ParamText = "素質"
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
  attr_reader   :synthesis_data
  attr_accessor :synthesis_success
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  alias :synthesis_initialize :initialize
  def initialize
    synthesis_initialize ###
    @synthesis_data = {:item => {}, :weapon => {}, :armor => {}}    # 已登錄清單
    @synthesis_success = {:item => {}, :weapon => {}, :armor => {}} # 成功率
  end
  
  #--------------------------------------------------------------------------
  # ● 追加配方
  #    type：種類(:item、:weapon、:armor)，-1為加入所有配方
  #    id(可省略)：道具ID， -1為加入此種類所有配方，省略時為-1
  #    unknown(可省略)：以「未知」狀態加入，省略時以一般方式，重新加入時會重置狀態
  #--------------------------------------------------------------------------
  def add_synthesis(type = -1, id = -1, unknown=false)
    if type == -1
      STILILA::Syn_List.each_key { |stype|
        STILILA::Syn_List[stype].each_key { |sid| 
          # 登錄
          @synthesis_data[stype][sid] = unknown ? 1 : 2
          # 成功率登錄
          @synthesis_success[stype][sid] = @synthesis_success[stype][sid] || (STILILA::Syn_List[stype][sid][:success] || STILILA::Syn_Success)
        } 
        # 以ID排序
        @synthesis_data[stype] = Hash[@synthesis_data[stype].sort]
      }
    elsif id == -1
      STILILA::Syn_List[type].each_key { |sid|
        # 登錄
        @synthesis_data[type][sid] = unknown ? 1 : 2
        # 成功率登錄
        @synthesis_success[type][sid] = @synthesis_success[type][sid] || (STILILA::Syn_List[type][sid][:success] || STILILA::Syn_Success)
      }
      # 以ID排序
      @synthesis_data[type] = Hash[@synthesis_data[type].sort]
    else 
      
      if STILILA::Syn_List[type][id]
        # 登錄
        @synthesis_data[type][id] = unknown ? 1 : 2
        # 成功率登錄
        @synthesis_success[type][id] = @synthesis_success[type][id] || (STILILA::Syn_List[type][id][:success] || STILILA::Syn_Success)
        # 以ID排序
        @synthesis_data[type] = Hash[@synthesis_data[type].sort]
      else
        p "合成種類 #{type} 不存在 #{id} 號配方，請檢查設定"
      end
      
    end 
    
    
    
  end
  #--------------------------------------------------------------------------
  # ● 移除配方
  #    type：種類(:item、:weapon、:armor)，-1為移除所有配方
  #    id(可省略)：道具ID， -1為移除此種類所有配方，省略時為-1
  #--------------------------------------------------------------------------
  def remove_synthesis(type = -1, id = -1)
    if type == -1
      @synthesis_data = {:item => {}, :weapon => {}, :armor => {}}
    elsif id == -1
      @synthesis_data[type] = {}
    else
      @synthesis_data[type].delete(id)
    end
  end
  
  
  
end

#==============================================================================
# ■ Scene_Synthesis
#------------------------------------------------------------------------------
# 　菜单画面
#==============================================================================
class Scene_Synthesis < Scene_MenuBase
  #--------------------------------------------------------------------------
  # ● 开始处理
  #--------------------------------------------------------------------------
  def start
    super
    @type = 0 # 0：道具、1：武器、2：防具
    create_help_window
    create_gold_window
    create_command_window
    create_dummy_window
    create_iteminfo_window  # 道具資訊視窗(素材需求 or 素質)
    create_basic_window
    create_amount_window  # 製作數量視窗
    create_confirm_window  
    create_result_window
    create_msg_window
    hide_right_window
    @msg_window_showing = false
    @now_index = -1 # 紀錄目前選項，刷新用 
    
    @help_window2_wait = 0
    @help_window2_help = 0
  end
  #--------------------------------------------------------------------------
  # ● 更新画面（基础）
  #--------------------------------------------------------------------------
  def update_basic
    super
    
    update_help_window2
    
    # 顯示訊息中
    if @msg_window_showing && (Input.trigger?(:C) || Input.trigger?(:B))
      if @result_window.visible
        Sound.play_cancel
        command_active_select
        @result_window.visible = false
      else
        Sound.play_cancel
        command_active_synthesis
      end
      @msg_window_showing = false   
    end
    
    # 按下D鍵，切換模式
    if Input.trigger?(:Z)
      @basic_window.change_mode
      @command_window.select(@command_window.index, @amount_window.amount)
    end

    # 數量調整視窗活化時，可捲動配方清單
    if @amount_window.active 
      if Input.press?(:UP)
        @info_window.scroll_up
      end
      
      if Input.press?(:DOWN)
        @info_window.scroll_down
      end 
    end

    
    
  end
  
  
  
  
  #--------------------------------------------------------------------------
  # ● 生成說明視窗
  #--------------------------------------------------------------------------
  def create_help_window
    @help_window = Window_Base.new(0, 0, Graphics.width, 48)
    refresh_help_window
  end
  #--------------------------------------------------------------------------
  # ● 刷新說明視窗
  #--------------------------------------------------------------------------
  def refresh_help_window
    contents = @help_window.contents
    contents.clear
    case @type
    when 0 ; text = STILILA::Syn_PageItemText
    when 1 ; text = STILILA::Syn_PageWeaponText
    when 2 ; text = STILILA::Syn_PageArmorText
    end
    @help_window.draw_text(0,0,contents.width,contents.height,text,1)
  end
  
  #--------------------------------------------------------------------------
  # ● 生成金钱窗口
  #--------------------------------------------------------------------------
  def create_gold_window
    @gold_window = Window_Gold.new
    @gold_window.x = Graphics.width - @gold_window.width
    @gold_window.y = Graphics.height - @gold_window.height
    @help_window2 = Window_Base.new(0, @gold_window.y, Graphics.width - @gold_window.width, 48)
    @help_window2.draw_text(0,0,@help_window2.contents_width,24,STILILA::Syn_ModeHelpText,1)
    @help_window2.contents_opacity = 0
  end
  #--------------------------------------------------------------------------
  # ● 生成配方選擇窗口
  #--------------------------------------------------------------------------
  def create_command_window
    @command_window = Window_SynthesisCommand.new(@help_window.height, @gold_window.height)
    @command_window.set_handler(:ok,    method(:command_active_synthesis)) # 確定
    @command_window.set_handler(:pageup,  method(:pre_type)) # 切換種類Q
    @command_window.set_handler(:pagedown,  method(:next_type)) # 切換種類W
    @command_window.set_handler(:cancel,    method(:return_scene)) # 取消
  end
  #--------------------------------------------------------------------------
  # ● 生成作為背景的空窗口
  #--------------------------------------------------------------------------
  def create_dummy_window
    @dummy_window = Window_Base.new(160,48,Graphics.width-160,Graphics.height-96)
  end
  #--------------------------------------------------------------------------
  # ● 生成合成物基本內容窗口
  #--------------------------------------------------------------------------
  def create_basic_window
    @basic_window = Window_SynthesisItem.new(@command_window.width, @help_window.height)
    @basic_window.info_window = @info_window
    @command_window.main_window = @basic_window
  end
  #--------------------------------------------------------------------------
  # ● 生成合成物資訊內容窗口
  #--------------------------------------------------------------------------
  def create_iteminfo_window
    # 120是 Window_SynthesisItem 的高度
    @info_window = Window_SynthesisInfo.new(@command_window.width, @help_window.height+130)
  end
  #--------------------------------------------------------------------------
  # ● 生成數量選擇視窗
  #--------------------------------------------------------------------------
  def create_amount_window
    @amount_window = Window_SynthesisAmount.new
    @amount_window.set_handler(:ok,    method(:ready_synthesize))          # 準備合成
    @amount_window.set_handler(:cancel,    method(:command_active_select)) # 取消
    @amount_window.main_window = @basic_window
    @command_window.amount_window = @amount_window
    @command_window.select(0)
    
  end
  #--------------------------------------------------------------------------
  # ● 生成確認視窗
  #--------------------------------------------------------------------------
  def create_confirm_window
    @confirm_window = Window_SynthesisConfirm.new
    @confirm_window.set_handler(:ok,    method(:start_synthesize))          # 開始合成
    @confirm_window.set_handler(:cancel,    method(:command_active_synthesis)) # 取消
    @confirm_window.visible = false
  end
  #--------------------------------------------------------------------------
  # ● 生成製作結果視窗
  #--------------------------------------------------------------------------
  def create_result_window
    @result_window = Window_SynthesisResult.new
    @result_window.visible = false
  end
  #--------------------------------------------------------------------------
  # ● 生成訊息視窗
  #--------------------------------------------------------------------------
  def create_msg_window
    @msg_window = Window_Base.new(Graphics.width/2-180, Graphics.height/2 - 48,360, 48)
    contents = @msg_window.contents
    @msg_window.back_opacity = 255
    @msg_window.draw_text(0, 0, contents.width, contents.height, "", 1)
    @msg_window.visible = false
  end
  #--------------------------------------------------------------------------
  # ● 更新底部說明視窗
  #--------------------------------------------------------------------------
  def update_help_window2
    if @help_window2_wait > STILILA::Syn_ModeHelpChange
      @help_window2.contents_opacity -= 26
      if @help_window2.contents_opacity == 0
        if @help_window2_help == 0
          @help_window2.contents.clear
          @help_window2.draw_text(0,0,@help_window2.contents_width,24,STILILA::Syn_ModeHelpText2,1)
          @help_window2_wait = 0
          @help_window2_help = 1
        else
          @help_window2.contents.clear
          @help_window2.draw_text(0,0,@help_window2.contents_width,24,STILILA::Syn_ModeHelpText,1)
          @help_window2_wait = 0
          @help_window2_help = 0
        end
      end
    else
      if @help_window2.contents_opacity < 255
        @help_window2.contents_opacity += 26
      end
    end
    @help_window2_wait += 1
  end
  #--------------------------------------------------------------------------
  # ● 隱藏右邊視窗
  #--------------------------------------------------------------------------
  def hide_right_window
    @dummy_window.opacity = 190
  end
  #--------------------------------------------------------------------------
  # ● 顯示右邊視窗
  #--------------------------------------------------------------------------
  def show_right_window
    @dummy_window.opacity = 255
  end
  
  #--------------------------------------------------------------------------
  # ● 刷新提示視窗
  #    msg：0－合成確認、1－素材不足、2－金錢不足、3-超過上限
  #--------------------------------------------------------------------------
  def refresh_msg_window(msg)
    contents = @msg_window.contents
    contents.clear
    case msg
    when 0
      @msg_window.draw_text(0, 0, contents.width, contents.height, STILILA::Syn_ConfirmText, 1)
    when 1
      @msg_window.draw_text(0, 0, contents.width, contents.height, STILILA::Syn_NoMaterialText, 1)
    when 2
      @msg_window.draw_text(0, 0, contents.width, contents.height, STILILA::Syn_NoGoldText, 1)
    when 3
      @msg_window.draw_text(0, 0, contents.width, contents.height, STILILA::Syn_LimitText, 1)
    else 
    end
  end
  
  #--------------------------------------------------------------------------
  # ● 切換種類Q
  #--------------------------------------------------------------------------
  def pre_type
    @type -= 1
    @type = 2 if @type < 0
    case @type
    when 0 ;@command_window.change_type(:item)
    when 1 ;@command_window.change_type(:weapon)
    when 2 ;@command_window.change_type(:armor)
    end
    refresh_help_window
    @command_window.active = true
  end
  #--------------------------------------------------------------------------
  # ● 切換種類W
  #--------------------------------------------------------------------------
  def next_type
    @type += 1
    @type = 0 if @type > 2
    case @type
    when 0 ;@command_window.change_type(:item)
    when 1 ;@command_window.change_type(:weapon)
    when 2 ;@command_window.change_type(:armor)
    end
    refresh_help_window
    @command_window.active = true
  end
  #--------------------------------------------------------------------------
  # ● 活化選擇視窗
  #--------------------------------------------------------------------------
  def command_active_select
    @command_window.active = true
    @confirm_window.active = false
    @amount_window.active = false
    hide_right_window
  end
  #--------------------------------------------------------------------------
  # ● 活化狀態視窗
  #--------------------------------------------------------------------------
  def command_active_synthesis
    @command_window.active = false
    @confirm_window.active = false
    @amount_window.active = true
    @msg_window.visible = false
    @confirm_window.visible = false
    show_right_window
  end
  
  #--------------------------------------------------------------------------
  # ● 準備合成
  #--------------------------------------------------------------------------
  def ready_synthesize
    @command_window.active = false
    @amount_window.active = false
    @msg_window.visible = true
    
    # 超過上限
    type = @command_window.type
    id = @command_window.current_symbol
    case type
    when :item   ; item = $data_items[id]
    when :weapon ; item = $data_weapons[id] 
    when :armor  ; item = $data_armors[id] 
    end
    if $game_party.item_max?(item) || $game_party.item_number(item) + @amount_window.amount > $game_party.max_item_number(item)
      refresh_msg_window(3)
      @msg_window_showing = true
      Sound.play_buzzer
      return
    end
    
    # 錢不夠
    if !check_gold 
      refresh_msg_window(2)
      @msg_window_showing = true
      Sound.play_buzzer
      return
    end
    
    # 素材不夠
    if !check_material
      refresh_msg_window(1)
      @msg_window_showing = true
      Sound.play_buzzer
      return
    end

    refresh_msg_window(0)
    @confirm_window.active = true
    @confirm_window.visible = true
  end
  #--------------------------------------------------------------------------
  # ● 檢查錢
  #--------------------------------------------------------------------------
  def check_gold
    gold = (STILILA::Syn_List[@command_window.type][@command_window.current_symbol][:gold] || STILILA::Syn_Gold)
    gold *= @amount_window.amount
    return $game_party.gold >= gold
  end
  #--------------------------------------------------------------------------
  # ● 檢查素材
  #--------------------------------------------------------------------------
  def check_material
    
    data = STILILA::Syn_List[@command_window.type][@command_window.current_symbol]
    amount = @amount_window.amount
    
    for id in data[:mi].keys
      item = $data_items[id]
      need = data[:mi][id] * amount
      now = $game_party.item_number(item)
      return if (now < need) # 數量不足就中斷
    end
    for id in data[:mw].keys
      item = $data_weapons[id]
      need = data[:mw][id] * amount
      now = $game_party.item_number(item)
      return if (now < need) # 數量不足就中斷
    end
    for id in data[:ma].keys
      item = $data_armors[id]
      need = data[:ma][id] * amount
      now = $game_party.item_number(item)
      return if (now < need) # 數量不足就中斷
    end
    # 通過檢查
    return true
  end
  
  #--------------------------------------------------------------------------
  # ● 開始合成
  #--------------------------------------------------------------------------
  def start_synthesize
    @msg_window.visible = false
    @confirm_window.visible = false
    
    type = @command_window.type
    id = @command_window.current_symbol
    
    amount = @amount_window.amount # 獲得製作數量
    data = STILILA::Syn_List[type][id] # 獲得素材資料
    success = $game_party.synthesis_success[type][id] # 獲得成功率
    
    
    # 取得製作物／失敗物
    case type
    when :item 
      target_item = $data_items[id]
      garbage_item = (data[:garbage] ? $data_items[data[:garbage]] : $data_items[STILILA::Syn_Garbage[0]])
    when :weapon
      target_item = $data_weapons[id]
      garbage_item = (data[:garbage] ? $data_weapons[data[:garbage]] : $data_weapons[STILILA::Syn_Garbage[1]])
    when :armor 
      target_item = $data_armors[id]
      garbage_item = (data[:garbage] ? $data_armors[data[:garbage]] : $data_armors[STILILA::Syn_Garbage[2]])
    end
    # 紀錄成果
    result_list = {:success=>[target_item, 0], :fail=>[garbage_item, 0]} 
    
    # 消耗素材和錢
    for mid in data[:mi].keys
      item = $data_items[mid]
      need = data[:mi][mid] * amount
      $game_party.lose_item(item, need)
    end
    for mid in data[:mw].keys
      item = $data_weapons[mid]
      need = data[:mw][mid] * amount
      $game_party.lose_item(item, need)
    end
    for mid in data[:ma].keys
      item = $data_armors[mid]
      need = data[:ma][mid] * amount
      $game_party.lose_item(item, need)
    end
    $game_party.lose_gold((data[:gold] || STILILA::Syn_Gold) * amount)
    @gold_window.refresh
    
    # 製作
    amount.times  { |n|
      if success > rand(100) # === 成功
        $game_party.gain_item(target_item, 1)
        result_list[:success][1] += 1
        # 未知flag消除
        if $game_party.synthesis_data[type][id] == 1
          $game_party.synthesis_data[type][id] = 2
        end
      else # === 失敗
        $game_party.gain_item(garbage_item, 1)
        result_list[:fail][1] += 1
      end
      # 提升熟練度
      if success < 100
        $game_party.synthesis_success[type][id] = [$game_party.synthesis_success[type][id] + (data[:upgrade] || STILILA::Syn_Upgrade), 100].min
        success = $game_party.synthesis_success[type][id] # 更新成功率
      end
    }
    
    # 播放完成音效
    Audio.se_play("Audio/SE/"+STILILA::Syn_SE[0],STILILA::Syn_SE[1],STILILA::Syn_SE[2])
    
    @command_window.refresh
    @command_window.select(@command_window.index)
    # 出現成果視窗
    @result_window.refresh(result_list)
    @result_window.visible = true
    @msg_window_showing = true # 等待Enter
    hide_right_window
  end
  
end



#==============================================================================
# ■ Window_SynthesisConfirm
#------------------------------------------------------------------------------
# 　確認選項視窗
#==============================================================================
class Window_SynthesisConfirm < Window_Command
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize
    super(Graphics.width/2-window_width/2, Graphics.height/2)
    self.back_opacity = 255
    self.active = false
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    return 80
  end
  #--------------------------------------------------------------------------
  # ● 获取显示行数
  #--------------------------------------------------------------------------
  def visible_line_number
    2
  end
  #--------------------------------------------------------------------------
  # ● 作成選項
  #--------------------------------------------------------------------------
  def make_command_list
    add_command(STILILA::Syn_Yes, :ok)
    add_command(STILILA::Syn_No, :cancel)
  end
  
end



#==============================================================================
# ■ Window_SynthesisCommand
#------------------------------------------------------------------------------
# 　選擇要合成的道具(配方)
#==============================================================================

class Window_SynthesisCommand < Window_Command
  #--------------------------------------------------------------------------
  # ● 變量公開
  #--------------------------------------------------------------------------
  attr_accessor :main_window
  attr_accessor :amount_window
  attr_reader :type
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize(help_h, gold_h)
    @type = :item
    @main_window = nil
    @amount_window = nil
    super(0, help_h)
    self.height = Graphics.height - help_h - gold_h 
    
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    return 160
  end
  #--------------------------------------------------------------------------
  # ● 获取显示行数
  #--------------------------------------------------------------------------
  def visible_line_number
    item_max
  end
  #--------------------------------------------------------------------------
  # ● 生成指令列表
  #--------------------------------------------------------------------------
  def make_command_list
    list = $game_party.synthesis_data[@type]
    o_list = STILILA::Syn_List[@type]
    list.each_key { |id|
      case @type
      when :item
        add_command(list[id] == 1 ? STILILA::Syn_UnknownName : (o_list[id][:name] || $data_items[id].name), id, true, list[id] == 1)
      when :weapon
        add_command(list[id] == 1 ? STILILA::Syn_UnknownName : (o_list[id][:name] || $data_weapons[id].name), id, true, list[id] == 1)
      when :armor
        add_command(list[id] == 1 ? STILILA::Syn_UnknownName : (o_list[id][:name] || $data_armors[id].name), id, true, list[id] == 1)
      end
    } 
  end
  
  #--------------------------------------------------------------------------
  # ● 列表添加配方名稱
  #--------------------------------------------------------------------------
  def change_type(type)
    @type = type
    refresh 
    select(0)
  end
  #--------------------------------------------------------------------------
  # ● 选择项目
  #--------------------------------------------------------------------------
  def select(index, amount = 1)
    super(index)
    return if @main_window == nil
    @main_window.refresh(@type, current_symbol, current_ext, current_data, amount)
    @amount_window.refresh(@type, current_symbol, current_data, (amount == 1))
  end
  #--------------------------------------------------------------------------
  # ● 生成窗口内容
  #--------------------------------------------------------------------------
  def create_contents
    contents.dispose
    if contents_width > 0 && contents_height > 0
      self.contents = Bitmap.new(contents_width, contents_height)
      contents.font.size = 18
    else
      self.contents = Bitmap.new(1, 1)
    end
  end
  
end


#==============================================================================
# ■ Window_SynthesisItem
#------------------------------------------------------------------------------
#    顯示道具基本資訊
#==============================================================================

class Window_SynthesisItem < Window_Base
  #--------------------------------------------------------------------------
  # ● 公開變量
  #--------------------------------------------------------------------------
  attr_reader   :item
  attr_accessor :info_window
  attr_accessor :mode
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize(x, y)
    super(x, y, window_width, window_height)
    @mode = 0
    contents.font.size = 18
    self.opacity = 0
    @item = nil
    @info_window = nil
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    Graphics.width - 160
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的高度
  #--------------------------------------------------------------------------
  def window_height
    fitting_height(6)
  end
  #--------------------------------------------------------------------------
  # ● 绘制带有控制符的文本内容
  #--------------------------------------------------------------------------
  def draw_text_ex(x, y, text)
  #  reset_font_settings
    text = convert_escape_characters(text)
    pos = {:x => x, :y => y, :new_x => x, :height => calc_line_height(text)}
    process_character(text.slice!(0, 1), text, pos) until text.empty?
  end
  #--------------------------------------------------------------------------
  # ● 绘制持有数
  #--------------------------------------------------------------------------
  def draw_possession(x, y, item)
    rect = Rect.new(x, y, contents.width, line_height)
    change_color(system_color)
    # 所持數量
    number = $game_party.item_number(item)
    # 空白數
    spacing = number.to_s.size
    draw_text(rect, Vocab::Possession + "　"+" "*(spacing), 2)
    change_color(normal_color)
    draw_text(rect, number, 2)
  end
  #--------------------------------------------------------------------------
  # ● 刷新
  #    type－:item、:weapon、:armor
  #    id－對象道具ID
  #    unknown－未知狀態
  #    exist－選項是否有東西(對應空清單)
  #    amount－製作數目
  #--------------------------------------------------------------------------
  def refresh(type, id, unknown, exist, amount = 1)
    contents.clear
    # 有選項才描繪項目
    if exist
      contents.font.size = 18
      draw_item(type, id, unknown, amount)
    else
      @info_window.clear_contents
    end
  end
  #--------------------------------------------------------------------------
  # ● 改變模式
  #--------------------------------------------------------------------------
  def change_mode
    if @mode == 1
      @mode = 0
    else
      @mode = 1
    end
  end
  #--------------------------------------------------------------------------
  # ● 绘制项目
  #--------------------------------------------------------------------------
  def draw_item(type, id, unknown, amount)
    if unknown
      draw_unknown_info
    else
      case type
      when :item   ; item = $data_items[id]
      when :weapon ; item = $data_weapons[id] 
      when :armor  ; item = $data_armors[id] 
      end
      @item = item # 紀錄
      draw_item_basic(item)
    end
    
    draw_cost(type, id, amount)
    
    # 繪製素材 / 素質
    case @mode
    when 0 ; @info_window.draw_matarial(type, id, amount)
    when 1 ; @info_window.draw_info(item, unknown)
    end
    

  end

  #--------------------------------------------------------------------------
  # ● 繪製未知道具資訊
  #--------------------------------------------------------------------------
  def draw_unknown_info
    draw_text_ex(4, 0, STILILA::Syn_UnknownHelpText)
  end
  #--------------------------------------------------------------------------
  # ● 繪製所有項目基本資訊
  #--------------------------------------------------------------------------
  def draw_item_basic(item)
    draw_icon(item.icon_index, 0, 0)
    draw_text(24, 0, contents.width, line_height, item.name)
    draw_possession(0, 0, item)
    draw_text_ex(4, 24, item.description) 
  end
  
  #--------------------------------------------------------------------------
  # ● 繪製消耗資訊
  #--------------------------------------------------------------------------
  def draw_cost(type, id, amount)
    # 獲取資料
    data = STILILA::Syn_List[type][id]
    
    y = 72
    y_plus = 24
    w = contents.width
    h = line_height
    
    # 合成費用
    change_color(system_color)
    gold = (data[:gold] || STILILA::Syn_Gold) * amount
    draw_text(0, y, w, h, STILILA::Syn_CostText+"　　　　", 2)
    change_color(normal_color)
    draw_text(0, y, w, h, gold, 2)
    y += y_plus
    
    # 分隔線
    color = normal_color
    color.alpha = 128
    contents.fill_rect(0, y+y_plus/4, contents_width, 2, color)
    y += y_plus/2

    # 素材、需求量、現有量文字
    if @mode == 0
      change_color(system_color)
      draw_text(4, y, w, h, STILILA::Syn_MaterialText)
      draw_text(0, y, w, h, STILILA::Syn_DemandText+"　"+STILILA::Syn_PossessionText, 2)
      change_color(normal_color)
    else
      change_color(system_color)
      contents.font.size = 20
      draw_text(0, y, w, h, STILILA::Syn_ParamText)
      change_color(normal_color)
    end
    
  end
  

end

#==============================================================================
# ■ Window_SynthesisInfo
#------------------------------------------------------------------------------
#    道具資訊(素材量、資訊)
#==============================================================================

class Window_SynthesisInfo < Window_Base
  #--------------------------------------------------------------------------
  # ● 變量公開
  #--------------------------------------------------------------------------
  attr_accessor :mode
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize(x, y)
    super(x, y, window_width, window_height(y))
    contents.font.size = 18
    self.opacity = 0
    @item = nil
    @mode = 0
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    Graphics.width - 160
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的高度
  #--------------------------------------------------------------------------
  def window_height(y)
    # 96 = help_window.h + gold_window.h
    Graphics.height - y - 96
  end
  #--------------------------------------------------------------------------
  # ● 清除內容(切換種類時使用)
  #--------------------------------------------------------------------------
  def clear_contents
    if @mode == 0
      create_contents
      @item = nil
    end
    
  end
  #--------------------------------------------------------------------------
  # ● 繪製所需素材
  #    type－:item、:weapon、:armor
  #    id－對象道具ID
  #    amount－製作數量
  #--------------------------------------------------------------------------
  def draw_matarial(type, id, amount)
    # 清除之前的內容
    contents.clear
    
    # 獲取資料
    data = STILILA::Syn_List[type][id]

    # 重新做成 contents 大小
    case type
    when :item   ; item = $data_items[id]
    when :weapon ; item = $data_weapons[id] 
    when :armor  ; item = $data_armors[id] 
    end

    if @item != item
      self.oy = 0
      self.contents.dispose
      h = ((data[:mi] ? data[:mi].length : 0)+(data[:mw] ? data[:mw].length : 0)+(data[:ma] ? data[:ma].length : 0))*24
      self.contents = Bitmap.new(contents_width, h)
      contents.font.size = 18
      @item = item
    end
    
    y = 0
    y_plus = 24
    w = contents_width
    h = line_height
    
    # 所需道具
    for id in data[:mi].keys
      item = $data_items[id]
      need = data[:mi][id] * amount
      now = $game_party.item_number(item)
      useable = (now >= need) # 材料不足時半透明
      change_color(normal_color, useable) 
      draw_icon(item.icon_index, 0, y, useable)
      draw_text(24, y, w, h, item.name)
      draw_text(0, y, w, h, need.to_s+"　"*(STILILA::Syn_PossessionText.size+1), 2)
      draw_text(0, y, w, h, now, 2)
      y += y_plus
    end
    # 所需武器
    for id in data[:mw].keys
      item = $data_weapons[id]
      need = data[:mw][id] * amount
      now = $game_party.item_number(item)
      useable = (now >= need) # 材料不足時半透明
      change_color(normal_color, useable) 
      draw_icon(item.icon_index, 0, y, useable)
      draw_text(24, y, w, h, item.name)
      draw_text(0, y, w, h, need.to_s+"　"*(STILILA::Syn_PossessionText.size+1), 2)
      draw_text(0, y, w, h, now, 2)
      y += y_plus
    end
    # 所需防具
    for id in data[:ma].keys
      item = $data_armors[id]
      need = data[:ma][id] * amount
      now = $game_party.item_number(item)
      useable = (now >= need) # 材料不足時半透明
      change_color(normal_color, useable) 
      draw_icon(item.icon_index, 0, y, useable)
      draw_text(24, y, w, h, item.name)
      draw_text(0, y, w, h, need.to_s+"　"*(STILILA::Syn_PossessionText.size+1), 2)
      draw_text(0, y, w, h, now, 2)
      y += y_plus
    end

    change_color(normal_color)
    
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
    self.oy = [self.oy + 4, [contents.height-window_height(self.y)+32, 0].max].min
  end
  
  #--------------------------------------------------------------------------
  # ● 繪製基本資訊(分歧用)
  #--------------------------------------------------------------------------
  def draw_info(item, unknown)
    # 清除之前的內容
    self.oy = 0
    self.contents.dispose
    self.contents = Bitmap.new(contents_width, line_height*4)
    contents.font.size = 18
    @item = nil
    
    return if unknown
    
    if item.is_a?(RPG::Item)
      draw_item_info(item)
    elsif item.is_a?(RPG::Weapon)
      draw_weapon_info(item)
    elsif item.is_a?(RPG::Armor)
      draw_armor_info(item)
    end
  end
  
  #--------------------------------------------------------------------------
  # ● 繪製道具基本資訊
  #--------------------------------------------------------------------------
  def draw_item_info(item)
  end
  #--------------------------------------------------------------------------
  # ● 繪製武器資訊
  #--------------------------------------------------------------------------
  def draw_weapon_info(item)
    half_w = contents_width/2
    
    change_color(system_color)
    draw_text(4, 0, half_w, line_height, Vocab::param(2))
    draw_text(4, line_height, half_w, line_height, Vocab::param(3))
    draw_text(4, line_height*2, half_w, line_height, Vocab::param(4))
    draw_text(4, line_height*3, half_w, line_height, Vocab::param(5))
    draw_text(half_w+4, 0, half_w, line_height, Vocab::param(6))
    draw_text(half_w+4, line_height, half_w, line_height, Vocab::param(7))
    draw_text(half_w+4, line_height*2, half_w, line_height, Vocab::param(0))
    draw_text(half_w+4, line_height*3, half_w, line_height, Vocab::param(1))

    change_color(normal_color)
    half_w -= 12
    draw_text(0, 0, half_w, line_height, item.params[2], 2)
    draw_text(0, line_height, half_w, line_height, item.params[3], 2)
    draw_text(0, line_height*2, half_w, line_height, item.params[4], 2)
    draw_text(0, line_height*3, half_w, line_height, item.params[5], 2)
    draw_text(half_w, 0, half_w, line_height, item.params[6], 2)
    draw_text(half_w, line_height, half_w, line_height, item.params[7], 2)
    draw_text(half_w, line_height*2, half_w, line_height, item.params[0], 2)
    draw_text(half_w, line_height*3, half_w, line_height, item.params[1], 2)
  end
  #--------------------------------------------------------------------------
  # ● 繪製防具資訊
  #--------------------------------------------------------------------------
  def draw_armor_info(item)
    half_w = window_width/2
    
    change_color(system_color)
    draw_text(0, 0, half_w, line_height, Vocab::param(2))
    draw_text(0, line_height, half_w, line_height, Vocab::param(3))
    draw_text(0, line_height*2, half_w, line_height, Vocab::param(4))
    draw_text(0, line_height*3, half_w, line_height, Vocab::param(5))
    draw_text(half_w, 0, half_w, line_height, Vocab::param(6))
    draw_text(half_w, line_height, half_w, line_height, Vocab::param(7))
    draw_text(half_w, line_height*2, half_w, line_height, Vocab::param(0))
    draw_text(half_w, line_height*3, half_w, line_height, Vocab::param(1))

    change_color(normal_color)
    half_w -= 12
    draw_text(0, 0, half_w, line_height, item.params[2], 2)
    draw_text(0, line_height, half_w, line_height, item.params[3], 2)
    draw_text(0, line_height*2, half_w, line_height, item.params[4], 2)
    draw_text(0, line_height*3, half_w, line_height, item.params[5], 2)
    draw_text(half_w, 0, half_w, line_height, item.params[6], 2)
    draw_text(half_w, line_height, half_w, line_height, item.params[7], 2)
    draw_text(half_w, line_height*2, half_w, line_height, item.params[0], 2)
    draw_text(half_w, line_height*3, half_w, line_height, item.params[1], 2)

  end
end




#==============================================================================
# ■ Window_SynthesisAmount
#------------------------------------------------------------------------------
# 　數量輸入視窗
#==============================================================================
class Window_SynthesisAmount < Window_Selectable
  #--------------------------------------------------------------------------
  # ● 變量公開
  #--------------------------------------------------------------------------
  attr_accessor :main_window
  attr_reader :amount
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize
    super(160, Graphics.height-96, Graphics.width-160, 48)
    self.active = false
    self.index = 0
    self.opacity = 0
    @amount = 1
    @main_window = nil
    @item = nil
    @item_type = :item
  end
  #--------------------------------------------------------------------------
  # ● 更新光标
  #--------------------------------------------------------------------------
  def update_cursor
    if @item && self.active
      cursor_rect.set(contents.width-72, 0, 48, item_height)
    else
      cursor_rect.empty
    end
  end
  #--------------------------------------------------------------------------
  # ● 获取项目数
  #--------------------------------------------------------------------------
  def item_max
    1
  end
  #--------------------------------------------------------------------------
  # ● 刷新
  #--------------------------------------------------------------------------
  def refresh(type, id, exist, amount_reset = false)
    contents.clear
    
    if !exist
      @item = nil
      update_cursor
      return 
    end
    
    @amount = 1 if amount_reset
    # 紀錄道具
    @item_type = type
    case type
    when :item   ; @item = $data_items[id]
    when :weapon ; @item = $data_weapons[id] 
    when :armor  ; @item = $data_armors[id] 
    end
    # 描繪成功率
    change_color(system_color)
    draw_text(0, 0, contents.width, line_height, STILILA::Syn_SuccessText)
    change_color(normal_color)
    draw_text(0, 0, contents.width, line_height, "　"*(STILILA::Syn_SuccessText.size) + $game_party.synthesis_success[type][id].to_s + "%")
    
    # 描繪製作數量
    change_color(system_color)
    draw_text(0, 0, contents.width, line_height, STILILA::Syn_AmountText+"《　　》", 2)
    change_color(normal_color)
    draw_text(0, 0, contents.width, line_height, @amount.to_s+"　", 2)
  end
  
  
  #--------------------------------------------------------------------------
  # ● 數量 +1
  #--------------------------------------------------------------------------
  def cursor_right(wrap = false)
    return if !@item
    @amount = [@amount+1, [$game_party.max_item_number(@item) - $game_party.item_number(@item),1].max].min
    refresh(@item_type, @item.id, true)
    
    unknown = $game_party.synthesis_data[@item_type][@item.id] == 1 
    @main_window.refresh(@item_type, @item.id, unknown, true, @amount)
  end
  #--------------------------------------------------------------------------
  # ● 數量 -1
  #--------------------------------------------------------------------------
  def cursor_left(wrap = false)
    return if !@item
    @amount = [@amount-1,1].max
    refresh(@item_type, @item.id, true)
    
    unknown = $game_party.synthesis_data[@item_type][@item.id] == 1 
    @main_window.refresh(@item_type, @item.id, unknown, true, @amount)
  end
  #--------------------------------------------------------------------------
  # ● 數量 +10
  #--------------------------------------------------------------------------
  def cursor_pagedown
    return if !@item
    @amount = [@amount+10, [$game_party.max_item_number(@item) - $game_party.item_number(@item), 1].max].min
    refresh(@item_type, @item.id, true)
    
    unknown = $game_party.synthesis_data[@item_type][@item.id] == 1 
    @main_window.refresh(@item_type, @item.id, unknown, true, @amount)
  end
  #--------------------------------------------------------------------------
  # ● 數量 -10
  #--------------------------------------------------------------------------
  def cursor_pageup
    return if !@item
    @amount = [@amount-10,1].max
    refresh(@item_type, @item.id, true)
    
    unknown = $game_party.synthesis_data[@item_type][@item.id] == 1
    @main_window.refresh(@item_type, @item.id, unknown, true, @amount)
  end
end

#==============================================================================
# ■ Window_SynthesisResult
#------------------------------------------------------------------------------
#    製作結果視窗
#==============================================================================
class Window_SynthesisResult < Window_Base
  
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  def initialize
    super(Graphics.width/2 - window_width/2, Graphics.height/2 - window_height/2, window_width, window_height) 
    self.back_opacity = 255
  end
  
  #--------------------------------------------------------------------------
  # ● 获取窗口的宽度
  #--------------------------------------------------------------------------
  def window_width
    320
  end
  #--------------------------------------------------------------------------
  # ● 获取窗口的高度
  #--------------------------------------------------------------------------
  def window_height
    fitting_height(4)
  end
  #--------------------------------------------------------------------------
  # ● 刷新
  #    list：製作結果
  #--------------------------------------------------------------------------
  def refresh(list)
    # 清除原內容
    contents.clear
    
    w = contents.width
    h = line_height
    
    # 「合成結果」文字
    draw_text(0, 0, w, h, STILILA::Syn_ResultText)
    
    # 分隔線
    color = normal_color
    color.alpha = 128
    contents.fill_rect(0, fitting_height(0)+line_height/2, contents_width, 2, color)
    
    # 成功和失敗道具取得數
    target = list[:success][0]
    garbage = list[:fail][0]
    
    line = 1
    if list[:success][1] > 0
      draw_icon(target.icon_index, 0, fitting_height(line))
      draw_text(24, fitting_height(line), w, h, target.name)
      draw_text(0, fitting_height(line), w, h, "× "+list[:success][1].to_s, 2)
      line += 1
    end
    
    if list[:fail][1] > 0
      draw_icon(garbage.icon_index, 0, fitting_height(line))
      draw_text(24, fitting_height(line), w, h, garbage.name)
      draw_text(0, fitting_height(line), w, h, "× "+list[:fail][1].to_s, 2)
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
  alias :stsyn_add_original_commands :add_original_commands
  def add_original_commands
    stsyn_add_original_commands
    if $game_switches[STILILA::Syn_MenuSwitch]
      add_command(STILILA::Syn_MenuName, :synthesis)
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
  alias :stsyn_start :start
  def start
    stsyn_start
    @command_window.set_handler(:synthesis,     method(:call_synthesis))
  end
  #--------------------------------------------------------------------------
  # ● 呼叫合成畫面
  #--------------------------------------------------------------------------
  def call_synthesis
    SceneManager.call(Scene_Synthesis)
  end
end  


#==============================================================================
# ■ Game_Temp
#------------------------------------------------------------------------------
# 　在没有存档的情况下，处理临时数据的类。本类的实例请参考 $game_temp 。
#==============================================================================
class Game_Temp
  #--------------------------------------------------------------------------
  # ● 定义实例变量
  #--------------------------------------------------------------------------
  attr_accessor :check_syn                # 確認合成配方模式
  #--------------------------------------------------------------------------
  # ● 初始化对象
  #--------------------------------------------------------------------------
  alias :stsyn_initialize :initialize
  def initialize
    stsyn_initialize
    @check_syn = false
  end
end
