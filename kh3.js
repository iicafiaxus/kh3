kh3 = {};

kh3.loadScript = function(name){
		var o = document.createElement("script");
		o.src = name;
		document.head.appendChild(o);
};

kh3.loadCheck = function(){ alert("このブラウザは動作対象外です。"); };
window.addEventListener("load", function(){ kh3.loadCheck(); });
kh3.loadScript("kh3loadchecker.js");

kh3.loadScript("kh3unit.js");
kh3.loadScript("kh3rules.js");
kh3.loadScript("kh3setting.js");

// 設定項目 ※長さの単位はミクロン
kh3.setting = {
	zh: 12 * 250,
	zw: 12 * 250,
	lineHeight: 20 * 250,
	lineWidth: 17 * 12 * 250,
	pageWidth: 38 * 12 * 250,
	pageHeight: 15 * 20 * 250 + 12 * 250,
	paperWidth: 148 * 1000,
	paperHeight: 100 * 1000,
	offsetLeft: 12 * 1000,
	offsetTop : 11 * 1000,
	columnOffset: 21 * 12 * 250,
	isVertical: true,
	magnitude: 1.0,
	fontName: "serif",
	fontWeight: 400,
	rubyfontName: "serif",
	rubyfontWeight: 800,
	hasInfiniteColumns: false,
	parIndent: 1,
	correctPunct: false,
};

// 内部状態など
// タイマーで起動されるのでここで管理する
kh3._render = {
	left: 0,
	top: 0,
	unit: void 0,
};

// 組版の終了後に呼ばれるものたち
kh3.afterRenderWorks = [];

// 全体の組版
kh3.render = function(divTarget, textAll, canSaveText){

	/*
	// テキストの相違を検出
	var diffPoint = 0;
	while(diffPoint < textAll.length && diffPoint < this._render.oldText.length &&
			textAll.charAt(diffPoint) == this._render.oldText.charAt(diffPoint)) diffPoint += 1;
	
	// 更新が必要な最初のテキスト行番号
	var diffLineNo = textAll.substring(0, diffPoint).split("\n").length - 1;
	*/
	// 本当はdiffLineNo以降のみの更新にするのだがまだ作成中なので殺してる
	diffLineNo = 0;

	// 既存のページを削除
	this.clearPages(divTarget, diffLineNo);
	
	// 進行中の組版があれば中止
	if(this._render.timer){
		window.clearTimeout(this._render.timer);
		this._render.timer = void 0;
	}
	
	// 旧テキストを退避
	if(canSaveText) this._render.oldText = textAll;


	// テキストを読み込み
	this._render.textLines =  textAll.split("\n").slice(diffLineNo);
	this._render.textLineOffset = diffLineNo;
	this._render.index = 0;
	
	// 起動
	if(this._render.textLines.length > 0) this.rendermain();
	
}

// 全体の組版の本体
kh3.rendermain = function(){

	// フォントの読み込み待ちを開始
	if( ! this._render.fontLoadStarted || this._render.loadedFontsetIndex != this.setting.fontsetIndex){
		if(this.font && this.font.names){
			for(var i = 0; i < this.font.names.length; i ++) this.font.load(this.font.names[i], this.setting.fontsetIndex);
		}
		else this.font = { waitcount: 0 };
		this._render.fontLoadStarted = 1;
		this._render.loadedFontsetIndex = this.setting.fontsetIndex;
		window.setTimeout(this.rendermain.bind(this), 200);
		return;
	}
	if(this.font.waitcount > 0){
		window.setTimeout(this.rendermain.bind(this), 200);
		return;
	}
	
	// フォント設定を反映
	this.resetFont();
	
	// テスト用DOMを作成
	this._render.testspan = document.createElement("span");
	this._render.testspan.className = "char testspan";
	this._render.divFace.appendChild(this._render.testspan);
	this._render.rubytestspan = document.createElement("span");
	this._render.rubytestspan.className = "char ruby testspan";
	this._render.testspan.appendChild(this._render.rubytestspan);
	
	// ピクセルとミクロンの換算単位を取得する
	this._render.testspan.textContent = "花";
	this._render.unit = this._render.testspan.getBoundingClientRect()[this.setting.isVertical? "height": "width"];
	this._render.rubytestspan.textContent = "は";
	this._render.testspan.appendChild(this._render.rubytestspan);
	this._render.rubyunit = this._render.rubytestspan.getBoundingClientRect()[this.setting.isVertical? "height": "width"];
	
	// ToDo: いつの間にかルビの換算単位が取得できなくなっているので修正する

	// 換算単位が取得できていなかったらやり直し
	// 現在は殺してある
	if(0){
		console.log("フォントが読み込めていなかったため再描画します");
		(x => x.parentNode && x.parentNode.removeChild(x))(this._render.testspan);
		(x => x.parentNode && x.parentNode.removeChild(x))(this._render.rubytestspan);
		window.setTimeout(this.rendermain.bind(this), 200);
		return;
	}

	// 行送り位置
	this._render.top = 0;

	// 囲み罫の状態
	this._render.isRuling = 0;
	this._render.isRuled = 0;

	// インデント位置
	this._render.leftindent = 0;
	this._render.rightindent = 0;

	// 名前づけられたインデント位置
	this._render.indentmap = {};

	// 段落の組版を起動
	this._render.timer = window.setTimeout(this.parrender.bind(this), 10);
	
};

