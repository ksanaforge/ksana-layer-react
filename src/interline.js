try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}

var underStyle=function(state) {
	var style={borderStyle:"dotted",borderColor:"silver",fontSize:"50%",color:"yellow",borderWidth:1
			,borderRadius:"50%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};
	if (state==="selected") {
		style.borderStyle="solid";
		style.borderWidth=1.5;

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
	,mixins:[PureRenderMixin]
	,onClick:function() {

	}
	,render:function(){
		return E("span",{style:{position:"relative"}},
			E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			,E("span",{onClick:this.clickMe,style:underStyle()},this.props.caption)));
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