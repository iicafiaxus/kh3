//alert("Loading Parsers.");

// テキストの前処理
// この関数は定義を上書きしている
kh3.preprocess = function(text){
	
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
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\+−])\/([A-Za-zα-ωΑ-Ω]+) /g, "$1{:font:italic:zwsp}$2{:font:} ");
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\+−])\/([A-Za-zα-ωΑ-Ω]+)([\-\.,\/])/g, "$1{:font:italic:zwsp}$2{:font::zwsp}$3");
	text = text.replace(/ \/([A-Za-zα-ωΑ-Ω]+) /g, " {:font:italic}$1{:font:}");
	text = text.replace(/ \/([A-Za-zα-ωΑ-Ω]+)([\-\.,\/])/g, " {:font:italic}$1{:font::zwsp}$2");
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\+−])\/([A-Za-zα-ωΑ-Ω]+)([\-\.,\/])/g, " $1{:font:italic:zwsp}$2{:font::zwsp}$3");
	text = text.replace(/([0-9A-Za-zα-ωΑ-Ω\+−])\/([A-Za-zα-ωΑ-Ω]+)/g, "$1{:font:italic:zwsp}$2{:font:}");
	text = text.replace(/\/([A-Za-zα-ωΑ-Ω]+)([\-\.,\/])/g, " {:font:italic}$1{:font::zwsp}$2");
	text = text.replace(/\/([A-Za-zα-ωΑ-Ω]+)/g, "{:font:italic}$1{:font:}");
	
	text = text.replace(/\{:font:italic\}([A-ZΑ-Ω])/g, "{:font:italiccaps}$1");
	text = text.replace(/\{:font:italic:zwsp\}([A-ZΑ-Ω])/g, "{:font:italiccaps:zwsp}$1");
	