// 用紙の作成
kh3.clearPages = function(divTarget, lineNo){
	
	// 縦書き・横書きの設定を反映
	this.setPosition = (this.setting.isVertical? this.setPositionVertical: this.setPositionHorizontal);
	
	// 誌面のクリアと作成
	if(this._render.divTarget){
		/*
		作成中:部分削除をしたい
		for(var face of this._render.divTarget.childNodes){
			this.clearLines(face, lineNo);
			if(face.childNodes.length == 0) this.removeChild(face);
		}
		*/
		this._render.divTarget.innerHTML = "";
	}
	this._render.divTarget = divTarget;
	this._render.divTarget.innerHTML = "";
	this.newpage();
	
};


// 段落の組版
// これはsetTimeoutからタイマーで起動される想定
kh3.parrender = function(){
	
	// フォントがロードされていなかったら再度
	if(this.font.waitcount > 0){
		kh3._render.timer = window.setTimeout(this.parrender.bind(this), 200);
		return;
	}
	
	this._render.parTarget = document.createElement("p");
	this._render.divFace.appendChild(this._render.parTarget);
	
	// 処理中の行およびタブ
	var line = { units: [] };
	var tab = { units: [] };
	
	// ダミーユニット
	var blank = new kh3.Unit("");
	
	// 行頭行末の番兵
	if(! kh3.linesep){
		kh3.linesep  = new kh3.Unit("\n");
		kh3.linesep.lastchar = kh3.linesep.firstchar = "\n";
	}
	
	var lastunit = blank;
	
	// 右ボックスインデントがあったときはカウントを減らす
	if(this._render.rightboxcount > 0){
		this._render.rightboxcount -= 1;
		if(this._render.rightboxcount <= 0){
			this._render.rightboxindent = 0;
		}
	}

	// インデント
	var leftindent = this._render.leftindent || 0;
	var rightindent = (this._render.rightindent || 0) + (this._render.rightboxindent || 0);
	var left = leftindent + this.setting.parIndent * this.setting.zw;
	var isCentered = 0;
	var isRighted = 0;
	
	var waitingIndentName = "";

	// 囲み内の場合はインデントを調整
	if(this._render.isRuled){
		left += this.setting.zw;
		leftindent += this.setting.zw;
		rightindent += this.setting.zw;
	}
	
	// テキストを読み込んで単語に切り分け
	var text = this.preprocess(this._render.textLines[this._render.index] );
	var units = this.parse(text);

	var insertedUnitStack = [];
	var prevUnit = void 0, nextUnit = void 0;
	
	var font = "main";
	var pos = "";
	
	// 単語間のアキなどを計算(TODO)
	
	// 単語の組版
	for(var i = 0; i < units.length || insertedUnitStack.length; ){
		var unit;
		if(insertedUnitStack.length){
			unit = insertedUnitStack.pop();
			unit.prev = prevUnit; // may be void 0
			unit.next = (x => x[x.length - 1])(insertedUnitStack) || units[i]; // may be void 0
			prevUnit = unit;
		}
		else{
			unit = units[i];
			unit.prev = prevUnit; // may be void 0
			unit.next = units[i + 1]; // may be void 0
			prevUnit = unit;
			i ++;
		}

		// コマンドの処理
		if(unit.command == "page"){
			this.newline(line.units);
			this.newpage();
			continue;
		}
		if(unit.command == "column"){
			this.newline(line.units);
			this.newcolumn();
			continue;
		}
		if(unit.command == "center"){
			if(line.units.length > 0){
				if(! isCentered && ! isRighted){
					tab.units = [];
					lastunit = blank;
				}
				else continue;
			}
			isCentered = true;
			continue;
		}
		if(unit.command == "right"){
			if(line.units.length > 0){
				if(! isCentered && ! isRighted){
					tab.units = [];
					lastunit = blank;
				}
				else continue;
			}
			isRighted = true;
			continue;
		}
		if(unit.command == "indent"){
			if(! isNumeric(unit.value) && unit.value in this._render.indentmap)
					unit.value = this._render.indentmap[unit.value];
			if(! isNumeric(unit.value2) && unit.value2 in this._render.indentmap)
					unit.value2 = this._render.indentmap[unit.value2];
			if(! isNumeric(unit.value3) && unit.value3 in this._render.indentmap)
					unit.value3 = this._render.indentmap[unit.value3];

			if(line.units.length > 0){
				if(! isCentered && ! isRighted){
					if(left >= leftindent + +unit.value * this.setting.zw) this.newline(line.units);
					tab.units = [];
					lastunit = blank;
				}
				else continue;
			}

			left = leftindent + +unit.value * this.setting.zw;
			if(isNumeric(unit.value2)) leftindent = +unit.value2 * this.setting.zw;
			if(isNumeric(unit.value3)) rightindent = +unit.value3 * this.setting.zw;

			if(unit.isLong){
				this._render.leftindent = leftindent;
				this._render.rightindent = rightindent;
				this._render.parindent = left;
			}

			continue;
		}
		if(unit.command == "setindent"){
			waitingIndentName = unit.value;
			continue;
		}
		if(unit.command == "rightbox"){
			if(isNumeric(unit.value) && isNumeric(unit.value2)){
				this._render.isRightboxing = 1;
				this._render.rightboxindent = this._render.rightindent + unit.value * this.setting.zw;
				this._render.rightboxcount = +unit.value2 + 1;
				rightindent += this._render.rightboxindent;
				// この場合は行をすべて戻す
			}
			continue;
		}
		if(unit.command == "ruled"){
			if(unit.value){
				this.openRule();
				this._render.isRuling = 1;
				leftindent = this.setting.zw;
				rightindent = this.setting.zw;
			}
			else{
				this._render.isRuling = 0;
				this._render.isRuled = 0;
				this.closeRule();
			}
			this._render.nobreak = 0;
			continue;
		}
		if(unit.command == "underline"){
			this._render.underline = unit.value;
			this._render.underlinepos = unit.value && unit.value2;
			continue;
		}
		if(unit.command == "nolf"){
			this._render.hasNoLinefeedHere = 1;
			continue;
		}
		if(unit.command == "meta"){
			switch(unit.metaname){
				case "page":
					unit.char = "" + this._render.divTarget.childNodes.length;
					unit.firstchar = unit.char.charAt(0);
					unit.lastchar = unit.char.charAt(unit.char.length - 1);
					break;
				default:
					unit.char = unit.metaname;
					unit.firstchar = unit.char.charAt(0);
					unit.lastchar = unit.char.charAt(unit.char.length - 1);
			}
		}
		if(unit.command == "font"){
			if(unit.value != "") font = unit.value;
			else font = "main";
			if(unit.zwsp && unit.prev) unit.firstchar = "";
			continue;
		}
		if(unit.command == "pos"){
			if(unit.value != "") pos = unit.value;
			else pos = "";
			if(unit.zwsp && unit.prev) unit.firstchar = "";
			continue;
		}
		
		// 実文字があったので空行ではない
		this._render.nobreak = 0;
		
		// 下線範囲内ならば下線を付加
		unit.underline = this._render.underline;
		unit.underlinepos = unit.underline && this._render.underlinepos;
		
		// DOM作成
		unit.makeDom();
		this._render.parTarget.appendChild(unit.span);
		
		// コマンド処理(その2)
		if(unit.command == "rotate"
			|| unit.forceRotate 
			|| unit.canRotate && unit.isAlphanumeric && !(unit.prev && unit.prev.isAlphanumeric) && !(unit.next && unit.next.isAlphanumeric)
			){
			if(kh3.setting.isVertical){
				if(unit.forceRotate || unit.width < this.setting.lineHeight){ // 縦中横
					unit.rotate();
				}
				else if(unit.canRotateVertical){ // 縦中縦
					// 1 文字ずつの Unit に分解する
					for(var irot = unit.char.length - 1; irot >= 0; irot --){
						var verticalUnit = new kh3.Unit(unit.char.charAt(irot));
						verticalUnit.forceRotate = 1;
						verticalUnit.isAlphaNumeric = 0;
						insertedUnitStack.push(verticalUnit);
					}
					// 処理中の Unit は捨てる
					if(unit.span) unit.span.parentNode.removeChild(unit.span);
					prevUnit = unit.prev;
					continue;

				}
			}
		}
		
		
		// ルビの計算
		unit.setRuby();
		
		// 前のunitからのアキ
		unit.margin = lastunit.marginTo(unit);
		unit.sepratio = lastunit.sepTo(unit);

		// 行への追加、タブへの追加
		line.units.push(unit);
		tab.units.push(unit);
		
		// 改行の必要がある場合...
		if(left + unit.margin + unit.width + unit.marginTo(kh3.linesep) + rightindent > this.setting.lineWidth){
			
			// 直近で改行可能な位置を探す(＝追い出し処理)
			var isp;
			for(isp = tab.units.length - 1; isp >= 2; isp --){
				if(tab.units[isp - 1].canBreakBetween(tab.units[isp])) break;
			}
			
			// 改行直前直後のユニット
			var unitbefore = tab.units[isp - 1];
			var unitafter = tab.units[isp];
			prevUnit = unitbefore;

			// 行頭行末を設定
			if(unitbefore) unitbefore.isTerminal = 1;
			unitafter.isInitial = 1;

			// 改行することになった位置以降を次行に送る
			while(tab.units.length > isp){
				var u = tab.units.pop();
				line.units.pop();
				if(u.span) u.span.parentNode.removeChild(u.span);
				left -= u.width + u.margin;
				insertedUnitStack.push(u);
			}
			
			// 減じすぎているので調整
			left += unit.width + unit.margin;

			// 改行位置が句読点などだった場合の調整
			if(unitbefore) left += unitbefore.marginTo(kh3.linesep);
			
			// 追い出しに伴う均等割り
			var sepcount = 0;
			for(u of tab.units) sepcount += u.sepratio;
			if(sepcount == 0) sepcount = 1;
			var k = (this.setting.lineWidth - left - rightindent) / sepcount;
			var ksum = 0;
			for(u of tab.units){
				ksum += k * u.sepratio;
				u.left += ksum;
			}

			// 復帰と改行
			left = leftindent + kh3.linesep.marginTo(unitafter);
			this.newline(line.units);
			lastunit = kh3.linesep;
			
			// 行内容・タブ内容のリセット
			line.units = [];
			line.prevHeightUnder = line.heightUnder;
			tab.units = [];

			// 右ボックスインデントがあったときはカウントを減らす
			if(this._render.rightboxcount > 0){
				this._render.rightboxcount -= 1;
				this._render.isRightboxing = 0;
				if(this._render.rightboxcount <= 0){
					rightindent -= this._render.rightboxindent;
					this._render.rightboxindent = 0;
				}
			}

			// このときはDOMを作成しない(iを戻したので)
			continue;
		}
		
		// 位置を反映
		if(left > 0 && unit.margin) left += unit.margin;
		unit.left = this._render.left + left;
		unit.top = this._render.top;
		
		// インデント位置を記憶
		if(waitingIndentName){
			this._render.indentmap[waitingIndentName] = (left - leftindent) / this.setting.zw;
			waitingIndentName = "";
		}

		// 等号だった場合もインデント位置として記憶
		if(unit.char == "="){
			this._render.indentmap["="] = (left - leftindent) / this.setting.zw;
		}

		// 次のユニットへ
		left += unit.width;
		lastunit = unit;
		
	}
	
	// センタリング
	if(isCentered){
		var excess = (this.setting.lineWidth - rightindent - left) / 2;
		if(excess > 0) for(unit of tab.units) unit.left += excess;
	}
	// 末尾寄せ
	if(isRighted){
		var excess = this.setting.lineWidth - rightindent - left;
		if(excess > 0) for(unit of tab.units) unit.left += excess;
	}
	
	
	// 段落末で改行する
	this.newline(line.units);
	
	// 後処理
	if(++this._render.index < this._render.textLines.length){
		
		// スクロール位置の復元(ここでやるべきではない気もするが…)
		window.scroll(this.scrollX, this.scrollY);
		
		// まだ残っている段落があるので組版を起動しておく
		// ※途中経過を見せるために一旦処理を返している
		kh3._render.timer = window.setTimeout(this.parrender.bind(this), 0);
	}
	else{
		// 段落がなくなったので終了処理
		
		// 白紙のページができてしまっていたらそれは削除
		if(this._render.divPaper.textContent == "") this._render.divPaper.parentNode.removeChild(this._render.divPaper);
		
		// テスト用(採寸用)のspanを削除
		if(this._render.testspan.parentNode) this._render.testspan.parentNode.removeChild(this._render.testspan);
		
		// 組版終了後にやる処理があればそれをやる
		for(f of this.afterRenderWorks) f();
		this.afterRenderWorks = [];

	}
	
};


