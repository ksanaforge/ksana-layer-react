try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var E=React.createElement;
var PT=React.PropTypes;


var RevisionEdit=React.createClass({
	render:function() {
		var text=this.props.markup[2].t;
		var size=text.length;
		return E("input",{defaultValue:text,size:size});
	}
})
module.exports=RevisionEdit;