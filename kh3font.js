kh3.font = {};

// フォントの定義
kh3.font.names = ["roman", "numeric", "italic", "italiccaps", "main", "bold", "bolditalic", "bolditaliccaps"];


kh3.font.roman = {
	url: "https://fonts.googleapis.com/css?family=Yrsa:300",
	name: "Yrsa",
	weight: 300,
	style: "normal",
	magnitude: 1.2,
	offset: 0.15,
}

// Neuton
/*
kh3.font.numeric = {
	url: "https://fonts.googleapis.com/css?family=IBM+Plex+Serif:400",
	name: "IBM Plex Serif",
	weight: 400,
	style: "normal",
	magnitude: 1.0,
	offset: 0.05,
}
*/
kh3.font.numeric = {
	url: "https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap",
	name: "Crimson Text",
	weight: 400,
	style: "normal",
	magnitude: 1.1,
	offset: 0.05,
}

kh3.font.main = {
	url: "https://fonts.googleapis.com/css?family=Noto+Serif+JP:400,800&subset=japanese",
	name: "Noto Serif JP",
	weight: 400,
	style: "normal",
	magnitude: 1.0,
	offset: 0.0,
}

//kh3.font.roman = kh3.font.numeric;
kh3.font.roman = kh3.font.numeric = kh3.font.main;

kh3.font.italic = {
	url: [
		"https://fonts.googleapis.com/css?family=Old+Standard+TT:400i",
		"https://fonts.googleapis.com/css2?family=EB+Garamond:ital@1&display=swap",
		"https://fonts.googleapis.com/css2?family=Alegreya:ital@1&display=swap",
	].join(" "),
	name: ["Old Standard TT", "EB Garamond"].join('", "'),
	weight: 400,
	style: "italic",
	magnitude: 1.1,
	offset: 0.15,
}

kh3.font.italiccaps = {
	url: "https://fonts.googleapis.com/css?family=IBM+Plex+Serif:400i",
	name: "IBM Plex Serif",
	weight: 400,
	style: "italic",
	magnitude: 1.0,
	offset: 0.05,
}

kh3.font.bold = {
	url: "https://fonts.googleapis.com/css?family=Noto+Sans+JP:700&subset=japanese https://fonts.googleapis.com/css?family=Tienne:700&display=swap",
	name: "Tienne" + '", "' + "Noto Sans JP",
	weight: 700,
	style: "normal",
	magnitude: 1.05,
	offset: 0.15,
}

kh3.font.bolditalic = {
	url: "https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@1,600&display=swap",//"https://fonts.googleapis.com/css2?family=Volkhov:ital,wght@1,700&display=swap",//"https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,700&display=swap",
	name: "Vollkorn",
	weight: 600,
	style: "italic",
	magnitude: 1.15,
	offset: 0.2,
}

kh3.font.bolditaliccaps = {
	url: "https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@1,700&display=swap",
	name: "Noto Serif",
	weight: 700,
	style: "italic",
	magnitude: 1.05,
	offset: 0.05,
}

// ----------

kh3.font.waitcount = 0;

// フォントの読み込み待ちをする
// https://hail2u.net/blog/webdesign/detect-font-loading.html
kh3.font.load = function(fontName){
	var font = kh3.font[fontName];
	if(font === void 0){
		return;
	}
	
	var head = document.getElementsByTagName("head")[0];
	var style = document.getElementById("font-" + fontName);
	if(! style){
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

kh3.font.reset = function(size){
	for(var i = 0; i < this.names.length; i ++){
		var name = this.names[i];
		var font = this[name];
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
		s += "\t" + "font-size: " + (size * 0.7 * font.magnitude) + "mm;";
		s += "}";
		
		
		style.innerHTML = s;
	}
}

