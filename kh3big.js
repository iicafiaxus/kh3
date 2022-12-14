// 大きい記号
// kh3parensからコピーして作った
kh3.Bigunit = function(char = ""){
	kh3.Unit.call(this, char);
	this.unit = new kh3.Unit(char);
}
kh3.Bigunit.prototype = Object.create(kh3.Unit.prototype);
kh3.Bigunit.prototype.constractor = kh3.Bigunit;

kh3.Bigunit.prototype.makeDom = function(){
	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	this.span = document.createElement("span");

	this.unit.color = this.color;
	this.unit.font = this.font;
	this.unit.makeDom();
	this.span.appendChild(this.unit.span);
	
	this.setSubpositions();
}

kh3.Bigunit.prototype.close = function(){
	this.isClosed = 1;
}

kh3.Bigunit.prototype.add = function(unit){
	this.unit = unit;
}
kh3.Bigunit.prototype.remove = function(){
	return this.unit;
}

kh3.Bigunit.prototype.setSubpositions = function(){
	this.innerwidth = this.unit.width;
	this.innerheight = kh3.setting.zh * 2;
	this.innermiddle = kh3.setting.zh;
	this.unit.left = kh3.setting.zw * 0.25;
	this.unit.top = 0;

	this.width = this.unit.width;
	this.height = kh3.setting.zh * 2;
	this.middle = kh3.setting.zh;
}

kh3.Bigunit.prototype.setPosition = function(){
	kh3.Unit.prototype.setPosition.call(this);
	
	this.setSubpositions();

	// 拡大率
	var scale = 2.0;
	var widthscale = 1.0;

	// 位置調整 (フォントに依存するのだが仮で)
	var offset = kh3.setting.zh * 0.15;

	// 配置
	if(kh3.setting.isVertical){
		this.unit.span.style.transform = "scale(" + scale + "," + widthscale + ")";
		this.unit.span.style.transformOrigin = "center top";
	}
	else{
		this.unit.span.style.transform = "scale(" + widthscale + "," + scale + ")";
		this.unit.span.style.transformOrigin = "left center";
	}
	this.unit.left = this.left;
	this.unit.top = this.top + this.middle - kh3.setting.zh / 2 - offset;
	this.unit.offset = 0.0;
	this.unit.setPosition();
	
}





