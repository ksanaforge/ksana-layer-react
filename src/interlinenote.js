var React=require("react/addons");
var E=React.createElement;
var PT=React.PropTypes;
var interlinestyle=require("./interlinestyle");
var InterlineNote=React.createClass({
	getDefaultProps:function() {
		return {show:true};
	}
	,propTypes:{
		note:React.PropTypes.string.isRequired
	}
	,render :function() {
		if (this.props.show) {
			return E("span",{style:{position:"absolute",left:0,top:interlinestyle.noteTop}},this.props.note);
		} else return E("span") ;
	}
});
module.exports=InterlineNote;