/*
	View for building intertextual link.
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var SelectableView=require("./selectableview");
var keyboard_mixin=require("./keyboard_mixin");
var styles={
	link:{borderBottom:"2px solid #0000ff"}
	,highlight:{background:"yellow"}
}

var InterlineView=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		links:PT.array
		,highlights:PT.array
		,selections:PT.array
		,user:PT.string
		,allowkeys:PT.array
		,onKeyPress:PT.func
		,onHoverLink:PT.func
	}
	,getDefaultProps:function() {
		return {links:[],highlights:[],selections:[],user:"anonymous"};
	}
	,componentWillUpdate:function(nextProps,nextState) {
		this.combinetag(nextProps,nextState);
	}
	,componentDidMount:function() {
		this.forceUpdate();
	}
	,combinetag:function(nextProps,nextState) {
		var tags=[];
		for (var i=0;i<this.props.links.length;i++) {
			var H=this.props.links[i];
			tags.push({s:H[0], l:H[1],style:styles.link, mid:"l"+i});
		}
		for (var i=0;i<this.props.highlights.length;i++) {
			var H=this.props.highlights[i];
			tags.push({s:H[0], l:H[1], style:styles.highlight, mid:"t"+i});	
		}

		nextState.tags=tags;
	}	
	,getInitialState:function() {
		var allowKeys=keyboard_mixin.arrowkeys;
		if (this.props.allowKeys && this.props.allowKeys.length) {
			allowKeys=allowKeys.concat(this.props.allowKeys);
		}
		return {tags:[],editing:null,hovering:null,markupActivated:{},allowKeys:allowKeys};
	}
	,onClick:function(e,reactid) {
		if (this.hoveringTag && this.props.onClickTag) {
			this.props.onClickTag(e,reactid,this.hoveringTag);
		}
	}
	,onLeaveTag:function(e) {
		this.hovering=null;
		this.hoveringTag=null;
		e.target.style.cursor="";
	}
	,onEnterTag:function(e,tid) {
		this.hovering=e.target;
		this.hoveringTag=this.props.links[tid];
		e.target.style.cursor="pointer";
	}
	,render:function(){
		var props=update(this.props,{$merge:{tags:this.state.tags,
			selectable:this.props.selectable,
			allowKeys:this.state.allowKeys,
			onEnterTag:this.onEnterTag,
			onLeaveTag:this.onLeaveTag,
			onFocus:this.props.onFocus,
			onBlur:this.props.onBlur,
			onClick:this.onClick,
			selections:this.props.selections,
			onKeyPress:this.onKeyPress}});
		delete props.markups;//hide markups from flattenview
		return E(SelectableView,props);
	}

});

module.exports=InterlineView;