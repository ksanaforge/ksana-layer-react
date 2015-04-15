try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var defaultSpan=require("./defaultspan");
var E=React.createElement;
var PT=React.PropTypes;
var selection=require("./selection");
//  create less span for overlap markup.
//  each span holds an array of markups id in props.mid
//  this.spreaded is the starting offset of the text snippnet in the span
//  [ array of markup at 0, array of markups at 1 ... ]
var spreadMarkup=function(markups){
	if (!markups) return [];
	var out=[];
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		var start=m[0],len=m[1];
		for (var j=start;j<start+len;j++) {
			if (!out[j]) out[j]=[];
			out[j].push(i);
		}
	}
	for (var i=0;i<out.length;i++) {
		out[i]&&out[i].sort(function(a,b){return a-b});
	}
	return out;
}

var BaseView=React.createClass({
	mixins: [PureRenderMixin]
	,displayName:"BaseView"
	,mixins:[require("./keyboard_mixin")]
	,getDefaultProps:function() {
		return {span:defaultSpan,div:React.View||"div",markups:[],sel:{}};
	}
	,componentWillMount:function() {
		this.spreaded=spreadMarkup(this.props.markups);
	}
	,componentDidUpdate:function() {
		selection.restore(this.getDOMNode(),this.state.sel);
	}
	,componentWillReceiveProps:function(nextProps) {
		this.spreaded=spreadMarkup(nextProps.markups);	
	}
	,propTypes:{
		text:PT.string.isRequired
		,index:PT.number
		,markups:PT.array
		,onSelect:PT.func
		,markupStyles:PT.object
	}
	,sameArray:function(a1,a2) {
		if (!a1 && !a2) return true;
		if (!a1 && a2) return false;
		if (a1 && !a2) return false;
		return JSON.stringify(a1)===JSON.stringify(a2);
	}
	,renderSpan:function(out,textstart,textnow,mid) {
		var markups=this.props.markups;
		out=out.concat((mid||[]).map(function(m){return markups[m][2].before||null}));
		out.push(E(this.props.span
				,{index:this.props.index,markupStyles:this.props.markupStyles,key:out.length,
				  markups:this.props.markups,mid:mid,start:textstart}
				,textnow ));
		out=out.concat((mid||[]).map(function(m){return markups[m][2].after||null}));
		return out;
	}
	,renderChildren:function() {
		var out=[], textnow="" ,textstart=0, previous=["impossible item"] ;
		for (var i=0;i<this.props.text.length;i++) {
			if (!this.sameArray(this.spreaded[i],previous)) {
				textnow&& (out=this.renderSpan(out,textstart,textnow,previous));
				textstart=i;
				textnow="";
			}
			previous=this.spreaded[i]?JSON.parse(JSON.stringify(this.spreaded[i])):null; 
			if (i>this.spreaded.length) break;
			textnow += this.props.text[i];
		}
		textnow=this.props.text.substr(textstart) ;
		textnow&& (out=this.renderSpan(out,textstart,textnow,previous));
		return out;
	}
	,componentDidMount:function() {
		if (this.props.showCaret) {
			this.getDOMNode().contentEditable=true;
		}
	}
	,markSelection:function(e){
		var sel=selection.get(e);
		this.setState({sel:sel});
		sel&&this.props.onSelect && this.props.onSelect(sel.start,sel.len,sel.thechar,{ctrlKey:e.ctrlKey,shiftKey:e.shiftKey});
	}
	,mouseUp:function(e) {
		console.log("mark")
		this.markSelection(e);
  	}
	,render:function(){
		return E("div",
			{style:{"outline": "0px solid transparent"},
			onKeyDown:this.props.onKeyDown||this.onkeydown,
			onKeyUp:this.props.onKeyUp||this.onkeyup,
			onKeyPress:this.props.onKeyPress||this.onkeypress,
			onMouseUp:this.mouseUp},
			this.renderChildren()
		);
	}
});

BaseView.spreadMarkup=spreadMarkup; //for test only
module.exports=BaseView;