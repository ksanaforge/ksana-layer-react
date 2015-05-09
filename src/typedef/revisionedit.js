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
var inputStyle={
	  backgroundColor: "transparent",
//		textDecoration: "underline",
    outline:0,
    border:0,
    fontSize:"100%",
    fontFamily:"inherit",
    color: "inherit"
}
var containerStyle={
	borderBottom:"solid 0.1em green"
}
var RevisionEdit=React.createClass({
	displayName:"RevisionEdit"
	,mixins:[PureRenderMixin]
	,setCaret:function() {
		var that=this;
		setTimeout(function(){
			var input=that.refs.input.getDOMNode();	
			input.focus();
			clearTimeout(this.blurtimer);
			var val=input.value;
			input.setSelectionRange(val.length,val.length);
		},100);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			var input=this.refs.input.getDOMNode();
			this.props.action("settext",this.props.markup,input.value);	
		}
	}
	,componentDidMount:function() {
		this.setCaret();
	}
	,componentDidUpdate:function() {
		this.setCaret();
	}	
	,onFocus:function() {
		clearTimeout(this.blurtimer);
	}
	,onBlur:function() {
		var that=this;
		clearTimeout(this.blurtimer);
		this.blurtimer=setTimeout(function(){
			that.props.context.action("leave",that.props.mid);
		},500);
	},
	render:function() {
		var size=this.props.markup.t.length;
		return E("span",{style:containerStyle},E("input",{ref:"input",size:size,style:inputStyle,
			onKeyPress:this.onKeyPress,onFocus:this.onFocus,onBlur:this.onBlur,
			defaultValue:this.props.markup.t}));
	}
})
var RevisionEditMode=React.createClass({
	displayName:"RevisionEditMode"
	,mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
	}

	,renderNote:function() {
		return E(RevisionNote,
				{action:this.props.context.action,mid:this.props.mid,activated:this.props.activated},
				this.props.markup.note);
	}
	,render:function() {
		return E(IL.Container,{}
			,E(IL.Super, {}, "edit button" )
			,E(IL.Embed, {}, E(RevisionEdit,this.props))
			,E(IL.Sub  , {}, this.renderNote() )
			);
	}
});
module.exports=RevisionEditMode;