var React=require("react");
var E=React.createElement;
var typedef=require("./typedef");
var markuputil=require("./markuputil");
var MarkupSelector=require("./markupselector");

/**
	put no conflict markup in object markupActivated
*/
var defaultActiveMarkups=function(gbo,markupActivated,user) {
	for (var start in gbo){
		for (var mid in gbo[start]){
			if (typeof markupActivated[mid]==="undefined") {
				var m=gbo[start][mid], T=typedef[m.type];
				if (T.defaultActivate) {
					markupActivated[mid]=T.defaultActivate(m,gbo[start],user);
				}
				//markupActivated[mid]= markupcount===1? true:false;
			}
		}
	}
}

var allDisabled=function(markups,markupActivated) {
	for (var mid in markups) {
		if (markupActivated[mid]) return false;
	}
	return true;
}

var createMarkupSelector=function(start,context,markups) {
	var getHandleCaption=function(markup) {
		var T=typedef[markup.type];
		return T.getHandleCaption?T.getHandleCaption(markup):"";
	}
	var selector=E(MarkupSelector,
		{markups:markups,context:context,key:"selector",getHandleCaption:getHandleCaption} );
	return {s:start,l:0,before:selector};
}

var inSameGroup=function(group,markups){
	if (!group) return;
	for (var i in markups) {
		if (markups[i].group===group) return i;
	}
}
var markup2tag=function(markups,context) {
	var gbo=markuputil.groupByOffset(markups);
	defaultActiveMarkups(gbo,context.markupActivated,context.user);
	var out=[];
	var createTag=function(markupAtOffset,mid,showSuper) {
			var m=markupAtOffset[mid], cls=cls||m.type;
			var Component=typedef[m.type].Component;
			var getStyle=typedef[m.type].getStyle||function(){return {}};
			//console.log("style",context.hovering,getStyle(mid,context),mid)
			var before=E(Component,
							{ mid:mid,showSuper:showSuper,
								isHovering:context.hovering===mid,
								isEditing:context.editing===mid,
								markup:m,context:context,key:mid,
								activated:context.markupActivated[mid],
								styles:context.styles
							}
					);
			return {s:start, l:m.l, mid:mid, before: before, style:getStyle(m,mid,context)};
	}
	for (var i in gbo) {
		var start=parseInt(i), markupAtOffset=gbo[i];
		var hovering=markupAtOffset[context.hovering]?context.hovering:null; //this group has hovering markup
		var editing=markupAtOffset[context.editing]?context.editing:null;    //this group has editing markup
		var markupcount=Object.keys(markupAtOffset).length;
		var showSuper=true, grouphovering=false;
		if (context.hovering && !hovering) {
			grouphovering=inSameGroup(markups[context.hovering].group,markupAtOffset);	
		}
		
		if (!grouphovering&&!context.editing && markupcount>1 
			&& allDisabled(markupAtOffset,context.markupActivated )) {
			showSuper=false;
			out.push(createMarkupSelector(start,context,markupAtOffset));
		}
		if (editing||hovering||grouphovering) {
			out.push(createTag(markupAtOffset,editing||hovering||grouphovering,showSuper));
		} else {
			for (var mid in markupAtOffset) {
				out.push(createTag(markupAtOffset,mid, showSuper && (context.markupActivated[mid]||markupcount===1)));
			}
		}
	}
	
	return out;
}


module.exports=markup2tag;