// フォント設定を書き込み
kh3.resetFont = function(){
	var size = this.setting.zh * this.setting.magnitude / 1000;
	
	if(! document.getElementById("fontfamily")){
		var style = document.createElement("style");
		style.id = "fontfamily";
		document.head.appendChild(style);
	}
	document.getElementById("fontfamily").innerHTML = ".all{ font-family:" + '"' + this.setting.fontName + '"' + " }" + 
			"\n" + "span.char { font-weight: " + this.setting.fontWeight + " }" + 
			"\n" + "span.ruby { font-weight: " + this.setting.rubyfontWeight + " }" + 
			"\n" + "span.char { font-size: " + size + "mm; line-height: " + size + "mm }" +
			"\n" + "span.ruby { font-size: " + (size / 2) + "mm; line-height: " + (size / 2) + "mm }";
	// MEMO: この部分↑おそらく機能してないのでトルでよさそう
	
	if(this.font && this.font.reset) this.font.reset(size, this.setting.fontsetIndex);
}
// 幅(micron)を取得
kh3._memoWidth = {};
kh3.getWidth = function(text, unit, zw, prefix){
	var key = prefix + "|" + text;
	if(this._memoWidth[key] === void 0){
		var span = this._render.testspan;
		if(prefix == "ruby"){
			span = this._render.rubytestspan;
			this._render.testspan.appendChild(this._render.rubytestspan);
		}
		span.className += " " + prefix;
		if(text.match(/[^\u3000-\u30ff\u4e00-\u9fcf\uff00-\uffef ]/)){
			span.textContent = "|||" + text + "|||";
			var width;
			if(this.setting.isVertical) width = span.getBoundingClientRect().height / unit * zw;
			else width = span.getBoundingClientRect().width / unit * zw;
			if(text == "|||") this._memoWidth[key] = width / 3;
			else this._memoWidth[key] = width - 2 * this.getWidth("|||", unit, zw, prefix)
		}
		else{
			var f = (/sub|sup/.test(prefix)? 0.7: 1.0); // とりあえず…
			this._memoWidth[key] = text.length * zw * f;
		}
		span.className = span.className.replace(" " + prefix, "");
	}
	var res = this._memoWidth[key];
	if(! (res > 0)) this._memoWidth[key] = void 0;
	return res;
};

