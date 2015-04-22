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
var user=require("./user");
var inputStyle={
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: "0px 0px 1px 0px",
    borderColor: "gray",
    outline:0,
    fontSize:"100%",
    fontFamily:"inherit",
    color: "inherit"
 } 

var EditInterline=React.createClass({
	displayName:"EditInterline"
	,setCaret:function() {
		var that=this;
		setTimeout(function(){
			var input=that.refs.input.getDOMNode();
			input.focus();
			var val=input.value;
			input.setSelectionRange(val.length,val.length);
		},100);
	}
	,componentDidMount:function() {
		this.setCaret();
	}
	,componentDidUpdate:function() {
		var input=this.refs.input.getDOMNode();
		if (input!==document.activeElement)	this.setCaret();	
	}
	,adjustLen:function(delta) {
		var newlength=this.props.markup[1]+delta;
		if (newlength<0) newlength=0;
		this.props.action("setlength",this.props.markup,newlength);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			var input=this.refs.input.getDOMNode();
			this.props.action("settext",this.props.markup,input.value);	
		}
	}
	,onFocus:function() {
		clearTimeout(this.blurtimer);
	}
	,onblur:function() {
		var that=this;
		clearTimeout(this.blurtimer);
		this.blurtimer=setTimeout(function(){
			that.props.action("leave",that.props.markup);
		},500);
	}
	,lenm1:function() {
		this.adjustLen(-1);
	}
	,lenp1:function() {
		this.adjustLen(1);
	}
	,render:function() {
		var text=this.props.markup[2].t;
		var size=text.length;
		if (size==0) size=1;

		return E("span",{style:{position:"relative"}}
			,E("input",{ref:"input",onKeyPress:this.onKeyPress,onFocus:this.onFocus,onBlur:this.onblur,
						defaultValue:text,size:size,style:inputStyle})
			,E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			  ,E("span",{}
			  	,E("a",{onClick:this.lenm1,style:interlinestyle.buttonStyle()},"←")
			  	,E("a",{onClick:this.lenp1,style:interlinestyle.buttonStyle()},"→")
			  )
		));

	}
});

module.exports=EditInterline;