/*
	InterlineView
	filter markups and create tags and pass to selectableview

	markups : data from firebase,
	          interline editor mutate markups and write back to database.

	tags: with before/after component and className, ready for render
		    tags are generated on-the-fly , no need to save.

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
var markup2tag=require("./markup2tag");

var InterlineView=React.createClass({
	mixins:[PureRenderMixin]
	,getInitialState:function() {
		return {tags:[],editing:-1,hovering:-1};
	}
	,markup2tag:function() {
		var status={editing:this.state.editing,hovering:this.state.hovering};
		this.setState({tags:markup2tag(this.props.markups,status)});
	}
	,componentWillMount:function() {
		this.markup2tag();
	}
	,componentWillReceiveProps:function(nextprops) {
		this.markup2tag();
	}
	,propTypes:function() {
		markups:PT.object  //markup from firebase ,
		context:PT.object  //pass to interline
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