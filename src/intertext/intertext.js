try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var IL=require("../interline");

var RevisionNote=require("../revision/note");
var handleStyle={
			borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:2
			,borderRadius:"20%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};

var HandleButton=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
		,mid:PT.string.isRequired
		,activated:PT.bool.isRequired
		,editable:PT.bool.isRequired
	}
	,activatedStyle: update(handleStyle,{$merge:{borderColor:"green"}})
	,getInitialState:function() {
		return {style:{}};
	}
	,onMouseLeave:function(e) {
		this.props.action("leave",this.props.mid);
	}
	,onClick:function(e) {
		this.props.action("click",this.props.mid);
	}
	,onMouseEnter:function(e) {
		this.props.action("enter",this.props.mid);
	}
	,render:function(){
		return E("span",{style:this.props.activated?this.activatedStyle:handleStyle,
			onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,onClick:this.onClick},
			this.props.children);
	}
});


var InterText=React.createClass({
	displayName:"InterText"
	,mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
		,activated:PT.bool
		,showSuper:PT.bool
		,styles:PT.object
		,isHovering:PT.bool
	}
	,renderHandle:function() {
		if (this.props.showSuper) {
			return E(HandleButton,
				{action:this.props.context.action,mid:this.props.mid
				,activated:!!this.props.activated,editable:this.props.editable||false},
				this.props.markup.caption)
		};
	}

	,getTextStyle:function() {
		var style={};
		if (this.props.isHovering) {
			style=this.props.styles[this.props.markup.className];
		}
		return style;
	}
	,render:function() {
		 return E(IL.Container,null
			,E(IL.Super, {}, this.renderHandle() )
			,E(IL.Embed, {}, this.props.markup.t)
			);
	}
});

module.exports=InterText;