var React=require("react/addons");
var E=React.createElement;
var inputStyle={background:"black",color:"white","border": "1px solid #BBBBBB","borderRadius":"5px","outline":0};

var SimpleInterline=require("./interline").Single;
var MultipleInterline=require("./interline").Multiple;
var EditInterline=require("./interline").Editing;
var markuputil=require("./markuputil");


var getActive=function(markups) {
	for (var i=0;i<markups.length;i++) {
		if (markups[i].state) return i;
	}
	return 0;
}
var createMultiMarkupHandler=function(markups,action,selected) {
	return E(MultipleInterline,{action:action,markups:markups,selected:selected});
}
var createMarkupHandler=function(markups,n,action,selected,editmode) {
	var m=markups[n];
	if (editmode) {
		return E(EditInterline,{idx:n,action:action,markup:m});
	}
	else if (markups.length>1) return createMultiMarkupHandler(markups,action,selected);
	return E(SimpleInterline,{idx:n,action:action,markup:m,selected:selected});
}
var createInsertText=function(markups,n,selected) {
	var m=markups[n];
	if (selected) {
		return E("span",{style:{textDecoration:"underline"}},m.t);
	} else if (m.state==1) {
		return E("span",{},m.t);
	}
}
var createMarkup=function(i,markups,n,action,selected,editmode) {
	var m=markups[n];
	var handler=createMarkupHandler(markups,n,action,selected,editmode);

	var newmarkup=JSON.parse(JSON.stringify(m));
	var insertText=createInsertText(markups,n,selected);

	if (editmode) {
		newmarkup.type="revisionEditing";
		insertText=null;
	}
	else if (selected) newmarkup.type="revisionSelected";
	else if (newmarkup.state==1) newmarkup.type="revisionActivated";

	if (!m.l) newmarkup.type=""; 

	newmarkup.before=E("span",{key:i},handler,insertText);
	return newmarkup;
}
var elementFromMarkup=function(markups,action,seloffset,selidx,editing) {
	var grouped=markuputil.groupByOffset(markups),out=[];
	for (var i=0;i<grouped.length;i++) {
		var markups=grouped[i],selected=false;
		var n=getActive(markups);
		var editmode=false;
		if (markups[0].s===seloffset) {
			n=selidx;
			selected=true;
			editmode=editing;
		}
		var m=markups[n];
		if (m.type=="revision") {
			out.push( createMarkup(i,markups,n,action,selected,editmode) );	
		} else {
			out.push(m);
		}
		
    };
	return out;
}

module.exports=elementFromMarkup;