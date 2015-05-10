/*
	Core markup display component,
	"flatten" text, tags (with styles) to single layer.
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update, E=React.createElement, PT=React.PropTypes;


var spreadMarkup=require("./markuputil").spreadMarkup;
var caretPos=require("./caretpos");
var defaultSpan=require("./defaultspan");
var FlattenView=React.createClass({
	displayName:"FlattenView"
	,mixins:[PureRenderMixin]
	,propTypes:{
		text:React.PropTypes.string.isRequired
		,tags:PT.array
		,styles:PT.object
		,span:PT.func
		,style:PT.object
		,allowKeys:PT.array
		,onMouseUp:PT.func,onKeyDown:PT.func ,onKeyUp:PT.func	,onKeyPress:PT.func
	}
	,getDefaultProps:function() {
		return {tags:{},styles:{},span:defaultSpan};
	}
	,tagAtPos:[] // hold covering tags given a text position
	,mergeStyle:function(style) {
		this.style=style||{};
		if (!this.style.lineHeight||!this.style.outline) {
			this.style=update(this.style,{$merge:{
				outline : "0px solid transparent", lineHeight:"180%"
			}});
		}		
	}
	,componentWillMount:function() {
		this.mergeStyle();
		this.tagAtPos=spreadMarkup(this.props.tags);
	}
	,componentWillReceiveProps:function(nextProps) {
		this.mergeStyle(nextProps.style);
		this.tagAtPos=spreadMarkup(nextProps.tags);
	}
	,renderSpan:function(out,start,end,spantext,tid) {
		var before=[],after=[], tags=this.props.tags;
		(tid||[]).map(function(m){ 
			if (tags[m].before&& start===tags[m].s) { 
				before.push(tags[m].before);
			}
		});
		before.length && out.push(E(React.Text||"span",{key:"b"+start},before));

		out.push(E(this.props.span,{index:this.props.index,
					styles:this.props.styles,key:'s'+start, tags:tags,tid:tid,start:start}
				,spantext )
		);

		(tid||[]).map(function(m){ 
			if (tags[m].after && end===tags[m].s+tags[m].l) {
				after.push(tags[m].after);
			} 
		});
		
		after.length && out.push(E(React.Text||"span",{key:"a"+start},after));
		return out;
	}
	,renderChildren:function() {
		var sameArray=function(a1,a2) {
			if (!a1 && !a2) return true; //both are empty
			if ((!a1 && a2) || (a1 && !a2) ) return false;
			return a1.toString()===a2.toString(); //one dimensional array
		}
		var out=[], spantext="" ,start=0, previous=["impossible item"] ;
		var caretpos=caretPos.create(this.props.text);

		while (caretpos.get()<this.props.text.length) {
			var i=caretpos.get();
			if (!sameArray(this.tagAtPos[i],previous)) {
				spantext && (out=this.renderSpan(out,start,i,spantext,previous));
				start=i;
				spantext="";
			}
			previous=(this.tagAtPos[i]&&this.tagAtPos[i].length)?JSON.parse(JSON.stringify(this.tagAtPos[i])):null; 
			if (i>this.tagAtPos.length) break;
			spantext += caretpos.nextToken();
		}
		spantext=this.props.text.substr(start);
		spantext && (out=this.renderSpan(out,start,i,spantext,previous));
		return out;
	}
	,render:function() {
		var props=update(this.props, {$merge:{spellCheck:false, style:this.style}});
		return E(React.View||"div",props,this.renderChildren());
	}
});
module.exports=FlattenView;