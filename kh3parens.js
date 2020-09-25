// カッコ囲み
// kh3rootunit からコピーして作ってしまった…
// fractorも含め、そのうち統合したい
kh3.Parens = function(left = "(", right = ")"){
	kh3.Unit.call(this, left + right);
	this.units = [];
	this.leftmark = new kh3.Unit(left);
	this.rightmark = new kh3.Unit(right);
}
kh3.Parens.prototype = Object.create(kh3.Unit.prototype);
kh3.Parens.prototype.constractor = kh3.Parens;

kh3.Parens.prototype.makeDom = function(){
	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	this.span = document.createElement("span");

	this.leftmark.color = this.color;
	this.leftmark.makeDom();
	this.span.appendChild(this.leftmark.span);
	
	for(unit of this.units) unit.makeDom();
	for(unit of this.units) this.span.appendChild(unit.span);

	this.rightmark.color = this.color;
	this.rightmark.makeDom();
	this.span.appendChild(this.rightmark.span);

	this.setSubpositions();
}

kh3.Parens.prototype.close = function(){
	this.isClosed = 1;
}

kh3.Parens.prototype.add = function(unit){
	this.units.push(unit);
}
kh3.Parens.prototype.remove = function(){
	return this.units.pop();
}

kh3.Parens.prototype.setSubpositions = function(){
	// 位置を反映
	// この処理あちこちにあるので共通化すべき…
	// ただしパーレンは特殊で上と下のMaxを取る（カッコの膨らみの真ん中が合うように）
	let parenpadding = kh3.setting.zw / 8;
	this.innerwidth = 0;
	this.innermiddle = kh3.setting.zh / 2;
	this.leftmark.left = 0;
	this.leftmark.top = 0;
	var left = this.leftmark.width + parenpadding;
	var lastunit;
	for(unit of this.units){
		if(lastunit) left += lastunit.marginTo(unit);
		unit.left = left;
		unit.top = 0;
		this.innerwidth = (left += unit.width) - this.leftmark.width;
		this.innermiddle = Math.max(this.innermiddle, unit.middle);
		lastunit = unit;
	}
	// ここが特殊
	this.innerheight = this.innermiddle * 2;
	for(unit of this.units){
		this.innerheight = Math.max(this.innerheight, (unit.height - unit.middle) * 2); 
	}
	this.innermiddle = this.innerheight / 2;

	left += parenpadding;
	this.rightmark.left = left;
	this.rightmark.top = 0;

	this.innerwidth += parenpadding;
	this.width = this.leftmark.width + this.innerwidth + parenpadding * 2 + this.rightmark.width;
	this.height = this.innerheight;
	this.middle = this.innermiddle;

//	for(unit of this.units) if(unit.setSubpositions) unit.setSubpositions();
	
}

kh3.Parens.prototype.setPosition = function(){
	kh3.Unit.prototype.setPosition.call(this);
	
	this.setSubpositions();

	// カッコの拡大率
	var parenscale = Math.max(1.0, this.height / kh3.setting.zh - 0.4);
	var parenwidthscale = Math.max(1.0, Math.min(1.4, parenscale * 0.6));

	// カッコの位置調整 (フォントに依存するのだが仮で)
	var parenoffset = (parenscale - 1) * kh3.setting.zh * 0.1;

	// 中身を配置
	for(u of this.units){
		u.left += this.left + this.leftmark.width * (parenwidthscale - 1);
		u.top += this.top + (this.innermiddle - u.middle);
		u.setPosition();
	}
	
	// カッコを配置
	if(kh3.setting.isVertical){
		this.leftmark.span.style.transform = "scale(" + parenscale + "," + parenwidthscale + ")";
		this.leftmark.span.style.transformOrigin = "center top";
		this.rightmark.span.style.transform = "scale(" + parenscale + "," + parenwidthscale + ")";
		this.rightmark.span.style.transformOrigin = "center top";
	}
	else{
		this.leftmark.span.style.transform = "scale(" + parenwidthscale + "," + parenscale + ")";
		this.leftmark.span.style.transformOrigin = "left center";
		this.rightmark.span.style.transform = "scale(" + parenwidthscale + "," + parenscale + ")";
		this.rightmark.span.style.transformOrigin = "left center";
	}
	this.leftmark.left += this.left;
	this.leftmark.top = this.top + this.middle - kh3.setting.zh / 2 - parenoffset;
	this.leftmark.offset = 0.0;
	this.leftmark.setPosition();
	this.rightmark.left += this.left;
	this.rightmark.top = this.top + this.middle - kh3.setting.zh / 2 - parenoffset;
	this.rightmark.offset = 0.0;
	this.rightmark.setPosition();
	
}





