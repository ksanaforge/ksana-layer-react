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
var multiselect=require("./multiselect");
var MultiSelectView=React.createClass({
	displayName:"MultiSelectView"
	,getInitialState:function() {
		return {markups:this.props.markups||[], selections:multiselect.create()}
	}
	,getDefaultProps:function() {
		return {markupStyles:{}};
	}
	,propTypes:{
		text:PT.string.isRequired
		,index:PT.number
		,markups:PT.array
		,onSelect:PT.func
		,markupStyles:PT.object
	}
	,onSelect:function(start,len,thechar,modifier) {
		var selections=this.state.selections;
		var markups=this.state.markups;

		markups=markups.filter(function(m){
			return m[2].type!=="selected";
		});

		modifier.ctrlKey?selections.add(start,len):selections.set(start,len);

		selections.get().map(function(sel){
			if (sel[1]>0) markups.push({s:sel[0],l:sel[1],type:"selected"});
		});

		this.setState({selections:selections,markups:markups});
		this.props.onSelect&& this.props.onSelect(start,len,thechar,modifier,selections.get());
	}
	,render:function() {
		return E(BaseView,{showCaret:this.props.showCaret,index:this.props.index,
			text:this.props.text,markups:this.state.markups,
			onSelect:this.onSelect,markupStyles:this.props.markupStyles,
			style:this.porps.style,
			},

			this.props.children);
	}
});

module.exports=MultiSelectView;