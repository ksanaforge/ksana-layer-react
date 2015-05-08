var React=require("react");
var E=React.createElement;
var typedef=require("./typedef/index");
var markuputil=require("./markuputil");
var MarkupSelector=require("./markupselector");


/**
	put no conflict markup in object markupEnabled
*/
var enableMarkups=function(gbo,markupEnabled) {
	for (var start in gbo){
		var markupcount= Object.keys(gbo[start]).length;
		for (var mid in gbo[start]){
			if (typeof markupEnabled[mid]==="undefined") {
				markupEnabled[mid]= markupcount===1? true:false;
			}
		}
	}
}

var allDisabled=function(markups,markupEnabled) {
	for (var mid in markups) {
		if (markupEnabled[mid]) return false;
	}
	return true;
}

var createMarkupSelector=function(start,context,markups) {
	var selector=E(MarkupSelector,{markups:markups,context:context,key:"selector"} );
	return {s:start,l:1,before:selector};
}


var markup2tag=function(markups,context) {
	var gbo=markuputil.groupByOffset(markups);
	enableMarkups(gbo,context.markupEnabled);
	var out=[];
	var createTag=function(mid,alone,cls) {
			var m=markups[mid], cls=cls||m.type;
			var before=E(typedef[m.type],
							{alone:alone,hovering:context.hovering==mid,markup:m,context,context,key:mid,mid:mid}
					);
			return {s:start, l:m.l, mid:mid, before: before, className:cls};
	}
	for (var i in gbo) {
		var start=parseInt(i), markups=gbo[i];

		var hovering=markups[context.hovering]?context.hovering:null; //this group has hovering markup
		var editing=markups[context.editing]?context.editing:null;    //this group has editing markup
		var alone=true;
		var markupcount=Object.keys(markups).length;
		if (markupcount>1 && allDisabled(markups,context.markupEnabled) ) {
			out.push(createMarkupSelector(start,context,markups));
			alone=false;
		}

		if (editing) {
			out.push(createTag(editing, alone,markups[editing].type==="rev"?"revEditing":markups[editing].type));
		} else if (hovering) {
			out.push(createTag(hovering, alone,markups[hovering].type==="rev"?"revHovering":markups[hovering].type));
		} else {
			for (var mid in markups) {
				if (!context.markupEnabled[mid]) continue;
				out.push(createTag(mid,alone));
			}
		}
	}
	
	return out;
}


module.exports=markup2tag;