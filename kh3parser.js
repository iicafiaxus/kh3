//alert("Loading Parsers.");

// テキストの前処理
// この関数は定義を上書きしている
kh3.preprocess = function(text){

	if(! text) return "";
	
	// ルビ
	var rubyindex = 1;
	var rubypreprocess = function(mains, rubys){
		var res = "";
		for(var i = 0; i < mains.length; i ++){
			res += "{[" + mains[i] + "]" + rubys[i] + "]" + rubyindex + "}";
		}
		rubyindex += 1;
		return res;
	}
	text = text.replace(/\{=([^\}]*)\}/g, "{[$1]}");
	text = text.replace(/(.)\{\[([^ \]]*)\]\}/g, 
			function(match, p1, p2){ return rubypreprocess([p1], [p2]); });
	text = text.replace(/(.)(.)\{\[([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4){ return rubypreprocess([p1, p2], [p3, p4]); });
	text = text.replace(/(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6){ return rubypreprocess([p1, p2, p3], [p4, p5, p6]); });
	text = text.replace(/(.)(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6, p7, p8){ return rubypreprocess([p1, p2, p3, p4], [p5, p6, p7, p8]); });
	text = text.replace(/(.)(.)(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10){ return rubypreprocess([p1, p2, p3, p4, p5], [p6, p7, p8, p9, p10]); });
	text = text.replace(/(.)(.)(.)(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12){ return rubypreprocess([p1, p2, p3, p4, p5, p6], [p7, p8, p9, p10, p11, p12]); });

	// 下付き・上付きを新方式に変換
	text = text.replace(/(_(\/?[A-Za-zα-ωΑ-Ω]+|[0-9]+|.))+(?!\/?[A-Za-zα-ωΑ-Ω]+|[0-9]+)/g, x => "{!index}" + x.split("_").join(" ") + "{!}");
	text = text.replace(/(_(\/?[A-Za-zα-ωΑ-Ω]+|[0-9]+|.))+/g, x => "{!index}" + x.split("_").join(" ") + "{!}{:pos::zwsp}");
	text = text.replace(/(\^(\/?[A-Za-zα-ωΑ-Ω]+|[0-9]+|.))+(?!\/?[A-Za-zα-ωΑ-Ω]+|[0-9]+)/g, x => "{!index:sup}" + x.split("^").join(" ") + "{!}");
	text = text.replace(/(\^(\/?[A-Za-zα-ωΑ-Ω]+|[0-9]+|.))+/g, x => "{!index:sup}" + x.split("^").join(" ") + "{!}{:pos::zwsp}");

	// 下付きイタリック・上付きイタリック
	text = text.replace(/ _\/([A-Za-zα-ωΑ-Ω]+) /g, "{:pos:sub}{:font:italic}$1{:font:}{:pos:}");
	text = text.replace(/ _\/([A-Za-zα-ωΑ-Ω]+)/g, "{:pos:sub}{:font:italic}$1{:font:}{:pos::zwsp}");
	text = text.replace(/_\/([A-Za-zα-ωΑ-Ω]+) /g, "{:pos:sub:zwsp}{:font:italic}$1{:font:}{:pos:}");
	text = text.replace(/_\/([A-Za-zα-ωΑ-Ω]+)/g, "{:pos:sub:zwsp}{:font:italic}$1{:font:}{:pos::zwsp}");
	text = text.replace(/ \^\/([A-Za-zα-ωΑ-Ω]+) /g, "{:pos:sup}{:font:italic}$1{:font:}{:pos:}");
	text = text.replace(/ \^\/([A-Za-zα-ωΑ-Ω]+)/g, "{:pos:sup}{:font:italic}$1{:font:}{:pos::zwsp}");
	text = text.replace(/\^\/([A-Za-zα-ωΑ-Ω]+) /g, "{:pos:sup:zwsp}{:font:italic}$1{:font:}{:pos:}");
	text = text.replace(/\^\/([A-Za-zα-ωΑ-Ω]+)/g, "{:pos:sup:zwsp}{:font:italic}$1{:font:}{:pos::zwsp}");
	
	// イタリック
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\)\+−])\/([A-Za-zα-ωΑ-Ω]+) /g, "$1{:font:italic:zwsp}$2{:font:} ");
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\)\+−])\/([A-Za-zα-ωΑ-Ω]+)([\(\-\.,\/])/g, "$1{:font:italic:zwsp}$2{:font::zwsp}$3");
	text = text.replace(/ \/([A-Za-zα-ωΑ-Ω]+) /g, " {:font:italic}$1{:font:}");
	text = text.replace(/ \/([A-Za-zα-ωΑ-Ω]+)([\(\-\.,\/])/g, " {:font:italic}$1{:font::zwsp}$2");
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\)\+−])\/([A-Za-zα-ωΑ-Ω]+)([\(\-\.,\/])/g, " $1{:font:italic:zwsp}$2{:font::zwsp}$3");
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\)\+−])\/([A-Za-zα-ωΑ-Ω]+)/g, "$1{:font:italic:zwsp}$2{:font:}");
	text = text.replace(/\/([A-Za-zα-ωΑ-Ω]+)([\(\-\.,\/])/g, " {:font:italic}$1{:font::zwsp}$2");
	text = text.replace(/\/([A-Za-zα-ωΑ-Ω]+)/g, "{:font:italic}$1{:font:}");
	
	text = text.replace(/\{:font:italic\}([A-ZΑ-Ω])/g, "{:font:italiccaps}$1");
	text = text.replace(/\{:font:italic:zwsp\}([A-ZΑ-Ω])/g, "{:font:italiccaps:zwsp}$1");
	
//	text = text.replace(/\/([A-Za-zα-ωΑ-Ω]+)/g, "{:font:italic}$1{:font:}");
	
	
	// 下付き・上付き
	text = text.replace(/_([0-9]+|[A-Za-zα-ωΑ-Ω]+) /g, " {:pos:sub:zwsp}$1{:pos:}");
	text = text.replace(/_([0-9]+|[A-Za-zα-ωΑ-Ω]+)/g, " {:pos:sub:zwsp}$1{:pos::zwsp}");
	text = text.replace(/\^([0-9]+|[A-Za-zα-ωΑ-Ω]+) /g, " {:pos:sup:zwsp}$1{:pos:}");
	text = text.replace(/\^([0-9]+|[A-Za-zα-ωΑ-Ω]+)/g, " {:pos:sup:zwsp}$1{:pos::zwsp}");
	text = text.replace(/_(.) /g, " {:pos:sub:zwsp}$1{:pos:}");
	text = text.replace(/_(.)/g, " {:pos:sub:zwsp}$1{:pos::zwsp}");
	text = text.replace(/\^(.) /g, " {:pos:sup:zwsp}$1{:pos:}");
	text = text.replace(/\^(.)/g, " {:pos:sup:zwsp}$1{:pos::zwsp}");
	
	// ボールド
	text = text.replace(/\*([^\n\*]*)\*([\-\.,\/])/g, "{:font:bold}$1{:font:zwsp}$2");
	text = text.replace(/\*([^\n\*]*)\*/g, "{:font:bold}$1{:font}");
	text = text.replace(/\{:font:bold\}\{:font\}/g, "*");
	text = text.replace(/\{:font:bold\}\{:font:zwsp\}/g, "*");
	
	// 行頭
	text = text.replace(/^(　+)/, x => "{>" + x.length + "}");
	if(text.match(/^　/)){
	}
	text = text.replace(/^([「（‘“［【『〈《〔])/g, "{<}$1");

	// 明示的なスペース
	text = text.replace(/？　/g, "？");
	text = text.replace(/！　/g, "！");

	// ダッシュ類を単語から切り離す
	text = text.replace(/([A-Za-z0-9])([–—])/g, "$1 $2 ");
	text = text.replace(/([–—])([A-Za-z0-9])/g, " $1 $2");
	
	// 縦書き用の約物
	if(this.setting.isVertical){
		text = text.replace(/…/g, "︙");
		text = text.replace(/‥/g, "︰");
		text = text.replace(/“/g, "〝");
		text = text.replace(/”/g, "〟");
	}
	
	// 三点リーダ、二点リーダ
	text = text.replace(/……?/g, "{……}");
	text = text.replace(/︙︙?/g, "{︙︙}");
	text = text.replace(/‥‥?/g, "{‥‥}");
	text = text.replace(/︰︰?/g, "{︰︰}");
	text = text.replace(/――?/g, "{――}");
	
	// ハイフンをマイナスに等
	text = text.replace(/([^0-9A-Za-zα-ωΑ-Ω])-([ \{\(0-9])/g, "$1−$2");
	text = text.replace(/^-([ \{\(0-9])/g, "−$1");
	
	// アポストロフィの扱い（仮）
	if(kh3.setting.correctApostrophe){
		text = text.replace(/([^A-Za-z0-9])'([0-9][0-9][^0-9])/g, "$1’$2");
		text = text.replace(/^'([0-9][0-9][^0-9])/g, "’$1");
		text = text.replace(/([A-Za-z]n)'(t[ ,\.\?\!])/g, "$1’$2");
		text = text.replace(/([A-Za-z])'((m|re|ve|d|ll)[ ,\.\?\!])/g, "$1’$2");
		text = text.replace(/([A-Za-z]|[0-9][0-9])'(s[ ,\.\?\!\-])/g, "$1’$2");
		text = text.replace(/( (J|j|L|l|C|c|T|t|D|d))'([a-z][a-z])/g, "$1’$3");
		text = text.replace(/([A-Za-z][a-z][a-z]s)'([ ,\.\?\!])/g, "$1’$2");
		//text = text.replace(/([^A-Za-z])'([^A-Za-z])/g, "$1′$2");
	}

	// 引用符
	if(kh3.setting.correctQuotes){
		text = text.replace(/^"/, "“");
		text = text.replace(/ "/g, " “");
		text = text.replace(/"([ \,\.\?\!])/g, "”$1");
		text = text.replace(/"$/g, "”");
	}

	// ! で始まるコマンドを簡略表記
	text = text.replace(/(^|[ \r\n])!([^!\s]?[^!\s]?)([ \r\n]|$)/g, "$1{!$2}$3");
	text = text.replace(/(^|[ \r\n])!([^!\s]?[^!\s]?)([ \r\n]|$)/g, "$1{!$2}$3");
	
	// 縦書き時の大文字語
	if(this.setting.isVertical){
	}
	
	return text;
}


// テキストを単語にバラす
// この関数は定義を上書きしている
kh3.parse = function(text){
	var res = [];
	var metastack = [];
	var font = "main", color = "", pos = "", isInWord = false;
	var palette = [
		"#000000", "#0077dd", "#dd3300", "#9900cc", "#229900"
	]; // 将来的には設定項目とする
	var isBold = 0, isItalic = 0;
	var size = "";
	for(var i = 0; i < text.length; i ++){
		var o = new kh3.Unit(text.charAt(i), metastack[metastack.length - 1]);
		while(o.char.match(/ /)) o.char = text.charAt(++i);
		if(o.char == "{"){
			var commandtext = "";
			while(i + 1 < text.length && text.charAt(i + 1) != "}"){
				commandtext = commandtext + text.charAt(++i);
			}
			i += 1;
			if(commandtext.length > 0){
				command = commandtext[0];
				o.command = "", o.char = commandtext;
				switch(command){
					case "(":
						o.char = "{";
						break;
					case ")":
						o.char = "}";
						break;
					case "[":
						operands = commandtext.substring(1).split("]");
						if(operands.length >= 2){
							o.char = operands[0];
							o.ruby = operands[1];
							o.rubyid = (operands.length >= 2? operands[2]: 0);
						}
						break;
					case "!":
						o.isMetacommand = 1;
						operands = commandtext.substring(1).split(":");
						if(operands.length == 0 || operands[0].length == 0){
							if(metastack.length){
								metastack[metastack.length - 1].close();
								if(metastack[metastack.length - 1].isClosed) metastack.pop();
							}
						}
						else switch (operands[0]){
							case "fraction":
							case "frac":
							case "f":
								o.command = "fraction";
								o.unit = new kh3.Fractor();
								o.turn = 1;
								break;
							case "indexed":
							case "index":
								o.command = "indexed";
								o.pos = (operands.length > 1? operands[1]: "sub");
								o.unit = new kh3.Indexed(o.pos);
								o.turn = 1;
								if(operands[0] == "index"){
									if(metastack.length) o.unit.add(metastack[metastack.length - 1].remove());
									else if(res.length) o.unit.add(res.pop());
									o.unit.turnover();
								}
								break;
							case "vector":
							case "v":
								o.command = "vector";
								o.dim = (operands.length > 1? +operands[1]: 2);
								o.unit = new kh3.VectorUnit(o.dim);
								o.turn = 1;
								break;
							case "root":
							case "rt":
								o.command = "root";
								o.index = (operands.length > 1? operands[1]: "");
								o.unit = new kh3.Rootunit(o.index);
								break;
							case "(+":
							case "([":
							case "(":
								o.command = "parens";
								if(operands[0] == "(+") o.unit = new kh3.Parens("{", "}");
								else if(operands[0] == "([") o.unit = new kh3.Parens("[", "]");
								else o.unit = new kh3.Parens();
								break;
							case "big":
								o.command = "big";
								o.unit = new kh3.Bigunit(operands.length > 1? operands[1]: "");
								break;
							case "space":
								o.command = "space";
								o.length = (isNumeric(operands[1])? +operands[i]: 1);
								o.unit = new kh3.Spaceunit(o.length);
								break;
							default:
								console.log("Unknown metacommand " + commandtext);
								break;
						}
						if(o.unit){
							o.close = function(){ this.unit.close(), this.isClosed = this.unit.isClosed; }.bind(o);
							o.add = function(unit){ this.unit.add(unit); }.bind(o);
							o.remove = function(){ return this.unit.remove(); }.bind(o);
							if(metastack.length) metastack[metastack.length - 1].add(o.unit);
							else res.push(o.unit);
							metastack.push(o);
						}
						break;
					case ":":
						operands = commandtext.substring(1).split(":");
						if(operands.length == 0) o.command = "", o.char = ":";
						else switch (operands[0]){
							case "page":
								o.command = "page", o.char = "";
								break;
							case "column":
								o.command = "column", o.char = "";
								break;
							case "noindent":
								o.command = "indent", o.value = "0", o.char = "";
								break;
							case "indent":
								o.command = "indent";
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								o.value2 = (isNumeric(operands[2])? +operands[2]: 0);
								o.value3 = (isNumeric(operands[3])? +operands[3]: 0);
								o.char = "";
								break;
							case "longindent":
								o.command = "indent";
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								o.value2 = (isNumeric(operands[2])? +operands[2]: 0);
								o.value3 = (isNumeric(operands[3])? +operands[3]: 0);
								o.char = "";
								o.isLong = 1;
								break;
							case "rightbox":
								o.command = "rightbox";
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								o.value2 = (isNumeric(operands[2])? +operands[2]: 0);
								o.char = "";
								break;
							case "head":
								o.command = "head";
								if(isNumeric(operands[2]) && operands[3] != ""){
									o.value = +operands[2];
									o.value2 = operands[1];
									o.value3 = operands[3];
								}
								else{
									o.value = 3;
									o.value2 = operands[1];
									o.value3 = operands[2];
								}
								break;
							case "ruled":
								o.command = "ruled";
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								break;
							case "underline":
							case "u":
								o.command = "underline";
								o.value = operands[1];
								o.value2 = operands[2] || "1";
								break;
							case "nolinefeed":
							case "nolf":
								o.command = "nolf", o.char = "";
								break;
							case "center":
								o.command = "center", o.char = "";
								break;
							case "right":
								o.command = "right", o.char = "";
								break;
							case "rot":
							case "rotate":
							case "rotated":
								o.command = "rotate", o.char = (operands.length > 1? operands[1]: "");
								break;
							case "large":
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								if(o.value) size = "large"; else size = "";
								o.isMetacommand = 1;
								break;
							case "small":
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								if(o.value) size = "small"; else size = "";
								o.isMetacommand = 1;
								break;
							case "bold":
							case "b":
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								if(o.value) isBold = 1; else isBold = 0;
								o.isMetacommand = 1;
								break;
							case "italic":
							case "it":
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								if(o.value) isItalic = 1; else isItalic = 0;
								o.isMetacommand = 1;
								break;
							case "font":
								font = (operands.length > 1? operands[1]: "");
								if(operands.length > 2 && operands[2] == "zwsp") isInWord = 1;
								o.isMetacommand = 1;
								break;
							case "color":
								if(isNumeric(operands[1]) && +operands[1] < palette.length){
									color = palette[operands[1]];
								}
								else color = "";
								if(operands.length > 2 && operands[2] == "zwsp") isInWord = 1;
								o.isMetacommand = 1;
								break;
							case "pos":
								pos = (operands.length > 1? operands[1]: "");
								if(operands.length > 2 && operands[2] == "zwsp") isInWord = 1;
								o.isMetacommand = 1;
								break;
							default:
								console.log("Unknown command " + commandtext);
								o.command = void 0, o.char = commandtext;
						}
						break;
					case "<":
						operands = commandtext.substring(1).split(":");
						o.command = "indent";
						o.value = 0;
						o.value2 = operands[1];
						o.value3 = operands[2];
						o.char = "";
						break;
					case ">":
						if(commandtext.length > 2 && commandtext.charAt(1) == "="){
							operands = commandtext.substring(2).split(":");
							o.command = "setindent";
							o.value = operands[0];
							o.char = "";
						}
						else{
							operands = commandtext.substring(1).split(":");
							o.command = "indent";
							o.value = operands[0];
							o.value2 = operands[1];
							o.value3 = operands[2];
							o.char = "";
						}
						break;
					case "$":
						operand = commandtext.substring(1);
						o.command = "meta", o.metaname = operand, o.char = "";
						break;
					case "*":
						operands = commandtext.substring(1).split(":");
						o.command = void 0;
						o.char = operands[0];
						break;
					default:
					
				}
			}
		}
		else{
			var rxIsEuropean = /[0-9A-Za-z\-\(\)',\.\+−]/;
			try{
				var tmp = new RegExp("\p{scx=Han}", "u");
				rxIsEuropean = new RegExp("[^\p{scx=Han}\p{scx=Hira}\p{scx=Kana}\s]", "u");
			}
			catch(e){
				try{
					var tmp = new RegExp("\u3000-\u30ff");
					rxIsEuropean =  new RegExp("[^\u3000-\u30ff\u4e00-\u9fcf\uff00-\uffef ]");
					//3000-303f 全角記号、3040-309f ひらがな、30a0-30ff カタカナ、4e00-9fcf 漢字、ff00-ffef 全角英数など
				}
				catch(e){
					rxIsEuropean = /[!-~α-ωΑ-Ω\+−]/;
				}
			}
			
			while(i + 1 < text.length && text.charAt(i + 1) != "{"
					&& text.charAt(i).match(rxIsEuropean) && text.charAt(i + 1).match(rxIsEuropean)){
				o.char = o.char + text.charAt(++i);
			}
		}
		
		(o.unit || o).font = font;
		(o.unit || o).isBold = !! isBold;
		(o.unit || o).isItalic = !! isItalic;
		(o.unit || o).color = color;
		if(size != "") (o.unit || o).size = size;
		o.pos = pos;

		if(o.isMetacommand) continue;
		
		o.recalc(); // o.char を直接いじりまくっているので調整
		
		if(isInWord){
			isInWord = 0;
			o.firstchar = "";
			o.isAttached = 1;
		}
		
		if(metastack.length) metastack[metastack.length - 1].add(o);
		else res.push(o);
	}
	
	return res;
}

