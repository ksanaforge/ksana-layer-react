/*
	InterlineView
	convert markups to tags and pass to selectableview

*/

try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update;
var E=React.createElement;
var PT=React.PropTypes;

var SelectableView=require("./selectableview");

var InterlineView=React.createClass({
	mixins:[PureRenderMixin]
	,getInitialState:function() {
		return {tags:[]}
	}
	,propTypes:function() {
		markups:PT.object  //markup from firebase ,
	}
	,render:function(){
		return E(SelectableView,{
							text:this.props.text
							,tags:this.state.tags
							,style:this.props.style
							,styles:this.props.styles
							,onMouseUp:this.onMouseUp
							,onKeyDown:this.props.onKeyDown||this.onkeydown
							,onKeyUp:this.props.onKeyUp||this.onkeyup
							,onKeyPress:this.props.onKeyPress||this.onkeypress
							}
					);
	}

});

module.exports=InterlineView;