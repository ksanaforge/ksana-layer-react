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
	getInitialState:function() {
		var markupStyles=JSON.parse(JSON.stringify(this.props.markupStyles||{}));
		markupStyles.selected_first={"borderTopLeftRadius":"0.35em","borderBottomLeftRadius":"0.35em"};
		markupStyles.selected={"backgroundColor":"highlight",color:"black"};
		markupStyles.selected_last={"borderTopRightRadius":"0.35em","borderBottomRightRadius":"0.35em"};
		return {markups:this.props.markups||[], selections:multiselect.create() , markupStyles:markupStyles}
	}
	,getDefaultProps:function() {
		return {markupStyles:{}};
	}
	,propTypes:{
		text:PT.string.isRequired
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
			markups.push([sel[0],sel[1],{type:"selected"}]);
		});

		this.setState({selections:selections,markups:markups});
		this.props.onSelect&& this.props.onSelect(start,len,thechar,modifier);
	}
	,render:function() {
		return E(BaseView,{text:this.props.text,markups:this.state.markups,
			onSelect:this.onSelect,markupStyles:this.state.markupStyles},this.props.children);
	}
});

module.exports=MultiSelectView;