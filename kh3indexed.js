// RootunitやFractorからコピーしてきた…
kh3.Indexed = function(pos = "sub"){
	kh3.Unit.call(this, "");
	this.pos = pos;
	this.canRotate = 1;
	this.mainunits = [];
	this.subunits = [];
	this.supunits = [];
	this.turn = 1; // 1=main 2=sub 3=sup
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
	for(unit of this.subunits){
		unit.pos = "sub";
		unit.makeDom();
	}
	for(unit of this.supunits){
		unit.pos = "sup";
		unit.makeDom();
	}
	for(unit of this.subunits) this.span.appendChild(unit.span);
	for(unit of this.supunits) this.span.appendChild(unit.span);

	this.setSubpositions();
}

kh3.Indexed.prototype.turnover = function(){
	if(this.turn == 1 && this.pos == "sup")	this.turn = 3;
	else if(this.turn == 1)	this.turn = 2;
	else this.turn = 3;
}

kh3.Indexed.prototype.close = function(){
	if(this.turn == 1 || this.turn == 2 && this.pos == "subsup") this.turnover();
	else this.isClosed = 1;
}

kh3.Indexed.prototype.add = function(unit){
	if(this.turn == 1){
		this.mainunits.push(unit);
		this.char += unit.char;
		this.recalc();
		this.firstchar = this.mainunits[0].firstchar;
		this.lastchar = unit.lastchar;
	}
	else if(this.turn == 2){
		this.subunits.push(unit);
	}
	else{
		this.supunits.push(unit);
	}
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
		unit.top = ((this.pos == "sup" || this.pos == "subsup") ? kh3.setting.zh * 0.2 : 0);
		this.innerwidth = (left += unit.width);
		this.innerheight = Math.max(this.innerheight, unit.height);
		this.innermiddle = Math.max(this.innermiddle, unit.middle);
		lastunit = unit;
	}
	var indexwidth = 0;
	var indexleft = left;
	lastunit = null;
	for(unit of this.subunits){
		if(lastunit) left += lastunit.marginTo(unit) * 0.7 * 0.4;
		unit.left = left;
		unit.top = this.innerheight - kh3.setting.zh * (0.75 - (this.pos == "subsup"? 0.2: 0));
		indexwidth = (left += unit.width);
		this.innerheight = Math.max(this.innerheight, unit.height);
		this.innermiddle = Math.max(this.innermiddle, unit.middle);
		lastunit = unit;
	}
	lastunit = null;
	left = indexleft;
	for(unit of this.supunits){
		if(lastunit) left += lastunit.marginTo(unit) * 0.7 * 0.4;
		unit.left = left;
		unit.top = kh3.setting.zh * -0.2;
		indexwidth = Math.max(indexwidth, left += unit.width);
		this.innerheight = Math.max(this.innerheight, unit.height);
		this.innermiddle = Math.max(this.innermiddle, unit.middle);
		lastunit = unit;
	}
	this.innerwidth = indexwidth;
	this.width = this.innerwidth + kh3.setting.zw * (this.pos == "sup"? 0: 0);
	this.height = this.innerheight +
		kh3.setting.zh * ((this.pos == "sup" || this.pos == "subsup")? 0.2: 0);
	this.middle = this.innermiddle +
		kh3.setting.zh * ((this.pos == "sup" || this.pos == "subsup")? 0.2: 0);

	
	// 縦中横の処理
	if(this.isRotated){
		for(unit of this.mainunits){
			var l = unit.left, t = unit.top;
			unit.left = t;
			unit.top = this.width / 2 - l -  kh3.setting.zh / 2;
		}
		for(unit of this.subunits){
			var l = unit.left, t = unit.top;
			unit.left = t;
			unit.top = this.width / 2 - l -  kh3.setting.zh / 2;
		}
		for(unit of this.supunits){
			var l = unit.left, t = unit.top;
			unit.left = t;
			unit.top = this.width / 2 - l -  kh3.setting.zh / 2;
		}
		var w = this.width, h = this.height;
		this.height = w;
		this.width = h;
		this.middle = this.height / 2;
	}
	

//	for(unit of this.units) if(unit.setSubpositions) unit.setSubpositions();
	
}

kh3.Indexed.prototype.rotate = function(){
	kh3.Unit.prototype.rotate.call(this);
	if(this.mainunits.length){
		this.lastchar = (x => x[x.length - 1])(this.mainunits).lastchar;
		this.firstchar = this.mainunits[0].firstchar; 
	}
	for(u of this.mainunits){
		u.span.className += " kh3-rotated";
	}
	for(u of this.subunits){
		u.span.className += " kh3-rotated";
	}
	for(u of this.supunits){
		u.span.className += " kh3-rotated";
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
	for(u of this.subunits){
		u.left += this.left, u.top += this.top;
		this.innertop = Math.min(this.innertop, u.top);
		this.innermiddle = Math.max(this.innermiddle, u.middle);
		u.setPosition();
	}
	for(u of this.supunits){
		u.left += this.left, u.top += this.top;
		this.innertop = Math.min(this.innertop, u.top);
		this.innermiddle = Math.max(this.innermiddle, u.middle);
		u.setPosition();
	}
	
}





