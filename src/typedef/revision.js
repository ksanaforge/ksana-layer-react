try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var IL=require("./interline");

var authorButtonStyle={
			borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:2
			,borderRadius:"20%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};

var AuthorButton=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
		,mid:PT.string.isRequired
		,activated:PT.bool.isRequired
		,editable:PT.bool.isRequired
	}
	,activatedStyle: update(authorButtonStyle,{$merge:{borderColor:"green"}})
	,getInitialState:function() {
		return {style:{}};
	}
	,onMouseLeave:function(e) {
		clearTimeout(this.leavetimer);
		var that=this;
		this.leavetimer=setTimeout(function(){
			that.props.action("leave",that.props.mid);
		},500);
	}
	,onClick:function(e) {
		var act=this.props.activated?"deactivate":"activate_edit";
		this.props.action(act,this.props.mid);
	}
	,onMouseEnter:function(e) {
		clearTimeout(this.leavetimer);
		this.props.action("enter",this.props.mid);
	}
	,render:function(){
		return E("span",{style:this.props.activated?this.activatedStyle:authorButtonStyle,
			onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,onClick:this.onClick},
			this.props.children);
	}
});

var Note=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
		,mid:PT.string.isRequired
		,activated:PT.bool.isRequired
	}
	,getInitialState:function() {
		return {style:{fontSize:"75%"}};
	}
	,onMouseLeave:function(e) {
		clearTimeout(this.leavetimer);
		var that=this;
		this.leavetimer=setTimeout(function(){
			that.setState({style:update(that.state.style,{$merge:{color:"inherit",cursor:"default"}})});	
		},500);
	}
	,onMouseEnter:function(e) {
		clearTimeout(this.leavetimer);
		this.setState({style:update(this.state.style,{$merge:{color:"red",cursor:"pointer"}})});
	}
	,render:function(){
		return E("span",{style:this.state.style,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},
			this.props.children);
	}
});

var Revision=React.createClass({
	mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
		,activated:PT.bool
		,showSuper:PT.bool
	}
	,renderAuthor:function() {
		var action=this.props.context.action;
		return this.props.showSuper?E(AuthorButton,
			{action:action,mid:this.props.mid,activated:this.props.activated,editable:this.props.editable||false},
			this.props.markup.author)
		:null;
	}
	,renderNote:function() {
		var action=this.props.context.action;
		return this.props.hovering?E(Note,
			{action:action,mid:this.props.mid,activated:this.props.activated},
		this.props.markup.note):null;
	}
	,getNewTextStyle:function() {
		var style={display:"none"};
		if (this.props.hovering) style={textDecoration:"underline",display:"inline"};
		else if (this.props.activated) style={display:"inline"};
		return style;
	}
	,render:function() {

		return E(IL.Container,{}
			,E(IL.Super, {}, this.renderAuthor() )
			,E(IL.Embed, {style:this.getNewTextStyle() }, this.props.markup.t)
			,E(IL.Sub  , {}, this.renderNote() )
		);
	}
});

var getStyle=function(mid,context) {
	var style={};
	if (context.hovering===mid) style={"textDecoration":"line-through"};
	else if (context.editing===mid) style={"textDecoration":"line-through"};
	else if (context.markupActivated[mid]) style={"display":"none"};				
	return style;
}
module.exports={Component:Revision, getStyle:getStyle } ;