// 幅のメモを消去
kh3.clearMemoWidth = function(){
	this._memoWidth = {};
}

// オブジェクトの位置を設定（横書き用）
kh3.setPositionHorizontal = function(dom, left, top, width, height, spacing){
	var r = this.setting.magnitude / 1000; // micron -> mm
	if(left !== void 0) dom.style.left = (left * r) + "mm";
	if(top !== void 0) dom.style.top = (top * r) + "mm";
	if(width !== void 0) dom.style.width= (width * r) + "mm";
	if(height !== void 0) dom.style.height = (height * r) + "mm";
	if(spacing !== void 0) dom.style.letterSpacing = (spacing * r) + "mm";
}
kh3.setPosition = kh3.setPositionHorizontal;

// オブジェクトの位置を設定（たて書き用）
kh3.setPositionVertical = function(dom, left, top, width, height, spacing){
	var r = this.setting.magnitude / 1000; // micron -> mm
	dom.style.top = (left * r) + "mm";
	dom.style.right = (top * r) + "mm";
	if(width !== void 0) dom.style.height = (width * r) + "mm";
	if(height !== void 0) dom.style.width = (height * r) + "mm";
	if(spacing !== void 0) dom.style.letterSpacing = (spacing * r) + "mm";
}

// 改行
kh3.newline = function(units = []){
	if(this._render.nobreak){
		this._render.nobreak = 0;
		return;
	}
			
	// span を配置
	for(unit of units) unit.setPosition();

	// 自由行送りの場合の行間隔を調整
	// （ここでは強制的に自由行送りにしている）
	var heightOver = 0;
	for(unit of units){
		heightOver = Math.max(heightOver, unit.middle - this.setting.zh / 2);
	}
	if(heightOver < (this.setting.lineHeight - this.setting.zh) / 2) heightOver = 0;

	for(unit of units) unit.top += heightOver + this.setting.zh / 2 - unit.middle, unit.setPosition();
	this._render.top += heightOver;
	
	// 自由行送りの場合、次行との間隔を調整
	var heightUnder = 0
	for(unit of units){
		heightUnder = Math.max(heightUnder, (unit.height - unit.middle) - this.setting.zh / 2);
	}
	if(heightUnder < (this.setting.lineHeight - this.setting.zh) / 2) heightUnder = 0;

	// 囲みの内部である場合は罫を引く
	if(this._render.isRuling) this._render.isRuling = 0, this._render.isRuled = 1;
	else if(this._render.isRuled) this.drawRule(heightOver, heightUnder);

	// 右ボックスがある場合も罫を引く
	// 囲みの内部だった場合の扱いは暫定(rightindentが反映されてこないので…)
	var rightboxleft = this.setting.lineWidth - this._render.rightindent - this._render.rightboxindent;
	if(this._render.isRuled) rightboxleft -= this.setting.zw;
	if(this._render.isRightboxing){
		this.openRule(rightboxleft, this._render.rightboxindent, 0);
	}
	else if(this._render.rightboxcount > 1){
		this.drawRule(heightOver, heightUnder, rightboxleft, this._render.rightboxindent);
	}
	else if(this._render.rightboxcount == 1){
		this.closeRule(rightboxleft, this._render.rightboxindent, 0);
	}
	
	// 下線があれば下線を引く
	var uleft, udepth, umiddle;
	for(unit of units){
		if(unit.underline > 0){
			if(unit.isInitial || !unit.prev || unit.prev.underline != unit.underline || unit.prev.underlinepos != unit.underlinepos){
				uleft = unit.left;
				udepth = unit.height - unit.middle;
				umiddle = unit.middle;
			}
			else{
				udepth = Math.max(udepth, unit.height - unit.middle);
				umiddle = Math.max(umiddle, unit.middle);
			}
			if(unit.isTerminal || !unit.next || unit.next.underline != unit.underline || unit.next.underlinepos != unit.underlinepos){
				var uname = {
					"2": {weight: 500, style: "solid"},
					"3": {weight: 500, style: "double"},
					"4": {weight: 125, style: "solid"},
					"5": {weight: 250, style: "dotted"}
				}[unit.underline] || {weight: 250, style: "solid"};
				var upos = {
					"0": [0, 0, 0, 0],
					"2": (this.setting.isVertical? [0, 0, 1, 0]: [1, 0, 0, 0]),
					"3": [1, 0, 1, 0],
					"4": [1, 1, 1, 1],
					"5": [0, 0, 1, 0],
					"6": [1, 0, 0, 0]
				}[unit.underlinepos] || (this.setting.isVertical? [1, 0, 0, 0]: [0, 0, 1, 0]);
				var umargin = {
					"4": kh3.setting.zw / 4 + uname.weight / 2
				}[unit.underlinepos] || 0;
				var uwidth = {
					"4": unit.left + unit.width - uleft + kh3.setting.zw / 2 - uname.weight
				}[unit.underlinepos] || (unit.left + unit.width - uleft);
				if(unit.marginTo(kh3.linesep) < 0) uwidth += unit.marginTo(kh3.linesep);
				this.drawBox(
					uleft - umargin, unit.top + unit.middle - umiddle - kh3.setting.zh * 0.125 - uname.weight / 2,
					uwidth, udepth + umiddle + kh3.setting.zh * 0.25,
					upos[0], upos[1], upos[2], upos[3], uname.weight, uname.style
				);
			}
		}
	}

	// ラインフィード（無限改行の場合は自由行送りとする）
	// （本当は無限改行と自由行送りは別々の設定項目にするのがよさそう）
	var linefeed = this.setting.lineHeight;
	if(! this._render.hasNoLinefeedHere) this._render.top += linefeed + heightUnder;
	this._render.hasNoLinefeedHere = 0;

	// 行数がオーバーしていれば改段または段延長
	if(this._render.top + this.setting.zh > this.setting.pageHeight){
		if(! this.setting.hasInfiniteLines){
			kh3.newcolumn();
		}
		else{
			this.extendColumn(this.setting.lineHeight + heightOver + heightUnder);
		}
	}
	
	
}

