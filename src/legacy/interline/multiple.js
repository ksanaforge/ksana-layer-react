/**
	Multiple markups in same text position
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var E=React.createElement;
var PT=React.PropTypes;

var styles=require("./styles");
var user=require("./user");

var MultipleInterline=React.createClass({
	displayName:"MultipleInterline"
	,mixins:[PureRenderMixin]
	,getInitialState:function() {
		return {extend:false,selected:-1};
	}

	,propTypes:{
		markups:PT.array.isRequired
	}
	,mousemove:function(e) {
		var idx=e.target.dataset.idx;
		if (!idx) return;
		idx=parseInt(idx);
		var start=parseInt(e.target.dataset.offset);//cannot use dataset.start, it is only for base text
		if (this.state.selected===idx-1) return;
		this.setState({selected:idx-1});
		this.props.action("enter",start,idx-1);
	}
	,onClick:function(e) {
		var idx=parseInt(e.target.dataset.idx)-1;
		var markup=this.props.markups[idx];
		if (markup.author==user.getName() && !markup.state ) {
			this.props.action("edit",this.props.markups[0].s,idx);
		} else {
			this.props.action("toggle",markup);
			this.leaveChoice();
		}
	}
	,mouseenter:function() {
		clearTimeout(this.leavetimer);
		this.props.action("enter",this.props.markups[0].s,0);
		this.setState({extend:true,idx:0});
	}
	,leaveChoice:function() {
		this.setState({extend:false,selected:-1});
		this.props.action("leave");
	}
	,mouseleave:function() {
		var that=this;
		clearTimeout(this.leavetimer);
		this.leavetimer=setTimeout(function(){
			that.leaveChoice();
		},500);
	}
	,sameWithActivated:function(m,activated){
		return (m.s===activated.s && m.l===activated.l && m.t===activated.t);
	}
	,renderChoice:function() {
		var that=this;
		var activated=this.getActive();
		return E("span",{onMouseLeave:this.mouseleave,onMouseEnter:this.mouseenter},
			this.props.markups.map(function(m,idx){
				var state="";
				var activate=m.state || (activated&&that.sameWithActivated(m,activated));
				return E("span",{onClick:that.onClick,style:styles.singleStyle(activate,idx==that.state.selected),
					onMouseMove:that.mousemove,
					key:idx,"data-offset":m.s,"data-idx":idx+1},m.author)	
			})
		);
	}
	,renderNote:function() {
		var m=this.props.markups[this.state.selected];
		if (m && m.note) {
			return E("span",{style:{position:"absolute",top:"-1.2em"}},m.note);
		}
	}
	,getActive:function() {
		for (var i=0;i<this.props.markups.length;i++) {
			var m=this.props.markups[i];
			if (m.state) return m;
		}
		return null;
	}
	,renderBody:function() {
		var m=this.getActive();
		var caption="+"+this.props.markups.length;
		if (m) caption=m.author.substr(0,1).toUpperCase();
		
		return this.state.extend?this.renderChoice()
				:E("span",{onMouseEnter:this.mouseenter,onClick:this.clickMe,style:styles.multiStyle(m)},caption);
	}
	,render:function(){
		return E("span",{style:{position:"relative"}},
			this.renderNote()
			,E("div",{style:{position:"absolute",left:0,top:styles.handlerTop},onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			,this.renderBody()));
	}
});

module.exports=MultipleInterline;