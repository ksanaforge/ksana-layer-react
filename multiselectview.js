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
var MultiSelectView=React.createClass({
	getInitialState:function() {
		return {markups:this.props.markups||[]}
	}
	,propTypes:{
		text:PT.string.isRequired
		,markups:PT.array
		,onSelect:PT.func
		,markupStyles:PT.object
	}
	,onSelect:function(start,len,thechar,modifier) {
		console.log(modifier);
		this.props.onSelect&& this.props.onSelect(start,len,thechar,modifier);
	}
	,render:function() {
		return E(BaseView,{text:this.props.text,markups:this.state.markups,
			onSelect:this.onSelect,makurpStyles:this.props.markupStyles},this.props.children);
	}
});

module.exports=MultiSelectView;