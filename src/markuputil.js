var user=require("./user");
var groupByOffset=function(markups) {
	var i=0,lastoffset=-1,m;
	var out=[];
	var same=[];
	while(i<markups.length) {
		var m=markups[i];
		if (m[0]!==lastoffset && lastoffset>=0) {
			out.push(same);
			same=[];
		}
		same.push(m);
		lastoffset=m[0];
		i++;
	}
	if (same.length) out.push(same);
	return out;
}

var nmarkupAtPos=function(markups,offset) {
    return markups.reduce(function(prev,m){return (m[0]===offset)?prev+1:prev },0);
}
var newMarkup=function(markups,offset) {
    var n=nmarkupAtPos(markups,offset);
    var newmarkup=[offset,0,{t:'',author:user.getName()}];
    markups.splice(n,0,newmarkup);
    return n;
}

module.exports={groupByOffset:groupByOffset,nmarkupAtPos:nmarkupAtPos,newMarkup:newMarkup};