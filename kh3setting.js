
kh3.setValue = function(name, value){
	if(value || value !== void 0 && ! isNaN(value)){
		kh3.setting[name] = value;
	}
}

kh3.setSetting = function(val){
	// 書字方向
	kh3.setValue("isVertical", val("chkIsVertical"));
	
	// 文字サイズと行送り
	if(kh3.setting.zw != val("txtFontSize") * 250){
		kh3.setValue("zw", val("txtFontSize") * 250);
		kh3.setValue("zh", val("txtFontSize") * 250);
		kh3.clearMemoWidth();
		}
	kh3.setValue("lineHeight", val("txtLineHeight") * 250);
	
	// 用紙
	if(kh3.setting.isVertical){
		kh3.setValue("paperWidth", val("txtPaperHeight") * 1000);
		kh3.setValue("paperHeight", val("txtPaperWidth") * 1000);
	}
	else{
		kh3.setValue("paperWidth", val("txtPaperWidth") * 1000);
		kh3.setValue("paperHeight", val("txtPaperHeight") * 1000);
	}

	// 自動延長
	if(kh3.setting.isVertical){
		kh3.setValue("hasInfiniteColumns", val("chkInfinite"));
		kh3.setValue("hasInfiniteLines", false);
	}
	else{
		kh3.setValue("hasInfiniteColumns", false);
		kh3.setValue("hasInfiniteLines", val("chkInfinite"));
	}
	
	// 段組と余白
	if(val("txtColumnCount") <= 1){
		if(kh3.setting.isVertical){
			var marginLeft = val("txtMarginTop") * 1000;
			var marginRight = val("txtMarginBottom") * 1000;
			var l = kh3.setting.paperWidth - marginLeft - marginRight;
			kh3.setValue("lineWidth", Math.floor(l / kh3.setting.zw) * kh3.setting.zw);
			kh3.setValue("offsetLeft", marginLeft);
			
			var marginTop =  val("txtMarginRight") * 1000;
			var marginBottom =  val("txtMarginLeft") * 1000;
			var h = kh3.setting.paperHeight - marginTop - marginBottom;
			kh3.setValue("pageHeight", Math.floor((h - kh3.setting.zh) / kh3.setting.lineHeight) * kh3.setting.lineHeight + kh3.setting.zh);
			kh3.setValue("offsetTop", marginTop + (h - kh3.setting.pageHeight) / 2);
		}
		else{
			var marginLeft = val("txtMarginLeft") * 1000;
			var marginRight = val("txtMarginRight") * 1000;
			var l = kh3.setting.paperWidth - marginLeft - marginRight;
			kh3.setValue("lineWidth", Math.floor(l / kh3.setting.zw) * kh3.setting.zw);
			kh3.setValue("offsetLeft", marginLeft + (l - kh3.setting.lineWidth) / 2);
			
			var marginTop =  val("txtMarginTop") * 1000;
			var marginBottom =  val("txtMarginBottom") * 1000;
			var h = kh3.setting.paperHeight - marginTop - marginBottom;
			kh3.setValue("pageHeight", Math.floor((h - kh3.setting.zh) / kh3.setting.lineHeight) * kh3.setting.lineHeight + kh3.setting.zh);
			kh3.setValue("offsetTop", marginTop);
		}
		kh3.setValue("pageWidth", kh3.setting.lineWidth);
		kh3.setValue("columnOffset", kh3.setting.lineWidth + val("txtColumnMargin") * 250);
	}
	else{
		var columnCount = val("txtColumnCount");
		var marginInside = val("txtColumnMargin") * 250;
		if(kh3.setting.isVertical){
			var marginLeft = val("txtMarginTop") * 1000;
			var marginRight = val("txtMarginBottom") * 1000;
			var l = kh3.setting.paperWidth - marginLeft - marginRight;
			kh3.setValue("lineWidth", Math.floor((l - (columnCount - 1) * marginInside) / columnCount / kh3.setting.zw) * kh3.setting.zw);
			kh3.setValue("offsetLeft", marginLeft);
			kh3.setValue("pageWidth", kh3.setting.lineWidth * columnCount + marginInside * (columnCount - 1));
			kh3.setValue("columnOffset", kh3.setting.lineWidth + marginInside);
			
			var marginTop =  val("txtMarginRight") * 1000;
			var marginBottom =  val("txtMarginLeft") * 1000;
			var h = kh3.setting.paperHeight - marginTop - marginBottom;
			kh3.setValue("pageHeight", Math.floor((h - kh3.setting.zh) / kh3.setting.lineHeight) * kh3.setting.lineHeight + kh3.setting.zh);
			kh3.setValue("offsetTop", marginTop + (h - kh3.setting.pageHeight) / 2);
		}
		else{
			var marginLeft = val("txtMarginLeft") * 1000;
			var marginRight = val("txtMarginRight") * 1000;
			var l = kh3.setting.paperWidth - marginLeft - marginRight;
			kh3.setValue("lineWidth", Math.floor((l - (columnCount - 1) * marginInside) / columnCount / kh3.setting.zw) * kh3.setting.zw);
			kh3.setValue("pageWidth", kh3.setting.lineWidth * columnCount + marginInside * (columnCount - 1));
			kh3.setValue("columnOffset", kh3.setting.lineWidth + marginInside); // 余白重視の場合は (l + marginInside) / columnCount;
			kh3.setValue("offsetLeft", marginLeft + (kh3.setting.paperWidth - kh3.setting.pageWidth - marginLeft - marginRight) / 2); // 余白重視の場合は marginLeft;
			
			var marginTop =  val("txtMarginTop") * 1000;
			var marginBottom =  val("txtMarginBottom") * 1000;
			var h = kh3.setting.paperHeight - marginTop - marginBottom;
			kh3.setValue("pageHeight", Math.floor((h - kh3.setting.zh) / kh3.setting.lineHeight) * kh3.setting.lineHeight + kh3.setting.zh);
			kh3.setValue("offsetTop", marginTop);
		}
		
	}
	
	// フォント
	// MEMO: この仕組みおそらく機能していないので確認して除去
	kh3.setValue("fontName", val("txtFontName"));
	kh3.setValue("rubyfontName", val("txtFontName"));
	kh3.setValue("fontWeight", val("txtFontWeight") * 100);
	kh3.setValue("rubyfontWeight", val("txtRubyWeight") * 100);

	// フォントセット
	kh3.setValue("fontsetIndex", val("selFontset"));
	
	// 字下げ
	kh3.setValue("parIndent", val("chkParIndent")? 1: 0);
	
	// 偶数ページで左右入れ替え
	kh3.setValue("isMirroredWhenEven", val("chkIsMirroredWhenEven"));

	// カンマ・読点修正
	kh3.setValue("correctPunct", val("chkCorrectPunct"));

	// ハイフネーション
	kh3.setValue("hyphenate", val("chkHyphenate"));

	// 句読点のぶら下げ
	kh3.setValue("allowDrop", val("chkAllowDrop"));

	// 句読点のぶら下げ
	kh3.setValue("allowReduction", val("chkAllowReduction"));

	// ノンブルを使用
	kh3.setValue("useNombre", val("chkUseNombre"));

	// ノンブル初期値
	kh3.setValue("nombreInitial", val("txtNombreInitial"));

	// ノンブルの距離
	kh3.setValue("nombreDistance", val("txtNombreDistance") * 1000);

	// ノンブルの位置
	kh3.setValue("nombrePosition", val("selNombrePosition"));

	// アポストロフィの修正
	kh3.setValue("correctApostrophe", val("chkCorrectApostrophe"));

	// 引用符の修正
	kh3.setValue("correctQuotes", val("chkCorrectQuotes"));

}
