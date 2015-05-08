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

var RevisionType=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		markup:PT.object.isRequired
		,context:PT.object.isRequired
	}
	,render:function() {
		return E("span",{},this.props.markup.t);
	}
});

module.exports=RevisionType;