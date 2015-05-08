var typedef=require("./typedef/index");
var React=require("react");
var E=React.createElement;

var markup2tag=function(markups,context) {
	var tags=[];

	for (var id in markups) {
		var m=markups[id];
		var hovering=context.hovering===id;
		var editing=context.editing===id;
		var type=m.type;
		if (type=="rev") {
			if (hovering) type="revHovering";
			else if (editing) type="revEditing";
		}
		var tag={s:m.s, l:m.l, id:id, context:context, className:type};

		var cls=typedef[m.type];
		if (cls) {
			var ele=E(cls, {key:id,mid:id,markup:m, context:context, hovering:hovering, editing:editing} );
			tag.before=ele;
		}
		tags.push(tag);
	}
	return tags;
}

module.exports=markup2tag;