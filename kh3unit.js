kh3.loadScript("kh3fractor.js");
kh3.loadScript("kh3rootunit.js");
kh3.loadScript("kh3parens.js");

kh3.Unit = function(text){
	this.char = text;
	this.ruby = "";
	this.lastchar = (text && text.length)? text.charAt(text.length - 1): "";
	this.firstchar = (text && text.length)? text.charAt(0): "";
	this.isAlphanumeric = !!text.match(/^[!-~\+−]+$/);
	this.isRotated = 0;
	this.canRotate = 1;
	
	this.command = "";
	this.font = "";
	this.pos = "";
	
	this.rubyHang = 0;
	
	this.span = void 0;
	this.rubyspan = void 0;
};

// DOM作成
kh3.Unit.prototype.makeDom = function(){
	
	// フォントの調整　場違いな気もするがとりあえず…
	if(this.font == "main" || this.font == ""){
		if(this.char.match(/^[!-~]+$/)){
			if(this.char.match(/[0-9]+/)){
				this.font = "numeric";
			}
			else this.font = "roman";
		}
		else this.font = "main";
	}
	

	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	
	var span = document.createElement("span");
	span.className = "char";
	
	if(this.font != "") span.className += " " + this.font;
	if(this.pos != "") span.className += " " + this.pos;
	
	// グリフの置き換え(とりあえず)
	if(this.font == "italic"){
		this.char = this.char.replace("f", "ƒ");
		this.char = this.char.replace("'", "′");
	}
	if(kh3.setting.correctPunct){
		if(kh3.setting.isVertical) this.char = this.char.replace("，", "、");
		else this.char = this.char.replace("、", "，");
	}
	
	span.textContent = this.char;
	this.span = span;
	if(this.ruby){
		var rubyspan = document.createElement("span");
		rubyspan.className = "char ruby";
		span.appendChild(rubyspan);
		rubyspan.textContent = this.ruby;
		this.rubyspan = rubyspan;
	}
	
		// 採寸
		this.width = kh3.getWidth(this.char, kh3._render.unit, kh3.setting.zw, this.font + this.pos);
		this.height = kh3.setting.zh;
		this.offset = 0.0;
		if(this.pos == "sup") this.offset = -0.4;
		if(this.pos == "sub") this.offset = 0.25;
		 // とりあえず
		
		// heightが1zhではない場合に上下のはみ出し量を見るため
		this.middle = kh3.setting.zh / 2;
};

kh3.Unit.prototype.rotate = function(){
	// これは makeDom よりも後で呼ばれる
	this.isRotated = true;
	var h = this.height, w = this.width;
	this.height = w;
	this.width = Math.max(h, kh3.setting.zw);
	this.offset += (kh3.setting.zh - this.height) / 2 / this.height; // 分母が this.height なのはおかしい気もするが今はこういう仕様
	this.middle = this.height / 2;
	this.lastchar = "漢", this.firstchar = "漢"; // 本当はこれではないがアキの処理ができていないのでとりあえず
	this.span.className += " rotated";
}

// DOMを配置
kh3.Unit.prototype.setPosition = function(){
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
	if(this.isFracted && unit.isFracted) return false;
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
