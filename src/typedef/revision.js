try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var IL=require("./interline");
var RevisionNote=require("./revisionnote");
var RevisionEditMode=require("./revisioneditmode");
var redlinethrough=require("./redlinethrough");
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
		this.props.action("leave",this.props.mid);
	}
	,onClick:function(e) {
		var act=this.props.activated?"deactivate":"activate_edit";
		this.props.action(act,this.props.mid);
	}
	,onMouseEnter:function(e) {
		this.props.action("enter",this.props.mid);
	}
	,render:function(){
		return E("span",{style:this.props.activated?this.activatedStyle:authorButtonStyle,
			onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,onClick:this.onClick},
			this.props.children);
	}
});


var Revision=React.createClass({
	displayName:"Revision"
	,mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
		,activated:PT.bool
		,showSuper:PT.bool
	}
	,renderAuthor:function() {
		if (this.props.showSuper) {
			return E(AuthorButton,
				{action:this.props.context.action,mid:this.props.mid
				,activated:this.props.activated,editable:this.props.editable||false},
				this.props.markup.author)
		};
	}
	,renderNote:function() {
		if(this.props.hovering) {
			return E(RevisionNote,
				{editing:false,action:this.props.context.action,note:this.props.markup.note,
				 mid:this.props.mid},
				this.props.markup.note);
		};
	}
	,getNewTextStyle:function() {
		var style={display:"none"};
		if (this.props.hovering) style={borderBottom:"solid 0.1em green",display:"inline"};
		else if (this.props.activated) style={display:"inline"};
		return style;
	}
	,render:function() {
		if (this.props.context.editing===this.props.mid) {
			return E(RevisionEditMode,this.props);
		} else {
		 return E(IL.Container,{}
			,E(IL.Super, {}, this.renderAuthor() )
			,E(IL.Embed, {style:this.getNewTextStyle() }, this.props.markup.t)
			,E(IL.Sub  , {}, this.renderNote() )
			);
		}
	}
});
//var linethroughstyle={background:"url("+redlinethrough+") no-repeat center"};
var linethroughstyle={textDecoration:"line-through"};
var getOldTextStyle=function(markup,mid,context) {
	var style={};
	if (context.hovering===mid) style=linethroughstyle;
	else if (context.editing===mid) style=linethroughstyle;
	else if (context.markupActivated[mid]) style={display:"none"};
	if (markup.l==0) style={};
	return style;
}
module.exports={Component:Revision, getStyle:getOldTextStyle } ;