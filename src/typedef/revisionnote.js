try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var textareaStyle={fontSize:"100%",position:"absolute",outline:"none",borderRadius:"5px"};
var RevisionNote=React.createClass({
	displayName:"RevisionNote"
	,mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
		,mid:PT.string.isRequired
		,editing:PT.bool.isRequired
		,note:PT.string.isRequired
	}
	,onBlur:function(){
		this.props.action("leaveNote");
	}
	,getInitialState:function() {
		return {style:{fontSize:"75%"}};
	}
	,componentDidUpdate:function() {
		if (!this.props.editing) return;
		var that=this;
		setTimeout(function(){
				that.refs.note.getDOMNode().focus();
		},200);
	}
	,onClick:function() {
		this.props.action("editNote");
	}
	,render:function(){
		if (this.props.editing) {
			return E("textarea",
				{rows:5,cols:20,ref:"note",onBlur:this.onBlur,style:textareaStyle,
				defaultValue:this.props.note||""}
			);
		} else{
			return E("span",{style:this.state.style,onClick:this.onClick},this.props.children);	
		}
	}
});

module.exports=RevisionNote;