try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var style={fontSize:"35%",borderStyle:"solid",borderColor:"gray",borderRadius:"25%",cursor:"pointer"};
var RevisionEditControl=React.createClass({
	displayName:"RevisionEditControl"
	,mixins:[PureRenderMixin]
	,propTypes:{
		editing:PT.bool.isRequired
		,action:PT.func.isRequired
	}
	,caretprev:function() {
		this.props.action("adjustlen",-1);
	}
	,caretnext:function() {
		this.props.action("adjustlen",1);
	}
	,render:function() {
		return (E("span",{},
				E("a",{key:"prev",onClick:this.caretprev,style:style},"←")
				,E("a",{key:"next",onClick:this.caretnext,style:style},"→")
			)
		);
	}
});

module.exports=RevisionEditControl;