// RootunitやFractorからコピーしてきた…
kh3.Nombre = function(char = "0"){
	kh3.Unit.call(this, "" + char);
}
kh3.Nombre.prototype = Object.create(kh3.Unit.prototype);
kh3.Nombre.prototype.constractor = kh3.Nombre;

kh3.Nombre.prototype.makeDom = function(){
	kh3.Unit.prototype.makeDom.call(this);
	if(kh3.setting.isVertical) this.forceHorizontal();
}

// 縦書きを無視して横書きで配置するので上書き
kh3.Nombre.prototype.setPosition = function(){
	if( ! this.span) return;

	kh3.setPositionHorizontal(
		this.span, 
		this.left,
		this.top,
		this.width * 2,
		this.height
	);

}
