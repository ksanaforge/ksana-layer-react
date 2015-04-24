var create=function(_text) {
	var caretPos={},pos=0,text=_text;

	caretPos.get=function(){
		return pos;
	}
	var isSurrogateHigh=function(code) {
		return (code>=0xD800 && code<=0xDBFF);
	}
	var isSurrogateLow=function(code) {
		return (code>=0xDC00 && code<=0xDFFF);
	}
	var snapNext=function(_pos) {
		if (typeof _pos=="undefined") _pos=pos;
		var code=text.charCodeAt(_pos);
		if (isSurrogateHigh(code)) _pos++;
		return _pos	}
	var snapPrev=function(_pos) {
		if (typeof _pos=="undefined") _pos=pos;
		var code=text.charCodeAt(_pos);
		if (isSurrogateLow(code)) _pos--;
		return _pos;	
	}	
	caretPos.next=function(_pos){
		pos=snapPrev(_pos);
		pos++;	
		var code=text.charCodeAt(pos);
		if (isSurrogateLow(code)) pos++;
		if (pos>text.length) pos=text.length;
		return pos;
	}
	caretPos.prev=function(_pos) {
		pos=snapNext(_pos);
		pos--;
		var code=text.charCodeAt(pos);
		if (isSurrogateLow(code)) pos--;
		if (pos<0) pos=0;
		return pos;
	}
	return caretPos;
}
module.exports={create:create};