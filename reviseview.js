try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var BaseView=require("./baseview");
var keyboard_mixin=require("./keyboard_mixin");
var selection=require("./selection");
var E=React.createElement;
var PT=React.PropTypes;

var ReviseView=React.createClass({
	displayName:"RevisionView"
	,mixins:[keyboard_mixin]
	,getInitialState:function() {
		var allowkeys=keyboard_mixin.arrowkeys();
		allowkeys.push("Enter");
		return {markups:this.props.markups||[],allowkeys:allowkeys}
	}
	,addP:function() {
		var sel=selection.get();
		var markups=this.state.markups;
		markups.push([sel.start,1,{before:E("br")}]);
		this.setState({markups:markups});
		console.log("ENTER!",sel.start);
	}
	,onkeypress:function(e) {
		if (e.key=="Enter") {
			this.addP();
			e.preventDefault();
		}
	}
	,getDefaultProps:function() {
		return {markupStyles:{}};
	}
	,render:function(){
		return E(BaseView,
				{showCaret:this.props.showCaret,index:this.props.index,
					text:this.props.text,markups:this.state.markups,
					onSelect:this.onSelect,markupStyles:this.state.markupStyles,
					onKeyDown:this.onkeydown,
					onKeyPress:this.onkeypress,
				},
				this.props.children
			);

	}
});

module.exports=ReviseView;