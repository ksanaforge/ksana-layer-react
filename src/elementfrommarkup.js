var React=require("react/addons");
var E=React.createElement;
var inputStyle={background:"black",color:"white","border": "1px solid #BBBBBB","borderRadius":"5px","outline":0};

var SimpleInterline=require("./interline").Single;
var MultipleInterline=require("./interline").Multiple;
var EditInterline=require("./interline").Editing;
var markuputil=require("./markuputil");


var getActive=function(markups) {
	for (var i=0;i<markups.length;i++) {
		if (markups[i][2].state) return i;
	}
	return 0;
}
var createMultiMarkupHandle=function(markups,action,selected) {
	return E(MultipleInterline,{action:action,markups:markups,selected:selected});
}
var createMarkupHandle=function(markups,n,action,selected,editmode) {
	var m=markups[n];
	if (editmode) {
		return E(EditInterline,{idx:n,action:action,markup:m});
	}
	else if (markups.length>1) return createMultiMarkupHandle(markups,action,selected);
	return E(SimpleInterline,{idx:n,action:action,markup:m,selected:selected});
}
var createInsertText=function(markups,n,selected) {
	var m=markups[n];
	if (selected) {
		return E("span",{style:{textDecoration:"underline"}},m[2].t);
	} else if (m[2].state==1) {
		return E("span",{},m[2].t);
	}
}
var createPayload=function(i,markups,n,action,selected,editmode) {
	var m=markups[n];
	var handle=createMarkupHandle(markups,n,action,selected,editmode);

	var payload=JSON.parse(JSON.stringify(m[2]));
	var insertText=createInsertText(markups,n,selected);

	if (editmode) {
		payload.type="revisionEditing";
		insertText=null;
	}
	else if (selected) payload.type="revisionSelected";
	else if (payload.state==1) payload.type="revisionActivated";

	if (!m[1]) payload.type=""; 

	payload.before=E("span",{key:i},handle,insertText);
	return payload;
}
var elementFromMarkup=function(markups,action,seloffset,selidx,editing) {
	var grouped=markuputil.groupByOffset(markups),out=[];
	for (var i=0;i<grouped.length;i++) {
		var markups=grouped[i],selected=false;
		var n=getActive(markups);
		var editmode=false;
		if (markups[0][0]===seloffset) {
			n=selidx;
			selected=true;
			editmode=editing;
		}
		var m=markups[n];
		var payload=createPayload(i,markups,n,action,selected,editmode);
		out.push([m[0],m[1], payload] );
    };
	return out;
}

module.exports=elementFromMarkup;