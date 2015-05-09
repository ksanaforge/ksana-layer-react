try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;


var RevisionNote=React.createClass({
	displayName:"RevisionNote"
	,mixins:[PureRenderMixin]
	,propTypes:{
		action:PT.func.isRequired
		,mid:PT.string.isRequired
		,activated:PT.bool.isRequired
	}
	,getInitialState:function() {
		return {style:{fontSize:"75%"}};
	}
	,render:function(){
		return E("span",{style:this.state.style},this.props.children);
	}
});

module.exports=RevisionNote;