// kh3.js から必ず呼び出される

// 文字クラスみたいなもの (暫定)
kh3.letters = {
	empty: /^$/,
	any: /.*/,
	control: /^$/,
	alpha: /[A-Za-zα-ωΑ-Ωﬃﬄﬀﬁﬂ’]/,
	alphanumeric: /[A-Za-zα-ωΑ-Ωﬃﬄﬀﬁﬂ’0-9\+\−]/,
	numeric: /[0-9\+\−]/,
	binary: /[\+\−]/,
	mark: /√/,
	parstart: /[\(\{\[“]/,
	parend: /[\)\}\]”]/,
	latinfollower: /[,\.;:\?!\)\}\]\|”]/,
	cjkfollower: /[、。，．？！：；）’］】」』〉》〕〟]/,
	cjkdrop: /[？！]/,
	cjkhwfollower: /[、。，．）］】」』〉》〕〟]/,
	cjkhwpunct: /[、。，．）’］】」』〉》〕〟（‘“［【「『〈《〔〝]/,
	follower: /[,\.;:\?!\)\}\]\|、。，．？！：；）’”］】」』〉》〕〟]/,
	latinleader: /[\(\{\[\|“]/,
	cjkleader: /[（‘［【「『〈《〔〝]/,
	cjkhwleader: /[（‘［【「『〈《〔〝]/,
	leader: /[\(\{\[\|（‘“［【「『〈《〔〝]/,
	cjkcenter: /[・]/,
	cjkpunct: /[、。，．？！：；％）’”］】」』〉》〕〟（‘“［【「『〈《〔〝]/,
	comma: /[,;:]/,
	period: /[\.\?!]/,
	equal: /[=<>≦≧＜＞]/,
	linesep: /\n/,
};

// アキの量のルール
kh3.marginRules = [
	["linesep", "cjkleader", -0.5 * kh3.setting.zw],
	// ["linesep", "alphanumeric", 0.0625 * kh3.setting.zw],
		// 和文のときに使うルールだが欧文で具合が悪いので一旦消しておく
	["linesep", "any", 0],
	["cjkhwfollower", "linesep", -0.5 * kh3.setting.zw],
	// ["alphanumeric", "linesep", 0.125 * kh3.setting.zw],
	["any", "linesep", 0],
	["empty", "any", 0],
	["empty", "empty", 0],
	["any", "empty", 0],
	["binary", "any", kh3.setting.zw / 3],
	["any", "binary", kh3.setting.zw / 3],
	["alphanumeric", "alphanumeric", kh3.setting.zw / 3],
	["comma", "alphanumeric", kh3.setting.zw / 2],
	["period", "alphanumeric", kh3.setting.zw],
	["equal", "any", kh3.setting.zw / 2],
	["any", "equal", kh3.setting.zw / 2],
	["comma", "parstart", kh3.setting.zw / 1],
	["period", "parstart", kh3.setting.zw / 1],
	["parend", "alphanumeric", kh3.setting.zw / 2],
	["alphanumeric", "parstart", kh3.setting.zw / 2],
	["alphanumeric", "mark", 0],
	["cjkfollower", "alphanumeric", 0],
	["alphanumeric", "cjkleader", 0],
	["cjkleader", "alphanumeric", 0],
	["alphanumeric", "cjkfollower", 0],
	["cjkcenter", "alphanumeric", kh3.setting.zw / 8],
	["alphanumeric", "cjkcenter", kh3.setting.zw / 8],
	["leader", "alphanumeric", kh3.setting.zw / 8],
	["alphanumeric", "follower", kh3.setting.zw / 8],
	["alphanumeric", "latinleader", kh3.setting.zw / 8],
	["alphanumeric", "any", kh3.setting.zw / 4],
	["any", "alphanumeric", kh3.setting.zw / 4],
	["cjkhwfollower", "cjkhwleader", -kh3.setting.zw / 2],
	["cjkhwfollower", "cjkpunct", -kh3.setting.zw / 2],
	["cjkcenter", "cjkhwleader", -kh3.setting.zw  / 4],
	["cjkhwfollower", "cjkcenter", -kh3.setting.zw / 4],
	["cjkdrop", "cjkpunct", 0],
	["cjkdrop", "any", kh3.setting.zw],
	["cjkpunct", "cjkhwleader", -kh3.setting.zw / 2],
	["cjkfollower", "any", 0],
	["any", "cjkleader", 0],
	["follower", "any", kh3.setting.zw / 4],
	["any", "leader", kh3.setting.zw / 4],
	["any", "any", 0]
];

// 均等割の係数のルール
kh3.sepratioRules = [
	["empty", "any", 0],
	["any", "empty", 0],
	["linesep", "any", 0],
	["any", "linesep", 0],
	["any", "cjkfollower", 0.2],
	["any", "any", 1],
];


// 実際に表示する文字に変換
kh3.toDisplayText = function(text){

	// 合字
	text = text.replace(/ffi/g, "ﬃ");
	text = text.replace(/ffl/g, "ﬄ");
	text = text.replace(/ff/g, "ﬀ");
	text = text.replace(/fi/g, "ﬁ");
	text = text.replace(/fl/g, "ﬂ");
	
	// 句読点の修正
	if(kh3.setting.correctPunct && this.char){
		if(kh3.setting.isVertical) this.char = this.char.replace("，", "、");
		else this.char = this.char.replace("、", "，");
	}

	return text;
}
