// kh3.js から必ず呼び出される

/*
	ハイフネーション（内容はスタブ）
*/

kh3.hyphenator = {};

kh3.hyphenator.words = {
	// ローカルでのテスト用にいくつか入れてある
	"international": "in­ter­nat­ion­al",
	"internationally": "in­ter­nat­ion­al­ly",
	"socialization": "so­cial­i­za­tion",
	"apostrophe": "a­pos­tro­phe"
};
kh3.hyphenator.softHyphen = "­"; // unicode 00AD

//kh3.hyphenator.url = "https://www.gutenberg.org/files/3204/files/mhyph.txt";
kh3.hyphenator.url = "https://iicafiaxus.github.io/kh3/resources/mhyph.txt";
// Moby Hyphenation List by Grady Ward (Public Domain)
// modified (soft hyphen)

kh3.hyphenator.load = async function(text){
	let lines = text.split("\r\n");
	for(line of lines){
		let words = line.split(" ");
		for(word of words){
			let key = word.split(kh3.hyphenator.softHyphen).join("").toLowerCase();
			kh3.hyphenator.words[key] = word;
		}
	}
}

fetch(kh3.hyphenator.url, {mode: "no-cors"}).then(
	response => response.text()
).then(
	text => kh3.hyphenator.load(text)
);


kh3.hyphenate = function(text){
	let res = [[text]];

	let subs = text.split("-");
	if(subs.length > 1){
		for(var i = subs.length - 1; i >= 0; i --){
			let prefix = subs.slice(0, i).join("-"), suffix = subs.slice(i + 1).join("-");
			for(subre of kh3.hyphenate(subs[i])){
				let a = subre[0], b = subre[1];
				if(prefix != "") a = prefix + "-" + a;
				if( ! b){
					if(suffix == "") continue;
					a += "-";
					b = "";
				}
				if(b != "" && suffix != "") b = b + "-" + suffix;
				else b = b + suffix;
				res.push([a, b]);
			}
		}
		return res;
	}

	if( ! kh3.setting.hyphenate) return res;

	let key = text.
		toLowerCase().
		replace(/[\,\.\?\!]$/g, "");
	let word = key;
	for(rule of kh3.hyphenator.rules){
		let newkey = key.replace(rule[0], rule[1]);
		if(kh3.hyphenator.words[newkey]){
			word = kh3.hyphenator.words[newkey] + rule[2];
			break;
		}
	}
	let syllables = word.split(kh3.hyphenator.softHyphen);
	let poses = [];
	var pos = 0;
	for(s of syllables) poses.push(pos += s.length);
	for(var i = poses.length - 2; i >= 0; i --) res.push(
		[text.slice(0, poses[i]) + "-", text.slice(poses[i])]
	);

	return res;
}

// 語尾変化を吸収するルール（仮）
kh3.hyphenator.rules = [
	[/^(.*)$/, "$1", ""],
	[/^(.*)ly$/, "$1", kh3.hyphenator.softHyphen + "ly"],
	[/^(.*)al$/, "$1", kh3.hyphenator.softHyphen + "al"],
	[/^(.*)ic$/, "$1", kh3.hyphenator.softHyphen + "ic"],
	[/^(.*)ical$/, "$1", kh3.hyphenator.softHyphen + "ic" + kh3.hyphenator.softHyphen + "al"],
	[/^(.*)ally$/, "$1", kh3.hyphenator.softHyphen + "al" + kh3.hyphenator.softHyphen + "ly"],
	[/^(.*)ically$/, "$1", kh3.hyphenator.softHyphen + "ic" + kh3.hyphenator.softHyphen + "al" + kh3.hyphenator.softHyphen + "ly"],
	[/^(.*)ies$/, "$1y", "es"],
	[/^(.*)ied$/, "$1y", "ed"],
	[/^(.*)ings?$/, "$1", kh3.hyphenator.softHyphen + "ing"],
	[/^(.*)ings?$/, "$1e", "ng"], // 本当はingの前にもハイフンが入る
	[/^(.*)(.)\2ings?$/, "$1$2", kh3.hyphenator.softHyphen + "_ing"],
	[/^(.*).$/, "$1", "_"],
	[/^(.*)..$/, "$1", "__"],
];