// 改段
kh3.newcolumn = function(){
	
	// 段数がオーバーしていれば改ページまたはページ延長
	if(this._render.left + this.setting.columnOffset + this.setting.lineWidth > this._render.pageWidth){
		if(! this.setting.hasInfiniteColumns){
			this.newpage();
			this._render.parTarget = document.createElement("p");
			this._render.divFace.appendChild(this._render.parTarget);
			return;
		}
		else{
			this.extendPage();
		}
	}
	
	this._render.top = 0;
	this._render.left += this.setting.columnOffset;
	
	this._render.nobreak = 1;
}

// 改ページ
kh3.newpage = function(){
	this._render.divPaper = document.createElement("div");
	this._render.divPaper.className = "paper";
	this._render.divTarget.appendChild(this._render.divPaper);
	this._render.paperWidth = this.setting.paperWidth;
	this._render.paperHeight = this.setting.paperHeight;
	this.setPosition(this._render.divPaper, 
			void 0, void 0, 
			this._render.paperWidth, this._render.paperHeight
	);
	
	this._render.divFace = document.createElement("div");
	this._render.divFace.className = "face";
	this._render.divPaper.appendChild(this._render.divFace);
	this._render.pageWidth = this.setting.pageWidth;
	this.setPosition(this._render.divFace, 
			this.setting.offsetLeft, this.setting.offsetTop, 
			this.setting.lineWidth, this.setting.pageHeight
	);
	
	this._render.top = 0;
	this._render.left = 0;
	this._render.heightUnder = 0;
	this._render.nobreak = 1;
}

