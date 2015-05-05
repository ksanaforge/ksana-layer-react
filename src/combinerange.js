/**
	Combining multiple range
*/
var create=function() {
	var multirange={};
	var _ranges=[];

	var removeOverlap=function(ranges,start,len) {
		var overlap=[];
		ranges=ranges.filter(function(r){
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
			for (var j=sel[0];j<r[0]+r[1];j++) {
				if (!text[j]) text[j]=r[2][j-r[0]];
			}
			if (r[0]<start) start=r[0];
			if (r[0]+r[1]>end) end=r[0]+r[1];
		}
		var t="";
		for (var i=start;i<end;i++) t+=text[i];
		return [start,end-start,t];
	}
	var add=function(start,len,text) {
		var overlap=removeOverlap(_ranges,start,len);
		if (overlap.length) {
			overlap.push([start,len,text]);
			_ranges.push( combine(overlap) );
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
	multirange.add=add;
	multirange.get=get;
	multirange.remove=remove;
	multirange.set=set;

	return multirange;
}
module.exports={create:create}