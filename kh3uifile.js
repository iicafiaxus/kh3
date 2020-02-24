kh3ui.file = {};

kh3ui.file.name = "__default";

kh3ui.file.loaders = [];
kh3ui.file.savers = [];

kh3ui.file._read = function(name, ...subnames){
	var itemname = "kh3ui_" + name + "_"  + subnames.join("_");
	return window.localStorage.getItem(itemname);
}
kh3ui.file.read = function(...subnames){
	return this._read(this.name, ...subnames);
}
kh3ui.file.metaread = function(...subnames){
	return this._read("__meta", ...subnames);
}

kh3ui.file._write = function(value, name, ...subnames){
	var itemname = "kh3ui_" + name + "_"  + subnames.join("_");
	return window.localStorage.setItem(itemname, value);
}
kh3ui.file.write = function(value, ...subnames){
	return this._write(value, this.name, ...subnames);
}
kh3ui.file.metawrite = function(value, ...subnames){
	return this._write(value, "__meta", ...subnames);
}

kh3ui.file.load = function(name){
	this.name = name;
	this.reload();
}

kh3ui.file.reload = function(){
	for(var loader of this.loaders){
		loader();
	}
}


/*
セーブはセーブすべき事象が発生した都度、writeでセーブする
ロードは一括
なのでロード時に復元すべき項目はloaderに追加しておくこと


*/
