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
		,onSelectText: PT.func
		,tags:PT.array
		,selections:PT.array
		,allowKeys:PT.array
	}
	,updateSelection:function() {
		var seltags=this.tagFromSel(this.state.tags,this.ranges.get());
		this.setState({tags:seltags});		
	}
	,componentWillMount:function() {
		this.ranges=textrange.create();
		if (this.props.selections && this.props.selections.length) {
			this.ranges.set(this.props.selections);
			this.updateSelection();
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
		var seltags=nextProps.tags;
		if (this.props.selectable!=="no") {
			seltags=this.tagFromSel(seltags,this.ranges.get());	
		}
		
		this.setState({tags:seltags});
	}
	,componentDidMount:function() {
		//turn contentEditable on for caret, cannot set in render as React will give warning
		if (this.props.showCaret) this.getDOMNode().contentEditable=true;
	}
	,tagFromSel:function(tags,sels) {
		tags=tags.filter(function(m){ return m.type!=="_selected_";});
		sels.map(function(sel){
			if (sel[1]>0) tags.push({s:sel[0],l:sel[1],type:"_selected_",style:selectedTextStyle});
		});
		return tags;
	}
	,markSelection:function(start,len,selectedtext,params){
		var selectable=this.props.selectable;
		if (selectable==="no") return;
		if(this.props.onSelectText){
			var cancel=this.props.onSelectText(start,len,selectedtext,params,this.ranges.get());
			if (cancel) return;
		}

		if (params.ctrlKey&&selectable==="multiple") {
			this.ranges.add(start,len,selectedtext)	
		} else {
			this.ranges.set([[start,len,selectedtext]]);	
		}
		this.updateSelection();
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

		var cancel=sel&&this.markSelection(sel.start,sel.len,text,
			{ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,sender:this.props.id});
		if (!cancel) this.selection=sel;
	}
	,onFocus:function(e){
	}
	,onBlur:function(e){
	}	
	,render:function(){
		var props=update(this.props,{$merge:{
			onMouseUp:this.onMouseUp
			,onKeyDown:this.props.onKeyDown||this.onkeydown
			,onKeyUp:this.props.onKeyUp||this.onkeyup
			,onKeyPress:this.props.onKeyPress||this.onkeypress
			,onFocus:this.props.onFocus||this.onFocus
			,onBlur:this.props.onBlur||this.onBlur			
			,tags:this.state.tags
		}});
		
		return E(FlattenView,props);
	}
});
module.exports=SelectableView;