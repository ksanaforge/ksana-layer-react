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
	,adjustLen:function(direction) {
		this.props.action("movecaret",this.props.markup,direction);
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
	,caretprev:function() {
		this.adjustLen(-1);
	}
	,caretnext:function() {
		this.adjustLen(1);
	}
	,render:function() {
		var text=this.props.markup.t;
		var size=text.length;
		if (size==0) size=1;

		return E("span",{style:{position:"relative"}}
			,E("input",{ref:"input",onKeyPress:this.onKeyPress,onFocus:this.onFocus,onBlur:this.onblur,
						defaultValue:text,size:size,style:inputStyle})
			

			//,E("div",{style:{position:"absolute",left:0,top:"-1.2em"}}
			//	,E("span",{},"abc")
			//  )

			,E("div",{style:{position:"absolute",left:0,top:"0.6em"},onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			  ,E("span",{}
			  	,E("a",{onClick:this.caretprev,style:interlinestyle.buttonStyle()},"←")
			  	,E("a",{onClick:this.caretnext,style:interlinestyle.buttonStyle()},"→")
			  )
		));

	}
});

module.exports=EditInterline;