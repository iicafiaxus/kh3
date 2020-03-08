kh3ui = {};
//alert("Loading kh3ui");

kh3ui.loadScript = function(name){
	var o = document.createElement("script");
	o.src = name;
	document.head.appendChild(o);
};

kh3ui.loadScript("kh3uifile.js");
kh3ui.loadScript("kh3uiconfig.js");

kh3ui.viewSetting = {};

// ------------------------------
// プレビュー画面を描画する
// ------------------------------
kh3ui.redraw = function(canSaveText = 1){
	//kh3ui.readConfig();
	window.setTimeout(function(){
		console.log(this.canSaveText);
		var divTarget = document.getElementById(kh3.setting.isVertical? "allV": "allH");
		var textAll = document.getElementById("areaSource").value;
		kh3.render(divTarget, textAll, this.canSaveText);
	}.bind({canSaveText: canSaveText}), 10);
}

// ------------------------------
// プレビュー画面をクリアする
// ------------------------------
kh3ui.clearPages = function(){
	kh3ui.readConfig();
	window.setTimeout(function(){
		var divTarget = document.getElementById(kh3.setting.isVertical? "allV": "allH");
		kh3.clearPages(divTarget);
	}, 10);
}


// ------------------------------
// 起動時の初期化
// ------------------------------
kh3ui.init = function(){
	kh3.setting.isVertical = false;
	kh3ui.hidePaperSizePanel();
	window.addEventListener("resize", kh3ui.resizeEditor);
	window.addEventListener("resize", kh3ui.resizePreview);
	
	// 初期化の内容
	kh3ui.file.loaders.push(kh3ui.restoreText);
	kh3ui.file.loaders.push(kh3ui.restoreTitle);
	kh3ui.file.loaders.push(kh3ui.restoreConfig);
	kh3ui.file.loaders.push(kh3ui.redrawEditor);
	kh3ui.file.loaders.push(kh3ui.showPreview);
	kh3ui.file.loaders.push(kh3ui.showEditor);
	
	// 初期化
	var name = kh3ui.file.metaread("name") || "__default";
	kh3ui.file.load(name);
	
	kh3ui.showFile();

	// ローカル実行の場合ローカルの旨を表示
	if(! window.location.href.match(/^http/)){
		if(! document.title.match(/\[LOCAL\]/)) document.title = "[LOCAL] " + document.title;
	}
}

kh3ui.restoreText = function(){
	if(kh3ui.file.read("textAll")){
		document.getElementById("areaSource").value = kh3ui.file.read("textAll");
	}
	else{
		document.getElementById("areaSource").value = "";
	}
}

kh3ui.restoreTitle = function(){
	if(kh3ui.file.read("title")){
		kh3ui.title = kh3ui.file.read("title");
	}
	else{
		kh3ui.title = "無題のテキスト";
	}
	document.getElementById("txtTitle").value = kh3ui.title;
	kh3ui.redrawTitle();
}

// ------------------------------
// プレビュー画面に切り替える
// ------------------------------
kh3ui.showPreview = function(){
	if(kh3ui.hide) kh3ui.hide();
	
	document.getElementById("btnShowEditor").style.display = "inline";
	document.getElementById("btnShowConfig").style.display = "inline";
	document.getElementById("screenmode").innerHTML =
			"@media screen{ #src, #main, #console, #file { display: none } #main{ display: block } }";
	
	kh3ui.scale = 1.0;
	kh3ui.setScaling();
	kh3ui.clearPages();
	window.setTimeout(kh3ui.redraw, 30);
	window.setTimeout(kh3ui.resizePreview, 10);
	
	kh3ui.redrawTitle();
	
	kh3ui.hide = function(){
		document.getElementById("btnShowEditor").style.display = "none";
		document.getElementById("btnShowConfig").style.display = "none";
		kh3.scrollX = window.scrollX, kh3.scrollY = window.scrollY;
	};
}

