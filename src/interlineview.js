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
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;


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
		var props=update(this.props,{$merge:{tags:this.state.tags}});
		return E(SelectableView,props);
	}

});

module.exports=InterlineView;