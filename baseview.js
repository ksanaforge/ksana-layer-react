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
		return {span:defaultSpan,div:React.View||"div",markups:[]};
	}
	,componentWillMount:function() {
		this.spreaded=spreadMarkup(this.props.markups);
	}
	,componentWillReceiveProps:function(nextProps) {
		this.spreaded=spreadMarkup(nextProps.markups);	
	}
	,propTypes:{
		text:PT.string.isRequired
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
		out=out.concat(mid.map(function(m){return markups[m][2].before||null}));
		out.push(E(this.props.span
				,{markupStyles:this.props.markupStyles,key:out.length,markups:this.props.markups,mid:mid,start:textstart}
				,textnow ));
		out=out.concat(mid.map(function(m){return markups[m][2].after||null}));
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
			previous=this.spreaded[i]?JSON.parse(JSON.stringify(this.spreaded[i])):[]; 
			if (i>this.spreaded.length) break;
			textnow += this.props.text[i];
		}
		textnow=this.props.text.substr(textstart) ;
		textnow&& (out=this.renderSpan(out,textstart,textnow,previous));
		return out;
	}
	,getPos:function(node,off){
	    var sel=window.getSelection(), pos=0, thechar='';
	    if (off>=node.length) {
	    	if (node.parentNode.nextSibling) {
			    pos=parseInt(node.parentNode.nextSibling.dataset['start']);
		    	thechar=node.parentNode.nextSibling.innerText[0];
	    	} else { //at end of span
	    		thechar=node.parentNode.innerText[off-1];
	    		pos=parseInt(node.parentNode.dataset['start'])+off;
	    	}
	    } else {
		    thechar=node.data[off];
		    pos=parseInt(node.parentNode.dataset['start'])+off;
	    }
	    return {thechar:thechar,pos:pos};
	}
	,componentDidMount:function() {
		if (this.props.showCaret) {
			this.getDOMNode().contentEditable=true;
		}
	}
	,mouseUp:function(e) {
	    var sel=window.getSelection();
	    if (!sel.baseNode) return;
	    var off=this.getPos(sel.baseNode,sel.baseOffset);
	    var off2=this.getPos(sel.extentNode,sel.extentOffset);
	    this.props.onSelect && this.props.onSelect(off.pos,off2.pos-off.pos,off.thechar,{ctrlKey:e.ctrlKey,shiftKey:e.shiftKey});
  	}
	,render:function(){
		return E("this.props.div",
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