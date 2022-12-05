//=============================================================================
// 自訂普攻&防禦 v1.0
// 最後更新：2018/05/20
// http://home.gamer.com.tw/homeindex.php?owner=qootm2
//=============================================================================
/*:
 * @plugindesc 自訂普攻&防禦 v1.0
 * @author STILILA
 *
 
 * @help 
 *
 * ＜使用法＞
 *  在資料庫"角色"或"職業"的註解欄加入：
 *  <AttackID:n>    // 普攻使用 n 號技能 
 *  <GuardID:n>     // 防禦使用 n 號技能
 *
 * ※角色和職業同時設定的情況下，職業的設定優先
 
 
 */
 
(function() {	

Game_Actor.prototype.attackSkillId = function() {
	var atkID = 0;
	if (this.actor().meta['AttackID']) {atkID = this.actor().meta['AttackID']}
	if (this.currentClass().meta['AttackID']) {atkID = this.currentClass().meta['AttackID']}
	if (atkID) {
		return atkID
	} else {
		return Game_BattlerBase.prototype.attackSkillId.call(this)
	}
};

Game_Actor.prototype.guardSkillId = function() {
	var grdID = 0;
	if (this.actor().meta['GuardID']) {grdID = this.actor().meta['GuardID']}
	if (this.currentClass().meta['GuardID']) {grdID = this.currentClass().meta['GuardID']}
	if (grdID) {
		return grdID
	} else {
		return Game_BattlerBase.prototype.guardSkillId.call(this)
	}
};


})();