// ------------------------------
// 編集画面に切り替える
// ------------------------------
kh3ui.showEditor = function(){
	if(kh3ui.hide) kh3ui.hide();
	
	document.getElementById("screenmode").innerHTML =
			"@media screen{ #src, #main, #console, #file { display: none } #src{ display: block } }";
	
	kh3ui.resizeEditor();
	document.getElementById("areaSource").focus();
	
	kh3ui.hide = function(){
	}
}

// ------------------------------
// 設定画面に切り替える
// ------------------------------
kh3ui.showConfig = function(){
	if(kh3ui.hide) kh3ui.hide();
	
	document.getElementById("screenmode").innerHTML =
			"@media screen{ #src, #main, #console, #file { display: none } #console{ display: block } }";
	
	kh3ui.redrawTitle();
	window.scroll(0, 0);
	
	kh3ui.hide = function(){
	}
}

// ------------------------------
// ファイル選択画面に切り替える
// ------------------------------
kh3ui.showFile = function(){
	if(kh3ui.hide) kh3ui.hide();
	
	document.getElementById("screenmode").innerHTML =
			"@media screen{ #src, #main, #console, #file { display: none } #file{ display: block } }";
	
	kh3ui.fileListReload();
	kh3ui.title = "KH3 Online Typesetter";
	kh3ui.redrawTitle();
	window.scroll(0, 0);
	
	kh3ui.hide = function(){
		kh3ui.restoreTitle();
	};
}

kh3ui.fileListReload = function(){
	var divFileInfo = document.getElementById("divFileInfo");
	divFileInfo.innerHTML = "";
	var ulFiles = document.getElementById("ulFiles");
	ulFiles.innerHTML = "";
	
	var filenames = (kh3ui.file.metaread("filenames") || "").split(" ");
	var hasItem = 0;
	for(name of filenames){
		if(kh3ui.file.metaread("isDeleted", name)) continue;
		if(name == "") continue;
		
		hasItem = 1;
		
		var li = document.createElement("li");
		ulFiles.insertBefore(li, ulFiles.firstChild);
		
		var label = document.createElement("label");
		li.appendChild(label);
		
		var chk = document.createElement("input");
		chk.addEventListener("change", kh3ui.fileButtonActivate);
		chk.type = "checkbox";
		if(name == kh3ui.file.name) chk.checked = 1;
		chk.name = "file";
		chk.id = "chkFile" + name;
		chk.value = name;
		label.appendChild(chk);
		
		var span = document.createElement("span");
		var title = kh3ui.file.metaread("title", name) || "無題のテキスト";
		span.role = "button";
		span.textContent = title;
		span.addEventListener("click", function(e){
			kh3ui.file.load(this.value);
			kh3ui.showEditor();
			}.bind({value: chk.value}));
		label.appendChild(span);
		
		
		var span2 = document.createElement("span");
		span2.className = "incipit";
		span2.textContent = "Afg国 (1)";
		li.appendChild(span2);
		var bottom = span2.getBoundingClientRect().bottom;
		span2.textContent = kh3ui.file.metaread("incipit", name) || "";
		
		// 2行になってしまわないように詰める
		var tempIncipit = span2.textContent;
		while(span2.getBoundingClientRect().bottom != bottom){
			tempIncipit = tempIncipit.slice(0, -1);
			span2.textContent = tempIncipit + "...";
		}

	}
	
	if(!hasItem){
		var p = document.createElement("p");
		p.textContent = "保存されているテキストはありません。新規作成してください。"
		divFileInfo.appendChild(p);
	}
	
	kh3ui.fileButtonActivate();
}

