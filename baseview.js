try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}

var defaultSpan=require("./defaultspan");
var E=React.createElement;
var PT=React.PropTypes;

//  create less span for overlap markup.
//  each span holds an array of markups id in props.mid
//  props.start is the starting offset of the text snippnet in the span
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
	,getDefaultProps:function() {
		return {span:defaultSpan,div:React.View||"div",markups:[]};
	}
	,componentWillMount:function() {
		this.spreaded=spreadMarkup(this.props.markups);
	}
	,componentWillReceiveProps:function() {
		this.spreaded=spreadMarkup(this.props.markups);	
	}
	,propTypes:{
		text:PT.string.isRequired
		,markups:PT.array
		//,span:PT.oneOf([PT.func,PT.string])
		//,div:PT.oneOf([PT.func,PT.string])
		,onSelect:PT.func
		,markupStyles:PT.object
	}
	,click:function() {
		this.setState({content:"hello"});
	}
	,sameArray:function(a1,a2) {
		if (!a1 && !a2) return true;
		if (!a1 && a2) return false;
		if (a1 && !a2) return false;
		return JSON.stringify(a1)===JSON.stringify(a2);
	}
	,renderChildren:function() {
		var out=[], textnow="" ,textstart=0;
		var previous=["impossible item"] ;

		for (var i=0;i<this.props.text.length;i++) {
			if (!this.sameArray(this.spreaded[i],previous)) {
				if (textnow) {
					out.push(E(this.props.span
					,{styles:this.props.markupStyles,key:out.length,markups:this.props.markups,mid:previous,start:textstart}
					,textnow ));
					textstart=i;
				}
				textnow="";
			}
			previous=this.spreaded[i]?JSON.parse(JSON.stringify(this.spreaded[i])):null; 
			if (i>this.spreaded.length) break;
			textnow +=this.props.text[i];
		}
		textnow=this.props.text.substr(textstart) ;
		if (textnow) {
			out.push(E(this.props.span
			,{styles:this.props.markupStyles,key:out.length,markups:this.props.markups,mid:previous,start:textstart}
			, textnow));
		}
		return out;
	}
	,getPos:function(node,off){
	    var sel = window.getSelection();
	    var pos=0,thechar='';
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
	,mouseUp:function(e) {
	    var sel = window.getSelection();
	    var off=this.getPos(sel.baseNode,sel.baseOffset);
	    var off2=this.getPos(sel.extentNode,sel.extentOffset);
	    this.props.onSelect && this.props.onSelect(off.pos,off2.pos-off.pos,off.thechar);
  	}
	,render:function(){
		return E("this.props.div",{onMouseUp:this.mouseUp},this.renderChildren());
	}
});

BaseView.spreadMarkup=spreadMarkup; //for test only
module.exports=BaseView;