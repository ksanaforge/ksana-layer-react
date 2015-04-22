try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var user=require("./user");
var RevisionEdit=require("./revisionedit");
var MultipleInterline=require("./multiinterline");
var EditInterline=require("./editinterline");
var interlinestyle=require("./interlinestyle");

var E=React.createElement;
var PT=React.PropTypes;
var SingleInterline=React.createClass({
	displayName:"SingleInterline"
	,onClick:function() {
		if (this.props.markup[2].author==user.getName()) {
			this.props.action("edit",this.props.markup[0],this.props.idx);
		} else {
			this.props.action("toggle",this.props.markup);		
		}
	}
	,mouseenter:function() {
		this.props.action("enter",this.props.markup[0],this.props.idx);
	}
	,mouseleave:function() {
		this.props.action("leave");
	}
	,render:function(){
		var author=this.props.markup[2].author;
		if (!this.props.selected) {
			author=author.substr(0,1).toUpperCase();
		}
		return E("span",{style:{position:"relative"}},
			E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			,E("span",{onMouseEnter:this.mouseenter,onMouseLeave:this.mouseleave,
				onClick:this.onClick,style:interlinestyle.singleStyle(this.props.markup[2].state,this.props.selected)},author)));
	}
});

module.exports={Single:SingleInterline,Multiple:MultipleInterline,Editing:EditInterline};