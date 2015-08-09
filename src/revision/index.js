var redlinethrough=require("./redlinethrough");
var linethroughstyle={background:"url("+redlinethrough+") repeat center"};
//var linethroughstyle={textDecoration:"line-through"};
var getOldTextStyle=function(markup,mid,context) {
	var style={};
	if (context.hovering===mid) style=linethroughstyle;
	else if (context.editing===mid) style=linethroughstyle;
	else if (context.markupActivated[mid]) style={display:"none"};
	if (markup.l==0) style={};
	return style;
}
var defaultActivate=function(markup,group) {
	return Object.keys(group).length===1;
}
var getHandleCaption=function(markup) {
	return markup.username||markup.author||"anonymous";
}

//normally click on Super Handle will invoke this.props.onClickTag
var translateClick=function(mid,activated){
	 return activated?"deactivate":"activate_edit";
}
module.exports={Component:require("./revision"), getStyle:getOldTextStyle , defaultActivate:defaultActivate
,getHandleCaption:getHandleCaption,translateClick:translateClick} ;