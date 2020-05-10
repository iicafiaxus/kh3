// RootunitやFractorからコピーしてきた…
kh3.Indexed = function(pos = "sub"){
	kh3.Unit.call(this, "");
	this.pos = pos;
	this.canRotate = 1;
	this.mainunits = [];
	this.indexunits = [];
	this.turn = 1; // 1=main 2=index
}
kh3.Indexed.prototype = Object.create(kh3.Unit.prototype);
kh3.Indexed.prototype.constractor = kh3.Indexed;

kh3.Indexed.prototype.recalc = function(){
	kh3.Unit.prototype.recalc.call(this);
	this.canRotateVertical = 0;
}

kh3.Indexed.prototype.makeDom = function(){
	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	this.span = document.createElement("span");
	for(unit of this.mainunits) unit.makeDom();
	for(unit of this.mainunits) this.span.appendChild(unit.span);
	for(unit of this.indexunits){
		unit.pos = this.pos;
		unit.makeDom();
	}
	for(unit of this.indexunits) this.span.appendChild(unit.span);

	this.setSubpositions();
}

kh3.Indexed.prototype.turnover = function(){
	this.turn = 2;
}

kh3.Indexed.prototype.close = function(){
	this.isClosed = 1;
}

kh3.Indexed.prototype.add = function(unit){
	if(this.turn == 1){
		this.mainunits.push(unit);
		this.char += unit.char;
		this.recalc();
		this.firstchar = this.mainunits[0].firstchar;
		this.lastchar = unit.lastchar;
	}
	else this.indexunits.push(unit);
}

kh3.Indexed.prototype.setSubpositions = function(){
	// 位置を反映
	this.innerwidth = 0;
	this.innerheight = kh3.setting.zh, this.innermiddle = kh3.setting.zh / 2;
	var left = 0;
	var lastunit;
	for(unit of this.mainunits){
		if(lastunit) left += lastunit.marginTo(unit);
		unit.left = left;
		unit.top = 0;
		this.innerwidth = (left += unit.width);
		this.innerheight = Math.max(this.innerheight, unit.height);
		this.innermiddle = Math.max(this.innermiddle, unit.middle);
		lastunit = unit;
	}
	lastunit = null;
	for(unit of this.indexunits){
		if(lastunit) left += lastunit.marginTo(unit) * 0.7 * 0.4;
		unit.left = left;
		unit.top = 0;
		this.innerwidth = (left += unit.width);
		this.innerheight = Math.max(this.innerheight, unit.height);
		this.innermiddle = Math.max(this.innermiddle, unit.middle);
		lastunit = unit;
	}
	this.width = this.innerwidth;
	this.height = this.innerheight;
	this.middle = this.innermiddle;

	if(this.isRotated){
		for(unit of this.mainunits){
			var l = unit.left, t = unit.top;
			unit.left = t;
			unit.top = -kh3.setting.zh / 2 + this.width / 2;
		}
		for(unit of this.indexunits){
			var l = unit.left, t = unit.top;
			if(this.pos == "sup"){
				unit.left = t - kh3.setting.zh * 0.3;
				unit.top = -kh3.setting.zh / 2 + this.width / 2 - l + kh3.setting.zh * 0.4; // よくわからない フォント依存かも
			}
			else{
				unit.left = t + kh3.setting.zh * 0.3;
				unit.top = -kh3.setting.zh / 2 + this.width / 2 - l - kh3.setting.zh * 0.4; // よくわからない フォント依存かも
			}
		}
	}
	

//	for(unit of this.units) if(unit.setSubpositions) unit.setSubpositions();
	
}

kh3.Indexed.prototype.rotate = function(){
	kh3.Unit.prototype.rotate.call(this);
	for(u of this.mainunits){
		u.span.className += " rotated";
	}
	for(u of this.indexunits){
		u.span.className += " rotated";
	}

}

kh3.Indexed.prototype.setPosition = function(){
	kh3.Unit.prototype.setPosition.call(this);
	
	this.setSubpositions();

	// 本体を配置
	this.innertop = this.top;
	this.innermiddle = kh3.setting.zh / 2;
	for(u of this.mainunits){
		u.left += this.left, u.top += this.top;
		this.innertop = Math.min(this.innertop, u.top);
		this.innermiddle = Math.max(this.innermiddle, u.middle);
		u.setPosition();
	}

	// 添字を配置
	for(u of this.indexunits){
		u.left += this.left, u.top += this.top;
		this.innertop = Math.min(this.innertop, u.top);
		this.innermiddle = Math.max(this.innermiddle, u.middle);
		u.setPosition();
	}
	
}





