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
		//markupEnabled : { mid: true , mid: false }; //otherwise it is not initialized
		return {tags:[],editing:-1,hovering:-1,markupEnabled:{}};
	}
	,componentWillUpdate:function(nextProps,nextState) {
		this.markup2tag(nextProps,nextState);
	}
	,componentDidMount:function() {
		this.forceUpdate();
	}
	,markup2tag:function(nextProps,nextState) {
		var status={editing:nextState.editing,hovering:nextState.hovering
			,action:this.action,markupEnabled:nextState.markupEnabled,action:this.action};

		nextState.tags=markup2tag(nextProps.markups,status);
		nextState.markupEnabled=status.markupEnabled; //markup2tag might change markupEnabled
	}
	,action:function(act,p1,p2) {
		if(act=="enter") {
			console.log("entering",p1)
 			this.setState({hovering:p1})
		} else if (act=="leave") {
			this.setState({hovering:null})
		}
	}
	,propTypes:function() {
		markups:PT.object  //markup from firebase
	}
	,render:function(){
		var props=update(this.props,{$merge:{tags:this.state.tags}});
		return E(SelectableView,props);
	}

});

module.exports=InterlineView;