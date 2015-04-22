try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var E=React.createElement;
var PT=React.PropTypes;

var interlinestyle=require("./interlinestyle");
var RevisionEdit=require("./revisionedit");
var user=require("./user");

var EditInterline=React.createClass({
	displayName:"EditInterline"
	,render:function() {
		return E("span",{style:{position:"relative"}}
			,E(RevisionEdit,{markup:this.props.markup})
			,E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			  ,E("span",{}
			  	,E("a",{style:interlinestyle.buttonStyle()},"←")
			  	,E("a",{style:interlinestyle.buttonStyle()},"→")
			  	,E("a",{},"　")
			  	,E("a",{style:interlinestyle.buttonStyle()},"\u2613")
			  )
			));

	}
});

module.exports=EditInterline;