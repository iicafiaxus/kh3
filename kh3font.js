kh3.font = {};

// フォントの定義
kh3.font.names = ["roman", "numeric", "italic", "italiccaps", "main", "bold", "boldroman", "boldnumeric", "bolditalic", "bolditaliccaps"];


kh3.font.munsonroman = {
	url: "https://iicafiaxus.github.io/kh3/fonts/Munson_Roman.css",
	name: "Munson Roman",
		/*
		This font is licensed under the SIL Open Font License, Version 1.1
		by 	http://pjmiller.deviantart.com/art/Munson-693769015
		*/
	weight: 300,
	style: "normal",
	magnitude: 0.8,
	offset: 0.15,
}


kh3.font.crimsontext = {
	url: "https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap",
	name: "Crimson Text",
	weight: 400,
	style: "normal",
	magnitude: 1.1,
	offset: 0.05,
}

kh3.font.notoserif = {
	url: "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400",
	name: "Noto Serif JP",
	weight: 400,
	style: "normal",
	magnitude: 1,
	offset: 0.0,
}

kh3.font.geneikoburi = {
	url: "https://iicafiaxus.github.io/kh3/fonts/GenEiKoburiMin6-R.css",
	name: "GenEi Koburi Mincho v6", 
			/*
			This font is licensed under the SIL Open Font License, Version 1.1
			by https://okoneya.jp/font/genei-koburimin.html
			*/	
	weight: 400,
	style: "normal",
	magnitude: 1.05,
	offset: 0.0,
}


kh3.font.oldstandard = {
	url: [
		"https://fonts.googleapis.com/css?family=Old+Standard+TT:400i",
		"https://iicafiaxus.github.io/kh3/fonts/GFSDidotItalic.css",
	].join(" "),
	name: [
		"Old Standard TT",
		"GFS Didot Italic", 
			/*
			This font is licensed under the SIL Open Font License, Version 1.1
			by https://www.greekfontsociety-gfs.gr/
			*/
	].join('", "'),
	weight: 400,
	style: "italic",
	magnitude: 1.1,
	offset: 0.1,
}

kh3.font.ibmplexitalic = {
	url: "https://fonts.googleapis.com/css?family=IBM+Plex+Serif:400i",
	name: "IBM Plex Serif",
	weight: 400,
	style: "italic",
	magnitude: 1.0,
	offset: 0.05,
}


kh3.font.notosansbold = {
	url: [
		"https://fonts.googleapis.com/css?family=Noto+Sans+JP:700&subset=japanese",
		"https://fonts.googleapis.com/css?family=Tienne:700&display=swap"
	].join(" "),
	name: "Noto Sans JP",
	weight: 700,
	style: "normal",
	magnitude: 1.00,
	offset: 0.0,
}

kh3.font.tienne = {
	url: [
		"https://fonts.googleapis.com/css?family=Noto+Sans+JP:700&subset=japanese",
		"https://fonts.googleapis.com/css?family=Tienne:700&display=swap"
	].join(" "),
	name: "Tienne" + '", "' + "Noto Sans JP",
	weight: 700,
	style: "normal",
	magnitude: 1.05,
	offset: 0.10,
}

kh3.font.vollkornbolditalic = {
	url: "https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@1,600&display=swap",
	name: "Vollkorn",
	weight: 600,
	style: "italic",
	magnitude: 1.15,
	offset: 0.15,
}

kh3.font.notoserifbolditalic = {
	url: "https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@1,700&display=swap",
	name: "Noto Serif",
	weight: 700,
	style: "italic",
	magnitude: 1.05,
	offset: 0.05,
}

kh3.font.mplus1p = {
	url: "https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@300;500",
	name: "M PLUS 1p",
	weight: 300,
	style: "normal",
	magnitude: 1.00,
	offset: 0.00,
}

kh3.font.mplus1pbold = {
	url: "https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@500",
	name: "M PLUS 1p",
	weight: 500,
	style: "normal",
	magnitude: 1.00,
	offset: 0.00,
}

kh3.font.mplus1pitalic = {
	url: "https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@300;500",
	name: "M PLUS 1p",
	weight: 300,
	style: "italic",
	magnitude: 1.00,
	offset: 0.00,
}

kh3.font.mplus1pbolditalic = {
	url: "https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@500",
	name: "M PLUS 1p",
	weight: 500,
	style: "italic",
	magnitude: 1.00,
	offset: 0.00,
}


kh3.font.roman = kh3.font.numeric = kh3.font.main = kh3.font.notoserif;
kh3.font.italiccaps = kh3.font.italic = kh3.font.oldstandard;
kh3.font.bold = kh3.font.notosansbold;
kh3.font.boldnumeric = kh3.font.boldroman = kh3.font.tienne;
kh3.font.bolditalic = kh3.font.bolditaliccaps = kh3.font.vollkornbolditalic;


