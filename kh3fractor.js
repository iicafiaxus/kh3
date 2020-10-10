kh3.Fractor = function(){
	kh3.Unit.call(this, "─");
	this.canRotate = 0;
	this.upperunits = [];
	this.lowerunits = [];
	this.turn = 1; // 1=upper 2=lower
}
kh3.Fractor.prototype = Object.create(kh3.Unit.prototype);
kh3.Fractor.prototype.constractor = kh3.Fractor;

kh3.Fractor.prototype.makeDom = function(){
	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	this.span = document.createElement("span");
	
	// 子ユニットのDOMを作成
	for(unit of this.upperunits) unit.makeDom();
	let char = (this.font.match(/bold/)) ? "━" : "─"; // 罫線素片
	this.rule = new kh3.Unit(char);
	this.rule.color = this.color;
	this.rule.makeDom();
	for(unit of this.lowerunits) unit.makeDom();
	
	// 子ユニットのDOMとの親子関係
	for(unit of this.upperunits) this.span.appendChild(unit.span);
	this.span.appendChild(this.rule.span);
	for(unit of this.lowerunits) this.span.appendChild(unit.span);
	
	this.setSubpositions();
	
}

kh3.Fractor.prototype.turnover = function(){
	this.turn = 2;
}

kh3.Fractor.prototype.close = function(){
	if(this.turn == 1) this.turnover();
	else this.isClosed = 1;
}

kh3.Fractor.prototype.add = function(unit){
	if(this.turn == 1) this.upperunits.push(unit);
	else this.lowerunits.push(unit);
}
kh3.Fractor.prototype.remove = function(){
	if(this.turn == 1) return this.upperunits.pop();
	else return this.lowerunits.pop();
}

kh3.Fractor.prototype.barspacing = kh3.setting.zh / 4;

kh3.Fractor.prototype.setSubpositions = function(){
// 位置を反映
	let fracpadding = kh3.setting.zw / 8;
	this.upperwidth = 0;
	this.uppermiddle = kh3.setting.zh / 2;
	var lastunit;
	var left = fracpadding;
	for(unit of this.upperunits){
		if(lastunit) left += lastunit.marginTo(unit);
		unit.left = left;
		unit.top = 0;//(kh3.setting.isVertical? (kh3.setting.zh - unit.height) / 2: 0);
		this.upperwidth = left += unit.width;
		this.uppermiddle = Math.max(this.uppermiddle, unit.middle);
		lastunit = unit;
	}
	this.upperheight = kh3.setting.zh;
	for(unit of this.upperunits){
		this.upperheight = Math.max(this.upperheight, this.uppermiddle + unit.height - unit.middle);
	}

	this.upperwidth += fracpadding;
	this.lowerwidth = 0;
	this.lowermiddle = kh3.setting.zh / 2;
	lastunit = void 0, left = fracpadding;
	for(unit of this.lowerunits){
		if(lastunit) left += lastunit.marginTo(unit);
		unit.left = left;
		unit.top = 0;
		this.lowerwidth = left += unit.width;
		this.lowermiddle = Math.max(this.lowermiddle, unit.middle);
		lastunit = unit;
	}
	this.lowerheight = kh3.setting.zh;
	for(unit of this.lowerunits){
		this.lowerheight = Math.max(this.lowerheight, this.lowermiddle + unit.height - unit.middle);
	}
	this.lowerwidth += fracpadding;
	this.width = Math.max(this.upperwidth, this.lowerwidth) + fracpadding * 2;
	this.middle = this.upperheight + this.barspacing;
	this.height = this.upperheight + this.lowerheight + this.barspacing * 2;
}

kh3.Fractor.prototype.setPosition = function(){
	kh3.Unit.prototype.setPosition.call(this);
	this.setSubpositions();
	
	for(u of this.upperunits){
		u.left += (this.width - this.upperwidth) / 2;
		u.top += this.uppermiddle - u.middle;
	}
	for(u of this.lowerunits){
		u.left += (this.width - this.lowerwidth) / 2;
		u.top += this.middle + this.barspacing + this.lowermiddle - u.middle;
	}

	for(u of this.upperunits){
		u.left += this.left, u.top += this.top;
		u.setPosition();
	}
	for(u of this.lowerunits){
		u.left += this.left, u.top += this.top;
		u.setPosition();
	}
	
	var scale = this.width / kh3.setting.zw;
	if(kh3.setting.isVertical){
		this.rule.span.style.transform = "scale(1.0, " + scale + ")";
		this.rule.span.style.transformOrigin = "center top";
	}
	else{
		this.rule.span.style.transform = "scale(" + scale + " , 1.0)";
		this.rule.span.style.transformOrigin = "left center";
	}
	this.rule.width = kh3.setting.zw;
	this.rule.height = kh3.setting.zh;
	this.rule.left = this.left;
	this.rule.top = this.top + this.middle - kh3.setting.zh / 2;
	this.rule.height = kh3.setting.zh;
	this.rule.setPosition();
}

// 横線の作成
kh3.Fractor.drawLine = function(left, top, width, magnitude = 1.0){
	
}
