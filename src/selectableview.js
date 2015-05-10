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

var selectedTextStyle={"backgroundColor":"highlight",color:"black"};

var KeyboardMixin=require("./keyboard_mixin");
var selection=require("./selection");
var FlattenView=require("./flattenview");
var textrange=require("./textrange");
var selection=require("./selection");
var SelectableView=React.createClass({
	mixins:[PureRenderMixin,KeyboardMixin]
	,propTypes:{
		selectable: PT.oneOf(['no', 'single', 'multiple'])
		,showCaret:PT.bool
		,onSelect: PT.func
		,tags:PT.array
	}
	,componentWillMount:function() {
		this.ranges=textrange.create();
		if (this.props.selections && this.props.selections.length) {
			this.ranges.set(this.props.selections);
		}
	}
	,getInitialState:function(){
		var allowkeys=KeyboardMixin.arrowkeys;
		if (this.props.allowKeys) allowkeys=update(allowkeys,{$push:this.props.allowKeys});
		return {allowkeys:allowkeys,tags:this.props.tags};
	}
	,getDefaultProps:function(){
		return {showCaret:true,selectable:"multiple",tags:[]};
	}
	,componentWillReceiveProps:function(nextProps) {
		this.setState({tags:nextProps.tags});
	}
	,componentDidMount:function() {
		//turn contentEditable on for caret, cannot set in render as React will give warning
		if (this.props.showCaret) this.getDOMNode().contentEditable=true;
	}
	,tagFromSel:function(sels) {
		var tags=this.state.tags;
		tags=tags.filter(function(m){ return m.type!=="_selected_";});
		sels.map(function(sel){
			if (sel[1]>0) tags.push({s:sel[0],l:sel[1],type:"_selected_",style:selectedTextStyle});
		});
		return tags;
	}
	,markSelection:function(start,len,selectedtext,modifier){
		var selectable=this.props.selectable;
		if (selectable==="no") return;
		if (modifier.ctrlKey&&selectable==="multiple") {
			this.ranges.add(start,len,selectedtext)	
		} else {
			this.ranges.set([[start,len,selectedtext]]);	
		}
		var seltags=this.tagFromSel(this.ranges.get());
		this.setState({tags:seltags});
		this.props.onSelect&& this.props.onSelect(start,len,selectedtext,modifier,this.ranges.get());
	}
	,onMouseUp:function(e) {
		if (e.target.nodeName!="SPAN") return;
		var sel=selection.get(this.getDOMNode());
		if (!sel || isNaN(sel.start))return;

		if (sel.len) sel.selection.empty();
		var text=this.props.text.substr(sel.start,sel.len||1);
		if (text.charCodeAt(0)>=0xD800 ) { //surrogate
			text=this.props.text.substr(sel.start,sel.len||2);
		}

		var cancel=sel&&this.markSelection(sel.start,sel.len,text,{ctrlKey:e.ctrlKey,shiftKey:e.shiftKey});
		if (!cancel) this.selection=sel;
	}
	,render:function(){
		var props=update(this.props,{$merge:{
			onMouseUp:this.onMouseUp
			,onKeyDown:this.props.onKeyDown||this.onkeydown
			,onKeyUp:this.props.onKeyUp||this.onkeyup
			,onKeyPress:this.props.onKeyPress||this.onkeypress
			,tags:this.state.tags
		}});
		
		return E(FlattenView,props);
	}
});
module.exports=SelectableView;