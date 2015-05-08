/*
	Select text by mouse or keyboard
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;


var KeyboardMixin=require("./keyboard_mixin");
var selection=require("./selection");
var FlattenView=require("./flattenview");

var SelectableView=React.createClass({
	mixins:[PureRenderMixin,KeyboardMixin]
	,propTypes:{
		selectable: React.PropTypes.oneOf(['no', 'single', 'multiple'])
		,showCaret:React.PropTypes.bool
		,onSelect: React.PropTypes.func
	}
	,getInitialState:function(){
		var allowkeys=KeyboardMixin.arrowkeys;
		if (this.props.allowKeys) allowkeys=update(allowkeys,{$push:this.props.allowKeys});
		return {allowkeys:allowkeys};
	}
	,getDefaultProps:function(){
		return {showCaret:true};
	}
	,componentDidMount:function() {
		//turn contentEditable on for caret, cannot set in render as React will give warning
		if (this.props.showCaret) this.getDOMNode().contentEditable=true;
	}
	,markSelection:function(e) {
		if (e.target.nodeName!="SPAN") return;
		var sel=selection.get(this.getDOMNode());
		if (!sel || isNaN(sel.start))return;
		
		this.props.onSelect && this.props.onSelect(sel);
	}
	,onMouseUp:function(e) {
		this.markSelection(e);
	}
	,render:function(){
		var props=update(this.props,{$merge:{
			onMouseUp:this.onMouseUp
			,onKeyDown:this.props.onKeyDown||this.onkeydown
			,onKeyUp:this.props.onKeyUp||this.onkeyup
			,onKeyPress:this.props.onKeyPress||this.onkeypress
		}});
		
		return E(FlattenView,props);
	}
});
module.exports=SelectableView;