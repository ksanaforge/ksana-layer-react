try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var user=require("./user");
var MultipleInterline=require("./multiinterline");
var EditInterline=require("./editinterline");
var interlinestyle=require("./interlinestyle");

var E=React.createElement;
var PT=React.PropTypes;
var SingleInterline=React.createClass({
	displayName:"SingleInterline"
	,onClick:function() {
		var m=this.props.markup;
		if (m.author==user.getName() && !m.state) {
			this.props.action("edit",this.props.markup.s,this.props.idx);
		} else {
			this.props.action("toggle",this.props.markup);
			this.props.action("leave",this.props.markup);
		}
	}
	,mouseenter:function() {
		this.props.action("enter",this.props.markup.s,this.props.idx);
	}
	,mouseleave:function() {
		this.props.action("leave",this.props.markup);
	}
	,render:function(){
		var author=this.props.markup.author;
		if (!this.props.selected) {
			author=author.substr(0,1).toUpperCase();
		}
		return E("span",{style:{position:"relative"}},
			E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			,E("span",{onMouseEnter:this.mouseenter,onMouseLeave:this.mouseleave,
				onClick:this.onClick,style:interlinestyle.singleStyle(this.props.markup.state,this.props.selected)},author)));
	}
});

module.exports={Single:SingleInterline,Multiple:MultipleInterline,Editing:EditInterline};