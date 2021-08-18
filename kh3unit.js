kh3.loadScript("kh3fractor.js");
kh3.loadScript("kh3rootunit.js");
kh3.loadScript("kh3parens.js");
kh3.loadScript("kh3indexed.js");

kh3.loadScript("kh3nombre.js");

kh3.Unit = function(text, parentunit){
	this.char = text; // parser ではこの後で直接 this.char を書き換えてくるので注意
	this.ruby = "";
	this.isRotated = 0;
	this.canRotate = 1;
	this.forceRotate = 0;
	this.recalc();
	
	this.command = "";
	this.font = parentunit ? parentunit.font : "";
	this.pos = parentunit ? parentunit.pos : "";
	this.isBold = parentunit ? parentunit.isBold : "";
	this.isItalic = parentunit ? parentunit.isItalic : "";
	this.color = parentunit ? parentunit.color : "";
	this.size = parentunit ? parentunit.size : "";
	
	this.rubyHang = 0;
	
	this.span = void 0;
	this.rubyspan = void 0;

	this.hyphenatedUnit = null; // ハイフネーションした場合の後半部分
	this.isHyphenatable = true; // ハイフネーションを試みることが可能
};

kh3.Unit.prototype.recalc = function(){
	if(this.char && this.char.length){
		this.lastchar = this.char.charAt(this.char.length - 1);
		this.firstchar = this.char.charAt(0);
		this.isAlphanumeric = !!this.char.match(/^[!-~α-ωΑ-Ω\+−]+$/);
		this.canRotateVertical = ! /[a-zα-ω][a-zα-ω]/g.test(this.char);
	}
	else{
		this.lastchar = "";
		this.firstchar = "";
		this.isAlphanumeric = 0;
		this.canRotateVertical = 0;
	}
}

// フォントの調整
kh3.Unit.prototype.recalcFont = function(){
	if(this.isItalic) this.font = "italic";
	if(this.font == "main" || this.font == ""){
		if(this.char.match(/^[!-~α-ωΑ-Ω]+$/)){
			if(this.char.match(/[0-9]+/)){
				this.font = this.isBold ? "boldnumeric" : "numeric";
			}
			else this.font = this.isBold ? "boldroman" : "roman";
		}
		else this.font = this.isBold ? "bold" : "main";
	}
	else if(this.font == "italic" || this.isItalic){
		if(this.isBold) this.font = "bolditalic";
	}
	else if(this.font == "italiccaps"){
		if(this.isBold) this.font = "bolditaliccaps";
	}
}