//	text = text.replace(/\/([A-Za-zα-ωΑ-Ω]+)/g, "{:font:italic}$1{:font:}");
	
	
	// 下付き・上付き
	text = text.replace(/_([0-9]+|[A-Za-zα-ωΑ-Ω]+)/g, " {:pos:sub:zwsp}$1{:pos:}");
	text = text.replace(/\^([0-9]+|[A-Za-zα-ωΑ-Ω]+)/g, " {:pos:sup:zwsp}$1{:pos:}");
	text = text.replace(/_(.)/g, " {:pos:sub:zwsp}$1{:pos:}");
	text = text.replace(/\^(.)/g, " {:pos:sup:zwsp}$1{:pos:}");
	
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
	text = text.replace(/？　/, "？");
	text = text.replace(/！　/, "！");

	
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
		text = text.replace(/([^A-Za-z])'([A-Za-z])/g, "$1’$2");
		text = text.replace(/([^A-Za-z])'([^A-Za-z])/g, "$1′$2");

	// ! で始まるコマンドを簡略表記
		text = text.replace(/(^|[ \r\n])!([^!\s]?[^!\s]?)([ \r\n]|$)/g, "$1{!$2}$3");
		text = text.replace(/(^|[ \r\n])!([^!\s]?[^!\s]?)([ \r\n]|$)/g, "$1{!$2}$3");
	
	// 合字
		text = text.replace(/ffi/g, "ﬃ");
		text = text.replace(/ffl/g, "ﬄ");
		text = text.replace(/ff/g, "ﬀ");
		text = text.replace(/fi/g, "ﬁ");
		text = text.replace(/fl/g, "ﬂ");
	
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
	var font = "main", pos = "", isInWord = false;
	for(var i = 0; i < text.length; i ++){
		var o = new kh3.Unit(text.charAt(i));
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
							case"fraction":
							case "frac":
							case "f":
								o.command = "fraction";
								o.unit = new kh3.Fractor();
								o.turn = 1;
								o.close = function(){
										if(this.unit.turn == 1) this.unit.turnover();
										else this.unit.close(), this.isClosed = 1;
								}.bind(o);
								o.add = function(unit){
									this.unit.add(unit);
								}.bind(o);
								if(metastack.length) metastack[metastack.length - 1].add(o.unit);
								else res.push(o.unit);
								metastack.push(o);
								break;
							case"root":
							case "rt":
								o.command = "root";
								o.unit = new kh3.Rootunit();
								o.close = function(){
									this.unit.close(), this.isClosed = 1;
								}.bind(o);
								o.add = function(unit){
									this.unit.add(unit);
								}.bind(o);
								if(metastack.length) metastack[metastack.length - 1].add(o.unit);
								else res.push(o.unit);
								metastack.push(o);
								break;
							default:
								console.log("Unknown metacommand " + commandtext);
								break;
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
							case "ruled":
								o.command = "ruled";
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								break;
							case "underline":
							case "u":
								o.command = "underline";
								o.value = operands[1];
								break;
							case "center":
								o.command = "center", o.char = "";
								break;
							case "rot":
							case "rotate":
							case "rotated":
								o.command = "rotate", o.char = (operands.length > 1? operands[1]: "");
								break;
							case "font":
								font = (operands.length > 1? operands[1]: "");
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
						o.value2 = (isNumeric(operands[1])? +operands[1]: 0);
						o.value3 = (isNumeric(operands[2])? +operands[2]: 0);
						o.char = "";
						break;
					case ">":
						if(commandtext.length > 1 && commandtext.charAt(1) == "="){
							operands = commandtext.substring(2).split(":");
							o.command = "setindent";
							o.value = operands[0];
							o.char = "";
						}
						else{
							operands = commandtext.substring(1).split(":");
							o.command = "indent";
							/*
							o.value = (isNumeric(operands[0])? +operands[0]: 1);
							o.value2 = (isNumeric(operands[1])? +operands[1]: 0);
							o.value3 = (isNumeric(operands[2])? +operands[2]: 0);
							*/
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
			var rxIsEuropean = /[0-9A-Za-z\-\)',\.\+−]/;
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
			
//			/[0-9A-Za-zα-ωΑ-Ω\-\)',\.]/;
			while(i + 1 < text.length && text.charAt(i + 1) != "{"
					&& (/*text.charAt(i).match(/[「（￥＄]/) || text.charAt(i + 1).match(/[、。」）％！？]/) || */(
//						text.charAt(i).match(/[!-~]/) && text.charAt(i + 1).match(/[!-~]/)
//						text.charAt(i).match(/[0-9A-Za-zα-ωΑ-Ω\-\(',\.]/) && text.charAt(i + 1).match(/[0-9A-Za-zα-ωΑ-Ω\-\)',\.]/)
						text.charAt(i).match(rxIsEuropean) && text.charAt(i + 1).match(rxIsEuropean)
//						text.charAt(i).match(this.letters.alphanumeric) && text.charAt(i + 1).match(this.letters.alphanumeric)
					))){
				o.char = o.char + text.charAt(++i);
			}
		}
		
		if(o.isMetacommand) continue;
		
		o.firstchar = o.char.length > 0? o.char.charAt(0): "";
		o.lastchar =  o.char.length > 0? o.char.charAt(o.char.length - 1): "";
		
		o.font = font;
		o.pos = pos;
		if(isInWord){
			isInWord = 0;
			o.firstchar = ""; // "|"
			o.isAttached = 1;
//			if(res.length) res[res.length - 1].lastchar = "|";
		}
		
		o.isAlphanumeric = !!o.char.match(/^[!-~\+−]+$/);
		
		if(metastack.length) metastack[metastack.length - 1].add(o);
		else res.push(o);
	}
	
	// フォント変更等のコマンドがアキ判定に影響を与えないように
	for(var i = 0; i < res.length - 1; i ++){
//		if(res[i + 1].isInvisible) res[i + 1].lastchar = res[i].lastchar;
//		if(res[i + 1].isInvisible) res[i + 1].lastchar = "|";
	}
	for(var i = res.length - 1; i > 0; i --){
//		if(res[i - 1].isInvisible) res[i - 1].firstchar = res[i].firstchar;
//		if(res[i - 1].isInvisible) res[i - 1].firstchar = "|";
	}
	
	/*
	for(var i = 0; i < res.length; i ++){
		var o = res[i];
		console.log(i, o.firstchar, o.char, o.lastchar);
	}
	*/
//	alert(res.length);
	return res;
}


//alert("Parser loaded.");
