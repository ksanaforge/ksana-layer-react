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
var KeyboardMixin=require("./keyboard_mixin");
var update=React.addons.update;
var E=React.createElement;
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
	,mergeStyle:function(style) {
		this.style=style||{};
		if (!this.style.lineHeight||!this.style.outline) {
			this.style=update(this.style,{$merge:{
				outline : "0px solid transparent", lineHeight:"180%"
			}});
		}		
	}
	,componentWillMount:function() {
		this.mergeStyle(this.props.style);
	}
	,componentWillReceiveProps:function(nextProps) {
		this.mergeStyle(nextProps.style);
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
		return E(FlattenView,{
							text:this.props.text
							,tags:this.props.tags
							,styles:this.props.styles
							,onMouseUp:this.onMouseUp
							,onKeyDown:this.props.onKeyDown||this.onkeydown
							,onKeyUp:this.props.onKeyUp||this.onkeyup
							,onKeyPress:this.props.onKeyPress||this.onkeypress
							,style:this.style}
					);
	}
});
module.exports=SelectableView;