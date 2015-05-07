/*
		handle multiple selections, stop caret at valid position
		break down overlap markup

*/

try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update;
var defaultSpan=require("./defaultspan");
var E=React.createElement;
var PT=React.PropTypes;
var selection=require("./selection");
var caretPos=require("./caretpos");
//  create less span for overlap markup.
//  each span holds an array of markups id in props.mid
//  this.spreaded is the starting offset of the text snippnet in the span
//  [ array of markup at 0, array of markups at 1 ... ]
//  if len==0 same as len==1 , so that it is reachable in rendering phrase
var spreadMarkup=function(markups){
	if (!markups) return [];
	var out=[];
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		for (var j=m.s;j<m.s+m.l+1;j++) {
			if (!out[j]) out[j]=[];
			if ( (!m.l &&  m.type!=="selected") || j<m.s+m.l ) out[j].push(i);
		}
	}
	for (var i=0;i<out.length;i++) {
		out[i]&&out[i].sort(function(a,b){return a-b});
	}
	return out;
}
var KeyboardMixin=require("./keyboard_mixin");
var BaseView=React.createClass({
	mixins: [PureRenderMixin]
	,displayName:"BaseView"
	,mixins:[KeyboardMixin]
	,selection:null
	,getInitialState:function() {
		this.markupStyles=this.props.markupStyles || {};
		if (!this.markupStyles.selected) {
			this.markupStyles=update(this.markupStyles,{$merge:{selected:{"backgroundColor":"highlight",color:"black"}}});
		}

		var allowkeys=KeyboardMixin.arrowkeys;
		if (this.props.allowKeys) allowkeys=update(allowkeys,{$push:this.props.allowKeys});
		return {allowkeys:allowkeys};
	}
	,getDefaultProps:function() {
		return {span:defaultSpan,div:React.View||"div",markups:[],sel:{}};
	}
	,mergeStyle:function(){
		this.style=this.props.style||{};
		if (!this.style.lineHeight||!this.style.outline) {
			this.style=update(this.style,{$merge:{
				outline : "0px solid transparent", lineHeight:"180%"
			}});
		}
	}
	,componentWillMount:function() {
		console.log("will mount")
		this.mergeStyle();
		this.spreaded=spreadMarkup(this.props.markups)
	}
	,componentWillReceiveProps:function(nextProps) {
		console.log("will receive")
		this.mergeStyle();
		this.spreaded=spreadMarkup(nextProps.markups);
	}
	,moveCaret:function(start) {
		this.selection={start:start,len:0};
		selection.restore(this.getDOMNode(),this.selection);
	}
	,componentDidUpdate:function() {
		if (!this.selection) return;
		var sel=selection.get(this.getDOMNode());
		if (!sel || this.selection.start===sel.start)return;

		selection.restore(this.getDOMNode(),this.selection);
		//this.selection=null;
	}
	,propTypes:{
		text:PT.string.isRequired
		,index:PT.number
		,markups:PT.array
		,onSelect:PT.func
		,allowKeys:PT.array
		,markupStyles:PT.object
	}
	,sameArray:function(a1,a2) {
		if (!a1 && !a2) return true; //both are empty
		if ((!a1 && a2) || (a1 && !a2) ) return false;
		return a1.toString()===a2.toString(); //one dimensional array
	}
	,renderSpan:function(out,textstart,textnow,mid) {
		var markups=this.props.markups;
		var before=(mid||[]).map(function(m){return markups[m].before||null});
		if (before.length) out.push(E("span",{key:"before"+textstart},before));

		out.push(E(this.props.span
				,{index:this.props.index,markupStyles:this.markupStyles,key:out.length,
				  markups:this.props.markups,mid:mid,start:textstart}
				,textnow ));
		var after=(mid||[]).map(function(m){return markups[m].after||null});
		
		if (after.length) out.push(E("span",{key:"after"+textstart},after));
		return out;
	}
	,renderChildren:function() {
		var out=[], textnow="" ,textstart=0, previous=["impossible item"] ;
		var caretpos=caretPos.create(this.props.text);

		while (caretpos.get()<this.props.text.length) {
			var i=caretpos.get();
			if (!this.sameArray(this.spreaded[i],previous)) {
				textnow&& (out=this.renderSpan(out,textstart,textnow,previous));
				textstart=i;
				textnow="";
			}
			previous=(this.spreaded[i]&&this.spreaded[i].length)?JSON.parse(JSON.stringify(this.spreaded[i])):null; 
			if (i>this.spreaded.length) break;

			textnow += caretpos.nextToken();
		}
		textnow=this.props.text.substr(textstart) ;
		textnow&& (out=this.renderSpan(out,textstart,textnow,previous));
		return out;
	}
	,componentDidMount:function() {
		if (this.props.showCaret) this.getDOMNode().contentEditable=true;
	}
	,markSelection:function(e){
		if (e.target.nodeName!="SPAN") return;
		var sel=selection.get(this.getDOMNode());
		if (!sel || isNaN(sel.start))return;
		//console.log('mark',sel);
		sel.selection.empty();
		var text=this.props.text.substr(sel.start,sel.len||1);
		if (text.charCodeAt(0)>=0xD800 ) { //surrogate
			text=this.props.text.substr(sel.start,sel.len||2);
		}

		var cancel=sel&&this.props.onSelect && this.props.onSelect(sel.start,sel.len,text,{ctrlKey:e.ctrlKey,shiftKey:e.shiftKey});
		if (!cancel) this.selection=sel;
	}
	,mouseUp:function(e) {
		this.markSelection(e);
  }
	,render:function(){
		return E("div",{
			spellCheck:false,
			style:this.style,
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