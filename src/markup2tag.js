var typedef=require("./typedef/index");
var React=require("react");
var E=React.createElement;

var markup2tag=function(markups,context) {
	var tags=[];

	for (var id in markups) {
		var m=markups[id];
		var tag={s:m.s, l:m.l, id:id, context:context, className:m.type};
		var cls=typedef[m.type];
		if (cls) {
			var ele=E(cls , {key:id,markup:m, context:context} );
			tag.before=ele;
		}
		tags.push(tag);
	}
	return tags;
}




module.exports=markup2tag;