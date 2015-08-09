
var underlinestyle={borderBottom:"solid 0.1em green",display:"inline"};
//var linethroughstyle={textDecoration:"line-through"};
var getOldTextStyle=function(markup,mid,context) {
	var style={};
	var g=context.hoveringMarkup;
	if (g) g=g.group;
	if (context.hovering===mid || (g && g===markup.group)) {
		style=context.styles[markup.className];
	}


// else if (context.editing===mid) style=linethroughstyle;
//	else if (context.markupActivated[mid]) style={display:"none"};

	if (markup.l==0) style={};
	return style;
}
var getHandleCaption=function(markup) {
	return markup.caption;
}

module.exports={Component:require("./intertext"), getStyle:getOldTextStyle ,getHandleCaption:getHandleCaption} ;