kh3ui.fileButtonActivate = function(){
	var chks = document.getElementById("ulFiles").getElementsByTagName("input");
	var cnt = 0;
	for(chk of chks) if(chk.checked) cnt += 1;
	
	document.getElementById("btnFileNew").disabled = !(cnt >= 0);
	document.getElementById("btnFileOpen").disabled = !(cnt == 1);
	document.getElementById("btnFileImport").disabled = !(cnt >= 0);
	document.getElementById("btnFileExport").disabled = !(cnt == 1);
	document.getElementById("btnFileDelete").disabled = !(cnt >= 1);
	document.getElementById("btnFileDuplicate").disabled = !(cnt >= 1);
}

kh3ui.fileOpen = function(){
	var chks = document.getElementById("ulFiles").getElementsByTagName("input");
	for(chk of chks) if(chk.checked){
		kh3ui.file.load(chk.value);
	}
	kh3ui.showEditor();
}

kh3ui.fileNew = function(){
	var newTitle = window.prompt("作成する文書の名前", "");
	if(newTitle === null) return;
	console.log(newTitle);
	
	kh3ui.fileNew2(newTitle);
}
kh3ui.fileNew2 = function(title){
	var filenames = (kh3ui.file.metaread("filenames") || "").split(" ");
	var newName = 1;
	while(1){
		var isUsed = 0;
		for(name of filenames) if(+newName == +name) isUsed = 1;
		if(isUsed) newName = Math.floor(1 + newName * (1.0 +  Math.random()));
		else break;
	}
	filenames.push("" + newName);
	kh3ui.file.load(newName);
	kh3ui.file.metawrite(filenames.join(" "), "filenames");
	
	kh3ui.title = title;
	kh3ui.redrawTitle();
	kh3ui.saveTitle();
	
	kh3ui.fileListReload();
}

