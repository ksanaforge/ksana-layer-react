try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}

var underStyle=function(state,selected) {
	var style={borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:1
			,borderRadius:"25%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};

	if (selected) {
		style.color="yellow";
	}
	if (state==1) {
		style.borderColor="green";
	}
	return style;
}
var multiStyle=function(nmarkup) {
	var style={borderStyle:"dotted",borderColor:"silver",fontSize:"60%",color:"red",borderWidth:1
			,borderRadius:"50%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};
	return style;	
}
var E=React.createElement;
var PT=React.PropTypes;
var SingleInterline=React.createClass({
	displayName:"SingleInterline"
	,onClick:function() {
		this.props.action("toggle",this.props.markup);
	}
	,mouseenter:function() {
		this.props.action("enter",this.props.markup[0],this.props.idx);
	}
	,mouseleave:function() {
		this.props.action("leave",this.props.markup[0],this.props.idx);
	}
	,render:function(){
		var author=this.props.markup[2].author;
		return E("span",{onMouseEnter:this.mouseenter,onMouseLeave:this.mouseleave,style:{position:"relative"}},
			E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			,E("span",{onClick:this.onClick,style:underStyle(this.props.markup[2].state,this.props.selected)},author)));
	}
});
var MultipleInterline=React.createClass({
	displayName:"MultipleInterline"
	,mixins:[PureRenderMixin]
	,getInitialState:function() {
		return {extend:false,selected:0};
	}
	,propTypes:{
		markups:React.PropTypes.array.isRequired
	}
	,mousemove:function(e) {
		var idx=e.target.dataset.idx;
		if (!idx) return;
		idx=parseInt(idx);
		var start=parseInt(e.target.dataset.start);
		if (this.state.selected===idx) return;
		this.setState({selected:idx});

		this.props.action("select",start,idx-1);
	}
	,mouseenter:function() {
		clearTimeout(this.leavetimer);
		this.setState({extend:true});
	}
	,mouseleave:function() {
		var that=this;
		clearTimeout(this.leavetimer);
		this.leavetimer=setTimeout(function(){
			that.setState({extend:false,selected:0});
			that.props.action("select",-1,-1);
		},500);
	}
	,renderChoice:function() {
		var that=this;
		return E("span",{onMouseLeave:this.mouseleave,onMouseEnter:this.mouseenter},
			this.props.markups.map(function(m,idx){
				var state="";
				if (idx+1===that.state.selected) state="selected";
				return E("span",{style:underStyle(state),onMouseMove:that.mousemove,
					key:idx,"data-start":m[0],"data-idx":idx+1},m[2].author)	
			})
		);
	}
	,renderBody:function() {
		return this.state.extend?this.renderChoice()
				:E("span",{onMouseEnter:this.mouseenter,onClick:this.clickMe,style:multiStyle(this.props.markups.length)},"+"+this.props.caption+".");
	}
	,render:function(){
		return E("span",{style:{position:"relative"}},
			E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			,this.renderBody()));
	}
});
module.exports={Single:SingleInterline,Multiple:MultipleInterline};