var create=function() {
	var multiselect={};
	var selections=[];

	var removeOverlap=function(start,len) {
		var overlap=[];
		selections=selections.filter(function(sel){
			if (sel[0]>start+len || sel[0]+sel[1]<start) return true;
			else {
				overlap.push(sel);
				return false;
			}
		});
		return overlap;
	}
	var combine=function(sels) {
		var start=Number.MAX_VALUE,end=0;
		var text=[];
		for (var i=0;i<sels.length;i++) {
			var sel=sels[i];
			for (var j=sel[0];j<sel[0]+sel[1];j++) {
				if (!text[j]) text[j]=sel[2][j-sel[0]];
			}
			if (sel[0]<start) start=sel[0];
			if (sel[0]+sel[1]>end) end=sel[0]+sel[1];
		}
		var t="";
		for (var i=start;i<end;i++) t+=text[i];
		return [start,end-start,t];
	}
	var add=function(start,len,text) {
		var overlap=removeOverlap(start,len);
		if (overlap.length) {
			overlap.push([start,len,text]);
			selections.push( combine(overlap) );
		} else {
			selections.push([start,len,text]);	
		}
		selections.sort(function(s1,s2){ //sort by start and len
			return (s1[0]==s2[0])?(s1[1]-s2[1]):(s1[0]-s2[0]);
		});
	}
	var get=function() {
		return selections;
	}
	var remove=function() {
		selections=[];
	}
	var set=function(sels) {
		remove();
		for (var i=0;i<sels.length;i++) {
			add(sels[i][0],sels[i][1],sels[i][2]);
		}
	}
	multiselect.add=add;
	multiselect.get=get;
	multiselect.remove=remove;
	multiselect.set=set;

	return multiselect;
}
module.exports={create:create}