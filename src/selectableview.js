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
		,onMouseUp:PT.func
		,onSpanEnter:PT.func,onSpanLeave:PT.func
	}
	,updateSelection:function(tags) {
		var seltags=this.tagFromSel(tags||this.state.tags,this.ranges.get());
		this.setState({tags:seltags});
	}
	,setSelections:function(props,tags) {
		if (props.selections && props.selections.length) {
			this.ranges.set(props.selections);
			return this.updateSelection(tags);
		}
	}
	,componentWillMount:function() {
		this.ranges=textrange.create();
		this.setSelections(this.props);
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
			this.setState({tags:seltags});
		}
		this.setSelections(nextProps,seltags);
	}
	,componentDidMount:function() {
		//turn contentEditable on for caret, cannot set in render as React will give warning
		if (this.props.showCaret) this.getDOMNode().contentEditable=true;
	}
	,tagFromSel:function(tags,sels) {
		if (!tags)return;
		tags=tags.filter(function(m){ return m.type!=="_selected_";});
		sels.map(function(sel){
			if (sel[1]>0) tags.push({s:sel[0],l:sel[1],type:"_selected_",style:selectedTextStyle});
		});
		return tags;
	}
	,markSelection:function(start,len,selectedtext,params){
		var selectable=this.props.selectable;
		if (selectable==="no") return;

		if (params.ctrlKey&&selectable==="multiple") {
			this.ranges.add(start,len,selectedtext)	
		} else {
			this.ranges.set([[start,len,selectedtext]]);	
		}

		if(this.props.onSelectText){
			var cancel=this.props.onSelectText(start,len,selectedtext,params,this.ranges.get());
			if (cancel) {
					this.ranges.remove(start,len,selectedtext);
			};
		}

		this.updateSelection(this.state.tags);
	}
	,onDoubleClick:function(e) {
		this.onMouseUp(e);
	}
	,removeBlankInselection:function(sel,text) {
		if (text.trim()==="") return;
		var s=0,c=text.charCodeAt(0);
		while (c<0x33 || (c>=0xf0b && c<=0xf0e)) {
			sel.start++;
			sel.len--;
			text=text.substr(1);
			c=text.charCodeAt(0);
		}

		var e=e=text.length-1;
		c=text.charCodeAt(text.length-1);
		while (c<0x33 || (c>=0xf0b && c<=0xf0e)) {
			sel.len--;
			text=text.substr(0,text.length-2);
			c=text.charCodeAt(text.length-1);
		}
		return text;
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
		text=this.removeBlankInselection(sel,text);
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
			,onClick:this.props.onClick
			,onSpanEnter:this.props.onSpanEnter
			,onSpanLeave:this.props.onSpanLeave
			,onKeyDown:this.props.onKeyDown||this.onkeydown
			,onKeyUp:this.props.onKeyUp||this.onkeyup
			,onKeyPress:this.props.onKeyPress||this.onkeypress
			,onDoubleClick:this.onDoubleClick
			,onFocus:this.props.onFocus||this.onFocus
			,onBlur:this.props.onBlur||this.onBlur			
			,tags:this.state.tags
		}});
		
		return E(FlattenView,props);
	}
});
module.exports=SelectableView;