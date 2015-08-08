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
var keyboard_mixin=require("./keyboard_mixin");
var InterlineView=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		markups:PT.object.isRequired  //markup from firebase
		,user:PT.string
		,allowkeys:PT.array
		,onKeyPress:PT.func
	}
	,getInitialState:function() {
		var allowKeys=keyboard_mixin.arrowkeys;
		if (this.props.allowKeys && this.props.allowKeys.length) {
			allowKeys=allowKeys.concat(this.props.allowKeys);
		}
		//markupActivated : { mid: true , mid: false }; //otherwise it is not initialized
		return {tags:[],editing:null,hovering:null,markupActivated:{},allowKeys:allowKeys};
	}
	,onKeyPress:function(e) {
		var nn=e.target.nodeName;
		if (nn==="INPUT" || nn==="TEXTAREA") return;

		if (this.state.allowKeys.indexOf(e.key)>-1) {
			if (this.props.onKeyPress) this.props.onKeyPress(e);
		} else {
			e.preventDefault();
		}
	}
	,componentWillUpdate:function(nextProps,nextState) {
		this.markup2tag(nextProps,nextState);
	}
	,componentDidMount:function() {
		this.forceUpdate();
	}
	,markup2tag:function(nextProps,nextState) {
		var context={editing:nextState.editing
			,hovering:nextState.hovering
			,hoveringMarkup:this.props.markups[nextState.hovering]
			,text:nextProps.text
			,action:this.action,markupActivated:nextState.markupActivated,action:this.action
			,styles:this.props.styles};

		nextState.tags=markup2tag(nextProps.markups,context);
		nextState.markupActivated=context.markupActivated; //markup2tag might change markupActivated
	}
  ,activateMarkup:function(mid) {
  	var m=this.props.markups[mid];
  	if (!m)return;
		var markupActivated=this.deactivateOverlapMarkup(m.s,m.l);
		var activate={};
		activate[mid]=true;
		var ma=update(markupActivated,{$merge:activate});
		this.setState({editing:null,hovering:null,markupActivated:ma});
  }
  ,componentWillReceiveProps:function(nextProps) {
  	if (nextProps.editing!==this.props.editing) {
  		this.activateOrEditMarkup(nextProps.editing,nextProps);
  	}
  }
  ,activateOrEditMarkup:function(mid,props) {
  	if (!props) props=this.props;
  	if (!mid || !this.props.markups[mid]) return;
  	if (this.props.markups[mid].author===this.props.user) {
  		this.setState({editing:mid,hovering:null});
  	} else {
  		this.activateMarkup(mid);
  	}
  }
  ,deactivateMarkup:function(mid) {
		var markupActivated=this.state.markupActivated;
		var deactive={};
		deactive[mid]=false;
		var ma=update(markupActivated,{$merge:deactive});
		this.setState({editing:null,hovering:null,markupActivated:ma});
  }
  ,deactivateOverlapMarkup:function(start,len) {
		//set state to 0 for any overlap markup
		var deactive={};
		for (var mid in this.props.markups) {
			var m=this.props.markups[mid];
			if (!(start>=m.s+m.l || start+len<=m.s) ) {
				if (this.state.markupActivated[mid]) deactive[mid]=false;
		  }
			if (start===m.s && this.state.markupActivated[mid]) deactive[mid]=false;
		};
		return update(this.state.markupActivated,{$merge:deactive});
  }
  ,setMarkup:function(mid,key,value) {
  	var m=this.props.markups[mid];
  	var obj={};
  	obj[key]=value;
  	this.props.markups[mid]=update(m,{$merge:obj});
  	this.forceUpdate();
  }
	,action:function(act,p1,p2,p3) {
		if(act==="enter") {
 			this.setState({hovering:p1});
		} else if (act==="leave") {
			if (this.state.editing) {
				this.props.onDoneEdit&&this.props.onDoneEdit(this.state.editing);
			}
			this.setState({hovering:null,editing:null});
		} else if (act==="activate") {
			this.activateMarkup(p1);
		} else if (act==="deactivate") {
			this.deactivateMarkup(p1)
		} else if (act==="activate_edit") { //
			this.activateOrEditMarkup(p1);
		} else if (act==="setMarkup") {
			this.setMarkup(p1,p2,p3);
		}
	}
	,render:function(){
		var props=update(this.props,{$merge:{tags:this.state.tags,
			selectable:this.props.selectable,
			allowKeys:this.state.allowKeys,
			onFocus:this.props.onFocus,
			onBlur:this.props.onBlur,
			onKeyPress:this.onKeyPress}});
		delete props.markups;//hide markups from flattenview
		return E(SelectableView,props);
	}

});

module.exports=InterlineView;