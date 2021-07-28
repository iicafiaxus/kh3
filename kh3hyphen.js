// kh3.js から必ず呼び出される

/*
	ハイフネーション（内容はスタブ）
*/

kh3.hyphenator = {};

//kh3.hyphenator.url = "https://www.gutenberg.org/files/3204/files/mhyph.txt";
kh3.hyphenator.url = "https://iicafiaxus.github.io/kh3/resources/mhyph.txt";
// Moby Hyphenation List by Grady Ward (Public Domain)

kh3.hyphenator.load = async function(text){
	let lines = text.split("\n");
	kh3.hyphenator.lines = lines;
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

	return res;
}