
// ※そのうちfractorと統合して中間のプロトタイプを置きたい
kh3.Rootunit = function(){
	kh3.Unit.call(this, "√");
	this.canRotate = 0;
	this.units = [];
	this.rootmark = new kh3.Unit("√");
}
kh3.Rootunit.prototype = Object.create(kh3.Unit.prototype);
kh3.Rootunit.prototype.constractor = kh3.Rootunit;

kh3.Rootunit.prototype.makeDom = function(){
	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	this.span = document.createElement("span");

	this.rootmark.color = this.color;
	this.rootmark.makeDom();
	this.span.appendChild(this.rootmark.span);
	for(unit of this.units) unit.makeDom();
	for(unit of this.units) this.span.appendChild(unit.span);

	this.setSubpositions();

	this.rule = new kh3.Unit("─");
	this.rule.color = this.color;
	this.rule.makeDom();
	this.span.appendChild(this.rule.span);
}

kh3.Rootunit.prototype.close = function(){
	this.isClosed = 1;
}

kh3.Rootunit.prototype.add = function(unit){
	this.units.push(unit);
}
kh3.Rootunit.prototype.remove = function(){
	return this.units.pop();
}

kh3.Rootunit.prototype.barspacing = kh3.setting.zh / 8;

kh3.Rootunit.prototype.setSubpositions = function(){
	// 位置を反映
	let rootpadding = kh3.setting.zw / 8;
	this.innerwidth = 0;
	this.innerheight = kh3.setting.zh;
	this.innermiddle = kh3.setting.zh / 2;
	this.rootmark.left = 0;
	this.rootmark.top = 0;
	var left = this.rootmark.width + rootpadding;
	var lastunit;
	for(unit of this.units){
		if(lastunit) left += lastunit.marginTo(unit);
		unit.left = left;
		//unit.top = (kh3.setting.isVertical? (kh3.setting.zh - unit.height) / 2: 0);
		unit.top = this.barspacing;
		this.innerwidth = (left += unit.width) - this.rootmark.width;
		this.innerheight = Math.max(this.innerheight, unit.height);
		this.innermiddle = Math.max(this.innermiddle, unit.middle);
		lastunit = unit;
	}
	this.innerwidth += rootpadding;
	this.width = this.rootmark.width + this.innerwidth + rootpadding * 2;
	this.height = this.innerheight + this.barspacing;
	this.middle = this.innermiddle + this.barspacing;

//	for(unit of this.units) if(unit.setSubpositions) unit.setSubpositions();
	
}

kh3.Rootunit.prototype.setPosition = function(){
	kh3.Unit.prototype.setPosition.call(this);
	
	this.setSubpositions();

	// 中身を配置
	for(u of this.units){
		u.left += this.left;
		u.top += this.top + (this.innermiddle - u.middle);
		u.setPosition();
	}
	
	// 根号を配置
	var rootscale = (this.height / kh3.setting.zh);
	if(kh3.setting.isVertical){
		this.rootmark.span.style.transform = "scale(" + rootscale + ",1.0)";
		this.rootmark.span.style.transformOrigin = "right bottom";
	}
	else{
		this.rootmark.span.style.transform = "scale(1.0," + rootscale + ")";
		this.rootmark.span.style.transformOrigin = "right top";
	}
	this.rootmark.left += this.left;
	this.rootmark.top = this.top;// + kh3.setting.zh / 2 - this.innermiddle - this.barspacing;
	this.rootmark.offset = 0.0;
	this.rootmark.setPosition();
	
	// 根号線を配置
	var rulescale = (this.width - this.rootmark.width + kh3.setting.zw / 8) / kh3.setting.zw;
	if(kh3.setting.isVertical){
		this.rule.span.style.transform = "scale(1.0, " + rulescale + ")";
		this.rule.span.style.transformOrigin = "center top";
	}
	else{
		this.rule.span.style.transform = "scale(" + rulescale + " , 1.0)";
		this.rule.span.style.transformOrigin = "left center";
	}
	this.rule.width = kh3.setting.zw;
	this.rule.height = kh3.setting.zh;
	this.rule.left = this.left + this.rootmark.width - kh3.setting.zw / 4;
	this.rule.top = this.top - kh3.setting.zh / 2; // this.top - this.innermiddle - this.barspacing;
	this.rule.height = kh3.setting.zh;
	this.rule.setPosition();
}




