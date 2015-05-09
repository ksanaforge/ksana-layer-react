/**
	input : { markupid:{markup}, markupid:{markup} }
	return { offset: { markupid:{markup} , markupid:{markup}] }	
*/
var groupByOffset=function(markups) {
	var out={};
	for (var id in markups) {
		var m=markups[id];
		if (!out[m.s]) out[m.s]={};
		out[m.s][id]=m;
	}
	return out;
}

var nmarkupAtPos=function(markups,offset) {
    return markups.reduce(function(prev,m){return (m.s===offset)?prev+1:prev },0);
}

// create minimum spans for overlap markup.
// each span holds an array of markups id in props.mid
// this.spreaded is the starting offset of the text snippnet in the span
// markup other than _select_ (the build in classname for selection)
// with len==0 is same as len==1

var spreadMarkup=function(markups){
	if (!markups) return [];
	var out=[];
	for (var n in markups) {
		var m=markups[n];
		for (var j=m.s;j<m.s+m.l+1;j++) {
			if ( (!m.l && m.type!=="_selected_") || j<m.s+m.l ) {
				if (!out[j]) out[j]=[];
				out[j].push(n);
			}
		}
	}
	for (var i=0;i<out.length;i++) {
		out[i]&&out[i].sort(function(a,b){return a-b});
	}
	return out;
}

module.exports={groupByOffset:groupByOffset,nmarkupAtPos:nmarkupAtPos,
	spreadMarkup:spreadMarkup};