// kh3.js から必ず呼び出される

/*
	ハイフネーション（内容はスタブ）
*/

kh3.hyphenator = {};

kh3.hyphenator.words = {
	// ローカルでのテスト用にいくつか入れてある
	"international": "in­ter­nat­ion­al",
	"internationally": "in­ter­nat­ion­al­ly",
	"socialization": "so­cial­i­za­tion"
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
	for(var i = text.length - 2; i >= 1; i --){
		if(text.charAt(i) == "-") res.push([text.slice(0, i + 1), text.slice(i + 1)]);
	}

	if( ! kh3.setting.hyphenate) return res;

	let key = text.
		toLowerCase().
		replace(/[\,\.\?\!]$/g, "");
	let word = kh3.hyphenator.words[key] || 
		kh3.hyphenator.words[key.slice(0, key.length - 1)] ||
		kh3.hyphenator.words[key.slice(0, key.length - 2)] ||
		key;
	let syllables = word.split(kh3.hyphenator.softHyphen);
	let poses = [];
	var pos = 0;
	for(s of syllables) poses.push(pos += s.length);
	for(var i = poses.length - 2; i >= 0; i --) res.push(
		[text.slice(0, poses[i]) + "-", text.slice(poses[i])]
	);

	return res;
}