/* 
https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
*/
// ucs-2 string to base64 encoded ascii
function utoa(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

kh3ui.fileImport = function(){
	var fileselect = document.createElement("input");
	fileselect.type = "file";
	fileselect.style.display = "none";
	fileselect.accept = "text/plain";
	fileselect.multiple = false;
	document.body.appendChild(fileselect);
	fileselect.addEventListener("change", function(){
		kh3ui.fileImport2(fileselect.files[0]);
	});
	fileselect.click();
}
kh3ui.fileImport2 = function(file){
	// kh3view から逆輸入してきたりしたけど統一したい
	// kh3config とか kh3ui.restoreConfig とも統一したい
	if(! file) return;
	var reader = new FileReader();
	reader.onload = function(e){
		var text = e.target.result;
		var lines = text.split("\n");
		var title = "無題";
		var textAll = "";
		var params = {};
		var isInPreamble = 1;
		for(line of lines){
			if(isInPreamble){
				if(/^#TITLE=/i.test(line)) title = line.slice(7);
				else if(/^#(txt[^=]*) *= *(.*)$/.test(line)){
					params["" + RegExp.$1] = "" + RegExp.$2;
				}
				else if(/^#(chk[^=]*) *= *(.*)$/.test(line)){
					params["" + RegExp.$1] = (RegExp.$2 == "true" || RegExp.$2 == "1")? "1": "0";
				}
				else if(/^#([^=]*) *= *(.*)$/.test(line)){
					params["" + RegExp.$1] = "" + RegExp.$2;
				}
				else if(line == "") isInPreamble = 0;
				else isInPreamble = 0, textAll += line + "\n";
			}
			else textAll += line + "\n";
			console.log("->" + textAll);
		}
		kh3ui.fileNew2(title);
		kh3ui.file.write(textAll, "textAll");
		kh3ui.file.reload();
		kh3ui.restoreConfig(function(x){ return this[x]; }.bind(params));
	}
	reader.readAsText(file);
}

kh3ui.fileExport = function(){
	var chks = document.getElementById("ulFiles").getElementsByTagName("input");
	for(chk of chks) if(chk.checked){
		kh3ui.file.name = chk.value;
	}
	
	var params = {};
	kh3ui.saveConfig(function(x, v){ this[x] = v; }.bind(params));

	var text = "";
	text += "#TITLE=" + kh3ui.file.read("title") + "\n";
	for(x in params){
		text += "#" + x + "=" + params[x] + "\n";
	}
	text += "\n";
	text += kh3ui.file.read("textAll");
	console.log(text);
	
	var data = "data:text/plain;base64," + utoa(text);
	console.log(data);
	
	var a = document.createElement("a");
	a.href = data;
	a.download = kh3ui.file.read("title") + ".txt";
	document.body.appendChild(a);
	a.click();
}

kh3ui.fileDuplicate = function(){
	alert("未実装です。");
}

kh3ui.fileDelete = function(){
	var filenames = [], filetitles = [];
	var chks = document.getElementById("ulFiles").getElementsByTagName("input");
	for(chk of chks) if(chk.checked){
		var name = chk.value;
		filenames.push(name);
		var title = kh3ui.file.metaread("title", name) || "(無題のテキスト)";
		filetitles.push(title);
	}
	var message = filetitles.length + "件のテキスト\n";
	if(filetitles.length > 10){
		for(var i = 0; i < 9; i ++) message += "  " + filetitles[i] + "\n";
		message += "   ...(略)\n";
	}
	else{
		for(filetitle of filetitles) message += "  " + filetitle + "\n";
	}
	message += "を削除済みにします。";
	if(! window.confirm(message)) return;
	
	for(name of filenames) kh3ui.file.metawrite("1", "isDeleted", name);
	kh3ui.fileListReload();
}



// ------------------------------
// 編集画面の文字カウンターの更新
// ------------------------------
kh3ui.redrawCounter = function(){
	document.getElementById('counter').textContent = document.getElementById("areaSource").value.split(/\s/).join('').length;
}

// ------------------------------
// 編集画面の画面サイズのアジャストメント
// ------------------------------
kh3ui.resizeEditor = function(){
	var header = document.getElementById("srcheader");
	var pTitle = document.getElementById("pTitle");
	var txtTitle = pTitle.getElementsByTagName("input")[0];
	txtTitle.style.margin = "0";
	txtTitle.style.left = "10px";
	txtTitle.style.top = (header.clientHeight + 2) + 'px';
	txtTitle.style.width = (document.body.clientWidth - 20)+ 'px';
	txtTitle.style.width = ((document.body.clientWidth - 20) - 
			(txtTitle.getBoundingClientRect().width - 
			(document.body.clientWidth - 20))) + "px";
	txtTitle.style.height = "auto";
	var areaSource = document.getElementById('areaSource');
	areaSource.style.width = (document.body.clientWidth - 20)+ 'px';
	areaSource.style.height =
		(document.body.clientHeight - header.clientHeight - txtTitle.clientHeight - 
		6)+ 'px';
	areaSource.style.left = "10px";
	areaSource.style.top = 
		(header.clientHeight + txtTitle.clientHeight + 4) + 'px';
}

// ------------------------------
// プレビュー画面の画面サイズのアジャストメント
// ------------------------------
kh3ui.resizePreview = function(){
	
	// 表示領域の大きさ
	var w = document.body.clientWidth - 20;
	var h = document.body.clientHeight - document.getElementById("mode").clientHeight - 8;
	
	// 紙面の大きさ
	// 自動延長されている可能性があるので高さは信用しない
	var divs = document.getElementsByClassName("paper");
	if(! divs.length) return;
	var pw = divs[0].getBoundingClientRect().width;
	//var ph = divs[0].getBoundingClientRect().height;
	var ratio = kh3.setting.isVertical?
		(kh3.setting.paperWidth / kh3.setting.paperHeight):
		(kh3.setting.paperHeight / kh3.setting.paperWidth);
	var ph = pw * ratio;
	console.log("pw:", pw, "ph:", ph, "ratio:", ratio);
	
	kh3ui.redrawTitle();
	
	// 全幅の場合は高さは無視
	if(kh3ui.viewSetting.fullwidth) h = ph * 10;

	// はみ出さないようにする
	if(pw < 1 || ph < 1) return;
	if(pw < w * 0.8 && ph < h * 0.8){
		var m = (pw / w > ph / h)? w / pw * 0.95: h / ph * 0.95;
		kh3ui.scale *= m;
	}
	else if(pw > w || ph > h){
		var m = (pw / w > ph / h)? pw / w * 1.05: ph / h * 1.05;
		kh3ui.scale /= m;
	}
	else return;
	
	kh3ui.setScaling();

	// 描画の更新を予約
	window.setTimeout(function(){kh3ui.redraw(0);}, 10);
	
}




// ------------------------------
// 編集画面でタイトルの更新
// ------------------------------
kh3ui.saveTitle = function(){
	kh3ui.title = document.getElementById("txtTitle").value;
	kh3ui.file.write(kh3ui.title, "title");
	kh3ui.file.metawrite(kh3ui.title, "title", kh3ui.file.name);
	kh3ui.redrawTitle();
}

// ------------------------------
// タイトルを表示に反映
// ------------------------------
kh3ui.redrawTitle = function(){
//	document.title = kh3ui.title;
	document.getElementById("txtTitle").value = kh3ui.title;
	
	// title クラスの要素を書き換え
	var os = document.getElementsByClassName("title");
	for(var i = 0; i < os.length; i ++){
		var o = os[i];
		o.textContent = "Afg国 (1)";
		var bottom = o.getBoundingClientRect().bottom;
		o.textContent = kh3ui.title;
		
		// 2行になってしまわないように詰める
		var tempTitle = kh3ui.title;
		while(o.getBoundingClientRect().bottom != bottom){
			tempTitle = tempTitle.slice(0, -1);
			o.textContent = tempTitle + "...";
		}
	}
}

// ------------------------------
// 編集画面でユーザの操作を反映
// ------------------------------
kh3ui.redrawEditor = function(){
	kh3ui.redrawCounter();
	kh3ui.file.write(document.getElementById("areaSource").value, "textAll");
	kh3ui.file.metawrite(
			document.getElementById("areaSource").value.replace("\\w", " ").substring(0, 100),
			"incipit", kh3ui.file.name
			);
}

// ------------------------------
// フォントサイズの反映(※仮置き)
// ------------------------------
kh3ui.setScaling = function(){
	kh3.setting.magnitude = kh3ui.scale;
	document.getElementById("scaling").innerHTML = "@media print { div.all { transform: scale(" + (1 / kh3ui.scale) + "); transform-origin: left top } }";
}

// ------------------------------
// 印刷
// ------------------------------
kh3ui.print = function(){
	let savedTitle = document.title;
	document.title = kh3ui.title;
	kh3ui.scale = 1.0;
	kh3ui.setScaling();
	kh3ui.clearPages();
	let savedInfiniteColumns = kh3.setting.hasInfiniteColumns;
	kh3.setting.hasInfiniteColumns = false;
	let savedInfiniteLines = kh3.setting.hasInfiniteLines;
	kh3.setting.hasInfiniteLines = false;
	kh3.afterRenderWorks.push(window.print);
	kh3.afterRenderWorks.push(function(){
		kh3ui.scale = 1.0;
		kh3ui.setScaling();
		kh3ui.clearPages();
		document.title = this.savedTitle;
		//kh3.setting.hasInfiniteColumns = savedInfiniteColumns;
		//kh3.setting.hasInfiniteLines = savedInfiniteLines;
		window.setTimeout(kh3ui.resizePreview, 20);
		window.setTimeout(kh3ui.redraw, 30);
	}.bind({savedTitle: savedTitle, saveInfiniteColumns: savedInfiniteColumns, 
			savedInfiniteLines: savedInfiniteLines}));
	
		window.setTimeout(kh3ui.redraw, 30);
}

// ------------------------------
// 画像の取り込み
// ------------------------------
kh3ui.showPics = function(){
	alert("未実装です。");
}
