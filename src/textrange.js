/**
	Combining multiple range
*/
var create=function() {
	var textrange={};
	var _ranges=[];

	var removeOverlap=function(start,len) {
		var overlap=[];
		_ranges=_ranges.filter(function(r){
			if (r[0]>start+len || r[0]+r[1]<start) return true;
			else {
				overlap.push(r);
				return false;
			}
		});
		return overlap;
	}
	var combine=function(ranges) {
		var start=Number.MAX_VALUE,end=0;
		var text=[];
		for (var i=0;i<ranges.length;i++) {
			var r=ranges[i];

			for (var j=r[0];j<r[0]+r[1];j++) {
				if (!text[j]) text[j]=r[2][j-r[0]]||"";
			}
			if (r[0]<start) start=r[0];
			if (r[0]+r[1]>end) end=r[0]+r[1];
		}
		var t="";
		for (var i=start;i<end;i++) t+=text[i];
		return [start,end-start,t];
	}

	var find=function(start,length) {
		for (var i=0;i<_ranges.length;i++) {
			var r=_ranges[i];
			if (r[0]===start && r[1]===length)return i;
		}
		return -1;
	}
	var add=function(start,len,text) {
		var text=text||"";

		var same=find(start,len);
		if (same>-1) {
			_ranges.splice(same,1);
			return ;
		}
		
		var overlap=removeOverlap(start,len);

		if (overlap.length) {
			overlap.push([start,len,text]);
			var combined=combine(overlap);
			_ranges.push( combined );
		} else {
			_ranges.push([start,len,text]);	
		}
		_ranges.sort(function(s1,s2){ //sort by start and len
			return (s1[0]==s2[0])?(s1[1]-s2[1]):(s1[0]-s2[0]);
		});
	}
	var get=function() {
		return _ranges;
	}
	var remove=function() {
		_ranges=[];
	}
	var set=function(ranges) {
		remove();
		for (var i=0;i<ranges.length;i++) {
			var r=ranges[i];
			add(r[0],r[1],r[2]);
		}
	}
	textrange.add=add;
	textrange.get=get;
	textrange.remove=remove;
	textrange.set=set;
	textrange.find=find;

	return textrange;
}
var markupInRange=function(markups,ranges) {
	if (!ranges || !ranges.length) return [];
	if (typeof ranges[0]==="number") ranges=[ranges];
	if (ranges.length==0) return [];
	var out=[];
	for (var j=0;j<markups.length;j++) {
		var m=markups[j];
		for (var i=0;i<ranges.length;i++) {
			var r=ranges[i];
			if (m.s>=r[0] && m.s+m.l<=r[0]+r[1] && out.indexOf(m)===-1) {
				out.push(m);
			}
		};
	};
	return out;
}
module.exports={create:create, markupInRange:markupInRange };