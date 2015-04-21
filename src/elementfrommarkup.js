var React=require("react/addons");
var E=React.createElement;
var inputStyle={background:"black",color:"white","border": "1px solid #BBBBBB","borderRadius":"5px","outline":0};

var SimpleInterline=require("./interline").Single;
var MultipleInterline=require("./interline").Multiple;
//markup state  
//  1: activate   
//  2: editing    

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

var getActive=function(markups) {
	for (var i=0;i<markups.length;i++) {
		if (markups[i][2].state) return i;
	}
	return 0;
}
var createMultiMarkupHandle=function(markups,action,selected) {
	return E(MultipleInterline,{action:action,markups:markups,selected:selected});
}
var createMarkupHandle=function(markups,n,action,selected) {
	var m=markups[n];
	if (markups.length>1) return createMultiMarkupHandle(markups,action,selected);
	return E(SimpleInterline,{idx:n,action:action,markup:m,selected:selected});
}
var createInsertText=function(markups,n,selected) {
	var m=markups[n];
	if (selected) {
		return E("span",{style:{textDecoration:"overline"}},m[2].t);
	} else if (m[2].state==1) {
		return E("span",{},m[2].t);
	}
}
var createPayload=function(i,markups,n,action,selected) {
	var m=markups[n];
	var handle=createMarkupHandle(markups,n,action,selected);

	var payload=JSON.parse(JSON.stringify(m[2]));
	var insertText=createInsertText(markups,n,selected);

	if (selected) payload.type="revisionSelected";
	else if (payload.state==1) payload.type="revisionActivated";
	payload.before=E("span",{key:i},handle,insertText);
	return payload;
}
var elementFromMarkup=function(markups,action,seloffset,selidx) {
	var grouped=groupByOffset(markups),out=[];
	for (var i=0;i<grouped.length;i++) {
		var markups=grouped[i],selected=false;
		var active=getActive(markups);

		if (markups[0][0]===seloffset) {
			active=selidx;
			selected=true;
		}
		var m=markups[active];
		var payload=createPayload(i,markups,active,action,selected);
		out.push([m[0],m[1], payload] );
    };
	return out;
}

/*

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
*/
module.exports=elementFromMarkup;