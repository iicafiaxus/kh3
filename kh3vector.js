kh3.VectorUnit = function(dim){
	kh3.Unit.call(this, "");
	this.canRotate = 0;
	this.rows = [[]];
	this.dim = dim;
	this.turn = 1;
}
kh3.VectorUnit.prototype = Object.create(kh3.Unit.prototype);
kh3.VectorUnit.prototype.constractor = kh3.VectorUnit;

kh3.VectorUnit.prototype.makeDom = function(){
	if(this.span && this.span.parentNode){
		this.span.parentNode.removeChild(this.span);
	}
	this.span = document.createElement("span");
	
	// 子ユニットのDOMを作成
	for(row of this.rows) for(unit of row) unit.makeDom();
	
	// 子ユニットのDOMとの親子関係
	for(row of this.rows) for(unit of row) this.span.appendChild(unit.span);
	
	this.setSubpositions();
	
}

kh3.VectorUnit.prototype.turnover = function(){
	this.turn += 1;
	this.rows.push([]);
}

kh3.VectorUnit.prototype.close = function(){
	if(this.turn < this.dim) this.turnover();
	else this.isClosed = 1;
}

kh3.VectorUnit.prototype.add = function(unit){
	this.rows[this.turn - 1].push(unit);
}
kh3.VectorUnit.prototype.remove = function(){
	return this.rows[this.turn - 1].pop();
}

kh3.VectorUnit.prototype.barspacing = kh3.setting.zh / 4;

kh3.VectorUnit.prototype.setSubpositions = function(){
// 位置を反映
	let fracpadding = kh3.setting.zw / 8;

	this.subwidths = [];
	this.subheights = [];
	this.submiddles = [];
	for(var i = 0; i < this.rows.length; i ++){
		this.subwidths[i] = 0;
		this.submiddles[i] = kh3.setting.zh / 2;
		var lastunit = void 0;
		var left = fracpadding;
		for(unit of this.rows[i]){
			if(lastunit) left += lastunit.marginTo(unit);
			unit.left = left;
			unit.top = 0;
			this.subwidths[i] = left += unit.width;
			this.submiddles[i] = Math.max(this.submiddles[i], unit.middle);
			lastunit = unit;
		}
		this.subheights[i] = kh3.setting.zh;
		for(unit of this.rows[i]){
			this.subheights[i] = Math.max(this.subheights[i], this.submiddles[i] + unit.height - unit.middle);
		}
		this.subwidths[i] += fracpadding;
	}
	this.width = this.subwidths.reduce((a, b) => Math.max(a, b)) + fracpadding * 2;
	this.height = this.subheights.reduce((a, b) => a + b) + this.barspacing * 2 * (this.dim - 1);
	this.middle = this.height / 2;
}

kh3.VectorUnit.prototype.setPosition = function(){
	kh3.Unit.prototype.setPosition.call(this);
	this.setSubpositions();
	
	var top = 0;
	for(var i = 0; i < this.rows.length; i ++){
		for(u of this.rows[i]){
			u.left += (this.width - this.subwidths[i]) / 2;
			u.top += top + this.submiddles[i] - u.middle;
		}
		top += this.subheights[i] + this.barspacing * 2;
	} 

	for(var i = 0; i < this.rows.length; i ++){
		for(u of this.rows[i]){
			u.left += this.left, u.top += this.top;
			u.setPosition();
		}
	}
	
}
