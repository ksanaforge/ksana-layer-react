try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;


var IL=require("./interline");

var AuthorButton=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
	}
	,getInitialState:function() {
		return {style:{}};
	}
	,onMouseLeave:function(e) {
		this.props.action("leave",this.props.mid);
	}
	,onMouseEnter:function(e) {
		this.props.action("enter",this.props.mid);
	}
	,render:function(){
		return E("span",{style:this.state.style,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},
			this.props.children);
	}
});

var Note=React.createClass({
	mixins:[PureRenderMixin]
	,getInitialState:function() {
		return {style:{}};
	}
	,onMouseLeave:function(e) {
		this.setState({style:update(this.state.style,{$merge:{color:"inherit",cursor:"default"}})});
	}
	,onMouseEnter:function(e) {
		this.setState({style:update(this.state.style,{$merge:{color:"red",cursor:"pointer"}})});
	}
	,render:function(){
		return E("span",{style:this.state.style,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},
			this.props.children);
	}
});

var RevisionType=React.createClass({
	mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
	}
	,componentWillUpdate:function(nextProps) {
		this.style={display:"none"};
		if (nextProps.hovering) this.style={textDecoration:"underline",display:"inline"};
	}
	,render:function() {
		var action=this.props.context.action;
		var author=E(AuthorButton,{action:action,mid:this.props.mid},this.props.markup.author);
		var note=E(Note,{action:action,mid:this.props.mid},this.props.markup.note);

		return E(IL.Container,{},
				 E(IL.Super, {}, author)
				,E(IL.Embed, {style:this.style}, this.props.markup.t)
				,E(IL.Sub  , {}, note )
			);
	}
});

module.exports=RevisionType;