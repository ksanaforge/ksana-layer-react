try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var user=require("./user");
var MultipleInterline=require("./multiple");
var RevisionInterline=require("./revision");
var styles=require("./styles");
var Note=require("./note");

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
		clearTimeout(this.leavetimer);
		this.props.action("enter",this.props.markup.s,this.props.idx);
	}
	,mouseleave:function(){
		var that=this;
		clearTimeout(this.leavetimer);
		this.leavetimer=setTimeout(function(){
			that.leaveHover();
		},500);			
	}
	,leaveHover:function() {
		this.props.action("leave",this.props.markup);
	}
	,render:function(){
		var author=this.props.markup.author;
		if (!this.props.selected) {
			author=author.substr(0,1).toUpperCase();
		}
		return E("span",{style:{position:"relative"},onMouseEnter:this.mouseenter,onMouseLeave:this.mouseleave},
			E("div",{style:{position:"absolute",left:0,top:styles.handlerTop},
				onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			,E(Note,{note:this.props.markup.note,show:this.props.selected})
			,E("span",{
				onClick:this.onClick,style:styles.singleStyle(this.props.markup.state,this.props.selected)},author)));
	}
});

module.exports={Single:SingleInterline,Multiple:MultipleInterline,Editing:RevisionInterline};