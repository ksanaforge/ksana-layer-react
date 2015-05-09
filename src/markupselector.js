try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;
var IL=require("./typedef/interline");
var handlerStyle={borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:2
			,borderRadius:"20%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};
var handlerStyle_hover=update(handlerStyle,{$merge:{borderColor:"brown"}});

var MarkupSelector=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		markups:PT.object.isRequired
		,context:PT.object.isRequired
	}
	,onClick:function(e) {
		var mid=e.target.dataset.mid;
		var act=this.props.activated?"deactivate":"activate_edit";
		this.props.context.action(act,mid);
	}
	,renderHandlers:function() {
		var out=[];
		for (var mid in this.props.markups) {
			var m=this.props.markups[mid];
			var hovering=this.props.context.hovering===mid;
			var style=hovering?handlerStyle_hover:handlerStyle;
			out.push(E("span",{"data-mid":mid,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,
			onClick:this.onClick, key:mid,style:style},m.author));
		}
		return out;
	}
	,onMouseEnter:function(e) {
		clearTimeout(this.leavetimer);
		var mid=e.target.dataset.mid;
		this.props.context.action("enter",mid);
	}
	,onMouseLeave:function() {
		var action=this.props.context.action;
		action("leave");//have to leave immediately as parent might be destroyed
	}
	,renderHandler:function() {
		if (this.props.markups[this.props.context.hovering]) {
			return E("span",{},this.renderHandlers());
		} else {
			var mid=Object.keys(this.props.markups)[0];
			var markupcount=Object.keys(this.props.markups).length;
			return E("span",{"data-mid":mid,
				style:handlerStyle,onMouseEnter:this.onMouseEnter
				,onMouseLeave:this.onMouseLeave},"+"+markupcount);
		}
		
	}
	,render:function() {
		return E(IL.Container,{},
				 E(IL.Super, {},this.renderHandler() )
			);
	}
});
module.exports=MarkupSelector;