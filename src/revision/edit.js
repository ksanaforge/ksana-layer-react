try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;
var containerStyle={
	borderBottom:"solid 0.1em green"
}
var inputStyle={
	  backgroundColor: "transparent",
//		textDecoration: "underline",
    outline:0,
    border:0,
    fontSize:"100%",
    fontFamily:"inherit",
    color: "inherit"
}
var RevisionEdit=React.createClass({
	displayName:"RevisionEdit"
	,mixins:[PureRenderMixin]
	,propTypes:{
		editing:PT.bool.isRequired
		,action:PT.func.isRequired
	}
	,setCaret:function() {
		var that=this;
		setTimeout(function(){
			if (!that.refs.input) return;//input destroyed
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
			this.props.action("setText",input.value);	
		}
	}
	,componentDidMount:function() {
		this.setCaret();
	}
	,componentDidUpdate:function() {
		if (this.props.editing) this.setCaret();
	}	
	,onFocus:function() {
		if (!this.props.editing)  return;
		clearTimeout(this.blurtimer);
	}
	,onBlur:function() {
		if (!this.props.editing)  return;
		var that=this;
		clearTimeout(this.blurtimer);
		this.blurtimer=setTimeout(function(){
			that.props.action("leave");
		},500);
	},
	render:function() {
		var size=this.props.markup.l||1;
		return E("span",{style:containerStyle},E("input",{ref:"input",size:size,style:inputStyle,
			onKeyPress:this.onKeyPress,onFocus:this.onFocus,onBlur:this.onBlur,
			defaultValue:this.props.markup.t}));
	}
});
module.exports=RevisionEdit;