kh3.font.sets = {
	"default": {
		main: kh3.font.main,
		roman: kh3.font.roman,
		numeric: kh3.font.numeric,
		italic: kh3.font.italic,
		italiccaps: kh3.font.italiccaps,
		bold: kh3.font.bold,
		boldroman: kh3.font.boldroman,
		boldnumeric: kh3.font.boldnumeric,
		bolditalic: kh3.font.bolditalic,
		bolditaliccaps: kh3.font.bolditalic
	},
	"standard1": {
		main: kh3.font.notoserif,
		roman: kh3.font.notoserif,
		numeric: kh3.font.notoserif,
		italic: kh3.font.oldstandard,
		italiccaps: kh3.font.oldstandard,
		bold: kh3.font.notosandbold,
		boldroman: kh3.font.tienne,
		boldnumeric: kh3.font.tienne,
		bolditalic: kh3.font.vollkornbolditalic,
		bolditaliccaps: kh3.font.vollkornbolditalic
	},
	"standard2": {
		main: kh3.font.geneikoburi,
		roman: kh3.font.geneikoburi,
		numeric: kh3.font.geneikoburi,
		italic: kh3.font.oldstandard,
		italiccaps: kh3.font.oldstandard,
		bold: kh3.font.notosansbold,
		boldroman: kh3.font.tienne,
		boldnumeric: kh3.font.tienne,
		bolditalic: kh3.font.vollkornbolditalic,
		bolditaliccaps: kh3.font.vollkornbolditalic
	},
	"mplus": {
		main: kh3.font.mplus1p,
		roman: kh3.font.mplus1p,
		numeric: kh3.font.mplus1p,
		italic: kh3.font.mplus1p,
		italiccaps: kh3.font.mplus1p,
		bold: kh3.font.mplus1pbold,
		boldroman: kh3.font.mplus1pbold,
		boldnumeric: kh3.font.mplus1pbold,
		bolditalic: kh3.font.mplus1pbold,
		bolditaliccaps: kh3.font.mplus1pbold
	}

};

// ----------

kh3.font.waitcount = 0;

// フォントの読み込み待ちをする
// https://hail2u.net/blog/webdesign/detect-font-loading.html
// MEMO: kh3.font.reset と重複しており整理するほうがよさそう
kh3.font.load = function(fontName, index){
	if( ! index) index = "default";

	var font = kh3.font.sets[index][fontName];
	if(font === void 0){
		return;
	}
	
	var head = document.getElementsByTagName("head")[0];
	var style = document.getElementById("font-" + fontName);
	if( ! style){
		style = document.createElement("style");
		style.id = "font-" + fontName;
		head.appendChild(style);
	}

	var s = "";
	for(url of font.url.split(" ")) s += "@import url('" + url + "');";
	s += "span." + fontName + "{";
	s += "\t" + "font-family: " + '"' + font.name + '"' + ", serif;";
	s += "\t" + "font-weight: " + font.weight + ";";
	s += "\t" + "font-style: " + font.style + ";";
	s += "}";
	style.innerHTML = s;
	this.waitcount += 1;

	
	var tester = document.createElement('span');
	tester.style.fontFamily = '"' + font.name + '", "Adobe Blank"';
	tester.style.fontWeight = font.weight;
	tester.style.fontStyle = font.style;
	tester.style.position = 'absolute';
	tester.style.top = '-100px';
	tester.style.outline = '1px dashed blue';
	tester.appendChild(document.createTextNode('a'));
	document.body.appendChild(tester);
	var timerId;
	function checkWidth(){
		if (tester.offsetWidth > 0){
			clearInterval(timerId);
			kh3.font.waitcount -= 1;
			tester.parentNode.removeChild(tester);
		}
	}
  timerId = setInterval(checkWidth, 500);
}

kh3.font.reset = function(size, index){
	if( ! index) index = "default";
	for(var i = 0; i < this.names.length; i ++){
		var name = this.names[i];
		var font = this.sets[index][name];
		var style = document.getElementById("font-" + name);
		if(! style) continue;
		var s = "";
		
		for(url of font.url.split(" ")) s += "@import url('" + url + "');";
		
		s += "span." + name + "{";
		s += "\t" + "font-family: " + '"' + font.name + '"' + ", serif;";
		s += "\t" + "font-weight: " + font.weight + ";";
		s += "\t" + "font-style: " + font.style + ";";
		s += "\t" + "font-size: " + (size * font.magnitude) + "mm;";
		s += "}";

		s += "#allH ." + name + "{";
		s += "\t" + "padding-top: " + (size * font.offset) + "mm;";
		s += "}";
		s += "#allV ." + name + ":not(.rotated){";
		s += "\t" + "padding-right: " + (size * font.offset / 2) + "mm;";
		s += "}";
		s += "#allV ." + name + ".rotated{";
		s += "\t" + "padding-top: " + (size * font.offset / 2) + "mm;";
		s += "}";
		
		s += "span." + name + ".sub, span." + name + ".sup{";
		s += "\t" + "font-size: " + (size * 0.6 * font.magnitude) + "mm;";
		s += "}";
		
		s += "span." + name + ".small{";
		s += "\t" + "font-size: " + (size * 0.8 * font.magnitude) + "mm;";
		s += "}";
		
		s += "span." + name + ".large{";
		s += "\t" + "font-size: " + (size * 1.2 * font.magnitude) + "mm;";
		s += "}";
		
		
		style.innerHTML = s;
	}
}