//  段延長
kh3.extendColumn = function(lineHeight = this.setting.lineHeight){
	this._render.paperHeight += lineHeight;
	this._render.pageHeight += lineHeight;
	this.setPosition(this._render.divPaper, void 0, void 0, 
		this._render.paperWidth, this._render.paperHeight);
}

// ページ延長
kh3.extendPage = function(){
	this._render.paperWidth += this.setting.columnOffset;
	this._render.pageWidth += this.setting.columnOffset;
	this.setPosition(this._render.divPaper, void 0, void 0, 
		this._render.paperWidth, this._render.paperHeight);
}

// 囲みの開始の書き込み
kh3.openRule = function(left = this._render.left, width = this.setting.lineWidth, margin = this.setting.zw / 2){
	kh3.drawBox(
		left + this.setting.zw / 2,
		this._render.top + margin,
		width - this.setting.zw,
		this.setting.lineHeight / 2 + this.setting.zw / 2 - margin,
		1, 1, 0, 1
	);
}

// 囲みの終了の書き込み
kh3.closeRule = function(left = this._render.left, width = this.setting.lineWidth, margin = this.setting.zw / 2){
	kh3.drawBox(
		left + this.setting.zw / 2,
		this._render.top - this.setting.lineHeight / 2 + this.setting.zw / 2,
		width - this.setting.zw,
		this.setting.lineHeight / 2 + this.setting.zw / 2 - margin,
		0, 1, 1, 1
	);
}

