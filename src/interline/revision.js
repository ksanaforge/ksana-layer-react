var React=require("react/addons");
var E=React.createElement;
var PT=React.PropTypes;

var styles=require("./styles");
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
var Note=require("./note");

var EditInterline=React.createClass({
	displayName:"EditInterline"
	,setCaret:function() {
		var that=this;
		setTimeout(function(){
			var input=that.refs.input.getDOMNode();	
			if (that.state.noteediting) {
				input=that.refs.note.getDOMNode();
			}
			
			input.focus();
			clearTimeout(this.blurtimer);
			var val=input.value;
			input.setSelectionRange(val.length,val.length);
		},100);
	}
	,getInitialState:function() {
		return {noteediting:false};
	}
	,componentDidMount:function() {
		this.setCaret();
	}
	,componentDidUpdate:function() {
		var input=this.refs.input.getDOMNode();
		if (this.state.noteediting) input=this.refs.note.getDOMNode();
		if (input!==document.activeElement)	this.setCaret();	
	}
	,adjustLen:function(direction) {
		this.props.action("movecaret",this.props.markup,direction);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter" && !this.state.noteediting) {
			var input=this.refs.input.getDOMNode();
			this.props.action("settext",this.props.markup,input.value);	
		}
	}
	,onFocus:function() {
		clearTimeout(this.blurtimer);
	}
	,onBlur:function() {
		var that=this;
		clearTimeout(this.blurtimer);
		this.blurtimer=setTimeout(function(){
			that.props.action("leave",that.props.markup);
		},500);
	}
	,onNoteBlur:function() {
		this.props.markup.note=this.refs.note.getDOMNode().value;
		this.toggleNote();
	}
	,caretprev:function() {
		this.adjustLen(-1);
	}
	,caretnext:function() {
		this.adjustLen(1);
	}
	,toggleNote:function(){
		this.setState({noteediting:!this.state.noteediting});
		if (!this.state.noteediting) {
			clearTimeout(this.blurtimer);
		}
	}
	,renderControls:function() {
		if (this.state.noteediting) {
			return E("span",{style:{position:"absolute",top:styles.noteEditTop}},
					E("textarea",
					{rows:5,cols:20,ref:"note",onBlur:this.onNoteBlur,style:styles.noteEditStyle,
					defaultValue:this.props.markup.note||""}
			));
		} else {
			return ([
			E("a",{key:"prev",onClick:this.caretprev,style:styles.buttonStyle()},"←")
			,E("a",{key:"next",onClick:this.caretnext,style:styles.buttonStyle()},"→")
			,E("a",{key:"btnnote",onClick:this.toggleNote,style:styles.buttonStyle()},"…")
			,E(Note,{key:"note",note:this.props.markup.note||""})
			]
			);
		}
	}
	,render:function() {
		var text=this.props.markup.t;
		var size=text.length;
		if (size==0) size=1;

		return E("span",{style:{position:"relative"}}
			,E("input",{ref:"input",onKeyPress:this.onKeyPress,onFocus:this.onFocus,onBlur:this.onBlur,
						defaultValue:text,size:size,style:inputStyle})
			  ,E("div",{style:{position:"absolute",left:0,top:styles.handlerTop},onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
			  ,E("span",{},	this.renderControls())
			)
		);

	}
});

module.exports=EditInterline;