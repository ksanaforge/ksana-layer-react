var create=function(_text) {
	var caretPos={},pos=0,text=_text;

	caretPos.get=function(){
		return pos;
	}

	var nonstop=function(code) {
		return (code>=0xDC00 && code<=0xDFFF) || (code>=0x0f71 && code<=0x0f87)|| (code>=0x0f8d && code<=0x0fbc);
	}
	var snapNext=function(_pos) {
		if (typeof _pos=="undefined") _pos=pos;
		var code=text.charCodeAt(_pos);
		while (nonstop(code)) {
			_pos++;
			code=text.charCodeAt(_pos);
		}
		return _pos	}
	var snapPrev=function(_pos) {
		if (typeof _pos=="undefined") _pos=pos;
		var code=text.charCodeAt(_pos);
		while (nonstop(code)) {
			_pos--;
			code=text.charCodeAt(_pos);
		}
		return _pos;	
	}	
	caretPos.next=function(_pos){
		pos=snapPrev(_pos);
		pos++;	
		var code=text.charCodeAt(pos);
		while (nonstop(code)) {
			pos++;
			code=text.charCodeAt(pos);
		}
		if (pos>text.length) pos=text.length;
		return pos;
	}
	caretPos.prev=function(_pos) {
		pos=snapNext(_pos);
		pos--;
		var code=text.charCodeAt(pos);
		while (nonstop(code)) {
			pos--;
			code=text.charCodeAt(pos);
		}
		if (pos<0) pos=0;
		return pos;
	}
	return caretPos;
}
module.exports={create:create};