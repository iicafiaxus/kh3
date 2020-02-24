/*
設定画面関係
(単に行数が多くなったから切り出しただけ)

kh3ui.js から呼ばれる想定
*/


// ------------------------------
// 保存されていた設定画面の情報を復元
// ------------------------------
kh3ui.restoreConfig = function(valueFor){
	if(! valueFor) valueFor = x => kh3ui.file.read("configs", x); // 文字列で返す
	var exists = x => !!valueFor(x);
	var inputs = document.getElementById("console").getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i ++){
		var o = inputs[i];
		if(o.getAttribute("type") == "checkbox") if(exists(o.id)) o.checked = (valueFor(o.id) == "1");
		if(o.getAttribute("type") == "text") if(exists(o.id)) o.value = "" + valueFor(o.id);
		if(o.getAttribute("type") == "number") if(exists(o.id)) o.value = +valueFor(o.id);
	}
}

// ------------------------------
// 設定画面の情報を保存
// ------------------------------
kh3ui.saveConfig = function(save){
	if(! save) save = (x, v) => kh3ui.file.write(v, "configs", x);
	var inputs = document.getElementById("console").getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i ++){
		var o = inputs[i];
		if(o.getAttribute("type") == "checkbox") save(o.id, o.checked? "1": "0");
		if(o.getAttribute("type") == "text") save(o.id, "" + o.value);
		if(o.getAttribute("type") == "number") save(o.id, "" + o.value);
	}
}

// ------------------------------
// 設定画面から情報を読み取る
// ------------------------------
kh3ui.getConfigValue = function(name){
	let o = document.getElementById(name);
	if(! o) return void 0;
	else if(o.getAttribute("type") == "checkbox") return !! o.checked;
	else if(o.getAttribute("type") == "text") return "" + o.value;
	else if(o.getAttribute("type") == "number") return +o.value;
}

// ------------------------------
// 設定画面をKH3に適用する
// ------------------------------
kh3ui.readConfig = function(){
	kh3.setSetting(kh3ui.getConfigValue);
}

// ------------------------------
// 設定画面で紙サイズ選択ダイアログを出す
// ------------------------------
kh3ui.showPaperSizePanel = function(){
	var div = document.getElementById("divPaperSizePanel");
	div.style.display = "block";
	div.style.left = ((document.body.clientWidth - div.clientWidth) / 2) + 'px';
	div.style.top = ((document.body.clientHeight - div.clientHeight) / 2) + 'px';
	kh3ui.setModal(kh3ui.hidePaperSizePanel);
}

// ------------------------------
// 設定画面で紙サイズ選択ダイアログを消す
// ------------------------------
kh3ui.hidePaperSizePanel = function(){
	document.getElementById("divPaperSizePanel").style.display = "none";
	kh3ui.unsetModal();
}

// ------------------------------
// 設定画面の紙サイズ選択ダイアログを設定画面に反映
// ------------------------------
kh3ui.setPaperSize = function(w, h){
	document.getElementById("txtPaperWidth").value = +w;
	document.getElementById("txtPaperHeight").value = +h;
}

// ------------------------------
// 設定画面にダイアログを出す
// ------------------------------
kh3ui.setModal = function(hider){
	var div = document.getElementById("modal");
	div.style.display = "block";
	div.style.position = "fixed";
	div.style.width = document.body.clientWidth + "px";
	div.style.height = document.body.clientHeight + "px";
	div.style.left = 0;
	div.style.top = 0;
	div.style.backgroundColor = "#333";
	div.style.opacity = ".5";
	div.addEventListener("click", hider);
}

// ------------------------------
// 設定画面のダイアログを消す
// ------------------------------
kh3ui.unsetModal = function(){
	var div = document.getElementById("modal");
	div.style.display = "none";
}

