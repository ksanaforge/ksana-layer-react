var React=require("react");
var E=React.createElement;
var typedef=require("./typedef");
var markuputil=require("./markuputil");
var MarkupSelector=require("./markupselector");

/**
	put no conflict markup in object markupActivated
*/
var defaultActiveMarkups=function(gbo,markupActivated) {
	for (var start in gbo){
		for (var mid in gbo[start]){
			if (typeof markupActivated[mid]==="undefined") {
				var m=gbo[start][mid], T=typedef[m.type];
				if (T.defaultActivate) {
					markupActivated[mid]=T.defaultActivate(m,gbo[start]);
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
var markup2tag=function(allmarkups,context) {
	var gbo=markuputil.groupByOffset(allmarkups);
	defaultActiveMarkups(gbo,context.markupActivated);
	var out=[];
	var createTag=function(markups,mid,showSuper) {
			var m=markups[mid], cls=cls||m.type;
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
		var start=parseInt(i), markups=gbo[i];
		var hovering=markups[context.hovering]?context.hovering:null; //this group has hovering markup
		var editing=markups[context.editing]?context.editing:null;    //this group has editing markup
		var markupcount=Object.keys(markups).length;
		var showSuper=true, grouphovering=false;
		if (context.hovering && !hovering) {
			grouphovering=inSameGroup(allmarkups[context.hovering].group,markups);	
		}
		
		if (!grouphovering&&!context.editing && markupcount>1 && allDisabled(markups,context.markupActivated )) {
			showSuper=false;
			out.push(createMarkupSelector(start,context,markups));
		}
		if (editing||hovering||grouphovering) {
			out.push(createTag(markups,editing||hovering||grouphovering,showSuper));
		} else {
			for (var mid in markups) {
				out.push(createTag(markups,mid, showSuper && (context.markupActivated[mid]||markupcount===1)));
			}
		}
	}
	
	return out;
}


module.exports=markup2tag;