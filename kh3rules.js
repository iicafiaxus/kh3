// kh3.js から必ず呼び出される

// 文字クラスみたいなもの (暫定)
kh3.letters = {
	empty: /^$/,
	any: /.*/,
	control: /^$/,
	alpha: /[A-Za-zﬃﬄﬀﬁﬂ]/,
	alphanumeric: /[A-Za-zﬃﬄﬀﬁﬂ0-9\+−]/,
	numeric: /[0-9\+−]/,
	binary: /[\+−]/,
	latinfollower: /[,\.;:\?!\)\}\]\|]/,
	cjkfollower: /[、。，．？！：；）’”］】」』〉》〕〟]/,
	cjkdrop: /[？！]/,
	cjkhwfollower: /[、。，．）’”］】」』〉》〕〟]/,
	cjkhwpunct: /[、。，．）’”］】」』〉》〕〟（‘“［【「『〈《〔〝]/,
	follower: /[,\.;:\?!\)\}\]\|、。，．？！：；）’”］】」』〉》〕〟]/,
	latinleader: /[\(\{\[\|]/,
	cjkleader: /[（‘“［【「『〈《〔〝]/,
	cjkhwleader: /[（‘“［【「『〈《〔〝]/,
	leader: /[\(\{\[\|（‘“［【「『〈《〔〝]/,
	cjkpunct: /[、。，．？！：；％）’”］】」』〉》〕〟（‘“［【「『〈《〔〝]/,
	comma: /,/,
	period: /\./,
	equal: /=/,
	linesep: /\n/,
};

// アキの量のルール
kh3.marginRules = [
	["linesep", "cjkleader", -0.5 * kh3.setting.zw],
	["linesep", "any", 0],
	["cjkhwfollower", "linesep", -0.5 * kh3.setting.zw],
	["any", "linesep", 0],
	["empty", "any", 0],
	["empty", "empty", 0],
//	["control", "any", 0],
//	["any", "control", 0],
	["any", "empty", 0],
	["binary", "any", kh3.setting.zw / 3],
	["any", "binary", kh3.setting.zw / 3],
	["alphanumeric", "alphanumeric", kh3.setting.zw / 3],
	["comma", "alphanumeric", kh3.setting.zw / 2],
	["period", "alphanumeric", kh3.setting.zw],
	["equal", "any", kh3.setting.zw / 2],
	["any", "equal", kh3.setting.zw / 2],
	["cjkfollower", "alphanumeric", 0],
	["alphanumeric", "cjkleader", 0],
	["cjkleader", "alphanumeric", 0],
	["alphanumeric", "cjkfollower", 0],
	["leader", "alphanumeric", kh3.setting.zw / 8],
	["alphanumeric", "follower", kh3.setting.zw / 8],
	["alphanumeric", "latinleader", kh3.setting.zw / 8],
	["alphanumeric", "any", kh3.setting.zw / 4],
	["any", "alphanumeric", kh3.setting.zw / 4],
	["cjkhwfollower", "cjkhwleader", -kh3.setting.zw / 2],
	["cjkhwfollower", "cjkpunct", -kh3.setting.zw / 2],
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
	["any", "cjkfollower", 0.2],
	["any", "any", 1],
];

