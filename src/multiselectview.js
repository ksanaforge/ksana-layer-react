try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var E=React.createElement;
var PT=React.PropTypes;
var BaseView=require("./baseview");
var combinerange=require("./combinerange");
var MultiSelectView=React.createClass({
	displayName:"MultiSelectView"
	,componentWillMount:function() {
		this.ranges=combinerange.create();
		if (this.props.selections && this.props.selections.length) {
			this.ranges.set(this.props.selections);
		}
	}
	,getInitialState:function() {
		return {markups:this.props.markups||[]};
	}
	,createMarkupFromSelection:function(sels) {
		var markups=this.state.markups;
		markups=markups.filter(function(m){ return m.type!=="selected";});
		sels.map(function(sel){
			if (sel[0]>0) markups.push({s:sel[0],l:sel[1],type:"selected"});
		});
		return markups;
	}
	,componentWillReceiveProps:function(nextprops) {
		this.setState({markups:this.props.markups||[]});
		if (!nextprops.selections || !nextprops.selections.length) return ;
		this.ranges.set(nextprops.selections);
		var markups=this.createMarkupFromSelection(this.ranges.get());
		this.setState({markups:markups});
	}
	,getDefaultProps:function() {
		return {markupStyles:{}};
	}
	,propTypes:{
		text:PT.string.isRequired
		,index:PT.number
		,markups:PT.array
		,onSelect:PT.func
		,selections:PT.array
		,markupStyles:PT.object
	}
	,onSelect:function(start,len,selectedtext,modifier) {
		modifier.ctrlKey?this.ranges.add(start,len,selectedtext):this.ranges.set([[start,len,selectedtext]]);
		var markups=this.createMarkupFromSelection(this.ranges.get());
		this.setState({markups:markups});
		this.props.onSelect&& this.props.onSelect(start,len,selectedtext,modifier,this.ranges.get());
	}
	,render:function() {
		return E(BaseView,{showCaret:this.props.showCaret,index:this.props.index,
			text:this.props.text,markups:this.state.markups,
			onSelect:this.onSelect,markupStyles:this.props.markupStyles,
			style:this.props.style,
			},

			this.props.children);
	}
});

module.exports=MultiSelectView;