// 囲みの途中
kh3.drawRule = function(heightOver = 0, heightUnder = 0, left = this._render.left, width = this.setting.lineWidth){
	kh3.drawBox(
		left + this.setting.zw / 2,
		this._render.top - heightOver - (this.setting.lineHeight - this.setting.zw) / 2,
		width - this.setting.zw,
		this.setting.lineHeight + heightOver + heightUnder,
		0, 1, 0, 1
	);
}


// 罫線の作成
kh3.drawBox = function(left, top, width, height, hast, hasr, hasb, hasl, weight, style){
	var borderWidth = (weight || 250) * this.setting.magnitude / 1000;
	style = style || "solid";
	if(hast === void 0) hast = 1;
	if(hasr === void 0) hasr = hast;
	if(hasb === void 0) hasb = hast;
	if(hasl === void 0) hasl = hasr;
	var csshast = this.setting.isVertical? hasl: hast;
	var csshasr = this.setting.isVertical? hast: hasr;
	var csshasb = this.setting.isVertical? hasr: hasb;
	var csshasl = this.setting.isVertical? hasb: hasl;
	var div = document.createElement("div");
	this._render.divFace.insertBefore(div, this._render.parTarget);
	div.style.pointerEvents = "none";
	div.style.zIndex = 990;
	div.style.position = "absolute";
	if(csshast) div.style.borderTop = borderWidth + "mm " + style + " #000";
	if(csshasr) div.style.borderRight = borderWidth + "mm " + style + " #000";
	if(csshasb) div.style.borderBottom = borderWidth + "mm " + style + " #000";
	if(csshasl) div.style.borderLeft = borderWidth + "mm " + style + " #000";
	this.setPosition(div, left, top, width, height);
}



