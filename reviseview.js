try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var E=React.createElement;
var PT=React.PropTypes;
var ReviseView=React.createClass({
	render:function() {
		return E("div",{},"x");
	}
});

module.exports=ReviseView;