var React=require("react/addons");
var E=React.createElement;
var inputStyle={background:"black",color:"white","border": "1px solid #BBBBBB","borderRadius":"5px","outline":0};

var SimpleInterline=require("./interline").Single;
var MultipleInterline=require("./interline").Multiple;

var pickOneElement=function(markups,i,action,seloffset,selidx) {
	var next=markups[i+1];
	var m=markups[i];
	var samecount=0;
	var group=[m];
	var insertText,insertLine,payload;
	var start=m[0],len=m[1];
	markups[i][2].type="";

	var preview=function(m) {
		payload=JSON.parse(JSON.stringify(m[2]));
		payload.type="replacePreview";
		payload.dynamic=true;
		insertText=E("span",{style:{textDecoration:"overline"}},payload.t);
		start=m[0];
		len=m[1];
	}

	while (next && next[0]===m[0] ) {
		if (seloffset===m[0] && samecount===selidx) preview(markups[i]);
		i++;
		samecount++;
		group.push(next);
		next=markups[i+1];
	}
	markups[i][2].type="";
	if (samecount) {
		if (seloffset===m[0] && samecount===selidx) preview(markups[i]);
		insertLine=E(MultipleInterline,{action:action,markups:group,caption:samecount+1});
	}	
    return {insertLine:insertLine,insertText:insertText,i:i,payload:payload,start:start,len:len};
}

var elementFromMarkup=function(markups,action,seloffset,selidx) {
	var out=[],i=0,m;
	while (i<markups.length) {
		m=markups[i];
		var start=m[0],len=m[1];
    	var payload=JSON.parse(JSON.stringify(m[2]));
    	var insertstyle={},insertText;
    	var insertLine=E(SimpleInterline,{caption:payload.author});

    	if (payload.type=="replacePreview") {
    		insertText=E("span",{style:{textDecoration:"overline"}},payload.t);	
    	} else if (payload.type=="replaceEdit") {
    		insertText=E("input",{style:inputStyle,size:m[1]+1,defaultValue:payload.t},"");
    	} else if (payload.type=="replaceActive") {
    		insertText=E("span",{},payload.t);	
    	} else {
    		var res=pickOneElement(markups,i,action,seloffset,selidx);
    		res.insertText&&(insertText=res.insertText);
    		res.insertLine&&(insertLine=res.insertLine);
    		res.payload&&(payload=res.payload);
    		start=res.start;
    		len=res.len;
    		i=res.i;
    	}
    	payload.before=E("span",{key:i},insertLine,insertText);
    	out.push([start,len,payload]);
    	i++;
    };
	return out;
}
module.exports=elementFromMarkup;