// テキストの前処理
// この関数は適宜上書きすること
kh3.preprocess = function(text){
	
	// ルビ
	var rubyindex = 1;
	var rubypreprocess = function(mains, rubys){
		var res = "";
		for(var i = 0; i < mains.length; i ++){
			res += "{[" + mains[i] + "]" + rubys[i] + "]" + rubyindex + "}";
		}
		rubyindex += 1;
		return res;
	}
	text = text.replace(/\{=([^\}]*)\}/g, "{[$1]}");
	text = text.replace(/(.)\{\[([^ \]]*)\]\}/g, 
			function(match, p1, p2){ return rubypreprocess([p1], [p2]); });
	text = text.replace(/(.)(.)\{\[([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4){ return rubypreprocess([p1, p2], [p3, p4]); });
	text = text.replace(/(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6){ return rubypreprocess([p1, p2, p3], [p4, p5, p6]); });
	text = text.replace(/(.)(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6, p7, p8){ return rubypreprocess([p1, p2, p3, p4], [p5, p6, p7, p8]); });
	text = text.replace(/(.)(.)(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10){ return rubypreprocess([p1, p2, p3, p4, p5], [p6, p7, p8, p9, p10]); });
	text = text.replace(/(.)(.)(.)(.)(.)(.)\{\[([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*) ([^ \]]*)\]\}/g, 
			function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12){ return rubypreprocess([p1, p2, p3, p4, p5, p6], [p7, p8, p9, p10, p11, p12]); });
	
	// 行頭
	text = text.replace(/^([「（‘“［【『〈《〔])/g, "{<}$1");
	
	// 縦書き用の約物
	if(this.setting.isVertical){
		text = text.replace(/…/g, "︙");
		text = text.replace(/‥/g, "︰");
		text = text.replace(/“/g, "〝");
		text = text.replace(/”/g, "〟");
		text = text.replace(/，/g, "、");
		text = text.replace(/．/g, "。");
	}
	
	// 三点リーダ、二点リーダ
	text = text.replace(/……?/g, "{……}");
	text = text.replace(/︙︙?/g, "{︙︙}");
	text = text.replace(/‥‥?/g, "{‥‥}");
	text = text.replace(/︰︰?/g, "{︰︰}");
	text = text.replace(/――?/g, "{――}");
	
	return text;
	}

// テキストを単語にバラす
// この関数は適宜上書きすること
kh3.parse = function(text){
	var res = [];
	var font = "main", pos = "", isInWord = false;
	for(var i = 0; i < text.length; i ++){
		var o = new kh3.Unit(text.charAt(i));
		while(o.char.match(/\s/)) o.char = text.charAt(++i);
		if(o.char == "{"){
			var commandtext = "";
			while(i + 1 < text.length && text.charAt(i + 1) != "}"){
				commandtext = commandtext + text.charAt(++i);
			}
			i += 1;
			if(commandtext.length > 0){
				command = commandtext[0];
				o.command = "", o.char = commandtext;
				switch(command){
					case "(":
						o.char = "{";
						break;
					case ")":
						o.char = "}";
						break;
					case "[":
						operands = commandtext.substring(1).split("]");
						if(operands.length >= 2){
							o.char = operands[0];
							o.ruby = operands[1];
							o.rubyid = (operands.length >= 2? operands[2]: 0);
						}
						break;
					case ":":
						operands = commandtext.substring(1).split(":");
						if(operands.length == 0) o.command = "", o.char = ":";
						else switch (operands[0]){
							case "page":
								o.command = "page", o.char = "";
								break;
							case "column":
								o.command = "column", o.char = "";
								break;
							case "noindent":
								o.command = "indent", o.value = "0", o.char = "";
								break;
							case "indent":
								o.command = "indent";
								o.value = (isNumeric(operands[1])? +operands[1]: 1);
								o.value2 = (isNumeric(operands[2])? +operands[2]: 0);
								o.value3 = (isNumeric(operands[3])? +operands[3]: 0);
								o.char = "";
								break;
							case "center":
								o.command = "center", o.char = "";
								break;
							case "rot":
							case "rotate":
							case "rotated":
								o.command = "rotate", o.char = (operands.length > 1? operands[1]: "");
								break;
							default:
								console.log("Unknown command " + o.command);
								o.command = void 0, o.char = commandtext;
						}
						break;
					case "<":
						 o.command = "indent", o.value = 0, o.char = "";
						break;
					case ">":
						operand = commandtext.substring(1);
						o.command = "indent", o.value = (isNumeric(operand)? +operand: 1), o.char = "";
						break;
					case "$":
						operand = commandtext.substring(1);
						o.command = "meta", o.metaname = operand, o.char = "";
						break;
					default:
					
				}
			}
		}
		else{
			while(i + 1 < text.length && text.charAt(i + 1) != "{"
					&& text.charAt(i).match(/[0-9A-Za-zα-ωΑ-Ω\-\(',\.]/)
					&& text.charAt(i + 1).match(/[0-9A-Za-zα-ωΑ-Ω\-\)',\.]/)
					){
				o.char = o.char + text.charAt(++i);
			}
		}
		
		if(o.isMetacommand) continue;
		
		o.firstchar = o.char.length > 0? o.char.charAt(0): "";
		o.lastchar =  o.char.length > 0? o.char.charAt(o.char.length - 1): "";
		
		o.font = font;
		o.pos = pos;
		if(isInWord){
			isInWord = 0;
			o.firstchar = ""; // "|"
			o.isAttached = 1;
//			if(res.length) res[res.length - 1].lastchar = "|";
		}
		
		o.isAlphanumeric = !!o.char.match(/^[!-~]+$/);
		
		res.push(o);
	}
	
	return res;
}

// 数表記であるか確認
// 10 -> true, "10" -> true, "10A" -> false
// https://stackoverflow.com/questions/9716468/pure-javascript-a-function-like-jquerys-isnumeric
function isNumeric(x) {
    return Number(parseFloat(x)) == x;
}
