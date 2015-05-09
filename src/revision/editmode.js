try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;

var IL=require("../interline");
var RevisionNote=require("./note");
var RevisionEdit=require("./edit");
var RevisionEditControl=require("./editcontrol");
var caretPos=require("../caretpos");

var RevisionEditMode=React.createClass({
	displayName:"RevisionEditMode"
	,mixins:[PureRenderMixin]
	,style:{display:"none"}
	,propTypes:{
		markup:PT.object.isRequired
		,mid:PT.string.isRequired
		,context:PT.object.isRequired
	}
	,getInitialState:function(){
		return {editNote:false};
	}
	,adjustlen:function(direction) {
		var m=this.props.markup;
		var caretpos=caretPos.create(this.props.context.text.substr(m.s));
		var newlen=direction<0?caretpos.prev(m.l):caretpos.next(m.l);
		this.action("setLength",newlen);
	}
	,action:function(act,p1) {
		if (act==="editNote") {
			console.log("editnote")
			this.setState({editNote:true});
		} else if (act==="leaveNote") {
			console.log("leavenote")
			this.setState({editNote:false});
		} else if (act==="leave") {
			if (!this.state.editNote) {
				this.props.context.action("leave",this.props.mid);
			}
		} else if (act==="setLength") {
			this.props.context.action("setMarkup",this.props.mid,"l",parseInt(p1)||0);
		} else if (act==="setText") {
			this.props.context.action("setMarkup",this.props.mid,"t",p1);
			this.props.context.action("activate",this.props.mid);
			this.props.context.action("leave",this.props.mid);
		} else if (act==="setNote") {
			this.props.context.action("setMarkup",this.props.mid,"note",p1);
		} else if (act==="adjustlen") {
			this.adjustlen(p1);
		}
	}
	,renderNote:function() {
		return E(RevisionNote,
				{note:this.props.markup.note||"…",action:this.action,editing:this.state.editNote
					,mid:this.props.mid,activated:this.props.activated},
				this.props.markup.note);
	}
	,render:function() {
		var props=update(this.props,{$merge:{
			editing:!this.state.editNote,action:this.action}
		});
		return E(IL.Container,{}
			,E(IL.Super, {}, E(RevisionEditControl,props) )
			,E(IL.Embed, {}, E(RevisionEdit,props))
			,E(IL.Sub  , {}, this.renderNote() )
			);
	}
});
module.exports=RevisionEditMode;