// DOM作成
kh3.Unit.prototype.makeDom = function(){
	
	this.recalcFont();

	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	
	var span = document.createElement("span");
	span.className = "kh3-char";
	
	//if(this.fontset != "") span.className += " kh3-" + this.fontset;
	if(this.font != "") span.className += " kh3-" + this.font;
	if(this.pos != "") span.className += " kh3-" + this.pos;
	if(this.color != "") span.style.color = this.color;
	
	// グリフの置き換え(とりあえず)
	if(this.font == "italic"){
		this.char = this.char.replace(/f/g, "ƒ");
		this.char = this.char.replace(/'/g, "′");
	}
	
	// 実際に表示する文字に変換
	span.textContent = kh3.toDisplayText(this.char);

	this.span = span;
	if(this.ruby){
		var rubyspan = document.createElement("span");
		rubyspan.className = "kh3-char kh3-ruby";
		span.appendChild(rubyspan);
		rubyspan.textContent = kh3.toDisplayText(this.ruby);
		this.rubyspan = rubyspan;
	}
	
	// 採寸
	this.width = kh3.getWidth(this.char, kh3._render.unit, kh3.setting.zw, this.font + " " + this.pos);
	this.height = kh3.setting.zh;
	this.offset = 0.0;
	if(kh3.setting.isVertical && this.isAlphanumeric) this.offset += -0.05;
		// フォント依存だとは思うがとりあえず
	
	// 文字の天から中心線まで
	this.middle = kh3.setting.zh / 2;

	if(this.size == "small") this.setSmall();
	if(this.size == "large") this.setLarge();
};

kh3.Unit.prototype.rotate = function(){
	// これは makeDom よりも後で呼ばれる
	this.isRotated = true;
	var h = this.height, w = this.width;
	this.height = w;
	this.width = h;
	this.offset += 0;
	this.offset += kh3.setting.zh * 0.025 / this.height; // フォント依存だがとりあえず
	this.middle = this.height / 2;
	this.lastchar = "漢", this.firstchar = "漢"; // 本当はこれではないがアキの処理ができていないのでとりあえず
	this.span.className += " kh3-rotated";
}

kh3.Unit.prototype.forceHorizontal = function(){
	if( ! kh3.setting.isVertical) return;
	this.span.classList.add("kh3-horizontal");
	var h = this.height, w = this.width;
	//this.height = w;
	//this.width = h;
	//this.offset += 0;
	//this.offset += kh3.setting.zh * 0.025 / this.height; // フォント依存だがとりあえず
	//this.middle = this.height / 2;
	//this.lastchar = "漢", this.firstchar = "漢"; // 本当はこれではないがアキの処理ができていないのでとりあえず
}

kh3.Unit.prototype.setSmall = function(){
	this.span.classList.add("kh3-small");
	this.width *= 0.8;
	this.top += this.mid * 0.2;
	this.mid *= 0.8;
	this.height *= 0.8;
}

kh3.Unit.prototype.setLarge = function(){
	this.span.classList.add("kh3-large");
	this.width *= 1.2;
	this.top -= this.mid * 0.2;
	this.mid *= 1.2;
	this.height *= 1.2;
}


// DOMを配置
kh3.Unit.prototype.setPosition = function(){
	//if(this.width == 0) console.log("Width = 0 である Unit (char = \"" + this.char + "\") を配置しようとしています。");
	if(this.span) kh3.setPosition(
		this.span, 
		this.left, this.top + this.height * this.offset, 
		this.width * 2, this.height
	);
	if(this.rubyspan) kh3.setPosition(
		this.rubyspan, 
		this.rubyleft, this.rubytop, 
		this.rubywidth * 2, this.rubyheight, 
		this.rubyspacing
	);
}


// 次のunitへどれだけルビをかぶせることができるか
kh3.Unit.prototype.rubySpaceIn = function(unit){
	var char1 = this.lastchar, char2 = unit.firstchar;
	var res = 0;
	if(char2 == "" || char2.match(/\n/))
			res = Math.max(0, (this.rubywidth - this.width) / 2);
	if(char2.match(/[ぁ-ゞァ-ヾ、。，．）’”］】」』〉》〕（‘“［【「『〈《〔]/))
			res = kh3.setting.zw / 2;
	if(unit.rubywidth > 0 && unit.rubyid == this.rubyid){
		if(unit.rubywidth < unit.width ) res = (unit.width - unit.rubywidth) / 2;
	}
	return res;
};

// 次のunitからどれだけルビをかぶってやることができるか
kh3.Unit.prototype.rubySpaceFor = function(unit){
	var char1 = this.lastchar, char2 = unit.firstchar;
	var res = 0;
	if(char1 == "" || char1.match(/\n/))
			res = Math.max(0, (unit.rubywidth - unit.width) / 2);
	if(char1.match(/[ぁ-ゞァ-ヾ、。，．）’”］】」』〉》〕（‘“［【「『〈《〔]/))
			res = kh3.setting.zw / 2;
	if(this.rubywidth > 0 && unit.rubyid == this.rubyid){
		if(this.rubywidth < this.width ) res = (this.width - this.rubywidth) / 2;
	}

	// 囲みを考慮 (仮)
	if(this.underlinepos == "4" || unit.underlinepos == "4"){
		if(this.underline != unit.underline || this.underlinepos != unit.underlinepos) res = 0;
	}

	return res;
};

// ルビの位置の計算
kh3.Unit.prototype.setRuby = function(){
	this.rubywidth = 0;
	if(this.ruby){
		this.rubywidth = kh3.getWidth(this.ruby, kh3._render.rubyunit, kh3.setting.zw / 2, "ruby");
		if(this.rubywidth < this.width && this.ruby.length > 0){
			this.rubyspacing = (this.width - this.rubywidth) / this.ruby.length;
			this.rubywidth += this.rubyspacing * (this.ruby.length - 1);
		}
		this.rubyleft = (this.width - this.rubywidth) / 2;
		this.rubytop = -kh3.setting.zh / 2;
		if(this.rubyleft < 0) this.rubyHang = -this.rubyleft;
	}
};

// 次のunitとの間のアキ (ルビの衝突を考慮しない)
kh3.Unit.prototype.standardMarginTo = function(unit){
	var char1 = this.lastchar, char2 = unit.firstchar;
	var offset = 0;
	if(this.pos == "sub" || this.pos == "sup") offset = kh3.setting.zw / 8;

	// 囲みを考慮 (仮)
	if(this.underlinepos == "4" || unit.underlinepos == "4"){
		if(this.underline != unit.underline || this.underlinepos != unit.underlinepos) return kh3.setting.zw / 2;
	}

	// ルールを適用
	for(var r of kh3.marginRules){
		if(char1.match(kh3.letters[r[0]]) && char2.match(kh3.letters[r[1]])){
			return r[2] - offset;
		}
	}
	return 0;
};

// 次のunitとの間のアキ (ルビの衝突を考慮)
kh3.Unit.prototype.marginTo = function(unit){
	this.setRuby();
	var margin = this.standardMarginTo(unit);
	margin = Math.max(margin, (this.rubyHang - this.rubySpaceIn(unit)) + (unit.rubyHang - this.rubySpaceFor(unit)));
	if(margin * 0 != 0) margin = 0;
	return margin;
}

// 次のunitとの間での改行可否 (禁則判定)
kh3.Unit.prototype.canBreakBetween = function(unit){
	var char1 = this.lastchar, char2 = unit.firstchar;
	if(char1.match(kh3.letters.leader)) return false;
	if(char1.match(kh3.letters.control)) return false;
	if(char2.match(kh3.letters.follower)) return false;
	if(char2.match(kh3.letters.control)) return false;
	return true;
}

// 次のunitとの間での均等割の係数 (0=密着、1=通常)
kh3.Unit.prototype.sepTo = function(unit){
	var char1 = this.lastchar, char2 = unit.firstchar;
	if(unit.isAttached) return 0;
	for(var r of kh3.sepratioRules){
		if(char1.match(kh3.letters[r[0]]) && char2.match(kh3.letters[r[1]])){
			return r[2];
		}
	}
	return 1;
}

// 次のunitとの間での詰めの許容量 (0=詰め不可、0.25=四分)
kh3.Unit.prototype.reductionTo = function(unit){
	var char1 = this.lastchar, char2 = unit.firstchar;
	if(unit.isAttached) return 0;
	for(var r of kh3.reductionRules){
		if(char1.match(kh3.letters[r[0]]) && char2.match(kh3.letters[r[1]])){
			return r[2];
		}
	}
	return 0;
}

// ハイフネーションにより幅を excess 以上削減することが可能なら
// ハイフネーションをする
kh3.Unit.prototype.hyphenate = function(excess){
	if(excess <= 0) return;
	if( ! this.isHyphenatable) return;
	if(this.char.length <= 2) return;
	let words = kh3.hyphenate(this.char);
	if(words.length <= 1) return;
	for(word of words){
		if(word.length <= 1) continue;
		let width0 = kh3.getWidth(word[0], kh3._render.unit, kh3.setting.zw, this.font + " " + this.pos);
		if(width0 <= this.width - excess){
			this.char = word[0];
			this.recalc();
			this.isTerminal = 1;
			this.makeDom();
			this.hyphenatedUnit = new kh3.Unit(word[1], this);
			this.hyphenatedUnit.recalc();
			this.hyphenatedUnit.isInitial = 1;
			this.hyphenatedUnit.makeDom();
			this.hyphenatedUnit.margin = 0;
			break;
		}
	}
}