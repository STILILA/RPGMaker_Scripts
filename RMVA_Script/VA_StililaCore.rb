#encoding:utf-8
#==============================================================================
# ■ STILILA_Config
#------------------------------------------------------------------------------
#    共通存檔用
#==============================================================================
class STILILA_Config
  #--------------------------------------------------------------------------
  # ● 初始化物件
  #--------------------------------------------------------------------------
  def initialize
  end
  #--------------------------------------------------------------------------
  # ● 儲存變量
  #--------------------------------------------------------------------------    
  def system_save
    if !$stilila_config
      p "$stilila_config尚未生成，暫無法存檔"
      return 
    end
    save_data($stilila_config, "Save/stilila_config.rvdata2")
    p "$stilila_config存檔完畢"
  end 
end

class << SceneManager
  #--------------------------------------------------------------------------
  # ● VA一切的開始
  #--------------------------------------------------------------------------
  alias :stilila_run :run
  def run
    # 讀取公共存檔
    if FileTest.exist?("Save/stilila_config.rvdata2")
      $stilila_config = load_data("Save/stilila_config.rvdata2")
    else # 沒有檔案的情況下，重新建立
      Dir::mkdir("Save") unless Dir.exist?("Save")
      $stilila_config = STILILA_Config.new
      $stilila_config.system_save
    end
    # 原處理
    stilila_run
  end
end